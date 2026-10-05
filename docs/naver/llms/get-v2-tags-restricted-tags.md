---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/is-restrict-tags-product
---
# GET /v2/tags/restricted-tags - (v2) 제한 태그 여부 조회

(v2) 제한 태그 여부 조회 API는 다수의 태그 문자열을 한 번에 입력해 각 태그가 네이버 쇼핑 정책상 사용이 제한된 태그인지(true/false) 를 일괄 점검하기 위한 검증 엔드포인트로, 상품 등록·수정 직전에 사용자가 입력한 태그 목록을 사전 검증하는 용도로 사용합니다. 응답은 입력한 태그별로 tag·restricted 쌍이 포함되어, 제한 태그로 표시된 항목은 사용자에게 다른 태그로 교체하도록 안내하고 비제한 태그만 후속 등록 페이로드에 포함하는 흐름으로 처리합니다. 제한 태그 정책은 정기적으로 갱신될 수 있으므로 상품 등록 시점에 매번 본 API 로 검증하는 것이 권장되며, 검증을 생략하고 상품 등록을 시도하면 등록 단계에서 실패할 수 있어 사용자 경험에 부정적입니다. tags 는 필수이며 빈 배열을 보내면 400 BAD_REQUEST 가 반환되고, 한 번에 전달하는 태그 수는 적정 수준으로 제한해 응답 크기와 처리 시간을 관리합니다. 401·403 응답은 토큰 재발급·권한 확인으로 대응하고, 500 응답은 일시 장애로 간주해 지수 백오프 재시도를 적용합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| tags | query | array | 필수 |  |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| tag | - | string |  |  |
| restricted | - | boolean |  | 제한 태그인 경우 값이 true입니다. |

### 에러 코드

| 상태 코드 | 설명 |
|-----------|------|
| 400 | 잘못된 요청<br/>- code : BAD_REQUEST |
| 401 | 인가되지 않은 요청<br/>- code : UNAUTHORIZED |
| 403 | 권한 없음<br/>- code : FORBIDDEN |
| 404 | 데이터 없음<br/>- code : NOT_FOUND |
| 500 | 내부 서버 오류<br/>- code : INTERNAL_SERVER_ERROR |

### 호출 예시

```bash
curl -X GET 'https://api.commerce.naver.com/external/v2/tags/restricted-tags?tags={tags}' \
  -H 'Authorization: Bearer {access_token}'
```