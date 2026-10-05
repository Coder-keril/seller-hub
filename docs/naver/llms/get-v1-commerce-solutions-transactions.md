---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/get-transactions-merchant
---
# GET /v1/commerce-solutions/transactions - 비즈월렛 결제 내역 조회

커머스솔루션마켓을 통한 비즈월렛 결제 내역을 기간 단위로 조회하는 API로, 솔루션 사용료의 정산·회계 마감 워크플로우에서 거래 원장을 수집하는 데 사용합니다. 필수로 paymentConfirmStartDate 와 paymentConfirmEndDate 두 시점을 지정해 거래 일시 범위를 한정하고, 추가로 transactionId·originalTransactionId·solutionName·transactionType(FREE_TRIAL/PAYMENT/UPGRADE/DOWNGRADE/REFUND)·planId·accountUid 를 결합해 결제번호·원결제번호·솔루션명·거래 유형·요금제·계정 단위로 필터링할 수 있습니다. 응답은 거래 일시·결제번호·원결제번호·솔루션 ID/솔루션명·거래 유형·거래 사유·요금제 ID·계정 UID·VAT 포함 총 금액으로 구성된 거래 목록을 반환하므로, 자사 정산 시스템의 거래 원장과 키(transactionId, originalTransactionId) 기준으로 매핑·대사합니다. 환불·업/다운그레이드 추적이 필요한 경우 originalTransactionId 로 원거래를 역추적하고, 대량 조회 시에는 기간을 분할해 호출하는 것이 안전합니다. 400 INVALID_INPUT·BAD_REQUEST 응답은 날짜 범위 형식·필수값 누락을, 401/403 은 SELLER 토큰 유효성과 계정 권한·등급 등 접근 제어 조건을, 402 BIZ_WALLET_USE_ERROR 는 비즈월렛 연계 오류를 점검해 대응합니다. 404 SUBSCRIPTION_NOT_FOUND·SOLUTION_NOT_FOUND 는 대상 자원의 부재를, 500·503 은 서버·DB 일시 오류이므로 백오프 재시도를 권장합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| paymentConfirmStartDate | query | string(date-time) | 필수 | 거래 시작 일시 |
| paymentConfirmEndDate | query | string(date-time) | 필수 | 거래 종료 일시 |
| transactionId | query | string |  | 결제번호 |
| originalTransactionId | query | string |  | 원결제번호 |
| solutionName | query | string |  | 솔루션명 |
| transactionType | query | string |  | 결제 구분. 허용값: `FREE_TRIAL`, `PAYMENT`, `UPGRADE`, `DOWNGRADE`, `REFUND` |
| planId | query | string |  | 요금제 ID |
| accountUid | query | string |  | 계정 UID |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| paymentConfirmDate | - | string(date-time) |  | 거래 일시 |
| transactionId | - | string |  | 결제번호 |
| originalTransactionId | - | string |  | 원결제번호 |
| solutionId | - | string |  | 솔루션 ID |
| solutionName | - | string |  | 솔루션명 |
| transactionType | - | string |  | 허용값: `FREE_TRIAL`, `PAYMENT`, `UPGRADE`, `DOWNGRADE`, `REFUND` |
| reason | - | string |  | 거래 사유 |
| planId | - | string |  | 요금제 ID |
| accountUid | - | string |  | 계정 UID |
| totalAmount | - | number |  | 금액 (VAT포함) |

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

- 파라미터 `transactionType`: `FREE_TRIAL`, `PAYMENT`, `UPGRADE`, `DOWNGRADE`, `REFUND`
- 응답 `[].transactionType`: `FREE_TRIAL`, `PAYMENT`, `UPGRADE`, `DOWNGRADE`, `REFUND`

### 호출 예시

```bash
curl -X GET 'https://api.commerce.naver.com/external/v1/commerce-solutions/transactions?paymentConfirmStartDate={paymentConfirmStartDate}&paymentConfirmEndDate={paymentConfirmEndDate}' \
  -H 'Authorization: Bearer {access_token}'
```