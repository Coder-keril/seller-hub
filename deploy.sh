#!/bin/bash
# Merrycoco Lab 배포 — GHCR 이미지 pull 후 컨테이너 교체.
#   비밀값: 서버의 .env.production (Git 에 없다)
#   앞단:   브라우저 → nginx(443, Let's Encrypt) → 127.0.0.1:3046 → 컨테이너 3000
#           (클라우드플레어 프록시를 쓰지 않는다 — DNS only)
#   사용법(셋 다 안전):  ./deploy.sh   ·   bash deploy.sh   ·   . deploy.sh (source)
#           ./deploy.sh <sha>  — 특정 커밋 이미지로 (롤백)
#
# ── source(. deploy.sh) 안전 설계 — merrycoco-admin 의 2026-07-30 사고에서 가져왔다 ──────
#   함정: source 하면 IMAGE/CONTAINER_NAME/HOST_PORT 가 셸에 남아, 다음에 다른 앱의
#   deploy.sh 를 실행할 때 그 값이 재사용되어 **슬롯이 뒤바뀐 채 배포**된다. 실제로
#   admin 이 app 의 env 로 떠서 로그인 500 이 났다.
#   방지책:
#     1) 아이덴티티(IMAGE·CONTAINER_NAME·HOST_PORT)를 **override 없이 고정**한다.
#        (`${VAR:-기본값}` 을 쓰면 셸 잔존값에 오염된다 — 그게 사고의 원인이었다.)
#     2) 본문을 서브셸 ( ) 로 감싼다 → 변수·에러가 상위 셸로 새지 않는다.
#     3) set -e 는 '소스 + 서브셸'에서 신뢰할 수 없다 → 핵심 명령마다 `|| { ...; exit 1; }`.
# ─────────────────────────────────────────────────────────────────────────────

# sh(dash) 로 실행돼도 깨지지 않게 bash 로 재실행(source 면 BASH_VERSION 이 있어 건너뜀).
if [ -z "${BASH_VERSION:-}" ]; then exec bash "$0" "$@"; fi

(
  # ── 아이덴티티: 고정 ──────────────────────────────────────
  # ⚠️ GHCR 경로는 **소문자만** 받는다. GitHub 계정은 `Coder-keril` 이지만 이미지 경로는
  #    `coder-keril` 이다. 워크플로 쪽은 `docker/metadata-action` 이 알아서 소문자로 바꾸므로
  #    양쪽이 같은 이미지를 가리킨다.
  OWNER=coder-keril
  REPO=seller-hub
  CONTAINER_NAME=seller-hub
  HOST_PORT=3046          # 127.0.0.1:3046 → 컨테이너 3000
                          # (merrycoco app 3006 · admin 3016 · ezoffice 3026 · ezops 3036 과 분리)

  TAG="${1:-latest}"      # 인자로 커밋 SHA 를 주면 그 이미지로 (롤백)
  IMAGE="ghcr.io/${OWNER}/${REPO}:${TAG}"
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"
  ENV_FILE="$SCRIPT_DIR/.env.production"

  echo "[배포] 이미지     : $IMAGE"
  echo "[배포] 컨테이너   : $CONTAINER_NAME"
  echo "[배포] 포트       : 127.0.0.1:${HOST_PORT} → 컨테이너 3000"
  echo "[배포] 환경파일   : $ENV_FILE"

  if [ ! -f "$ENV_FILE" ]; then
    echo "[오류] $ENV_FILE 이 없습니다. (.env.example 참고 — 최소 DATABASE_URL · CREDENTIAL_KEY · APP_URL)"
    exit 1
  fi

  echo "[배포] 이미지 pull..."
  # ⚠️ pull 실패 시 **반드시 중단**한다. 안 그러면 로컬에 남아 있던 옛 :latest 로 컨테이너를
  #    재생성해 "배포한 줄 알았는데 구버전" 이 된다(merrycoco-admin 에서 실제로 겪었다).
  docker pull "$IMAGE" || { echo "[오류] pull 실패 — 배포 중단(기존 컨테이너 유지)."; exit 1; }

  # ── 받아온 이미지가 '어느 커밋'인지 찍는다 ────────────────
  #   컨테이너 생성 시각만으로는 부족하다 — 재배포하면 컨테이너는 새로 생기지만 :latest 가
  #   아직 옛 이미지를 가리킬 수 있다(Actions 빌드가 안 끝난 경우). 그래서 이미지에 박힌
  #   커밋을 찍어 **방금 푸시한 커밋과 눈으로 대조**한다.
  #   ⚠️ 자동 비교로 막지 않는다 — 서버 체크아웃이 최신이 아닐 수 있어 거짓 경고를 낸다.
  IMG_REV=$(docker inspect --format '{{index .Config.Labels "org.opencontainers.image.revision"}}' "$IMAGE" 2>/dev/null)
  IMG_AT=$(docker inspect --format '{{index .Config.Labels "org.opencontainers.image.created"}}' "$IMAGE" 2>/dev/null)
  echo "[배포] 이미지 커밋 : ${IMG_REV:-(라벨 없음)}"
  echo "[배포] 이미지 빌드 : ${IMG_AT:-(라벨 없음)}"
  echo "[배포]              ↑ 방금 푸시한 커밋과 다르면 Actions 빌드가 아직 안 끝난 것입니다."

  echo "[배포] 기존 컨테이너 제거..."
  docker rm -f "$CONTAINER_NAME" 2>/dev/null || true

  echo "[배포] 새 컨테이너 실행..."
  docker run -d \
    --name "$CONTAINER_NAME" --restart unless-stopped \
    -p "127.0.0.1:${HOST_PORT}:3000" \
    --env-file "$ENV_FILE" \
    "$IMAGE" || { echo "[오류] docker run 실패 — 배포 중단."; exit 1; }

  # ── 확인: 떠 있는지 + 실제로 응답하는지 ───────────────────
  # 프로세스가 살아 있어도 DB 접속이 틀리면 화면이 전부 500 이다. 그러면 '배포 성공' 이
  # 아니다. 로그인 화면(DB 를 보지만 인증이 필요 없다)으로 한 번 찔러 본다.
  echo "[배포] 상태 확인..."
  sleep 2
  if [ "$(docker inspect -f '{{.State.Running}}' "$CONTAINER_NAME" 2>/dev/null)" != "true" ]; then
    echo "[오류] 컨테이너 미실행 — docker logs $CONTAINER_NAME"; exit 1
  fi
  CODE=""
  for i in 1 2 3 4 5 6 7 8 9 10; do
    CODE=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:${HOST_PORT}/login" 2>/dev/null)
    [ "$CODE" = "200" ] && break
    sleep 1
  done
  if [ "$CODE" = "200" ]; then
    echo "[배포] 실행 중 ✅  /login 200  (앞단 nginx → https://lab.merrycoco.co.kr)"
  else
    echo "[경고] 컨테이너는 떴지만 /login 이 ${CODE:-무응답} 입니다 — DATABASE_URL 을 먼저 보세요."
    echo "       docker logs $CONTAINER_NAME"
    exit 1
  fi

  echo "[배포] 미사용 이미지 정리..."
  docker image prune -f >/dev/null || true

  echo "[배포] 완료."
)
