// merrycoco_web (MSSQL) 영수증 → Supabase `receipt` / `receipt_item` 이관.
//
// ⚠️ **이 스크립트는 분리 전 과도기다.** seller-hub 앱은 MSSQL 에 접속하지 않는 것이 원칙이고,
//    동기화는 별도 sync 서비스로 떼어낼 예정이다. 그때 이 파일은 이 저장소를 떠난다.
//
// **컬럼을 매핑하지 않는다. `raw_text` 를 우리 파서로 다시 읽는다.**
//   · 앱의 저장 경로(`saveReceipt`)를 그대로 타므로 두 경로가 갈라질 수 없다.
//   · 원문이 정본이다 — 파서를 고치면 다시 돌려 재적재하면 된다(멱등).
//   · 덤으로 **실제 영수증 141건으로 파서를 검증**한다. 재파싱 값이 MSSQL 에 저장된 값과
//     다르면 둘 중 하나가 틀린 것이니 조용히 넘기지 않고 보고한다.
//
// 실행:  npx tsx scripts/import-receipts.ts        # 비교만 (기본)
//        npx tsx scripts/import-receipts.ts --go   # 실제 적재
//        npx tsx scripts/import-receipts.ts --tenant <uuid> --go
//
// ⚠️ **`--tenant` 를 주지 않으면 판매자 테넌트(`not is_platform`)가 하나뿐일 때만 돈다.**
//    2026-10-06 에 기존 141건을 메리코코(플랫폼 테넌트)로 옮겼으므로, 재적재할 때는
//    `--tenant` 로 명시해야 한다 — 안 주면 **빈 이지오피스 테넌트에 쌓인다.**
import sql from "mssql";
import { loadEnv } from "./pgx.mjs";

loadEnv();
const { parseReceipt } = await import("../src/lib/receipt/parse.ts");
const { saveReceipt, DuplicateReceiptError } = await import("../src/lib/receipt/save.ts");
const { soleTenant } = await import("../src/lib/session.ts");
const { pool } = await import("../src/lib/db.ts");

const GO = process.argv.includes("--go");

/** `--tenant <uuid>` 로 받은 대상. 없는 id 면 멈춘다 — 빈 테넌트에 쌓는 것보다 낫다. */
async function namedTenant(id: string | undefined) {
  const { rows } = await pool().query<{ id: string; name: string }>(
    `select id, name from tenant where id::text = $1`, [id ?? ""]);
  if (!rows[0]) throw new Error(`--tenant 가 가리키는 테넌트가 없습니다: ${id}`);
  return rows[0];
}

interface Row {
  seq: number;
  raw_text: string | null;
  member_no: string | null;
  approval_no: string | null;
  purchased_at: Date;
  register: string | null;
  total: number | null;
  item_count: number | null;
  coupon_total: number | null;
  reconciled: boolean | null;
}

/** datetime2 는 타임존이 없다. 드라이버가 UTC 로 만든 Date 에서 벽시계를 되꺼낸다. */
const wall = (d: Date) => d.toISOString().slice(0, 19);

const need = (k: string): string => {
  const v = process.env[k];
  if (!v) throw new Error(`${k} 가 없습니다. .env.development 를 확인하세요.`);
  return v;
};

const mssql = await new sql.ConnectionPool({
  server: need("MSSQL_HOST"),
  port: Number(process.env.MSSQL_PORT ?? 1433),
  database: process.env.MSSQL_DB ?? "merrycoco_web",
  user: need("MSSQL_USER"),
  password: need("MSSQL_PASSWORD"),
  options: { encrypt: false, trustServerCertificate: true },
  requestTimeout: 120_000,
}).connect();

const tenantArg = process.argv.indexOf("--tenant");
const tenant = tenantArg > 0
  ? await namedTenant(process.argv[tenantArg + 1])
  : await soleTenant();
console.log(`대상 테넌트  ${tenant.name}  ${tenant.id}`);
console.log(GO ? "모드  적재(--go)\n" : "모드  비교만 — 적재하려면 --go\n");

const COLS = `seq, raw_text, member_no, approval_no, purchased_at, register,
              total, item_count, coupon_total, reconciled`;

let ok = 0, saved = 0, updated = 0, skipped = 0, dup = 0;
const mismatches: string[] = [];
const failures: string[] = [];

for (const [table, label] of [
  ["TB_costco_purchase_receipt", "구매"],
  ["TB_costco_refund_receipt", "환불"],
] as const) {
  const { recordset } = await mssql
    .request()
    .query<Row>(`select ${COLS} from dbo.${table} order by purchased_at`);
  console.log(`── ${label} ${recordset.length}건 ──`);

  for (const r of recordset) {
    if (!r.raw_text?.trim()) {
      skipped++;
      failures.push(`${label} seq=${r.seq}: 원문이 없어 재파싱할 수 없다`);
      continue;
    }

    let p: ReturnType<typeof parseReceipt>;
    try {
      p = parseReceipt(r.raw_text);
    } catch (e) {
      skipped++;
      failures.push(`${label} seq=${r.seq}: 파싱 예외 ${e instanceof Error ? e.message : String(e)}`);
      continue;
    }

    // 재파싱 결과 ↔ MSSQL 저장값 대조. 다르면 둘 중 하나가 틀렸다.
    const diff: string[] = [];
    const cmp = (name: string, mine: unknown, theirs: unknown) => {
      if (theirs == null) return;                       // 원천이 비어 있으면 비교 대상 아님
      if (String(mine ?? "") !== String(theirs)) diff.push(`${name} ${String(mine)}≠${String(theirs)}`);
    };
    cmp("합계", p.summary.total, r.total);
    cmp("상품수", p.summary.item_count, r.item_count);
    cmp("쿠폰합계", p.summary.coupon_total, r.coupon_total);
    cmp("승인번호", p.payment.approval_no, r.approval_no);
    cmp("회원번호", p.member_no, r.member_no);
    cmp("일시", p.purchased_at, wall(r.purchased_at));
    cmp("REG", p.register, r.register);
    cmp("검증", p.reconciled, r.reconciled);
    const expectedKind = table.includes("refund") ? "refund" : "purchase";
    if (p.kind !== expectedKind) diff.push(`구분 ${p.kind}≠${expectedKind}`);

    if (diff.length) mismatches.push(`${label} seq=${r.seq} (${wall(r.purchased_at)}): ${diff.join(" · ")}`);
    else ok++;

    if (!GO) continue;
    try {
      const res = await saveReceipt(tenant.id, p, r.raw_text);
      if (res.inserted) saved++;
      else updated++;
    } catch (e) {
      if (e instanceof DuplicateReceiptError) { dup++; continue; }
      failures.push(`${label} seq=${r.seq}: 저장 실패 ${e instanceof Error ? e.message : String(e)}`);
      skipped++;
    }
  }
}

console.log(`\n═══ 재파싱 대조 ═══`);
console.log(`  일치 ${ok}건 · 불일치 ${mismatches.length}건`);
for (const m of mismatches.slice(0, 20)) console.log(`  ⚠ ${m}`);
if (mismatches.length > 20) console.log(`  … 외 ${mismatches.length - 20}건`);

if (failures.length) {
  console.log(`\n═══ 처리 실패 ${failures.length}건 ═══`);
  for (const f of failures.slice(0, 20)) console.log(`  ✗ ${f}`);
}

if (GO) {
  console.log(`\n═══ 적재 ═══`);
  console.log(`  신규 ${saved} · 갱신 ${updated} · 중복차단 ${dup} · 건너뜀 ${skipped}`);
  const [h] = (await pool().query<{ n: number }>(
    `select count(*)::int n from receipt where tenant_id = $1`, [tenant.id])).rows;
  const [i] = (await pool().query<{ n: number }>(
    `select count(*)::int n from receipt_item i
       join receipt r on r.id = i.receipt_id where r.tenant_id = $1`, [tenant.id])).rows;
  console.log(`  현재 Supabase  영수증 ${h!.n}건 · 품목 ${i!.n}건`);
}

await mssql.close();
await pool().end();
