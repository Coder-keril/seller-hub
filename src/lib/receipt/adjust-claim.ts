// 차액환불 처리 기록 — 쓰기와 집계.
//
// 환불 영수증에서 추론하지 않는다(실데이터로 구분 불가가 확인됐다). 후보 화면에서 누른
// 사실만 담고, 대시보드는 그것을 센다. 자세한 근거는 `sql/013_price_adjust_claim.sql`.
import { tquery, isUuid } from "../db";

export interface ClaimInput {
  receiptId: string;
  productCode: string;
  name: string | null;
  qty: number;
  paidUnit: number;
  salePrice: number;
}

/** 처리 기록. 같은 구매의 같은 상품을 다시 누르면 **갱신**한다(행사가가 또 내려갈 수 있다). */
export async function recordClaim(tenantId: string, v: ClaimInput): Promise<void> {
  // 폼에서 온 값이다. uuid 가 아니면 FK 가 아니라 타입 오류로 터져 원인이 흐려진다.
  if (!isUuid(v.receiptId)) throw new Error("영수증 id 가 올바르지 않습니다.");
  if (!v.productCode.trim()) throw new Error("상품코드가 없습니다.");
  const diff = Math.max(0, Math.round((v.paidUnit - v.salePrice) * v.qty));
  // ⚠️ **영수증이 이 판매자 것인지 확인한다.** `receiptId` 는 폼에서 온 값이고 FK 는
  //    `receipt(id)` 만 보므로, 남의 영수증 uuid 를 넣으면 내 테넌트에 남의 영수증을
  //    가리키는 기록이 생긴다. `insert ... select ... where exists` 로 한 문장에서 막는다
  //    (먼저 조회하고 넣으면 그 사이에 바뀔 수 있다).
  const wrote = await tquery<{ id: string }>(
    tenantId,
    `insert into price_adjust_claim
       (tenant_id, receipt_id, product_code, name, qty, paid_unit, sale_price, diff_total)
     select $1, $2, $3, $4, $5, $6, $7, $8
      where exists (select 1 from receipt where id = $2 and tenant_id = $1)
     on conflict (tenant_id, receipt_id, product_code)
       do update set qty = excluded.qty, paid_unit = excluded.paid_unit,
                     sale_price = excluded.sale_price, diff_total = excluded.diff_total,
                     claimed_at = now()
     returning id`,
    [v.receiptId, v.productCode, v.name, Math.trunc(v.qty), v.paidUnit, v.salePrice, diff],
  );
  // 아무 행도 안 들어갔으면 그 영수증이 이 판매자 것이 아니다. 조용히 넘기면 사용자는
  // 처리완료를 눌렀는데 목록이 그대로인 이유를 알 수 없다.
  if (wrote.length === 0) throw new Error("이 판매자의 영수증이 아닙니다.");
}

export async function removeClaim(tenantId: string, claimId: string): Promise<void> {
  if (!isUuid(claimId)) return;   // 지울 것이 없다 — 조용히 넘긴다
  await tquery(tenantId, `delete from price_adjust_claim where tenant_id = $1 and id = $2`, [claimId]);
}

export interface ClaimSummary {
  claims: number;
  products: number;
  qty: number;
  recovered: number;
  verified: number;
  firstAt: string | null;
  lastAt: string | null;
}

export interface ClaimMonth {
  month: string;      // 'YYYY-MM'
  claims: number;
  qty: number;
  recovered: number;
}

export interface ClaimProduct {
  product_code: string;
  name: string | null;
  claims: number;
  qty: number;
  recovered: number;
  last_at: string | null;
}

export interface ClaimRow {
  id: string;
  receipt_id: string;
  product_code: string;
  name: string | null;
  qty: number;
  paid_unit: number;
  sale_price: number;
  diff_total: number;
  claimed_at: string;
  verified: boolean;
}

export interface ClaimStats {
  summary: ClaimSummary;
  byMonth: ClaimMonth[];
  byProduct: ClaimProduct[];
  recent: ClaimRow[];
}

/** 대시보드용 집계 — 요약·월별·상품별·최근 목록을 한 번의 왕복으로 받는다. */
export async function loadClaimStats(tenantId: string, months = 12): Promise<ClaimStats> {
  const [row] = await tquery<{
    summary: ClaimSummary;
    by_month: ClaimMonth[];
    by_product: ClaimProduct[];
    recent: ClaimRow[];
  }>(
    tenantId,
    `with c as (
       select * from price_adjust_claim where tenant_id = $1
     ),
     summary as (
       select count(*)::int as claims,
              count(distinct product_code)::int as products,
              coalesce(sum(qty), 0)::int as qty,
              coalesce(sum(diff_total), 0)::float8 as recovered,
              count(verified_refund_id)::int as verified,
              to_char(min(claimed_at), 'YYYY-MM-DD') as "firstAt",
              to_char(max(claimed_at), 'YYYY-MM-DD') as "lastAt"
         from c
     ),
     -- 빈 달도 0 으로 채운다. 안 채우면 막대그래프에서 달이 건너뛰어 추이가 왜곡된다.
     months as (
       select to_char(d, 'YYYY-MM') as month
         from generate_series(
                date_trunc('month', current_date) - make_interval(months => $2::int - 1),
                date_trunc('month', current_date), interval '1 month') d
     ),
     by_month as (
       select m.month,
              coalesce(count(c.id), 0)::int as claims,
              coalesce(sum(c.qty), 0)::int as qty,
              coalesce(sum(c.diff_total), 0)::float8 as recovered
         from months m
         left join c on to_char(c.claimed_at, 'YYYY-MM') = m.month
        group by m.month order by m.month
     ),
     by_product as (
       select product_code, coalesce(max(name), '') as name,
              count(*)::int as claims, sum(qty)::int as qty,
              sum(diff_total)::float8 as recovered,
              to_char(max(claimed_at), 'YYYY-MM-DD') as last_at
         from c group by product_code
     ),
     recent as (
       select id, receipt_id, product_code, name, qty,
              paid_unit::float8 as paid_unit, sale_price::float8 as sale_price,
              diff_total::float8 as diff_total,
              to_char(claimed_at, 'YYYY-MM-DD HH24:MI') as claimed_at,
              (verified_refund_id is not null) as verified
         from c order by claimed_at desc limit 50
     )
     select (select row_to_json(s) from summary s) as summary,
            coalesce((select json_agg(m order by m.month) from by_month m), '[]'::json) as by_month,
            coalesce((select json_agg(p order by p.recovered desc) from by_product p), '[]'::json) as by_product,
            coalesce((select json_agg(r) from recent r), '[]'::json) as recent`,
    [Math.min(Math.max(months, 1), 36)],
  );
  if (!row) throw new Error("차액환불 집계가 아무 행도 돌려주지 않았습니다.");
  return {
    summary: row.summary,
    byMonth: row.by_month,
    byProduct: row.by_product,
    recent: row.recent,
  };
}
