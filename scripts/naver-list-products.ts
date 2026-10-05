import { loadEnv } from "./pgx.mjs";
loadEnv();
const { callApi, resolveDefaultAccount } = await import("../src/lib/naver/auth.ts");
await resolveDefaultAccount();
const res = await callApi("/v1/products/search",
  { method: "POST", body: JSON.stringify({ page: 1, size: 20 }) });
const j = await res.json() as any;
console.log(`총 ${j.totalElements}건\n`);
for (const c of j.contents ?? []) {
  const ch = (c.channelProducts ?? [])[0] ?? {};
  console.log(`원상품 ${c.originProductNo}  채널상품 ${ch.channelProductNo ?? "-"}`);
  console.log(`  ${ch.name ?? "(이름 없음)"}`);
  console.log(`  ${ch.salePrice?.toLocaleString?.() ?? "-"}원  상태 ${ch.statusType ?? "-"}`
    + `  카테고리 ${ch.wholeCategoryName ?? ch.categoryId ?? "-"}`);
}
