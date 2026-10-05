// 영수증 대시보드 — 상품별 순구매·평균단가와 거래 라인.
//
// 원본(merrycoco-admin)은 `SP_GetCostcoReceiptDashboard` 가 임시 테이블 `#u` 를 구매·환불
// 두 테이블의 UNION ALL 로 만든 뒤 결과셋 3개를 돌려줬다. 여기서는 **구매·환불이 한
// 테이블**이라 UNION 이 통째로 사라지고 CTE 하나로 끝난다.
//
// 결과셋 3개를 한 번의 왕복으로 받는다 — CTE 를 한 번만 쓰고 JSON 세 열로 돌려받는다.
// 쿼리를 세 번 쓰면 필터 조건이 세 곳에 복사되어 조용히 갈라진다.
//
// ⚠️ **환불 품목은 이미 음수로 저장돼 있다**(파서가 그렇게 만든다). 그래서 netting 은
//    그냥 `sum(qty)` 다. 화면에 "환불 수량"을 양수로 보여주려고 부호를 되집는 곳만 `-qty` 다.
//
// ⚠️ **순금액은 `amount − coupon_discount`** 다. 원본 SP 는 쿠폰 반영 컬럼(`line_total`)이
//    따로 있어 그걸 썼는데 우리 스키마에는 없다. 쿠폰 전 금액을 합하면 평균단가가 과대
//    계상된다(실측: 쿠폰 96,000원만큼 어긋났다). 영수증의 네 번째 검산과 같은 식이다.
import { tquery, isDateOnly } from "../db";
import { NET_AMT_SQL } from "./statements";

/** 'tx' = 각 거래를 자기 날짜에 · 'orig' = 환불을 원거래일에 귀속(없으면 환불일). */
export type DateBasis = "tx" | "orig";

export interface DashFilters {
  from?: string | null;
  to?: string | null;
  code?: string | null;
  name?: string | null;
  member?: string | null;
  card?: string | null;
}

export interface DashSummary {
  purchase_receipts: number; purchase_qty: number; purchase_amt: number;
  refund_receipts: number; refund_qty: number; refund_amt: number;
  net_qty: number; net_amt: number; avg_unit: number | null;
}

export interface DashProductRow {
  product_code: string; name: string;
  purchase_qty: number; refund_qty: number; net_qty: number;
  purchase_amt: number; refund_amt: number; net_amt: number;
  avg_unit: number | null; last_at: string | null;
}

export interface DashLineRow {
  kind: "PURCHASE" | "REFUND"; receipt_id: string; line_no: number | null;
  product_code: string; name: string | null;
  qty: number; unit_price: number | null; net_amt: number; coupon: number;
  purchased_at: string; member_no: string; register: string | null;
  card_number_masked: string | null; approval_no: string | null;
  original_approval_no: string | null; original_date: string | null;
}

export interface DashResult {
  summary: DashSummary;
  byProduct: DashProductRow[];
  lines: DashLineRow[];
}

const LINE_CAP = 2000;

const num = (v: unknown): number => Number(v) || 0;
/** 순수량이 0 이하면 평균단가는 의미가 없다(전량 환불·초과 환불). 표시하지 않는다. */
const avgUnit = (netAmt: number, netQty: number): number | null =>
  netQty > 0 ? Math.round(netAmt / netQty) : null;

export async function loadDashboard(
  tenantId: string,
  f: DashFilters = {},
  basis: DateBasis = "tx",
  group = false,
): Promise<DashResult> {
  // $1 은 tquery 가 넣는 tenantId 다. 아래 순서가 SQL 의 $2..$8 과 **그대로** 대응한다.
  // 날짜는 **실제 날짜인지 확인한 뒤** 넣는다. 틀린 값은 필터 없음으로 다룬다 —
  // 그대로 `::date` 에 넘기면 Postgres 가 터져 화면이 죽는다.
  const from = isDateOnly(f.from?.trim()) ? f.from!.trim() : null;
  const to = isDateOnly(f.to?.trim()) ? f.to!.trim() : null;

  const params = [
    from,                       // $2
    to,                         // $3
    f.code?.trim() || null,     // $4
    f.name?.trim() || null,     // $5
    f.member?.trim() || null,   // $6
    basis,                      // $7
    f.card?.trim() || null,     // $8
  ];

  // 라인셋 — group 이면 (구분 × 영수증 × 상품)으로 묶는다. 원본과 같은 선택지다.
  const lineSelect = group
    ? `select kind, receipt_id, null::int as line_no, product_code, max(name) as name,
              sum(qty)::int as qty, max(unit_price) as unit_price, sum(net_amt) as net_amt,
              sum(coupon) as coupon, max(purchased_at) as purchased_at, max(member_no) as member_no,
              max(register) as register, max(card_number_masked) as card_number_masked,
              max(approval_no) as approval_no, max(original_approval_no) as original_approval_no,
              max(original_date) as original_date
         from f group by kind, receipt_id, product_code
        order by max(purchased_at) desc, kind, product_code
        limit ${LINE_CAP}`
    : `select kind, receipt_id, line_no, product_code, name, qty, unit_price, net_amt, coupon,
              purchased_at, member_no, register, card_number_masked,
              approval_no, original_approval_no, original_date
         from f
        order by purchased_at desc, kind, line_no
        limit ${LINE_CAP}`;

  const [row] = await tquery<{
    summary: Omit<DashSummary, "avg_unit">;
    by_product: Omit<DashProductRow, "avg_unit">[];
    lines: DashLineRow[];
  }>(
    tenantId,
    `with u as (
       select r.kind::text as kind, r.id as receipt_id, i.line_no,
              i.product_code, i.name, i.qty,
              i.unit_price,
              -- 순금액 = 쿠폰 뺀 실지불액. 식의 정의와 이유는 statements.ts 를 볼 것.
              ${NET_AMT_SQL} as net_amt,
              coalesce(i.coupon_discount, 0) as coupon,
              -- basis 분기는 CASE 한 줄로. 'orig' 는 환불을 원거래일에 귀속한다.
              case when $7 = 'orig' and r.kind = 'REFUND'
                   then coalesce(r.original_date, r.purchased_at::date)
                   else r.purchased_at::date end as tx_date,
              to_char(r.purchased_at, 'YYYY-MM-DD"T"HH24:MI:SS') as purchased_at,
              r.member_no, r.register, r.card_number_masked,
              r.approval_no, r.original_approval_no,
              to_char(r.original_date, 'YYYY-MM-DD') as original_date
         from receipt_item i
         join receipt r on r.id = i.receipt_id
        where r.tenant_id = $1
     ),
     f as (
       select * from u
        where ($2::date is null or tx_date >= $2::date)
          and ($3::date is null or tx_date <= $3::date)
          and ($4::text is null or product_code = $4)
          and ($5::text is null or name ilike '%' || $5 || '%')
          and ($6::text is null or member_no = $6)
          and ($8::text is null or card_number_masked ilike '%' || $8 || '%')
     ),
     summary as (
       select count(distinct case when kind = 'PURCHASE' then receipt_id end)::int as purchase_receipts,
              count(distinct case when kind = 'REFUND'   then receipt_id end)::int as refund_receipts,
              coalesce(sum(case when kind = 'PURCHASE' then qty else 0 end), 0)::int      as purchase_qty,
              coalesce(sum(case when kind = 'REFUND'   then -qty else 0 end), 0)::int     as refund_qty,
              coalesce(sum(case when kind = 'PURCHASE' then net_amt else 0 end), 0)::float8  as purchase_amt,
              coalesce(sum(case when kind = 'REFUND'   then -net_amt else 0 end), 0)::float8 as refund_amt,
              coalesce(sum(qty), 0)::int as net_qty,
              coalesce(sum(net_amt), 0)::float8 as net_amt
         from f
     ),
     by_product as (
       select product_code, coalesce(max(name), '') as name,
              sum(case when kind = 'PURCHASE' then qty else 0 end)::int as purchase_qty,
              sum(case when kind = 'REFUND'   then -qty else 0 end)::int as refund_qty,
              sum(qty)::int as net_qty,
              sum(case when kind = 'PURCHASE' then net_amt else 0 end)::float8 as purchase_amt,
              sum(case when kind = 'REFUND'   then -net_amt else 0 end)::float8 as refund_amt,
              sum(net_amt)::float8 as net_amt,
              max(purchased_at) as last_at
         from f group by product_code
     ),
     lines as (${lineSelect})
     select (select row_to_json(s) from summary s)                                     as summary,
            coalesce((select json_agg(p order by p.net_amt desc) from by_product p), '[]'::json) as by_product,
            coalesce((select json_agg(l) from lines l), '[]'::json)                    as lines`,
    params,
  );

  if (!row) throw new Error("대시보드 집계가 아무 행도 돌려주지 않았습니다.");

  const s = row.summary;
  return {
    summary: { ...s, avg_unit: avgUnit(num(s.net_amt), num(s.net_qty)) },
    byProduct: row.by_product.map((p) => ({
      ...p,
      avg_unit: avgUnit(num(p.net_amt), num(p.net_qty)),
    })),
    lines: row.lines,
  };
}
