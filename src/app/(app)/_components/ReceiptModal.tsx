import Link from "next/link";
import type { ReceiptDetail, ReceiptKind } from "@/lib/receipt/query";
import { aliasLabel, NO_ALIAS, type AliasMaps } from "@/lib/alias";
import { CloseOnEscape } from "./CloseOnEscape";

/**
 * 영수증 상세 모달 — **영수증을 보는 유일한 화면이다.**
 *
 * 내역(`/receipts`)과 대시보드(`/receipt-dashboard`)가 같은 것을 쓴다. 두 곳에 따로 두면
 * 필드 하나를 더할 때 한쪽을 잊는다.
 *
 * 서버 컴포넌트다 — 열림 여부가 URL 에 있어 상태가 필요 없다. 배경·✕·뒤로가기로 닫히고,
 * Esc 만 `CloseOnEscape`(클라이언트)가 맡는다.
 *
 * `z` 를 받는 이유: 대시보드에서는 **상품 모달 위에** 겹쳐 떠야 한다.
 */
const won = (v: string | number | null | undefined) =>
  v == null || v === "" ? "—" : Number(v).toLocaleString("ko-KR");

const neg = (v: string | number | null | undefined) => (Number(v) < 0 ? "text-red-600" : "");

const dt = (s: string) => s.replace("T", " ").slice(0, 16);

/**
 * 원문을 내놓기 전에 **줄바꿈을 정규화**한다.
 *
 * 원문은 CRLF 다(윈도우에서 만든 .txt). HTML 파서는 문자 데이터의 CR·CRLF 를 LF 로 바꾸고
 * `<pre>` 는 여는 태그 직후의 개행 한 개를 먹는다. 맞춰 보내지 않으면 서버 HTML 과 브라우저가
 * 파싱한 DOM 이 달라져 **하이드레이션이 깨진다**(실제로 깨졌다). 저장된 `raw_text` 는 그대로 둔다.
 */
const preText = (t: string) => t.replace(/\r\n?/g, "\n").replace(/^\n+/, "");

export function KindBadge({ kind }: { kind: ReceiptKind }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold text-white ${
        kind === "REFUND" ? "bg-amber-500" : "bg-slate-700"
      }`}
    >
      {kind === "REFUND" ? "환불" : "구매"}
    </span>
  );
}

export function ReceiptModal({
  detail,
  closeHref,
  z = "z-50",
  alias = NO_ALIAS,
}: {
  detail: ReceiptDetail;
  closeHref: string;
  z?: string;
  /** 번호 별명(설정 > 번호 별명). 넘기지 않으면 번호만 보인다. */
  alias?: AliasMaps;
}) {
  const h = detail.header;

  return (
    <div className={`fixed inset-0 ${z} flex items-center justify-center p-4`}>
      <CloseOnEscape href={closeHref} />
      {/* 배경. 누르면 닫힌다. */}
      <Link href={closeHref} aria-label="닫기" className="fixed inset-0 bg-black/40" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`영수증 ${h.kind === "REFUND" ? "환불" : "구매"} ${dt(h.purchased_at)}`}
        className="relative flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-xl"
      >
        {/* 머리 — 고정. 본문만 스크롤한다. */}
        <div className="border-b border-gray-200 px-4 py-2">
          <div className="flex flex-wrap items-center gap-2">
            <KindBadge kind={h.kind} />
            <span className="text-sm font-semibold text-gray-900">
              {h.approval_no ? `승인번호 ${h.approval_no}` : "현금 (승인번호 없음)"}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold text-white ${
                h.reconciled ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {h.reconciled ? "검증 통과" : "검증 실패"}
            </span>
            <Link href={closeHref} className="ml-auto text-gray-400 hover:text-gray-700" aria-label="닫기">
              ✕
            </Link>
          </div>
        </div>

        <div className="overflow-auto">
          {/* 요약 */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 border-b border-gray-100 px-4 py-3 text-sm sm:grid-cols-3">
            <span>
              {h.kind === "REFUND" ? "처리일시" : "구매일시"} <b>{dt(h.purchased_at)}</b>
            </span>
            {h.kind === "REFUND" && <span>원구매일 <b>{h.original_date ?? "—"}</b></span>}
            {h.original_approval_no && (
              <span>원승인번호 <b className="tabular">{h.original_approval_no}</b></span>
            )}
            <span>회원번호 <b className="tabular">{aliasLabel(alias.member, h.member_no)}</b></span>
            <span>매장(REG) <b>{h.register ?? "—"}</b></span>
            <span>총 상품수 <b className="tabular">{h.item_count ?? "—"}</b></span>
            <span>면세 <b className="tabular">{won(h.tax_free)}</b></span>
            <span>과세 <b className="tabular">{won(h.taxable)}</b></span>
            <span>부가세 <b className="tabular">{won(h.vat)}</b></span>
            <span>
              합계{" "}
              <b className={`tabular ${Number(h.total) < 0 ? "text-red-600" : "text-blue-700"}`}>
                {won(h.total)}
              </b>
            </span>
            <span>쿠폰합계 <b className="tabular">{won(h.coupon_total)}</b></span>
            <span>
              결제{" "}
              <b>
                {h.payment_method === "복합"
                  ? "복합"
                  : h.payment_method === "card"
                    ? "카드"
                    : h.payment_method === "cash"
                      ? "현금"
                      : h.payment_method === "reward"
                        ? "포인트"
                        : "—"}
              </b>
            </span>
            {h.card_amount != null && <span>카드 <b className="tabular">{won(h.card_amount)}</b></span>}
            {h.cash_amount != null && <span>현금 <b className="tabular">{won(h.cash_amount)}</b></span>}
            {h.reward_amount != null && <span>포인트 <b className="tabular">{won(h.reward_amount)}</b></span>}
            {h.cash_approval_no && <span>현금승인 <b className="tabular">{h.cash_approval_no}</b></span>}
            <span>
              승인금액 <b className="tabular">{won(h.approved_amount)}</b> {h.card_brand ?? ""}
            </span>
            <span className="col-span-2 text-xs text-gray-400 sm:col-span-3">
              카드번호 {aliasLabel(alias.card, h.card_number_masked)} · 할부 {h.installment_months ?? 0}개월 · 검산 수량
              {h.qty_ok ? "✓" : "✗"} 쿠폰{h.coupon_ok ? "✓" : "✗"} 세금{h.tax_ok ? "✓" : "✗"} 금액
              {h.amount_ok ? "✓" : "✗"}
            </span>
          </div>

          {/* 내역 */}
          <div className="overflow-x-auto p-3">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="w-8 px-2 py-1">#</th>
                  <th className="px-2 py-1">상품명</th>
                  <th className="px-2 py-1">상품코드</th>
                  <th className="px-2 py-1 text-right">수량</th>
                  <th className="px-2 py-1 text-right">단가</th>
                  <th className="px-2 py-1 text-right">금액</th>
                  <th className="px-2 py-1">쿠폰</th>
                  <th className="px-2 py-1 text-right">할인</th>
                </tr>
              </thead>
              <tbody>
                {detail.items.map((it) => (
                  <tr key={it.line_no} className="border-t border-gray-100">
                    <td className="px-2 py-1 text-gray-400">{it.line_no}</td>
                    <td className="px-2 py-1">
                      {it.name ?? <span className="text-red-500">(이름 없음)</span>}
                    </td>
                    <td className="tabular px-2 py-1">{it.product_code}</td>
                    <td className={`tabular px-2 py-1 text-right ${neg(it.qty)}`}>{it.qty}</td>
                    <td className="tabular px-2 py-1 text-right">{won(it.unit_price)}</td>
                    <td className={`tabular px-2 py-1 text-right ${neg(it.amount)}`}>{won(it.amount)}</td>
                    <td className="tabular px-2 py-1 text-gray-500">{it.coupon_code ?? ""}</td>
                    <td className="tabular px-2 py-1 text-right text-red-600">
                      {it.coupon_discount ? `-${won(it.coupon_discount)}` : ""}
                    </td>
                  </tr>
                ))}
                {detail.items.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-2 py-4 text-center text-gray-400">
                      내역 없음
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 원문 — 자바스크립트 없이 접고 펼치려고 <details> 를 쓴다. */}
          <details className="mx-3 mb-3 rounded-lg border border-gray-200 p-3">
            <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900">
              영수증 원문 보기
            </summary>
            <pre className="mt-2 max-h-80 overflow-auto whitespace-pre-wrap rounded bg-gray-50 p-2 font-mono text-xs text-gray-700">
              {preText(h.raw_text)}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
}

/** 영수증을 찾지 못했을 때. 모달 자리를 그대로 쓴다 — 빈 화면보다 낫다. */
export function ReceiptNotFoundModal({ closeHref, z = "z-50" }: { closeHref: string; z?: string }) {
  return (
    <div className={`fixed inset-0 ${z} flex items-center justify-center p-4`}>
      <CloseOnEscape href={closeHref} />
      <Link href={closeHref} aria-label="닫기" className="fixed inset-0 bg-black/40" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="영수증을 찾을 수 없습니다"
        className="relative w-full max-w-md rounded-xl bg-white p-5 shadow-xl"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-sm font-semibold text-gray-900">영수증을 찾을 수 없습니다</h2>
          <Link href={closeHref} className="text-gray-400 hover:text-gray-700" aria-label="닫기">
            ✕
          </Link>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          주소가 오래되었거나 지워진 영수증일 수 있습니다.
        </p>
      </div>
    </div>
  );
}
