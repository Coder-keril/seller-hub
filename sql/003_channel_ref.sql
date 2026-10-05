-- 마켓 참조 데이터와 카테고리 매핑.
--
-- 각 마켓이 제공하는 코드 목록(카테고리·원산지·상품정보제공고시 품목군 등)을 한 테이블에
-- 모은다. 마켓마다 종류가 다르고 앞으로 늘어나므로 kind 로 구분하고 원본은 raw 에 남긴다.
--
-- 마켓별로 테이블을 나누지 않는 이유: 쿠팡·11번가 카테고리도 같은 형태이고, 조회 패턴이
-- (channel, kind) 필터 + 코드 조인뿐이다.

create table channel_ref (
  channel      channel not null,
  kind         text not null,          -- CATEGORY | ORIGIN_AREA | NOTICE_TYPE | ATTRIBUTE ...
  code         text not null,
  name         text not null,
  parent_code  text,                   -- 계층이 있는 것 (카테고리·원산지)
  full_name    text,                   -- '식품>가공식품>...' 전체 경로. 매핑 때 사람이 보는 값
  leaf         boolean,                -- 상품등록에 쓸 수 있는 최하위인지
  raw          jsonb,
  synced_at    timestamptz not null default now(),
  primary key (channel, kind, code)
);
create index channel_ref_kind_ix on channel_ref (channel, kind) where leaf;
create index channel_ref_name_ix on channel_ref (channel, kind, name);
create index channel_ref_parent_ix on channel_ref (channel, kind, parent_code);


-- 마스터 카테고리 ↔ 마켓 카테고리 매핑.
--
-- 마스터 카테고리는 전 테넌트 공용이므로 매핑도 전역으로 둔다. 판매자별로 다르게 해야 할
-- 필요가 실제로 생기면 tenant_id 를 추가한다.
--
-- status:
--   AUTO       이름 유사도로 자동 매칭한 후보. 그대로 등록에 쓰지 않는다
--   CONFIRMED  사람이 확인함. 상품등록에 쓸 수 있다
--   REJECTED   맞는 카테고리가 없음

create table category_map (
  master_category  text not null,      -- master_product.category 값
  channel          channel not null,
  channel_code     text not null,
  status           text not null default 'AUTO'
                   check (status in ('AUTO', 'CONFIRMED', 'REJECTED')),
  score            numeric(4,3),       -- AUTO 일 때 유사도
  memo             text,
  updated_at       timestamptz not null default now(),
  primary key (master_category, channel)
);
create index category_map_confirmed_ix on category_map (channel) where status = 'CONFIRMED';
