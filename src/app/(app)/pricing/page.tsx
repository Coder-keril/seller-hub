import { quote, PricingError, type Quote } from "@/lib/pricing";
import { costBasis, type CostBasis } from "@/lib/receipt/cost-basis";
import { currentTenant, currentMode } from "@/lib/session";

/**
 * 판매가 계산 화면.
 *
 * 입력을 **쿼리스트링**으로 받는다(평범한 `<form method="get">`). 그래서 이 화면에는
 * 클라이언트 자바스크립트가 없고, 계산 결과 URL 을 그대로 공유·북마크할 수 있다.
 * 상태를 들고 있을 이유가 생기면 그때 클라이언트로 내린다.
 *
 * 원가 기준은 둘 중 하나다:
 *   · **상품코드** 를 넣으면 영수증의 **실매입 평균단가**(쿠폰 반영)를 쓴다 — 실제 지불액이다.
 *   · 금액을 직접 넣으면 그 값을 쓴다(정상가 등).
 * 상품코드가 있으면 그쪽이 이긴다. 어느 값을 썼는지 화면에 표시한다.
 */
/**
 * **프리렌더 금지.** 이 화면은 판매자별 DB 데이터를 읽는다. 빌드 시점에 정적 생성하려 하면
 * DATABASE_URL 없이 쿼리를 쳐서 빌드가 깨지고, 설령 돌아도 특정 테넌트 데이터가 정적 파일로
 * 굳어 다른 판매자에게 노출된다. `searchParams` 유무에 의존하지 않고 여기서 못박는다.
 */
export const dynamic = "force-dynamic";

const CHANNELS = ["NAVER", "COUPANG", "ELEVENST", "GMARKET", "AUCTION", "LOTTEON"] as const;

const won = (n: number) => n.toLocaleString("ko-KR");
const pct = (n: number) => `${(n * 100).toFixed(3)}%`;

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const one = (k: string) => (Array.isArray(sp[k]) ? sp[k]![0] : sp[k]) as string | undefined;

  const manualPrice = Number(one("normalPrice") ?? "");
  const productCode = one("code")?.trim() || "";
  const channel = CHANNELS.find((c) => c === one("channel")) ?? "NAVER";
  const categoryCode = one("categoryCode")?.trim() || undefined;

  let tenantName = "";
  let mode: "SELF" | "MERRYCOCO" = "SELF";
  let q: Quote | null = null;
  let basis: CostBasis | null = null;
  let basisLabel = "";
  let error: string | null = null;

  try {
    const t = await currentTenant();
    tenantName = t.name;
    mode = await currentMode(t.id);

    // 상품코드가 있으면 영수증의 실매입 평균단가가 원가 기준이 된다.
    if (productCode) {
      basis = await costBasis(t.id, productCode);
      if (!basis) error = `상품코드 ${productCode} 의 매입 영수증이 없습니다.`;
      else if (basis.avg_unit == null) error = `상품코드 ${productCode} 는 순수량이 0 이하라 단가를 낼 수 없습니다.`;
    }

    const cost = basis?.avg_unit ?? (manualPrice > 0 ? manualPrice : null);
    basisLabel = basis?.avg_unit != null ? "영수증 실매입 평균단가" : manualPrice > 0 ? "직접 입력" : "";

    if (cost != null && !error) {
      q = await quote({ tenantId: t.id, channel, normalPrice: cost, channelCategoryCode: categoryCode, mode });
    }
  } catch (err) {
    error =
      err instanceof PricingError || err instanceof Error
        ? err.message
        : "계산 중 알 수 없는 오류가 발생했습니다.";
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">판매가 계산</h1>
        <p className="mt-1 text-sm text-gray-600">
          정상가에 마켓 수수료와 고정비를 역산해 목표 수익이 남는 판매가를 구합니다.
          {tenantName && (
            <>
              {" "}
              현재 발송 방식은 <b>{mode === "SELF" ? "직접 발송" : "메리코코 위임"}</b> 입니다.
            </>
          )}
        </p>
      </div>

      <form method="get" className="flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 bg-white p-4">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-700">상품코드 (영수증 매입가 사용)</span>
          <input
            name="code"
            defaultValue={productCode}
            placeholder="659117"
            className="tabular w-32 rounded border border-gray-300 px-2 py-1.5 text-sm"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-700">또는 금액 직접 (원)</span>
          <input
            name="normalPrice"
            type="number"
            min="1"
            step="1"
            defaultValue={manualPrice > 0 ? String(manualPrice) : ""}
            placeholder="20990"
            className="tabular w-32 rounded border border-gray-300 px-2 py-1.5 text-right text-sm"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-700">채널</span>
          <select
            name="channel"
            defaultValue={channel}
            className="rounded border border-gray-300 px-2 py-1.5 text-sm"
          >
            {CHANNELS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-700">마켓 카테고리 코드 (선택)</span>
          <input
            name="categoryCode"
            defaultValue={categoryCode ?? ""}
            placeholder="50002256"
            className="w-36 rounded border border-gray-300 px-2 py-1.5 text-sm"
          />
        </label>

        <button
          type="submit"
          className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          계산
        </button>
      </form>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>
      )}

      {basis && basis.avg_unit != null && (
        <div className="flex flex-wrap gap-6 rounded-lg border border-gray-200 bg-white p-4">
          <div>
            <div className="text-xs text-gray-500">실매입 평균단가</div>
            <div className="tabular text-2xl font-semibold text-gray-900">{won(basis.avg_unit)}원</div>
            <div className="text-xs text-gray-400">{basis.name || basis.product_code}</div>
          </div>
          <Figure label="매입" value={`${won(basis.purchase_qty)}개`} />
          {basis.refund_qty > 0 && <Figure label="환불" value={`${won(basis.refund_qty)}개`} />}
          <Figure label="보유(구매−환불)" value={`${won(basis.net_qty)}개`} />
          <Figure label="매입 총액" value={`${won(basis.net_amt)}원`} />
          <Figure label="영수증" value={`${basis.receipts}건`} />
          <div className="self-end text-xs text-gray-400">최근 매입 {basis.last_at ?? "—"}</div>
        </div>
      )}

      {q && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-6 rounded-lg border border-gray-200 bg-white p-4">
            <Figure label="판매가" value={`${won(q.salePrice)}원`} strong />
            <Figure label="원가 기준" value={`${won(q.normalPrice)}원`} />
            <Figure label="순이익" value={`${won(q.profit)}원`} strong />
            <Figure label="수수료율" value={pct(q.feeRate)} />
            <Figure label="수수료" value={`${won(q.feeAmount)}원`} />
            <Figure label="고정비" value={`${won(q.costFixed)}원`} />
            {q.costRate > 0 && <Figure label="비율비" value={pct(q.costRate)} />}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Panel title="수수료 내역">
              <Rows
                rows={q.fees.map((f) => ({
                  k: `${f.kind} · ${f.source}`,
                  v: f.fixed > 0 ? `${pct(f.rate)} + ${won(f.fixed)}원` : pct(f.rate),
                }))}
              />
            </Panel>
            <Panel title="고정비·비율비 내역">
              <Rows
                rows={q.costs.map((c) => ({
                  k: `${c.name} · ${c.scope}`,
                  v: c.kind === "FIXED" ? `${won(c.amount)}원` : pct(c.amount),
                }))}
              />
            </Panel>
          </div>

          <div className="tabular rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700">
            <span className="font-medium text-gray-900">검산</span>{" "}
            {won(q.salePrice)} − 수수료 {won(q.feeAmount)} − 정상가 {won(q.normalPrice)} − 고정비{" "}
            {won(q.costFixed)}
            {q.costRate > 0 && <> − 비율비 {won(Math.round(q.salePrice * q.costRate))}</>} ={" "}
            <b>{won(q.profit)}원</b>
          </div>
        </div>
      )}

      {basisLabel && q && (
        <p className="text-xs text-gray-400">
          원가 기준 <b>{basisLabel}</b>
          {basis?.avg_unit != null && " — 영수증의 실제 지불액(쿠폰 반영)에서 환불을 뺀 평균입니다. 오픈마켓 판매분은 아직 차감되지 않습니다."}
        </p>
      )}

      {!q && !error && (
        <p className="text-sm text-gray-500">상품코드나 금액을 넣고 계산을 누르세요.</p>
      )}
    </div>
  );
}

function Figure({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className={`tabular ${strong ? "text-2xl font-semibold text-gray-900" : "text-lg text-gray-800"}`}>
        {value}
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-2 text-sm font-medium text-gray-900">{title}</div>
      {children}
    </div>
  );
}

function Rows({ rows }: { rows: { k: string; v: string }[] }) {
  if (rows.length === 0) return <p className="text-sm text-gray-500">설정된 항목이 없습니다.</p>;
  return (
    <dl className="divide-y divide-gray-100 text-sm">
      {rows.map((r) => (
        <div key={r.k} className="flex justify-between gap-4 py-1.5">
          <dt className="text-gray-600">{r.k}</dt>
          <dd className="tabular text-gray-900">{r.v}</dd>
        </div>
      ))}
    </dl>
  );
}
