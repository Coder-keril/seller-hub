---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/approve-unsubscription-merchant
---
# PUT /v1/commerce-solutions/subscriptions/unsubscription/approve - 사용 해지 승인

판매자가 요청한 커머스솔루션마켓 솔루션 사용 해지 건을 솔루션 개발사가 최종 승인할 때 호출하는 API로, 사용 해지 요청과 환불 처리 이후 구독 상태를 종결시키는 라이프사이클의 마지막 단계를 담당합니다. query 의 accountUid 로 승인 대상 계정을 지정하며 별도의 본문 페이로드는 필요하지 않습니다. 응답으로 계정 UID·솔루션 ID·계정 매핑 ID 와 함께 변경된 사용 상태(status) 가 반환되므로, UNSUBSCRIBED 또는 CANCEL_SUBSCRIPTION 등 후속 상태 값을 확인해 정산·계정 매핑 정리 등 후속 워크플로우로 분기합니다. 400 NOT_ALLOW_AFTER_UNSUBSCRIPTION·NOT_SUBSCRIBING·INVALID_REQUEST_CONDITION 은 해지 승인이 불가능한 상태이거나 요청 조건이 어긋난 경우이므로 사용 상태 조회로 선행 검증을 수행하고, 401/403 은 SELLER 토큰 유효성과 계정 권한·등급 등 접근 제어 조건을 점검해 처리합니다. 404 SUBSCRIPTION_NOT_FOUND·SOLUTION_NOT_FOUND 는 대상 사용 정보·솔루션의 부재, 406 BLOCK_TIME 은 허용되지 않은 시간대, 409 DUPLICATE_SUBSCRIBE·CONDITION_CHANGED 는 동시 처리 충돌을 가리키므로 상태를 재조회한 뒤 재시도하고, 500·503 은 백오프 재시도가 권장됩니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| accountUid | query | string | 필수 |  |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| accountUid | - | string |  | 계정 UID |
| solutionId | - | string |  | 솔루션 ID |
| status | - | string |  | 사용 상태. 허용값: `SUBSCRIBING`, `WAITING_SUBSCRIPTION`, `ON_EXAMINATION`, `UNSUBSCRIBED`, `WAITING_UNSUBSCRIPTION`, `ON_PAYMENT_FAIL`, `CANCEL_SUBSCRIPTION` |
| accountMappingId | - | string |  | 솔루션 개발사에서 자체 관리하는 계정 매핑 ID |

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

- 응답 `status`: `SUBSCRIBING`, `WAITING_SUBSCRIPTION`, `ON_EXAMINATION`, `UNSUBSCRIBED`, `WAITING_UNSUBSCRIPTION`, `ON_PAYMENT_FAIL`, `CANCEL_SUBSCRIPTION`

### 호출 예시

```bash
curl -X PUT 'https://api.commerce.naver.com/external/v1/commerce-solutions/subscriptions/unsubscription/approve' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```