// 네이버 커머스API 인증.
//
// OAuth2 Client Credentials Grant. 클라이언트 시크릿을 직접 보내지 않고 bcrypt 전자서명을 만들어
// 보낸다. 시크릿이 bcrypt 의 salt 로 쓰이는 점이 특이하다.
//
//   signature = base64( bcrypt.hashSync(`${clientId}_${timestamp}`, clientSecret) )
//
// 토큰 유형은 둘이고 코드는 같다 — account_id 가 붙는지만 다르다.
//
//   SELF    솔루션사/판매자 본인 시스템. 내스토어 애플리케이션은 이것만 가능
//   SELLER  솔루션을 구독중인 판매자의 스마트스토어. account_id 필수
//
// **인증정보는 판매자마다 다르므로 DB(channel_account.credential_enc)에서 읽는다.**
// 환경변수에 두면 판매자가 여러 명일 때 관리가 안 된다. .env 에는 플랫폼 전역 비밀만 남긴다
// (CREDENTIAL_KEY · DATABASE_URL · MSSQL_* · R2_*).
//
// credential_enc 에 담기는 형태는 경로에 따라 둘이다.
//   { authType: "SELF",   appId, appSecret }   내스토어 애플리케이션 — 판매자별
//   { authType: "SELLER", accountId }          솔루션·대행사 — 애플리케이션은 전역 1개이고
//                                              .env 의 NAVER_SOLUTION_APP_ID/SECRET 를 쓴다
//
// 토큰 수명 규칙이 캐시 전략을 정한다 (문서 기준):
//   - 기본 유효 180분
//   - 남은 유효 시간이 30분 미만일 때만 새 토큰을 발급해준다
//   - 기존 토큰은 만료 전까지 계속 유효
//   - SELLER 토큰은 account_id 별로 유효 시간이 따로 산정된다
// → (type, accountId) 를 키로 캐시하고, 만료 30분 전부터 갱신한다.
import bcrypt from "bcryptjs";
import { pool } from "../db";
import { openCredential } from "../crypto";

const TOKEN_URL = "https://api.commerce.naver.com/external/v1/oauth2/token";
const DEFAULT_TTL_MS = 180 * 60 * 1000;   // 문서 기준 기본 유효 시간
const RENEW_BEFORE_MS = 30 * 60 * 1000;   // 이 시점부터 재발급이 허용된다

export type TokenType = "SELF" | "SELLER";

/** channel_account 에 담긴 네이버 인증정보. */
export interface NaverCreds {
  authType: TokenType;
  appId: string;
  appSecret: string;
  accountId?: string;   // SELLER 일 때 판매자 UID
}

/** 전자서명. 공식 문서의 검증 벡터로 테스트한다. */
export function signature(clientId: string, clientSecret: string, timestamp: number): string {
  const hashed = bcrypt.hashSync(`${clientId}_${timestamp}`, clientSecret);
  return Buffer.from(hashed, "utf-8").toString("base64");
}

interface Cached {
  token: string;
  expiresAt: number;
}
const cache = new Map<string, Cached>();

const credCache = new Map<string, NaverCreds>();

/**
 * channel_account 에서 인증정보를 읽어 복호화한다.
 *
 * SELF 는 판매자별 애플리케이션 ID/Secret 이 그대로 담겨 있다.
 * SELLER 는 accountId 만 담고 애플리케이션은 전역(.env) 을 쓴다 — 솔루션·대행사 경로에서는
 * 애플리케이션이 사업자당 1개이기 때문이다.
 */
/**
 * ⚠️ **테넌트를 보지 않는다.** `channel_account` 를 id 로만 찾으므로, 웹 요청에서 온
 *    `channelAccountId` 를 그대로 넘기면 **남의 판매자 API 키를 열 수 있다.**
 *
 *    그래서 규칙은 하나다 — **id 는 반드시 테넌트 범위에서 얻은 것이어야 한다.**
 *    화면·서버액션은 `channel-account.ts` 의 `listAccounts()`(= `tquery`) 로 얻은 id 만 쓴다.
 *    여기서 다시 거르지 않는 이유는 이 함수가 스크립트(쿠키 없음)에서도 쓰이기 때문이다.
 *    2026-10-06 검토 시점에 `src/app/` 에서 호출하는 곳은 없다.
 */
export async function loadCreds(channelAccountId: string): Promise<NaverCreds> {
  const hit = credCache.get(channelAccountId);
  if (hit) return hit;

  const r = await pool().query<{ credential_enc: Buffer; channel: string }>(
    `select credential_enc, channel from channel_account where id = $1`, [channelAccountId]);
  const row = r.rows[0];
  if (!row) throw new Error(`channel_account ${channelAccountId} 가 없습니다.`);
  if (row.channel !== "NAVER") throw new Error(`네이버 계정이 아닙니다: ${row.channel}`);

  const c = openCredential(row.credential_enc) as Partial<NaverCreds>;
  const authType: TokenType = c.authType === "SELLER" ? "SELLER" : "SELF";

  let appId = c.appId;
  let appSecret = c.appSecret;
  if (authType === "SELLER") {
    // 솔루션·대행사 애플리케이션은 전역 1개다
    appId = process.env.NAVER_SOLUTION_APP_ID ?? appId;
    appSecret = process.env.NAVER_SOLUTION_APP_SECRET ?? appSecret;
    if (!c.accountId) throw new Error("SELLER 인증정보에 accountId 가 없습니다.");
  }
  if (!appId || !appSecret) {
    throw new Error(`channel_account ${channelAccountId} 에 애플리케이션 ID/Secret 이 없습니다.`);
  }

  const creds: NaverCreds = { authType, appId, appSecret, accountId: c.accountId };
  credCache.set(channelAccountId, creds);
  return creds;
}

/** 인증정보를 바꿨을 때 캐시를 비운다. */
export function clearCredCache(): void {
  credCache.clear();
}

async function issue(c: NaverCreds): Promise<Cached> {
  const timestamp = Date.now();
  const body = new URLSearchParams({
    client_id: c.appId,
    timestamp: String(timestamp),
    client_secret_sign: signature(c.appId, c.appSecret, timestamp),
    grant_type: "client_credentials",
    type: c.authType,
  });
  if (c.authType === "SELLER") body.set("account_id", c.accountId!);

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const text = await res.text();
  if (!res.ok) {
    // 'IP 가 허용되지 않음' 도 여기서 걸린다. 애플리케이션에 공인 IP 를 등록했는지 확인할 것.
    throw new Error(`인증 토큰 발급 실패 ${res.status}: ${text.slice(0, 300)}`);
  }
  const json = JSON.parse(text) as { access_token?: string; expires_in?: number };
  if (!json.access_token) throw new Error(`응답에 access_token 이 없습니다: ${text.slice(0, 300)}`);

  const ttl = json.expires_in ? json.expires_in * 1000 : DEFAULT_TTL_MS;
  return { token: json.access_token, expiresAt: Date.now() + ttl };
}

/**
 * 채널 계정의 인증 토큰. 만료 30분 전부터 갱신한다.
 * 캐시 키가 channelAccountId 라 판매자별로 따로 관리된다.
 */
export async function getToken(channelAccountId: string): Promise<string> {
  const hit = cache.get(channelAccountId);
  if (hit && hit.expiresAt - Date.now() > RENEW_BEFORE_MS) return hit.token;

  try {
    const fresh = await issue(await loadCreds(channelAccountId));
    cache.set(channelAccountId, fresh);
    return fresh.token;
  } catch (e) {
    // 아직 만료되지 않은 토큰이 있으면 그걸로 버틴다. 재발급은 다음 호출에서 다시 시도한다.
    if (hit && hit.expiresAt > Date.now()) return hit.token;
    throw e;
  }
}

/** 테스트·토큰 폐기용. */
export function clearTokenCache(): void {
  cache.clear();
}

/**
 * 커머스API 호출. 401 + GW.AUTHN 이면 토큰을 재발급해 한 번 재시도한다 (공식 권고).
 *
 * 429 는 여기서 재시도하지 않는다 — 요청량 제한은 워커가 응답 헤더를 보고 전체 속도를
 * 조절해야 하는 문제이고, 여기서 즉시 재시도하면 상황을 악화시킨다.
 */
export async function callApi(
  path: string,
  init: RequestInit = {},
  channelAccountId: string = requireDefaultAccount(),
): Promise<Response> {
  const url = path.startsWith("http") ? path : `https://api.commerce.naver.com/external${path}`;

  // FormData 일 때는 Content-Type 을 건드리지 않는다 — fetch 가 boundary 를 붙여야 한다.
  const isForm = typeof FormData !== "undefined" && init.body instanceof FormData;
  const send = async (token: string) =>
    fetch(url, {
      ...init,
      headers: {
        ...(isForm ? {} : { "Content-Type": "application/json" }),
        ...(init.headers ?? {}),
        Authorization: `Bearer ${token}`,
      },
    });

  let res = await send(await getToken(channelAccountId));
  if (res.status === 401) {
    const body = await res.clone().text();
    if (body.includes("GW.AUTHN")) {
      cache.delete(channelAccountId);
      res = await send(await getToken(channelAccountId));
    }
  }
  return res;
}

// 스크립트 편의용. 네이버 계정이 하나뿐인 동안만 유효하고, 판매자가 늘면 호출부가 계정을
// 명시해야 한다. 그래서 둘 이상이면 일부러 실패시킨다.
let defaultAccountId: string | null = null;
export async function resolveDefaultAccount(): Promise<string> {
  if (defaultAccountId) return defaultAccountId;
  const r = await pool().query<{ id: string }>(
    `select id from channel_account where channel = 'NAVER' and status = 'ACTIVE'`);
  if (r.rows.length === 0) throw new Error("활성 네이버 채널 계정이 없습니다.");
  if (r.rows.length > 1) {
    throw new Error(`네이버 계정이 ${r.rows.length}개입니다. 호출 시 channelAccountId 를 넘기세요.`);
  }
  defaultAccountId = r.rows[0]!.id;
  return defaultAccountId;
}
function requireDefaultAccount(): string {
  if (!defaultAccountId) {
    throw new Error("channelAccountId 를 넘기거나 resolveDefaultAccount() 를 먼저 부르세요.");
  }
  return defaultAccountId;
}

/** 응답 헤더의 요청량 제한 상태. 워커가 이 값을 보고 속도를 조절한다. */
export interface RateState {
  remaining: number | null;   // 남은 동시 요청 수
  replenish: number | null;   // 초당 최대 동시 요청 수
  quotaRemaining: number | null;
  quotaPeriod: string | null; // SECONDS | ROUND
}

export function rateState(res: Response): RateState {
  const num = (h: string) => {
    const v = res.headers.get(h);
    return v === null ? null : Number(v);
  };
  return {
    remaining: num("GNCP-GW-RateLimit-Remaining"),
    replenish: num("GNCP-GW-RateLimit-Replenish-Rate"),
    quotaRemaining: num("GNCP-GW-Quota-Remaining"),
    quotaPeriod: res.headers.get("GNCP-GW-Quota-Period"),
  };
}
