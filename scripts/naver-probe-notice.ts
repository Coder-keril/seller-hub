// 상품정보제공고시 품목군별 필수 항목 확인. 읽기 전용.
import { loadEnv } from "./pgx.mjs";
loadEnv();
const { callApi, resolveDefaultAccount } = await import("../src/lib/naver/auth.ts");
await resolveDefaultAccount();

const types = process.argv.slice(2).filter((a) => !a.startsWith("-"));
for (const t of types.length ? types : ["GENERAL_FOOD", "WEAR", "KITCHEN_UTENSILS", "ETC"]) {
  const res = await callApi(`/v1/products-for-provided-notice/${t}`);
  const text = await res.text();
  console.log(`\n████ ${t}  ${res.status}`);
  if (!res.ok) { console.log(text.slice(0, 220)); continue; }
  const j = JSON.parse(text) as Record<string, unknown>;
  const arr = Array.isArray(j) ? j
    : (j.data ?? j.contents ?? Object.values(j).find(Array.isArray)) as unknown[] | undefined;
  if (!Array.isArray(arr)) { console.log(JSON.stringify(j).slice(0, 500)); continue; }
  console.log(`항목 ${arr.length}개`);
  for (const f of arr as Record<string, unknown>[]) {
    console.log("  " + Object.entries(f).filter(([, v]) => typeof v !== "object")
      .map(([k, v]) => `${k}=${v}`).join("  ").slice(0, 190));
  }
  await new Promise((r) => setTimeout(r, 600));
}
