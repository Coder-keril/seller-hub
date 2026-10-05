"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Esc 로 모달을 닫는다. **이것만을 위한 최소 클라이언트 조각이다.**
 *
 * 모달 자체는 서버에서 렌더한 CSS 오버레이다 — 열림 여부가 URL 에 있어서 자바스크립트가
 * 없어도 내용이 보이고 배경·닫기 링크로 닫힌다. 여기서 더하는 것은 Esc 뿐이다.
 *
 * `<dialog>` + `showModal()` 로 바꾸면 Esc 와 포커스 트랩을 공짜로 얻지만, 스크립트가 실패하면
 * `<dialog>` 가 `display:none` 이라 **내용이 아예 보이지 않는다.** 그 퇴보를 피하려고
 * 오버레이는 서버 렌더로 남기고 키 처리만 올린다.
 *
 * ⚠️ `e.defaultPrevented` 로 걸러서는 안 된다. Next 개발 오버레이가 Escape 를 먼저 소비하며
 *    preventDefault 를 걸 수 있어서, 그 검사를 두면 Esc 가 아무것도 하지 않는다.
 *
 * `push` 를 쓰는 이유: 닫기 링크(`<Link>`)와 같은 동작이라야 Esc 와 클릭이 어긋나지 않는다.
 */
export function CloseOnEscape({ href }: { href: string }) {
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // 조합 중인 한글 입력(IME)의 Esc 는 조합 취소이므로 닫기로 보지 않는다.
      if (e.key !== "Escape" || e.isComposing) return;
      router.push(href);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [href, router]);

  return null;
}
