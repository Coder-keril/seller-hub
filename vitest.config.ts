import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// 순수 로직 단위 테스트. DB·Next 런타임 없이 도는 것만 대상이다 (pricing·crypto·naver/auth).
// `@` 별칭은 tsconfig.paths 와 같은 값이어야 한다 — 어긋나면 테스트만 조용히 깨진다.
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
