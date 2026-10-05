---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/force-unsubscription-merchant
---
# PUT /v1/commerce-solutions/subscriptions/{accountUid}/unsubscription - 사용 중지

커머스솔루션마켓에 등록된 솔루션을 사용 중인 판매자가 해당 솔루션 사용을 중지(해지 요청)할 때 호출하는 API로, 솔루션 사용 라이프사이클에서 사용 신청·승인 이후의 종료 단계를 트리거합니다. path 의 accountUid 로 대상 계정을 지정하고, 본문에는 사용 상태 변경 사유(reason) 와 관리자용 사유(comment) 를 필수로 기재합니다. 일할 계산된 금액 대신 솔루션 개발사가 직접 환불 금액을 산정하는 경우에는 query 의 refundType 에 PARTIAL 을 설정하고 amount 에 환불 금액을 함께 전달하며, 다음 회차 결제 여부에 따라 amount 가 만족해야 하는 범위가 달라지므로 호출 전에 회차 결제 상태를 확인해야 합니다. 응답으로 계정 UID·솔루션 ID·계정 매핑 ID 와 함께 총 환불 금액(refundAmount) 이 반환되어 정산 처리에 활용할 수 있습니다. 400 응답은 BAD_REQUEST·CHANGE_COUNT_LIMIT·NOT_ALLOW_AFTER_UNSUBSCRIPTION·NOT_ALLOW_AFTER_PAYMENT 처럼 변경 횟수 초과나 해지 후·결제 이후 차단된 요청을 의미하므로 입력값과 사용 상태를 점검한 뒤 재호출 여부를 결정하고, 401/403 은 SELLER 토큰 유효성과 계정 권한·리퍼러·등급 등 접근 제어 조건을, 402 BIZ_WALLET_USE_ERROR 와 406 BLOCK_TIME·PREVENT_REJOIN_SAME_DAY 는 비즈월렛 상태와 허용 시간대를 확인해 재시도합니다. 404 SUBSCRIPTION_NOT_FOUND·SOLUTION_NOT_FOUND 는 대상 데이터의 부재를, 409 는 중복·조건 변경 충돌을 의미하며, 500·503 은 일시적 오류이므로 백오프 후 재시도를 권장합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| refundType | query | string |  | 환불 유형. 일할 계산된 금액 대신 솔루션 개발사가 직접 입력한 금액을 환불하는 경우에만 PARTIAL을 설정합니다.. 허용값: `PARTIAL` |
| amount | query | number |  | 일할 계산된 금액 대신 솔루션 개발사가 직접 입력한 금액을 환불하는 경우 환불 금액. refundType에 PARTIAL을 설정한 경우에만 설정합니다. 환불 금액은 다음 조건을 만족해야 합니다.<br><br>- 다음 회차를 결제한 경우: 다음 회차 결제 금액 <= amount <= 전체 결제 금액<br>- 다음 회차를 결제하지 않은 경우: 1 <= amount <= 전체 결제 금액 |
| accountUid | path | string | 필수 |  |

### 요청 본문

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| reason | body | string | 필수 | 사용 상태 변경 사유 |
| comment | body | string | 필수 | 사용 상태 변경 사유(관리자용) |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| accountUid | - | string |  | 계정 UID |
| solutionId | - | string |  | 솔루션 ID |
| accountMappingId | - | string |  | 솔루션 개발사에서 자체 관리하는 계정 매핑 ID |
| refundAmount | - | number |  | 총 환불 금액 |

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

- 파라미터 `refundType`: `PARTIAL`

### 호출 예시

```bash
curl -X PUT 'https://api.commerce.naver.com/external/v1/commerce-solutions/subscriptions/{accountUid}/unsubscription' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```