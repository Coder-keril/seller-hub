---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/seller-confirm-placed-product-orders-pay-order-seller
---
# POST /v1/pay-order/seller/product-orders/confirm - 발주 확인 처리

결제완료 상태의 상품 주문에 대해 판매자가 주문을 인지했음을 시스템에 알리는 발주 확인 처리 endpoint로, 이 호출 이후 상품 주문 상태가 발주확인으로 전이되어 발송 처리 또는 발송 지연 처리의 사전 조건이 충족됩니다. productOrderIds 배열로 여러 건을 한 번에 일괄 발주 확인할 수 있으며, 이미 발주 확인된 건이나 클레임이 시작된 건은 처리 대상에서 제외되어 응답의 successProductOrderInfos에 성공한 항목만 담겨 돌아옵니다. 발주 확인은 결제완료 후 일정 기간(미확인 시 자동 발주 확인 또는 자동 취소 정책 대상)이 지나기 전에 수행하는 것이 운영상 권장되며, 실패 항목은 응답에 포함되지 않으므로 호출 후 상품 주문 상세 조회로 상태를 재확인합니다. 동일 productOrderIds로 재호출해도 이미 처리된 건은 무시되므로 idempotent 하게 동작합니다. 400은 식별자 누락이나 형식 오류, 500은 일시 장애 가능성이 높으므로 traceId 기반 재시도와 백오프를 적용해 무한 루프를 방지합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 본문

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| productOrderIds | body | array |  |  |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| timestamp | - | string(date-time) |  |  |
| traceId | - | string | 필수 |  |
| data | - | object |  |  |
| data.successProductOrderInfos | - | array |  |  |
| data.successProductOrderInfos.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |

### 에러 코드

| 상태 코드 | 설명 |
|-----------|------|
| 400 |  |
| 500 |  |

### 호출 예시

```bash
curl -X POST 'https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders/confirm' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```