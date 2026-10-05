---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/seller-reject-exchange-pay-order-seller
---
# POST /v1/pay-order/seller/product-orders/{productOrderId}/claim/exchange/reject - 교환 거부(철회)

진행 중인 교환 클레임을 판매자가 거부 또는 철회 처리해 교환 흐름을 종료시키는 endpoint로, 클레임 상태 머신에서 교환요청·교환수거중 같은 상태를 교환철회로 전이시켜 상품 주문을 클레임 직전 상태(배송완료 등)로 되돌립니다. 교환 사유가 부적합하거나 구매자 협의로 교환을 취소하기로 한 경우, 회수된 상품에 문제가 있어 교환 재발송을 진행하기 어려운 경우에 사용합니다. rejectExchangeReason은 필수 본문 파라미터로, 거부 또는 철회의 명시적 사유를 텍스트로 기재해 구매자 알림 및 사후 분쟁 대응의 근거로 남깁니다. 이미 교환 완료로 종결된 건이나 보류 상태인 건은 본 endpoint로 처리되지 않으므로 응답의 successProductOrderIds와 failProductOrderInfos를 분리해 확인하고, 보류 상태라면 먼저 교환 보류 해제 후 재시도해야 합니다. 거부 이후에는 교환이 발생하지 않으며 클레임 이력은 completedClaims로 누적되어 동일 productOrderId에 대해 구매자가 반품으로 분기하거나 새로운 교환을 신청할 수 있습니다. 400은 상태 전이 불가·사유 누락, 500은 일시 장애로 보고 traceId 기반 재시도와 호출 전 클레임 상태 확인으로 잘못된 거부 처리를 방지합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| productOrderId | path | string | 필수 | 상품 주문 번호 |

### 요청 본문

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| rejectExchangeReason | body | string | 필수 | 교환 거부(철회) 사유 |

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
curl -X POST 'https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders/{productOrderId}/claim/exchange/reject' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```