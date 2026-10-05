import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// 인증정보를 DB 에서 읽으므로 pool() 을 가로챈다. 실제 DB 에 붙지 않는다.
const queries: { sql: string; params: unknown[] }[] = [];
let credRow: { credential_enc: Buffer; channel: string } | undefined;
const accountRows: { id: string }[] = [];

vi.mock("../db", () => ({
  pool: () => ({
    query: async (sql: string, params: unknown[] = []) => {
      queries.push({ sql, params });
      if (sql.includes("credential_enc")) return { rows: credRow ? [credRow] : [] };
      return { rows: accountRows };
    },
  }),
}));

const { signature, getToken, clearTokenCache, clearCredCache, callApi, rateState, loadCreds } =
  await import("./auth");
const { sealCredential } = await import("../crypto");

// 공식 문서(docs/naver/pages, 인증)에 실린 검증 벡터.
// 이 값이 맞으면 전자서명 구현이 문서와 일치한다는 뜻이다.
const VECTOR = {
  clientId: "aaaabbbbcccc",
  clientSecret: "$2a$10$abcdefghijklmnopqrstuv",
  timestamp: 1643961623299,
  expected:
    "JDJhJDEwJGFiY2RlZmdoaWprbG1ub3BxcnN0dXVCVldZSk42T0VPdEx1OFY0cDQxa2IuTnpVaUEzbmsy",
};
const ACC = "11111111-1111-1111-1111-111111111111";

describe("전자서명", () => {
  it("공식 문서의 검증 벡터와 일치한다", () => {
    expect(signature(VECTOR.clientId, VECTOR.clientSecret, VECTOR.timestamp))
      .toBe(VECTOR.expected);
  });

  it("timestamp 가 바뀌면 서명도 바뀐다", () => {
    const a = signature(VECTOR.clientId, VECTOR.clientSecret, VECTOR.timestamp);
    const b = signature(VECTOR.clientId, VECTOR.clientSecret, VECTOR.timestamp + 1);
    expect(a).not.toBe(b);
  });
});

function seal(cred: Record<string, unknown>) {
  return { credential_enc: sealCredential(cred), channel: "NAVER" };
}

describe("인증정보 해석", () => {
  beforeEach(() => {
    process.env.CREDENTIAL_KEY = Buffer.alloc(32, 7).toString("base64");
    clearCredCache();
    clearTokenCache();
    queries.length = 0;
  });

  it("SELF 는 계정에 담긴 애플리케이션 ID/Secret 을 쓴다", async () => {
    credRow = seal({ authType: "SELF", appId: "app-1", appSecret: "sec-1" });
    const c = await loadCreds(ACC);
    expect(c).toMatchObject({ authType: "SELF", appId: "app-1", appSecret: "sec-1" });
  });

  it("SELLER 는 전역 애플리케이션 + 계정의 accountId 를 쓴다", async () => {
    process.env.NAVER_SOLUTION_APP_ID = "sol-app";
    process.env.NAVER_SOLUTION_APP_SECRET = "sol-sec";
    credRow = seal({ authType: "SELLER", accountId: "store-uid-9" });
    const c = await loadCreds(ACC);
    expect(c).toMatchObject({ authType: "SELLER", appId: "sol-app", accountId: "store-uid-9" });
    delete process.env.NAVER_SOLUTION_APP_ID;
    delete process.env.NAVER_SOLUTION_APP_SECRET;
  });

  it("SELLER 인데 accountId 가 없으면 거부한다", async () => {
    credRow = seal({ authType: "SELLER" });
    await expect(loadCreds(ACC)).rejects.toThrow(/accountId/);
  });

  it("없는 계정이면 거부한다", async () => {
    credRow = undefined;
    await expect(loadCreds(ACC)).rejects.toThrow(/없습니다/);
  });

  it("두 번째 호출은 캐시를 쓴다 — DB 를 다시 읽지 않는다", async () => {
    credRow = seal({ authType: "SELF", appId: "app-1", appSecret: "sec-1" });
    await loadCreds(ACC);
    const n = queries.length;
    await loadCreds(ACC);
    expect(queries.length).toBe(n);
  });
});

describe("토큰 발급", () => {
  let bodies: URLSearchParams[];

  beforeEach(() => {
    process.env.CREDENTIAL_KEY = Buffer.alloc(32, 7).toString("base64");
    credRow = seal({ authType: "SELF", appId: VECTOR.clientId, appSecret: VECTOR.clientSecret });
    clearCredCache();
    clearTokenCache();
    bodies = [];
    vi.stubGlobal("fetch", vi.fn(async (_u: string, init: RequestInit) => {
      bodies.push(new URLSearchParams(String(init.body)));
      return new Response(
        JSON.stringify({ access_token: `tok-${bodies.length}`, expires_in: 10800 }),
        { status: 200 });
    }));
  });
  afterEach(() => vi.unstubAllGlobals());

  it("SELF 요청에는 account_id 가 없다", async () => {
    await getToken(ACC);
    expect(bodies[0]!.get("type")).toBe("SELF");
    expect(bodies[0]!.get("account_id")).toBeNull();
    expect(bodies[0]!.get("grant_type")).toBe("client_credentials");
    expect(bodies[0]!.get("client_secret_sign")).toBeTruthy();
  });

  it("두 번째 호출은 캐시를 쓴다", async () => {
    expect(await getToken(ACC)).toBe("tok-1");
    expect(await getToken(ACC)).toBe("tok-1");
    expect(bodies).toHaveLength(1);
  });

  it("계정별로 따로 캐시한다 — 남의 토큰을 쓰면 안 된다", async () => {
    const OTHER = "22222222-2222-2222-2222-222222222222";
    const a = await getToken(ACC);
    const b = await getToken(OTHER);
    expect(a).not.toBe(b);
    expect(await getToken(ACC)).toBe(a);
    expect(bodies).toHaveLength(2);
  });

  it("만료가 30분 안쪽이면 매번 갱신을 시도한다", async () => {
    vi.stubGlobal("fetch", vi.fn(async () =>
      new Response(JSON.stringify({ access_token: "short", expires_in: 60 }), { status: 200 })));
    await getToken(ACC);
    await getToken(ACC);
    expect(vi.mocked(fetch).mock.calls).toHaveLength(2);
  });
});

describe("callApi", () => {
  beforeEach(() => {
    process.env.CREDENTIAL_KEY = Buffer.alloc(32, 7).toString("base64");
    credRow = seal({ authType: "SELF", appId: VECTOR.clientId, appSecret: VECTOR.clientSecret });
    clearCredCache();
    clearTokenCache();
  });
  afterEach(() => vi.unstubAllGlobals());

  it("401 GW.AUTHN 이면 토큰을 다시 받아 한 번 재시도한다", async () => {
    let n = 0;
    vi.stubGlobal("fetch", vi.fn(async (url: string) => {
      if (String(url).includes("oauth2/token")) {
        return new Response(JSON.stringify({ access_token: `t${++n}`, expires_in: 10800 }),
          { status: 200 });
      }
      return n === 1
        ? new Response(JSON.stringify({ code: "GW.AUTHN" }), { status: 401 })
        : new Response("{}", { status: 200 });
    }));
    const res = await callApi("/v1/pay-user/inquiries", {}, ACC);
    expect(res.status).toBe(200);
  });

  it("401 이지만 GW.AUTHN 이 아니면 재시도하지 않는다", async () => {
    let api = 0;
    vi.stubGlobal("fetch", vi.fn(async (url: string) => {
      if (String(url).includes("oauth2/token")) {
        return new Response(JSON.stringify({ access_token: "t", expires_in: 10800 }), { status: 200 });
      }
      api++;
      return new Response(JSON.stringify({ code: "OTHER" }), { status: 401 });
    }));
    const res = await callApi("/v1/test", {}, ACC);
    expect(res.status).toBe(401);
    expect(api).toBe(1);
  });

  it("계정을 넘기지 않고 기본 계정도 없으면 거부한다", async () => {
    await expect(callApi("/v1/test")).rejects.toThrow(/channelAccountId/);
  });
});

describe("요청량 제한 헤더", () => {
  it("헤더를 읽어낸다", () => {
    const res = new Response("{}", {
      headers: {
        "GNCP-GW-RateLimit-Remaining": "7",
        "GNCP-GW-RateLimit-Replenish-Rate": "10",
        "GNCP-GW-Quota-Remaining": "480",
        "GNCP-GW-Quota-Period": "SECONDS",
      },
    });
    expect(rateState(res)).toEqual({
      remaining: 7, replenish: 10, quotaRemaining: 480, quotaPeriod: "SECONDS",
    });
  });

  it("헤더가 없으면 null 이다 — 0 으로 착각하면 워커가 멈춘다", () => {
    expect(rateState(new Response("{}")).remaining).toBeNull();
  });
});
