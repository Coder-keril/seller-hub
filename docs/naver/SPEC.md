# 네이버 커머스API 구현 규격

`docs/naver/pages/` 원문에서 추린 구현에 필요한 내용. 원문은 2026-09-30 수집, 문서 버전 2.89.0.

---

## 1. 인증

```
Token URL   POST https://api.commerce.naver.com/external/v1/oauth2/token
Content-Type  application/x-www-form-urlencoded
방식        OAuth2 Client Credentials Grant
호출 헤더    Authorization: Bearer {인증 토큰}
TLS         1.2 이상
```

### 전자서명

클라이언트 시크릿을 직접 보내지 않고 서명을 만들어 보낸다.

```
password  = `${client_id}_${timestamp}`        timestamp = 밀리초 Unix 시간
hashed    = bcrypt.hashpw(password, client_secret)   ← client_secret 이 salt ($2a$10$… 형식)
signature = base64(hashed)
```

Node 예시(공식): `bcrypt.hashSync(password, clientSecret)` → `Buffer.from(hashed,"utf-8").toString("base64")`

**주의**: 공식 문서 안에서 Java 예시는 `Base64.getUrlEncoder()`(URL-safe)를, Node·Python 예시는 표준
base64 를 쓴다. 예시 결과가 같게 나온 것은 해시에 `+/` 가 없었던 우연이다. 표준 base64 로 구현하고
`GW.AUTHN` 이 계속 나오면 URL-safe 를 시험한다.

### 요청 본문

| type | body |
|---|---|
| `SELF` | `client_id=&timestamp=&client_secret_sign=&grant_type=client_credentials&type=SELF` |
| `SELLER` | 위와 같고 `&type=SELLER&account_id={판매자 UID}` 추가 |

### 토큰 유형과 권한

| type | 접근 대상 | 쓰는 API |
|---|---|---|
| `SELF` | 솔루션사 시스템 | JWE 해석, 사용 승인, 사용 해지 승인 |
| `SELLER` | **구독 판매자의 스마트스토어** | 상품 관리, 주문 수집·처리, 판매자 주소록 |

내스토어 애플리케이션은 `SELF` 만 가능하다.

### 토큰 수명 — 캐시 전략에 직결

- **기본 유효 180분**
- **남은 유효 시간이 30분 미만일 때 새 토큰 발급 가능** → 그전에 재발급 요청해도 새 토큰을 안 준다
- 기존 토큰은 만료 전까지 계속 유효
- **`SELLER` 토큰은 `account_id` 별로 별도 유효 시간** → 판매자별로 캐시해야 한다

구현: 토큰을 `(type, account_id)` 키로 캐시하고 만료 30분 전부터 갱신을 시도한다.

### 실패 재시도

`401` + body `code == "GW.AUTHN"` → 토큰 재발급 후 1회 재시도 (공식 권고).

---

## 2. 요청량 제한

두 종류가 따로 걸린다. **둘 다 429 를 준다.**

| | 단위 | 오류 코드 |
|---|---|---|
| Rate Limit | 개별 API × **인증된 애플리케이션** (Token bucket) | `GW.RATE_LIMIT` |
| Quota Limit | 커머스솔루션 구독 판매자 리소스 호출 시 **1초** | `GW.QUOTA_LIMIT` |

응답 헤더로 현재 상태를 알려준다.

```
GNCP-GW-RateLimit-Replenish-Rate   초당 최대 동시 요청 수
GNCP-GW-RateLimit-Burst-Capacity   버스트 상한 (제한값의 2배)
GNCP-GW-RateLimit-Remaining        남은 수
GNCP-GW-Quota-Period               SECONDS | ROUND
GNCP-GW-Quota-Limit / -Remaining
```

> "요청량 제한은 … 유동적이며, 일부 개발사에 예외로 완화해 드릴 수 없습니다."

**고정값을 코드에 박지 않는다.** 응답 헤더의 `Remaining` 을 보고 워커가 스스로 속도를 낮춘다.
버스트를 쓰면 다음 1초 가용량이 줄어드니 평시에는 버스트를 피한다.

### API 그룹 권한

애플리케이션 등록·수정 시 **'API 그룹'** 을 설정해야 그 그룹의 API 를 호출할 수 있다.
상품·주문·배송 그룹을 신청 시점에 빠뜨리지 않는다.

---

## 3. 커머스솔루션 구독 연동

### 두 가지 유형 — '바로 사용' 을 택한다

| | 흐름 | 판매자 식별 | 네이버 제시 공수 |
|---|---|---|---|
| **바로 사용** | 구독 즉시 사용 | **JWT** (GET 파라미터) | **5MD** |
| 심사 후 승인 | 신청 → 개발사 승인 | JWE + 커머스ID 인증 | 20MD |

> "'바로 사용'형 솔루션이 약 70~80% 가량의 소요 기간 단축을 기대할 수 있습니다."

SellerHub 는 판매자를 심사할 이유가 없으므로 **'바로 사용' 유형**이 맞다.

### JWT — tenant 자동 생성에 필요한 정보가 전부 들어 있다

판매자가 마켓 또는 스마트스토어센터 솔루션목록에서 `[신청하기]`·`[사용하기]` 를 누르면
솔루션 페이지로 이동하며 JWT 가 HTTP GET 파라미터로 전달된다. **누를 때마다 새로 생성된다.**

```
iss  "merc"           고정
sub  "SELLER_INFO"    고정
iat / exp             통상 60초 유효
alg                   RS256

accountUid            ★ 스마트스토어 계정 UID — SELLER 토큰의 account_id 가 이 값이다
roleGroupType         REPRESENT(통합) | MANAGER_GORUP(그룹) | ACCOUNT(주) | ACCOUNT_SUB(부)
                      ※ ACCOUNT_SUB 는 커머스솔루션 구독/사용 불가
solutionId            우리 솔루션 ID 인지 검증할 값
channelName           스토어 이름(대표 채널명)
defaultChannelNo      대표 채널 번호
type                  STOREFARM | WINDOW
url                   대표 채널 스토어 URL
representImageUrl     없으면 null
categoryId            대표 판매 카테고리
representType         DOMESTIC_PERSONAL | DOMESTIC_BUSINESS | OVERSEAS_PERSONAL | OVERSEAS_BUSINESS
businessType          CORPORATION | PRIVATE | SIMPLE   (국내 사업자만)
businessRegisterationNumber   사업자 번호 (국내 사업자만) ※ 원문 필드명 오타 그대로
actionGrade           ZERO(플래티넘) FIRST(프리미엄) SECOND(빅파워) THIRD(파워) FOURTH(새싹) FIFTH(씨앗)
planId                구독중일 때만
subscriptionId        사용 신청~해지 라이프사이클 ID. 해지 후 재사용 시 다른 값
round                 현재 회차 (무료 회차는 0)
roundEndDate          회차 종료일 (밀리초 13자리)
downgradeTargetRound / downgradePlanId   다운그레이드 예약 시만
status                구독 상태 (아래 표)
```

**카카오 로그인 없이 온보딩이 끝난다.** `accountUid` 로 tenant 를 만들고 그 값으로 `SELLER` 토큰을
받으면 된다.

### JWT 검증 3가지 — 전부 필수

1. **솔루션 공개키로 서명 검증** (RS256). 공개키는 솔루션별로 다르다
2. `iat` ≤ 수신시각 ≤ `exp` (기본 60초). 서버 시각을 NTP 로 동기화해둔다
3. `solutionId` 가 우리 솔루션인지 확인. 운영중이 아닌 ID 면 무효

**하나라도 실패하면 즉시 이 URL 로 리다이렉트해야 한다** (문서 요구사항):

```
https://solution.smartstore.naver.com/ko/error
```

### 구독 상태 — 스키마에 필요하다

| 상태 | 값 | API 호출 |
|---|---|---|
| 미사용 | — | 불가 |
| 구독 대기 | `WAITING_SUBSCRIPTION` | 불가 |
| 구독 취소 | `CANCEL_SUBSCRIPTION` | 불가 |
| **구독중** | `SUBSCRIBING` | **가능** |
| **결제 실패중** | `ON_PAYMENT_FAIL` | **가능** |
| **해지 요청중** | `WAITING_UNSUBSCRIPTION` | **가능** (구독중과 동일) |
| 해지 완료 | `UNSUBSCRIBED` | 불가 |

**결제 실패는 즉시 중단이 아니다.** 다음 회차 시작일 전일 23:30 최종 결제 시도까지 실패하면 해지된다.
그 사이에는 계속 서비스해야 한다.

### 해지 유형 — 사전에 하나를 골라야 한다

| | 동작 | 제약 |
|---|---|---|
| **즉시 해지** | 판매자 요청 즉시 완료. 이벤트훅 수신 후에는 API 조회 불가 | — |
| 조건부 해지 | 우리가 사용 해지 승인 API 를 호출하는 시점에 완료 | **비즈월렛 결제 연동 불가** |

유료 솔루션으로 갈 것이면 **즉시 해지**를 택해야 한다. `사용 중지 환불 API` 는 해지 유형과 무관하게
즉시 해지시키고, 이벤트훅에 `FORCE_UNSUBSCRIPTION` 으로 전달된다.

### 네이버가 제시한 개발 공수

| 항목 | 필수 | 공수 |
|---|---|---|
| 커머스ID 인증 창 구조 (프런트) | 필수 | 5MD |
| 솔루션 애플리케이션 인증 연동 (서버) | 필수 | 5MD |
| 솔루션 전용 API 연동 (JWE해석·사용승인·해지승인) | 필수 | 5MD |
| 이벤트 훅 수신 구조 | 필수 | 5MD |
| 판매자 정보 호출용 커머스API 연동 | 선택 | 예측 불가 |

기존 애플리케이션 연동 이력이 있으면 인증 연동이 5MD → 2MD 로 줄어든다.
**'바로 사용' 유형이면 커머스ID 인증(5MD)과 JWE 관련이 빠져 10MD 안쪽이다.**

### Redirect URL 도메인 규칙 (JWE형 전용)

커머스ID 인증 창을 띄운 URL 과 **동일 도메인이거나 그 하위 서브도메인**이어야 한다.
상위 도메인·다른 도메인은 허용하지 않는다.

---

## 4. 마켓 입점 — 확인된 조건

- 커머스API센터 가입에 **스마트스토어 판매자 계정 필수** (솔루션 테스트용)
- **스마트스토어 사업자 정보와 개발사 사업자 정보가 동일**해야 하고 그 계좌로 정산된다
- **솔루션 마켓 입점 동의는 법인 사업자만 가능**
- 스마트스토어 **통합매니저**만 API센터 계정 생성 가능 (입점동의한 개발사는 `매니저초대` 로 확장 가능)
- 현금영수증 증빙을 위해 **고객센터 전화번호 등록 필수**
- **테스트솔루션은 심사가 없다.** 개발사 판매자 계정에서만 보이고 구독 가능하며,
  비즈월렛 결제도 실제 차감되지 않는다. **HOOK 이벤트 테스트까지 가능하다**
- 심사 반려는 4회까지 재심사, **5회차부터 1개월 심사 제한**
- 승인 후 콘텐츠 수정은 무심사. 다만 주기적 모니터링으로 고지 없이 노출 중지될 수 있다

### ⚠ 입점이 거절되는 대상 — SellerHub 가 걸릴 수 있다

> 아래 기준에 속하는 솔루션 심사 요청 시, **심사는 거절되며 동일한 솔루션 심사 요청은 불가합니다.**

| | 기준 | 설명 |
|---|---|---|
| 1 | 자사몰 관리툴 | 스마트스토어가 아닌 자사몰에 도움이 되는 솔루션 |
| 2 | 스크립트 설치 필요 툴 | 스마트스토어에 스크립트 설치가 필요한 솔루션 |
| **3** | **멀티채널 관리툴** | **스마트스토어의 상품을 외부에 전달/판매하는 솔루션** |
| 4 | MKT 솔루션 | 리뷰 유도 솔루션 등 |
| 5 | 무단 크롤링 API | 네이버 서비스 무단 크롤링 |
| 6 | 확장 프로그램 설치 | 확장 프로그램을 설치해 사용하는 솔루션 |

**3번의 문구는 방향성이 명확하다** — "스마트스토어의 상품을 **외부에** 전달/판매". SellerHub 는
메리코코 상품을 **스마트스토어로 가져오는** 방향이므로 문구 그대로는 해당하지 않는다. 다만 심사에서
서비스 전체를 보고 '멀티채널 관리툴' 로 분류할 위험은 남는다. **거절되면 재신청이 불가하므로**
마켓 콘텐츠에서 타 마켓 연동을 강조하지 않고 스마트스토어 상품 소싱·운영 도구로 포지셔닝해야 한다.

이 정책이 사방넷·이지어드민 같은 멀티채널 툴이 커머스솔루션마켓에 없는 이유를 설명한다.
그들은 API대행사 경로를 쓴다.

---

## 5. 스키마에 반영할 것 (경로 확정 후)

- `channel_account.credential_enc` — 네이버는 판매자 키가 아니라 **`accountUid`** 를 담는다.
  애플리케이션 ID/Secret 은 전역 1개로 `.env` (`NAVER_APP_ID` / `NAVER_APP_SECRET`)
- `tenant` 또는 별도 테이블에 구독 정보 — `accountUid`, `subscriptionId`, `planId`,
  `round`, `roundEndDate`, `status`
- 토큰 캐시 — `(type, account_id)` 키, 만료 30분 전 갱신
- 이벤트훅 수신 엔드포인트와 처리 job

## 6. 상품등록 — 실제 등록된 상품에서 확인한 구조

2026-09-30, 이지오피스 스토어의 기존 상품(`originProductNo: 10277451680`)을
`GET /v2/products/origin-products/{no}` 로 조회해 얻은 실물 구조다. 문서보다 확실하다.

```
originProduct
  statusType "CLOSE" | saleType "NEW"
  leafCategoryId                      ← 리프 카테고리 ID (필수)
  name
  detailContent                       ← 상세설명 HTML
  images.representativeImage.url      ← 대표 이미지 URL (필수)
  images.optionalImages[]
  saleStartDate / saleEndDate / salePrice / stockQuantity
  deliveryInfo
    deliveryType "DIRECT" / deliveryAttributeType "NORMAL"
    deliveryBundleGroupUsable / deliveryBundleGroupId
    deliveryFee.deliveryFeeType "FREE" / baseFee
    claimDeliveryInfo
      returnDeliveryCompanyPriorityType "PRIMARY"
      returnDeliveryFee / exchangeDeliveryFee
      shippingAddressId / returnAddressId      ← 주소록 번호
      freeReturnInsuranceYn
    expectedDeliveryPeriodType "TEN"
  detailAttribute
    afterServiceInfo.afterServiceTelephoneNumber / afterServiceGuideContent
    originAreaInfo.originAreaCode / content / plural   ← 원산지
    optionInfo.optionCombinations[] 등
    taxType "TAX"                                      ← 과세 / 면세
    certificationTargetExcludeContent.kcCertifiedProductExclusionYn "TRUE"
    productInfoProvidedNotice.productInfoProvidedNoticeType "ETC" + etc{}  ← 상품정보제공고시
    minorPurchasable / sellerCommentUsable / customProductYn
    productAttributes[] (attributeSeq / attributeValueSeq)
    seoInfo.sellerTags[]
smartstoreChannelProduct
  storeKeepExclusiveProduct / naverShoppingRegistration / channelProductDisplayStatusType
```

### 마스터 데이터로 채울 수 있는가

| 네이버 필드 | 우리 데이터 | 상태 |
|---|---|---|
| `name` | `master_product.name` | ✅ |
| `salePrice` | Pricing 계산값 | ✅ |
| `deliveryFee` · `returnDeliveryFee` | `price_policy` | ✅ |
| `shippingAddressId` · `returnAddressId` | **주소록에서 확보** (출고지·반품교환지) | ✅ |
| `statusType` · `saleType` · `deliveryType` 등 | 상수 | ✅ |
| `stockQuantity` | 마스터에 재고 없음 → 정책값으로 고정 | ⚠ |
| `afterServiceInfo` | 판매자별 설정 필요 | ⚠ |
| `leafCategoryId` | **카테고리 매핑 필요** (네이버 5,820건) | ❌ |
| `detailContent` | **쓸 수 있는 상세설명 0건** | ❌ |
| `representativeImage.url` | **`public_url` 이 전부 null** (배경제거 미실행) | ❌ |
| `originAreaInfo.originAreaCode` | **원산지 — 마스터에 없음** | ❌ |
| `taxType` | **과세/면세 구분 — 마스터에 없음** (식품에 면세 섞임) | ❌ |
| `productInfoProvidedNotice` | **상품정보제공고시 — 마스터에 없음** | ❌ |

### 새로 드러난 장벽 셋

앞서 알던 상세설명·이미지·카테고리 외에 **세 개가 더 나왔다.**

1. **원산지** (`originAreaCode`) — 마스터에 없다. 코드 목록은
   `get-all-origin-area-list-product` 로 전체 조회 가능
2. **과세/면세** (`taxType`) — 마스터에 없다. 식품은 면세 품목이 섞여 있어 일괄 `TAX` 로
   두면 세금 문제가 된다
3. **상품정보제공고시** (`productInfoProvidedNotice`) — **법정 필수**이고 품목군마다 항목이
   다르다 (식품이면 원재료·용량·보관방법 등). 품목군 목록은
   `get-all-product-info-provided-notice-type-vo-product` 로 조회 가능

**3번이 상세설명보다 까다로울 수 있다.** 상세설명은 템플릿으로 때울 수 있지만 고시정보는
품목군별로 정해진 항목을 채워야 하고 허위 기재는 법적 문제가 된다. 기존 상품은
`productInfoProvidedNoticeType: "ETC"` 로 등록돼 있어 '기타' 품목군으로 우회한 것으로 보인다.
이 방법이 전 품목에 허용되는지 확인이 필요하다.

**KC 인증**은 기존 상품이 `kcCertifiedProductExclusionYn: "TRUE"` 로 '대상 제외' 처리돼 있다.
실제 KC 대상(어린이제품·전기용품)에 이를 적용하면 안 되므로 품목 판별이 필요하다.

### 확인된 엔드포인트

```
상품 목록 조회      POST /v1/products/search          응답 contents/page/size/totalElements
원상품 조회         GET  /v2/products/origin-products/{originProductNo}
상품 등록           POST /v2/products
상품 이미지 등록    POST /v1/product-images/upload
전체 카테고리       GET  /v1/categories               5,820건 확인
주소록 목록         GET  /v1/seller/addressbooks-for-page
상품 문의 목록      GET  /v1/contents/qnas            ※ fromDate 필수
고객 문의 조회      GET  /v1/pay-user/inquiries
주문 변경내역 조회  GET  /v1/pay-order/seller/product-orders/last-changed-statuses
```

### 주문 폴링 API 규격

```
GET /v1/pay-order/seller/product-orders/last-changed-statuses
  lastChangedFrom   필수. 변경 일시 기준
  lastChangedTo     생략 시 from + 24시간
  limitCount        기본·최대 300
  moreSequence      이어받기용
정렬  변경일시 오름차순, 같으면 상품주문번호 오름차순
페이징 응답 more.moreFrom → 다음 lastChangedFrom, more.moreSequence → 다음 moreSequence
       300건 이하면 more 객체 없음
0건일 때는 data 필드 자체가 없다 (timestamp/traceId 만)
```

`channel_account.order_cursor` 를 `lastChangedFrom` 으로 쓰면 그대로 맞는다.

### 실측 Rate Limit

```
GNCP-GW-RateLimit-Replenish-Rate: 2      초당 2건, 버스트 4건
GNCP-GW-Quota-*                          SELF 경로에는 미적용 (null)
```

문서에 숫자가 없어 실호출로 확인한 값이다. 판매자 1명에게는 넉넉하지만(시간당 7,200건)
대행사·솔루션 경로에서는 애플리케이션 1개의 한도를 전 판매자가 나눠 쓴다.

## 7. 상품등록 실전 — P1 에서 확인한 것

2026-09-30, 실제로 상품 1건을 등록해 필수 필드를 확정했다. 여섯 번의 400 응답이 알려준 내용이다.

**등록 결과**: 원상품 `13721295767` / 채널상품 `13782330568`
포카리스웨트 이온음료 240MLX30CAN · 36,300원 · `식품>음료>청량/탄산음료>이온음료`(50002256)

### 문서에 없던 발견 다섯

| | 내용 |
|---|---|
| **택배사 필수** | `deliveryInfo.deliveryCompany` — 택배·소포·등기 상품은 필수. 없으면 `NotValid.product.deliveryType.deliveryCompany` |
| **롯데택배 = `HYUNDAI`** | 구 현대택배 레거시 코드. `LOTTE` 는 `TypeMismatch` 로 거부된다. 코드 목록은 문서 추출에서 빠져 실호출로 확인했다 |
| **배송비 결제방식 필수** | `deliveryFee.deliveryFeePayType` — `PREPAID`(선결제) / `COLLECT`(착불) / `COLLECT_OR_PREPAID` |
| **가격표시제 단위가격** | `detailAttribute.unitCapacity` — 식품·생활용품 다수가 대상. 누락 시 "가격표시제 대상 품목입니다" |
| **WebP 불가** | 이미지는 JPEG·JPG·GIF·PNG·BMP 만. 코스트코 원본이 WebP 라 변환이 필요하다 |

### ⚠ 등록 요청의 일부 값이 무시된다

**요청한 대로 됐다고 가정하면 안 된다. 등록 후 조회해서 실제 값을 확인해야 한다.**

| 보낸 값 | 실제 저장된 값 |
|---|---|
| `statusType: "SUSPENSION"` | **`SALE`** — 등록 후 별도로 상태를 바꿔야 한다 |
| `naverShoppingRegistration: true` | **`false`** |

검수 전 상품이 바로 판매중으로 노출되므로, 자동화에서는 **등록 직후 판매중지로 전환**하는 단계가 필요하다.

```
PUT /v1/products/origin-products/{originProductNo}/change-status
{"statusType": "SUSPENSION"}        → 응답 {"data": true}
SALE(판매중) | SUSPENSION(판매중지) | CLOSE(판매종료) | OUTOFSTOCK(품절)
```

원상품 `statusType` 과 채널상품 `channelProductDisplayStatusType` 은 별개다. 후자가 `ON` 이어도
`statusType` 이 `SUSPENSION` 이면 판매 화면에 노출되지 않는다.

### 통과가 확인된 우회들

| | 값 | 효과 |
|---|---|---|
| 고시정보 | `ETC` + 텍스트 필드에 `"상품상세참조"` | 품목군별 18개 항목을 채우지 않아도 통과. 실제 정보는 상세의 품목보고정보 사진으로 제공 |
| 원산지 | `originAreaCode: "03"` (상세설명에 표시) | 원산지 코드 매핑이 불필요 |
| KC 인증 | `kcCertifiedProductExclusionYn: "TRUE"` | 대상 제외. 실제 KC 대상(어린이제품·전기용품)에는 쓰면 안 된다 |
| 대표이미지 | `POST /v1/product-images/upload` (multipart, 필드명 **`imageFiles`**) | **공개 버킷이 불필요하다.** 파일을 직접 올려 네이버 CDN URL 을 받는다 |

이미지는 등록 시 1회만 가져가고 이후 트래픽은 네이버가 부담한다 (URL 이 `shop-phinf.pstatic.net`).

### 단위가격 — 원천 규격을 쓴다

가격표시제 대상은 `unitCapacity` 가 필수다.

```
unitCapacity: {
  unitPriceYn: true,
  totalCapacityValue: 7200,   총 용량 (0.001 ~ 999999999.000)
  unitCapacity: 100,          표시 기준 (1 ~ 999)
  indicationUnit: "ml",       g kg ml L cm m 개 개입 매 매입 정 캡슐 구미 포 구
}
```

`unitPriceYn: false` 면 나머지 셋을 **입력할 수 없다** (넣으면 오류).

원천 `TB_retail_products` 의 규격 컬럼이 판매가능 3,133건 중 **1,756건(56%)** 에 채워져 있어
그것을 먼저 쓴다. 단위 체계가 단순해 매핑이 거의 없다.

| 원천 `unit_type` | 건수 | 네이버 `indicationUnit` | 표시 기준 |
|---|---|---|---|
| `g` | 3,813 | `g` | 100 |
| `ml` | 2,025 | `ml` | 100 |
| `ea` | 1,779 | **`개`** | 1 |
| `m` | 145 | `m` | 1 |

**나머지 1,377건은 상품명 파싱이 보조로 들어간다** (`240MLX30CAN` → 7,200ml). 상품명 형식이
제각각이라 오인식 위험이 있으므로 검수 지점이다. **merrycoco-admin 에서 원천 규격을 채우면
SellerHub 는 자동으로 따라온다** — 파서에 의존하는 것보다 안전하다.

### 실측 요청량 제한

```
GNCP-GW-RateLimit-Replenish-Rate: 2      초당 2건, 버스트 4건
GNCP-GW-Quota-*                          SELF 경로에는 미적용 (null)
```

### 확인된 엔드포인트 (실호출)

```
토큰 발급          POST /v1/oauth2/token
상품 등록          POST /v2/products
원상품 조회        GET  /v2/products/origin-products/{no}
채널상품 조회      GET  /v2/products/channel-products/{no}
판매 상태 변경     PUT  /v1/products/origin-products/{no}/change-status
상품 목록          POST /v1/products/search          응답 contents/page/size/totalElements
이미지 업로드      POST /v1/product-images/upload    multipart, 필드명 imageFiles
전체 카테고리      GET  /v1/categories               5,820건 (리프 5,002)
원산지 코드        GET  /v1/product-origin-areas     535건 (3레벨)
고시 품목군 목록   GET  /v1/products-for-provided-notice           36건
고시 품목군 상세   GET  /v1/products-for-provided-notice/{type}    필드 목록
반품 택배사        GET  /v2/product-delivery-info/return-delivery-companies  판매자 설정값만
주소록 목록        GET  /v1/seller/addressbooks-for-page
주문 변경내역      GET  /v1/pay-order/seller/product-orders/last-changed-statuses
상품문의 목록      GET  /v1/contents/qnas            ※ fromDate 필수
고객문의 조회      GET  /v1/pay-user/inquiries
```

### 고시 품목군별 항목 수 (참고)

| 품목군 | 항목 | 요구 내용 |
|---|---|---|
| `GENERAL_FOOD` 가공식품 | **18** | 원재료명·함량, 유통기한, 소비기한, 영양성분, 식품유형, 생산자, 소재지 … |
| `KITCHEN_UTENSILS` 주방용품 | 12 | 재질, 구성품, 크기, 출시연월, 제조국 … |
| `WEAR` 의류 | 9 | 소재 혼용율, 색상, 치수, 세탁방법, 제조연월 … |
| **`ETC` 기타 재화** | **6** | 품명, 모델명, 인증사항, 제조자, A/S 책임자, 상담전화 |

`ETC` 는 조회된 6개 외에 `returnCostReason`·`noRefundReason`·`qualityAssuranceStandard`·
`compensationProcedure`·`troubleShootingContents` 5개를 더 받는다(`"1"` = 관련법·소비자분쟁해결기준에
따름으로 보인다). 조회 API 가 알려주는 목록이 전부가 아니다.

### 남은 작업

- **카테고리 매핑** — 마스터 100종 → 네이버 리프 5,002. `category_map` 테이블 준비됨
- **상세설명 템플릿** — 대표이미지 + 품목보고정보 사진 + 규격표
- **면세 품목 판별** — `taxType` 을 일괄 `TAX` 로 두면 식품 면세 품목에서 문제가 된다
- 네이버 수수료표 확정 — 현재 실효 6.31% 는 추정값

## 8. 수수료 — 등급은 조회가 아니라 실측이다

### 결론: 요율·등급을 주는 API 는 없다 (문서 117건 전수 확인)

`docs/naver/llms/` 117개 엔드포인트 문서에 `commissionRate`·`수수료율`·`과금 기준`
필드가 **0건**이다. 정산 그룹 5개 엔드포인트도 전부 **금액**만 준다.

| 엔드포인트 | 주는 것 |
|---|---|
| `GET /v1/pay-settle/settle/commission-details` | 건별 수수료 **금액** + 기준금액 |
| `GET /v1/pay-settle/settle/case` | 건별 정산 원장 |
| `GET /v1/pay-settle/settle/daily` | 일별 정산 합계 |
| `GET /v1/pay-settle/vat/{case,daily}` | 부가세 내역 |

스마트스토어센터 > 정산관리 > 정산내역 의 「수수료 과금 기준」 화면값
(예: `영세 3억 / Npay 수수료 1.947%`)은 **어느 API 에도 없다. 수기 입력이 필요하다.**

### 등급 조회 API 는 없다

`GET /v1/seller/account` 가 `grade` 를 주지만 이것은 **스토어 등급**이고 수수료와 무관하다.

```
{ "accountId": "ncp_1ovkr2_01", "accountUid": "ncp_2wVNCK4Ckpq8ANjSTvyzG", "grade": "05" }
```

| 코드 | 등급 | solution-doc 의 actionGrade |
|---|---|---|
| 00 | 플래티넘 | ZERO |
| 01 | 프리미엄 | FIRST |
| 02 | 빅파워 | SECOND |
| 03 | 파워 | THIRD |
| 04 | 새싹 | FOURTH |
| 05 | 씨앗 | FIFTH |

수수료 등급(영세/중소1~3/일반)은 **국세청 신고 연매출** 기준이라 축이 다르다.
씨앗 등급 스토어가 일반 등급 수수료를 낼 수 있다 — 연매출은 회사 전체 기준이고
네이버 판매 실적과 무관하다. 어느 API 도 이 등급을 코드로 주지 않는다.

### 대신 정산에서 실효율을 역산한다

`GET /v1/pay-settle/settle/commission-details` 가 정산 건별로 기준금액과 실제 부과액을 준다.
등급을 추정할 필요가 없다 — 실제 부과율이 그대로 나온다.

```
실효율 = Σ commissionAmount / Σ commissionBasisAmount      (실부과액이므로 VAT 포함)
```

| 응답 필드 | 쓰임 |
|---|---|
| `commissionBasisAmount` | 수수료 기준 금액 (분모) |
| `commissionAmount` | 실제 부과 수수료 (분자) |
| `commissionType` | 수수료 항목 — 아래 매핑 |
| `payMeansType` | 결제수단 — 주문관리수수료가 수단별로 다른 것을 확인할 수 있다 |
| `settleType` | `*_CANCEL` 행은 부호가 반대라 제외한다 |
| `productOrderType` | `PROD_ORDER` 만 쓴다 (DELIVERY·EXTRAFEE 는 cost_item 영역) |

`commissionType` → `channel_fee.kind`:

| 네이버 | 우리 | 비고 |
|---|---|---|
| `PAY_COMMISSION` | `PAYMENT` | 네이버페이 주문관리수수료 — **등급이 걸린 항목** |
| `PLATFORM_COMMISSION` | `SALE` | 판매 수수료 |
| `SALE_COMMISSION` | `SALE` | (구)판매 수수료 |
| `SERVICE_COMMISSION`·`PACKAGE_COMMISSION` | `SETTLE` | 솔루션 사용료 |
| `CHNL_COMMISSION`·`INFLOW_COMMISSION`·`PRICE_COMPARISON_COMMISSION` | `OTHER` | |

구현: `scripts/naver-sync-fees.ts`. `--apply` 없이는 계산만 보여준다.
정산 데이터가 없으면 `scripts/seed-fees.ts --grade <등급>` 으로 직접 지정한다.

> **미확인 — 우대 수수료가 환급 방식일 가능성**
> `productOrderType` 에 `PREFERENTIAL_COMMISSION(우대 수수료 환급)` 이 있고
> `settle/daily` 에 `preferentialCommissionAmount(우대 수수료 환급 금액)` 이 있다.
> 영세·중소 우대가 결제 시점엔 일반 요율로 과금되고 국세청 등급 확정 후 차액을
> 환급하는 구조일 수 있다. 그렇다면 `PAY_COMMISSION` 행만 역산하면 3.630% 가 나오고
> 실제(1.947%)보다 과대 계상된다. `naver-sync-fees.ts` 는 환급 행을 함께 합산하지만
> **환급액의 부호는 실주문으로 확인해야 한다.** 첫 주문이 정산되면 반드시 검증할 것.

### 이지오피스 확정값 (2026-10-01, 판매자센터 화면 확인)

```
수수료 과금 기준   영세 3억
Npay 수수료        1.947% (VAT 포함)
판매수수료          3.000% (일반 유입)
실효 합계          4.947%
```

`scripts/seed-fees.ts --grade 영세` 로 반영. 포카리스웨트 판매가 **35,800원**(순이익 10,039원).

> **정밀도** — `channel_fee.rate` 는 `numeric(8,6)` 이다(`sql/008`).
> 처음 `numeric(6,4)` 였을 때 1.947% 가 1.950% 로 잘렸다. 네이버는 소수 3자리(%)로
> 공시하므로 율은 최소 소수 5자리까지 담겨야 한다.

### 공시 요율 (2025-10 개정, 수기 기준값)

주문관리수수료 — 카드 결제 · VAT 포함:

| 등급 | 연매출 | 율 | 판매수수료 3% 합산 |
|---|---|---|---|
| 영세 | ~3억 | 1.947% | 4.947% |
| 중소1 | 3~5억 | 2.563% | 5.563% |
| 중소2 | 5~10억 | 2.728% | 5.728% |
| 중소3 | 10~30억 | 3.003% | 6.003% |
| 일반 | 30억 이상 | 3.630% | 6.630% |

결제수단별로도 다르다 — 계좌이체 1.65% · 가상계좌 1.0% · 휴대폰 3.85% · NPay포인트 3.74%.
등록 시점에 결제수단을 알 수 없으므로 카드 기준을 쓴다.

판매수수료 — 유입 경로별 (VAT 포함):

| | 일반 유입 | 판매자 마케팅 유입 |
|---|---|---|
| 스마트스토어 | 3% (VAT별도 2.73%) | 1% (VAT별도 0.91%) |
| 브랜드스토어 | 4% (VAT별도 3.64%) | 2% (VAT별도 1.82%) |

N배송관·브랜드솔루션패키지는 0%. 등록 시점에 유입 경로를 알 수 없어 일반 유입(3%)으로 잡는다 —
마케팅 링크를 타면 실제 수수료가 낮아지고 그만큼 이익이 늘어난다.

> **주의** — `3% (VAT 별도 2.73%)` 는 3% 가 VAT 포함 값이라는 뜻이다.
> 3% 를 `vat_included=false` 로 넣으면 1.1 이 곱해져 3.30% 가 되어 과대 계상된다.

### 카테고리별 차등은 네이버에 없다

쿠팡은 카테고리별이지만 네이버는 **등급 × 결제수단 × 유입경로**로 갈린다.
`channel_fee.category` 는 쿠팡용으로 남겨 두고 네이버는 `''`(채널 기본) 한 행으로 충분하다.

---

## 9. 문서 수집 — llms.txt 가 정본이다

sitemap 기반 스크랩(`docs/naver/pages/`, 148건)은 **정산 그룹 전체가 빠져 있었다.**
`llms.txt` 인덱스에는 117개 엔드포인트가 모두 있고 요청·응답 스키마가 표로 정리돼 있다.

```
python3 scripts/fetch-naver-docs.py --llms      # docs/naver/llms/ 에 117건
```

API 스펙을 찾을 때는 `docs/naver/llms/` 를 먼저 본다. `docs/naver/pages/` 는
solution-doc·가이드처럼 llms 에 없는 문서용으로만 남긴다.

---

## 10. 아직 안 읽은 문서

| 파일 | 크기 | 무엇 |
|---|---|---|
| `원상품 정보 구조체` | 144K | **상품등록 필수 필드 — 가장 큰 미지수** |
| `상품 주문 정보 구조체` | 114K | 주문 스키마·상태값 |
| `심사 전 체크리스트` | 20K | 심사 준비 항목 |
| `이벤트 훅 연동 요소 가이드` | 12K | 훅 종류와 규격 |
| `솔루션 회차 및 결제 구조` | 5.8K | 요금제·정산 |
