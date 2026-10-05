// 원상품 판매 상태 변경.  사용: npx tsx scripts/naver-change-status.ts <originProductNo> <상태>
//   상태: SALE(판매중) | SUSPENSION(판매중지) | CLOSE(판매종료) | OUTOFSTOCK(품절)
import { loadEnv } from "./pgx.mjs";
loadEnv();
const { callApi, resolveDefaultAccount } = await import("../src/lib/naver/auth.ts");
await resolveDefaultAccount();

const [no, status = "SUSPENSION"] = process.argv.slice(2);
if (!no) { console.error("원상품 번호를 주세요."); process.exit(1); }

const res = await callApi(`/v1/products/origin-products/${no}/change-status`,
  { method: "PUT", body: JSON.stringify({ statusType: status }) });
const text = await res.text();
console.log(`${no} → ${status}   ${res.status}`);
if (text.trim()) console.log(text.slice(0, 500));
