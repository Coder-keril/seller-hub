import Link from "next/link";
import { findAdjustCandidates, saleSyncState } from "@/lib/receipt/price-adjustment";
import { loadAdjustSetting } from "@/lib/receipt/adjust-setting";
import { currentTenant } from "@/lib/session";
import { aliasLabel, loadAliases } from "@/lib/alias";
import { saveDefaults, claimAdjustment } from "./actions";

export const metadata = { title: "차액환불 후보" };

/**
 * **프리렌더 금지.** 이 화면은 판매자별 DB 데이터를 읽는다. 빌드 시점에 정적 생성하려 하면
 * DATABASE_URL 없이 쿼리를 쳐서 빌드가 깨지고, 설령 돌아도 특정 테넌트 데이터가 정적 파일로
 * 굳어 다른 판매자에게 노출된다. `searchParams` 유무에 의존하지 않고 여기서 못박는다.
 */
export const dynamic = "force-dynamic";

/**
 * 산 값보다 지금이 싼 구매 건을 찾아, 코스트코 고객센터에서 필요한 정보를 같이 보여준다.
 *
 * 한국은 가격조정 제도가 아니라 **환불 정책을 활용**한다 — 할인 중인 새 상품을 결제하고
 * 과거 비싸게 산 건을 반품 처리한다. 카운터에는 **회원카드와 그때 결제한 카드**가 필요하고
 * 실물 영수증은 필요 없다. 그래서 회원번호·카드번호·승인번호를 띄운다.
 *
 * **기본은 기간 제한이 없다** — 100% 만족 보장이 대부분의 상품에 적용된다. 기간 입력은
 * 좁혀 보고 싶을 때만 쓴다(전자제품·대형가전 90일 등). 품목 분류는 아직 세우지 않았다.
 *
 * 임계값은 **판매자별 기본값**(`price_adjust_setting`)에서 오고, 쿼리스트링으로 건별 덮어쓸 수
 * 있다. "기본값으로 저장" 을 누르면 지금 값이 그 판매자의 기본값이 된다.
 */
const won = (n: number | null | undefined) =>
  n == null ? "—" : Math.round(n).toLocaleString("ko-KR");

export default async function PriceAdjustmentPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const one = (k: string) => (Array.isArray(sp[k]) ? sp[k]![0] : sp[k]) as string | undefined;

  const tenant = await currentTenant();
  const alias = await loadAliases(tenant.id);
  const setting = await loadAdjustSetting(tenant.id);

  // 쿼리스트링이 있으면 그것이 이기고, 없으면 저장된 기본값을 쓴다.
  const daysParam = one("days")?.trim();
  const minParam = one("min")?.trim();
  const windowDays =
    daysParam == null ? setting.windowDays : daysParam === "" ? null : Number(daysParam) || null;
  const minDiff =
    minParam == null ? setting.minDiffTotal : minParam === "" ? 0 : Number(minParam) || 0;
  const daysRaw = windowDays == null ? "" : String(windowDays);

  const overridden =
    (daysParam != null && (Number(daysParam) || null) !== setting.windowDays) ||
    (minParam != null && (Number(minParam) || 0) !== setting.minDiffTotal);

  const sort = one("sort") === "urgency" ? "urgency" : "amount";

  const [rows, sync] = await Promise.all([
    findAdjustCandidates(tenant.id, { windowDays, minDiffTotal: minDiff, sort }),
    saleSyncState(),
  ]);

  // 행사 종료가 임박한 것은 지금 안 가면 사라진다 — 판단에 가장 중요한 축이라 따로 센다.
  const urgent = rows.filter((r) => r.days_left != null && r.days_left <= 2);
  const urgentSum = urgent.reduce((a, r) => a + r.diff_total, 0);

  const total = rows.reduce((a, r) => a + r.diff_total, 0);

  /** 현재 필터를 유지하며 정렬만 바꾼 주소. */
  const keepSort = (next: string) => {
    const q = new URLSearchParams();
    if (minParam != null) q.set("min", minParam);
    if (daysParam != null) q.set("days", daysParam);
    if (next !== "amount") q.set("sort", next);
    const t = q.toString();
    return t ? `/price-adjustment?${t}` : "/price-adjustment";
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">차액환불 후보</h1>
        <p className="mt-1 text-sm text-gray-600">
          산 값보다 <b>지금 더 싼</b> 구매 건입니다. 할인 중인 새 상품을 결제한 뒤 고객센터에서
          과거 구매를 반품 처리하면 차액이 회수됩니다. <b>회원카드와 그때 결제한 카드</b>를
          챙기세요.
        </p>
      </div>

      {sync.withSale === 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <b>행사가가 아직 없습니다.</b> 사내 개발머신에서 <code>npm run sync</code> 를 돌려야
          코스트코 행사 정보가 들어옵니다. 그전까지 이 화면은 비어 있습니다.
          {sync.syncedAt && <> (마지막 동기화 {sync.syncedAt})</>}
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex flex-wrap items-end gap-3">
          {/* 조회는 GET — 결과 URL 을 그대로 공유할 수 있다. */}
          <form method="get" id="q" className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-700">최근 N일만 (비우면 전체)</span>
              <input
                name="days"
                type="number"
                min="1"
                max="3650"
                placeholder="전체"
                defaultValue={daysRaw}
                className="tabular w-24 rounded border border-gray-300 px-2 py-1.5 text-right text-sm"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-700">최소 차액 (원)</span>
              <input
                name="min"
                type="number"
                min="0"
                step="1000"
                defaultValue={minDiff}
                className="tabular w-28 rounded border border-gray-300 px-2 py-1.5 text-right text-sm"
              />
            </label>
            <button type="submit" className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700">
              조회
            </button>
          </form>

          {/* 저장은 POST(서버 액션) — 같은 입력값을 기본값으로 굳힌다. */}
          <form action={saveDefaults} className="flex items-end gap-2">
            <input type="hidden" name="days" value={daysRaw} />
            <input type="hidden" name="min" value={String(minDiff)} />
            <button
              type="submit"
              className="rounded border border-gray-400 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              기본값으로 저장
            </button>
          </form>

          {(overridden || minParam != null || daysParam != null) && (
            <Link href="/price-adjustment" className="pb-2 text-sm text-gray-400 hover:text-gray-700">
              기본값으로 되돌리기
            </Link>
          )}
        </div>

        <p className="mt-2 text-xs text-gray-500">
          현재 기본값 <b>최소 차액 {won(setting.minDiffTotal)}원</b> ·{" "}
          <b>{setting.windowDays == null ? "기간 제한 없음" : `최근 ${setting.windowDays}일`}</b>
          {setting.saved ? ` (저장 ${setting.updatedAt})` : " (아직 저장 안 함 — 코드 기본값)"}
          {overridden && <span className="ml-1 text-amber-700">· 지금은 덮어쓴 값으로 보는 중</span>}
        </p>
      </div>

      {rows.length > 0 && (
        <div className="flex flex-wrap items-end gap-6 rounded-lg border border-gray-200 bg-white p-4">
          <div>
            <div className="text-xs text-gray-500">회수 가능 차액</div>
            <div className="tabular text-2xl font-semibold text-emerald-700">{won(total)}원</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">대상</div>
            <div className="tabular text-lg text-gray-800">{rows.length}건</div>
          </div>
          {urgent.length > 0 && (
            <div className="rounded border border-red-200 bg-red-50 px-3 py-2">
              <div className="text-xs font-medium text-red-700">⏰ 2일 내 행사 종료</div>
              <div className="tabular text-lg font-semibold text-red-700">
                {won(urgentSum)}원 · {urgent.length}건
              </div>
            </div>
          )}
          <div className="ml-auto flex items-center gap-3 text-sm">
            <Link
              href={keepSort(sort === "urgency" ? "amount" : "urgency")}
              className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-100"
            >
              {sort === "urgency" ? "차액순으로" : "임박순으로"}
            </Link>
            <Link href="/price-adjustment/stats" className="text-blue-700 hover:underline">
              처리 현황 →
            </Link>
            {/* 되돌리는 곳을 여기서 알려 준다 — 처리완료를 누른 직후에 찾게 되는 정보다. */}
            <span className="text-xs text-gray-400">처리완료 되돌리기는 현황의 “최근 처리 내역”에서</span>
          </div>
        </div>
      )}

      {rows.length === 0 ? (
        <p className="rounded-lg border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
          {sync.withSale === 0
            ? "행사가 동기화 후 다시 확인하세요."
            : `${windowDays == null ? "구매 내역" : `최근 ${windowDays}일 구매`} 중 차액 ${won(minDiff)}원 이상인 상품이 없습니다.`}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full text-xs">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-2 py-2 text-right">차액</th>
                <th className="px-2 py-2">상품</th>
                <th className="px-2 py-2 text-right">수량</th>
                <th className="px-2 py-2 text-right">낸 단가</th>
                <th className="px-2 py-2 text-right">지금</th>
                <th className="px-2 py-2">행사 종료</th>
                <th className="px-2 py-2">구매일</th>
                <th className="px-2 py-2 text-right">경과</th>
                <th className="px-2 py-2">회원번호</th>
                <th className="px-2 py-2">카드</th>
                <th className="px-2 py-2">승인번호</th>
                <th className="px-2 py-2" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={`${r.receipt_id}-${r.product_code}`} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="tabular px-2 py-1.5 text-right font-semibold text-emerald-700">
                    {won(r.diff_total)}
                    <span className="ml-1 font-normal text-gray-400">({won(r.diff_unit)}×{r.qty})</span>
                  </td>
                  <td className="px-2 py-1.5">
                    <Link href={`/receipt-dashboard?code=${r.product_code}`} className="text-blue-700 hover:underline">
                      {r.name ?? r.product_code}
                    </Link>
                    <span className="tabular ml-1 text-gray-400">{r.product_code}</span>
                  </td>
                  <td className="tabular px-2 py-1.5 text-right">{r.qty}</td>
                  <td className="tabular px-2 py-1.5 text-right">{won(r.paid_unit)}</td>
                  <td className="tabular px-2 py-1.5 text-right text-blue-700">{won(r.sale_price)}</td>
                  <td className="tabular px-2 py-1.5">
                    {r.sale_end_date ?? "—"}
                    {r.days_left != null && (
                      <span
                        className={`ml-1 rounded px-1 text-[10px] font-medium ${
                          r.days_left <= 0
                            ? "bg-red-600 text-white"
                            : r.days_left <= 2
                              ? "bg-red-100 text-red-700"
                              : "text-gray-400"
                        }`}
                      >
                        {r.days_left <= 0 ? "오늘 종료" : `${r.days_left}일`}
                      </span>
                    )}
                  </td>
                  <td className="tabular px-2 py-1.5">{r.purchased_at.slice(0, 10)}</td>
                  <td className="tabular px-2 py-1.5 text-right">{r.days_ago}일</td>
                  {/* 번호만으로는 어느 카드를 들고 가야 할지 알 수 없다 — 별명을 같이 띄운다
                      (설정 > 번호 별명). 번호는 카운터에서 대조하므로 숨기지 않는다. */}
                  <td className="tabular px-2 py-1.5">{aliasLabel(alias.member, r.member_no)}</td>
                  <td className="tabular px-2 py-1.5">{aliasLabel(alias.card, r.card_number_masked)}</td>
                  <td className="tabular px-2 py-1.5">{r.approval_no ?? "—"}</td>
                  <td className="whitespace-nowrap px-2 py-1.5 text-right">
                    <form action={claimAdjustment}>
                      <input type="hidden" name="receiptId" value={r.receipt_id} />
                      <input type="hidden" name="productCode" value={r.product_code} />
                      <input type="hidden" name="name" value={r.name ?? ""} />
                      <input type="hidden" name="qty" value={String(r.qty)} />
                      <input type="hidden" name="paidUnit" value={String(r.paid_unit)} />
                      <input type="hidden" name="salePrice" value={String(r.sale_price)} />
                      <button
                        type="submit"
                        className="rounded border border-emerald-300 px-2 py-0.5 text-[11px] font-medium text-emerald-700 hover:bg-emerald-50"
                        title="차액환불로 처리했다고 기록합니다. 목록에서 빠지고 현황에 집계됩니다."
                      >
                        처리완료
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="space-y-1 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-500">
        <p className="font-medium text-gray-700">코스트코 환불 정책 — 품목 분류는 아직 자동 판정하지 않습니다</p>
        <p>· <b>기본</b> 100% 만족 보장 — 기간·사유 제한 없이 전액 환불</p>
        <p>· <b>90일</b> 전자제품·대형가전(TV·컴퓨터·스마트폰·카메라·에어컨·세탁기·건조기 등)</p>
        <p>· <b>유통기한 내</b> 음식류</p>
        <p>· <b>환불 불가</b> 담배·주류·이벤트 티켓·귀금속·상품권·맞춤 제작</p>
        <p className="pt-1">
          준비물은 상품·회원카드·결제 카드입니다. 매장 구매는 매장 반품 코너에서만 처리되고,
          카드 취소는 영업일 2~3일 걸립니다.
        </p>
        <p className="pt-1">
          이미 반품한 구매는 제외됩니다(환불 영수증의 원승인번호로 연결). 비교 단가는 쿠폰을 뺀
          실지불 단가입니다 — 쿠폰으로 이미 행사가보다 싸게 산 건은 후보에 오르지 않습니다.
        </p>
      </div>
    </div>
  );
}
