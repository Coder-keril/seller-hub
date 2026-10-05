/** 메뉴 중앙본. 화면을 더할 때 여기 한 줄을 추가한다. */
export interface NavItem {
  href: string;
  label: string;
}

/**
 * 로그인 직후·`/` 접속 시 보낼 화면.
 *
 * **메뉴에 있는 화면이어야 한다.** 숨긴 화면으로 보내면 로그인하고 들어왔는데 메뉴에서
 * 찾을 수 없는 화면에 서 있게 된다 — `/pricing` 을 숨기면서 실제로 그렇게 됐다.
 */
export const HOME_HREF = "/receipt-dashboard";

export const NAV_ITEMS: NavItem[] = [
  // `/pricing`(판매가 계산)은 **메뉴에서 숨겼다**(의뢰인 요청). 라우트는 살아 있어서
  // 주소로 직접 들어가거나 영수증 대시보드에서 `?code=` 로 넘어오면 동작한다.
  { href: "/receipt", label: "영수증 입력" },
  { href: "/receipts", label: "영수증 내역" },
  { href: "/receipt-dashboard", label: "영수증 대시보드" },
  { href: "/price-adjustment", label: "차액환불 후보" },
  { href: "/price-adjustment/stats", label: "차액환불 현황" },
  { href: "/settings", label: "설정" },
];
