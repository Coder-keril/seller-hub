// 기존 등록 상품의 고시정보·이미지 실제 값 확인. 읽기 전용.
import { loadEnv } from "./pgx.mjs";
loadEnv();
const { callApi, resolveDefaultAccount } = await import("../src/lib/naver/auth.ts");
await resolveDefaultAccount();

const p = await (await callApi("/v2/products/origin-products/10277451680")).json() as any;
const op = p.originProduct ?? {};
console.log("=== productInfoProvidedNotice ===");
console.log(JSON.stringify(op.detailAttribute?.productInfoProvidedNotice, null, 2));
console.log("\n=== images ===");
const im = op.images ?? {};
console.log("대표:", im.representativeImage?.url);
console.log("추가:", (im.optionalImages ?? []).map((x: any) => x.url));
console.log("\n=== originAreaInfo ===");
console.log(JSON.stringify(op.detailAttribute?.originAreaInfo, null, 2));
console.log("\n=== certificationTargetExcludeContent ===");
console.log(JSON.stringify(op.detailAttribute?.certificationTargetExcludeContent, null, 2));
console.log("\n=== detailContent 앞 300자 ===");
console.log(String(op.detailContent ?? "").slice(0, 300));
