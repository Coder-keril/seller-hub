// 로그인 — 비밀번호 검증과 세션 발급·해제.
//
// 외부 인증 라이브러리를 쓰지 않는다. 다루는 것이 비밀번호와 세션 둘뿐이고, 남이 읽어서
// 무슨 일이 일어나는지 알 수 있어야 하기 때문이다.
//
// 지키는 것 네 가지:
//   ① 비밀번호는 **bcrypt 해시**로만 저장한다(원본을 어디에도 남기지 않는다).
//   ② 세션 토큰은 임의 32바이트이고, DB 에는 **그 해시만** 넣는다. DB 가 새어도 위조 불가.
//   ③ 쿠키는 `httpOnly`(스크립트가 못 읽음) · `sameSite=lax`(타 사이트 요청에 안 실림) ·
//      운영에서는 `secure`(HTTPS 전용).
//   ④ 로그인 실패 메시지는 **이메일 존재 여부를 알려주지 않는다**(계정 열거 방지).
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { pool } from "./db";

export const SESSION_COOKIE = "sid";

/** 세션 수명. 갱신하지 않는다 — 14일 뒤에는 다시 로그인한다. */
const SESSION_DAYS = 14;

/** bcrypt 비용. 10 은 웹 로그인에서 통용되는 값이다(한 번 검증에 수십 ms). */
const BCRYPT_COST = 10;

export class AuthError extends Error {}

/** 쿠키에 담을 토큰. 추측할 수 없어야 하므로 난수다. */
const newToken = () => randomBytes(32).toString("base64url");

/** DB 에 넣을 값. 토큰 원본은 저장하지 않는다. */
const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export const hashPassword = (plain: string) => bcrypt.hash(plain, BCRYPT_COST);

export interface SessionUser {
  userId: string;
  tenantId: string;
  email: string;
  name: string;
  role: string;
  tenantName: string;
  isPlatform: boolean;
}

/**
 * 이메일·비밀번호 확인 후 세션을 만들고 쿠키를 심는다.
 *
 * 실패 사유를 구분해 주지 않는다 — "없는 이메일"과 "틀린 비밀번호"를 나눠 알려주면
 * 어느 이메일이 가입돼 있는지 캐낼 수 있다.
 *
 * 이메일이 없을 때도 **더미 해시로 bcrypt 를 한 번 돌린다.** 안 돌리면 응답이 빨라서
 * 그 차이만으로 계정 존재를 알 수 있다(타이밍).
 */
// 직접 적어 넣지 않고 만든다 — 손으로 쓴 해시는 형식이 조금만 어긋나도 bcrypt 가
// 즉시 false 를 돌려주고, 그러면 타이밍을 맞추려던 목적이 사라진다. 프로세스당 한 번, 수십 ms.
const DUMMY_HASH = bcrypt.hashSync(randomBytes(16).toString("hex"), BCRYPT_COST);

export async function login(email: string, password: string, userAgent?: string): Promise<void> {
  const { rows } = await pool().query<{ id: string; password_hash: string }>(
    `select id, password_hash from app_user where lower(email) = lower($1)`,
    [email.trim()],
  );
  const user = rows[0];
  const ok = await bcrypt.compare(password, user?.password_hash ?? DUMMY_HASH);
  if (!user || !ok) throw new AuthError("이메일 또는 비밀번호가 올바르지 않습니다.");

  const token = newToken();
  await pool().query(
    `insert into app_session (token_hash, user_id, expires_at, user_agent)
     values ($1, $2, now() + make_interval(days => $3), $4)`,
    [hashToken(token), user.id, SESSION_DAYS, userAgent?.slice(0, 300) ?? null],
  );

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

/** 쿠키의 세션을 지우고 DB 행도 없앤다. 로그아웃은 서버에서 무효화돼야 한다. */
export async function logout(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    await pool().query(`delete from app_session where token_hash = $1`, [hashToken(token)]);
  }
  jar.delete(SESSION_COOKIE);
}

/** 현재 쿠키의 세션. 없거나 만료면 null. 만료된 행은 지나가며 치운다. */
export async function sessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const { rows } = await pool().query<{
    user_id: string; tenant_id: string; email: string; name: string;
    role: string; tenant_name: string; is_platform: boolean; expired: boolean;
  }>(
    `select u.id as user_id, u.tenant_id, u.email, u.name, u.role,
            t.name as tenant_name, t.is_platform,
            (s.expires_at <= now()) as expired
       from app_session s
       join app_user u on u.id = s.user_id
       join tenant t on t.id = u.tenant_id
      where s.token_hash = $1`,
    [hashToken(token)],
  );
  const r = rows[0];
  if (!r) return null;
  if (r.expired) {
    await pool().query(`delete from app_session where token_hash = $1`, [hashToken(token)]);
    return null;
  }
  return {
    userId: r.user_id,
    tenantId: r.tenant_id,
    email: r.email,
    name: r.name,
    role: r.role,
    tenantName: r.tenant_name,
    isPlatform: r.is_platform,
  };
}

/**
 * 만료된 세션 일괄 정리. 지금은 부르는 곳이 없다 — 로그인·조회 때 지나가며 치우므로
 * 쌓여도 해가 없다. 정기 작업이 생기면 그때 붙인다.
 */
export async function purgeExpiredSessions(): Promise<number> {
  const r = await pool().query(`delete from app_session where expires_at <= now()`);
  return r.rowCount ?? 0;
}

/** 길이가 달라도 시간이 새지 않게 비교한다. 토큰을 직접 견줄 일이 생길 때 쓴다. */
export function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  if (x.length !== y.length) return false;
  return timingSafeEqual(x, y);
}
