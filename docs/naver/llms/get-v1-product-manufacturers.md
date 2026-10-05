---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/get-manufacturer-list-product
---
# GET /v1/product-manufacturers - 제조사 조회

제조사 조회 API는 네이버 커머스에 등록된 제조사 마스터 데이터를 이름으로 검색해 상품 등록 시 사용할 제조사 식별자를 확보하기 위한 메타 정보 조회 엔드포인트입니다. 응답은 검색된 제조사 ID와 이름 목록으로 구성되며, 상품 등록·수정 시 제조사 코드를 채워 넣기 위한 선행 호출로 자주 사용됩니다. 제조사 마스터는 빈번하게 변하지 않으므로 클라이언트 측에서 캐싱해 호출 빈도를 줄이는 것이 권장되며, 동일한 이름 키워드에 대해 반복 호출하지 않도록 결과를 메모이즈해 두면 좋습니다. name 파라미터는 필수이므로 누락 시 400 BAD_REQUEST 가 반환되며, 매칭되는 제조사가 없으면 404 NOT_FOUND 로 응답될 수 있어 신규 제조사 등록이 필요한 케이스로 분기 처리해야 합니다. 401·403 응답은 토큰 만료나 권한 부족을 의미하므로 토큰을 재발급한 뒤 재시도하고, 500 응답은 일시적 장애일 수 있어 지수 백오프 기반 재시도 정책을 적용하는 것이 안전합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| name | query | string | 필수 | 검색할 제조사 이름 |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| id | - | integer(int64) |  | 브랜드나 제조사 등의 ID 값 |
| name | - | string |  | 브랜드나 제조사 등의 이름 |

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
curl -X GET 'https://api.commerce.naver.com/external/v1/product-manufacturers?name={name}' \
  -H 'Authorization: Bearer {access_token}'
```