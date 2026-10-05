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
# ⚠️ **alpine 을 쓰지 않는다.** alpine 은 musl 이고, `package-lock.json` 은 glibc 머신에서
#    만들어져 플랫폼별 네이티브 패키지(`@next/swc-*`, `@esbuild/*`, oxide, lightningcss)의
#    **glibc 변종만** 담고 있다. `npm ci` 는 락파일에 없는 플랫폼 패키지를 만나면 **즉시
#    실패**한다 — 2026-10-06 에 Actions 빌드가 `npm ci` 에서 4초만에 죽은 원인이 이것이었다.
#    형제 프로젝트 merrycoco-admin 이 alpine 에서 되는 것은 **pnpm** 이 설치 시점에
#    플랫폼별로 내려받기 때문이다. 여기는 npm 이므로 **런타임도 glibc 로 맞춘다.**
#    (`npm ci --os=linux --libc=musl` 로 락파일을 보강하는 길도 있지만, 개발 머신에서
#     `npm install` 을 한 번 하면 다시 빠져 조용히 같은 사고가 난다.)
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
