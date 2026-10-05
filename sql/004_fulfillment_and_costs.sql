-- 발송 위임 · 택배사 계정 · 고정비 · 채널 공통 등록 원고
--
-- 요구사항이 바뀐 지점 넷을 반영한다.
--   ① 메리코코가 판매자의 매입·발송을 위임받는다 → 여러 테넌트를 한 화면에서 처리해야 한다
--   ② 롯데택배 API 로 송장을 발급한다 → 택배사도 채널처럼 계정 관리가 필요하다
--   ③ 판매자별 고정비 항목을 변수로 관리한다 → 컬럼 고정을 버리고 행으로 쌓는다
--   ④ 스마트스토어 등록 정보를 기반으로 쿠팡에 등록한다 → 채널 공통 원고가 필요하다


-- ═══ ① 플랫폼 운영자와 발송 위임 ═══════════════════════════════
--
-- 메리코코도 하나의 tenant 다. 다만 is_platform 이 true 인 테넌트의 PLATFORM 사용자는
-- **위임받은 테넌트의 주문을** 볼 수 있다. 전체가 아니라 위임받은 범위로만 제한된다.
-- 즉 fulfillment_delegation 테이블이 곧 접근 권한의 경계다.

alter table tenant add column is_platform boolean not null default false;

alter table app_user drop constraint app_user_role_check;
alter table app_user add constraint app_user_role_check
  check (role in ('OWNER', 'STAFF', 'PLATFORM'));

create type delegation_mode as enum (
  'SELF',        -- 판매자가 직접 발송 (송장 직접입력 · 엑셀 · 본인 택배사 API)
  'MERRYCOCO'    -- 메리코코에 매입·발송 위임
);

create table fulfillment_delegation (
  tenant_id     uuid primary key references tenant(id) on delete cascade,
  mode          delegation_mode not null default 'SELF',
  delegated_at  timestamptz,
  memo          text,
  updated_at    timestamptz not null default now()
);
-- 운영자 조회는 이 인덱스를 탄다
create index fulfillment_delegation_mode_ix on fulfillment_delegation (mode)
  where mode = 'MERRYCOCO';


-- ═══ ② 택배사 계정 ════════════════════════════════════════════
--
-- 송장 발급 경로가 셋이다.
--   위임 판매자   → 메리코코 공용 계정 (tenant_id = null) 으로 일괄 발급
--   직접 판매자   → 본인 계약 계정으로 발급
--   API 없는 판매자 → 계정 없이 수동 입력·엑셀 업로드
--
-- channel_account 와 같은 구조다. 마켓마다 인증 방식이 다른 것처럼 택배사도 다르므로
-- 인증정보는 암호화된 JSON 한 덩어리로 둔다.

create table courier_account (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid references tenant(id) on delete cascade,   -- null = 메리코코 공용
  courier         text not null,                  -- LOTTE · CJ · HANJIN · EPOST ...
  alias           text not null,
  credential_enc  bytea,                          -- 계약 코드·API 키 등. 수동 입력만 쓰면 null
  contract_no     text,                           -- 계약(거래처) 번호. 화면 표시용
  status          text not null default 'ACTIVE'
                  check (status in ('ACTIVE', 'ERROR', 'DISABLED')),
  last_error      text,
  expires_at      timestamptz,                    -- 자격증명 만료 감시용
  created_at      timestamptz not null default now()
);
-- enum·nullable 을 coalesce 로 묶으면 IMMUTABLE 제약에 걸린다. 부분 인덱스로 나눈다.
create unique index courier_account_tenant_uk on courier_account (tenant_id, courier, alias)
  where tenant_id is not null;
create unique index courier_account_platform_uk on courier_account (courier, alias)
  where tenant_id is null;


-- ═══ ③ 고정비를 행으로 ════════════════════════════════════════
--
-- price_policy 에 shipping_cost / extra_cost 를 컬럼으로 두었는데, 판매자마다 관리하려는
-- 비용 항목이 다르고 늘어난다 (포장비 · 광고비 · 쿠폰 부담 · 부가세 예비 등).
-- 항목을 행으로 쌓고 계산에서 합친다. 운영 데이터가 없는 지금이 바꿀 기회다.

create type cost_kind as enum (
  'FIXED',   -- 건당 정액 (원)
  'RATE'     -- 판매가 대비 비율 (0.02 = 2%)
);

create table cost_item (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   uuid not null references tenant(id) on delete cascade,
  channel     channel,                    -- null = 전 채널 공통
  code        text not null,              -- SHIPPING · PACKING · AD · COUPON · ETC ...
  name        text not null,              -- 화면에 보이는 이름
  kind        cost_kind not null default 'FIXED',
  amount      numeric(12,4) not null,     -- FIXED 는 원, RATE 는 비율
  active      boolean not null default true,
  sort_order  int not null default 0,
  memo        text,
  updated_at  timestamptz not null default now()
);
-- 같은 코드는 (전 채널 기본) 하나 + (채널별 재정의) 하나까지
create unique index cost_item_channel_uk on cost_item (tenant_id, code, channel)
  where channel is not null;
create unique index cost_item_default_uk on cost_item (tenant_id, code)
  where channel is null;
create index cost_item_active_ix on cost_item (tenant_id, channel) where active;

-- price_policy 는 계산 방식만 남긴다. 금액은 cost_item 이 담당한다.
alter table price_policy drop column shipping_cost;
alter table price_policy drop column extra_cost;


-- ═══ ④ 채널 공통 등록 원고 ════════════════════════════════════
--
-- "스마트스토어에 등록한 정보를 기반으로 쿠팡에 등록한다" 를 구현하는 방식이다.
--
-- 스마트스토어 응답을 그대로 읽어 쿠팡용으로 역변환하지 않는다. 네이버 고유 구조(원상품/채널상품,
-- unitCapacity, productInfoProvidedNotice)를 쿠팡 형식으로 되돌리면 정보가 깨지고, 스마트스토어
-- 등록이 실패하면 쿠팡도 막힌다.
--
-- 대신 등록에 필요한 값을 **채널 중립 원고**로 한 번 만들어 tenant_product 에 둔다.
-- 스마트스토어 등록이 이 원고를 소비하고, 쿠팡 등록도 같은 원고를 소비한다.
-- 결과적으로 "스마트스토어에서 정리한 정보로 쿠팡에 등록" 이 되면서 순서 의존이 사라진다.
--
-- listing 에 담기는 것 (예):
--   { "name": "...", "detailHtml": "...",
--     "images": { "front": "...", "label": "...", "barcode": "..." },
--     "unit": { "total": 7200, "per": 100, "unit": "ml" },
--     "notice": { "type": "ETC", "fields": {...} },
--     "origin": "상세설명에 표시",
--     "taxType": "TAX", "minorPurchasable": true }

alter table tenant_product
  add column listing            jsonb,
  add column listing_source     channel,        -- 원고를 처음 확정한 채널 (보통 NAVER)
  add column listing_updated_at timestamptz;

-- 채널상품이 어느 원고에서 나왔는지. 원고가 바뀌면 재등록·수정 대상을 찾는다.
alter table channel_product
  add column listing_version timestamptz,       -- 등록 시점의 listing_updated_at
  add column last_pushed_at  timestamptz;       -- 마켓에 마지막으로 보낸 시각

create index channel_product_stale_ix on channel_product (tenant_id, channel)
  where status = 'REGISTERED';


-- ═══ 송장 발급 출처 ═══════════════════════════════════════════
-- 누가 어떤 경로로 송장을 넣었는지 남긴다. 위임 정산과 장애 추적에 쓰인다.

create type invoice_source as enum (
  'DELEGATED',    -- 메리코코가 위임받아 발급
  'COURIER_API',  -- 판매자 본인 택배사 API
  'EXCEL',        -- 엑셀 업로드
  'MANUAL'        -- 화면에서 직접 입력
);

alter table shipment
  add column invoice_source     invoice_source,
  add column courier_account_id uuid references courier_account(id),
  add column issued_by          uuid references app_user(id),
  add column issued_at          timestamptz;

create index shipment_pending_ix on shipment (tenant_id, created_at)
  where invoice_no is null;
