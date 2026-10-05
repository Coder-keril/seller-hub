---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/seller-request-cancel-pay-order-seller
---
# POST /v1/pay-order/seller/product-orders/{productOrderId}/claim/cancel/request - 취소 요청

아직 발송되지 않은 상품 주문에 대해 판매자가 취소 클레임을 시작하는 endpoint로, 클레임 상태 머신의 첫 단계인 취소요청 상태를 생성합니다. 발송 처리 전 상태(결제완료·발주확인·발송지연)에서만 호출이 가능하며 이미 발송된 상품 주문에 대한 환수는 반품 클레임 흐름으로 처리해야 합니다. cancelReason은 필수 enum(INTENT_CHANGED·COLOR_AND_SIZE·WRONG_ORDER·PRODUCT_UNSATISFIED·DELAYED_DELIVERY·SOLD_OUT·INCORRECT_INFO 중 하나)이며, cancelDetailedReason에 500자 한도의 부연 사유를 남기고 cancelQuantity를 지정하면 부분 수량 취소, 생략하면 전체 수량 취소로 동작합니다. 요청이 정상 수락되면 후속으로 취소 요청 승인(approve) endpoint를 호출해 클레임을 종료시키는 페어 호출이 일반적이며, 결제 환불은 승인 시점에 자동 처리됩니다. 응답의 successProductOrderIds로 성공, failProductOrderInfos로 실패 사유를 분리해 받으므로 부분 실패 시 사유별로 분기합니다. 400은 상태 전이 불가·사유 누락·수량 초과, 500은 일시 장애로 보고 traceId 기반 재시도와 동일 사유 재호출 시 중복 클레임 방지를 위해 상품 주문 상세 조회로 현재 클레임 상태를 먼저 확인합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| productOrderId | path | string | 필수 | 상품 주문 번호 |

### 요청 본문

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| cancelReason | body | string | 필수 | 클레임 요청 사유. 250바이트 내외<br>코드 \| 설명 \| 비고<br>-----\|-----\|------<br>INTENT_CHANGED \| 구매 의사 취소 \|<br>COLOR_AND_SIZE \| 색상 및 사이즈 변경 \|<br>WRONG_ORDER \| 다른 상품 잘못 주문 \|<br>PRODUCT_UNSATISFIED \| 서비스 불만족 \|<br>DELAYED_DELIVERY \| 배송 지연 \|<br>SOLD_OUT \| 상품 품절 \|<br>INCORRECT_INFO \| 상품 정보 상이 \| |
| cancelDetailedReason | body | string |  | 취소 상세 사유. 500자 제한 |
| cancelQuantity | body | integer |  | 취소 수량 (미입력 시 전체수량취소) |

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
curl -X POST 'https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders/{productOrderId}/claim/cancel/request' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```