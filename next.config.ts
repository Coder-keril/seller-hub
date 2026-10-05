import os from "node:os";
import type { NextConfig } from "next";

/**
 * 개발 서버를 **LAN 에서 접속**할 때 필요한 허용 목록.
 *
 * Next 16 은 localhost 가 아닌 호스트에서 오는 `/_next/*` dev 리소스 요청을 기본 차단한다
 * ("Blocked cross-origin request to Next.js dev resource /_next/hmr"). 막히면 HMR 과 함께
 * **하이드레이션이 끝나지 않아** 화면이 죽은 것처럼 보인다 — 입력창에 글자는 들어가는데
 * React 상태가 갱신되지 않아 버튼이 계속 disabled 로 남는다. (2026-10-05 에 실제로 겪었다.)
 *
 * `scripts/dev.mjs` 가 접속용 LAN IP 를 찍어 주므로 **여기서 같은 값을 계산해** 둘이
 * 어긋나지 않게 한다. IP 가 바뀌어도 재시작하면 따라온다.
 */
const lanHosts = Object.values(os.networkInterfaces())
  .flat()
  .filter((n) => n && n.family === "IPv4" && !n.internal)
  .map((n) => n!.address);

/**
 * `output: "standalone"` — GCP VM 에 Docker 로 올린다(README 의 배포 구조).
 * 빌드 산출물만 담으면 되므로 node_modules 전체를 이미지에 넣지 않는다.
 *
 * `serverExternalPackages` — `pg`·`bcryptjs` 는 번들러가 건드리면 안 된다. 네이티브 바인딩과
 * 동적 require 가 있어서 번들에 끌려들어가면 런타임에 깨진다.
 *
 * ⚠️ **`mssql` 은 여기 없다.** seller-hub 앱은 merrycoco_web(MSSQL) 에 **접속하지 않는다.**
 *    필요한 데이터는 Supabase 로 **이관**해서 쓰고, 동기화는 **별도 sync 서비스**가 맡는다.
 *    두 DB 는 따로 돈다. 앱 코드(`src/`)에서 `mssql`·`@aws-sdk/client-s3` 를 import 하면 안 된다 —
 *    둘은 devDependencies 이고 운영 이미지에 들어가지 않는다.
 *    (`scripts/sync-master.mjs` 는 **분리 전 과도기**다. sync 서비스가 서면 이 저장소를 떠난다.)
 */
const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
  serverExternalPackages: ["pg", "bcryptjs"],
  allowedDevOrigins: ["localhost", "127.0.0.1", ...lanHosts],

  /**
   * 서버 액션의 CSRF 검사에 **공개 도메인**을 등록해 둔다.
   *
   * Next 는 요청의 `Origin` 을 앱이 아는 호스트(`x-forwarded-host` 또는 `host`)와 맞춰 보고
   * 다르면 액션을 거부한다. 리버스 프록시가 `x-forwarded-host` 를 제대로 넘기면 필요 없지만,
   * 자기 호스트를 넘기면 브라우저는 `lab.merrycoco.co.kr`, 서버는 `localhost:3009` 가 되어
   * **로그인·로그아웃이 통째로 막힌다**(둘 다 서버 액션이다). 한 줄로 막을 수 있는 사고다.
   */
  experimental: {
    serverActions: { allowedOrigins: ["lab.merrycoco.co.kr"] },
  },
};

export default nextConfig;
