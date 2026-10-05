// SQL 파일을 DATABASE_URL 에 적용한다.  실행: node scripts/apply-sql.mjs sql/001_init.sql
import pg from "pg";
import fs from "node:fs";
import { loadEnv } from "./pgx.mjs";

loadEnv();
const file = process.argv[2];
if (!file) throw new Error("적용할 SQL 파일 경로를 주세요.");

const db = new pg.Client({ connectionString: process.env.DATABASE_URL });
await db.connect();
try {
  await db.query("begin");
  await db.query(fs.readFileSync(file, "utf8"));
  await db.query("commit");
  console.log(`${file} 적용 완료`);
} catch (e) {
  await db.query("rollback");
  console.error(`적용 실패: ${e.message}`);
  process.exitCode = 1;
} finally {
  await db.end();
}
