---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/seller-approve-cancel-application-pay-order-seller
---
# POST /v1/pay-order/seller/product-orders/{productOrderId}/claim/cancel/approve - 취소 요청 승인

취소요청 상태인 상품 주문의 클레임을 판매자가 승인해 취소 완료로 전이시키는 endpoint로, 클레임 상태 머신에서 취소요청 -> 취소완료 단계를 마무리하고 결제 환불을 트리거합니다. 구매자가 발송 전 직접 취소를 신청한 경우나, 판매자가 직접 취소 요청(claim/cancel/request)을 만든 경우 모두 본 endpoint로 승인 처리를 진행할 수 있습니다. 요청은 path의 productOrderId만으로 동작하며 별도 본문이 필요 없고, 이미 승인되어 종료된 건이나 취소 요청이 존재하지 않는 건은 처리되지 않으므로 응답의 successProductOrderIds와 failProductOrderInfos를 분리해 확인합니다. 승인 시점에 결제 시스템이 환불 처리를 수행하며 환불 금액·시기는 결제 수단과 정책에 따라 결정됩니다. 동일 productOrderId로 재호출해도 이미 완료된 건은 무시되므로 idempotent 하게 동작하지만, 운영상 중복 호출 방지를 위해 호출 전 상품 주문 상세로 currentClaim 상태를 확인하는 것이 안전합니다. 400은 취소 요청이 없거나 상태 전이 불가, 500은 일시 장애로 보고 traceId 기반 백오프 재시도와 무한 루프 방지를 적용합니다.

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
curl -X POST 'https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders/{productOrderId}/claim/cancel/approve' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```