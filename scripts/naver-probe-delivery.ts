import { loadEnv } from "./pgx.mjs";
loadEnv();
const { callApi, resolveDefaultAccount } = await import("../src/lib/naver/auth.ts");
await resolveDefaultAccount();
const res = await callApi("/v2/product-delivery-info/return-delivery-companies");
const text = await res.text();
console.log(`상태 ${res.status}`);
if (!res.ok) { console.log(text.slice(0, 300)); process.exit(1); }
const j = JSON.parse(text) as Record<string, unknown>;
const arr = (Array.isArray(j) ? j : Object.values(j).find(Array.isArray)) as Record<string, unknown>[] | undefined;
if (!arr) { console.log(JSON.stringify(j).slice(0, 400)); process.exit(0); }
console.log(`${arr.length}건\n`);
for (const c of arr) {
  console.log("  " + Object.entries(c).filter(([, v]) => typeof v !== "object")
    .map(([k, v]) => `${k}=${v}`).join("  "));
}
