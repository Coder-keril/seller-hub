---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/get-size-type-vo-list-product
---
# GET /v1/product-sizes - 전체 사이즈 타입 조회

전체 사이즈 타입 조회 API는 네이버 커머스가 정의한 상품 사이즈 타입 마스터 전체 목록과 각 타입에 속한 사이즈 값 타입을 한 번에 받아오기 위한 메타 정보 조회 엔드포인트입니다. 응답에는 사이즈 타입 ID·이름과 함께 측정 방식(SECTION·ROUND)·단위(CM·INCH·MM), 그리고 노출 순서가 부여된 사이즈 값 타입 배열이 포함되므로, 패션 등 사이즈가 중요한 카테고리의 상품 등록 화면 구성과 옵션 매핑에 활용됩니다. 사이즈 마스터 데이터는 거의 변하지 않으므로 클라이언트 측에서 적극적으로 캐싱해 호출량을 줄이는 것이 권장되며, exposureOrder 값을 기준으로 정렬해 사용자 화면에 노출하는 것이 좋습니다. 파라미터 없이 호출 가능한 단순 엔드포인트이지만 권한 점검은 수행되므로 401·403 응답이 발생할 경우 토큰 재발급과 권한 확인 후 재시도하고, 500 응답은 일시 장애 가능성이 있어 지수 백오프 기반 재시도 정책을 적용합니다. 특정 사이즈 타입의 상세만 필요한 경우 사이즈 타입 단건 조회 API를 사용하는 편이 응답 크기 측면에서 효율적입니다.

> Base URL: https://api.commerce.naver.com/external

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| id | - | integer(int64) | 필수 |  |
| name | - | string | 필수 |  |
| sizeMeasurementType | - | string | 필수 | 허용값: `SECTION`, `ROUND` |
| sizeUnitType | - | string | 필수 | 허용값: `CM`, `INCH`, `MM` |
| sizeValueTypes | - | array | 필수 |  |
| sizeValueTypes.id | - | integer(int64) | 필수 |  |
| sizeValueTypes.name | - | string | 필수 |  |
| sizeValueTypes.exposureOrder | - | integer(int32) | 필수 |  |

### 에러 코드

| 상태 코드 | 설명 |
|-----------|------|
| 400 | 잘못된 요청<br/>- code : BAD_REQUEST |
| 401 | 인가되지 않은 요청<br/>- code : UNAUTHORIZED |
| 403 | 권한 없음<br/>- code : FORBIDDEN |
| 404 | 데이터 없음<br/>- code : NOT_FOUND |
| 500 | 내부 서버 오류<br/>- code : INTERNAL_SERVER_ERROR |

### 사용 enum 카탈로그

- 응답 `[].sizeMeasurementType`: `SECTION`, `ROUND`
- 응답 `[].sizeUnitType`: `CM`, `INCH`, `MM`

### 호출 예시

```bash
curl -X GET 'https://api.commerce.naver.com/external/v1/product-sizes' \
  -H 'Authorization: Bearer {access_token}'
```