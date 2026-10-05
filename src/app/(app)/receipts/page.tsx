import Link from "next/link";
import { listReceipts, getReceiptDetail } from "@/lib/receipt/query";
import { currentTenant } from "@/lib/session";
import { aliasLabel, loadAliases } from "@/lib/alias";
import { KindBadge, ReceiptModal, ReceiptNotFoundModal } from "../_components/ReceiptModal";

export const metadata = { title: "영수증 내역" };

/**
 * **프리렌더 금지.** 이 화면은 판매자별 DB 데이터를 읽는다. 빌드 시점에 정적 생성하려 하면
 * DATABASE_URL 없이 쿼리를 쳐서 빌드가 깨지고, 설령 돌아도 특정 테넌트 데이터가 정적 파일로
 * 굳어 다른 판매자에게 노출된다. `searchParams` 유무에 의존하지 않고 여기서 못박는다.
 */
export const dynamic = "force-dynamic";

/**
 * 저장한 영수증 목록. 읽기 전용.
 *
 * 목록 구성은 `merrycoco-admin` 을 따랐다 — 세그먼트 구분 버튼, 구분 배지, 음수 빨간색,
 * 꼭 필요한 열만. 다만 **상세는 공용 모달**(`_components/ReceiptModal`)로 띄운다.
 * 영수증을 보는 화면은 대시보드에서도 같은 것을 써야 해서 한 곳에 뒀다.
 * 상세가 모달이라 우측 패널이 없고, 목록은 전체 폭을 쓴다.
 *
 * 필터·선택을 전부 **쿼리스트링**으로 받는다(`?kind`·`?q`·`?open=<id>`). 그래서 보고 있는
 * 화면을 주소로 공유할 수 있고 뒤로가기로 모달이 닫힌다.
 */
const won = (v: string | number | null | undefined) =>
  v == null || v === "" ? "—" : Number(v).toLocaleString("ko-KR");

const neg = (v: string | number | null | undefined) => (Number(v) < 0 ? "text-red-600" : "");

const dt = (s: string) => s.replace("T", " ").slice(0, 16);

const KINDS = [
  { v: "", label: "전체" },
  { v: "PURCHASE", label: "구매" },
  { v: "REFUND", label: "환불" },
] as const;

export default async function ReceiptsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const one = (k: string) => (Array.isArray(sp[k]) ? sp[k]![0] : sp[k]) as string | undefined;
  const kind = one("kind") ?? "";
  const q = one("q") ?? "";
  const open = one("open");

  const tenant = await currentTenant();
  const alias = await loadAliases(tenant.id);
  const rows = await listReceipts(tenant.id, { kind, q, limit: 200 });
  const detail = open ? await getReceiptDetail(tenant.id, open) : null;

  /**
   * 현재 필터를 유지한 주소. `extra` 로 `open` 을 넣거나 비워서 모달을 닫는다.
   *
   * ⚠️ **빈 문자열을 돌려주면 안 된다.** `href=""` 는 쿼리까지 포함한 **현재 URL** 로
   *    해석되므로 필터가 없을 때 닫기가 동작하지 않는다(실제로 그랬다). 항상 경로를 붙인다.
   */
  const keep = (extra: Record<string, string>) => {
    const p = new URLSearchParams();
    if (kind) p.set("kind", kind);
    if (q) p.set("q", q);
    for (const [k, v] of Object.entries(extra)) if (v) p.set(k, v);
    const s = p.toString();
    return s ? `/receipts?${s}` : "/receipts";
  };

  /** 구분 버튼은 필터만 바꾸고 선택은 푼다 — 다른 구분으로 가면 그 영수증은 목록에 없다. */
  const kindHref = (v: string) => {
    const p = new URLSearchParams();
    if (v) p.set("kind", v);
    if (q) p.set("q", q);
    const s = p.toString();
    return s ? `/receipts?${s}` : "/receipts";
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">영수증 내역</h1>
        <p className="mt-1 text-sm text-gray-600">
          저장한 구매·환불 영수증을 조회합니다. 행을 누르면 상세가 모달로 열립니다.
        </p>
      </div>

      {/* ── 필터 ─────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex overflow-hidden rounded-lg border border-gray-300">
          {KINDS.map((k) => (
            <Link
              key={k.v}
              href={kindHref(k.v)}
              className={`px-3 py-1.5 text-sm ${
                kind === k.v ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {k.label}
            </Link>
          ))}
        </div>

        <form method="get" className="flex min-w-[18rem] flex-1 items-center gap-2">
          {kind && <input type="hidden" name="kind" value={kind} />}
          <input
            name="q"
            defaultValue={q}
            placeholder="승인번호 · 회원번호 · 일시 검색 (예: 00786770, 2026-07)"
            className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-gray-800 px-3 py-1.5 text-sm font-semibold text-white hover:bg-gray-900"
          >
            조회
          </button>
        </form>

        {(kind || q) && (
          <Link href="/receipts" className="text-sm text-gray-400 hover:text-gray-700">
            초기화
          </Link>
        )}
      </div>

      {/* ── 목록 ─────────────────────────────────── */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full text-xs">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-3 py-2">구분</th>
              <th className="px-3 py-2">일시</th>
              <th className="px-3 py-2">회원번호</th>
              <th className="px-3 py-2">승인번호</th>
              <th className="px-3 py-2">REG</th>
              <th className="px-3 py-2 text-right">합계</th>
              <th className="px-3 py-2 text-right">상품수</th>
              <th className="px-3 py-2 text-right">내역</th>
              <th className="px-3 py-2 text-center">검증</th>
              <th className="px-3 py-2">원거래일</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const to = keep({ open: r.id });
              return (
                <tr
                  key={r.id}
                  className={`border-t border-gray-100 hover:bg-blue-50 ${
                    open === r.id ? "bg-blue-50" : ""
                  }`}
                >
                  {/* 테이블 행 전체를 링크로 감쌀 수 없어 칸마다 링크를 깐다 —
                      어디를 눌러도 모달이 열린다. */}
                  <td className="px-3 py-2">
                    <Link href={to} className="block"><KindBadge kind={r.kind} /></Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    <Link href={to} className="tabular block">{dt(r.purchased_at)}</Link>
                  </td>
                  <td className="px-3 py-2">
                    <Link href={to} className="tabular block">{aliasLabel(alias.member, r.member_no)}</Link>
                  </td>
                  <td className="px-3 py-2">
                    <Link href={to} className="tabular block">
                      {r.approval_no ?? <span className="text-gray-400">현금</span>}
                    </Link>
                  </td>
                  <td className="px-3 py-2">
                    <Link href={to} className="tabular block">{r.register ?? "—"}</Link>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Link href={to} className={`tabular block ${neg(r.total)}`}>{won(r.total)}</Link>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Link href={to} className="tabular block">{r.item_count ?? "—"}</Link>
                  </td>
                  <td className="px-3 py-2 text-right text-gray-500">
                    <Link href={to} className="tabular block">{r.line_count}</Link>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <Link href={to} className="block">
                      {r.reconciled ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-red-500">✗</span>
                      )}
                    </Link>
                  </td>
                  <td className="px-3 py-2">
                    <Link href={to} className="tabular block">{r.original_date ?? "—"}</Link>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={10} className="px-3 py-10 text-center text-gray-400">
                  {kind || q ? "조건에 맞는 영수증이 없습니다." : "저장한 영수증이 없습니다."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400">{rows.length}건 (최신순, 최대 200)</p>

      {/* ── 상세 모달 — 대시보드와 같은 것을 쓴다 ───── */}
      {open && detail && <ReceiptModal detail={detail} closeHref={keep({})} alias={alias} />}
      {open && !detail && <ReceiptNotFoundModal closeHref={keep({})} />}
    </div>
  );
}
