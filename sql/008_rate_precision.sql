-- 수수료율 정밀도. numeric(6,4) 는 소수 4자리라 0.01% 해상도뿐이다.
-- 네이버 주문관리수수료가 1.947% 처럼 소수 3자리로 공시되므로 0.01947 이 0.0195 로 잘렸다.
alter table channel_fee alter column rate type numeric(8,6);

-- cost_item 도 kind='RATE' 일 때 같은 문제를 겪는다. 금액(FIXED)과 율(RATE)이 한 컬럼을
-- 공유하므로 정수부는 넉넉히 두고 소수부만 늘린다.
alter table cost_item alter column amount type numeric(14,6);

comment on column channel_fee.rate is
  '수수료율. 0.01947 = 1.947%. 소수 6자리 — 네이버는 소수 3자리(%)로 공시한다';
