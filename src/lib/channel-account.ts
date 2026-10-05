// 오픈마켓 API 인증정보 — 조회·저장·삭제.
//
// **비밀값은 DB 에만 있고, 화면으로 돌려주지 않는다.** `channel_account.credential_enc` 는
// AES-256-GCM 으로 봉인돼 있고(`crypto.ts`), 이 모듈은 **어떤 항목이 채워졌는지**만 알려준다.
// 환경파일로 관리할 수 없는 이유는 판매자마다 키가 다르기 때문이다(`CLAUDE.md` 참고).
//
// ⚠️ **모든 조회·저장이 `tquery` 를 지난다.** `channel_account` 를 id 로만 찾으면 남의
//    판매자 API 키를 열 수 있다 — 이 모듈이 그 경로를 하나로 묶어 두는 이유다.
import { isUuid, tquery } from "./db";
import { openCredential, sealCredential } from "./crypto";

export const CHANNELS = ["NAVER", "COUPANG", "ELEVENST", "GMARKET", "AUCTION", "LOTTEON"] as const;
export type Channel = (typeof CHANNELS)[number];

export const CHANNEL_LABEL: Record<Channel, string> = {
  NAVER: "네이버 스마트스토어",
  COUPANG: "쿠팡",
  ELEVENST: "11번가",
  GMARKET: "G마켓",
  AUCTION: "옥션",
  LOTTEON: "롯데ON",
};

export interface CredField {
  name: string;
  label: string;
  /** 비밀값인가. 참이면 화면에 값을 다시 내려보내지 않고 `<input type="password">` 로 받는다. */
  secret: boolean;
  hint?: string;
}

/**
 * 마켓별 입력 항목.
 *
 * ⚠️ **네이버만 확정이다** — `naver/auth.ts` 가 실제로 쓰는 항목이기 때문이다. 나머지는
 *    연동을 붙일 때 그 마켓 문서로 확정한다. 지금 모르는 항목명을 지어 넣으면, 나중에
 *    실제 이름과 어긋난 값이 DB 에 쌓여 있는 쪽이 더 나쁘다. 그래서 **범용 3칸**으로 받고
 *    화면에 "연동 시 확정" 이라고 적어 둔다.
 */
export const CRED_FIELDS: Record<Channel, CredField[]> = {
  NAVER: [
    { name: "appId", label: "애플리케이션 ID", secret: false, hint: "커머스API센터의 클라이언트 ID" },
    { name: "appSecret", label: "애플리케이션 Secret", secret: true },
  ],
  COUPANG: [
    { name: "accessKey", label: "Access Key", secret: false },
    { name: "secretKey", label: "Secret Key", secret: true },
    { name: "vendorId", label: "Vendor ID", secret: false },
  ],
  ELEVENST: [{ name: "apiKey", label: "오픈API 키", secret: true }],
  GMARKET: [
    { name: "sellerId", label: "판매자 ID", secret: false },
    { name: "apiKey", label: "API 키", secret: true },
  ],
  AUCTION: [
    { name: "sellerId", label: "판매자 ID", secret: false },
    { name: "apiKey", label: "API 키", secret: true },
  ],
  LOTTEON: [
    { name: "sellerId", label: "판매자 ID", secret: false },
    { name: "apiKey", label: "API 키", secret: true },
  ],
};

/** 항목명이 확정된 마켓. 화면이 "연동 시 확정" 안내를 띄울지 가른다. */
export const CONFIRMED_FIELDS: ReadonlySet<Channel> = new Set<Channel>(["NAVER"]);

export interface AccountRow {
  id: string;
  channel: Channel;
  alias: string;
  status: "ACTIVE" | "ERROR" | "DISABLED";
  lastError: string | null;
  createdAt: string;
  /** 채워진 항목 이름들. **값은 담지 않는다.** */
  filled: string[];
}

export const parseChannel = (v: unknown): Channel => {
  if (typeof v === "string" && (CHANNELS as readonly string[]).includes(v)) return v as Channel;
  throw new Error("마켓이 올바르지 않습니다.");
};

/** 목록. 비밀값은 복호화해 **키 이름만** 뽑고 값은 버린다. */
export async function listAccounts(tenantId: string): Promise<AccountRow[]> {
  const rows = await tquery<{
    id: string; channel: Channel; alias: string;
    status: AccountRow["status"]; last_error: string | null;
    created_at: string; credential_enc: Buffer;
  }>(
    tenantId,
    `select id, channel::text as channel, alias, status, last_error,
            to_char(created_at, 'YYYY-MM-DD') as created_at, credential_enc
       from channel_account
      where tenant_id = $1
      order by channel, alias`,
  );
  return rows.map((r) => {
    let filled: string[] = [];
    try {
      const c = openCredential(r.credential_enc);
      filled = Object.entries(c)
        .filter(([, v]) => v !== null && v !== undefined && String(v).trim() !== "")
        .map(([k]) => k);
    } catch {
      // 복호화 실패 = CREDENTIAL_KEY 가 바뀌었다. 목록이 깨지는 것보다 그 사실을 보이는 게 낫다.
      filled = ["(복호화 실패)"];
    }
    return {
      id: r.id, channel: r.channel, alias: r.alias, status: r.status,
      lastError: r.last_error, createdAt: r.created_at, filled,
    };
  });
}

/**
 * 저장. `id` 가 있으면 수정, 없으면 추가.
 *
 * **빈 칸은 기존 값을 지우지 않는다.** 수정 화면은 비밀값을 보여줄 수 없으므로(보여주면
 * 화면에 비밀이 실린다) 비워 둔 칸은 "안 바꿈"으로 다룬다. 지우려면 별명·마켓째로 삭제한다.
 */
export async function saveAccount(
  tenantId: string,
  v: { id?: string; channel: Channel; alias: string; creds: Record<string, string> },
): Promise<void> {
  const alias = v.alias.trim().slice(0, 60);
  if (!alias) throw new Error("계정 별칭을 입력하세요.");

  const incoming = Object.fromEntries(
    Object.entries(v.creds).map(([k, s]) => [k, s.trim()]).filter(([, s]) => s !== ""),
  );

  if (v.id) {
    if (!isUuid(v.id)) throw new Error("계정 id 가 올바르지 않습니다.");
    // 기존 값을 읽어 **덮어쓸 항목만** 교체한다. tquery 라서 남의 계정은 애초에 안 잡힌다.
    const [cur] = await tquery<{ credential_enc: Buffer }>(
      tenantId,
      `select credential_enc from channel_account where tenant_id = $1 and id = $2`,
      [v.id],
    );
    if (!cur) throw new Error("계정을 찾을 수 없습니다.");
    let base: Record<string, unknown> = {};
    try {
      base = openCredential(cur.credential_enc);
    } catch {
      base = {};   // 복호화 안 되는 옛 값은 버리고 새로 받은 것만 남긴다
    }
    await tquery(
      tenantId,
      `update channel_account set alias = $3, credential_enc = $4
        where tenant_id = $1 and id = $2`,
      [v.id, alias, sealCredential({ ...base, ...incoming })],
    );
    return;
  }

  await tquery(
    tenantId,
    `insert into channel_account (tenant_id, channel, alias, credential_enc)
     values ($1, $2, $3, $4)
     on conflict (tenant_id, channel, alias) do update
       set credential_enc = excluded.credential_enc`,
    [v.channel, alias, sealCredential(incoming)],
  );
}

export async function setAccountStatus(
  tenantId: string,
  id: string,
  status: AccountRow["status"],
): Promise<void> {
  if (!isUuid(id)) return;
  await tquery(
    tenantId,
    `update channel_account set status = $3, last_error = null where tenant_id = $1 and id = $2`,
    [id, status],
  );
}

/** 삭제. 봉인된 비밀값도 같이 사라진다. */
export async function deleteAccount(tenantId: string, id: string): Promise<void> {
  if (!isUuid(id)) return;
  await tquery(tenantId, `delete from channel_account where tenant_id = $1 and id = $2`, [id]);
}
