// 기존 등록 상품의 실제 구조 확인. 읽기 전용. 값은 타입으로 치환해 구조만 본다.
import { loadEnv } from "./pgx.mjs";
loadEnv();
const { callApi, resolveDefaultAccount } = await import("../src/lib/naver/auth.ts");
await resolveDefaultAccount();

const list = await (await callApi("/v1/products/search",
  { method: "POST", body: JSON.stringify({ page: 1, size: 1 }) })).json() as any;
const items = list.contents ?? list.data ?? [];
console.log(`목록 응답 키: ${Object.keys(list).join(", ")}`);
if (!items.length) { console.log("상품이 없습니다."); process.exit(0); }
console.log("목록 항목 키:", Object.keys(items[0]).join(", "), "\n");

const no = items[0].originProductNo ?? items[0].productNo ?? items[0].originProductNo;
console.log(`원상품 번호: ${no}\n`);

const res = await callApi(`/v2/products/origin-products/${no}`);
console.log(`원상품 조회 ${res.status}`);
if (!res.ok) { console.log((await res.text()).slice(0, 400)); process.exit(1); }
const p = await res.json() as any;

// 값은 버리고 키 트리만. 문자열 enum 은 설계에 필요하니 남긴다.
function tree(v: unknown, depth = 0, path = ""): string[] {
  if (depth > 3 || v === null || typeof v !== "object") return [];
  const out: string[] = [];
  for (const [k, val] of Object.entries(v as object)) {
    const p2 = path ? `${path}.${k}` : k;
    const t = val === null ? "null"
      : Array.isArray(val) ? `[${val.length}]`
      : typeof val === "object" ? "{}"
      : typeof val === "string" && /^[A-Z][A-Z0-9_]{2,}$/.test(val) ? `"${val}"`
      : typeof val;
    out.push(`${"  ".repeat(depth)}${k}: ${t}`);
    if (val && typeof val === "object" && !Array.isArray(val)) out.push(...tree(val, depth + 1, p2));
    else if (Array.isArray(val) && val.length && typeof val[0] === "object")
      out.push(...tree(val[0], depth + 1, `${p2}[0]`));
  }
  return out;
}
console.log("\n=== 원상품 구조 ===");
console.log(tree(p).join("\n"));
