---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/seller-get-product-order-ids-pay-order-seller
---
# GET /v1/pay-order/seller/orders/{orderId}/product-order-ids - 상품 주문 목록 조회

하나의 주문(orderId) 아래 묶인 모든 상품 주문 번호(productOrderId) 목록을 조회하는 endpoint로, 주문 단계의 식별자에서 상품 주문 단계의 식별자로 내려가는 매핑 역할을 합니다. 네이버 커머스에서는 결제는 주문 단위로 일어나지만 발주 확인, 발송, 클레임(취소·반품·교환) 등의 후속 처리는 모두 상품 주문 단위로 수행되므로, 주문 번호만 가진 상태에서 상세 처리 endpoint를 호출하려면 본 API로 상품 주문 번호를 먼저 얻어야 합니다. orderId는 path 필수 파라미터이며 응답 data 배열에는 해당 주문에 속한 상품 주문 번호들이 담겨 내려옵니다. 이어서 상품 주문 상세 내역 조회나 상태 변경 endpoint들에 이 값을 그대로 전달해 후속 처리를 수행하는 흐름이 일반적입니다. 400은 orderId 형식이나 권한 범위 문제, 500은 일시적 장애 가능성이 높으므로 traceId를 로그로 남기고 백오프 재시도 정책을 적용합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| orderId | path | string | 필수 | 주문 번호 |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| timestamp | - | string(date-time) |  |  |
| traceId | - | string | 필수 |  |
| data | - | array |  |  |

### 에러 코드

| 상태 코드 | 설명 |
|-----------|------|
| 400 |  |
| 500 |  |

### 호출 예시

```bash
curl -X GET 'https://api.commerce.naver.com/external/v1/pay-order/seller/orders/{orderId}/product-order-ids' \
  -H 'Authorization: Bearer {access_token}'
```