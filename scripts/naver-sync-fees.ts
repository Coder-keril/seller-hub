// 네이버 정산 내역에서 **실제 부과된** 수수료율을 역산해 channel_fee 에 반영한다.
//
// 수수료 등급(영세/중소1~3/일반)을 코드로 알려주는 API 는 없다.
//   /v1/seller/account 의 grade 는 **스토어 등급**(씨앗~플래티넘)이고 수수료 등급이 아니다.
//
// 대신 GET /v1/pay-settle/settle/commission-details 가 정산 건별로
// 수수료 기준금액과 실제 부과액을 주므로 나눠서 실효율을 얻는다. 등급을 추정할 필요가 없다.
//
//   실효율 = Σ commissionAmount / Σ commissionBasisAmount      (실제 부과액이므로 VAT 포함)
//
// 실행:  npx tsx scripts/naver-sync-fees.ts [--days 60] [--apply]
//        --apply 없이는 계산만 보여준다. 돈 계산이라 기본은 안 쓴다.
import pg from "pg";
import { loadEnv } from "./pgx.mjs";

loadEnv();
const { callApi, resolveDefaultAccount } = await import("../src/lib/naver/auth.ts");

const arg = (n: string, d: number) => {
  const i = process.argv.indexOf(n);
  return i === -1 ? d : Number(process.argv[i + 1]);
};
const DAYS = arg("--days", 60);
const APPLY = process.argv.includes("--apply");

// 네이버 수수료 타입 → channel_fee.kind. 정산에 실제로 찍히는 것만 매핑한다.
const KIND: Record<string, string> = {
  PAY_COMMISSION: "PAYMENT",           // 네이버페이 주문관리수수료 — 등급이 걸린 항목
  PLATFORM_COMMISSION: "SALE",         // 판매 수수료
  SALE_COMMISSION: "SALE",             // (구)판매 수수료
  SERVICE_COMMISSION: "SETTLE",        // 솔루션 사용료
  PACKAGE_COMMISSION: "SETTLE",
  CHNL_COMMISSION: "OTHER",            // 채널 수수료
  INFLOW_COMMISSION: "OTHER",
  PRICE_COMPARISON_COMMISSION: "OTHER",
};
// 취소·회수 건은 부호가 반대라 실효율을 왜곡한다. 정상 정산만 본다.
const NORMAL = new Set(["NORMAL_SETTLE_ORIGINAL", "QUICK_SETTLE_ORIGINAL"]);

// 영세·중소 우대는 **환급**으로 처리될 수 있다. 결제 시점엔 일반 요율로 떼고
// 국세청 등급이 확정되면 차액을 PREFERENTIAL_COMMISSION 행으로 돌려준다.
// PROD_ORDER 만 보면 우대분을 빼먹고 수수료를 과대 계상한다 — 환급 행을 같이 합산한다.
// 환급액의 부호는 실데이터로 확인해야 한다 (주문이 쌓이면 --days 로 확인할 것).
const SCOPE = new Set(["PROD_ORDER", "PREFERENTIAL_COMMISSION"]);

interface Row {
  productOrderType: string; settleType: string; commissionType: string;
  payMeansType?: string; commissionBasisAmount: number; commissionAmount: number;
}

await resolveDefaultAccount();

// 스토어 등급은 수수료와 무관하지만 어느 스토어를 본 것인지 남긴다.
const acc = await (await callApi("/v1/seller/account")).json() as { accountId: string; grade: string };
const STORE_GRADE: Record<string, string> = {
  "00": "플래티넘", "01": "프리미엄", "02": "빅파워", "03": "파워", "04": "새싹", "05": "씨앗",
};
console.log(`계정 ${acc.accountId}  스토어 등급 ${acc.grade}(${STORE_GRADE[acc.grade] ?? "?"})`);
console.log(`※ 스토어 등급은 수수료 등급이 아니다. 수수료는 아래 정산 실측값으로 정한다.\n`);

// ── 정산 내역 수집 ────────────────────────────────────────────
const rows: Row[] = [];
const DAY = 86400_000;
for (let d = 1; d <= DAYS; d++) {
  const date = new Date(Date.now() - d * DAY).toISOString().slice(0, 10);
  const qs = new URLSearchParams({
    searchDate: date, periodType: "SETTLE_CASEBYCASE_SETTLE_BASIS_DATE",
    pageNumber: "1", pageSize: "1000",
  });
  const res = await callApi(`/v1/pay-settle/settle/commission-details?${qs}`);
  if (!res.ok) {
    console.error(`${date}  ${res.status}  ${(await res.text()).slice(0, 200)}`);
    break;
  }
  const { elements } = await res.json() as { elements: Row[] };
  if (elements.length) process.stdout.write(`${date}:${elements.length} `);
  rows.push(...elements);
  await new Promise((r) => setTimeout(r, 600));   // 측정된 제한이 초당 2건이다
}
console.log(`\n\n${DAYS}일간 정산 수수료 ${rows.length}건`);

const usable = rows.filter((r) => SCOPE.has(r.productOrderType) && NORMAL.has(r.settleType));
const refunds = usable.filter((r) => r.productOrderType === "PREFERENTIAL_COMMISSION");
if (refunds.length) {
  const sum = refunds.reduce((a, r) => a + r.commissionAmount, 0);
  console.log(`우대 수수료 환급 ${refunds.length}건 합계 ${sum.toLocaleString()}원`
    + ` — ${sum < 0 ? "차감 분개로 합산됨" : "부호가 양수다. 실효율이 과소 계상될 수 있으니 확인할 것"}`);
}
if (!usable.length) {
  console.log("\n실측할 정산 건이 없습니다. seed-fees.ts --grade 로 등급을 직접 지정하세요.");
  process.exit(0);
}

// ── 수수료 타입별 실효율 ──────────────────────────────────────
const agg = new Map<string, { basis: number; amount: number; n: number; means: Set<string> }>();
for (const r of usable) {
  const a = agg.get(r.commissionType)
    ?? { basis: 0, amount: 0, n: 0, means: new Set<string>() };
  a.basis += r.commissionBasisAmount;
  a.amount += r.commissionAmount;
  a.n++;
  if (r.payMeansType) a.means.add(r.payMeansType.replace("PAYMEANS_TYPE_", ""));
  agg.set(r.commissionType, a);
}

for (const [type, a] of agg) {
  if (a.basis === 0) {
    console.log(`${type}: 기준금액이 0이라 율을 낼 수 없다 (${a.n}건, ${a.amount.toLocaleString()}원). 제외.`);
    agg.delete(type);
  }
}

const measured = [...agg].map(([type, a]) => ({
  수수료타입: type, kind: KIND[type] ?? "OTHER", 건수: a.n,
  기준금액: a.basis, 수수료: a.amount,
  "실효%": ((a.amount / a.basis) * 100).toFixed(3),
  결제수단: [...a.means].join(","),
}));
console.table(measured);

if (!APPLY) {
  console.log("반영하려면 --apply 를 붙이세요.");
  process.exit(0);
}

// ── channel_fee 반영 ──────────────────────────────────────────
// 같은 kind 로 매핑되는 타입이 여럿이면 합산한다 (SALE_COMMISSION + PLATFORM_COMMISSION 등).
const byKind = new Map<string, { basis: number; amount: number; types: string[] }>();
for (const [type, a] of agg) {
  const k = KIND[type] ?? "OTHER";
  const b = byKind.get(k) ?? { basis: 0, amount: 0, types: [] };
  b.basis += a.basis; b.amount += a.amount; b.types.push(type);
  byKind.set(k, b);
}

const db = new pg.Client({ connectionString: process.env.DATABASE_URL });
await db.connect();
const { rows: [t] } = await db.query<{ id: string }>(
  `select id from tenant where name = '이지오피스'`);
if (!t) { console.error("테넌트가 없습니다."); process.exit(1); }

for (const [kind, b] of byKind) {
  const rate = b.amount / b.basis;
  await db.query(
    `insert into channel_fee (tenant_id, channel, category, kind, rate, vat_included, memo)
     values ($1, 'NAVER', '', $2, $3, true, $4)
     on conflict (tenant_id, channel, category, kind)
       do update set rate = excluded.rate, vat_included = true,
                     memo = excluded.memo, updated_at = now()`,
    [t.id, kind, rate.toFixed(4),
     `정산 실측 — ${b.types.join("+")} · ${usable.length}건 · 최근 ${DAYS}일 · ${new Date().toISOString().slice(0, 10)} 반영`]);
  console.log(`${kind}  ${(rate * 100).toFixed(3)}%  ← ${b.types.join("+")}`);
}
await db.end();
