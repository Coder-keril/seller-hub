// 영수증 저장 SQL 을 만드는 **단 하나의 지점**. 런타임 import 가 없어 순수하다 —
// 그래서 `sql/check.mjs` 가 Node 로 직접 불러 pglite 에 같은 SQL 을 돌릴 수 있다.
// (SQL 을 check 쪽에 복사해 두면 조용히 갈라진다.)
import type { ReceiptPayload } from "./payload";

/**
 * 품목 한 줄의 **실지불액**. 쿠폰을 빼지 않으면 평균단가가 과대 계상된다
 * (실측: 쿠폰 96,000원만큼 어긋나 개당 8,000원이 부풀었다).
 * 영수증의 네 번째 검산과 같은 식이다 — 품목 금액 합 − 쿠폰 합 = 합계.
 * 환불은 amount·coupon 이 둘 다 음수라 같은 식이 그대로 성립한다.
 *
 * `i` 는 receipt_item 별칭이다. dashboard.ts 와 sql/check.mjs 가 같은 값을 쓴다.
 */
export const NET_AMT_SQL = "coalesce(i.amount, 0) - coalesce(i.coupon_discount, 0)";

const HEADER_COLS = [
  "member_no", "purchased_at", "register", "approval_no", "original_approval_no",
  "cash_approval_no", "original_date", "payment_type", "payment_method",
  "tax_free", "taxable", "vat", "total", "coupon_total", "item_count",
  "card_amount", "cash_amount", "reward_amount", "change_amount",
  "approved_amount", "installment_months", "card_number_masked", "card_brand",
  "reconciled", "qty_ok", "coupon_ok", "tax_ok", "amount_ok", "raw_text",
] as const;

const ITEM_COLS = [
  "line_no", "product_code", "name", "qty", "unit_price", "amount",
  "coupon_code", "coupon_qty", "coupon_unit_discount", "coupon_discount",
] as const;

/**
 * 저장에 쓰는 SQL 을 **한 곳에서** 만든다.
 *
 * `sql/check.mjs` 가 이 함수가 내놓은 문장을 pglite 에 그대로 실행해 멱등성·중복차단을
 * 검증한다. check 쪽에 SQL 을 복사해 두면 조용히 갈라지므로 반드시 여기를 거친다.
 *
 * ⚠️ 헤더 params 에는 **tenantId 가 들어있지 않다** — `ttx` 의 `q` 가 `$1` 로 넣는다.
 *    pglite 에서 직접 돌릴 때는 호출자가 앞에 붙여야 한다.
 */
export function receiptStatements(payload: ReceiptPayload, kind: "PURCHASE" | "REFUND") {
  const headerPlaceholders = HEADER_COLS.map((_, i) => `$${i + 3}`).join(", ");
  const updateSet = HEADER_COLS.map((c) => `${c} = excluded.${c}`).join(", ");

  const itemValues: unknown[] = [];
  const tuples = payload.items.map((it) => {
    const base = itemValues.length + 1; // $1 은 receipt_id
    itemValues.push(...ITEM_COLS.map((c) => it[c]));
    return `($1, ${ITEM_COLS.map((_, i) => `$${base + i + 1}`).join(", ")})`;
  });

  return {
    header: {
      sql: `insert into receipt (tenant_id, kind, ${HEADER_COLS.join(", ")})
            values ($1, $2, ${headerPlaceholders})
            on conflict (tenant_id, purchased_at, register)
              do update set kind = excluded.kind, ${updateSet}, updated_at = now()
            returning id, (xmax = 0) as inserted`,
      params: [kind, ...HEADER_COLS.map((c) => payload[c])] as unknown[],
    },
    deleteItems: { sql: `delete from receipt_item where receipt_id = $1` },
    insertItems: payload.items.length
      ? {
          sql: `insert into receipt_item (receipt_id, ${ITEM_COLS.join(", ")}) values ${tuples.join(", ")}`,
          params: itemValues,
        }
      : null,
  };
}
