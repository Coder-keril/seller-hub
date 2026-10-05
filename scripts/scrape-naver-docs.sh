#!/usr/bin/env bash
# 네이버 커머스API 문서를 로컬로 내려받는다.
#
#   apicenter.commerce.naver.com 은 Claude 의 조회 도구로는 접근이 막혀 있다.
#   이 스크립트로 원문을 docs/naver/raw/ 에 저장하면 로컬 파일로 읽을 수 있다.
#
#   실행:  bash scripts/scrape-naver-docs.sh
#
set -u

HOST="https://apicenter.commerce.naver.com"
OUT="$(cd "$(dirname "$0")/.." && pwd)/docs/naver/raw"
UA="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36"

mkdir -p "$OUT"
cd "$OUT" || exit 1

get() { curl -sL --compressed -A "$UA" "$1"; }

echo "저장 위치: $OUT"
echo

# ── 1. 문서 페이지 ─────────────────────────────────────────────
for p in /docs /docs/solution-doc /ko/basic/commerce-api /ko/basic/solution-doc; do
  f="page$(echo "$p" | tr '/' '_').html"
  code=$(curl -sL --compressed -A "$UA" -o "$f" -w '%{http_code}' "$HOST$p")
  printf '%-32s %s  %8s bytes\n' "$p" "$code" "$(wc -c < "$f")"
done
echo

# ── 2. 페이지가 참조하는 정적 자원 수집 ────────────────────────
# JS 번들 · JSON · YAML 전부 (Next.js 는 /_next/static/... 형태)
grep -hoE '(src|href)="[^"]+\.(js|json|ya?ml)"' page*.html 2>/dev/null \
  | sed -E 's/.*="//; s/"$//' | sort -u > assets.txt
# 따옴표 없이 번들 경로가 박혀 있는 경우도 긁는다
grep -hoE '/_next/static/[A-Za-z0-9/._-]+\.(js|json)' page*.html 2>/dev/null \
  | sort -u >> assets.txt
sort -u -o assets.txt assets.txt
echo "참조 자원 $(wc -l < assets.txt)개"
echo

# ── 3. 자원 내려받기 ───────────────────────────────────────────
mkdir -p assets
n=0
while IFS= read -r u; do
  [ -z "$u" ] && continue
  case "$u" in
    //*)  full="https:$u" ;;
    /*)   full="$HOST$u" ;;
    http*) full="$u" ;;
    *)    full="$HOST/$u" ;;
  esac
  name="assets/$(echo "$u" | tr '/?&=:' '_____' | tail -c 120)"
  get "$full" > "$name" 2>/dev/null && n=$((n+1))
done < assets.txt
echo "내려받음 ${n}개 → $OUT/assets/"
echo

# ── 4. OpenAPI 스펙이 섞여 있는지 확인 ─────────────────────────
echo "--- OpenAPI 스펙 후보 ---"
grep -lE '"(openapi|swagger)"[[:space:]]*:' assets/* page*.html 2>/dev/null || echo "(없음)"
echo

# ── 5. API 경로 추출 ───────────────────────────────────────────
# /v1/... /v2/... /external/v1/... 형태를 전부 모은다
echo "--- API 경로 ---"
grep -hoE '/(external/)?v[0-9]+(/[A-Za-z0-9_.{}:-]+)+' page*.html assets/* 2>/dev/null \
  | sort -u > api-paths.txt
wc -l < api-paths.txt | xargs echo "경로"
head -60 api-paths.txt
echo
echo "전체 목록: $OUT/api-paths.txt"
echo

# ── 6. 문서 본문이 번들에 인라인돼 있는지 표시 ─────────────────
echo "--- 한글 본문이 들어 있는 파일 (문서가 인라인된 곳) ---"
for f in page*.html assets/*; do
  [ -f "$f" ] || continue
  c=$(grep -cE '인증|주문|상품|판매자' "$f" 2>/dev/null || echo 0)
  [ "$c" -gt 20 ] && printf '%8s hits  %s\n' "$c" "$f"
done | sort -rn | head -10
