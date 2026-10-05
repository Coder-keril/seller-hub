# Merrycoco Lab — Next.js 운영 이미지 (3단 멀티스테이지, standalone 출력)
#
# 비밀값은 **이미지에 굽지 않는다.** 서버의 `.env.production` 을 런타임에 주입한다
# (`deploy.sh` 가 `--env-file` 로 넘긴다). 이미지는 어느 테넌트의 것도 아니다.
#
#   docker run --env-file .env.production -p 127.0.0.1:3046:3000 <image>
#
# Node 24 — 개발·CI 와 같은 메이저로 맞춘다. 런타임 의존성(`pg`·`bcryptjs`)은 둘 다 순수
# JS 라서 네이티브 빌드 도구가 필요 없다(`node-gyp` 없음).
#
# ⚠️ **alpine 이 아니라 debian slim 이다.** alpine 은 musl 이고 `package-lock.json` 은 glibc
#    머신에서 생성된다. pnpm 은 설치 시점에 트리를 다시 계산하므로 형제 프로젝트
#    merrycoco-admin(pnpm)은 alpine 에서 문제가 없지만, **npm 의 `ci` 는 락파일에 적힌
#    것만 설치**하므로 플랫폼이 어긋나면 손쓸 데가 없다. 런타임 libc 를 개발·CI 와 같은
#    glibc 로 맞춰 그 가능성을 아예 없앤다. (2026-10-06 의 `npm ci` 실패는 **이것이 원인이
#    아니었다** — 아래 npm 버전 문제였다. 그래도 slim 으로 둔다: 검증된 조합이고 비용은 40MB 다.)
#
# ⚠️ **`npm ci` 는 락파일을 만든 npm 과 버전이 어긋나면 즉시 실패한다.**
#    2026-10-06: 로컬 npm 11.6.2 로 만든 락파일을 CI·이 이미지의 npm 11.21.0 이
#    `Missing: @emnapi/runtime … from lock file` 로 거부해 3초만에 죽었다.
#    락파일은 **CI 와 같은 npm** 으로 갱신한다(`CLAUDE.md` 의 "명령어" 참고).
FROM node:24-slim AS base

# ── 의존성 ────────────────────────────────────────────────────
# **dev 의존성까지 설치한다.** `next`·`typescript`·`tailwindcss` 가 devDependencies 라
# `--omit=dev` 로는 빌드가 안 된다. 운영 이미지에는 standalone 이 추린 것만 들어간다.
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ── 빌드 ──────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN mkdir -p public
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ── 실행 ──────────────────────────────────────────────────────
# standalone 출력은 자기 `node_modules` 를 들고 있다 — 여기서 npm install 을 하지 않는다.
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# 비root 로 돌린다. node 공식 이미지에 `node` 사용자(uid 1000)가 이미 있으므로 새로 만들지
# 않는다 — alpine 시절에 쓰던 `adduser --system` 은 배포판마다 플래그가 달라 깨지기 쉽다.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
USER node
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
