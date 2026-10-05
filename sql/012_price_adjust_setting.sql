-- ═══ 가격 조정 설정 (판매자별) ═══════════════════════════════════
--
-- 후보 목록의 기본 임계값. 화면에서 건별로 덮어쓸 수 있고, 여기 저장한 값이 **기본값**이다.
--
-- `min_diff_total` 기본 5,000원의 근거(실데이터 109건 분포, 2026-10-05):
--     0원  109건  1,237,400원 (금액 100%)
--   5000원   47건  1,086,700원 (금액  88%)   ← 건수 절반 이하, 금액 88% 유지
--  10000원   33건    973,000원 (금액  79%)
--   중위 4,000원 · 하위25% 2,800원
--   몇천 원 때문에 매장에 다녀오는 것은 품이 더 든다. 반대로 1만원으로 올리면 금액 21%를
--   버린다. 그래서 5,000원에서 끊는다 — 판매자가 바꿀 수 있다.
--
-- `window_days` 가 null 이면 **기간 제한 없음**이다. 코스트코 100% 만족 보장이 대부분의
-- 상품을 기간 제한 없이 환불해 주므로 그것이 올바른 기본값이다. 전자제품·대형가전만 90일이다.
--
-- 행이 없으면 코드의 기본값을 쓴다(`adjust-setting.ts`). 그래서 테넌트마다 미리 만들지 않는다.
create table price_adjust_setting (
  tenant_id      uuid primary key references tenant(id) on delete cascade,
  min_diff_total numeric(12,2) not null default 5000,
  window_days    int,                      -- null = 기간 제한 없음
  updated_at     timestamptz not null default now(),
  constraint price_adjust_setting_min_chk check (min_diff_total >= 0),
  constraint price_adjust_setting_days_chk check (window_days is null or (window_days >= 1 and window_days <= 3650))
);

comment on table price_adjust_setting is
  '가격 조정 화면의 판매자별 기본 임계값. 화면에서 건별로 덮어쓸 수 있다.';
comment on column price_adjust_setting.window_days is
  'null = 기간 제한 없음(기본 환불 정책). 전자제품·대형가전을 볼 때만 90 같은 값을 넣는다.';
