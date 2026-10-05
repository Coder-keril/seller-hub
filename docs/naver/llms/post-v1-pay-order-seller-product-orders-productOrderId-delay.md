---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/seller-delay-dispatch-due-date-pay-order-seller
---
# POST /v1/pay-order/seller/product-orders/{productOrderId}/delay - 발송 지연 처리

발주 확인된 상품 주문의 발송 기한을 늦추고 지연 사유를 남기는 발송 지연 처리 endpoint로, 결제완료부터 발송까지의 흐름에서 발송 약속일을 지키지 못할 때 클레임이나 자동 취소로 이어지지 않도록 상태를 발송지연으로 전환하는 단계입니다. 상품 준비 중(PRODUCT_PREPARE), 고객 요청(CUSTOMER_REQUEST), 주문 제작(CUSTOM_BUILD), 예약 발송(RESERVED_DISPATCH), 해외 배송(OVERSEA_DELIVERY), 기타(ETC) 중 하나를 delayedDispatchReason으로 지정하고 dispatchDueDate에 새 발송 기한을 ISO 8601 일시로 넣으며, 필요 시 dispatchDelayedDetailedReason에 부연 사유를 기재합니다. 미발송 클레임이 진행 중이거나 이미 발송 처리된 상품 주문은 처리되지 않으므로 응답의 successProductOrderIds와 failProductOrderInfos를 함께 확인해 실패 건은 사유에 맞게 분기합니다. dispatchDueDate를 과거나 비현실적으로 먼 미래로 지정하면 검증에 걸릴 수 있고, 동일 productOrderId로 여러 차례 호출하면 최신 호출값이 반영됩니다. 400은 파라미터 검증·상태 전이 불가, 500은 일시 장애로 보고 traceId를 남긴 후 백오프 재시도와 무한 루프 방지를 적용합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| productOrderId | path | string | 필수 | 상품 주문 번호 |

### 요청 본문

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| dispatchDueDate | body | string(date-time) |  | 발송 기한 |
| delayedDispatchReason | body | string |  | 발송 지연 사유 코드. 250바이트 내외<br>코드 \| 설명 \| 비고<br>-----\|-----\|------<br>PRODUCT_PREPARE \| 상품 준비 중 \|<br>CUSTOMER_REQUEST \| 고객 요청 \|<br>CUSTOM_BUILD \| 주문 제작 \|<br>RESERVED_DISPATCH \| 예약 발송 \|<br>OVERSEA_DELIVERY \| 해외 배송 \|<br>ETC \| 기타 \| |
| dispatchDelayedDetailedReason | body | string |  | 발송 지연 상세 사유 |

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
curl -X POST 'https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders/{productOrderId}/delay' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```