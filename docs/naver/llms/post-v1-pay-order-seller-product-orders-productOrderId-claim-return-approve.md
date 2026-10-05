---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/seller-approve-return-pay-order-seller
---
# POST /v1/pay-order/seller/product-orders/{productOrderId}/claim/return/approve - 반품 승인

반품 수거가 완료된 상품 주문의 클레임을 판매자가 승인해 반품완료로 전이시키는 endpoint로, 클레임 상태 머신에서 반품요청 -> 반품수거완료 -> 반품완료 단계의 마지막을 마무리하고 환불을 확정합니다. path의 productOrderId만 받으며 본문이 필요 없고, 보류(holdback) 상태인 건은 먼저 반품 보류 해제(holdback/release)를 호출한 뒤 본 endpoint로 승인해야 합니다. 승인 시점에 결제 환불이 자동 처리되며, 반품 배송비나 추가 비용 청구가 필요한 경우 사전에 반품 보류(holdback) 흐름으로 청구 항목을 확정한 뒤 해제·승인 순서로 마무리하는 운영이 일반적입니다. 응답의 successProductOrderIds와 failProductOrderInfos를 분리해 받아 부분 실패에 대응하며, 이미 승인된 건이나 반품 요청이 없는 건은 처리 대상에서 제외되어 idempotent 하게 동작합니다. 400은 상태 전이 불가나 보류 중 상태, 500은 일시 장애로 보고 traceId 기반 백오프 재시도와 호출 전 currentClaim 상태 확인으로 중복 승인을 방지합니다.

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
curl -X POST 'https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders/{productOrderId}/claim/return/approve' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```