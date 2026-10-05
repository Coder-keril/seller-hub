import Link from "next/link";
import { loadClaimStats } from "@/lib/receipt/adjust-claim";
import { findAdjustCandidates } from "@/lib/receipt/price-adjustment";
import { loadAdjustSetting } from "@/lib/receipt/adjust-setting";
import { currentTenant } from "@/lib/session";
import { aliasLabel, loadAliases } from "@/lib/alias";
import { unclaimAdjustment } from "../actions";

export const metadata = { title: "차액환불 현황" };

/**
 * **프리렌더 금지.** 이 화면은 판매자별 DB 데이터를 읽는다. 빌드 시점에 정적 생성하려 하면
 * DATABASE_URL 없이 쿼리를 쳐서 빌드가 깨지고, 설령 돌아도 특정 테넌트 데이터가 정적 파일로
 * 굳어 다른 판매자에게 노출된다. `searchParams` 유무에 의존하지 않고 여기서 못박는다.
 */
export const dynamic = "force-dynamic";

/**
 * 차액환불 **성과**(처리한 기록)와 **기회**(아직 남은 후보)를 한 화면에서 본다.
 *
 * 성과는 `price_adjust_claim` 을 센다 — 환불 영수증에서 추론하지 않는다. 실데이터에서
 * 단순 반품과 구분할 단서가 없었다(근거는 `sql/013_price_adjust_claim.sql`).
 *
 * 그래프는 **CSS 막대**다. 차트 라이브러리를 넣지 않았다 — 막대 몇 개에 번들을 늘릴 이유가
 * 없고, 이 화면의 "클라이언트 JS 없음" 원칙도 지켜진다.
 */
const won = (n: number | null | undefined) =>
  n == null ? "—" : Math.round(n).toLocaleString("ko-KR");

export default async function AdjustStatsPage() {
  const tenant = await currentTenant();
  const alias = await loadAliases(tenant.id);
  const setting = await loadAdjustSetting(tenant.id);
  const [stats, open] = await Promise.all([
    loadClaimStats(tenant.id),
    findAdjustCandidates(tenant.id, {
      windowDays: setting.windowDays,
      minDiffTotal: setting.minDiffTotal,
      sort: "urgency",
    }),
  ]);

  const s = stats.summary;
  const openSum = open.reduce((a, r) => a + r.diff_total, 0);
  const urgent = open.filter((r) => r.days_left != null && r.days_left <= 2);
  const urgentSum = urgent.reduce((a, r) => a + r.diff_total, 0);

  const monthMax = Math.max(1, ...stats.byMonth.map((m) => m.recovered));
  const prodMax = Math.max(1, ...stats.byProduct.map((p) => p.recovered));

  // 기회 쪽 상품 랭킹 — 아직 처리하지 않은 돈이 어디 몰려 있는지.
  const openByProduct = [...open
    .reduce((m, r) => {
      const v = m.get(r.product_code) ?? { name: r.name ?? "", diff: 0, qty: 0, cnt: 0 };
      v.diff += r.diff_total; v.qty += r.qty; v.cnt++;
      return m.set(r.product_code, v);
    }, new Map<string, { name: string; diff: number; qty: number; cnt: number }>())]
    .sort((a, b) => b[1].diff - a[1].diff);
  const openProdMax = Math.max(1, ...openByProduct.map(([, v]) => v.diff));

  // 카드별 — 매장에 어느 카드를 들고 가야 하는지.
  const byCard = [...open
    .reduce((m, r) => {
      const k = r.card_number_masked ?? "(카드 미상)";
      const v = m.get(k) ?? { member: r.member_no, diff: 0, cnt: 0 };
      v.diff += r.diff_total; v.cnt++;
      return m.set(k, v);
    }, new Map<string, { member: string; diff: number; cnt: number }>())]
    .sort((a, b) => b[1].diff - a[1].diff);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">차액환불 현황</h1>
          <p className="mt-1 text-sm text-gray-600">
            처리한 <b>성과</b>와 아직 남은 <b>기회</b>입니다. 성과는 후보 화면에서 &ldquo;처리완료&rdquo;를
            누른 기록을 셉니다.
          </p>
        </div>
        <Link href="/price-adjustment" className="text-sm text-blue-700 hover:underline">
          ← 후보 목록
        </Link>
      </div>

      {/* ── 한눈에 ───────────────────────────────── */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          label="누적 회수액"
          value={`${won(s.recovered)}원`}
          sub={s.claims > 0 ? `${s.claims}건 · ${s.products}종 · ${won(s.qty)}개` : "아직 처리한 건이 없습니다"}
          tone="emerald"
        />
        <Card
          label="남은 기회"
          value={`${won(openSum)}원`}
          sub={`${open.length}건 · ${openByProduct.length}종`}
          tone="blue"
        />
        <Card
          label="2일 내 행사 종료"
          value={`${won(urgentSum)}원`}
          sub={urgent.length > 0 ? `${urgent.length}건 — 지금 안 가면 사라집니다` : "임박한 건 없음"}
          tone={urgent.length > 0 ? "red" : "gray"}
        />
        <Card
          label="회수율"
          value={
            s.recovered + openSum > 0
              ? `${Math.round((s.recovered / (s.recovered + openSum)) * 100)}%`
              : "—"
          }
          sub="누적 ÷ (누적 + 남은 기회)"
          tone="gray"
        />
      </div>

      {/* ── 성과: 월별 추이 ───────────────────────── */}
      <section>
        <h2 className="mb-2 text-sm font-semibold text-gray-900">월별 회수액 (최근 12개월)</h2>
        {s.claims === 0 ? (
          <Empty>
            아직 처리 기록이 없습니다. <Link href="/price-adjustment" className="text-blue-700 hover:underline">후보 목록</Link>
            에서 &ldquo;처리완료&rdquo;를 누르면 여기에 쌓입니다.
          </Empty>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex h-40 items-end gap-2">
              {stats.byMonth.map((m) => (
                <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
                  <div className="tabular text-[10px] text-gray-500">
                    {m.recovered > 0 ? won(m.recovered) : ""}
                  </div>
                  <div
                    className={`w-full rounded-t ${m.recovered > 0 ? "bg-emerald-500" : "bg-gray-100"}`}
                    style={{ height: `${Math.max(m.recovered > 0 ? 4 : 1, (m.recovered / monthMax) * 100)}%` }}
                    title={`${m.month} · ${won(m.recovered)}원 · ${m.claims}건`}
                  />
                  <div className="text-[10px] text-gray-400">{m.month.slice(5)}월</div>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-400">
              최초 {s.firstAt ?? "—"} · 최근 {s.lastAt ?? "—"} · 환불 영수증으로 확인된 건 {s.verified}/{s.claims}
            </p>
          </div>
        )}
      </section>

      {/* ── 성과: 상품 랭킹 ───────────────────────── */}
      {stats.byProduct.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold text-gray-900">
            회수액 상위 상품 ({stats.byProduct.length}종)
          </h2>
          <RankTable
            rows={stats.byProduct.slice(0, 15).map((p) => ({
              code: p.product_code,
              name: p.name,
              value: p.recovered,
              max: prodMax,
              right: `${p.claims}건 · ${won(p.qty)}개`,
              sub: p.last_at,
            }))}
            tone="emerald"
          />
        </section>
      )}

      {/* ── 기회: 상품 랭킹 ───────────────────────── */}
      <section>
        <h2 className="mb-2 text-sm font-semibold text-gray-900">
          아직 남은 기회 — 상품별 ({openByProduct.length}종)
        </h2>
        {openByProduct.length === 0 ? (
          <Empty>현재 기준(최소 차액 {won(setting.minDiffTotal)}원)에 걸리는 후보가 없습니다.</Empty>
        ) : (
          <RankTable
            rows={openByProduct.slice(0, 15).map(([code, v]) => ({
              code,
              name: v.name,
              value: v.diff,
              max: openProdMax,
              right: `${v.cnt}건 · ${won(v.qty)}개`,
              sub: null,
            }))}
            tone="blue"
          />
        )}
      </section>

      {/* ── 기회: 카드별 ─────────────────────────── */}
      {byCard.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold text-gray-900">어느 카드를 들고 갈까</h2>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full text-xs">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-3 py-2">카드</th>
                  <th className="px-3 py-2">회원번호</th>
                  <th className="px-3 py-2 text-right">회수 가능</th>
                  <th className="px-3 py-2 text-right">건수</th>
                </tr>
              </thead>
              <tbody>
                {byCard.map(([card, v]) => (
                  <tr key={card} className="border-t border-gray-100">
                    <td className="tabular px-3 py-2">{aliasLabel(alias.card, card)}</td>
                    <td className="tabular px-3 py-2 text-gray-500">{aliasLabel(alias.member, v.member)}</td>
                    <td className="tabular px-3 py-2 text-right font-semibold text-blue-700">{won(v.diff)}원</td>
                    <td className="tabular px-3 py-2 text-right">{v.cnt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-1 text-xs text-gray-400">
            카운터에는 상품·회원카드·결제 카드가 필요합니다.
          </p>
        </section>
      )}

      {/* ── 성과: 최근 처리 내역 ──────────────────── */}
      {stats.recent.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold text-gray-900">최근 처리 내역</h2>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full text-xs">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-3 py-2">처리일시</th>
                  <th className="px-3 py-2">상품</th>
                  <th className="px-3 py-2 text-right">수량</th>
                  <th className="px-3 py-2 text-right">낸 단가</th>
                  <th className="px-3 py-2 text-right">행사가</th>
                  <th className="px-3 py-2 text-right">회수액</th>
                  <th className="px-3 py-2">확인</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody>
                {stats.recent.map((c) => (
                  <tr key={c.id} className="border-t border-gray-100">
                    <td className="tabular px-3 py-2">{c.claimed_at}</td>
                    <td className="px-3 py-2">
                      {c.name || c.product_code}
                      <span className="tabular ml-1 text-gray-400">{c.product_code}</span>
                    </td>
                    <td className="tabular px-3 py-2 text-right">{c.qty}</td>
                    <td className="tabular px-3 py-2 text-right">{won(c.paid_unit)}</td>
                    <td className="tabular px-3 py-2 text-right text-blue-700">{won(c.sale_price)}</td>
                    <td className="tabular px-3 py-2 text-right font-semibold text-emerald-700">{won(c.diff_total)}</td>
                    <td className="px-3 py-2">
                      {c.verified ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-gray-300" title="환불 영수증이 아직 대조되지 않았습니다">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <form action={unclaimAdjustment}>
                        <input type="hidden" name="claimId" value={c.id} />
                        <button
                          type="submit"
                          className="rounded border border-gray-200 px-2 py-0.5 text-[11px] text-gray-400 hover:bg-gray-100"
                          title="기록을 지웁니다. 후보 목록에 다시 나타납니다."
                        >
                          취소
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

const TONE = {
  emerald: "text-emerald-700",
  blue: "text-blue-700",
  red: "text-red-700",
  gray: "text-gray-900",
} as const;

function Card({
  label, value, sub, tone,
}: { label: string; value: string; sub?: string; tone: keyof typeof TONE }) {
  return (
    <div className={`rounded-lg border bg-white p-4 ${tone === "red" ? "border-red-200" : "border-gray-200"}`}>
      <div className="text-xs text-gray-500">{label}</div>
      <div className={`tabular text-2xl font-semibold ${TONE[tone]}`}>{value}</div>
      {sub && <div className="mt-0.5 text-xs text-gray-400">{sub}</div>}
    </div>
  );
}

function RankTable({
  rows, tone,
}: {
  rows: { code: string; name: string | null; value: number; max: number; right: string; sub: string | null }[];
  tone: "emerald" | "blue";
}) {
  const bar = tone === "emerald" ? "bg-emerald-500" : "bg-blue-500";
  return (
    <div className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
      {rows.map((r, i) => (
        <div key={r.code} className="flex items-center gap-3 px-3 py-2 text-xs">
          <span className="w-5 text-right text-gray-400">{i + 1}</span>
          <span className="w-44 shrink-0 truncate" title={r.name ?? r.code}>
            {r.name || r.code}
            <span className="tabular ml-1 text-gray-400">{r.code}</span>
          </span>
          {/* 막대 — 1위 대비 비율. 차트 라이브러리 없이 CSS 폭으로 그린다. */}
          <span className="h-3 flex-1 rounded bg-gray-100">
            <span
              className={`block h-3 rounded ${bar}`}
              style={{ width: `${Math.max(2, (r.value / r.max) * 100)}%` }}
            />
          </span>
          <span className={`tabular w-24 text-right font-semibold ${TONE[tone]}`}>{won(r.value)}원</span>
          <span className="tabular w-28 text-right text-gray-500">{r.right}</span>
          <span className="tabular w-20 text-right text-gray-400">{r.sub ?? ""}</span>
        </div>
      ))}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-lg border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
      {children}
    </p>
  );
}
