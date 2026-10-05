---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/get-recommend-tags-product
---
# GET /v2/tags/recommend-tags - (v2) 추천 태그 검색 목록 조회

(v2) 추천 태그 검색 목록 조회 API는 키워드를 입력해 네이버 쇼핑이 사전 정의한 추천 태그 후보 목록(태그 ID·태그명) 을 받아오기 위한 메타 정보 조회 엔드포인트로, 상품 등록·수정 시 태그 필드에 입력할 표준 태그를 사용자에게 제안하는 자동완성·검색 UI 구현에 사용합니다. 응답으로 받은 code(태그 ID) 와 text(태그명) 는 짝지어 사용해야 하며, 입력한 ID 와 텍스트가 일치하지 않으면 후속 상품 등록 요청이 실패하므로 클라이언트에서 페어를 그대로 유지해 전달해야 합니다. 직접 입력 태그(추천 태그가 아닌 자유 입력) 의 경우 태그 ID(code) 는 입력하지 않고 텍스트만 사용하며, 추천 태그와 직접 입력 태그를 함께 사용할 때 두 경로를 분리해 관리하면 검증 오류를 예방할 수 있습니다. 추천 태그 마스터는 비교적 빈번하게 갱신되지만 동일 키워드에 대한 결과는 짧은 TTL로 캐싱해 입력 자동완성 성능을 개선할 수 있습니다. keyword 는 필수이므로 누락 시 400 BAD_REQUEST 가 반환되고, 매칭되는 추천 태그가 없으면 빈 결과가 응답될 수 있어 후처리에서 결과 길이를 점검합니다. 401·403 응답은 토큰 재발급·권한 확인으로 대응하고, 500 응답은 일시 장애로 간주해 지수 백오프 재시도를 적용합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| keyword | query | string | 필수 | 검색할 키워드 |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| code | - | integer(int64) |  | 태그 ID는 추천 태그 조회 API를 통해 확인할 수 있습니다.<br>입력한 태그 ID와 태그명이 일치하지 않는 경우 요청은 실패합니다.<br>추천 태그가 아닌 직접 입력 태그의 경우 태그 ID(code)는 입력하지 않습니다. |
| text | - | string | 필수 |  |

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
curl -X GET 'https://api.commerce.naver.com/external/v2/tags/recommend-tags?keyword={keyword}' \
  -H 'Authorization: Bearer {access_token}'
```