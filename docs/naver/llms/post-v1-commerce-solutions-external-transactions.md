---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/send-transaction-external-merchant
---
# POST /v1/commerce-solutions/external-transactions - 외부 개발사 자체 결제 내역 전송

커머스솔루션마켓 외 자체 결제 채널(PG·자체 빌링 등) 을 사용하는 외부 개발사가 자사 결제·환불 내역을 네이버 커머스 API 센터로 전송할 때 호출하는 API로, 솔루션 사용료 정산과 회차 관리의 외부 소스 데이터를 적재하는 진입점 역할을 합니다. 본문에는 거래 타입(transactionType: PAYMENT/REFUND), 솔루션 ID, 솔루션사 거래 ID(paymentId), 계정 UID, VAT 포함 거래 금액(totalAmount), 결제 완료 일시(paymentConfirmDate), 거래 모델(paymentModel: ONETIME/USAGE/MONTHLY/YEARLY/ETC) 이 필수이고, 결제 수단(paymentMethod)·원거래 ID·회차 정보·요금제 ID·사유 등은 운영 정책에 맞춰 선택적으로 함께 보냅니다. 응답으로 솔루션사 거래 ID(paymentId) 와 커머스 측 거래 ID(transactionId) 가 반환되므로 두 ID 의 매핑을 자사 시스템에 저장해 후속 환불·정산 조회의 추적 키로 사용합니다. REFUND 호출 시에는 originalPaymentId 로 원거래를 명시해 환불 대상이 명확히 식별되도록 하고, 회차성 모델에서는 round·roundStartDate·roundEndDate 를 함께 전달해 회차 경계를 정합니다. 400·404·409 응답은 잘못된 입력값·존재하지 않는 솔루션/구독·중복 거래 등을 의미하므로 정합성 점검 후 재호출하고, 401/403 은 토큰·계정 권한·솔루션 사용 상태를, 402 BIZ_WALLET_USE_ERROR 는 비즈월렛 연계 오류를 점검해 대응합니다. 500·503 은 서버·DB 일시 오류이므로 멱등 키(paymentId) 가 유지된 상태에서 백오프 재시도를 권장합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 본문

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| transactionType | body | string | 필수 | 거래 타입. 허용값: `PAYMENT`, `REFUND` |
| solutionId | body | string | 필수 | 솔루션 ID |
| paymentId | body | string | 필수 | 솔루션사 거래 ID |
| accountUid | body | string | 필수 | 계정 UID |
| totalAmount | body | number | 필수 | 거래 금액(VAT 포함) |
| paymentConfirmDate | body | string(date-time) | 필수 | 결제 완료 일시 |
| paymentModel | body | string | 필수 | 거래 모델. 허용값: `ONETIME`, `USAGE`, `MONTHLY`, `YEARLY`, `ETC` |
| paymentMethod | body | string |  | 거래 결제 수단. 허용값: `CARD`, `DIGITAL`, `CASH`, `ETC` |
| originalPaymentId | body | string |  | 원거래 ID |
| round | body | integer(int32) |  | 현재 회차 |
| roundStartDate | body | string(date-time) |  | 현재 회차 시작일 |
| roundEndDate | body | string(date-time) |  | 현재 회차 종료일 |
| planId | body | string |  | 요금제 ID |
| reason | body | string |  | 사유 |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| paymentId | - | string | 필수 | 솔루션사 거래 ID |
| transactionId | - | string | 필수 | 거래 ID |

### 에러 코드

| 상태 코드 | 설명 |
|-----------|------|
| 400 | ## Bad Request<br>----------<br>\| 코드 \| 설명 \| 비고 \|<br>\| -------- \| --- \| --- \|<br>\| BAD_REQUEST \| 잘못된 요청 \| \|<br>\| NOTTING_TO_CHANGE \| 변경할 사항이 없음 \| \|<br>\| CHANGE_COUNT_LIMIT \| 변경 횟수 초과 \| \|<br>\| NOT_ALLOW_AFTER_UNSUBSCRIPTION \| 해지 후 허락되지 않은 요청 \| \|<br>\| NOT_ALLOW_AFTER_PAYMENT \| 다음 회차 결제 이후 허락되지 않은 요청 \| \|<br>\| INVALID_REQUEST_CONDITION \| 유효하지 않은 조건 \| \|<br>\| INACTIVE_SOLUTION_REQUESTED \| 비정상 상태인 솔루션에 대한 요청 \| \|<br>\| INVALID_SOLUTION \| 유효하지 않은 솔루션에 대한 요청 \| \|<br>\| NOT_SUBSCRIBING \| 사용하지 않는 솔루션에 대한 요청 \| \|<br>\| NOT_ACCOUNT_AUTHENTICATION \| 미인증 계정 \| \|<br>\| INVALID_INPUT \| 유효하지 않은 입력 \| \|<br>---------- |
| 401 | ## Unauthorized<br>----------<br>\| 코드 \| 설명 \| 비고 \|<br>\| -------- \| --- \| --- \|<br>\| INVALID_USER \| 유효하지 않은 사용자 \| \|<br>\| INVALID_SELLER_TOKEN \| 유효하지 않은 SELLER 토큰 \| \|<br>\| EXPIRED_SELLER_TOKEN \| 만료된 SELLER 토큰 \| \|<br>---------- |
| 402 | ## Payment Required<br>----------<br>\| 코드 \| 설명 \| 비고 \|<br>\| -------- \| --- \| --- \|<br>\| BIZ_WALLET_USE_ERROR \| 비즈월렛 오류 \| \|<br>---------- |
| 403 | ## Forbidden<br>----------<br>\| 코드 \| 설명 \| 비고 \|<br>\| -------- \| --- \| --- \|<br>\| ABNORMAL_ACCOUNT_STATUS \| 비정상 계정으로 접근 \| \|<br>\| ACCOUNT_ID_CHANGED \| 요청과 다른 계정으로 접근 \| \|<br>\| SOLUTION_CHANGED \| 유효하지 않은 솔루션 \| \|<br>\| NOT_SUBSCRIBABLE_SOLUTION_TYPE \| 사용 불가능한 솔루션 유형 \| \|<br>\| NOT_AUTHORIZED_ACCOUNT_ROLE \| 인가되지 않은 계정 \| \|<br>\| UNAUTHORIZED \| 인가되지 않음 \| \|<br>\| ONLY_BETA_GRADE_AVAILABLE \| 베타 요금제에서만 가능 \| \|<br>\| JUDGMENT_STATUS_IS_ACQUISITION \| 양도 양수 상태의 계정 \| \|<br>\| REQUEST_SUBSCRIPTION_REQUIRED \| 솔루션 사용 신청 필요 \| \|<br>\| ALREADY_SUBSCRIBING \| 이미 사용 중인 솔루션 \| \|<br>\| NOT_ALLOWED_REFERER \| 유효하지 않은 리퍼러 \| \|<br>\| NOT_ALLOWED_ACCOUNT \| 유효하지 않은 계정 \| \|<br>\| NOT_ALLOWED_BUSINESS_TYPE \| 유효하지 않은 비즈니스 타입 \| \|<br>\| NOT_ALLOWED_BRAND_STORE \| 유효하지 않은 브랜드 스토어 \| \|<br>\| NOT_ALLOWED_REPRESENT_TYPE \| 유효하지 않은 대표 타입 \| \|<br>\| NOT_ALLOWED_CHANNEL_TYPE \| 유효하지 않은 채널 타입 \| \|<br>\| NOT_ALLOWED_GOOD_SERVICE \| 유효하지 않은 굿서비스 \| \|<br>\| NOT_ALLOWED_SALE_ACTION_GRADE \| 유효하지 않은 스토어 등급 \| \|<br>\| SUBSCRIBING_USER_EXISTS \| 현재 사용자가 존재하여 애플리케이션 변경 불가 \| \|<br>---------- |
| 404 | ## Not Found<br>----------<br>\| 코드 \| 설명 \| 비고 \|<br>\| -------- \| --- \| --- \|<br>\| NOT_FOUND \| 발견되지 않음 \| \|<br>\| DATA_NOT_EXIST \| 존재하지 않는 데이터 \| \|<br>\| SUBSCRIPTION_NOT_FOUND \| 유효하지 않은 솔루션 사용 \| \|<br>\| SOLUTION_NOT_FOUND \| 유효하지 않은 솔루션 \| \|<br>---------- |
| 406 | ## Not Acceptable<br>----------<br>\| 코드 \| 설명 \| 비고 \|<br>\| -------- \| --- \| --- \|<br>\| BLOCK_TIME \| 허용되지 않은 시간 \| \|<br>\| PREVENT_REJOIN_SAME_DAY \| 당일 재가입 금지 \| \|<br>---------- |
| 409 | ## Conflict<br>----------<br>\| 코드 \| 설명 \| 비고 \|<br>\| -------- \| --- \| --- \|<br>\| CONDITION_CHANGED \| 유효하지 않은 조건 \| \|<br>\| DUPLICATE_SUBSCRIBE \| 중복 사용 불가 \| \|<br>\| DUPLICATED_RESOURCE \| 중복 불가 \| \|<br>---------- |
| 500 | ## Internal Server Error<br>----------<br>\| 코드 \| 설명 \| 비고 \|<br>\| -------- \| --- \| --- \|<br>\| CRYPTO_FAILURE \| 암호화/복호화 실패 \| \|<br>\| DATABASE_ERROR \| 데이터베이스 오류 \| \|<br>\| DATA_ERROR \| 유효하지 않은 데이터 \| \|<br>\| INVALID_DATA_STATUS \| 유효하지 않은 상태의 데이터 \| \|<br>\| INVALID_INPUT_DATA \| 유효하지 않은 입력 데이터 \| \|<br>\| NETWORK_ERROR \| 네트워크 오류 \| \|<br>\| BILL_ERROR \| 유효하지 않은 청구서 \| \|<br>\| UNKNOWN_ERROR \| 미확인 오류 \| \|<br>---------- |
| 503 | ## Service Unavailable<br>----------<br>\| 코드 \| 설명 \| 비고 \|<br>\| -------- \| --- \| --- \|<br>\| DATABASE_ROS \| 데이터베이스가 읽기 모드 전용 \| \|<br>---------- |

### 사용 enum 카탈로그

- 요청 본문 `transactionType`: `PAYMENT`, `REFUND`
- 요청 본문 `paymentModel`: `ONETIME`, `USAGE`, `MONTHLY`, `YEARLY`, `ETC`
- 요청 본문 `paymentMethod`: `CARD`, `DIGITAL`, `CASH`, `ETC`

### 호출 예시

```bash
curl -X POST 'https://api.commerce.naver.com/external/v1/commerce-solutions/external-transactions' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```