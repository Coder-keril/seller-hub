import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = fileURLToPath(new URL("..", import.meta.url));

// 딩컴딜과 같은 관례: .env.development 우선, 없으면 .env
export function loadEnv() {
  for (const name of [".env.development", ".env"]) {
    const f = path.join(ROOT, name);
    if (fs.existsSync(f)) return process.loadEnvFile(f), name;
  }
  throw new Error(".env.development 또는 .env 가 없습니다.");
}

// 다중 VALUES upsert 한 개. 동기화 스크립트와 API 서버가 같이 쓴다.
//
// pg 의 파라미터 상한은 65535 개라 행 수가 아니라 (행 × 컬럼) 기준으로 끊어야 한다.
export const BATCH = 500;

export async function upsert(db, table, cols, conflictCols, rows) {
  const update = cols
    .filter((c) => !conflictCols.includes(c))
    .map((c) => `${c} = excluded.${c}`)
    .join(", ");
  for (let i = 0; i < rows.length; i += BATCH) {
    const chunk = rows.slice(i, i + BATCH);
    const values = chunk
      .map((_, r) => `(${cols.map((_, c) => `$${r * cols.length + c + 1}`).join(",")})`)
      .join(",");
    await db.query(
      `insert into ${table} (${cols.join(",")}) values ${values}
       on conflict (${conflictCols.join(",")}) do update set ${update}`,
      chunk.flatMap((row) => cols.map((c) => row[c]))
    );
  }
  return rows.length;
}
