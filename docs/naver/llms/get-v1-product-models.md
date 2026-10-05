---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/get-model-list-product
---
# GET /v1/product-models - 카탈로그 조회

카탈로그 조회 API는 네이버 쇼핑이 운영하는 카탈로그(모델) 마스터를 이름 키워드로 검색해, 상품 등록 시 카탈로그 매칭에 필요한 모델 ID·카테고리·브랜드·제조사 정보를 일괄적으로 확보하기 위한 메타 정보 조회 엔드포인트입니다. 응답은 페이지·정렬 정보가 포함된 페이지네이션 구조로 반환되므로, 결과 건수가 많을 때는 page·size 파라미터를 이용해 분할 조회합니다. 카탈로그 데이터는 수시로 변하지 않는 마스터성 정보이므로 클라이언트 측에서 적절한 TTL로 캐싱해 반복 호출을 최소화하는 것이 좋고, 카탈로그 매칭 정확도를 높이기 위해서는 키워드를 점진적으로 좁혀 가며 검색하는 패턴이 효과적입니다. name 파라미터는 필수이므로 누락 시 400 BAD_REQUEST 가 발생하며, 검색 결과가 없는 경우 contents 가 비어 있고 totalElements 가 0 인 빈 페이지로 반환될 수 있어 contents 길이를 먼저 확인한 뒤 후처리하는 것이 안전합니다. 401·403 응답은 토큰 재발급과 권한 점검으로 대응하고, 404 응답은 잘못된 경로 호출 여부를 확인합니다. 500 응답은 일시 장애로 간주해 지수 백오프 재시도를 적용합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| name | query | string | 필수 | 검색할 카탈로그 이름 |
| page | query | integer(int32) |  | 페이지 번호 |
| size | query | integer(int32) |  | 페이지 크기 |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| contents | - | array |  |  |
| contents.wholeCategoryName | - | string |  |  |
| contents.categoryId | - | string |  |  |
| contents.manufacturerCode | - | integer(int64) |  | 제조사 ID |
| contents.manufacturerName | - | string |  |  |
| contents.brandCode | - | integer(int64) |  | 브랜드 ID |
| contents.brandName | - | string |  |  |
| contents.id | - | integer(int64) |  |  |
| contents.name | - | string |  |  |
| page | - | integer(int32) |  |  |
| size | - | integer(int32) |  |  |
| totalElements | - | integer(int64) |  |  |
| totalPages | - | integer(int32) |  |  |
| sort | - | object |  | 정렬 정보 |
| sort.sorted | - | boolean |  |  |
| sort.fields | - | array |  |  |
| sort.fields.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| first | - | boolean |  |  |
| last | - | boolean |  |  |

### 에러 코드

| 상태 코드 | 설명 |
|-----------|------|
| 400 | 잘못된 요청<br/>- code : BAD_REQUEST |
| 401 | 인가되지 않은 요청<br/>- code : UNAUTHORIZED |
| 403 | 권한 없음<br/>- code : FORBIDDEN |
| 404 | 데이터 없음<br/>- code : NOT_FOUND |
| 500 | 내부 서버 오류<br/>- code : INTERNAL_SERVER_ERROR |

### 사용 enum 카탈로그

- 응답 `sort.fields[].direction`: `ASC`, `DESC`

### 호출 예시

```bash
curl -X GET 'https://api.commerce.naver.com/external/v1/product-models?name={name}' \
  -H 'Authorization: Bearer {access_token}'
```
