---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/seller-change-hope-delivery-pay-order-seller
---
# POST /v1/pay-order/seller/product-orders/{productOrderId}/hope-delivery/change - 배송 희망일 변경 처리

희망일 배송 상품 주문의 배송 희망일(과 희망 시간)을 판매자가 변경하는 endpoint로, 결제완료부터 발송 처리 전 단계에서 구매자의 요청이나 판매자의 사정으로 약속된 도착 일정을 조정해야 할 때 사용합니다. hopeDeliveryYmd는 yyyymmdd 형식의 필수 파라미터, hopeDeliveryHm은 HHmm 형식의 선택 파라미터로 시간 단위까지 변경하고 싶을 때 함께 전달하며, region에 지역(1~30자)을 명시할 수 있고 changeReason은 1~300자 범위의 변경 사유 필수 파라미터로 구매자 알림과 사후 분쟁의 근거가 됩니다. 본 endpoint는 희망일 배송 옵션이 설정된 상품 주문에만 유효하므로 일반 상품 주문이나 이미 발송 처리된 건에 호출하면 실패로 분기됩니다. 응답의 successProductOrderIds와 failProductOrderInfos를 분리해 받아 부분 실패는 사유에 맞춰 운영 알림으로 흘리고, 잦은 변경이 발생하지 않도록 호출 전 현재 희망일을 확인합니다. 변경된 희망일이 현실적으로 불가능한 시점이거나 형식이 맞지 않으면 검증에 걸려 거부됩니다. 400은 일자·시간 형식 오류·사유 누락·상태 전이 불가, 500은 일시 장애로 보고 traceId 기반 백오프 재시도와 무한 루프 방지를 적용합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| productOrderId | path | string | 필수 | 상품 주문 번호 |

### 요청 본문

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| hopeDeliveryYmd | body | string | 필수 | 배송 희망일. yyyymmdd 형식의 연월일 |
| hopeDeliveryHm | body | string |  | 배송 희망 시간. HHmm 형식의 시간 |
| region | body | string |  | 지역. 길이 제한 1~30 |
| changeReason | body | string | 필수 | 변경 사유. 길이 제한 1~300 |

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
curl -X POST 'https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders/{productOrderId}/hope-delivery/change' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```