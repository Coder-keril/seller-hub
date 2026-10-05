"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { VIEW_COOKIE, currentTenant, listTenants } from "@/lib/session";

/**
 * 시스템관리자가 보는 판매자를 바꾼다.
 *
 * ⚠️ **권한을 여기서 다시 확인한다.** 서버 액션은 주소를 아는 사람이 직접 호출할 수 있어서
 *    화면에 버튼을 안 띄우는 것은 방어가 아니다. `isAdmin` 이 아니면 아무것도 하지 않는다.
 *
 * 보낸 id 가 실제 테넌트인지도 확인한다 — 그냥 쿠키에 넣으면 `currentTenant()` 가 조회에
 * 실패해 자기 테넌트로 되돌아가므로 사용자는 "전환이 안 된다"만 보게 된다.
 */
export async function switchTenant(form: FormData): Promise<void> {
  const me = await currentTenant();
  if (!me.isAdmin) return;

  const want = String(form.get("tenant") ?? "");
  const jar = await cookies();

  if (want === "") {
    // 빈 값 = 내 테넌트로 돌아간다. (내 테넌트 id 를 그대로 넣어도 같은 결과다 —
    //  `tenantOrNull()` 이 `sel !== u.tenantId` 일 때만 쿠키를 쓴다.)
    jar.delete(VIEW_COOKIE);
  } else {
    const ok = (await listTenants()).some((t) => t.id === want);
    if (!ok) return;
    jar.set(VIEW_COOKIE, want, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  }
  // 모든 화면이 이 테넌트로 바뀌므로 전체를 다시 그린다.
  revalidatePath("/", "layout");
}
