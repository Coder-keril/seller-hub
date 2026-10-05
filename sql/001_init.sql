-- SellerHub MVP 스키마 (PostgreSQL 15+)
--
-- 통화는 KRW 고정. 금액은 numeric(12,2), 최종 판매가는 정수로 반올림해서 저장한다.
-- 브랜드명(SellerHub)은 스키마에 쓰지 않는다 — 리브랜딩 시 DB 는 건드리지 않기 위해.
--
-- 확장 대비로 넣은 것은 네 가지뿐이다.
--   1. 테넌트 테이블은 전부 tenant_id 를 갖고, 복합 인덱스의 맨 앞에 둔다 (훗날 파티셔닝 키)
--   2. 외부 ID 에 unique 를 걸어 폴링 중복 수집을 DB 가 막는다
--   3. job 테이블 + FOR UPDATE SKIP LOCKED — 워커를 N대로 늘릴 때 코드 변경 0
--   4. 마켓 응답 원본(raw_json)을 보관한다
-- 샤딩·리전분리·읽기복제는 지금 만들지 않는다.

create type channel as enum ('NAVER', 'COUPANG', 'ELEVENST', 'GMARKET', 'AUCTION', 'LOTTEON');

create type order_status as enum (
  'NEW', 'CONFIRMED', 'PREPARING', 'AWAITING_INVOICE',
  'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURN', 'EXCHANGE'
);

-- 마켓에 송장번호를 보낸 결과. FAILED 만 골라 재처리한다.
create type dispatch_status as enum ('PENDING', 'SENT', 'FAILED');

create type job_status as enum ('QUEUED', 'RUNNING', 'DONE', 'FAILED', 'DEAD');


-- ═══ 테넌트 / 사용자 ══════════════════════════════════════════

create table tenant (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  status      text not null default 'ACTIVE' check (status in ('ACTIVE', 'SUSPENDED')),
  created_at  timestamptz not null default now()
);

create table app_user (
  id             uuid primary key default gen_random_uuid(),
  tenant_id      uuid not null references tenant(id) on delete cascade,
  email          text not null,
  password_hash  text not null,
  name           text not null,
  role           text not null default 'OWNER' check (role in ('OWNER', 'STAFF')),
  created_at     timestamptz not null default now()
);
create unique index app_user_email_uk on app_user (lower(email));
create index app_user_tenant_ix on app_user (tenant_id);


-- ═══ 마스터 (merrycoco_web 미러, 전 테넌트 공유 — tenant_id 없음) ══
--
-- 원천은 merrycoco_web.dbo.TB_retail_products 외. 키가 (retailer, product_code) 복합이라
-- id 를 '{retailer}:{product_code}' 로 합성해 단일 컬럼 PK 로 쓴다. 동기화 때 조회가 필요 없고
-- 사람이 읽을 수 있다.
--
-- 이 테이블들은 SellerHub 에서 읽기 전용이다. 쓰기는 scripts/sync-master.mjs 만 한다.

create table master_product (
  id                 text primary key,            -- 'costco:1234567'
  retailer           text not null,
  product_code       text not null,
  name               text not null,               -- name_override 우선
  category           text,                        -- category_override 우선
  description        text,
  barcode            text,                        -- TB_shop_sku 경유. 약 26% 만 채워짐
  -- 규격은 원천에서 상품명 파싱으로 채워진 듯하고 오류가 섞여 있다. 택배박스 상품의
  -- pack_count 가 1,938,000 인 식으로 치수를 묶음 수로 잘못 읽은 행이 있다. 마켓 등록에
  -- 쓸 때는 그대로 믿지 말고 상한을 두거나 사람이 확인해야 한다.
  unit_qty           numeric(12,3),               -- 규격: 250 (g)
  unit_type          text,
  pack_count         int,                         -- 묶음 수 (이상치 있음)
  total_qty          numeric(12,3),               -- unit_qty * pack_count
  is_exposed         boolean not null default true,
  source_updated_at  timestamptz not null,        -- MSSQL UpdateDate. 증분 동기화 커서
  synced_at          timestamptz not null default now()
);
create index master_product_search_ix on master_product (retailer, category) where is_exposed;
create index master_product_barcode_ix on master_product (barcode) where barcode is not null;
create index master_product_cursor_ix on master_product (source_updated_at desc);
-- 상품명 부분검색. pg_trgm 은 실제로 느려질 때 켠다.
create index master_product_name_ix on master_product (name);

-- 정상가는 채널별로 여러 건이다 (매장가 / 온라인가). Pricing 이 어느 채널을 기준가로 쓸지 고른다.
create table master_price (
  master_id       text not null references master_product(id) on delete cascade,
  price_channel   text not null,                  -- TB_retail_price.channel
  original_price  numeric(12,2) not null,
  synced_at       timestamptz not null default now(),
  primary key (master_id, price_channel)
);

-- 이미지.
--
-- 메리코코 R2 는 **비공개 버킷**이고 공개 노출은 merrycoco-admin 프록시를 통해서만 이뤄진다.
-- 그 프록시가 내보내는 건 워터마크본이라 마켓에 올릴 수 없다. 그래서 SellerHub 는
-- 원본(original)에 배경제거를 1회 적용한 결과를 **자체 공개 버킷으로 푸시받는다**.
--
--   메리코코 R2  {retailer}/products/original/{code}/{ts}.jpg   (비공개, 원천)
--        ↓ 이지오피스에서 배경제거 1회
--   메리코코 R2  {retailer}/products/nobg/{code}/{ts}.png
--        ↓ 푸시 (R2 → R2, 전송료 0)
--   SellerHub R2 (공개)  →  public_url  →  마켓이 직접 가져간다
--
-- 배경제거는 마스터 단계에서 1회다. 판매자가 몇 명이든 같은 상품이면 한 번만 처리한다.
-- 판매자별 가공(배경교체·마켓별 리사이즈)은 이 PNG 에서 출발한다.
--
-- 상품 14,750건 중 이미지 보유는 약 3,470건 — 판매 가능 재고의 실질 상한이다.
-- traders 는 업로드 외 이미지 원천이 없어 사실상 costco 상품만 해당된다.
create table master_image (
  master_id          text not null references master_product(id) on delete cascade,
  filename           text not null,              -- 원천 그대로: '{code}/{ts}.{ext}'
  content_type       text,
  is_representative  boolean not null default false,
  captured_at        timestamptz,
  public_url         text,                       -- 배경제거본의 SellerHub 공개 URL
  bg_removed_at      timestamptz,                -- null 이면 아직 배경제거 전 = 판매 불가
  bg_attempts        int not null default 0,     -- 3회 실패하면 큐에서 뺀다
  synced_at          timestamptz not null default now(),
  primary key (master_id, filename)
);
create index master_image_rep_ix on master_image (master_id) where is_representative;
-- 배경제거 대기 목록. 대표 이미지를 먼저 처리해야 판매 시작이 빨라진다.
create index master_image_pending_ix on master_image (is_representative desc, synced_at)
  where bg_removed_at is null and bg_attempts < 3;


-- ═══ 판매채널 계정 ════════════════════════════════════════════
-- CHANNEL / CHANNEL_ACCOUNT / CHANNEL_CREDENTIAL 을 한 테이블로 합쳤다.
-- 채널은 enum, 인증정보는 암호화된 JSON 한 덩어리 (마켓마다 필요한 키가 달라 컬럼화가 무의미).

create table channel_account (
  id                  uuid primary key default gen_random_uuid(),
  tenant_id           uuid not null references tenant(id) on delete cascade,
  channel             channel not null,
  alias               text not null,               -- 화면 표시용 계정 별칭
  credential_enc      bytea not null,              -- 암호화된 JSON: api key, secret, vendor_id, token ...
  status              text not null default 'ACTIVE' check (status in ('ACTIVE', 'ERROR', 'DISABLED')),
  last_error          text,
  order_cursor        timestamptz,                 -- 주문 폴링 커서
  inquiry_cursor      timestamptz,                 -- 문의 폴링 커서
  polled_at           timestamptz,                 -- 마지막 폴링 시각 (SKIP LOCKED 대상 선별용)
  created_at          timestamptz not null default now()
);
create unique index channel_account_uk on channel_account (tenant_id, channel, alias);
-- 폴링 워커가 "오래 안 본 활성 계정"을 집어가는 인덱스
create index channel_account_poll_ix on channel_account (polled_at nulls first) where status = 'ACTIVE';


-- ═══ 판매자가 가져온 상품 ══════════════════════════════════════

create table tenant_product (
  id             uuid primary key default gen_random_uuid(),
  tenant_id      uuid not null references tenant(id) on delete cascade,
  master_id      text not null references master_product(id),
  name_override  text,                             -- 판매자가 고친 상품명. null 이면 master 사용
  memo           text,
  created_at     timestamptz not null default now()
);
create unique index tenant_product_uk on tenant_product (tenant_id, master_id);


-- ═══ 채널별 실제 등록 상품 ═════════════════════════════════════

create table channel_product (
  id                   uuid primary key default gen_random_uuid(),
  tenant_id            uuid not null references tenant(id) on delete cascade,
  tenant_product_id    uuid not null references tenant_product(id) on delete cascade,
  channel_account_id   uuid not null references channel_account(id) on delete cascade,
  channel              channel not null,
  external_product_id  text,                       -- 마켓이 발급한 상품번호. 등록 전에는 null
  channel_category_id  text,
  sale_price           numeric(12,2) not null,
  stock                int not null default 0,
  status               text not null default 'DRAFT'
                       check (status in ('DRAFT', 'REGISTERED', 'STOPPED', 'ERROR')),
  last_error           text,
  registered_at        timestamptz,
  last_synced_at       timestamptz,
  raw_json             jsonb,
  created_at           timestamptz not null default now()
);
create unique index channel_product_external_uk
  on channel_product (channel_account_id, external_product_id)
  where external_product_id is not null;
create index channel_product_tenant_ix on channel_product (tenant_id, channel, status);


-- ═══ 가격정책 / 수수료 ═════════════════════════════════════════

create table price_policy (
  tenant_id       uuid primary key references tenant(id) on delete cascade,
  base_channel    text not null default 'store'
                  check (base_channel in ('store', 'online')),  -- master_price 중 정상가로 쓸 채널
  mode            text not null default 'MARGIN'
                  check (mode in ('MARGIN', 'MARKUP', 'FIXED_PROFIT')),
  target_rate     numeric(6,4) not null default 0.15,   -- MARGIN=판매가 대비, MARKUP=정상가 대비
  target_profit   numeric(12,2) not null default 0,     -- FIXED_PROFIT 일 때 건당 목표 순이익
  shipping_cost   numeric(12,2) not null default 3000,
  extra_cost      numeric(12,2) not null default 0,     -- 쿠폰·할인·광고 등
  round_to        int not null default 100,             -- 판매가 올림 단위(원)
  updated_at      timestamptz not null default now()
);

-- category 가 null 이면 해당 채널의 기본 수수료.
create table channel_fee (
  tenant_id   uuid not null references tenant(id) on delete cascade,
  channel     channel not null,
  category    text not null default '',              -- '' = 기본값 (null 이면 unique 가 안 걸림)
  fee_rate    numeric(6,4) not null,                 -- 0.1000 = 10%
  updated_at  timestamptz not null default now(),
  primary key (tenant_id, channel, category)
);


-- ═══ 주문 ═════════════════════════════════════════════════════

create table orders (
  id                  uuid primary key default gen_random_uuid(),
  tenant_id           uuid not null references tenant(id) on delete cascade,
  channel_account_id  uuid not null references channel_account(id),
  channel             channel not null,
  external_order_id   text not null,          -- 마켓 주문번호. 중복 수집 방지 키
  status              order_status not null default 'NEW',
  channel_status      text,                   -- 마켓 원래 상태값. 내부 상태와 분리 보관
  buyer_name          text,
  receiver_name       text,
  receiver_phone      text,
  receiver_address    text,
  receiver_zipcode    text,
  delivery_message    text,
  total_amount        numeric(12,2) not null default 0,
  ordered_at          timestamptz not null,
  confirmed_at        timestamptz,
  raw_json            jsonb not null,
  created_at          timestamptz not null default now()
);
-- 폴링이 같은 주문을 다시 가져와도 DB 가 막는다 (Idempotency)
create unique index orders_external_uk on orders (channel_account_id, external_order_id);
create index orders_tenant_status_ix on orders (tenant_id, status, ordered_at desc);

create table order_item (
  id                 uuid primary key default gen_random_uuid(),
  order_id           uuid not null references orders(id) on delete cascade,
  external_item_id   text not null,          -- 마켓 상품주문번호
  channel_product_id uuid references channel_product(id),
  product_name       text not null,
  option_name        text,
  barcode            text,
  quantity           int not null,
  unit_price         numeric(12,2) not null
);
create unique index order_item_external_uk on order_item (order_id, external_item_id);


-- ═══ 배송 / 송장 ═══════════════════════════════════════════════
-- ponytail: 주문 1건 = 송장 1건 가정. 부분출고가 실제로 생기면 shipment_item 을 추가한다.

create table shipment (
  id             uuid primary key default gen_random_uuid(),
  tenant_id      uuid not null references tenant(id) on delete cascade,
  order_id       uuid not null references orders(id) on delete cascade,
  courier        text not null default 'CJ',
  invoice_no     text,
  dispatch       dispatch_status not null default 'PENDING',
  dispatch_error text,
  retry_count    int not null default 0,
  shipped_at     timestamptz,
  dispatched_at  timestamptz,                -- 마켓에 송장번호를 보낸 시각
  created_at     timestamptz not null default now()
);
create unique index shipment_order_uk on shipment (order_id);
create index shipment_retry_ix on shipment (tenant_id) where dispatch = 'FAILED';


-- ═══ 작업 큐 ═══════════════════════════════════════════════════
--
-- 상품등록·이미지가공·송장전송·폴링처럼 오래 걸리거나 마켓 rate limit 을 타는 일은 전부 여기로.
-- 워커는 FOR UPDATE SKIP LOCKED 로 집어간다. 워커를 N대로 늘려도 코드를 고치지 않는다.
--
--   update job set status='RUNNING', started_at=now()
--   where id in (select id from job where status='QUEUED' and run_after <= now()
--                order by run_after limit 10 for update skip locked)
--   returning *;

create table job (
  id          bigserial primary key,
  tenant_id   uuid references tenant(id) on delete cascade,   -- 폴링 등 전역 작업은 null
  kind        text not null,               -- POLL_ORDERS, REGISTER_PRODUCT, SEND_INVOICE ...
  payload     jsonb not null default '{}',
  status      job_status not null default 'QUEUED',
  run_after   timestamptz not null default now(),   -- 재시도 백오프
  attempts    int not null default 0,
  last_error  text,
  started_at  timestamptz,
  finished_at timestamptz,
  created_at  timestamptz not null default now()
);
create index job_pick_ix on job (run_after) where status = 'QUEUED';
create index job_tenant_ix on job (tenant_id, kind, status);
-- 같은 작업이 두 번 큐에 들어가는 걸 막는다 (폴링 중복 방지)
create unique index job_dedupe_uk on job (kind, md5(payload::text))
  where status in ('QUEUED', 'RUNNING');


-- ═══ 알림 ══════════════════════════════════════════════════════

create table notification (
  id          bigserial primary key,
  tenant_id   uuid not null references tenant(id) on delete cascade,
  event       text not null,               -- NEW_ORDER, NEW_INQUIRY, CHANNEL_API_ERROR ...
  title       text not null,
  body        text,
  link        text,
  read_at     timestamptz,
  created_at  timestamptz not null default now()
);
create index notification_unread_ix on notification (tenant_id, created_at desc) where read_at is null;


-- ═══ 동기화 커서 ═══════════════════════════════════════════════
-- MSSQL 원천 테이블별로 "어디까지 가져왔는가"만 기록한다.

create table sync_state (
  source      text primary key,             -- 'TB_retail_products' ...
  cursor      timestamptz not null,         -- 마지막으로 가져온 UpdateDate
  rows_synced int not null default 0,
  synced_at   timestamptz not null default now()
);
-- 고객별 가공 이미지.
--
-- master_image 는 전 고객 공용(배경제거된 투명 PNG)이고, 여기는 고객이 자기 브랜드에 맞게
-- 워터마크·배경을 적용한 결과다. 마켓에 실제로 나가는 건 이쪽 public_url 이다.
--
--   master_image.public_url   master/{retailer}/{code}/{ts}.png        투명, 공용
--   tenant_image.public_url   t/{tenant_id}/{retailer}/{code}/{ts}.jpg 고객별, 마켓용
--
-- 마켓에 넘길 때는 투명 PNG 가 아니라 배경이 합성된 JPG 여야 한다. 검색 썸네일에서
-- 투명 영역이 검게 나오는 마켓이 있다.
--
-- variant 는 후보 이미지를 여러 장 만들 때 구분한다 (흰배경 / 주방 / 생활공간 …).
-- 기본값 하나로 시작하고, 후보 생성 기능이 실제로 붙을 때 값을 늘린다.
create table tenant_image (
  tenant_id          uuid not null references tenant(id) on delete cascade,
  master_id          text not null,
  filename           text not null,              -- master_image 와 같은 키
  variant            text not null default 'default',
  public_url         text not null,
  is_representative  boolean not null default false,
  created_at         timestamptz not null default now(),
  primary key (tenant_id, master_id, filename, variant),
  foreign key (master_id, filename) references master_image (master_id, filename) on delete cascade
);
create index tenant_image_rep_ix on tenant_image (tenant_id, master_id) where is_representative;
