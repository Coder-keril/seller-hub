# SellerHub

메리코코 소매 상품 데이터를 마스터로 삼아, 여러 판매자가 각자의 오픈마켓 계정에
상품을 등록하고 주문·배송·CS 를 한 곳에서 처리하는 Multi-Tenant 커머스 운영 플랫폼.

`SellerHub` 는 개발 단계 코드명이다. 화면 표시명은 `APP_NAME` 환경변수로 분리했고,
DB 스키마와 모듈명에는 브랜드명을 쓰지 않는다.

## 구조

```
사내 개발머신        merrycoco MSSQL ──cron──> upsert ──> Supabase
                     (이지오피스 GCP 그룹 안에서만 접속 가능)

GCP VM (고정 IP)     ★ 이 IP 를 각 마켓 API 에 등록한다
  ├ Next.js          판매자 웹 UI + API
  └ 폴링             주문·문의 수집, 상품등록, 송장전송
                     (cron → /api/jobs/tick. 상시 워커는 필요해질 때)

Supabase (서울)      Postgres — 전 고객 단일 DB + tenant_id

Cloudflare R2        AI 가공 이미지 (원본은 메리코코 버킷 참조)
```

**서버는 고객 수와 무관하게 1대다.** 고객은 `tenant_id` 로 나뉜다. 고객 1명이 쓰는 자원은
서버 용량의 1~2% 라 100명까지 1대로 간다. 늘릴 때도 고객별이 아니라 역할별로 나눈다
(웹 / 폴링). 폴링을 N대로 늘려도 `job` 테이블의 `FOR UPDATE SKIP LOCKED` 가 중복을 막는다.

**설치형(고객 PC)으로 가지 않는다.** 고객 PC 가 꺼지면 주문 수집이 멈춰서 신규주문 알림이라는
핵심 가치가 원리적으로 성립하지 않는다. 유동 IP 면 마켓 API 의 IP 등록도 불가능하다.

마켓 API 가 호출자 IP 등록을 요구할 수 있어서 서버리스(Cloudflare Workers)로는 갈 수 없다.
Workers 는 공유 IP 풀에서 나가고 egress IP 고정은 Enterprise 전용이다.

## DB

**Supabase 서울 리전. Free 로 시작해 외부 판매자가 붙는 시점에 Pro 로 올린다.**
전환 기준은 용량이 아니라 **자동백업이 필요해지는 시점**이다.

Free 기간의 제약과 대응:

| | |
|---|---|
| 자동백업 없음 | 첫 주문이 수집되기 전에 `pg_dump` → R2 cron 을 만든다. 그전까지 DB 에는 MSSQL 에서 다시 만들 수 있는 마스터 데이터뿐이다 |
| 7일 비활성 시 일시정지 | 폴링이 5분마다 도니 발생하지 않는다 |
| DB 500MB | 주문 `raw_json` 이 가장 크다. 90일 경과분을 비우는 정책을 주문 수집과 함께 넣는다 |
| 커넥션 한계 | **Session pooler(5432)로 접속한다.** Direct 는 IPv6 전용이고 커넥션 수도 적다 |

Pro 는 $25 에 기본 컴퓨트가 Micro(1GB)다. 고객이 늘면 컴퓨트 애드온이 따로 붙는다 —
$25 에서 끝나지 않는다.

접속 문자열에 `?sslmode=require&uselibpqcompat=true` 를 붙인다. `pg` 최신 버전은
`sslmode=require` 를 `verify-full` 로 해석해서 Supabase pooler 인증서에 걸린다.

## 마스터 데이터

원천은 `merrycoco_web` (MSSQL). SellerHub 에서는 **읽기 전용**이고 쓰기는 동기화 스크립트만 한다.

| SellerHub | 원천 | 비고 |
|---|---|---|
| `master_product` | `TB_retail_products` | 키가 `(retailer, product_code)` 복합 → `'costco:123'` 으로 합성 |
| `master_price` | `TB_retail_price` | 채널별 다중 (매장가/온라인가) |
| `master_image` | `TB_retail_image_product` | `filename` 만 있음. URL = `MASTER_IMAGE_BASE_URL` + filename |

`name` / `category` 는 검수된 `*_override` 를 우선한다.

알아둘 것:
- **이미지 보유 상품은 약 3,470 / 14,750건 (23%)** — 마켓에 올릴 수 있는 실질 상한이다
- **바코드는 약 26%** 만 채워진다 (`TB_shop_sku` 경유 조인)
- **브랜드 컬럼은 원천에 없다**

## 명령어

```bash
npm run check       # 스키마 + upsert 검증 (WASM Postgres, 설치 불필요)
npm run sync        # 마스터 증분 동기화 — 사내 개발머신 cron 용
npm run sync:full   # 커서 무시하고 전체 재적재
npm run images      # 배경제거 → 공개 버킷 푸시 — SellerHub 머신
npm run images:dry  # 대기 목록만 확인
```

`npm run check` 는 DB 없이 돈다. 스키마를 고치면 이것부터 통과시킨다.

배경제거에는 rembg 가 필요하다.

```bash
python3 -m venv .venv && .venv/bin/pip install "rembg[cli]" onnxruntime
```

**모델은 `u2net`(Apache-2.0)으로 고정한다.** rembg 의 기본 모델 `bria-rmbg` 는
비상업용 라이선스라 판매 플랫폼에 쓸 수 없다. `push-images.mjs` 가 `-m u2net` 을 강제한다.

## 이미지

마켓 상품등록 API 는 이미지 URL 을 직접 가져간다. 메리코코 R2 는 비공개이고 공개되는 건
워터마크본뿐이라 판매용으로 쓸 수 없다. 그래서 원본에 배경제거를 1회 적용해
SellerHub 공개 버킷으로 푸시하고, 그 URL 을 마켓에 넘긴다.

```
메리코코 R2 (비공개)  {retailer}/products/original/{code}/{ts}.jpg
      ↓  배경제거 1회 (rembg, 판매자 수와 무관)
SellerHub R2 (공개)   master/{retailer}/{code}/{ts}.png
      ↓
master_image.public_url  →  마켓이 직접 가져간다
```

대기열은 따로 없다. `master_image.bg_removed_at is null` 이 그 목록이고,
대표 이미지부터 처리한다. 3회 실패하면 큐에서 빠진다(`bg_attempts`).

R2 는 인터넷 API 라 이지오피스 밖에서도 읽힌다. **이 파이프라인은 SellerHub 머신에서 돌고
이지오피스는 아무 일도 하지 않는다.**

## 설계 원칙

- **마스터와 판매상품을 분리한다.** `master_product` 는 전 테넌트 공유, `channel_product` 는 판매자별
- **모든 테넌트 테이블은 `tenant_id` 를 갖고, 복합 인덱스의 맨 앞에 둔다** — 훗날 파티셔닝 키가 된다
- **중복 수집은 DB 가 막는다.** `unique (channel_account_id, external_order_id)`
- **오래 걸리는 일은 `job` 테이블로.** 워커가 `FOR UPDATE SKIP LOCKED` 로 집어가므로
  워커를 N대로 늘려도 코드를 고치지 않는다
- **마켓 응답 원본(`raw_json`)을 보관한다.** API 변경·장애 추적용

## 확장

단일 DB + `tenant_id` 로 판매자 수백 명까지 간다. 쪼개는 건 계약상 물리 분리 요구,
단일 인스턴스 수직 확장 한계, 리전 분리 — 이 셋 중 하나가 실제로 생길 때만.
테넌트별 스키마 분리는 중간 단계로도 하지 않는다 (마이그레이션 N배, 커넥션 풀 분리).

워커를 2대 이상으로 늘릴 때는 Cloud NAT 로 egress IP 를 1개로 묶는다. 그 전에는 불필요.
