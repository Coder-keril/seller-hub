// 현재 요청의 판매자(테넌트)를 정하는 **단 하나의 지점**.
//
// 화면·서버액션·API 는 전부 이 파일만 부른다. 그래서 로그인 검사도 여기 한 곳에만 있다 —
// 새 화면을 만들며 인증을 빼먹을 수가 없다. 그게 이 파일이 따로 있는 이유다.
//
// **외부 인증 서비스를 쓰지 않는다.** 이메일·비밀번호·세션 모두 이 시스템의 테이블
// (`app_user` · `app_session`)에만 있다. 어떤 회사의 계정 체계에도 묶여 있지 않다.
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { isUuid, pool } from "./db";
import { sessionUser } from "./auth";

/**
 * 시스템관리자가 **지금 보고 있는 판매자**. 평상시엔 자기 테넌트를 보므로 쿠키가 없다.
 *
 * 쿠키 하나로 되는 이유: 화면·서버액션이 전부 `currentTenant()` 를 지나므로 여기서
 * 돌려주는 값만 바꾸면 모든 화면이 그 판매자의 것으로 바뀐다. 화면은 하나도 안 고친다.
 */
export const VIEW_COOKIE = "view";

/**
 * **권한 판단 그 자체.** 쿠키의 테넌트를 받아들일지 말지를 여기서만 정한다.
 *
 * 순수 함수로 떼어낸 이유: 이것이 격리의 경계라서 DB·쿠키 없이 테스트할 수 있어야 한다
 * (`session.test.ts`). 조건을 하나라도 느슨하게 고치면 그 테스트가 깨진다.
 *
 * @returns 조회할 테넌트 id, 또는 `null`(= 자기 테넌트를 본다)
 */
export function viewTenantId(
  role: string,
  ownTenantId: string,
  cookie: string | undefined,
): string | null {
  if (role !== "PLATFORM") return null;        // 관리자가 아니면 쿠키를 아예 보지 않는다
  if (!isUuid(cookie)) return null;            // 모양이 안 맞으면 버린다 (SQL 캐스트 500 방지)
  if (cookie === ownTenantId) return null;      // 내 테넌트면 전환이 아니다
  return cookie;
}

export class SessionError extends Error {}

export interface CurrentTenant {
  id: string;
  name: string;
  isPlatform: boolean;
  userId: string;
  userName: string;
  userEmail: string;
  role: string;
  /** 시스템관리자인가. 판매자 전환 UI 를 띄울지 여부가 이 값으로 갈린다. */
  isAdmin: boolean;
  /** 자기 테넌트가 아닌 남의 테넌트를 보고 있는가. */
  viewing: boolean;
}

/**
 * 로그인한 사용자의 테넌트. **로그인하지 않았으면 `/login` 으로 보낸다.**
 *
 * 던지지 않고 리다이렉트하는 이유: 화면에서 던지면 500 이 뜨고 사용자는 할 일을 알 수 없다.
 * (`redirect()` 는 내부적으로 던지므로 `try/catch` 로 감싸면 안 된다 — 아래 `tenantOrNull()` 를 쓸 것.)
 *
 * API 라우트에서는 리다이렉트가 쓸모없다(fetch 가 307 을 따라가 로그인 HTML 을 받는다).
 * 그래서 라우트는 `tenantOrNull()` 로 직접 401 을 돌려준다.
 */
export async function currentTenant(): Promise<CurrentTenant> {
  const t = await tenantOrNull();
  if (!t) redirect("/login");
  return t;
}

/** 로그인 상태만 알고 싶을 때. 리다이렉트하지 않는다. */
export async function tenantOrNull(): Promise<CurrentTenant | null> {
  const u = await sessionUser();
  if (!u) return null;

  const isAdmin = u.role === "PLATFORM";
  const base = {
    userId: u.userId,
    userName: u.name,
    userEmail: u.email,
    role: u.role,
    isAdmin,
  };

  // 시스템관리자는 다른 판매자 화면을 볼 수 있다.
  //
  // ⚠️ **쿠키만 믿으면 누구나 테넌트를 바꿔 끼울 수 있다.** 그래서 권한은 DB 의
  //    `app_user.role` 로 매 요청 확인하고(위 `sessionUser()`), 쿠키는 **관리자일 때만** 본다.
  //    존재하지 않는 id 면 조용히 자기 테넌트로 되돌린다 — 지워진 판매자를 가리키는
  //    오래된 쿠키로 화면이 죽을 이유가 없다.
  const sel = viewTenantId(u.role, u.tenantId, (await cookies()).get(VIEW_COOKIE)?.value);
  if (sel) {
    const { rows } = await pool().query<{ id: string; name: string; is_platform: boolean }>(
      `select id, name, is_platform from tenant where id = $1`, [sel]);
    const t = rows[0];
    if (t) return { ...base, id: t.id, name: t.name, isPlatform: t.is_platform, viewing: true };
  }

  return { ...base, id: u.tenantId, name: u.tenantName, isPlatform: u.isPlatform, viewing: false };
}

/** 전환 목록. **시스템관리자 전용** — 부르는 쪽에서 `isAdmin` 을 확인한다. */
export async function listTenants(): Promise<{ id: string; name: string; isPlatform: boolean }[]> {
  const { rows } = await pool().query<{ id: string; name: string; is_platform: boolean }>(
    `select id, name, is_platform from tenant order by is_platform desc, name`);
  return rows.map((r) => ({ id: r.id, name: r.name, isPlatform: r.is_platform }));
}

/**
 * **CLI 스크립트 전용.** 쿠키가 없으므로 세션을 읽을 수 없다.
 *
 * 판매자 테넌트가 하나뿐인 것을 전제로 그것을 돌려주고, **둘 이상이면 거부한다** —
 * 조용히 아무거나 고르면 남의 데이터에 쓴다. 대상을 고를 필요가 생기면 스크립트에
 * `--tenant` 를 받게 하고 이 함수는 그대로 둔다.
 */
export async function soleTenant(): Promise<{ id: string; name: string; isPlatform: boolean }> {
  const { rows } = await pool().query<{ id: string; name: string; is_platform: boolean }>(
    `select id, name, is_platform from tenant where not is_platform order by name`,
  );
  if (rows.length === 0) {
    throw new SessionError(
      "판매자 테넌트가 없습니다. `npx tsx scripts/seed-tenant.ts` 를 먼저 실행하세요.",
    );
  }
  if (rows.length > 1) {
    throw new SessionError(
      `판매자 테넌트가 ${rows.length}개입니다. 스크립트는 대상을 고를 수 없습니다: `
      + rows.map((r) => r.name).join(", "),
    );
  }
  const t = rows[0]!;
  return { id: t.id, name: t.name, isPlatform: t.is_platform };
}

/** 발송 방식 — 택배비 단가가 위임/직접에 따라 다르므로 가격 계산에 필요하다. */
export async function currentMode(tenantId: string): Promise<"SELF" | "MERRYCOCO"> {
  const { rows } = await pool().query<{ mode: "SELF" | "MERRYCOCO" }>(
    `select mode from fulfillment_delegation where tenant_id = $1`,
    [tenantId],
  );
  return rows[0]?.mode ?? "SELF";
}
