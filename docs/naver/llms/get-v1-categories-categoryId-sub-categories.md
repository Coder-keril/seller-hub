---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/get-sub-category-product
---
# GET /v1/categories/{categoryId}/sub-categories - 하위 카테고리 조회

카테고리 도메인에서 특정 카테고리의 바로 아래(1단계) 하위 카테고리 목록을 조회하는 API 로, 카테고리 선택 UI 를 지연 로딩 방식으로 단계적으로 펼치는 데 적합하다. 일반적인 활용 흐름은 전체 카테고리 조회 대신 사용자가 상위 카테고리를 펼칠 때마다 본 API 로 자식 카테고리만 가져와 트리를 점진적으로 구성하는 방식이며, 전체 트리를 한 번에 받지 않으므로 초기 로딩 비용을 줄일 수 있다. 응답은 wholeCategoryName, id, name, last 로 구성되어 그대로 셀렉터에 매핑하기 쉽고 last 플래그로 리프 여부를 판별할 수 있다. 카테고리 메타 데이터는 변경 빈도가 낮으므로 클라이언트에서 적절한 TTL 로 캐시해 두는 운영이 권장된다. categoryId 경로 파라미터에 잘못된 형식을 전달하면 400 BAD_REQUEST, 존재하지 않는 카테고리는 404 NOT_FOUND 로 반환된다. 권한 부족은 403 FORBIDDEN, 인증 오류는 401 UNAUTHORIZED 로 분리되어 응답되고, 500 INTERNAL_SERVER_ERROR 는 서버 일시 장애에 해당하므로 지수 백오프와 함께 제한된 재시도를 적용하고 캐시된 이전 응답으로 폴백하는 전략을 권장한다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| categoryId | path | string | 필수 | 카테고리 ID |

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
curl -X GET 'https://api.commerce.naver.com/external/v1/categories/{categoryId}/sub-categories' \
  -H 'Authorization: Bearer {access_token}'
```