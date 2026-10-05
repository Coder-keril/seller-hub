-- 위임 발송 건의 실비 스냅샷.
--
-- 판매자는 메리코코에게 상품금액 + 발송비용(택배비·박스비 등 부자재비)을 정산한다.
-- 정산 기능 자체는 이번 개발 범위가 아니다. 다만 **발송 시점의 실비는 지금 남겨야 한다** —
-- 기능은 나중에 만들 수 있지만 지나간 단가는 복원할 수 없다.
--
-- cost_item 은 "현재 설정된 단가" 라서 시간이 지나면 바뀐다. 과거 발송 건을 지금 단가로
-- 정산하면 틀린다. order_item 에 주문 시점 정상가를 박아둔 것과 같은 이유다.
--
-- billed_cost 예:
--   { "shipping": 3000, "packing": 500, "items": [{"code":"BOX_M","name":"중박스","amount":300}],
--     "total": 3800, "source": "cost_item", "at": "2026-09-30T…" }

alter table shipment add column billed_cost jsonb;

comment on column shipment.billed_cost is
  '발송 시점 실비 스냅샷. 위임 발송의 판매자↔메리코코 정산 근거가 된다. 정산 기능은 별도.';

-- 정산 대상 조회: 위임 발송 중 실비가 기록된 건
create index shipment_billed_ix on shipment (tenant_id, issued_at)
  where invoice_source = 'DELEGATED';
