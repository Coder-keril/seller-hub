// 마켓 수수료를 channel_fee 에 넣는다.
//
//   channel_fee.category 는 **마켓 카테고리 코드**다 (마스터 카테고리가 아니다).
//   '' 는 채널 기본값이고, 조회 시 상품의 리프 카테고리 경로를 거슬러 가장 구체적인 것을 쓴다.
//
// 실행:  npx tsx scripts/seed-fees.ts [--grade 영세|중소1|중소2|중소3|일반]
//
// ⚠ 요율은 수시로 바뀐다. 최종 확인은 각 마켓 판매자센터 기준으로 한다.
//    네이버  스마트스토어센터 > 정산관리 > 정산내역 > '수수료 과금 기준' (본인 등급)
//    쿠팡    Wing > 판매자정보 (공개 요율표는 2019년 기준으로 낡았다)
import pg from "pg";
import { loadEnv } from "./pgx.mjs";

loadEnv();

// ── ① 네이버페이 주문관리 수수료 ─────────────────────────────────────────────
// 국세청 신고 연매출 등급별. 2025-10 부터 영세·중소 등급이 소폭 인하됐다.
// 아래는 **카드 결제 · VAT 포함** 기준이다.
const ORDER_FEE_BY_GRADE: Record<string, { rate: number; range: string }> = {
  "영세":  { rate: 0.01947, range: "~3억" },
  "중소1": { rate: 0.02563, range: "3~5억" },
  "중소2": { rate: 0.02728, range: "5~10억" },
  "중소3": { rate: 0.03003, range: "10~30억" },
  "일반":  { rate: 0.03630, range: "30억 이상" },
};
// 결제수단별로도 다르다 — 계좌이체 1.65% · 가상계좌 1.0% · 휴대폰 3.85% · 네이버페이 포인트 3.74%.
// 주문마다 달라 등록 시점에 알 수 없으므로 가장 흔한 카드 기준을 쓴다.
// 실제 부과액은 주문 수집 때 order_item.fee_amount 에 따로 남긴다.

// ── ② 네이버 판매 수수료 ─────────────────────────────────────────────────────
// 유입 경로에 따라 차등. 아래는 VAT 포함 실효율이다.
//   스마트스토어  일반 유입 3% (VAT별도 2.73%)  /  판매자 마케팅 유입 1% (VAT별도 0.91%)
//   브랜드스토어  일반 유입 4% (VAT별도 3.64%)  /  판매자 마케팅 유입 2% (VAT별도 1.82%)
// 등록 시점에 유입 경로를 알 수 없으므로 **보수적으로 일반 유입(3%)** 을 쓴다.
// 마케팅 링크를 거치면 실제 수수료가 낮아지고 그만큼 이익이 늘어난다.
const SALE_FEE_GENERAL = 0.03;

const grade = (() => {
  const i = process.argv.indexOf("--grade");
  const g = i === -1 ? "일반" : process.argv[i + 1]!;
  if (!ORDER_FEE_BY_GRADE[g]) {
    console.error(`등급은 ${Object.keys(ORDER_FEE_BY_GRADE).join(" | ")} 중 하나입니다.`);
    process.exit(1);
  }
  return g;
})();
const orderFee = ORDER_FEE_BY_GRADE[grade]!;

const db = new pg.Client({ connectionString: process.env.DATABASE_URL });
await db.connect();
const { rows: [t] } = await db.query<{ id: string }>(
  `select id from tenant where name = '이지오피스'`);
if (!t) { console.error("이지오피스 테넌트가 없습니다. seed-tenant.ts 를 먼저 실행하세요."); process.exit(1); }

// [채널, 카테고리코드, 항목, 율, VAT포함, 메모]
const fees: [string, string, string, number, boolean, string][] = [
  ["NAVER", "", "PAYMENT", orderFee.rate, true,
   `네이버페이 주문관리수수료. ${grade} 등급(연매출 ${orderFee.range}) · 카드 결제 기준. `
   + `결제수단별로 다르다 — 계좌이체 1.65% · 가상계좌 1.0% · 휴대폰 3.85% · NPay포인트 3.74%`],
  ["NAVER", "", "SALE", SALE_FEE_GENERAL, true,
   "판매수수료. 스마트스토어 일반 유입 3%(VAT포함, 별도 2.73%). "
   + "판매자 마케팅 유입은 1%로 감면되나 등록 시점에 알 수 없어 보수적으로 일반 유입 기준"],

  // ── 쿠팡: 카테고리별로 다르다. 결제수수료는 판매수수료에 포함된다 ──────────
  // 공개 요율표는 범위로 주어진다 (식품 5.8~10.9% · 패션 4.0~10.5% · 뷰티 9.6% ·
  // 가구/도서/공구/반려동물 10.8% · 가전디지털 3.0~7.8%).
  // 세부 카테고리 코드를 받으면 그때 세분화한다. 지금은 보수적인 상단을 기본값으로 둔다.
  ["COUPANG", "", "SALE", 0.109, false,
   "보수적 기본값 — 공개 요율표 최상단(식품 5.8~10.9%). VAT 별도. 카테고리 코드 확보 후 세분화"],
];

for (const [channel, category, kind, rate, vat, memo] of fees) {
  await db.query(
    `insert into channel_fee (tenant_id, channel, category, kind, rate, vat_included, memo)
     values ($1, $2, $3, $4, $5, $6, $7)
     on conflict (tenant_id, channel, category, kind)
       do update set rate = excluded.rate, vat_included = excluded.vat_included,
                     memo = excluded.memo, updated_at = now()`,
    [t.id, channel, category, kind, rate, vat, memo]);
}

console.log(`네이버 주문관리수수료 등급: ${grade} (연매출 ${orderFee.range}) — 카드 결제 기준\n`);
const { rows } = await db.query(`
  select channel, case when category = '' then '(기본)' else category end as 카테고리,
         kind as 항목, (rate * 100)::numeric(6,3) as "율%",
         case when vat_included then 'VAT포함' else 'VAT별도' end as vat,
         (rate * case when vat_included then 1 else 1.1 end * 100)::numeric(6,3) as "실효%"
    from channel_fee where tenant_id = $1 order by channel, category, kind`, [t.id]);
console.table(rows);

for (const ch of ["NAVER", "COUPANG"]) {
  const { rows: [s] } = await db.query<{ eff: string }>(
    `select sum(rate * case when vat_included then 1 else 1.1 end)::numeric(6,5) as eff
       from channel_fee where tenant_id = $1 and channel = $2 and category = ''`, [t.id, ch]);
  console.log(`${ch} 실효 합계  ${(Number(s!.eff) * 100).toFixed(3)}%`);
}

console.log("\n등급별 네이버 실효 합계 (판매수수료 3% 포함):");
console.table(Object.entries(ORDER_FEE_BY_GRADE).map(([g, v]) => ({
  등급: g, 연매출: v.range,
  "주문관리%": (v.rate * 100).toFixed(3),
  "실효합계%": ((v.rate + SALE_FEE_GENERAL) * 100).toFixed(3),
})));
await db.end();
