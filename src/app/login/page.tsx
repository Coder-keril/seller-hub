import { redirect } from "next/navigation";
import { tenantOrNull } from "@/lib/session";
import { loginAction } from "./actions";
import { APP_NAME } from "@/lib/brand";
import { HOME_HREF } from "../(app)/nav-items";

export const metadata = { title: "로그인" };

/** DB 를 읽는다(이미 로그인했는지 확인). 빌드 시점에 굳히면 안 된다. */
export const dynamic = "force-dynamic";


/**
 * 로그인 화면. **자바스크립트 없이 동작한다** — 평범한 `<form action={서버액션}>` 이다.
 *
 * 외부 인증 서비스를 쓰지 않는다. 이 시스템의 `app_user` 와만 맞춰 본다.
 * 가입 화면은 **없다** — 계정은 운영자가 `npm run seed:user` 로 만든다.
 * 판매자가 스스로 가입하는 흐름이 필요해지면 그때 붙인다.
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const one = (k: string) => (Array.isArray(sp[k]) ? sp[k]![0] : sp[k]) as string | undefined;
  const failed = one("e") === "1";
  const next = one("next") ?? "";

  // 이미 로그인했으면 들어가 있을 자리로 보낸다.
  if (await tenantOrNull()) redirect(/^\/(?!\/)/.test(next) ? next : HOME_HREF);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-center text-xl font-semibold text-gray-900">{APP_NAME}</h1>

        <form
          action={loginAction}
          className="mt-6 space-y-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          {next && <input type="hidden" name="next" value={next} />}

          {failed && (
            <p
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              이메일 또는 비밀번호가 올바르지 않습니다.
            </p>
          )}

          <label className="block">
            <span className="text-sm font-medium text-gray-700">이메일</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="username"
              autoFocus
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">비밀번호</span>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            로그인
          </button>
        </form>

        <p className="mt-3 text-center text-xs text-gray-400">
          계정이 필요하면 운영자에게 요청하세요.
        </p>
      </div>
    </div>
  );
}
