---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/get-size-type-vo-product
---
# GET /v1/product-sizes/{sizeTypeId} - 사이즈 타입 조회

사이즈 타입 조회 API는 sizeTypeId를 path 파라미터로 지정해 해당 사이즈 타입의 측정 방식·단위·노출 순서가 부여된 사이즈 값 타입 배열을 단건으로 받아오기 위한 메타 정보 조회 엔드포인트입니다. 일반적으로 전체 사이즈 타입 조회로 후보 목록을 확보한 뒤, 사용자가 선택한 특정 타입에 대한 사이즈 값 목록을 화면에 노출하거나 상품 옵션 매핑에 사용하는 흐름에서 호출합니다. 사이즈 마스터 데이터는 거의 변하지 않으므로 동일 sizeTypeId 의 결과를 클라이언트 측에서 캐싱해 두면 호출량과 응답 지연을 모두 줄일 수 있습니다. sizeTypeId 는 필수이므로 누락 시 400 BAD_REQUEST 가 반환되고, 존재하지 않는 ID 를 지정하면 404 NOT_FOUND 가 응답되므로 전체 조회 결과의 유효성을 먼저 확인하는 것이 안전합니다. 401·403 응답은 토큰 재발급과 권한 확인으로 대응하고, 500 응답은 일시 장애로 간주해 지수 백오프 재시도를 적용합니다. exposureOrder 값을 기준으로 정렬해 사용자 화면에 노출하면 운영 정책과 일관된 사이즈 순서를 유지할 수 있습니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| sizeTypeId | path | integer(int64) | 필수 | 사이즈 타입 번호 |

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

- 응답 `sizeMeasurementType`: `SECTION`, `ROUND`
- 응답 `sizeUnitType`: `CM`, `INCH`, `MM`

### 호출 예시

```bash
curl -X GET 'https://api.commerce.naver.com/external/v1/product-sizes/{sizeTypeId}' \
  -H 'Authorization: Bearer {access_token}'
```