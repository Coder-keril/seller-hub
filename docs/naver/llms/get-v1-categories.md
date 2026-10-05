---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/get-category-list-product
---
# GET /v1/categories - 전체 카테고리 조회

카테고리 도메인에서 네이버 커머스의 전체 카테고리 트리를 평면 형태로 조회하는 메타정보 API 로, 상품 등록·수정 시 카테고리 ID 매핑을 위한 사전 호출 또는 카테고리 셀렉터 UI 구성을 위한 데이터 소스로 자주 활용된다. last 쿼리 파라미터를 true 로 지정하면 리프 카테고리만 추려서 받을 수 있어 상품 등록 화면에서 실제로 선택 가능한 항목만 빠르게 노출하는 흐름에 적합하다. 카테고리 데이터는 변경 빈도가 낮으므로 클라이언트에서 일정 시간 캐시해 두고 정기적으로 갱신하는 운영이 권장되며, 상품 등록 직전마다 호출하기보다는 일 단위 또는 배포 주기로 갱신하는 정책이 일반적이다. 응답에는 wholeCategoryName(전체 경로 표시명), id, name, last(리프 여부) 가 포함되어 상위 경로를 그대로 사용자에게 노출하기 편하다. 권한 없는 호출은 403 FORBIDDEN, 토큰 오류는 401 UNAUTHORIZED, 형식 오류는 400 BAD_REQUEST, 데이터 부재는 404 NOT_FOUND 로 응답된다. 500 INTERNAL_SERVER_ERROR 는 일시 장애로 보고 지수 백오프와 함께 제한된 횟수만 재시도하며, 캐시된 이전 응답으로 폴백하는 전략을 함께 두는 것이 안정적이다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| last | query | boolean |  | 리프 카테고리만 조회 여부 |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| wholeCategoryName | - | string | 필수 |  |
| id | - | string | 필수 |  |
| name | - | string | 필수 |  |
| last | - | boolean | 필수 |  |

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
curl -X GET 'https://api.commerce.naver.com/external/v1/categories' \
  -H 'Authorization: Bearer {access_token}'
```