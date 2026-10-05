// 주문 폴링 API 응답 구조 확인. 읽기 전용, 개인정보는 가린다.
// 24시간 창을 과거로 거슬러 첫 데이터를 찾는다.
import { loadEnv } from "./pgx.mjs";
loadEnv();
const { callApi, rateState, resolveDefaultAccount } = await import("../src/lib/naver/auth.ts");
await resolveDefaultAccount();

const PII = /name|tel|phone|addr|zip|orderer|receiver|email|memo/i;
function shape(v: unknown): unknown {
  if (v === null) return "null";
  if (Array.isArray(v)) return v.length ? [shape(v[0])] : [];
  if (typeof v === "object") {
    const o: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(v as object)) {
      o[k] = PII.test(k) && typeof val !== "object" ? "***" : shape(val);
    }
    return o;
  }
  if (typeof v === "string") return /^[A-Z][A-Z0-9_]{2,}$/.test(v) ? v : "string";
  return typeof v;
}

const DAY = 24 * 3600 * 1000;
for (let d = 0; d < 30; d++) {
  const from = new Date(Date.now() - (d + 1) * DAY).toISOString();
  const qs = new URLSearchParams({ lastChangedFrom: from, limitCount: "10" });
  const res = await callApi(`/v1/pay-order/seller/product-orders/last-changed-statuses?${qs}`);
  if (!res.ok) {
    console.log(`${from.slice(0, 10)}  ${res.status}  ${(await res.text()).slice(0, 200)}`);
    break;
  }
  const json = await res.json() as any;
  const list = json?.data?.lastChangeStatuses ?? [];
  process.stdout.write(`${from.slice(0, 10)}:${list.length}  `);
  if (list.length) {
    console.log(`\n\n찾음 — ${from.slice(0, 10)} 창에 ${list.length}건`);
    console.log("요청량:", rateState(res));
    console.log("more:", JSON.stringify(json?.data?.more ?? null));
    console.log("\n한 건의 구조:");
    console.log(JSON.stringify(shape(list[0]), null, 2));
    console.log("\n나타난 상태값:");
    const vals = new Set<string>();
    for (const r of list) for (const [k, v] of Object.entries(r as object))
      if (typeof v === "string" && /^[A-Z][A-Z0-9_]{2,}$/.test(v)) vals.add(`${k}=${v}`);
    console.log([...vals].sort().join("\n"));
    process.exit(0);
  }
  await new Promise((r) => setTimeout(r, 600));   // 초당 2건 제한
}
console.log("\n\n30일 내 변경된 주문이 없습니다.");
