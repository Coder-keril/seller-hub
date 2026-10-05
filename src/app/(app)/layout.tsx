import Link from "next/link";
import { NAV_ITEMS } from "./nav-items";
import { currentTenant, listTenants } from "@/lib/session";
import { logoutAction } from "@/app/login/actions";
import { APP_NAME } from "@/lib/brand";
import { switchTenant } from "./actions";


/**
 * 판매자 업무 화면의 껍데기.
 *
 * **여기서 로그인을 요구한다.** 레이아웃이 모든 `(app)` 화면을 감싸므로 화면을 더해도
 * 인증을 빼먹을 수 없다. 각 화면도 자기 데이터를 읽으려면 `currentTenant()` 를 다시 부르는데,
 * 그건 중복이 아니라 **서버액션·직접 접근에도 같은 검사가 걸리게** 하는 장치다.
 *
 * 테넌트 이름은 띄우지 않는다(의뢰인 요청). 누구로 로그인했는지만 보여준다 —
 * 여러 판매자가 쓰는 시스템에서 그게 안 보이면 남의 계정으로 작업하게 된다.
 */
export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const t = await currentTenant();
  // 전환 목록은 관리자일 때만 읽는다 — 일반 판매자에게는 다른 판매자 이름조차 가지 않는다.
  const tenants = t.isAdmin ? await listTenants() : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
          <span className="font-semibold text-gray-900">{APP_NAME}</span>
          <nav className="flex flex-wrap gap-1">
            {NAV_ITEMS.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                className="rounded px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
              >
                {it.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2 text-sm">
            {/* 시스템관리자만 보이는 판매자 전환. 자바스크립트 없이 동작하도록
                select + 버튼을 한 폼에 둔다(onChange 제출은 JS 가 필요하다). */}
            {t.isAdmin && (
              <form action={switchTenant} className="flex items-center gap-1">
                <select
                  name="tenant"
                  defaultValue={t.viewing ? t.id : ""}
                  aria-label="보고 있는 판매자"
                  className={`rounded border px-2 py-1 text-xs ${
                    t.viewing ? "border-amber-400 bg-amber-50 font-semibold" : "border-gray-300"
                  }`}
                >
                  <option value="">내 테넌트</option>
                  {tenants.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.name}{x.isPlatform ? " (플랫폼)" : ""}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
                >
                  전환
                </button>
              </form>
            )}
            <span className="truncate text-gray-500" title={t.userEmail}>
              {t.userName}
            </span>
            {/* 로그아웃은 조회가 아니라 상태 변경이다 — 링크가 아니라 POST 로 둔다.
                (링크로 두면 브라우저·메신저의 미리보기 요청이 세션을 지운다.) */}
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
              >
                로그아웃
              </button>
            </form>
          </div>
        </div>
      </header>
      {/* 남의 데이터를 보고 있다는 사실은 숨기면 안 된다 — 모르고 입력·환불처리하면 사고다. */}
      {t.viewing && (
        <div className="border-b border-amber-300 bg-amber-100 px-4 py-1.5 text-center text-xs text-amber-900">
          시스템관리자 권한으로 <b>{t.name}</b> 의 화면을 보고 있습니다. 입력·수정도 이 판매자에게 저장됩니다.
        </div>
      )}
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
