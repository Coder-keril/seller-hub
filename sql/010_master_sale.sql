-- ═══ 행사가(세일) ═══════════════════════════════════════════════
--
-- 가격 조정을 위해 **지금 할인 중인 가격**이 필요하다 — "내가 산 단가 > 지금 행사가" 를
-- 가려내는 것이 전부다.
--
-- ⚠️ 한국 코스트코에는 미국식 가격조정(차액 환불) 제도가 없다. **환불 정책을 활용**한다 —
--    할인 중인 새 상품을 사고 과거 비싸게 산 건을 반품 처리한다. 그래서 기간 기준이
--    '구매일 + 30일' 이 아니라 **그 상품의 환불 가능 기간**이고, 품목에 따라 다르다.
--    기간은 코드에 박지 않고 화면에서 받는다(판매자가 정책을 안다).
--
-- 원천은 `TB_retail_price_history` 다(merrycoco MSSQL). 거기에
-- `current_price`(행사가) · `discount_price`(할인액) · `sale_start_date` · `sale_end_date` ·
-- `ended_early_date` 가 있고, 정본 조회 로직은 `FN_retail_price_now` 다.
--
-- ⚠️ **이력을 여기에 쌓지 않는다.** 원천이 이력 테이블을 들고 있으므로 다시 받으면 복구된다.
--    (앞서 "지금부터 쌓지 않으면 복구 못 한다"고 적었던 것은 틀렸다 — 원천에 이력이 있다.)
--    필요한 것은 **오늘 유효한 행사 한 건**이라 (master_id, channel) 당 한 행으로 둔다.

alter table master_price
  add column sale_price      numeric(12,2),   -- 행사가. null = 오늘 행사 없음
  add column discount_amount numeric(12,2),   -- 할인액(원천이 절대가를 못 읽어도 이건 정확할 때가 있다)
  add column sale_start_date date,
  add column sale_end_date   date,
  add column sale_synced_at  timestamptz;

-- "지금 할인 중" 조회의 진입점. 행사 없는 행이 대다수라 부분 인덱스로 둔다.
create index master_price_sale_ix on master_price (sale_price)
  where sale_price is not null;

comment on column master_price.sale_price is
  '오늘 유효한 행사가. 0 인 원천 행은 동기화에서 제외한다 — 0 원 노출·0 원 주문 사고 전례가 있다.';
comment on column master_price.discount_amount is
  '할인액. 단가 상품은 팩당 할인액이고 단위당 단가와 더하거나 뺄 수 없다.';
