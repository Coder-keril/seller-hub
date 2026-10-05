import { PGlite } from "@electric-sql/pglite";
import { readFileSync, readdirSync } from "node:fs";
import { upsert } from "../scripts/pgx.mjs";
const db = await PGlite.create();
// sql/*.sql 을 파일명 순서로 전부 적용한다 — 새 설치와 같은 경로를 밟는다.
const files = readdirSync(new URL(".", import.meta.url)).filter((f) => f.endsWith(".sql")).sort();
for (const f of files) {
  try { await db.exec(readFileSync(new URL(f, import.meta.url), "utf8")); }
  catch (e) { console.error(`DDL 실패 (${f}):`, e.message); process.exit(1); }
}
console.log(`DDL OK — ${files.join(", ")}`);

// 스모크: 테넌트 1개 → 마스터 → 가져오기 → 채널상품 → 주문 → 송장
await db.exec(`
  insert into tenant (id,name) values ('11111111-1111-1111-1111-111111111111','판매자A');
  insert into master_product (id,retailer,product_code,name,source_updated_at)
    values ('costco:123','costco','123','테스트 상품',now());
  insert into master_price values ('costco:123','STORE',12900,now());
  insert into tenant_product (id,tenant_id,master_id)
    values ('22222222-2222-2222-2222-222222222222','11111111-1111-1111-1111-111111111111','costco:123');
  insert into channel_account (id,tenant_id,channel,alias,credential_enc)
    values ('33333333-3333-3333-3333-333333333333','11111111-1111-1111-1111-111111111111','COUPANG','메인','\\x00');
  insert into channel_product (tenant_id,tenant_product_id,channel_account_id,channel,external_product_id,sale_price)
    values ('11111111-1111-1111-1111-111111111111','22222222-2222-2222-2222-222222222222','33333333-3333-3333-3333-333333333333','COUPANG','CP-1',17500);
  insert into orders (id,tenant_id,channel_account_id,channel,external_order_id,ordered_at,raw_json)
    values ('44444444-4444-4444-4444-444444444444','11111111-1111-1111-1111-111111111111','33333333-3333-3333-3333-333333333333','COUPANG','ORD-1',now(),'{}');
  insert into shipment (tenant_id,order_id) values ('11111111-1111-1111-1111-111111111111','44444444-4444-4444-4444-444444444444');
`);
console.log("삽입 OK");

// 중복 주문이 DB 에서 막히는가 (Idempotency)
let blocked = false;
try {
  await db.exec(`insert into orders (tenant_id,channel_account_id,channel,external_order_id,ordered_at,raw_json)
    values ('11111111-1111-1111-1111-111111111111','33333333-3333-3333-3333-333333333333','COUPANG','ORD-1',now(),'{}')`);
} catch { blocked = true; }
console.log(blocked ? "중복 주문 차단 OK" : "✗ 중복 주문이 들어갔다");

// job 중복 큐잉이 막히는가
await db.exec(`insert into job (kind,payload) values ('POLL_ORDERS','{"account":"33333333-3333-3333-3333-333333333333"}')`);
let jobBlocked = false;
try {
  await db.exec(`insert into job (kind,payload) values ('POLL_ORDERS','{"account":"33333333-3333-3333-3333-333333333333"}')`);
} catch { jobBlocked = true; }
console.log(jobBlocked ? "job 중복 차단 OK" : "✗ 같은 job 이 두 번 큐잉됐다");

// SKIP LOCKED 픽업이 도는가
const picked = await db.query(`
  update job set status='RUNNING', started_at=now()
  where id in (select id from job where status='QUEUED' and run_after <= now()
               order by run_after limit 10 for update skip locked)
  returning id, kind`);
console.log(`job 픽업 OK (${picked.rows.length}건)`);

// upsert — 배치 경계(500)를 넘겨 파라미터 번호가 어긋나지 않는지 본다
const cols = ["id","retailer","product_code","name","source_updated_at"];
const many = Array.from({ length: 620 }, (_, i) => ({
  id: `traders:${i}`, retailer: "traders", product_code: String(i),
  name: `상품 ${i}`, source_updated_at: new Date(),
}));
await upsert(db, "master_product", cols, ["id"], many);
const c1 = await db.query("select count(*)::int n from master_product where retailer='traders'");

// 같은 걸 이름만 바꿔 다시 — 중복이 아니라 갱신되어야 한다
await upsert(db, "master_product", cols, ["id"], many.map((r) => ({ ...r, name: r.name + " 수정" })));
const c2 = await db.query("select count(*)::int n from master_product where retailer='traders'");
const updated = await db.query("select name from master_product where id='traders:600'");
const upsertOk = c1.rows[0].n === 620 && c2.rows[0].n === 620 && updated.rows[0].name.endsWith("수정");
console.log(upsertOk ? "upsert 배치/갱신 OK" : `✗ upsert 이상 (${c1.rows[0].n} → ${c2.rows[0].n}, ${updated.rows[0].name})`);


// ── 영수증: 저장 SQL 의 멱등성·중복차단 ─────────────────────────────
// src/lib/receipt/statements.ts 의 receiptStatements() 가 내놓는 **그 SQL** 을 돌린다.
// 여기 복사해 두면 조용히 갈라지므로 반드시 모듈을 거친다.
const { parseReceipt } = await import("../src/lib/receipt/parse.ts");
const { buildReceiptPayload } = await import("../src/lib/receipt/payload.ts");
const { receiptStatements, NET_AMT_SQL } = await import("../src/lib/receipt/statements.ts");

const TENANT = "11111111-1111-1111-1111-111111111111";
const RCPT = `931327247700
판매
트레비탄산수레몬
631244   2   12,990   25,980 T
면세   0
과세   23,618
부가세   2,362
**** 합계 (VAT 포함)   25,980
거래구분:구매
승인금액: 25,980 할부 00개월
카드번호: 40201780____180_
승인번호: 00786770 BC AP
카드   25,980
잔돈   0
총 판매 상품 수 2
2026/02/06 12:11:00 PM 855 8 77 140

REG#8

2026/02/06`;

const parsed = parseReceipt(RCPT);
if (!parsed.reconciled) { console.error("✗ 체크용 영수증이 reconciled=false 다"); process.exit(1); }

async function saveOnce(payload, kind) {
  const st = receiptStatements(payload, kind);
  const r = await db.query(st.header.sql, [TENANT, ...st.header.params]);
  const id = r.rows[0].id;
  await db.query(st.deleteItems.sql, [id]);
  if (st.insertItems) await db.query(st.insertItems.sql, [id, ...st.insertItems.params]);
  return { id, inserted: r.rows[0].inserted };
}

const payload = buildReceiptPayload(parsed, RCPT);
const first = await saveOnce(payload, "PURCHASE");
const second = await saveOnce(payload, "PURCHASE");   // 같은 영수증 재업로드
const hdr = await db.query("select count(*)::int n from receipt where tenant_id=$1", [TENANT]);
const itm = await db.query("select count(*)::int n from receipt_item where receipt_id=$1", [first.id]);
const idempotent = hdr.rows[0].n === 1 && itm.rows[0].n === 1
  && first.id === second.id && first.inserted === true && second.inserted === false;
console.log(idempotent ? "영수증 멱등 저장 OK (재업로드 → 갱신)"
  : `✗ 영수증 멱등성 이상 (헤더 ${hdr.rows[0].n}, 상세 ${itm.rows[0].n}, inserted ${first.inserted}/${second.inserted})`);

// 같은 카드·승인번호라도 **시각·레인이 다르면 별개 영수증**이어야 한다.
// 실데이터(merrycoco_web 141건)에서 같은 날 같은 카드의 승인번호가 반복됐다 — 금액·수량이
// 다른 서로 다른 거래였다. 한때 그걸 중복으로 막는 인덱스를 뒀다가 5건을 잃었다(sql/011).
const other = await saveOnce({ ...payload, purchased_at: "2026-02-06T13:22:00", register: "9" }, "PURCHASE");
const hdr2 = await db.query("select count(*)::int n from receipt where tenant_id=$1", [TENANT]);
const cardBlocked = other.id !== first.id && other.inserted === true && hdr2.rows[0].n === 2;
console.log(cardBlocked ? "영수증 같은승인·다른시각 = 별개 OK"
  : `✗ 시각·레인이 다른 영수증이 별개로 들어가지 않았다 (헤더 ${hdr2.rows[0].n}건)`);
await db.query("delete from receipt where id = $1", [other.id]);

// 순금액(쿠폰 뺀 실지불액) 합 == 헤더 합계. 영수증의 네 번째 검산과 같은 식이라
// 반드시 맞아야 한다. 쿠폰을 빼지 않아 평균단가가 부풀었던 적이 있다(2026-10-05).
const netChk = await db.query(`
  select (select sum(${NET_AMT_SQL}) from receipt_item i where i.receipt_id = $1)::numeric as item_net,
         (select total from receipt where id = $1)::numeric as header_total`, [first.id]);
const netOk = Number(netChk.rows[0].item_net) === Number(netChk.rows[0].header_total);
console.log(netOk ? "영수증 순금액 = 헤더 합계 OK"
  : `✗ 순금액 ${netChk.rows[0].item_net} ≠ 헤더 합계 ${netChk.rows[0].header_total}`);

// 상세는 헤더를 지우면 함께 사라져야 한다(cascade).
await db.query("delete from receipt where id=$1", [first.id]);
const orphan = await db.query("select count(*)::int n from receipt_item where receipt_id=$1", [first.id]);
const cascadeOk = orphan.rows[0].n === 0;
console.log(cascadeOk ? "영수증 상세 cascade OK" : "✗ 상세가 고아로 남았다");

// ── 로그인 ────────────────────────────────────────────────────
// ① 같은 이메일을 대소문자만 바꿔 넣어도 한 계정이어야 한다. seed-user 는
//    `on conflict (lower(email))` 로 비밀번호를 갱신하는데, 표현식 인덱스를 충돌 대상으로
//    받아주지 않으면 계정이 둘로 갈라지고 둘 중 어느 쪽으로 로그인되는지 알 수 없다.
const u1 = await db.query(
  `insert into app_user (tenant_id, email, password_hash, name)
   values ($1, 'Owner@Example.com', 'h1', '주인')
   on conflict (lower(email)) do update set password_hash = excluded.password_hash
   returning id`, [TENANT]);
const u2 = await db.query(
  `insert into app_user (tenant_id, email, password_hash, name)
   values ($1, 'owner@example.com', 'h2', '주인')
   on conflict (lower(email)) do update set password_hash = excluded.password_hash
   returning id`, [TENANT]);
const userId = u1.rows[0].id;
const uCnt = await db.query("select count(*)::int n, max(password_hash) h from app_user where tenant_id=$1", [TENANT]);
const emailOk = u2.rows[0].id === userId && uCnt.rows[0].n === 1 && uCnt.rows[0].h === "h2";
console.log(emailOk ? "계정 이메일 대소문자 무관 OK (비밀번호 갱신)"
  : `✗ 대소문자가 다른 이메일이 별개 계정이 됐다 (${uCnt.rows[0].n}건)`);

// ② 만료된 세션은 조회되지 않아야 한다. auth.ts 의 sessionUser() 와 같은 조인·판정식을 쓴다.
await db.query(
  `insert into app_session (token_hash, user_id, expires_at) values
     ('live', $1, now() + interval '1 day'),
     ('dead', $1, now() - interval '1 second')`, [userId]);
const sess = await db.query(
  `select s.token_hash, (s.expires_at <= now()) as expired
     from app_session s join app_user u on u.id = s.user_id
    where s.token_hash = any($1)`, [["live", "dead"]]);
const live = sess.rows.find((r) => r.token_hash === "live");
const dead = sess.rows.find((r) => r.token_hash === "dead");
const expiryOk = live?.expired === false && dead?.expired === true;
console.log(expiryOk ? "세션 만료 판정 OK" : "✗ 세션 만료 판정이 틀렸다");

// ③ 계정을 지우면 세션도 사라져야 한다. 남으면 지워진 계정의 쿠키가 계속 통한다.
await db.query("delete from app_user where id=$1", [userId]);
const left = await db.query("select count(*)::int n from app_session where user_id=$1", [userId]);
const sessCascadeOk = left.rows[0].n === 0;
console.log(sessCascadeOk ? "계정 삭제 → 세션 cascade OK" : "✗ 세션이 고아로 남았다 (쿠키가 계속 통한다)");


// ── 번호 별명 ─────────────────────────────────────────────────
// 같은 (종류, 키) 로 다시 저장하면 **갱신**이어야 한다. 행이 둘로 늘면 어느 별명이 보이는지
// 알 수 없다. 종류가 다르면 같은 키라도 별개다(회원번호와 카드번호가 우연히 같을 일은
// 없지만, kind 를 PK 에서 빼면 그 가정에 기대게 된다).
await db.query(
  `insert into receipt_alias (tenant_id, kind, key, alias) values ($1,'CARD','1234-****-****-5678','큰형')
   on conflict (tenant_id, kind, key) do update set alias = excluded.alias`, [TENANT]);
await db.query(
  `insert into receipt_alias (tenant_id, kind, key, alias) values ($1,'CARD','1234-****-****-5678','본인')
   on conflict (tenant_id, kind, key) do update set alias = excluded.alias`, [TENANT]);
await db.query(
  `insert into receipt_alias (tenant_id, kind, key, alias) values ($1,'MEMBER','1234-****-****-5678','회원쪽')`, [TENANT]);
const al = await db.query(
  `select kind, alias from receipt_alias where tenant_id=$1 order by kind`, [TENANT]);
const aliasOk = al.rows.length === 2
  && al.rows.find((r) => r.kind === "CARD")?.alias === "본인"
  && al.rows.find((r) => r.kind === "MEMBER")?.alias === "회원쪽";
console.log(aliasOk ? "번호 별명 갱신·종류 분리 OK"
  : `✗ 별명 upsert 이상 (${JSON.stringify(al.rows)})`);

// ── 차액환불 기록이 남의 영수증을 가리킬 수 없다 ──────────────
// `price_adjust_claim.receipt_id` 의 FK 는 `receipt(id)` 만 본다 — 테넌트를 보지 않는다.
// 폼에서 온 uuid 를 그대로 넣으면 **내 테넌트에 남의 영수증을 가리키는 기록**이 생긴다.
// `adjust-claim.ts` 의 `insert ... select ... where exists` 가 그것을 막는다. 같은 SQL 을 여기서 검증한다.
await db.query(
  `insert into tenant (id,name) values ('22222222-2222-2222-2222-222222222222','판매자B')
   on conflict do nothing`);
const foreign = await db.query(
  `insert into receipt (tenant_id, kind, purchased_at, member_no, total, raw_text,
                        reconciled, qty_ok, coupon_ok, tax_ok, amount_ok)
   values ('22222222-2222-2222-2222-222222222222','PURCHASE','2026-03-01 10:00','9999',1000,'x',false,false,false,false,false)
   returning id`);
const otherReceipt = foreign.rows[0].id;
const CLAIM_SQL = `insert into price_adjust_claim
     (tenant_id, receipt_id, product_code, name, qty, paid_unit, sale_price, diff_total)
   select $1, $2, 'P1', '상품', 1, 1000, 500, 500
    where exists (select 1 from receipt where id = $2 and tenant_id = $1)
   on conflict (tenant_id, receipt_id, product_code) do update set claimed_at = now()
   returning id`;
const steal = await db.query(CLAIM_SQL, [TENANT, otherReceipt]);
// 내 영수증으로는 들어가야 한다(가드가 과하게 막지 않는지).
const mineReceipt = (await db.query(
  `insert into receipt (tenant_id, kind, purchased_at, member_no, total, raw_text,
                        reconciled, qty_ok, coupon_ok, tax_ok, amount_ok)
   values ($1,'PURCHASE','2026-03-02 10:00','1111',1000,'y',false,false,false,false,false)
   returning id`, [TENANT])).rows[0].id;
const ownClaim = await db.query(CLAIM_SQL, [TENANT, mineReceipt]);
const claimGuardOk = steal.rows.length === 0 && ownClaim.rows.length === 1;
console.log(claimGuardOk ? "차액환불 기록 테넌트 가드 OK (남의 영수증 거부)"
  : `✗ 가드 이상 (남의것 ${steal.rows.length}행, 내것 ${ownClaim.rows.length}행)`);

if (!blocked || !jobBlocked || !upsertOk || !idempotent || !cardBlocked || !netOk || !cascadeOk
    || !emailOk || !expiryOk || !sessCascadeOk || !aliasOk || !claimGuardOk) process.exit(1);
