# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

`README.md` 에 인프라 구성·마스터 데이터 원천·이미지 파이프라인·확장 전략이 정리돼 있다.
이 문서는 그것을 반복하지 않고, 여러 파일을 읽어야 알 수 있는 규약만 담는다.

## 명령어

```bash
npm run dev                      # 개발 서버 (PORT 기본 3009)
npm run check                    # 스키마 + upsert 검증. DB 없이 WASM Postgres 로 돈다
npm test                         # vitest run
npx vitest run -t "영세"          # 이름으로 테스트 1건만
npx vitest run src/lib/pricing.test.ts
npm run typecheck                # tsc --noEmit
npm run db:apply sql/00N_x.sql   # Supabase 에 마이그레이션 적용
npm run seed:user -- --email me@x.com --name 홍길동   # 로그인 계정 생성/비밀번호 재설정
```

⚠️ **`package-lock.json` 은 CI 와 같은 npm 으로 갱신한다.** `npm ci` 는 락파일에 적힌 것만
설치하고, **락파일을 만든 npm 보다 CI 의 npm 이 새로우면 즉시 실패한다** — 설치를 시작하지도
못하고 끝난다. 2026-10-06 에 로컬 npm 11.6.2 로 만든 락파일을 CI·Docker 의 11.21.0 이
`Missing: @emnapi/runtime@… from lock file` 로 거부해 Actions 가 3초만에 죽었다.

```bash
npm -v                                      # CI(node:24 계열)가 쓰는 버전과 같아야 한다
npx npm@<CI버전> install --package-lock-only  # 어긋났을 때 락파일만 갱신
npx npm@<CI버전> ci                           # 갱신 후 반드시 확인
```

증상이 특이하다 — **로컬에서는 `npm ci` 가 멀쩡히 된다**(캐시를 비워도 된다). 그래서 CI 만
깨지면 패키지가 아니라 **npm 버전 차이**를 먼저 본다.

스크립트는 `npx tsx scripts/<name>.ts` (TS) 또는 `node scripts/<name>.mjs` (JS) 로 돌린다.
전부 `loadEnv()` (`scripts/pgx.mjs`) 로 `.env.development` 를 읽는다.

`scripts/**/*.ts` 가 tsconfig `include` 에 들어 있다 — 스크립트도 타입체크 대상이다.

### 자주 쓰는 스크립트

```bash
npx tsx scripts/seed-tenant.ts --from-env   # 테넌트 + 채널계정 생성, env 인증정보를 DB 로 이관
npx tsx scripts/seed-fees.ts --grade 영세    # 마켓 수수료 시딩 (등급별)
npx tsx scripts/naver-sync-fees.ts --apply  # 정산 실측값으로 수수료 갱신
npx tsx scripts/naver-register-one.ts --url <이미지URL>   # 상품 1건 등록 (--go 없으면 dry)
python3 scripts/fetch-naver-docs.py --llms  # API 문서 갱신
```

`naver-probe-*.ts` 는 읽기 전용 탐침이다. 마켓 API 응답 구조를 확인할 때 쓰고, 새 엔드포인트를
다룰 때는 probe 로 먼저 실제 응답을 확인한 뒤 코드를 쓴다 — 문서와 실제가 어긋나는 일이 많았다.

## 웹 계층 (Next.js 16 · App Router)

```bash
npm run dev     # scripts/dev.mjs — PORT 기본 3009, LAN IP URL 을 한 줄 더 찍는다
npm run build   # next build (output: standalone — Docker 배포용)
npm run start
npm run lint    # eslint
```

- **패키지 매니저는 npm** 이다(`package-lock.json`). 형제 프로젝트 `merrycoco-admin` 은 pnpm 이지만
  여기서 pnpm 을 쓰면 락파일이 둘로 갈라진다.
- **TypeScript 5** 를 쓴다. `typescript-eslint` 가 TS 7 을 아직 지원하지 않아 `npm run lint` 가
  로드조차 안 된다(형제 프로젝트도 TS 5).
- **Next 는 16.3.3 이상**이어야 한다. 16.3.2 이하에는 인증 불필요 RCE 를 포함한 critical 권고가 걸려 있다.
- `next.config.ts` 의 `serverExternalPackages` 에 `pg`·`mssql`·`bcryptjs` 를 넣어 뒀다 —
  네이티브 바인딩이 있어 번들에 끌려들어가면 런타임에 깨진다.
- **서버 액션은 `Origin` 을 검사한다.** 프록시가 `x-forwarded-host` 로 공개 호스트를 넘기지
  않으면 브라우저(`lab.merrycoco.co.kr`)와 서버(`localhost:3009`)가 어긋나 **로그인·로그아웃이
  통째로 막힌다** — 둘 다 서버 액션이다. `next.config.ts` 의
  `experimental.serverActions.allowedOrigins` 에 공개 도메인을 넣어 뒀다.
- **`allowedDevOrigins` 를 비우지 말 것.** Next 16 은 localhost 가 아닌 호스트에서 오는
  `/_next/*` dev 리소스를 **기본 차단**한다(`Blocked cross-origin request to /_next/hmr`).
  막히면 HMR 과 함께 **하이드레이션이 끝나지 않아 화면이 죽은 것처럼 보인다** — 입력창에
  글자는 들어가는데 React 상태가 갱신되지 않아 버튼이 계속 disabled 로 남는다.
  `next.config.ts` 가 `os.networkInterfaces()` 로 LAN IP 를 계산해 넣는다 —
  `scripts/dev.mjs` 가 찍는 접속 URL 과 **같은 값**이라야 어긋나지 않는다.
  (2026-10-05 에 영수증 입력 화면이 이 때문에 먹통이 됐다. IP 가 바뀌면 재시작하면 따라온다.)
- **`next dev` 가 이 파일(`CLAUDE.md`) 끝에 자기 블록을 덧붙인다** — `BEGIN:nextjs-agent-rules`
  주석으로 시작하는 구간이다. 지워도 다시 생기니 그대로 두고 함께 커밋한다.
  > ⚠️ **그 주석 마커를 본문에 그대로 적지 말 것.** 생성기는 `indexOf` 로 **첫** 마커를 찾아
  > 거기부터 끝 마커까지를 자기 블록으로 **교체**한다. 2026-10-05 에 이 문서가 그렇게 잘려
  > 섹션 여덟 개를 잃었다. 마커를 언급할 때는 `<!--` 를 빼고 이름만 적는다.

### 구조

```
src/lib/brand.ts            APP_NAME · APP_URL · APP_TAGLINE — 브랜드가 박히는 유일한 지점
src/app/layout.tsx          루트. title 템플릿 "%s · Merrycoco Lab" + metadataBase
src/app/(app)/layout.tsx    판매자 화면 셸 — **여기서 로그인을 요구한다**
src/app/login/              로그인 화면 + loginAction·logoutAction (JS 없이 동작)
src/app/(app)/nav-items.ts  메뉴 중앙본. 화면을 더하면 여기 한 줄
src/app/(app)/pricing/      판매가 계산 — 쿼리스트링 입력, 클라이언트 JS 없음
src/app/(app)/receipt/      영수증 입력 — .txt 드래그드랍 + 붙여넣기
src/app/api/receipt/save/   영수증 저장 (서버 재파싱)
```

**테넌트는 `currentTenant()`(`src/lib/session.ts`) 로만 얻는다.** 세션 쿠키를 읽어
로그인한 사용자의 테넌트를 돌려주고, **로그인하지 않았으면 `/login` 으로 보낸다.**
화면·서버액션이 전부 이 함수를 지나므로 인증 검사가 한 곳에만 있다 — 새 화면에서 빼먹을 수 없다.

- `tenantOrNull()` — 리다이렉트 없이 상태만 본다. **API 라우트는 이것으로 401 을 돌려준다**
  (라우트에서 리다이렉트하면 `fetch` 가 307 을 따라가 로그인 HTML 을 받는다).
- `soleTenant()` — **CLI 스크립트 전용.** 쿠키가 없으므로 판매자 테넌트가 하나뿐일 때만
  그것을 쓰고 둘 이상이면 거부한다. 대상을 골라야 하면 스크립트에 `--tenant` 를 받게 한다.

**`pool()` 은 `globalThis` 에 매달려 있다**(`src/lib/db.ts`). 모듈 지역 변수에 두면 개발 서버
HMR 이 저장마다 새 풀을 만들어 Supabase Session pooler 커넥션이 바닥난다.

**URL·폼에서 온 값을 SQL 캐스트에 그대로 넣지 않는다.** Postgres 는 타입이 안 맞으면
예외를 던지고 **화면 전체가 죽는다**. 둘 다 실제로 500 이 났다:
- `/receipts?open=x` → `invalid input syntax for type uuid`
- `/receipt-dashboard?from=2026-13-45` → 날짜 캐스트 실패 (모양만 맞아도 존재하지 않는 날짜)

`src/lib/db.ts` 의 **`isUuid()` · `isDateOnly()`** 로 미리 거른다. 틀린 값은 "없음"·"필터 없음"
으로 다룬다 — 사용자 오타나 오래된 링크로 화면이 깨질 일이 아니다.
(파라미터 바인딩 자체는 제대로 동작한다 — `?code=';drop` 은 그냥 "없는 상품"이 된다.)

**목록의 React key 는 그 행의 식별자와 같아야 한다.** `/price-adjustment` 가
`(receipt_id, product_code)` 를 key 로 썼는데 **같은 영수증에 같은 상품이 여러 줄**(줄마다
쿠폰이 다르면 분리된다, 실데이터 218조합) 있어 키가 겹쳤다. 경고로 끝나지 않는다 — 그 키가
`price_adjust_claim` 의 유일키라서 **두 줄을 각각 처리하면 뒤가 앞을 덮어써 수량·회수액이
누락된다.** → 쿼리에서 **영수증 × 상품으로 합산**해 한 행으로 만들었다(카운터에서도 한꺼번에
처리한다). 차액은 `sum(net) − 행사가 × sum(qty)` 로 계산해 가중평균 재곱셈의 드리프트를 피한다.

**DB 를 읽는 화면에는 `export const dynamic = "force-dynamic"` 을 둔다.** 없으면 Next 가 정적
생성을 시도해 빌드 시점에 `DATABASE_URL` 없이 쿼리를 쳐서 **빌드가 깨진다**(실제로 겪었다).
설령 돌아도 특정 테넌트 데이터가 정적 파일로 굳어 다른 판매자에게 노출된다. `searchParams` 가
있으면 우연히 동적이 되지만 그 우연에 기대지 않는다.

입력은 가능하면 **`<form method="get">` + 서버 컴포넌트**로 받는다. 상태를 들고 있을 이유가
생길 때만 클라이언트로 내린다 — 계산 결과 URL 을 그대로 공유할 수 있는 이점이 크다.

**린트 제외** — `.venv/`(gradio 가 번들한 프론트엔드 JS 4만 건) · `docs/`(스크랩 문서) ·
`graphify-out/`. 탐침·조회 스크립트는 미지의 응답을 찔러보는 도구라 `no-explicit-any` 를
파일명으로 끈다(글롭을 넓히지 않는다 — 새 스크립트가 조용히 면제되면 안 된다).

## 데이터 경계 — 앱은 MSSQL 에 접속하지 않는다

```
merrycoco_web (MSSQL)  ──[별도 sync 서비스]──>  Supabase  <──  seller-hub 앱
        사내망                   일괄 업서트          인터넷        읽기·쓰기
```

**두 DB 는 따로 돈다.** 필요한 데이터는 Supabase 로 **이관**해서 쓰고, 동기화는 **별도
sync 서비스**가 맡는다. 앱은 Supabase 하나만 본다.

- **`src/` 에서 `mssql`·`@aws-sdk/client-s3` 를 import 하지 않는다.** 둘은 devDependencies 이고
  운영 이미지(`output: standalone`)에 들어가지 않는다. `next.config.ts` 의
  `serverExternalPackages` 에도 `mssql` 이 없다.
- 운영 의존성은 `bcryptjs` · `next` · `pg` · `react` · `react-dom` 뿐이다. 늘릴 때는 앱이
  정말 그걸 런타임에 쓰는지 확인한다.
- `scripts/sync-master.mjs` 는 **분리 전 과도기**다. sync 서비스가 서면 이 저장소를 떠난다.
  넘겨줄 때의 접점은 Supabase 쪽 테이블과 `sync_state`(커서) 다 — 그 계약만 지키면 된다.

## 스키마 변경 순서

번호순 SQL 파일(`sql/001_` ~)이 마이그레이션이다. 되돌리는 장치는 없고, 앞 파일을 고치지 않고
새 번호를 추가한다.

**`npm run check` 를 먼저 통과시킨 다음 `npm run db:apply` 한다.** check 는 pglite(WASM)로
전체 DDL 을 처음부터 재생하고 핵심 불변식(중복 주문 차단, job 중복 차단, `SKIP LOCKED` 픽업,
upsert 갱신, 영수증 멱등 저장·중복차단·cascade)을 검증한다. DB 없이 도니까 스키마를 고치면
이것부터 돌린다.

pglite 제약 두 가지가 실제로 발목을 잡았다:

- **`pgcrypto` 가 없다.** `gen_random_uuid()` 는 PG13+ 코어라 그냥 쓴다.
- **인덱스 표현식은 IMMUTABLE 이어야 한다.** `coalesce(channel::text,'')` 같은 enum→text 캐스트가
  걸린다. 해법은 조건을 나눈 **부분 유니크 인덱스 두 개** (`where channel is not null` /
  `where channel is null`). `cost_item`, `price_policy` 가 이 패턴을 쓴다.
  같은 이유로 `timestamptz` 는 `::date` 캐스트가 STABLE 이라 인덱스에 못 쓴다 — `receipt.purchased_at`
  이 `timestamp` 인 이유 중 하나다.

## DB 접근 계층 — `src/lib/db.ts`

멀티테넌시를 쿼리 함수로 강제한다. **생 `pool().query()` 를 테넌트 데이터에 쓰지 않는다.**

| 함수 | 용도 | `$1` |
|---|---|---|
| `tquery(tenantId, sql, params)` | 판매자 자기 데이터 | `tenantId` 자동 주입 |
| `dquery(sql, params)` | 플랫폼 운영자(메리코코) | **위임받은 테넌트 목록** 자동 주입 |
| `mquery(sql, params)` | 마스터 데이터 (`tenant_id` 없음) | — |
| `ttx(tenantId, fn)` | 여러 문장을 한 트랜잭션에 | `fn` 이 `{ q, child }` 를 받는다 |

`tquery` 는 `assertTenantScoped()` 로 SQL 에 `tenant_id` 와 `$1` 이 있는지 검사한다.

`dquery` 가 설계의 핵심이다. 운영자는 여러 판매자의 주문을 한 화면에서 처리해야 해서 `tquery` 를
쓸 수 없지만 전체를 열면 격리가 무너진다. 그래서 **`fulfillment_delegation` 테이블이 곧 권한
경계**다 — `mode='MERRYCOCO'` 로 위임한 테넌트만 목록에 들어가고, 위임하지 않은 판매자 데이터는
운영자도 못 본다. 쓸 때는 `where tenant_id = any($1)` 로 받는다.

`ttx` 의 `child` 는 **tenant_id 검사를 건너뛴다.** `receipt_item`·`order_item` 처럼 tenant_id
컬럼이 없고 부모 id 로만 닿는 상세 테이블용이다. **같은 트랜잭션 안에서 테넌트 범위로 얻은
부모 id 에만** 쓴다 — 밖에서 받은 id 를 그대로 넣으면 격리가 뚫린다.

새 테넌트 테이블은 `tenant_id` 를 갖고 복합 인덱스 맨 앞에 둔다 (훗날 파티셔닝 키).
**상세 테이블은 두지 않는다** — `order_item`·`receipt_item` 이 부모를 거친다.

## 인증정보는 DB 에 넣는다

판매자마다 마켓·택배사 API 키가 다르므로 환경파일로 관리할 수 없다. `.env` 에는 **플랫폼 전역
비밀만** 남는다 — `CREDENTIAL_KEY`, `DATABASE_URL`, `MSSQL_*`, `R2_*`, `NAVER_SOLUTION_*`, `APP_NAME`.

판매자별 인증정보는 `channel_account.credential_enc` / `courier_account.credential_enc` 에
AES-256-GCM 으로 봉인한다 (`src/lib/crypto.ts`, `sealCredential` / `openCredential`).
`CREDENTIAL_KEY` 는 32바이트 base64.

## 설정 — `/settings`

세 영역을 한 화면에 둔다(`?tab=`). 전부 서버 액션이고 **자바스크립트 없이 동작**한다.

| 영역 | 저장 위치 |
|---|---|
| 회원번호 별명 | `receipt_alias (kind='MEMBER')` |
| 카드번호 별명 | `receipt_alias (kind='CARD')` |
| 오픈마켓 API 키 | `channel_account.credential_enc` (기존 테이블 재사용) |

**별명은 번호를 숨기지 않는다** — `aliasLabel()` 이 `"큰형 카드 (40457700****120*)"` 로 만든다.
카운터에서 실제로 대조하는 값이 번호이기 때문이다. 별명은 영수증 내역·대시보드·차액환불
후보·현황에서 같은 함수로 표시한다. 화면당 `loadAliases()` **한 번**만 부른다(행마다 부르면 N+1).

목록은 `receipt` 의 실제 번호와 `receipt_alias` 를 **full join** 한다 — 별명 테이블만 읽으면
아직 이름을 안 붙인 번호가 안 보이고, 영수증만 읽으면 영수증을 지운 번호의 별명이 사라져 보인다.

⚠️ **API 키 값은 화면으로 내려보내지 않는다.** 목록은 복호화해서 **키 이름만** 뽑고 값은 버린다.
수정 폼의 **빈 칸은 "안 바꿈"** 이다 — 비밀값을 채워 보여주면 그 순간 화면에 비밀이 실린다.

⚠️ **항목명이 확정된 마켓은 네이버뿐이다**(`naver/auth.ts` 가 실제로 쓰는 `appId`·`appSecret`).
나머지는 연동할 때 그 마켓 문서로 확정한다 — 모르는 항목명을 지어 넣으면 실제와 어긋난 값이
DB 에 쌓인다. `CONFIRMED_FIELDS` 가 그 구분이고 화면에 안내가 뜬다.

## 가격 계산 — `src/lib/pricing.ts`

수수료가 판매가에 비례하므로 정상가에 비율을 더하면 목표 수익에 닿지 않는다. **역산한다.**

```
MARGIN        (정상가 + F) / (1 - f - c - r)
MARKUP        (정상가 × (1+r) + F) / (1 - f - c)
FIXED_PROFIT  (정상가 + F + P) / (1 - f - c)

f = 마켓 수수료율 합(VAT 반영)   F = 건당 정액비   c = 판매가 대비 비율비
```

`computePrice()` 는 **순수 함수**다 — DB 를 보지 않는다. 돈 계산이라 DB 없이 테스트할 수 있어야
한다. 조회(`resolveFees`/`resolveCosts`/`resolvePolicy`)와 계산을 분리해서 유지한다.

알아둘 것:

- **반올림은 올림이다.** 내리면 목표 수익에 미달한다.
- `channel_fee.category` 는 **마켓 카테고리 코드**다 (마스터 카테고리가 아니다). 수수료표는 대분류
  수준인데 상품은 리프에 등록되므로 `channel_ref.full_name` 접두사 매칭으로 조상 경로를 거슬러
  **가장 구체적인 설정을 kind 별로 하나씩** 고른다.
- `vat_included=false` 면 계산에서 1.1 을 곱한다. 공시값을 그대로 넣을 때만 false 다 —
  마켓이 "3% (VAT 별도 2.73%)" 로 쓰면 3% 가 **VAT 포함** 값이므로 true 여야 한다.
- 택배비는 위임/직접(`cost_item.mode`)에 따라 단가가 다르다. 월 발송 규모로 단가가 갈리기 때문.
- `channel_fee.rate` 는 `numeric(8,6)`. 네이버가 `1.947%` 처럼 소수 3자리(%)로 공시하므로
  소수 4자리로는 잘린다.
- ⚠️ **`master_price.original_price` 를 그대로 믿지 말 것.** 원천(`TB_retail_price`)에서 단가 상품
  (KG당단가)의 값에 **단가와 박스값이 섞여 있다**(척아이롤 도매 279,513 = 박스값). 단가 상품을
  등록하면 판매가가 터진다. merrycoco-admin 의 `FN_retail_price_now` 가 정본 조회 경로다.

## 배포

```
git push main  →  GitHub Actions   : buildx → ghcr.io/<owner>/seller-hub:{latest, <sha>}   ※ 빌드만
운영 서버에서 수동                  : ./deploy.sh          (롤백: ./deploy.sh <sha>)
브라우저 → nginx:443 (Let's Encrypt) → 127.0.0.1:3046 → 컨테이너 3000
```

운영 서버는 `mc-prod`(`~/.ssh/config`, 34.158.196.179 · `ez-office-merrycoco`)다.
같은 서버에 merrycoco-app(3006) · merrycoco-admin(3016) 컨테이너가 돌고 있다.
배포 위치는 **`~/webproject/merrycoco-lab/`** 이고, 전체 git 클론이 아니라 **`deploy.sh` +
`.env.production` 두 개만** 둔다(merrycoco-app·merrycoco-admin 도 같은 방식이다).
컨테이너 이름은 **`merrycoco-lab`**, 이미지는 **`ghcr.io/coder-keril/seller-hub`**(저장소 이름)다.

**클라우드플레어 프록시를 쓰지 않는다**(DNS only, lab → 34.158.196.179). 그래서
`/etc/nginx/ssl/merrycoco.co.kr-origin.*`(Cloudflare Origin 인증서, admin 이 쓰는 것)은
**쓸 수 없다** — 브라우저가 신뢰하지 않는다.

⚠️ **certbot 을 다시 돌리지 말 것.** `merrycoco.co.kr` 묶음 인증서의 SAN 에
**`lab.merrycoco.co.kr` 이 이미 들어 있다**(2026-10-06 확인, 만료 2027-01-03). 갱신은
webroot(`/var/www/certbot`) 로 certbot.timer 가 자동 처리한다. `certbot --nginx -d lab...`
은 **별도 인증서를 하나 더 만들고** 발급 한도만 소모한다. **80 포트는 계속 열어 둔다.**
이 서버에는 `options-ssl-nginx.conf`·`ssl-dhparams.pem` 이 **없다** — include 하면 `nginx -t` 가 깨진다.

| 파일 | 역할 |
|---|---|
| `Dockerfile` | **node:24-slim**(debian) 3단. dev 의존성까지 설치해 빌드하고 운영에는 standalone 만 남긴다 |
| `.dockerignore` | `scripts/`·`sql/`·`docs/`·`.env*` 제외 — 이미지에 비밀도 MSSQL 코드도 넣지 않는다 |
| `.github/workflows/build-and-push-image.yml` | 이미지 빌드·푸시. **배포는 하지 않는다** |
| `.github/workflows/ci.yml` | lint·typecheck·test·`npm run check` — 이미지 밖에서만 돌 수 있는 검사다 |
| `deploy.sh` | pull → 컨테이너 교체 → `/login` 200 확인 |
| `deploy/nginx/lab.merrycoco.co.kr.conf` | 80 리다이렉트 + 443, certbot 경로 |

- **포트 3046.** 같은 서버의 merrycoco app 3006 · admin 3016 · ezoffice 3026 · ezops 3036 과 분리한다.
- **`deploy.sh` 는 마이그레이션을 적용하지 않는다.** `sql/` 은 되돌리는 장치가 없어서 배포에
  묶으면 롤백이 불가능해진다. 스키마는 사람이 `npm run db:apply` 로 **먼저** 적용한다.
- ⚠️ **`deploy.sh` 의 아이덴티티(IMAGE·CONTAINER_NAME·HOST_PORT)에 `${VAR:-기본값}` 을 쓰지 말 것.**
  `. deploy.sh` 로 source 하면 셸에 남아 **다음 앱 배포가 이 슬롯으로 나간다**
  (merrycoco-admin 에서 2026-07-30 실발생 — admin 이 app 의 env 로 떠서 로그인 500).
  그래서 본문이 서브셸 `( )` 안에 있고 값이 고정이다.
- ⚠️ **"고쳤는데 화면이 그대로"의 첫 용의자는 언제나 배포다.** `deploy.sh` 가 pull 직후 이미지의
  OCI 라벨(커밋 SHA·빌드시각)을 찍는다 — 방금 푸시한 커밋과 눈으로 대조한다. CI 초록불은
  이미지 빌드보다 **훨씬 빨리** 끝나므로 배포 전에는 `Build and Push Docker Image` 쪽을 본다.
- ⚠️ nginx 의 `proxy_set_header Host $host;` 가 **로그인을 떠받친다.** 빠지면 Next 가 서버
  액션의 `Origin` 불일치로 거부해 로그인·로그아웃이 막힌다.

## 로그인

**외부 인증 서비스를 쓰지 않는다.** 어떤 회사의 계정 체계에도 묶여 있지 않고, 이 시스템의
`app_user` · `app_session` 두 테이블만 쓴다. 나가는 네트워크 호출이 없다.

| 지키는 것 | 어떻게 |
|---|---|
| 비밀번호 원본을 남기지 않는다 | `app_user.password_hash` = bcrypt(cost 10) |
| DB 가 새도 세션을 위조할 수 없다 | 쿠키엔 난수 32바이트, DB 엔 `sha256(토큰)` 만 |
| 스크립트가 쿠키를 못 읽는다 | 쿠키 `httpOnly` · `sameSite=lax` · 운영에선 `secure` |
| 가입된 이메일을 캐낼 수 없다 | 실패 메시지를 구분하지 않고, 이메일이 없을 때도 **더미 해시로 bcrypt 를 한 번 돌린다**(안 돌리면 응답 시간 차이로 알 수 있다) |
| 로그아웃이 서버에서 끊긴다 | 쿠키만 지우지 않고 `app_session` 행을 지운다 |
| 로그아웃이 미리보기로 발동하지 않는다 | 링크가 아니라 **POST 폼**이다 |
| `?next=` 로 외부로 튕기지 않는다 | `/로 시작하고 //가 아닌` 경로만 허용 (`actions.ts` 의 `safeNext`) |

세션 수명은 **14일 고정, 갱신 없다.** 만료된 행은 조회할 때 지나가며 지운다.

**가입 화면은 없다.** 계정은 운영자가 `npm run seed:user` 로 만든다 — 같은 이메일로 다시
돌리면 비밀번호를 갱신하고 **그 계정의 기존 세션을 전부 끊는다.** `--password` 를 주지 않으면
임의 비밀번호를 만들어 **한 번만 출력한다**(셸 히스토리에 안 남는 쪽이 기본).

로그인은 **자바스크립트 없이 동작한다** — 평범한 `<form action={서버액션}>` 이다.

### 역할 — `app_user.role`

| 역할 | 보는 것 |
|---|---|
| `OWNER` · `STAFF` | 자기 테넌트만 |
| `PLATFORM` | **아무 테넌트나 골라 그 판매자 화면을 그대로 본다** (시스템관리자) |

전환은 `view` 쿠키 하나로 된다 — 화면·서버액션이 전부 `currentTenant()` 를 지나므로
**화면 코드는 한 줄도 고치지 않는다.** 판단은 순수 함수 `viewTenantId()` 한 곳이고
`session.test.ts` 가 그것만 검증한다(격리의 경계라서 떼어냈다).

⚠️ **쿠키는 권한이 아니다.** 역할은 매 요청 DB(`app_user.role`)에서 읽고, 쿠키는 관리자일 때만
본다. 서버 액션 `switchTenant` 도 **자기 쪽에서 다시 `isAdmin` 을 확인한다** — 액션은 주소를
아는 사람이 직접 호출할 수 있어서 버튼을 숨기는 것은 방어가 아니다. 실측으로 확인했다:
일반 사용자가 `view` 쿠키를 끼워 넣어도 0건, 액션을 직접 POST 해도 쿠키가 심기지 않는다.

⚠️ **이것은 가장집(impersonation)이고 `fulfillment_delegation` 권한 경계를 지나가지 않는다.**
`dquery()` 는 위임한 판매자만 보지만 `PLATFORM` 전환은 **모든 테넌트**를 연다. 그래서
남의 테넌트를 보는 동안 **상단에 노란 띠로 누구 데이터인지 항상 띄운다** — 모르고
입력·환불처리하면 그대로 그 판매자에게 저장된다. 감사 로그는 아직 없다.

## 영수증 — `src/lib/receipt/`

코스트코 구매·환불 영수증 텍스트를 구조화해 저장한다. `merrycoco-admin` 에서 이식했다.

**영수증을 쌓는 이유는 셋이다** — 기능을 고칠 때 이 셋을 깨지 않는지 본다:
① **차액 환불**로 판매자 수익을 개선한다 (`price-adjustment.ts`).
② **매입 자료**가 된다 — 무엇을 언제 얼마에 몇 개 샀는지.
③ **매입가 + 판매가로 수익을 계산**한다 (`cost-basis.ts` → `pricing.ts`).

**현재 영수증 141건(상세 1,327줄)은 메리코코 테넌트에 있다**
(`9a785cd8-3cdf-4b30-ba00-5a1b7f3c0e51`, 계정 `jyw8912@naver.com`). 2026-10-06 에
이지오피스에서 옮겼다 — 처음 적재할 때 판매자 테넌트가 이지오피스뿐이어서 거기로 갔다.
⚠️ 메리코코는 `is_platform = true` 라서 **`soleTenant()`(CLI)가 이 테넌트를 고르지 않는다.**
`scripts/import-receipts.ts` 를 다시 돌릴 때는 `--tenant` 로 명시한다. 안 주면 빈
이지오피스 테넌트에 쌓인다.

**고객별 격리**: `receipt.tenant_id` + `tquery()` 로 강제한다. `receipt_item` 은 `order_item` 과
같이 부모를 거치므로 모든 조회가 `receipt` 조인을 지난다.
⚠️ `assertTenantScoped` 는 증명이 아니라 가드다. 로그인이 테넌트를 정해 주더라도, 판매자가
여러 명 실제로 붙는 시점에 **Postgres RLS** 를 켜야 한다.

| 파일 | 내용 |
|---|---|
| `parse.ts` | 영수증 텍스트 → `ParsedReceipt`. **순수 함수**, import 없음 |
| `payload.ts` | `ParsedReceipt` → 저장용 평탄 페이로드. **순수 함수** |
| `statements.ts` | 저장 SQL 생성. 런타임 import 없음 — check.mjs 가 직접 쓴다 |
| `save.ts` | `ttx()` 로 헤더+상세 한 트랜잭션 저장. 멱등 |
| `parse.test.ts` · `payload.test.ts` | 실제 영수증 기반 54건 |

**파싱은 결정론적이고 LLM·OCR 을 쓰지 않는다.** 영수증이 규칙적이라 정규식 줄 분류로
충분하고, **영수증 자기 값으로 4중 검산**한다 — 수량 합 = 총 판매 상품 수 · 쿠폰 할인 합 =
쿠폰합계 · 과세 + 부가세 = 합계 · 품목 금액 합 − 쿠폰 합 = 합계. 넷이 다 맞으면
`reconciled = true` 이고 그건 파싱이 정확했다는 증명이다. 하나라도 어긋나면 `false` 로
저장하되 **버리지 않는다** — 플래그를 보존해야 왜 틀렸는지 되짚을 수 있다.

이식할 때 로직은 **한 줄도 바꾸지 않았다**. 바뀐 것은 둘뿐이다:
- `toInt(s: string)` → `toInt(s: string | undefined)`. 이 저장소는 `noUncheckedIndexedAccess`
  가 켜져 있어 정규식 캡처가 `string | undefined` 다. 함수 안에 이미 `String(s)` + NaN 가드가
  있어 동작이 바뀌지 않는다.
- 캡처 그룹 접근에 `!` 를 붙였다 — 매치가 성립하면 그 그룹은 존재한다는 사실의 표기다.

### 저장 — `sql/009_receipt.sql`

**구매·환불을 한 테이블(`receipt`)에 담고 `kind` 로 가른다.** 원본은 둘로 나뉘어 있어 집계마다
UNION 을 했는데, 이 기능의 요점이 구매 − 환불 netting(남은 재고의 평균단가)이라 합치면
UNION 이 사라지고 평범한 group by 가 된다.

- `purchased_at` 은 **`timestamp`**(timestamptz 아님) — 영수증의 "12:11:00 PM" 은 타임존이 없는
  벽시계 시각이다. 덤으로 `::date` 캐스트가 IMMUTABLE 해져 날짜 인덱스를 만들 수 있다.
- `member_no` · `purchased_at` 은 **not null** — `missingRequiredFields()` 가 이미 보장한다.
- 자연키 `(tenant_id, purchased_at, register)` 에 **`nulls not distinct`** 를 쓴다. `register` 가
  결손일 수 있고 기본값(nulls distinct)이면 중복이 둘 다 들어온다.
- `receipt_card_uk` 는 `(tenant_id, purchased_at::date, card_number_masked, approval_no)` 부분
  인덱스다 — 시각·레인을 잘못 읽은 재업로드를 잡는다. 위반은 `DuplicateReceiptError` 로 변환한다.
- 환불 전용 컬럼(`original_date`·`original_approval_no`)은 nullable 이다. **현금환불은 원거래일이
  없다**(파서 테스트가 그 사례를 담고 있다).

**SQL 은 `statements.ts` 에서만 만든다.** 이 모듈은 런타임 import 가 없어서 `sql/check.mjs` 가
Node 로 직접 불러 pglite 에 **같은 SQL** 을 돌린다 — 멱등 저장 · 카드승인 중복차단 · 상세
cascade 세 불변식이 `npm run check` 에서 검증된다. check 쪽에 SQL 을 복사하면 조용히 갈라진다.

### 입력 화면 — `src/app/(app)/receipt/`

`.txt` 드래그드랍(다중) 또는 붙여넣기 → 화면에서 `parseReceipt`(순수 함수) 직접 호출로
즉시 표시 → 건별 `POST /api/receipt/save`. **서버가 다시 파싱해 저장한다** — 화면이 보낸
파싱 결과를 믿지 않는다(파서가 순수 함수라 같은 입력이면 같은 결과가 나온다).

응답 코드: `400` 본문·빈 텍스트 · `422` 필수항목 누락·품목 0건 · `409` 카드승인 중복.

**전체 저장은 검증 통과분만 대상으로 한다.** 검증 실패분은 사람이 원문을 본 뒤 개별로
저장하게 한다 — 일괄로 밀면 틀린 데이터가 조용히 쌓인다.

원본에서 떼어낸 것: 회원번호→이름 조회(사내 `TB_costco_member` 마스터) ·
txt 파일 내보내기(사내 운영 도구). 판매자용에 필요가 없다.

### 내역·대시보드 — `query.ts` · `dashboard.ts`

둘 다 **서버 컴포넌트 + 쿼리스트링**이다(API 라우트 없음). `/receipts` 는 `?open=<id>` 로 상세를
같은 화면에 펼친다.

- **`purchased_at` 은 SQL 에서 문자열로 뽑는다**(`to_char`). `timestamp` 를 node-postgres 가
  Date 로 바꾸면 서버 타임존이 끼어들어 영수증에 찍힌 시각과 달라진다.
- 대시보드는 **CTE 하나 + JSON 세 열**로 요약·상품별·라인을 한 번에 받는다. 쿼리를 세 번
  쓰면 필터 조건이 세 곳에 복사되어 갈라진다. 원본 SP 의 UNION ALL 은 구매·환불이 한
  테이블이라 통째로 사라졌다.
- ⚠️ **순금액은 `NET_AMT_SQL`(= `amount − coupon_discount`) 로만 계산한다**(`statements.ts`).
  쿠폰을 빼지 않으면 평균단가가 과대 계상된다 — 실측으로 쿠폰 96,000원만큼 어긋나 개당
  8,000원(정가 39,990 → 실효 31,990)이 부풀었다. 영수증의 네 번째 검산과 같은 식이고,
  `npm run check` 가 "순금액 = 헤더 합계"로 검증한다.
- 평균단가는 **구매 − 환불**까지만이다. **오픈마켓 판매(배송완료) 수량은 아직 빠지지 않는다** —
  "남은 재고의 평균단가"를 완성하려면 주문 연동이 필요하다. 화면에도 그렇게 적어 뒀다.

**아직 이식하지 않은 것**: 없음 (영수증 화면 3종 모두 이식).

### 실매입 평균단가 — `cost-basis.ts` → `/pricing`

**판매가 계산의 원가 기준으로 `master_price.original_price`(정상가) 대신 영수증의 실매입
평균단가를 쓸 수 있다.** `/pricing` 에 상품코드를 넣으면 그쪽이 이긴다.

정상가를 쓰면 두 가지가 어긋난다:
① 정상가는 **내가 낸 값이 아니다** — 행사·쿠폰으로 더 싸게 샀을 수 있다.
② 단가 상품(KG당단가)의 정상가에는 단가와 박스값이 섞여 있어 믿을 수 없다.

실측 차이가 크다 — 프로쉬세탁세제는 정가 39,990 이지만 쿠폰 반영 실매입가가 31,990 이다.
정가로 계산하면 판매가 55,800, 실매입가로 계산하면 **47,400** 이다(같은 순이익 1만원 기준).
8,400원 차이는 그대로 경쟁력이다.

평균단가는 `NET_AMT_SQL ÷ 순수량`이고 **구매 − 환불**까지다. 오픈마켓 판매분은 아직 빠지지
않는다 — 주문 연동이 붙으면 "남은 재고의 평균단가"가 된다.

### 차액환불 후보 — `price-adjustment.ts` · `/price-adjustment`

화면 이름은 **차액환불 후보**다(의뢰인 요청, 2026-10-06). 경로·모듈명은 `price-adjustment`
그대로 둔다 — 이름 때문에 URL 과 파일을 흔들면 링크와 기록이 끊긴다.

산 값보다 지금이 싼 구매 건을 찾아, 코스트코 고객센터에서 필요한 정보를 같이 보여준다.

⚠️ **한국은 미국식 가격조정(차액 환불) 제도가 없다. 환불 정책을 활용한다** — 할인 중인 새
상품을 결제하고 과거 비싸게 산 건을 반품 처리한다. 그래서:
- **기본은 기간 제한이 없다.** 코스트코 100% 만족 보장이 대부분의 상품을 기간·사유 제한 없이
  환불해 준다. `windowDays` 는 **선택**이고 생략하면 전체 기간이다. '구매일 + 30일' 은 미국
  제도이고 한국에 없다 — 한때 그걸 기본값으로 박았던 것은 틀렸다.
- 기간·가능 여부가 갈리는 품목은 이렇다. **아직 자동 판정하지 않는다**(품목 분류 미정) —
  화면에 안내로만 적어 두고 걸러내지 않는다. 잘못 걸러내면 회수할 돈이 사라진다.
  · **90일** 전자제품·대형가전(TV·컴퓨터·스마트폰·카메라·에어컨·세탁기·건조기 등)
  · **유통기한 내** 음식류
  · **환불 불가** 담배·주류·이벤트 티켓·귀금속·상품권·맞춤 제작
  `master_product.category` 는 31%(3,972건)가 비어 있고 `음료/주류/커피` 처럼 가능·불가가
  섞인 분류도 있어 카테고리만으로는 판정이 안 된다.
- 카운터에 필요한 것은 **회원카드와 그때 결제한 카드**이고 실물 영수증은 필요 없다.
  그래서 `member_no` · `card_number_masked` · `approval_no` 를 띄운다 — 마스킹본으로 충분하다
  (실물 카드를 들고 가므로 어느 카드인지만 알면 된다).
- 비교 단가는 **쿠폰을 뺀 실지불 단가**(`NET_AMT_SQL ÷ qty`)다. 정가로 비교하면 차액이
  과대 계산된다(실측: 4,000원이 12,000원으로).

**임계값은 판매자별 설정**(`price_adjust_setting`, `adjust-setting.ts`)에서 온다. 쿼리스트링이
있으면 그것이 이기고, 없으면 저장된 기본값을 쓴다. "기본값으로 저장" 은 서버 액션
(`actions.ts`)이고 **자바스크립트 없이 POST 로 동작**하므로 이 화면의 무-JS 원칙이 유지된다.

`min_diff_total` 기본 **5,000원**은 실데이터 109건 분포에서 고른 값이다 — 건수가 109 → 47 로
절반 이하가 되는데 **금액은 88% 가 남는다**(1만원은 금액 21% 를 버리고, 0원은 몇천 원짜리가
목록을 덮는다). `window_days` 기본은 **null = 제한 없음**이다.
- 이미 반품한 구매는 제외한다 — 환불 영수증의 `original_approval_no` 가 그 구매를 가리킨다.

### 행사가 — `sql/010_master_sale.sql` · `sync-master.mjs`

`master_price` 에 `sale_price`·`discount_amount`·`sale_start_date`·`sale_end_date` 를 둔다.
원천은 `TB_retail_price_history` 이고 정본 로직은 merrycoco 의 `FN_retail_price_now` 다.

⚠️ **그 함수의 가드를 그대로 옮겼다. 전부 실제 사고에서 나온 것이다:**
① `current_price = 0` 제외 — 수집이 절대가를 못 읽어 0 을 넣은 행사 행이 있다. 뽑히면
   0 원으로 노출되고 주문 금액이 0 으로 굳는다(실발생: 79,984원이 공짜로 합산). 빼면
   "행사 없음"으로 떨어져 정가가 보인다 — 0 원보다 안전하다.
② `ended_early_date IS NOT NULL` 제외 — 기간이 남았는데 할인을 내린 경우.
③ 오늘이 `sale_start_date ~ sale_end_date` 안인 행만.
④ 행사 행이 여럿이면 `sale_start_date DESC, seq DESC` 로 하나만.
⑤ 단가 상품(`TB_retail_unit_price` 에 행이 있는 것) 제외 — 그 금액에 단가와 박스값이 섞여 있다.

**행사가는 증분이 아니라 매번 전체를 다시 계산한다.** 증분으로는 "오늘부터 행사 아님"을
감지할 수 없다(원천 행이 바뀌지 않는다). 끝난 행사는 먼저 비운다.

⚠️ **이력은 seller-hub 에 쌓지 않는다.** 원천이 이력 테이블을 들고 있어 다시 받으면 복구된다.
(앞서 "지금부터 쌓지 않으면 복구 못 한다"고 적은 것은 틀렸다.)

## 네이버 커머스 API — `src/lib/naver/auth.ts`

`docs/naver/SPEC.md` 가 구현 규격이다. 상품등록 필수 필드, 요청량 제한, 수수료 구조가 정리돼 있다.

- **전자서명**: `client_secret` 을 bcrypt salt 로 써서 `{clientId}_{timestamp}` 를 해시 → base64.
  공식 문서의 검증 벡터가 `auth.test.ts` 에 있다.
- **토큰 캐시 키는 `channelAccountId`** 다. 판매자별로 따로 캐시해야 남의 토큰을 쓰지 않는다.
- **요청량 제한은 측정값 초당 2건**(버스트 4). 반복 호출에는 600ms 간격을 둔다.
  `rateState(res)` 로 `GNCP-GW-RateLimit-*` 헤더를 읽는다.
- **호출 IP 를 마켓에 등록해야 한다.** `GW.IP_NOT_ALLOWED` 가 나오면 공인 IP 가 바뀐 것이다.
- 401 + `GW.AUTHN` 이면 토큰을 재발급해 1회 재시도한다 (구현돼 있음).
- **샌드박스가 없다.** 모든 테스트가 실제 스토어에 찍힌다. 등록 자동화는 등록 직후 판매중지를
  같은 job 안에서 처리한다.
- **상품 이미지는 외부 URL 을 받지 않는다.** `POST /v1/product-images/upload` 가 돌려준 URL 만
  쓸 수 있다(문서가 7개 엔드포인트에서 반복 명시). `detailContent` 는 제약 문구가 없으나 미검증.

### API 문서는 `docs/naver/llms/` 가 정본

`docs/naver/pages/` (sitemap 스크랩 148건)에는 **정산 그룹 전체가 빠져 있었다.**
`docs/naver/llms/` (117건)가 전체 엔드포인트를 담고 요청·응답 스키마가 표로 정리돼 있다.
API 스펙을 찾을 때 이쪽을 먼저 본다. `pages/` 는 solution-doc·가이드처럼 llms 에 없는 문서용.
`python3 scripts/fetch-naver-docs.py --llms` 로 재현한다.

## 용어·명명

- **`정상가`** 를 쓴다. `원가` 가 아니다 (`order_item.normal_price`).
- **브랜드명을 DB 스키마·API 경로·컴포넌트 이름에 쓰지 않는다.** 서비스명은
  **Merrycoco Lab**(화면 표기) · 메리코코 랩(구두 호칭), 공개 주소는 **`lab.merrycoco.co.kr`** 이고, 코드에서
  브랜드가 박히는 지점은 **`src/lib/brand.ts` 하나**다 (`APP_NAME`·`APP_URL`·`APP_TAGLINE`,
  값은 `.env` 세 줄). 저장소 이름 `seller-hub` 는 개발 단계 코드명이다.
- **이 사이트가 하는 일은 `APP_TAGLINE` 이 정본이다** — *마진 계산 · 판매 데이터 분석 ·
  원가 연구*. 상품등록 대행이 아니라 **판매자가 자기 숫자를 파악하게 돕는** 쪽이다.
  화면 문구를 쓸 때 이 범위를 벗어나지 않는다.
- 주석·문서·테스트명은 한국어로 쓴다 (기존 코드가 전부 그렇다).

## 스냅샷 원칙

주문 시점의 정상가·수수료·카테고리, 발송 시점의 실제 비용을 각각 남긴다
(`order_item.normal_price`/`fee_amount`/`category`, `shipment.billed_cost`).
지난 값은 재구성할 수 없기 때문이다 — 마켓 요율도 정상가도 바뀐다.

마켓 응답 원본(`raw_json`)도 보관한다. API 변경·장애 추적용.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
