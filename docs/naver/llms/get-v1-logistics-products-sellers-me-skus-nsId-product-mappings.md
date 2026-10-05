---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/get-linked-products-nfa-product
---
# GET /v1/logistics/products/sellers/me/skus/{nsId}/product-mappings - 네이버 SKU 연결상품 조회

이 API는 내 판매자 계정에서 지정한 네이버 SKU(nsId)에 연결된 상품 매핑 정보를 조회할 때 사용합니다. SKU 단위로 어떤 상품과 옵션에 연결되어 있는지 확인하거나, 연동/매핑 설정 이후 결과를 검증하는 운영 시나리오에 적합합니다. 호출 전 해당 SKU가 내 판매자 소유이며 조회 권한이 있는지 확인해야 하며, 존재하지 않거나 접근 권한이 없는 SKU는 정상적으로 조회되지 않을 수 있습니다. 요청이 잘못되면 400 응답으로 반환될 수 있으니 입력 형식과 값의 유효성을 점검한 뒤 재시도하세요. 대상 SKU를 찾을 수 없는 경우 404가 반환될 수 있으며, 이때는 SKU 식별자 및 매핑 존재 여부를 확인하는 것이 좋습니다. 서버 내부 오류로 500이 반환되면 동일 요청을 무한 반복하지 말고 간격을 두고 재시도하되, 문제가 지속되면 로그와 함께 문의하여 원인 분석을 진행하세요.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| nsId | path | string | 필수 | 조회하고자 하는 SKU ID. 재고 구분을 위해 네이버에서 채번한 고유 SKU 관리 코드입니다.<br>- 영문/숫자 조합, 영문 대/소문자 구분, SKU ID당 최대 20자 |
| page | query | integer(int32) |  | 페이지 번호. 첫 번째 페이지 번호는 1입니다.. 최소 1 |
| size | query | integer(int32) |  | 페이지 크기. 페이지당 최대 500건까지 조회할 수 있으며, 총 10만 건까지 조회할 수 있습니다. |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| nsId | - | string | 필수 | 조회한 SKU ID |
| content | - | array | 필수 | 연결상품 목록<br>- 조회 조건에 해당하는 연결상품이 존재하지 않는 경우, 빈 값(empty array)으로 전달합니다. |
| content.channelProductId | - | string |  | 채널 상품 ID |
| content.optionId | - | string |  | 옵션 ID |
| content.pickingQuantityPerOrder | - | integer(int32) |  | 주문당 출고 수량 |
| totalPages | - | integer(int32) | 필수 | 전체 페이지 수. 최소 0 |
| totalElements | - | integer(int64) | 필수 | 전체 연결상품 수. 최소 0 |
| page | - | integer(int32) | 필수 | 현재 페이지 번호. 최소 1 |
| size | - | integer(int32) | 필수 | 페이지 크기. 최소 0 |
| first | - | boolean | 필수 | 첫 번째 페이지 여부 |
| last | - | boolean | 필수 | 마지막 페이지 여부 |

### 에러 코드

| 상태 코드 | 설명 |
|-----------|------|
| 400 | Bad Request |
| 404 | Not Found |
| 500 | API 처리 중 오류 발생<br>- `code`: **server_error** |

### 호출 예시

```bash
curl -X GET 'https://api.commerce.naver.com/external/v1/logistics/products/sellers/me/skus/{nsId}/product-mappings' \
  -H 'Authorization: Bearer {access_token}'
```
