import type { Metadata } from "next";
import { APP_NAME, APP_TAGLINE, APP_URL } from "@/lib/brand";
import "./globals.css";

/**
 * 표시명·주소는 `src/lib/brand.ts` 에서만 온다.
 *
 * `title.template` 덕에 각 화면은 `metadata = { title: "영수증 내역" }` 만 적으면
 * 탭에 "영수증 내역 · Merrycoco Lab" 으로 나온다 — 화면마다 서비스명을 적지 않는다.
 */
export const metadata: Metadata = {
  title: { default: APP_NAME, template: `%s · ${APP_NAME}` },
  description: APP_TAGLINE,
  metadataBase: new URL(APP_URL),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
