# Merrycoco Lab — Next.js 운영 이미지 (3단 멀티스테이지, standalone 출력)
#
# 비밀값은 **이미지에 굽지 않는다.** 서버의 `.env.production` 을 런타임에 주입한다
# (`deploy.sh` 가 `--env-file` 로 넘긴다). 이미지는 어느 테넌트의 것도 아니다.
#
#   docker run --env-file .env.production -p 127.0.0.1:3046:3000 <image>
#
# Node 24 — 개발·CI 와 같은 메이저로 맞춘다. 런타임 의존성(`pg`·`bcryptjs`)은 둘 다 순수
# JS 라서 네이티브 빌드 도구가 필요 없다(`node-gyp` 없음).
FROM node:24-alpine AS base

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
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
