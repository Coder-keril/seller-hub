// 저장한 영수증 조회 — 목록과 상세. 읽기 전용.
//
// 원본(merrycoco-admin)은 MSSQL 저장 프로시저 두 개(`SP_ListCostcoReceipts`,
// `SP_GetCostcoReceipt`)를 거쳤다. 여기서는 SQL 을 직접 쓴다 — 구매·환불이 한 테이블이라
// 원본이 하던 UNION 이 필요 없다.
//
// ⚠️ `purchased_at` 은 `timestamp`(타임존 없음)다. node-postgres 가 Date 로 바꾸면 서버
//    타임존이 끼어들어 영수증에 찍힌 시각과 달라진다. 그래서 **SQL 에서 문자열로 뽑는다.**
import { tquery, isUuid } from "../db";

export type ReceiptKind = "PURCHASE" | "REFUND";

/** 영수증에 찍힌 벽시계 시각을 그대로 문자열로 — tz 변환이 끼어들 틈을 주지 않는다. */
const AT = `to_char(r.purchased_at, 'YYYY-MM-DD"T"HH24:MI:SS')`;

export interface ReceiptListRow {
  id: string;
  kind: ReceiptKind;
  approval_no: string | null;
  purchased_at: string;
  original_date: string | null;
  total: string | null;
  item_count: number | null;
  reconciled: boolean;
  register: string | null;
  card_brand: string | null;
  member_no: string;
  line_count: number;
}

export interface ReceiptListFilters {
  kind?: string | null;
  q?: string | null;
  limit?: number;
}

/** 목록 — 구분 필터 + 검색(승인번호·회원번호·일시), 최신순. */
export async function listReceipts(
  tenantId: string,
  f: ReceiptListFilters = {},
): Promise<ReceiptListRow[]> {
  const kind = f.kind === "PURCHASE" || f.kind === "REFUND" ? f.kind : null;
  const q = f.q?.trim() || null;
  const limit = Math.min(Math.max(f.limit ?? 100, 1), 500);

  return tquery<ReceiptListRow>(
    tenantId,
    `select r.id, r.kind::text as kind, r.approval_no,
            ${AT} as purchased_at,
            to_char(r.original_date, 'YYYY-MM-DD') as original_date,
            r.total::text as total, r.item_count, r.reconciled, r.register,
            r.card_brand, r.member_no,
            (select count(*)::int from receipt_item i where i.receipt_id = r.id) as line_count
       from receipt r
      where r.tenant_id = $1
        and ($2::text is null or r.kind::text = $2)
        and ($3::text is null or r.approval_no ilike '%' || $3 || '%'
                              or r.member_no ilike '%' || $3 || '%'
                              or ${AT} ilike '%' || $3 || '%')
      order by r.purchased_at desc
      limit $4`,
    [kind, q, limit],
  );
}

export interface ReceiptDetailHeader extends ReceiptListRow {
  original_approval_no: string | null;
  cash_approval_no: string | null;
  payment_type: string | null;
  payment_method: string | null;
  tax_free: string | null;
  taxable: string | null;
  vat: string | null;
  coupon_total: string | null;
  card_amount: string | null;
  cash_amount: string | null;
  reward_amount: string | null;
  change_amount: string | null;
  approved_amount: string | null;
  installment_months: number | null;
  card_number_masked: string | null;
  qty_ok: boolean;
  coupon_ok: boolean;
  tax_ok: boolean;
  amount_ok: boolean;
  raw_text: string;
}

export interface ReceiptDetailItem {
  line_no: number;
  product_code: string;
  name: string | null;
  qty: number;
  unit_price: string | null;
  amount: string | null;
  coupon_code: string | null;
  coupon_discount: string | null;
}

export interface ReceiptDetail {
  header: ReceiptDetailHeader;
  items: ReceiptDetailItem[];
}

/**
 * 상세 — 헤더 1건 + 품목 N건. 없으면 null.
 *
 * `id` 는 URL 에서 오므로 **uuid 가 아닐 수 있다.** 그대로 쿼리에 넣으면 Postgres 가
 * 예외를 던져 화면이 죽으니, 모양이 아니면 "없음"으로 다룬다.
 */
export async function getReceiptDetail(
  tenantId: string,
  id: string,
): Promise<ReceiptDetail | null> {
  if (!isUuid(id)) return null;

  const [header] = await tquery<ReceiptDetailHeader>(
    tenantId,
    `select r.id, r.kind::text as kind, r.approval_no, r.original_approval_no, r.cash_approval_no,
            ${AT} as purchased_at,
            to_char(r.original_date, 'YYYY-MM-DD') as original_date,
            r.register, r.member_no, r.payment_type, r.payment_method,
            r.tax_free::text, r.taxable::text, r.vat::text, r.total::text,
            r.coupon_total::text, r.item_count,
            r.card_amount::text, r.cash_amount::text, r.reward_amount::text,
            r.change_amount::text, r.approved_amount::text, r.installment_months,
            r.card_number_masked, r.card_brand,
            r.reconciled, r.qty_ok, r.coupon_ok, r.tax_ok, r.amount_ok, r.raw_text,
            (select count(*)::int from receipt_item i where i.receipt_id = r.id) as line_count
       from receipt r
      where r.tenant_id = $1 and r.id = $2`,
    [id],
  );
  if (!header) return null;

  // 상세는 부모를 확인한 뒤 읽는다 — 위 쿼리가 tenant 범위에서 헤더를 찾았으므로 id 는 안전하다.
  const items = await tquery<ReceiptDetailItem>(
    tenantId,
    `select i.line_no, i.product_code, i.name, i.qty,
            i.unit_price::text, i.amount::text, i.coupon_code, i.coupon_discount::text
       from receipt_item i
       join receipt r on r.id = i.receipt_id
      where r.tenant_id = $1 and i.receipt_id = $2
      order by i.line_no`,
    [id],
  );
  return { header, items };
}
