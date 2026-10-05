---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/get-return-delivery-company-list-product
---
# GET /v2/product-delivery-info/return-delivery-companies - (v2) 반품 택배사 다건 조회

(v2) 반품 택배사 다건 조회 API는 네이버 커머스가 관리하는 반품·교환 가능 택배사 마스터 목록을 받아오기 위한 메타 정보 조회 엔드포인트로, name 파라미터를 사용해 택배사명 prefix 기반 LIKE 검색을 지원합니다. 응답에는 택배사 ID·이름과 함께 우선순위 유형(PRIMARY·SECONDARY_1~9) 이 포함되므로, 상품 등록·수정 시 반품 택배사 정보를 채우거나 사용자 화면의 셀렉트 박스를 우선순위 순으로 정렬해 노출하는 데 사용합니다. 택배사 마스터는 변경 주기가 길기 때문에 클라이언트 측에서 캐싱해 호출량을 줄이는 것이 권장되며, 일 단위 정도의 갱신 주기로 충분합니다. v2 응답 스키마에는 우선순위 유형이 enum 으로 노출되므로 값을 비교할 때 OAS 에 정의된 코드와 일치하는지 검증해야 합니다. name 형식이 잘못되거나 결과가 없을 경우 빈 배열이 반환될 수 있어 후처리에서 길이 점검이 필요하고, 401·403 응답은 토큰 재발급·권한 확인으로 대응하며, 500 응답은 일시 장애로 간주해 지수 백오프 재시도를 적용합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| name | query | string |  | 반품/교환 택배사명. LIKE '반품/교환 택배사명%' 검색 |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| returnDeliveryCompanies | - | array |  |  |
| returnDeliveryCompanies.id | - | integer(int64) |  |  |
| returnDeliveryCompanies.name | - | string |  |  |
| returnDeliveryCompanies.returnDeliveryCompanyPriorityType | - | string |  | 허용값: `PRIMARY`, `SECONDARY_1`, `SECONDARY_2`, `SECONDARY_3`, `SECONDARY_4`, `SECONDARY_5`, `SECONDARY_6`, `SECONDARY_7`, `SECONDARY_8`, `SECONDARY_9` |

### 에러 코드

| 상태 코드 | 설명 |
|-----------|------|
| 400 | 잘못된 요청<br/>- code : BAD_REQUEST |
| 401 | 인가되지 않은 요청<br/>- code : UNAUTHORIZED |
| 403 | 권한 없음<br/>- code : FORBIDDEN |
| 404 | 데이터 없음<br/>- code : NOT_FOUND |
| 500 | 내부 서버 오류<br/>- code : INTERNAL_SERVER_ERROR |

### 사용 enum 카탈로그

- 응답 `returnDeliveryCompanies[].returnDeliveryCompanyPriorityType`: `PRIMARY`, `SECONDARY_1`, `SECONDARY_2`, `SECONDARY_3`, `SECONDARY_4`, `SECONDARY_5`, `SECONDARY_6`, `SECONDARY_7`, `SECONDARY_8`, `SECONDARY_9`

### 호출 예시

```bash
curl -X GET 'https://api.commerce.naver.com/external/v2/product-delivery-info/return-delivery-companies' \
  -H 'Authorization: Bearer {access_token}'
```