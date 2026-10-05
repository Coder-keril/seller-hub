---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/get-model-product
---
# GET /v1/product-models/{id} - 카탈로그 단건 조회

카탈로그 단건 조회 API는 카탈로그 목록 조회로 확보한 모델 ID를 지정해 해당 카탈로그의 상세 정보(카테고리, 브랜드, 제조사, 모델명 등)를 단건으로 조회하기 위한 메타 정보 조회 엔드포인트입니다. 일반적으로 카탈로그 검색 API로 후보를 좁힌 뒤, 매칭하려는 특정 모델의 식별 정보를 다시 확인하고 상품 등록·수정 본문에 채워 넣는 흐름에서 사용합니다. 카탈로그 마스터 데이터는 빈번하게 변경되지 않으므로 동일 ID에 대한 결과를 클라이언트에서 캐싱해 두면 호출량을 줄일 수 있습니다. id 파라미터는 path 필수값이므로 누락하거나 형식이 잘못되면 400 BAD_REQUEST 가 반환되고, 존재하지 않는 ID 를 지정하면 404 NOT_FOUND 가 응답되므로 카탈로그 목록 조회 결과의 유효성을 먼저 확인하는 것이 안전합니다. 401·403 응답은 인증·권한 문제이므로 토큰 갱신과 권한 확인을 거쳐 재시도하고, 500 응답은 일시 장애 가능성이 있어 지수 백오프 기반 재시도를 권장합니다. 308 응답이 반환되는 경우 리다이렉트된 위치로 재요청해야 하며, 클라이언트가 리다이렉트를 자동으로 처리하는지 확인하는 것이 좋습니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| id | path | integer(int64) | 필수 | 검색할 카탈로그 ID |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| wholeCategoryName | - | string |  |  |
| categoryId | - | string |  |  |
| manufacturerCode | - | integer(int64) |  | 제조사 ID |
| manufacturerName | - | string |  |  |
| brandCode | - | integer(int64) |  | 브랜드 ID |
| brandName | - | string |  |  |
| id | - | integer(int64) |  |  |
| name | - | string |  |  |

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
curl -X GET 'https://api.commerce.naver.com/external/v1/product-models/{id}' \
  -H 'Authorization: Bearer {access_token}'
```
