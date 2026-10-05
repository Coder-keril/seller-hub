// API 그룹 권한과 스토어 상태 확인. 전부 읽기 전용, 건수만 출력한다.
import { loadEnv } from "./pgx.mjs";
loadEnv();
const { callApi, resolveDefaultAccount } = await import("../src/lib/naver/auth.ts");
await resolveDefaultAccount();

const probes: [string, string, RequestInit?][] = [
  ["상품 목록 조회",   "/v1/products/search", { method: "POST", body: JSON.stringify({ page: 1, size: 1 }) }],
  ["전체 카테고리",    "/v1/categories"],
  ["상품 문의 목록",   "/v1/contents/qnas?page=1&size=1"],
  ["고객 문의 조회",   "/v1/pay-user/inquiries?page=1&size=1"],
  ["주소록 목록",      "/v1/seller/addressbooks-for-page?page=1&size=1"],
  ["오늘출발 설정",    "/v1/seller/today-dispatch"],
];

for (const [name, path, init] of probes) {
  const res = await callApi(path, init);
  const text = await res.text();
  let note = "";
  try {
    const j = JSON.parse(text);
    const arr = Array.isArray(j) ? j : (j.contents ?? j.data ?? j.addressBooks ?? j.qnas ?? null);
    note = Array.isArray(arr) ? `배열 ${arr.length}건` :
           typeof j.totalElements === "number" ? `총 ${j.totalElements}건` :
           `키: ${Object.keys(j).slice(0, 5).join(",")}`;
  } catch { note = text.slice(0, 90); }
  const mark = res.ok ? "OK  " : "실패";
  printf(`${mark} ${String(res.status).padEnd(4)} ${name.padEnd(16)} ${note.slice(0, 110)}`);
  if (!res.ok) printf(`          ${text.slice(0, 160)}`);
  await new Promise((r) => setTimeout(r, 600));
}
function printf(s: string) { console.log(s); }
