-- 수수료를 항목별로 쪼개고, 가격정책을 채널별로 덮어쓸 수 있게 하고,
-- 통계를 위해 주문 시점 스냅샷을 남긴다.

-- ═══ 수수료를 항목별로 ═════════════════════════════════════════
-- 마켓마다 수수료 구성이 다르다. 쿠팡은 판매수수료에 결제수수료가 포함이고, 네이버는
-- 매출연동 수수료와 네이버페이 주문관리 수수료가 별개다. 컬럼을 고정하면 안 맞아서
-- 항목을 행으로 쌓고 계산에서 합친다.

drop table if exists channel_fee;

create type fee_kind as enum (
  'SALE',      -- 판매수수료 (카테고리별)
  'PAYMENT',   -- 결제수수료 (쿠팡처럼 SALE 에 포함된 마켓은 행을 두지 않는다)
  'SETTLE',    -- 정산·서비스 이용료
  'AD',        -- 광고비를 정상가에 넣고 싶을 때
  'OTHER'
);

-- category 가 '' 이면 해당 채널의 기본값. 카테고리별 행이 있으면 그것이 우선한다.
create table channel_fee (
  tenant_id     uuid not null references tenant(id) on delete cascade,
  channel       channel not null,
  category      text not null default '',
  kind          fee_kind not null default 'SALE',
  rate          numeric(6,4) not null default 0,   -- 0.1080 = 10.8%
  fixed         numeric(12,2) not null default 0,  -- 건당 정액 수수료가 있는 마켓용
  -- 마켓 공시 수수료율은 보통 VAT 별도다. 공시값을 그대로 넣고 false 로 두면 계산에서
  -- 1.1 을 곱한다. 실효율을 직접 계산해 넣었다면 true.
  vat_included  boolean not null default false,
  memo          text,
  updated_at    timestamptz not null default now(),
  primary key (tenant_id, channel, category, kind)
);


-- ═══ 가격정책: 고객별 + 채널별 ═════════════════════════════════
-- channel 이 null 인 행이 그 고객의 기본값이고, 채널별 행이 있으면 그것이 이긴다.
-- 쿠팡은 마진을 낮추고 네이버는 높이는 식으로 채널마다 다르게 둘 수 있어야 한다.

drop table if exists price_policy;

create table price_policy (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references tenant(id) on delete cascade,
  channel         channel,                              -- null = 이 고객의 기본값
  base_channel    text not null default 'store'
                  check (base_channel in ('store', 'online')),  -- master_price 중 정상가로 쓸 것
  mode            text not null default 'MARGIN'
                  check (mode in ('MARGIN', 'MARKUP', 'FIXED_PROFIT')),
  target_rate     numeric(6,4) not null default 0.15,   -- MARGIN=판매가 대비, MARKUP=정상가 대비
  target_profit   numeric(12,2) not null default 0,     -- FIXED_PROFIT 일 때 건당 목표 순이익
  shipping_cost   numeric(12,2) not null default 3000,  -- 택배비
  extra_cost      numeric(12,2) not null default 0,     -- 쿠폰·할인 등
  round_to        int not null default 100,             -- 판매가 올림 단위(원)
  updated_at      timestamptz not null default now()
);
-- enum→text 캐스트는 IMMUTABLE 이 아니라 인덱스 식에 못 쓴다. 부분 인덱스 두 개로 나눈다.
create unique index price_policy_channel_uk on price_policy (tenant_id, channel)
  where channel is not null;
create unique index price_policy_default_uk on price_policy (tenant_id)
  where channel is null;


-- ═══ 주문 시점 스냅샷 ══════════════════════════════════════════
-- 통계·수익분석은 주문 당시의 값으로 해야 한다. 마스터 정상가가 바뀌거나 카테고리가
-- 재분류되면 과거 매출·수익이 소급해서 흔들린다. 주문 수집 시 그 시점 값을 박아둔다.

alter table order_item
  add column category   text,            -- 주문 시점의 master_product.category
  add column cost       numeric(12,2),   -- 주문 시점의 정상가 (007 에서 normal_price 로 개명)
  add column fee_amount numeric(12,2);   -- 주문 시점에 계산한 총 수수료

-- 일자별·카테고리별·금액대별 집계용. 별도 집계 테이블은 실제로 느려질 때 만든다.
create index order_item_stats_ix on order_item (category);
create index orders_stats_ix on orders (tenant_id, ordered_at, total_amount);
