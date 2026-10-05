"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { AuthError, login, logout } from "@/lib/auth";
import { HOME_HREF } from "../(app)/nav-items";

/** 로그인 후 보낼 곳. `?next=` 를 그대로 믿으면 **열린 리다이렉트**가 된다 — 내부 경로만 허용. */
const safeNext = (v: FormDataEntryValue | null) => {
  const s = typeof v === "string" ? v : "";
  return /^\/(?!\/)/.test(s) && !s.startsWith("/login") ? s : HOME_HREF;
};

/**
 * 자바스크립트 없이도 동작하는 로그인. 실패는 `?e=1` 로 되돌린다 —
 * **사유를 구분해 알려주지 않는다**(어느 이메일이 가입돼 있는지 캐낼 수 있다).
 *
 * `redirect()` 는 던져서 동작하므로 `try` 바깥에서 부른다.
 */
export async function loginAction(form: FormData): Promise<void> {
  const email = String(form.get("email") ?? "");
  const password = String(form.get("password") ?? "");
  const next = safeNext(form.get("next"));

  if (!email.trim() || !password) redirect(`/login?e=1&next=${encodeURIComponent(next)}`);

  try {
    const ua = (await headers()).get("user-agent") ?? undefined;
    await login(email, password, ua);
  } catch (err) {
    if (err instanceof AuthError) redirect(`/login?e=1&next=${encodeURIComponent(next)}`);
    throw err;
  }
  redirect(next);
}

export async function logoutAction(): Promise<void> {
  await logout();
  redirect("/login");
}
