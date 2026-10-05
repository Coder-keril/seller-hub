-- ═══ 코스트코 영수증 ═════════════════════════════════════════════
--
-- 구매·환불 영수증을 **한 테이블**에 담고 kind 로 가른다. merrycoco-admin 원본은
-- TB_costco_purchase_receipt / TB_costco_refund_receipt 로 나뉘어 있는데, 이 기능의 요점이
-- **구매 − 환불 netting**(남은 재고의 구매 평균단가)이라 집계마다 UNION 을 해야 했다.
-- 상세의 모양도 양쪽이 같다. 합치면 UNION 이 사라지고 평범한 group by 가 된다.
--
-- 환불 전용 컬럼(original_date · original_approval_no)은 nullable 로 둔다. 카드환불은 원거래일이
-- 있지만 **현금환불은 없다**(파서 테스트가 그 사례를 담고 있다) — not null 로 묶을 수 없다.

create type receipt_kind as enum ('PURCHASE', 'REFUND');

-- purchased_at 이 timestamptz 가 아니라 **timestamp** 인 이유:
--   영수증에 찍힌 "2026/02/06 12:11:00 PM" 은 타임존 정보가 없는 **벽시계 시각**이다.
--   timestamptz 로 받으면 서버 타임존을 멋대로 가정해 저장하게 된다. 읽은 그대로 보관한다.
--   덧붙여 timestamp → date 캐스트는 IMMUTABLE 이라 아래 날짜 인덱스를 만들 수 있다
--   (timestamptz 는 STABLE 이라 인덱스 표현식에 못 쓴다).
--
-- member_no · purchased_at 이 not null 인 이유:
--   missingRequiredFields() 가 둘이 없으면 저장을 거부한다(검증 실패 영수증도 이 둘은 요구).
--   앱이 이미 보장하는 불변식이라 DB 에도 적는다.
create table receipt (
  id                   uuid primary key default gen_random_uuid(),
  tenant_id            uuid not null references tenant(id) on delete cascade,
  kind                 receipt_kind not null,
  member_no            text not null,                 -- 코스트코 멤버십 회원번호
  purchased_at         timestamp not null,            -- 영수증 로컬 시각 (구매일 / 반품일)
  register             text,                          -- REG# — 결손 가능
  approval_no          text,                          -- 대표 승인(카드 있으면 카드, 순수 현금이면 현금)
  original_approval_no text,                          -- 환불 → 원구매 승인번호
  cash_approval_no     text,                          -- 분할결제 시 현금영수증 승인번호
  original_date        date,                          -- 환불 전용 원거래일. 현금환불은 null
  payment_type         text,                          -- 거래구분 (구매 / 반품)
  payment_method       text,                          -- card / cash / reward / 복합
  tax_free             numeric(12,2),
  taxable              numeric(12,2),
  vat                  numeric(12,2),
  total                numeric(12,2),
  coupon_total         numeric(12,2),
  item_count           int,                           -- 총 판매 상품 수 (환불은 음수)
  card_amount          numeric(12,2),
  cash_amount          numeric(12,2),
  reward_amount        numeric(12,2),
  change_amount        numeric(12,2),
  approved_amount      numeric(12,2),
  installment_months   int,
  card_number_masked   text,                          -- 마스킹본만 담는다. 현금영수증이면 전화번호
  card_brand           text,
  -- 영수증 자기 값으로 한 4중 검산 결과. reconciled=false 도 저장하되 **왜 틀렸는지 남긴다**.
  reconciled           boolean not null,
  qty_ok               boolean not null,
  coupon_ok            boolean not null,
  tax_ok               boolean not null,
  amount_ok            boolean not null,
  raw_text             text not null,                 -- 원문. 파서를 고치면 재파싱한다
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- 자연키. 같은 레인(register)에서 같은 초에 두 건이 찍힐 수 없다.
-- register 가 결손일 수 있어 `nulls not distinct` 를 쓴다 — 기본값(nulls distinct)이면
-- register 가 null 인 중복 영수증이 둘 다 들어온다. (PG15+)
create unique index receipt_natural_uk
  on receipt (tenant_id, purchased_at, register) nulls not distinct;

-- 카드 승인 중복 방지. 자연키와 별개로, 같은 카드·같은 승인번호가 같은 날 두 번 들어오는 것을
-- 막는다(시각·레인을 잘못 읽은 재업로드). 둘 다 있을 때만 — 현금 결제는 면제된다.
create unique index receipt_card_uk
  on receipt (tenant_id, (purchased_at::date), card_number_masked, approval_no)
  where card_number_masked is not null and approval_no is not null;

-- 기간 조회 · 가격조정 창(구매일 + N일) 탐색용.
create index receipt_scan_ix on receipt (tenant_id, kind, purchased_at);
-- 환불 → 원구매 연결.
create index receipt_orig_appr_ix on receipt (tenant_id, original_approval_no)
  where original_approval_no is not null;

-- 상세는 **영수증 원본 줄 그대로**다. 집계하지 않고 쿠폰만 평탄화한다.
-- order_item 과 같은 방식으로 tenant_id 를 두지 않고 부모를 거쳐 테넌시에 닿는다.
create table receipt_item (
  receipt_id           uuid not null references receipt(id) on delete cascade,
  line_no              int not null,
  product_code         text not null,                 -- 코스트코 상품코드. master_product.id = 'costco:' || 이 값
  name                 text,
  qty                  int not null,                  -- 환불·라인취소는 음수
  unit_price           numeric(12,2),
  amount               numeric(12,2),
  coupon_code          text,
  coupon_qty           int,
  coupon_unit_discount numeric(12,2),
  coupon_discount      numeric(12,2),
  primary key (receipt_id, line_no)
);

-- 상품별 집계(순구매·평균단가)의 진입 인덱스.
create index receipt_item_code_ix on receipt_item (product_code);

comment on table receipt is
  '코스트코 구매·환불 영수증 헤더. kind 로 가르고 집계에서 netting 한다.';
comment on column receipt.purchased_at is
  '영수증에 찍힌 로컬 벽시계 시각. 타임존 정보가 없어 timestamptz 가 아니다.';
comment on column receipt.card_number_masked is
  '마스킹본만 담는다(영수증에 찍힌 그대로). 현금영수증이면 전화번호가 들어간다.';
comment on column receipt.reconciled is
  '영수증 자기 값으로 한 4중 검산 통과 여부. false 도 저장한다 — 플래그를 보존해야 추적된다.';
