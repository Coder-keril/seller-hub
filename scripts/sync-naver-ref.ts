// 네이버 참조 데이터 수집 → channel_ref
//
//   카테고리          GET /v1/categories                     상품등록의 leafCategoryId
//   원산지 코드        GET /v1/product-origin-areas           originAreaInfo.originAreaCode
//   고시 품목군        GET /v1/products-for-provided-notice   productInfoProvidedNoticeType
//
// 마켓이 주는 응답 형태를 미리 단정하지 않는다. 필드 이름이 문서와 다를 수 있어
// 후보 키를 훑어 찾고, 원본은 raw 에 그대로 남긴다.
//
// 실행: npx tsx scripts/sync-naver-ref.ts [--dry]
import pg from "pg";
import { upsert, loadEnv } from "./pgx.mjs";

loadEnv();
const { callApi, rateState } = await import("../src/lib/naver/auth.ts");

const DRY = process.argv.includes("--dry");
const COLS = ["channel", "kind", "code", "name", "parent_code", "full_name", "leaf", "raw", "synced_at"];

interface Row {
  channel: string; kind: string; code: string; name: string;
  parent_code: string | null; full_name: string | null; leaf: boolean | null;
  raw: string; synced_at: Date;
}

/** 여러 후보 키 중 처음 있는 값을 꺼낸다. 문서와 실제 필드명이 다를 때를 대비한다. */
function pick(o: Record<string, unknown>, ...keys: string[]): unknown {
  for (const k of keys) if (o[k] !== undefined && o[k] !== null) return o[k];
  return null;
}

/** 응답에서 배열을 찾아낸다. 최상위 배열이거나 흔한 래퍼 키 아래에 있다. */
function toArray(json: unknown): Record<string, unknown>[] {
  if (Array.isArray(json)) return json as Record<string, unknown>[];
  if (json && typeof json === "object") {
    for (const k of ["data", "contents", "categories", "originAreas", "list", "result"]) {
      const v = (json as Record<string, unknown>)[k];
      if (Array.isArray(v)) return v as Record<string, unknown>[];
    }
    // 키가 하나이고 그 값이 배열이면 그것
    const vals = Object.values(json as object).filter(Array.isArray);
    if (vals.length === 1) return vals[0] as Record<string, unknown>[];
  }
  return [];
}

async function fetchKind(
  kind: string,
  path: string,
  map: (o: Record<string, unknown>) => Omit<Row, "channel" | "kind" | "raw" | "synced_at">,
): Promise<Row[]> {
  const res = await callApi(path);
  const text = await res.text();
  if (!res.ok) {
    console.error(`  ${kind} 실패 ${res.status}: ${text.slice(0, 200)}`);
    return [];
  }
  const items = toArray(JSON.parse(text));
  console.log(`  ${kind}: ${items.length}건  (요청량 남음 ${rateState(res).remaining ?? "?"})`);
  if (!items.length) console.error(`  ⚠ 배열을 찾지 못했습니다. 응답 앞부분: ${text.slice(0, 220)}`);

  const seen = new Set<string>();
  const rows: Row[] = [];
  for (const o of items) {
    const m = map(o);
    if (!m.code || !m.name) continue;
    if (seen.has(m.code)) continue;      // 같은 코드가 두 번 오면 첫 것만 (PK 충돌 방지)
    seen.add(m.code);
    rows.push({ channel: "NAVER", kind, raw: JSON.stringify(o), synced_at: new Date(), ...m });
  }
  return rows;
}

const jobs: [string, string, (o: Record<string, unknown>) => Omit<Row, "channel" | "kind" | "raw" | "synced_at">][] = [
  ["CATEGORY", "/v1/categories", (o) => {
    const full = String(pick(o, "wholeCategoryName", "wholeName", "fullName") ?? "");
    return {
      code: String(pick(o, "id", "categoryId", "code") ?? ""),
      name: String(pick(o, "name", "categoryName") ?? full.split(">").pop() ?? ""),
      // 상위 코드가 없으면 전체 경로에서 유추할 수 없으므로 null 로 둔다
      parent_code: pick(o, "parentId", "parentCategoryId") === null
        ? null : String(pick(o, "parentId", "parentCategoryId")),
      full_name: full || null,
      // last/leaf 플래그가 없으면 경로 깊이로 판단하지 않는다 (틀리면 등록이 실패한다)
      leaf: (() => {
        const v = pick(o, "last", "leaf", "lastCategory");
        return typeof v === "boolean" ? v : null;
      })(),
    };
  }],
  ["ORIGIN_AREA", "/v1/product-origin-areas", (o) => ({
    code: String(pick(o, "code", "originAreaCode", "id") ?? ""),
    name: String(pick(o, "name", "originAreaName") ?? ""),
    parent_code: pick(o, "parentCode", "parentId") === null
      ? null : String(pick(o, "parentCode", "parentId")),
    full_name: (pick(o, "wholeName", "fullName") as string) ?? null,
    leaf: (() => { const v = pick(o, "last", "leaf"); return typeof v === "boolean" ? v : null; })(),
  })],
  ["NOTICE_TYPE", "/v1/products-for-provided-notice", (o) => ({
    code: String(pick(o, "productInfoProvidedNoticeType", "type", "code", "id") ?? ""),
    name: String(pick(o, "name", "productInfoProvidedNoticeTypeName", "title") ?? ""),
    parent_code: null,
    full_name: null,
    leaf: true,
  })],
];

const db = new pg.Client({ connectionString: process.env.DATABASE_URL });
await db.connect();

let total = 0;
for (const [kind, path, map] of jobs) {
  const rows = await fetchKind(kind, path, map);
  if (rows.length && !DRY) {
    await upsert(db, "channel_ref", COLS, ["channel", "kind", "code"], rows);
    total += rows.length;
  }
  if (rows.length) {
    console.log(`    예: ${rows.slice(0, 3).map((r) => `${r.code}=${r.full_name ?? r.name}`).join(" / ")}`);
  }
  await new Promise((r) => setTimeout(r, 600));   // 초당 2건 제한
}

if (!DRY) {
  const { rows } = await db.query(
    `select kind, count(*)::int n, count(*) filter (where leaf)::int leafs,
            count(parent_code)::int with_parent, count(full_name)::int with_full
       from channel_ref where channel = 'NAVER' group by kind order by kind`);
  console.log("\n저장 결과:");
  console.table(rows);
}
await db.end();
console.log(DRY ? "\n(dry run — 저장하지 않음)" : `\n완료 — ${total}건`);
