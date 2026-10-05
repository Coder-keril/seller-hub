// 상품의 상태 관련 필드를 전부 보여준다. 원상품 / 채널상품 상태가 따로다.
import { loadEnv } from "./pgx.mjs";
loadEnv();
const { callApi, resolveDefaultAccount } = await import("../src/lib/naver/auth.ts");
await resolveDefaultAccount();

const no = process.argv[2] ?? "13721295767";
const p = await (await callApi(`/v2/products/origin-products/${no}`)).json() as any;
const op = p.originProduct ?? {};
console.log("=== 원상품 ===");
for (const k of ["statusType", "saleType", "salePrice", "stockQuantity", "name"]) {
  console.log(`  ${k.padEnd(16)} ${JSON.stringify(op[k])}`);
}
console.log("\n=== smartstoreChannelProduct ===");
console.log(JSON.stringify(p.smartstoreChannelProduct, null, 2));

// 목록 조회에서 채널상품 쪽 상태도 확인
const list = await (await callApi("/v1/products/search",
  { method: "POST", body: JSON.stringify({ page: 1, size: 20 }) })).json() as any;
const hit = (list.contents ?? []).find((c: any) => String(c.originProductNo) === String(no));
console.log("\n=== 목록의 채널상품 ===");
for (const ch of hit?.channelProducts ?? []) {
  const keys = Object.keys(ch).filter((k) => /status|display|state|sale/i.test(k));
  for (const k of keys) console.log(`  ${k.padEnd(34)} ${JSON.stringify(ch[k])}`);
}
