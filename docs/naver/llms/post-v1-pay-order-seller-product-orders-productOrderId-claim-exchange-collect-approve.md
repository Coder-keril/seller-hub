---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/seller-approve-collected-exchange-pay-order-seller
---
# POST /v1/pay-order/seller/product-orders/{productOrderId}/claim/exchange/collect/approve - 교환 수거 완료

교환 클레임에서 구매자로부터 회수된 상품을 판매자가 정상 입고로 인정해 수거 완료로 확정하는 endpoint로, 클레임 상태 머신에서 교환수거중 -> 교환수거완료 단계를 마무리하고 이후 교환 재배송(exchange/dispatch)을 호출할 수 있는 상태로 만듭니다. path의 productOrderId만 받으며 별도 본문이 필요 없고, 수거 송장이 등록되지 않았거나 수거가 아직 진행 중인 건은 처리 대상에서 제외되므로 응답의 successProductOrderIds와 failProductOrderInfos를 분리해 확인합니다. 회수된 상품에 문제가 있어 교환 진행이 어려운 경우 본 endpoint 대신 교환 거부(exchange/reject)로 분기하거나 교환 보류(exchange/holdback)로 비용 청구·미입고 사유를 등록한 뒤 협의에 따라 흐름을 결정합니다. 동일 productOrderId로 재호출해도 이미 완료 처리된 건은 무시되어 idempotent 하게 동작합니다. 400은 상태 전이 불가나 수거 미진행, 500은 일시 장애로 보고 traceId 기반 재시도와 호출 전 currentClaim 상태 조회로 잘못된 수거 완료 처리를 방지합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| productOrderId | path | string | 필수 | 상품 주문 번호 |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| timestamp | - | string(date-time) |  |  |
| traceId | - | string | 필수 |  |
| data | - | object |  |  |
| data.successProductOrderIds | - | array |  | (성공) 상품 주문 번호 |
| data.successProductOrderIds.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| data.failProductOrderInfos | - | array |  |  |
| data.failProductOrderInfos.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |

### 에러 코드

| 상태 코드 | 설명 |
|-----------|------|
| 400 |  |
| 500 |  |

### 호출 예시

```bash
curl -X POST 'https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders/{productOrderId}/claim/exchange/collect/approve' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```