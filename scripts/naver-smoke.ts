// 네이버 커머스API 인증 실호출 확인. 토큰 발급만 하는 읽기 동작이다.
// 토큰 값은 출력하지 않는다.
import { loadEnv } from "./pgx.mjs";
loadEnv();

const { getToken, callApi, rateState, resolveDefaultAccount } = await import("../src/lib/naver/auth.ts");
await resolveDefaultAccount();

try {
  const t = await getToken(await resolveDefaultAccount());
  console.log(`토큰 발급 OK — 길이 ${t.length}, 앞 6자 ${t.slice(0, 6)}…`);
} catch (e) {
  console.error("토큰 발급 실패:", (e as Error).message);
  process.exit(1);
}

// 가장 가벼운 조회로 권한과 응답 헤더를 본다 (판매자 주소록 목록)
const res = await callApi("/v1/seller/addressbooks-for-page?page=1&size=1");
console.log(`샘플 호출 ${res.status} ${res.statusText}`);
console.log("요청량 제한:", rateState(res));
const body = await res.text();
console.log("응답 앞부분:", body.slice(0, 400));
