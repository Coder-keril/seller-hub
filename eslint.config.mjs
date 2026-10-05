import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // 탐침 스크립트는 **아직 모르는 응답 구조**를 찔러보는 도구다. 거기에 타입을 붙이라고
    // 하면 캐스트만 늘고 얻는 게 없다. 운영 경로가 아니라 수동 실행 전용이다.
    // 글롭을 넓게 쓰지 않고 파일명을 적는다 — 새로 만든 스크립트가 조용히 면제되면 안 된다.
    files: [
      "scripts/naver-probe-*.ts",
      "scripts/naver-list-products.ts",
      "scripts/naver-product-status.ts",
    ],
    rules: { "@typescript-eslint/no-explicit-any": "off" },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // 우리 코드가 아닌 것들. .venv 안에는 gradio 가 번들한 프론트엔드 JS 가 들어 있어서
    // 빼지 않으면 린트 결과가 4만 건을 넘어 실제 문제가 묻힌다.
    ".venv/**",
    "docs/**",        // 스크랩한 마켓 문서 + 원문 스냅샷 자산
    "graphify-out/**",
  ]),
]);

export default eslintConfig;
