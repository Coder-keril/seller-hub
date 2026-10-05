---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/get-all-origin-area-list-product
---
# GET /v1/product-origin-areas - 원산지 코드 정보 전체 조회

원산지 코드 정보 전체 조회 API는 네이버 커머스가 관리하는 상품 원산지 코드 마스터 전체 목록을 한 번에 받아오기 위한 메타 정보 조회 엔드포인트로, 응답에는 원산지 코드와 이름 쌍의 배열이 포함됩니다. 국산·수입산·원양산·기타로 구분되는 원산지 체계의 최상위 코드 집합을 확보해 상품 등록 시 원산지 필드를 채우거나 사용자 화면의 셀렉트 박스를 채우는 용도로 사용합니다. 원산지 코드 마스터는 변경 주기가 매우 길기 때문에 클라이언트 측에서 적극적으로 캐싱해 재호출을 최소화하는 것이 권장되며, 필요한 경우 일 단위 정도의 갱신 주기로 충분합니다. 파라미터 없이 호출 가능한 단순 엔드포인트이지만 401·403 응답이 발생할 수 있으므로 토큰 만료·권한 부족 시 재발급 후 재시도해야 하고, 500 응답은 일시 장애로 간주해 지수 백오프 재시도 정책을 적용합니다. 하위 지역까지 좁혀 조회해야 하는 경우에는 하위 원산지 코드 조회 API를 후속 호출해 단계적으로 확인합니다.

> Base URL: https://api.commerce.naver.com/external

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| originAreaCodeNames | - | array |  |  |
| originAreaCodeNames.code | - | string |  |  |
| originAreaCodeNames.name | - | string |  |  |

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
curl -X GET 'https://api.commerce.naver.com/external/v1/product-origin-areas' \
  -H 'Authorization: Bearer {access_token}'
```