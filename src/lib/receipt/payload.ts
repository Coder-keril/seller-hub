/**
 * 파싱 결과 → 저장용 평탄 페이로드(헤더 전 항목 + 상세 배열).
 *
 * **순수 함수다.** DB 를 보지 않으므로 저장 계층이 MSSQL 이든 Postgres 든 그대로 쓴다.
 * merrycoco-admin 에서 이식할 때 `saveReceipt()`(MSSQL SP 호출)만 떼어내고 이 함수만 가져왔다 —
 * 저장은 Postgres 로 다시 쓴다.
 *
 * 상세는 **영수증 원본 줄 그대로**다(집계하지 않고 쿠폰만 평탄화). 집계는 조회 쪽에서 한다.
 * `reconciled=false` 인 영수증도 그대로 담되 검증 플래그를 보존한다 — 버리면 왜 틀렸는지
 * 되짚을 수 없다.
 */
import type { ParsedReceipt } from "./parse";

export interface ReceiptItemPayload {
  line_no: number;
  product_code: string;
  name: string | null;
  qty: number;
  unit_price: number | null;
  amount: number | null;
  coupon_code: string | null;
  coupon_qty: number | null;
  coupon_unit_discount: number | null;
  coupon_discount: number | null;
}

export interface ReceiptPayload {
  member_no: string | null;
  approval_no: string | null;
  original_approval_no: string | null;
  cash_approval_no: string | null;
  purchased_at: string | null;
  original_date: string | null;
  register: string | null;
  payment_type: string | null;
  tax_free: number | null;
  taxable: number | null;
  vat: number | null;
  total: number | null;
  coupon_total: number | null;
  item_count: number | null;
  payment_method: string | null;
  card_amount: number | null;
  cash_amount: number | null;
  reward_amount: number | null;
  change_amount: number | null;
  approved_amount: number | null;
  installment_months: number | null;
  card_number_masked: string | null;
  card_brand: string | null;
  reconciled: boolean;
  qty_ok: boolean;
  coupon_ok: boolean;
  tax_ok: boolean;
  amount_ok: boolean;
  raw_text: string;
  items: ReceiptItemPayload[];
}

export function buildReceiptPayload(parsed: ParsedReceipt, rawText: string): ReceiptPayload {
  const s = parsed.summary;
  const p = parsed.payment;
  const c = parsed.checks;
  // 텐더별 금액(분할결제 대응). payment_method = 단일이면 card/cash/reward, 2개 이상이면 '복합'.
  const methods = [
    s.card != null && "card",
    s.cash != null && "cash",
    s.reward != null && "reward",
  ].filter(Boolean) as string[];
  return {
    member_no: parsed.member_no,
    approval_no: p.approval_no,                        // 대표 승인(카드 있으면 카드, 순수 현금이면 현금)
    original_approval_no: parsed.original_approval_no, // 원승인번호(환불→원구매 링크)
    cash_approval_no: parsed.cash_approval_no,         // 분할결제 시 현금영수증 승인번호
    purchased_at: parsed.purchased_at,
    original_date: parsed.original_date,               // 구매는 null (환불에서만 쓴다)
    register: parsed.register,
    payment_type: p.type,
    tax_free: s.tax_free, taxable: s.taxable, vat: s.vat, total: s.total,
    coupon_total: s.coupon_total, item_count: s.item_count,
    payment_method: methods.length > 1 ? "복합" : methods[0] ?? null,
    card_amount: s.card, cash_amount: s.cash, reward_amount: s.reward,
    change_amount: s.change,
    approved_amount: p.approved_amount, installment_months: p.installment_months,
    card_number_masked: p.card_number_masked, card_brand: p.card_brand,
    reconciled: parsed.reconciled,
    qty_ok: c.qty_ok, coupon_ok: c.coupon_ok, tax_ok: c.tax_ok, amount_ok: c.amount_ok,
    raw_text: rawText,
    items: parsed.items.map((it, i) => ({
      line_no: i + 1,
      product_code: it.product_code,
      name: it.name,
      qty: it.qty,
      unit_price: it.unit_price,
      amount: it.amount,
      coupon_code: it.coupon?.code ?? null,
      coupon_qty: it.coupon?.qty ?? null,
      coupon_unit_discount: it.coupon?.unit_discount ?? null,
      coupon_discount: it.coupon?.discount ?? null,
    })),
  };
}
