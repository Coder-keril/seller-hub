import Link from "next/link";
import { loadDashboard } from "@/lib/receipt/dashboard";
import { currentTenant, currentMode } from "@/lib/session";
import { aliasLabel, loadAliases } from "@/lib/alias";
import { CloseOnEscape } from "../_components/CloseOnEscape";
import { ReceiptModal, ReceiptNotFoundModal } from "../_components/ReceiptModal";
import { getReceiptDetail } from "@/lib/receipt/query";

export const metadata = { title: "영수증 대시보드" };

/**
 * 오늘 날짜를 **한국 시간으로** 얻는다 (`YYYY-MM-DD`).
 *
 * `new Date()` 를 그대로 쓰면 서버 타임존(운영은 UTC)이 끼어들어 매달 1일 오전 9시 전에는
 * 지난달로 계산된다 — "이번달"이 틀린 달을 가리킨다. `receipt.purchased_at` 이 타임존 없는
 * 벽시계 시각(`timestamp`)이라 비교 대상도 한국 날짜다.
 */
function kstToday(): { y: number; m: number } {
  const [y, m] = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
  })
    .format(new Date())
    .split("-")
    .map(Number);
  return { y: y!, m: m! };
}

const pad = (n: number) => String(n).padStart(2, "0");
/** 그 달의 마지막 날. `Date.UTC(y, m, 0)` 은 m 월의 0일 = 전달 말일이다. */
const monthEnd = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).getUTCDate();

/** 기간 버튼. 날짜 입력칸을 직접 채우지 않고 **주소만** 바꾼다 — 자바스크립트가 필요 없다. */
function periodPresets() {
  const { y, m } = kstToday();
  const prevY = m === 1 ? y - 1 : y;
  const prevM = m === 1 ? 12 : m - 1;
  return [
    { label: "이번달", from: `${y}-${pad(m)}-01`, to: `${y}-${pad(m)}-${pad(monthEnd(y, m))}` },
    { label: "지난달", from: `${prevY}-${pad(prevM)}-01`, to: `${prevY}-${pad(prevM)}-${pad(monthEnd(prevY, prevM))}` },
    { label: "올해", from: `${y}-01-01`, to: `${y}-12-31` },
  ];
}

/**
 * **프리렌더 금지.** 이 화면은 판매자별 DB 데이터를 읽는다. 빌드 시점에 정적 생성하려 하면
 * DATABASE_URL 없이 쿼리를 쳐서 빌드가 깨지고, 설령 돌아도 특정 테넌트 데이터가 정적 파일로
 * 굳어 다른 판매자에게 노출된다. `searchParams` 유무에 의존하지 않고 여기서 못박는다.
 */
export const dynamic = "force-dynamic";

/**
 * 상품별 순구매·평균단가와 거래 라인.
 *
 * **구매 − 환불 netting 이 이 화면의 요점이다.** 남은 재고의 구매 평균단가를 알려면
 * 환불된 수량·금액이 빠져야 한다. 환불 품목이 음수로 저장돼 있어 `sum()` 이 곧 netting 이다.
 *
 * ⚠️ 여기서 말하는 평균단가는 **구매−환불** 기준이다. 오픈마켓으로 **판매된 수량은 아직
 *    빠지지 않는다** — 주문 연동이 붙으면 그때 차감한다.
 */
const won = (n: number | null | undefined) => (n == null ? "—" : Math.round(n).toLocaleString("ko-KR"));

export default async function ReceiptDashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const one = (k: string) => (Array.isArray(sp[k]) ? sp[k]![0] : sp[k]) as string | undefined;

  const f = {
    from: one("from") ?? "",
    to: one("to") ?? "",
    code: one("code") ?? "",
    name: one("name") ?? "",
    member: one("member") ?? "",
    card: one("card") ?? "",
  };
  // 「환불 귀속」·「영수증×상품으로 묶기」는 화면에서 **뺐다**(의뢰인 요청, 2026-10-06).
  // `loadDashboard` 는 기본값(환불일 기준 · 묶지 않음)으로 돈다.
  const hasFilter = Object.values(f).some(Boolean);

  // `pick` = 모달로 열어 둔 상품코드. **왼쪽 필터(`code`)와 별개다** — 모달은 현재 필터를
  // 유지한 채 그 상품만 좁혀 보여준다(원본과 같은 동작).
  const pick = one("pick")?.trim() || "";
  // `receipt` = 영수증 상세 모달. 상품 모달 **위에** 겹쳐 뜬다 — 화면을 떠나지 않는다.
  const receipt = one("receipt")?.trim() || "";

  const tenant = await currentTenant();
  const mode = await currentMode(tenant.id);
  const alias = await loadAliases(tenant.id);
  const [d, picked, detail] = await Promise.all([
    loadDashboard(tenant.id, f),
    pick ? loadDashboard(tenant.id, { ...f, code: pick }) : null,
    receipt ? getReceiptDetail(tenant.id, receipt) : null,
  ]);
  const s = d.summary;
  const pickedName = pick
    ? (picked?.byProduct[0]?.name || d.byProduct.find((x) => x.product_code === pick)?.name || "")
    : "";

  /**
   * 기간만 바꾸고 나머지 필터는 유지한다. 빈 문자열을 주면 기간이 풀린다(= 전체 기간).
   * `url()` 은 빈 값을 건너뛰어 기존 값을 지울 수 없으므로 별도로 둔다.
   */
  const periodHref = (from: string, to: string) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...f, from, to })) if (v) p.set(k, v);
    const t = p.toString();
    return t ? `/receipt-dashboard?${t}` : "/receipt-dashboard";
  };

  /** 현재 필터를 유지한 주소. `extra` 로 `pick` 을 넣거나 비워서 모달을 닫는다. */
  const url = (extra: Record<string, string>) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(f)) if (v) p.set(k, v);
    for (const [k, v] of Object.entries(extra)) if (v) p.set(k, v);
    const t = p.toString();
    return t ? `/receipt-dashboard?${t}` : "/receipt-dashboard";
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">영수증 대시보드</h1>
        <p className="mt-1 text-sm text-gray-600">
          구매에서 환불을 뺀 <b>순수량·순금액</b>과 그에 따른 <b>구매 평균단가</b>입니다.
          오픈마켓으로 판매된 수량은 아직 차감되지 않습니다.
        </p>
      </div>

      {/* 기간 버튼 — 링크라서 폼 밖에 있다. 폼 안에 두면 submit 과 섞인다. */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-gray-500">기간</span>
        <div className="inline-flex overflow-hidden rounded-lg border border-gray-300">
          {periodPresets().map((p) => {
            const on = f.from === p.from && f.to === p.to;
            return (
              <Link
                key={p.label}
                href={periodHref(p.from, p.to)}
                className={`px-3 py-1.5 text-sm ${
                  on ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {p.label}
              </Link>
            );
          })}
          <Link
            href={periodHref("", "")}
            className={`px-3 py-1.5 text-sm ${
              !f.from && !f.to ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            전체
          </Link>
        </div>
      </div>

      <form method="get" className="flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 bg-white p-4">
        <Field label="시작일"><input type="date" name="from" defaultValue={f.from} className="rounded border border-gray-300 px-2 py-1.5 text-sm" /></Field>
        <Field label="종료일"><input type="date" name="to" defaultValue={f.to} className="rounded border border-gray-300 px-2 py-1.5 text-sm" /></Field>
        <Field label="상품코드"><input name="code" defaultValue={f.code} placeholder="631244" className="w-28 rounded border border-gray-300 px-2 py-1.5 text-sm" /></Field>
        <Field label="상품명"><input name="name" defaultValue={f.name} placeholder="트레비" className="w-32 rounded border border-gray-300 px-2 py-1.5 text-sm" /></Field>
        <Field label="회원번호"><input name="member" defaultValue={f.member} className="w-36 rounded border border-gray-300 px-2 py-1.5 text-sm" /></Field>
        <Field label="카드번호"><input name="card" defaultValue={f.card} className="w-36 rounded border border-gray-300 px-2 py-1.5 text-sm" /></Field>
        <button type="submit" className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700">조회</button>
        {hasFilter && (
          <Link href="/receipt-dashboard" className="pb-2 text-sm text-gray-400 hover:text-gray-700">초기화</Link>
        )}
      </form>

      <div className="flex flex-wrap gap-6 rounded-lg border border-gray-200 bg-white p-4">
        <Figure label="구매" value={`${won(s.purchase_amt)}원`} sub={`${s.purchase_receipts}건 · ${won(s.purchase_qty)}개`} />
        <Figure label="환불" value={`${won(s.refund_amt)}원`} sub={`${s.refund_receipts}건 · ${won(s.refund_qty)}개`} />
        <Figure label="순금액" value={`${won(s.net_amt)}원`} sub={`순수량 ${won(s.net_qty)}개`} strong />
        <Figure label="평균단가" value={s.avg_unit == null ? "—" : `${won(s.avg_unit)}원`} sub="순금액 ÷ 순수량" strong />
        <div className="ml-auto self-end text-xs text-gray-400">
          발송 {mode === "SELF" ? "직접" : "메리코코 위임"}
        </div>
      </div>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-gray-900">상품별 ({d.byProduct.length}종)</h2>
        {d.byProduct.length === 0 ? (
          <Empty />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full text-xs">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-2 py-2">상품코드</th>
                  <th className="px-2 py-2">상품명</th>
                  <th className="px-2 py-2 text-right">구매</th>
                  <th className="px-2 py-2 text-right">환불</th>
                  <th className="px-2 py-2 text-right">순수량</th>
                  <th className="px-2 py-2 text-right">순금액</th>
                  <th className="px-2 py-2 text-right">평균단가</th>
                  <th className="px-2 py-2">최근</th>
                </tr>
              </thead>
              <tbody>
                {d.byProduct.map((p) => (
                  <tr key={p.product_code} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="tabular px-2 py-1.5">
                      <Link href={url({ pick: p.product_code })} className="text-blue-700 hover:underline">
                        {p.product_code}
                      </Link>
                    </td>
                    <td className="px-2 py-1.5">{p.name || "—"}</td>
                    <td className="tabular px-2 py-1.5 text-right">{won(p.purchase_qty)}</td>
                    <td className="tabular px-2 py-1.5 text-right text-amber-700">
                      {p.refund_qty ? won(p.refund_qty) : ""}
                    </td>
                    <td className="tabular px-2 py-1.5 text-right font-semibold">{won(p.net_qty)}</td>
                    <td className="tabular px-2 py-1.5 text-right">{won(p.net_amt)}</td>
                    <td className="tabular px-2 py-1.5 text-right font-semibold text-blue-700">{won(p.avg_unit)}</td>
                    <td className="tabular px-2 py-1.5 text-gray-500">{p.last_at?.slice(0, 10) ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-gray-900">
          거래 라인 ({d.lines.length}건{d.lines.length >= 2000 && " — 상한 도달, 기간을 좁히세요"})
        </h2>
        {d.lines.length === 0 ? (
          <Empty />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full text-xs">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-2 py-2">구분</th>
                  <th className="px-2 py-2">일시</th>
                  <th className="px-2 py-2">상품코드</th>
                  <th className="px-2 py-2">상품명</th>
                  <th className="px-2 py-2 text-right">수량</th>
                  <th className="px-2 py-2 text-right">단가</th>
                  <th className="px-2 py-2 text-right">금액</th>
                  <th className="px-2 py-2 text-right">쿠폰</th>
                  <th className="px-2 py-2">회원</th>
                  <th className="px-2 py-2">카드</th>
                  <th className="px-2 py-2">승인</th>
                  <th className="px-2 py-2">원거래일</th>
                </tr>
              </thead>
              <tbody>
                {d.lines.map((l, i) => (
                  <tr key={`${l.receipt_id}-${l.line_no ?? "g"}-${l.product_code}-${i}`} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-2 py-1.5">
                      {l.kind === "REFUND" ? <span className="text-amber-700">환불</span> : "구매"}
                    </td>
                    <td className="tabular px-2 py-1.5">{l.purchased_at.replace("T", " ")}</td>
                    <td className="tabular px-2 py-1.5">{l.product_code}</td>
                    <td className="max-w-[12rem] truncate px-2 py-1.5" title={l.name ?? ""}>{l.name ?? "—"}</td>
                    <td className="tabular px-2 py-1.5 text-right">{l.qty}</td>
                    <td className="tabular px-2 py-1.5 text-right">{won(l.unit_price)}</td>
                    <td className="tabular px-2 py-1.5 text-right">{won(l.net_amt)}</td>
                    <td className="tabular px-2 py-1.5 text-right text-red-600">{l.coupon ? won(l.coupon) : ""}</td>
                    <td className="tabular px-2 py-1.5">{aliasLabel(alias.member, l.member_no)}</td>
                    <td className="tabular px-2 py-1.5 text-gray-500">{aliasLabel(alias.card, l.card_number_masked)}</td>
                    <td className="tabular px-2 py-1.5">{l.approval_no ?? "—"}</td>
                    <td className="tabular px-2 py-1.5">{l.original_date ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── 상품코드 모달 — 그 상품의 거래만 좁혀 본다 ───────── */}
      {pick && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <CloseOnEscape href={url({})} />
          {/* 배경. 누르면 닫힌다. */}
          <Link href={url({})} aria-label="닫기" className="fixed inset-0 bg-black/40" />

          <div
            role="dialog"
            aria-modal="true"
            aria-label={`거래 상세 ${pickedName || pick}`}
            className="relative flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-xl"
          >
            {/* 머리 — 고정. 본문만 스크롤한다. */}
            <div className="border-b border-gray-200 px-4 py-2">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-gray-800">
                  거래 상세 · {pickedName || "(이름 없음)"}{" "}
                  <span className="tabular text-gray-400">({pick})</span>
                </div>
                <Link href={url({})} className="shrink-0 text-gray-400 hover:text-gray-700" aria-label="닫기">
                  ✕
                </Link>
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs">
                <Link href={`/receipt-dashboard?code=${pick}`} className="text-blue-700 hover:underline">
                  이 상품만 전체 화면으로 →
                </Link>
              </div>
            </div>

            {/* 요약 — 그 상품에 한정된 집계다. */}
            {picked && (
              <div className="flex flex-wrap gap-x-5 gap-y-1 border-b border-gray-100 px-4 py-2 text-xs text-gray-600">
                <span>
                  구매 <b className="tabular text-blue-700">{won(picked.summary.purchase_qty)}개</b> ·{" "}
                  {won(picked.summary.purchase_amt)}원
                </span>
                <span>
                  환불 <b className="tabular text-amber-700">{won(picked.summary.refund_qty)}개</b> ·{" "}
                  {won(picked.summary.refund_amt)}원
                </span>
                <span>순수량 <b className="tabular text-emerald-700">{won(picked.summary.net_qty)}개</b></span>
                <span>순금액 <b className="tabular">{won(picked.summary.net_amt)}원</b></span>
                <span>
                  평균단가{" "}
                  <b className="tabular text-blue-700">
                    {picked.summary.avg_unit == null ? "—" : `${won(picked.summary.avg_unit)}원`}
                  </b>
                </span>
              </div>
            )}

            {/* 본문 — 그 상품의 거래 라인. */}
            <div className="overflow-auto p-3">
              {!picked || picked.lines.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-400">
                  현재 조건에 이 상품의 거래가 없습니다.
                </p>
              ) : (
                <table className="min-w-full text-xs">
                  <thead className="bg-gray-50 text-left text-gray-500">
                    <tr>
                      <th className="px-2 py-2">구분</th>
                      <th className="px-2 py-2">일시</th>
                      <th className="px-2 py-2 text-right">수량</th>
                      <th className="px-2 py-2 text-right">단가</th>
                      <th className="px-2 py-2 text-right">금액</th>
                      <th className="px-2 py-2 text-right">쿠폰</th>
                      <th className="px-2 py-2">회원</th>
                      <th className="px-2 py-2">카드</th>
                      <th className="px-2 py-2">승인</th>
                      <th className="px-2 py-2">원거래일</th>
                      <th className="px-2 py-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {picked.lines.map((l, i) => (
                      <tr
                        key={`${l.receipt_id}-${l.line_no ?? "g"}-${i}`}
                        className="border-t border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-2 py-1.5">
                          {l.kind === "REFUND" ? <span className="text-amber-700">환불</span> : "구매"}
                        </td>
                        <td className="tabular whitespace-nowrap px-2 py-1.5">
                          {l.purchased_at.replace("T", " ").slice(0, 16)}
                        </td>
                        <td className={`tabular px-2 py-1.5 text-right ${l.qty < 0 ? "text-red-600" : ""}`}>
                          {l.qty}
                        </td>
                        <td className="tabular px-2 py-1.5 text-right">{won(l.unit_price)}</td>
                        <td className={`tabular px-2 py-1.5 text-right ${l.net_amt < 0 ? "text-red-600" : ""}`}>
                          {won(l.net_amt)}
                        </td>
                        <td className="tabular px-2 py-1.5 text-right text-red-600">
                          {l.coupon ? won(l.coupon) : ""}
                        </td>
                        <td className="tabular px-2 py-1.5">{aliasLabel(alias.member, l.member_no)}</td>
                        <td className="tabular px-2 py-1.5 text-gray-500">{aliasLabel(alias.card, l.card_number_masked)}</td>
                        <td className="tabular px-2 py-1.5">{l.approval_no ?? "—"}</td>
                        <td className="tabular px-2 py-1.5">{l.original_date ?? "—"}</td>
                        <td className="px-2 py-1.5 text-right">
                          {/* 같은 화면에서 공용 영수증 모달을 띄운다 — 화면을 떠나지 않는다. */}
                          <Link
                            href={url({ pick, receipt: l.receipt_id })}
                            className="text-blue-700 hover:underline"
                            title="이 거래가 담긴 영수증 보기"
                          >
                            영수증
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── 영수증 상세 모달 — 내역 화면과 **같은 컴포넌트**다 ───── */}
      {receipt && detail && (
        <ReceiptModal detail={detail} alias={alias} closeHref={url({ pick })} z="z-[60]" />
      )}
      {receipt && !detail && <ReceiptNotFoundModal closeHref={url({ pick })} z="z-[60]" />}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-gray-700">{label}</span>
      {children}
    </label>
  );
}

function Figure({ label, value, sub, strong }: { label: string; value: string; sub?: string; strong?: boolean }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className={`tabular ${strong ? "text-2xl font-semibold text-gray-900" : "text-lg text-gray-800"}`}>{value}</div>
      {sub && <div className="tabular text-xs text-gray-400">{sub}</div>}
    </div>
  );
}

function Empty() {
  return (
    <p className="rounded-lg border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
      조건에 맞는 데이터가 없습니다.
    </p>
  );
}
