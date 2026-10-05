// 실매입 평균단가 — 영수증에서 "이 상품을 실제로 얼마에 샀는가" 를 낸다.
//
// 이게 영수증을 쌓는 이유 중 하나다. 판매가 계산의 원가 기준으로 `master_price.original_price`
// (정상가)를 쓰면 두 가지가 어긋난다:
//   ① 정상가는 **내가 낸 값이 아니다** — 행사·쿠폰으로 더 싸게 샀을 수 있다.
//   ② 단가 상품(KG당단가)의 정상가에는 단가와 박스값이 섞여 있어 믿을 수 없다
//      (merrycoco 측 기록: 척아이롤 도매 279,513 = 박스값).
// 영수증은 **실제 지불액**이라 둘 다 피한다.
//
// ⚠️ 평균단가는 **구매 − 환불** 기준이다. 오픈마켓으로 판 수량은 아직 빠지지 않는다 —
//    주문 연동이 붙으면 "남은 재고의 평균단가"가 된다.
//
// ⚠️ 단가는 `NET_AMT_SQL`(쿠폰 뺀 실지불액) ÷ 순수량이다. 쿠폰을 빼지 않으면 과대 계상된다.
import { tquery } from "../db";
import { NET_AMT_SQL } from "./statements";

export interface CostBasis {
  product_code: string;
  name: string | null;
  receipts: number;
  purchase_qty: number;
  refund_qty: number;
  net_qty: number;
  net_amt: number;
  /** 실매입 평균단가. 순수량이 0 이하면 null — 전량 환불이면 단가가 없다. */
  avg_unit: number | null;
  last_at: string | null;
}

const SELECT = `
  select i.product_code,
         coalesce(max(i.name), '') as name,
         count(distinct r.id)::int as receipts,
         sum(case when r.kind = 'PURCHASE' then i.qty else 0 end)::int as purchase_qty,
         sum(case when r.kind = 'REFUND'   then -i.qty else 0 end)::int as refund_qty,
         sum(i.qty)::int as net_qty,
         sum(${NET_AMT_SQL})::float8 as net_amt,
         case when sum(i.qty) > 0
              then round(sum(${NET_AMT_SQL}) / sum(i.qty))::float8
         end as avg_unit,
         to_char(max(r.purchased_at), 'YYYY-MM-DD') as last_at
    from receipt_item i
    join receipt r on r.id = i.receipt_id
   where r.tenant_id = $1`;

/** 상품 하나의 실매입 평균단가. 영수증에 없으면 null. */
export async function costBasis(
  tenantId: string,
  productCode: string,
): Promise<CostBasis | null> {
  const rows = await tquery<CostBasis>(
    tenantId,
    `${SELECT} and i.product_code = $2 group by i.product_code`,
    [productCode.trim()],
  );
  return rows[0] ?? null;
}

/** 매입 이력이 있는 상품 목록 — 순금액 큰 것부터. */
export async function costBasisList(tenantId: string, limit = 200): Promise<CostBasis[]> {
  return tquery<CostBasis>(
    tenantId,
    `${SELECT} group by i.product_code order by sum(${NET_AMT_SQL}) desc limit $2`,
    [Math.min(Math.max(limit, 1), 1000)],
  );
}
