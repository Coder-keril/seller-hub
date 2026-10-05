-- ═══ 차액환불 처리 기록 ═══════════════════════════════════════════
--
-- **환불 영수증에서 차액환불을 추론하지 않는다.** 실데이터로 확인한 결과(2026-10-05):
--   환불 영수증 36건 · 품목 44건 중 "±1일 내 같은 상품을 더 싸게 재구매" 매칭이 **0건**이고,
--   `original_approval_no` 는 36건 중 1건만 채워져 있었다. 즉 단순 반품과 구분할 단서가 없다.
--   매장에서 처리한 날과 영수증을 입력하는 날도 벌어진다.
-- → 후보 화면에서 **처리했다고 누른 사실을 기록**한다. 대시보드는 추측이 아니라 이걸 센다.
--
-- `verified_refund_id` 는 나중에 그 환불 영수증이 들어와 대조되면 채운다(신고 → 확인).
-- 비어 있어도 기록은 유효하다 — 영수증을 안 넣는 날이 있어도 집계가 멈추면 안 된다.
--
-- 유일키 `(tenant_id, receipt_id, product_code)`: 같은 구매의 같은 상품은 한 번만 처리한다.
-- 되돌릴 수 있어야 하므로 삭제를 막지 않는다(화면에 취소 버튼).
create table price_adjust_claim (
  id                 uuid primary key default gen_random_uuid(),
  tenant_id          uuid not null references tenant(id) on delete cascade,
  receipt_id         uuid not null references receipt(id) on delete cascade,  -- 원 구매 영수증
  product_code       text not null,
  name               text,
  qty                int  not null,
  paid_unit          numeric(12,2) not null,   -- 그때 낸 실지불 단가(쿠폰 반영)
  sale_price         numeric(12,2) not null,   -- 처리 시점의 행사가
  diff_total         numeric(12,2) not null,   -- 회수액 = (paid_unit − sale_price) × qty
  claimed_at         timestamptz not null default now(),
  verified_refund_id uuid references receipt(id) on delete set null,
  memo               text,
  constraint price_adjust_claim_uk unique (tenant_id, receipt_id, product_code),
  constraint price_adjust_claim_qty_chk check (qty > 0),
  constraint price_adjust_claim_diff_chk check (diff_total >= 0)
);

-- 월별 추이·랭킹 집계의 진입점.
create index price_adjust_claim_scan_ix on price_adjust_claim (tenant_id, claimed_at);
create index price_adjust_claim_prod_ix on price_adjust_claim (tenant_id, product_code);

comment on table price_adjust_claim is
  '차액환불로 처리한 기록. 환불 영수증에서 추론하지 않고 판매자가 누른 사실을 담는다.';
comment on column price_adjust_claim.verified_refund_id is
  '대조된 환불 영수증. null = 아직 미확인이지만 기록은 유효하다.';
