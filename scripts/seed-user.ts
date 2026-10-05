// 로그인 계정을 만든다(또는 비밀번호를 바꾼다).
//
// 가입 화면은 없다 — 계정은 운영자가 이 스크립트로 만든다. 외부 인증 서비스와 무관하게
// 이 시스템의 `app_user` 에만 저장되고, 비밀번호는 **bcrypt 해시로만** 남는다.
//
// 실행:
//   npm run seed:user -- --email me@example.com --name 홍길동
//   npm run seed:user -- --email me@example.com --password '직접지정'
//   npm run seed:user -- --email me@example.com --tenant <uuid>   # 판매자가 둘 이상일 때
//
// --password 를 주지 않으면 **임의 비밀번호를 만들어 한 번만 출력한다.** 저장하지 않는다.
// 셸 히스토리에 비밀번호를 남기지 않는 쪽이 안전하므로 그게 기본이다.
import { randomBytes } from "node:crypto";
import pg from "pg";
import { loadEnv } from "./pgx.mjs";

loadEnv();
const { hashPassword } = await import("../src/lib/auth.ts");

const arg = (k: string) => {
  const i = process.argv.indexOf(`--${k}`);
  return i > 0 ? process.argv[i + 1] : undefined;
};

const email = arg("email");
if (!email) {
  console.error("사용법: npm run seed:user -- --email <이메일> [--name <이름>] [--password <비밀번호>] [--tenant <uuid>]");
  process.exit(1);
}
const name = arg("name") ?? email.split("@")[0]!;
const role = arg("role") ?? "OWNER";

// 사람이 받아 적을 수 있는 임의 비밀번호. 헷갈리는 글자(0/O/1/l/I)는 뺀다.
const ALPHABET = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const randomPassword = () =>
  Array.from(randomBytes(16), (b) => ALPHABET[b % ALPHABET.length]).join("");

const givenPassword = arg("password");
const password = givenPassword ?? randomPassword();

const db = new pg.Client({ connectionString: process.env.DATABASE_URL });
await db.connect();

// 테넌트 결정. --tenant 가 없으면 판매자 테넌트가 하나뿐일 때만 자동으로 고른다 —
// 둘 이상인데 아무거나 고르면 남의 데이터를 볼 수 있는 계정이 생긴다.
let tenantId = arg("tenant");
if (!tenantId) {
  const { rows } = await db.query<{ id: string; name: string }>(
    `select id, name from tenant where not is_platform order by name`);
  if (rows.length === 0) {
    console.error("판매자 테넌트가 없습니다. npx tsx scripts/seed-tenant.ts 를 먼저 실행하세요.");
    process.exit(1);
  }
  if (rows.length > 1) {
    console.error(`판매자 테넌트가 ${rows.length}개입니다. --tenant <uuid> 로 지정하세요:`);
    for (const r of rows) console.error(`  ${r.id}  ${r.name}`);
    process.exit(1);
  }
  tenantId = rows[0]!.id;
}

const hash = await hashPassword(password);

// 같은 이메일이면 비밀번호·이름을 갱신한다 — 비밀번호 재설정도 이 스크립트로 한다.
// 소문자 유니크 인덱스(app_user_email_uk)가 있으므로 대소문자가 달라도 한 계정이다.
const { rows: [row] } = await db.query<{ id: string; created: boolean }>(
  `insert into app_user (tenant_id, email, password_hash, name, role)
   values ($1, $2, $3, $4, $5)
   on conflict (lower(email)) do update
     set password_hash = excluded.password_hash,
         name          = excluded.name
   returning id, (xmax = 0) as created`,
  [tenantId, email.trim(), hash, name, role]);

console.log(`${row!.created ? "생성" : "갱신"}  ${email}  (${name}, ${role})`);
console.log(`테넌트  ${tenantId}`);
if (!givenPassword) {
  console.log(`\n비밀번호: ${password}`);
  console.log("이 값은 다시 볼 수 없습니다. 지금 옮겨 두세요.");
}

// 비밀번호를 바꿨으면 기존 세션을 끊는다. 안 끊으면 유출된 세션이 계속 살아 있다.
const { rowCount } = await db.query(`delete from app_session where user_id = $1`, [row!.id]);
if (rowCount) console.log(`기존 세션 ${rowCount}건 종료`);

await db.end();
