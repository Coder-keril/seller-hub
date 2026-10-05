---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/seller-reject-return-pay-order-seller
---
# POST /v1/pay-order/seller/product-orders/{productOrderId}/claim/return/reject - 반품 거부(철회)

진행 중인 반품 클레임을 판매자가 거부 또는 철회 처리해 반품 흐름을 종료시키는 endpoint로, 클레임 상태 머신에서 반품요청·수거중 상태를 반품철회로 전이시켜 상품 주문을 클레임 직전 상태(배송완료 등)로 되돌립니다. 반품 사유가 부적합하다고 판단되거나 구매자와 합의로 반품을 취소하기로 한 경우, 혹은 회수된 상품에 문제가 있어 환불을 거부해야 하는 경우에 사용합니다. rejectReturnReason은 필수 본문 파라미터로, 거부 또는 철회의 명시적 사유를 텍스트로 기재해야 하며 구매자 알림과 사후 분쟁 대응의 근거가 됩니다. 이미 반품완료로 종결된 건이나 보류 상태인 건은 본 endpoint로 처리되지 않으므로 응답의 successProductOrderIds와 failProductOrderInfos를 분리해 확인하고, 보류 상태라면 먼저 반품 보류 해제 후 재시도합니다. 거부 후에는 환불이 발생하지 않으며 구매자가 다시 반품을 신청할 수 있는 여지가 남으므로 클레임 이력은 completedClaims로 누적됩니다. 400은 상태 전이 불가·사유 누락, 500은 일시 장애로 보고 traceId 기반 재시도와 호출 전 클레임 상태 확인으로 잘못된 거부 처리를 방지합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| productOrderId | path | string | 필수 | 상품 주문 번호 |

### 요청 본문

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| rejectReturnReason | body | string | 필수 | 반품 거부(철회) 사유 |

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
curl -X POST 'https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders/{productOrderId}/claim/return/reject' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```