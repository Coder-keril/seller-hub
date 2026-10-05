---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/get-origin-area-list-product
---
# GET /v1/product-origin-areas/query - 원산지 코드 정보 다건 조회

원산지 코드 정보 다건 조회 API는 원산지 코드(code) 또는 상세 지역명(name) 을 조건으로 원산지 마스터를 검색하기 위한 메타 정보 조회 엔드포인트로, 국산은 "광역시도 > 시구군", 수입산은 "대륙 > 국가명", 원양산은 "해역명" 형식의 전체 경로 매칭과 마지막 항목 기준의 LIKE 매칭을 동시에 지원합니다. 상품 등록 화면에서 사용자가 입력한 지역명을 코드로 변환하거나, 코드로부터 표준 명칭을 역조회하는 용도로 사용합니다. code 와 name 중 하나는 반드시 입력해야 하며 둘 다 비어 있으면 400 BAD_REQUEST 가 반환되므로 호출 전에 최소 하나의 조건이 채워져 있는지 확인해야 합니다. 원산지 마스터는 변경 주기가 길기 때문에 자주 조회되는 키워드는 클라이언트 측에서 캐싱해 호출량을 줄이는 것이 효과적이며, 검색 결과가 비어 있는 경우 404 가 아니라 빈 배열이 반환될 수 있어 결과 길이를 먼저 점검합니다. 401·403 응답은 토큰 재발급·권한 확인으로 대응하고, 500 응답은 일시 장애로 간주해 지수 백오프 재시도를 적용합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| name | query | string |  | 원산지 상세 지역명. code를 입력하지 않은 경우 필수.<br>아래와 같은 형식으로 입력하면 전체 이름에 매칭되는 원산지가 반환됩니다.<br>- 국산: 광역시도 > 시구군<br>- 수입산: 대륙 > 국가명<br>- 원양산: 해역명<br>- 기타: 상세 설명에 표시/직접 입력<br>마지막 항목(시구군, 국가명, 해역명)으로 조회하면 LIKE '마지막항목%'으로 검색됩니다. |
| code | query | string |  | 원산지 코드. name을 입력하지 않은 경우 필수. |

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
curl -X GET 'https://api.commerce.naver.com/external/v1/product-origin-areas/query' \
  -H 'Authorization: Bearer {access_token}'
```