---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/get-subscription-merchant
---
# GET /v1/commerce-solutions/subscriptions/{accountUid} - 사용 상태 조회

커머스솔루션마켓에서 특정 판매자 계정의 현재 솔루션 사용 상태를 조회하는 API로, 솔루션 사용 라이프사이클(신청·승인·사용·해지) 의 어느 지점에 있는지 정확히 파악해 후속 호출(승인/거절/해지 등) 의 호출 가능 여부를 판단하는 데 사용합니다. path 의 accountUid 로 대상 계정을 식별하며, 응답에는 계정 UID·솔루션 ID·계정 매핑 ID 외에 요금제(plan 의 id/grade/name) 와 예약 정보(reserve 의 type: UNSUBSCRIPTION 또는 DOWNGRADE, 변경될 plan) 및 사용 상태(status: SUBSCRIBING/WAITING_SUBSCRIPTION/ON_EXAMINATION/UNSUBSCRIPTION 관련/ON_PAYMENT_FAIL 등) 가 함께 반환됩니다. 회차 정보(round, roundStartDate, roundEndDate) 와 신청일·시작일·종료일·해지 요청일이 함께 제공되어 결제 회차 경계와 라이프사이클 타임라인을 동기화할 수 있고, 계정 인증 여부(accountAuthentication) 와 강제 업그레이드 여부(forceUpgrade) 로 추가 처리 분기를 결정합니다. 호출 빈도가 높은 화면에서는 sub-second 폴링 대신 적절한 캐시 TTL 을 두고 상태 변경 이벤트 직후에만 갱신해 부하를 줄이는 것이 권장됩니다. 400 NOT_ACCOUNT_AUTHENTICATION·INVALID_INPUT 은 인증되지 않은 계정 또는 잘못된 입력, 401/403 은 SELLER 토큰·계정 권한·등급·리퍼러 등 접근 제어 조건, 404 SUBSCRIPTION_NOT_FOUND·SOLUTION_NOT_FOUND·DATA_NOT_EXIST 는 대상 자원의 부재를 의미하며, 500·503 은 서버·DB 일시 오류이므로 백오프 재시도를 권장합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| accountUid | path | string | 필수 |  |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| accountUid | - | string |  | 계정 UID |
| solutionId | - | string |  | 솔루션 ID |
| accountMappingId | - | string |  | 솔루션 개발사에서 자체 관리하는 계정 매핑 ID |
| subscriptionId | - | string |  | 최근 솔루션 사용 ID |
| plan | - | object |  |  |
| plan.id | - | string | 필수 |  |
| plan.grade | - | string | 필수 | 허용값: `DEFAULT`, `FREE`, `START`, `PLUS`, `PRO` |
| plan.name | - | string | 필수 |  |
| plan.additionalInfo | - | object |  |  |
| reserve | - | object |  | 예약 사항 |
| reserve.type | - | string |  | 허용값: `UNSUBSCRIPTION`, `DOWNGRADE` |
| reserve.plan | - | object |  |  |
| reserve.plan.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| status | - | string |  | 상태. 허용값: `SUBSCRIBING`, `WAITING_SUBSCRIPTION`, `ON_EXAMINATION`, `UNSUBSCRIBED`, `WAITING_UNSUBSCRIPTION`, `ON_PAYMENT_FAIL`, `CANCEL_SUBSCRIPTION` |
| round | - | integer(int32) |  | 현재 회차 |
| roundStartDate | - | string(date-time) |  | 현재 회차 시작일 |
| roundEndDate | - | string(date-time) |  | 현재 회차 종료(예상)일 |
| requestDate | - | string(date-time) |  | 솔루션 신청일(생성일) |
| startDate | - | string(date-time) |  | 시작일(조건부 사용 타입의 경우 사용 요청일과 사용 시작일이 다름) |
| endDate | - | string(date-time) |  | 해지/취소일 |
| requestUnsubscriptionDate | - | string(date-time) |  | 해지 요청일 |
| reason | - | string |  | 변경 사유 |
| forceUpgrade | - | boolean |  | 강제 업그레이드 여부 |
| accountAuthentication | - | boolean |  | 계정 인증 여부 |
| accountAuthenticatedDate | - | string(date-time) |  | 계정 인증일 |

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

- 응답 `plan.grade`: `DEFAULT`, `FREE`, `START`, `PLUS`, `PRO`
- 응답 `reserve.type`: `UNSUBSCRIPTION`, `DOWNGRADE`
- 응답 `status`: `SUBSCRIBING`, `WAITING_SUBSCRIPTION`, `ON_EXAMINATION`, `UNSUBSCRIBED`, `WAITING_UNSUBSCRIPTION`, `ON_PAYMENT_FAIL`, `CANCEL_SUBSCRIPTION`

### 호출 예시

```bash
curl -X GET 'https://api.commerce.naver.com/external/v1/commerce-solutions/subscriptions/{accountUid}' \
  -H 'Authorization: Bearer {access_token}'
```