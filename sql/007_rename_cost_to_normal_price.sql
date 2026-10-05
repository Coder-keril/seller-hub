-- 용어 통일: 원가 → 정상가
--
-- 이 값의 출처는 master_price.original_price 다. 메리코코가 관리하는 **매장 정상가**이고,
-- 판매자에게는 매입 기준이 되지만 용어는 원천을 따라 '정상가' 로 통일한다.
-- 요구사항 문서도 '상품 정상가 / 매장 정상가' 로 쓰고 있다.

alter table order_item rename column cost to normal_price;

comment on column order_item.normal_price is
  '주문 시점의 정상가 (master_price.original_price). 마스터 가격이 바뀌어도 과거 통계가 흔들리지 않게 박아둔다.';
comment on column order_item.fee_amount is
  '주문 시점에 계산한 총 마켓 수수료.';
comment on column price_policy.base_channel is
  'master_price 중 정상가로 쓸 채널 (store = 매장 정상가, online = 온라인 정상가).';
