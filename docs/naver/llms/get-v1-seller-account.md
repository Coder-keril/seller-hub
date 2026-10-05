---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/get-account-info-by-account-no-sellers
---
# GET /v1/seller/account - 계정 정보 조회

현재 인증된 판매자 계정의 기본 정보를 단건 조회하는 API로, 응답은 계정 ID(accountId), 계정 UID(accountUid), 판매자 등급(grade)으로 구성된 매우 간결한 식별 정보를 제공합니다. 외부 시스템에서 OAuth 토큰으로 접근한 계정이 누구인지 확인하거나, 판매자 등급에 따라 노출 기능을 분기하는 백오피스/대시보드 초기 부트스트랩 단계에서 자주 호출되며 결과는 세션 유지 시간 동안 메모리에 보관해 반복 호출을 최소화하는 패턴이 일반적입니다. 토큰 자체는 발급될 때 한 번 검증되지만 권한·약관 동의·연동 상태가 운영 중에 변할 수 있으므로, 403 응답 코드(ROLE_NOT_FOUND, PROVISION_NOT_FOUND, INVALID_CHANNEL_STATUS, INVALID_STORE_STATUS 등)별로 사용자에게 약관 동의·계정 재연결·관리자 권한 부여 등 명확한 안내 화면으로 분기해야 합니다. 401 UNAUTHORIZED는 토큰 만료·서명 오류이므로 재발급 플로우로 유도하고, 404 응답 코드(CHANNEL_NOT_FOUND/STORE_NOT_FOUND/MEMBER_NOT_FOUND/INTERLOCK_NOT_FOUND)는 연동 정보가 끊긴 상태이므로 채널·스토어 매핑 상태를 운영 채널에서 확인해야 합니다. 400 GENERAL_ERROR나 500(PARSING_FAIL/SERDES_FAIL/ENCDEC_FAIL/GENERAL_ERROR)은 일시 오류나 직렬화/암호화 실패로 보고 지수 백오프 후 제한된 횟수 내에서 재시도하고, 반복되면 운영 채널로 에스컬레이션합니다.

> Base URL: https://api.commerce.naver.com/external

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| accountId | - | string |  | 계정 ID |
| accountUid | - | string |  | 계정 UID |
| grade | - | string |  | 판매자 등급 |

### 에러 코드

| 상태 코드 | 설명 |
|-----------|------|
| 400 | ## Bad Request<br>----------<br>\| 코드 \| 설명 \|<br>\| -------- \| --- \|<br>\| GENERAL_ERROR \| 처리되지 않은 오류 \|<br>---------- |
| 401 | ## Unauthorized<br>----------<br>\| 코드 \| 설명 \|<br>\| -------- \| --- \|<br>\| UNAUTHORIZED \| 접근 권한이 없음 \|<br>---------- |
| 403 | ## Forbidden<br>----------<br>\| 코드 \| 설명 \|<br>\| -------- \| --- \|<br>\| ROLE_NOT_FOUND \| 권한 없음 \|<br>\| PROVISION_NOT_FOUND \| 약관 동의 필요 \|<br>\| INVALID_CHANNEL_STATUS \| 유효하지 않는 채널 상태 \|<br>\| INVALID_STORE_STATUS \| 유효하지 않은 스토어 상태 \|<br>\| INVALID_REPRESENT_STATUS \| 유효하지 않은 대표 상태 \|<br>\| INVALID_MEMBER_STATUS \| 유효하지 않은 회원 상태 \|<br>\| INVALID_INTERLOCK_STATUS \| 유효하지 않은 연동 상태 \|<br>\| RESOURCE_NOT_AVAILABLE \| 접근할 수 없는 자원 \|<br>---------- |
| 404 | ## Not Found<br>----------<br>\| 코드 \| 설명 \|<br>\| -------- \| --- \|<br>\| CHANNEL_NOT_FOUND \| 유효하지 않은 채널 번호 \|<br>\| STORE_NOT_FOUND \| 유효하지 않은 스토어 번호 \|<br>\| REPRESENT_NOT_FOUND \| 유효하지 않은 대표 번호 \|<br>\| MEMBER_NOT_FOUND \| 유효하지 않은 회원 번호 \|<br>\| INTERLOCK_NOT_FOUND \| 연동 정보 없음 \|<br>---------- |
| 500 | ## Internal Server Error<br>----------<br>\| 코드 \| 설명 \|<br>\| -------- \| --- \|<br>\| PARSING_FAIL \| 유효하지 않은 JSON 문법 \|<br>\| SERDES_FAIL \| 직렬화/역직렬화 실패 \|<br>\| ENCDEC_FAIL \| 암/복호화 실패 \|<br>\| GENERAL_ERROR \| 처리되지 않은 오류 \|<br>---------- |

### 호출 예시

```bash
curl -X GET 'https://api.commerce.naver.com/external/v1/seller/account' \
  -H 'Authorization: Bearer {access_token}'
```