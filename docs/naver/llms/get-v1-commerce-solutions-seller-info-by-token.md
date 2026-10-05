---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/get-seller-info-by-token-merchant
---
# GET /v1/commerce-solutions/seller-info-by-token - 판매자 인증 JWE 해석 API

커머스솔루션마켓에서 발급된 판매자 인증 JWE 토큰을 해석해 토큰에 담긴 판매자 정보·권한·솔루션 사용 상태를 조회하는 API로, 솔루션 진입 화면에서 사용자 컨텍스트를 복원하고 사용 시작 승인 등의 후속 호출이 가능한지 사전 판정하는 단계에 사용합니다. 호출 시 query 의 token 을 필수로 전달하면 토큰을 복호화해 매니저 권한 타입(roleGroupType: REPRESENT/MANAGER_GROUP/ACCOUNT/ACCOUNT_SUB) 과 세부 권한 타입(roleGroupDetailType: INFLUENCER/AGENCY/LOGISTICS_MANAGEMENT), 판매자 등급(actionGrade: ZERO~FIFTH), 스토어명·대표 채널 프로필·판매자 유형(representType: 국내/해외, 개인/사업자) 을 반환합니다. 응답의 accountAuthentication 으로 커머스API 사용 가능 여부를, approveSubscriptionYn 으로 솔루션 사용 승인 가능 여부를 판단하고, 불가 시 impossibleReason 으로 차단 사유를 사용자에게 안내합니다. 솔루션 사용 상태(status) 와 요금제 ID(planId, 사용 중일 때만 존재), 현재 회차 정보(round.round/roundStartDate/roundEndDate), 솔루션 ID 까지 함께 반환되어 화면 진입 직후 사용 상태 분기와 회차 경계 표시에 활용할 수 있습니다. 토큰은 만료가 있고 한 번 해석된 결과를 그대로 캐시해 두면 권한 변경에 즉시 반영되지 않을 수 있으므로 상태 변경 이벤트가 있을 때마다 재해석하는 운용이 권장됩니다. 400 INVALID_INPUT, 401 INVALID_SELLER_TOKEN·EXPIRED_SELLER_TOKEN 은 토큰 형식·만료 문제이므로 token 재발급으로 처리하고, 403 NOT_AUTHORIZED_ACCOUNT_ROLE·NOT_ALLOWED_ACCOUNT·NOT_ALLOWED_BRAND_STORE 등은 계정 권한·스토어 타입 제약을, 404 는 대상 자원 부재를, 500·503 은 백오프 재시도로 대응합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| token | query | string | 필수 |  |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| roleGroupType | - | string |  | 선택한 계정에 보유한 매니저 권한 타입. 허용값: `REPRESENT`, `MANAGER_GROUP`, `ACCOUNT`, `ACCOUNT_SUB` |
| roleGroupDetailType | - | string |  | 선택한 계정에 보유한 매니저 세부 권한 타입. 허용값: `INFLUENCER`, `AGENCY`, `LOGISTICS_MANAGEMENT` |
| actionGrade | - | string |  | 판매자 등급. 허용값: `ZERO`, `FIRST`, `SECOND`, `THIRD`, `FOURTH`, `FIFTH` |
| channelName | - | string |  | 스토어명(대표 채널명) |
| representImageUrl | - | string |  | 스토어 프로필 섬네일 URL |
| accountUid | - | string |  | 판매자 계정 UID |
| representType | - | string |  | 판매자 유형. 허용값: `DOMESTIC_PERSONAL`, `DOMESTIC_BUSINESS`, `OVERSEAS_PERSONAL`, `OVERSEAS_BUSINESS` |
| accountAuthentication | - | boolean |  | 커머스API 사용 가능 여부(계정 인증 여부) |
| approveSubscriptionYn | - | boolean |  | 솔루션 사용 승인 가능 여부 |
| impossibleReason | - | string |  | 대표 사용 불가 사유 |
| status | - | string |  | 솔루션 사용 상태. 허용값: `SUBSCRIBING`, `WAITING_SUBSCRIPTION`, `ON_EXAMINATION`, `UNSUBSCRIBED`, `WAITING_UNSUBSCRIPTION`, `ON_PAYMENT_FAIL`, `CANCEL_SUBSCRIPTION` |
| planId | - | string |  | 요금제 ID(솔루션 사용 중일 때만 존재) |
| round | - | object |  | 회차 정보 |
| round.round | - | integer(int32) |  | 회차 순번 |
| round.roundStartDate | - | string(date-time) |  | 회차 시작일 |
| round.roundEndDate | - | string(date-time) |  | 회차 종료일 |
| solutionId | - | string |  | 솔루션 ID |

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

- 응답 `roleGroupType`: `REPRESENT`, `MANAGER_GROUP`, `ACCOUNT`, `ACCOUNT_SUB`
- 응답 `roleGroupDetailType`: `INFLUENCER`, `AGENCY`, `LOGISTICS_MANAGEMENT`
- 응답 `actionGrade`: `ZERO`, `FIRST`, `SECOND`, `THIRD`, `FOURTH`, `FIFTH`
- 응답 `representType`: `DOMESTIC_PERSONAL`, `DOMESTIC_BUSINESS`, `OVERSEAS_PERSONAL`, `OVERSEAS_BUSINESS`
- 응답 `status`: `SUBSCRIBING`, `WAITING_SUBSCRIPTION`, `ON_EXAMINATION`, `UNSUBSCRIBED`, `WAITING_UNSUBSCRIPTION`, `ON_PAYMENT_FAIL`, `CANCEL_SUBSCRIPTION`

### 호출 예시

```bash
curl -X GET 'https://api.commerce.naver.com/external/v1/commerce-solutions/seller-info-by-token?token={token}' \
  -H 'Authorization: Bearer {access_token}'
```