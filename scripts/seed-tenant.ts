// 초기 테넌트와 채널 계정을 만든다. 환경변수에 있던 마켓 인증정보를 DB 로 옮긴다.
//
//   .env 에 남는 것은 플랫폼 전역 비밀뿐이다 — CREDENTIAL_KEY · DATABASE_URL · MSSQL_* · R2_*
//   판매자별 마켓·택배사 인증정보는 channel_account / courier_account 에 암호화해 저장한다.
//
// 실행: npx tsx scripts/seed-tenant.ts [--from-env]
//   --from-env  NAVER_APP_ID / NAVER_APP_SECRET 를 읽어 네이버 계정을 만든다
import pg from "pg";
import { loadEnv } from "./pgx.mjs";

loadEnv();
const { sealCredential } = await import("../src/lib/crypto.ts");

const FROM_ENV = process.argv.includes("--from-env");
const db = new pg.Client({ connectionString: process.env.DATABASE_URL });
await db.connect();

// ── 메리코코: 플랫폼 운영 테넌트 ────────────────────────────────
const { rows: [platform] } = await db.query<{ id: string }>(
  `insert into tenant (name, is_platform) values ('메리코코', true)
   on conflict do nothing returning id`);
const platformId = platform?.id
  ?? (await db.query<{ id: string }>(`select id from tenant where is_platform limit 1`)).rows[0]?.id;
console.log(`플랫폼 테넌트  ${platformId}  메리코코`);

// ── 이지오피스: 첫 판매자 ──────────────────────────────────────
let { rows: [seller] } = await db.query<{ id: string }>(
  `select id from tenant where name = '이지오피스'`);
if (!seller) {
  ({ rows: [seller] } = await db.query<{ id: string }>(
    `insert into tenant (name) values ('이지오피스') returning id`));
  console.log(`판매자 테넌트  ${seller!.id}  이지오피스 (신규)`);
} else {
  console.log(`판매자 테넌트  ${seller.id}  이지오피스 (기존)`);
}
const tenantId = seller!.id;

// 발송 방식 — 이지오피스는 메리코코 본인이므로 직접 발송으로 둔다
await db.query(
  `insert into fulfillment_delegation (tenant_id, mode) values ($1, 'SELF')
   on conflict (tenant_id) do nothing`, [tenantId]);

// 가격정책 기본값 (금액은 cost_item 이 담당한다)
await db.query(
  `insert into price_policy (tenant_id, base_channel, mode, target_profit)
   values ($1, 'store', 'FIXED_PROFIT', 10000)
   on conflict do nothing`, [tenantId]);

// 고정비 — 택배비·박스비. 위임/직접 단가가 다르므로 mode 를 나눠 둔다
for (const [code, name, kind, amount, mode] of [
  ["SHIPPING", "택배비", "FIXED", 3000, "SELF"],
  ["SHIPPING", "택배비", "FIXED", 2800, "MERRYCOCO"],
  ["PACKING", "박스·부자재비", "FIXED", 300, "MERRYCOCO"],
] as const) {
  await db.query(
    `insert into cost_item (tenant_id, code, name, kind, amount, mode)
     values ($1, $2, $3, $4, $5, $6)
     on conflict (tenant_id, code, mode) where channel is null do nothing`,
    [tenantId, code, name, kind, amount, mode]);
}

// ── 네이버 채널 계정 ───────────────────────────────────────────
// 내스토어 애플리케이션은 판매자마다 다르므로 DB 에 담는다.
// 솔루션·대행사 경로로 전환하면 전역 애플리케이션 + accountId 만 담게 된다.
if (FROM_ENV) {
  const appId = process.env.NAVER_APP_ID;
  const appSecret = process.env.NAVER_APP_SECRET;
  if (!appId || !appSecret) {
    console.error("NAVER_APP_ID / NAVER_APP_SECRET 가 없습니다.");
    process.exit(1);
  }
  if (!process.env.CREDENTIAL_KEY) {
    console.error("CREDENTIAL_KEY 가 없습니다. 아래로 만들어 .env 에 넣으세요.");
    console.error(`  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`);
    process.exit(1);
  }

  const sealed = sealCredential({ appId, appSecret, authType: "SELF" });
  const { rows: [acc] } = await db.query<{ id: string }>(
    `insert into channel_account (tenant_id, channel, alias, credential_enc)
     values ($1, 'NAVER', '이지오피스 스마트스토어', $2)
     on conflict (tenant_id, channel, alias)
       do update set credential_enc = excluded.credential_enc
     returning id`, [tenantId, sealed]);
  console.log(`네이버 계정    ${acc!.id}  (인증정보 암호화 저장)`);
  console.log(`\n이제 .env 에서 NAVER_APP_ID / NAVER_APP_SECRET 를 지워도 됩니다.`);
}

const { rows: summary } = await db.query(`
  select t.name, t.is_platform, d.mode,
         (select count(*)::int from channel_account a where a.tenant_id = t.id) as 채널,
         (select count(*)::int from cost_item c where c.tenant_id = t.id) as 고정비
    from tenant t left join fulfillment_delegation d on d.tenant_id = t.id
   order by t.is_platform desc, t.name`);
console.log("\n현황:");
console.table(summary);
await db.end();
