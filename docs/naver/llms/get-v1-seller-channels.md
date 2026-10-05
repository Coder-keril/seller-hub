---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/get-channels-by-account-no-sellers
---
# GET /v1/seller/channels - 계정으로 채널 정보 조회

현재 인증된 판매자 계정에 연결된 채널 정보를 조회하는 API로, 응답으로 채널 번호(channelNo), 채널 유형(channelType: STOREFARM 스마트스토어/WINDOW 윈도), 채널명(name), 채널 URL, 대표 이미지 URL, 그리고 톡톡 채널이 노출 상태일 때만 톡톡 계정 아이디(talkTalkAccountId)를 제공합니다. 외부 시스템에서 OAuth 인증 직후 어떤 채널에 대해 작업이 가능한지 식별하거나, 다채널 셀러 백오피스에서 채널 전환·라우팅에 사용하는 기본 정보로 자주 활용되며 결과는 자주 바뀌지 않으므로 세션 단위로 캐시해 호출 빈도를 낮추는 패턴이 일반적입니다. 톡톡 ID는 톡톡 채널이 노출 상태가 아닐 때 미응답될 수 있으므로 null 가드를 둔 후 톡톡 연계 기능을 분기해야 합니다. 401 UNAUTHORIZED는 토큰 만료·서명 오류이므로 재발급 플로우로 안내하고, 403 응답 코드(ROLE_NOT_FOUND/PROVISION_NOT_FOUND/INVALID_*_STATUS/RESOURCE_NOT_AVAILABLE)는 권한·약관 동의·연동 상태에 따라 사용자에게 명확한 안내 화면으로 분기합니다. 404 응답 코드(CHANNEL/STORE/REPRESENT/MEMBER/INTERLOCK_NOT_FOUND)는 채널 매핑이 끊긴 상태이므로 운영 채널에서 연동 상태를 점검해야 하며, 400 GENERAL_ERROR나 500(PARSING_FAIL/SERDES_FAIL/ENCDEC_FAIL/GENERAL_ERROR)은 일시 장애·직렬화 실패로 보고 지수 백오프로 재시도하고 반복 실패 시 운영 채널에 에스컬레이션합니다.

> Base URL: https://api.commerce.naver.com/external

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| channelNo | - | integer(int64) |  | 채널 번호 |
| channelType | - | string |  | 채널 유형. 허용값: `STOREFARM`, `WINDOW` |
| name | - | string |  | 채널명 |
| url | - | string |  | 채널 URL |
| representativeImageUrl | - | string |  | 대표 이미지 URL |
| talkTalkAccountId | - | string |  | 톡톡 계정 아이디<br>채널에 연결된 톡톡 채널이 노출 상태인 경우 톡톡 계정 아이디를 제공합니다. |

### 에러 코드

| 상태 코드 | 설명 |
|-----------|------|
| 400 | ## Bad Request<br>----------<br>\| 코드 \| 설명 \|<br>\| -------- \| --- \|<br>\| GENERAL_ERROR \| 처리되지 않은 오류 \|<br>---------- |
| 401 | ## Unauthorized<br>----------<br>\| 코드 \| 설명 \|<br>\| -------- \| --- \|<br>\| UNAUTHORIZED \| 접근 권한이 없음 \|<br>---------- |
| 403 | ## Forbidden<br>----------<br>\| 코드 \| 설명 \|<br>\| -------- \| --- \|<br>\| ROLE_NOT_FOUND \| 권한 없음 \|<br>\| PROVISION_NOT_FOUND \| 약관 동의 필요 \|<br>\| INVALID_CHANNEL_STATUS \| 유효하지 않는 채널 상태 \|<br>\| INVALID_STORE_STATUS \| 유효하지 않은 스토어 상태 \|<br>\| INVALID_REPRESENT_STATUS \| 유효하지 않은 대표 상태 \|<br>\| INVALID_MEMBER_STATUS \| 유효하지 않은 회원 상태 \|<br>\| INVALID_INTERLOCK_STATUS \| 유효하지 않은 연동 상태 \|<br>\| RESOURCE_NOT_AVAILABLE \| 접근할 수 없는 자원 \|<br>---------- |
| 404 | ## Not Found<br>----------<br>\| 코드 \| 설명 \|<br>\| -------- \| --- \|<br>\| CHANNEL_NOT_FOUND \| 유효하지 않은 채널 번호 \|<br>\| STORE_NOT_FOUND \| 유효하지 않은 스토어 번호 \|<br>\| REPRESENT_NOT_FOUND \| 유효하지 않은 대표 번호 \|<br>\| MEMBER_NOT_FOUND \| 유효하지 않은 회원 번호 \|<br>\| INTERLOCK_NOT_FOUND \| 연동 정보 없음 \|<br>---------- |
| 500 | ## Internal Server Error<br>----------<br>\| 코드 \| 설명 \|<br>\| -------- \| --- \|<br>\| PARSING_FAIL \| 유효하지 않은 JSON 문법 \|<br>\| SERDES_FAIL \| 직렬화/역직렬화 실패 \|<br>\| ENCDEC_FAIL \| 암/복호화 실패 \|<br>\| GENERAL_ERROR \| 처리되지 않은 오류 \|<br>---------- |

### 사용 enum 카탈로그

- 응답 `channelType`: `STOREFARM`, `WINDOW`

### 호출 예시

```bash
curl -X GET 'https://api.commerce.naver.com/external/v1/seller/channels' \
  -H 'Authorization: Bearer {access_token}'
```