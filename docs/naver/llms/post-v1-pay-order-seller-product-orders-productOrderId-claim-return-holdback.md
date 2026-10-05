---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/seller-holdback-return-pay-order-seller
---
# POST /v1/pay-order/seller/product-orders/{productOrderId}/claim/return/holdback - 반품 보류

진행 중인 반품 클레임을 판매자가 일시적으로 보류시켜 자동 환불·반품 완료 처리를 멈추는 endpoint로, 반품 배송비나 추가 비용 청구, 반품 상품 미입고 같은 사유로 즉시 환불을 확정하면 안 되는 상황을 클레임 상태 머신에서 보류 상태로 고정합니다. 보류 사유 코드는 필수이며 RETURN_DELIVERYFEE(반품 배송비 청구), EXTRAFEEE(추가 비용 청구), RETURN_DELIVERYFEE_AND_EXTRAFEEE(반품 배송비 + 추가 비용 청구), RETURN_PRODUCT_NOT_DELIVERED(반품 상품 미입고), ETC(기타) 중 하나를 선택합니다. 구매자에게 노출될 상세 사유도 필수로 기재하고, 청구 금액이 있는 경우 추가 반품 비용도 함께 명시합니다. 보류 endpoint는 반드시 페어인 반품 보류 해제(claim/return/holdback/release)와 함께 운영되어, 협의가 끝나거나 청구가 정산되면 해제 호출로 보류를 풀고 반품 승인 또는 거부 흐름으로 이어가야 합니다. 400은 상태 전이 불가·사유 코드 누락·금액 형식 오류, 500은 일시 장애로 보고 traceId 기반 재시도와 호출 전 클레임 상태 확인으로 중복 보류 등록을 방지합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| productOrderId | path | string | 필수 | 상품 주문 번호 |

### 요청 본문

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| holdbackClassType | body | string | 필수 | 보류 유형. 250바이트 내외<br>코드 \| 설명 \| 비고<br>-----\|-----\|------<br>RETURN_DELIVERYFEE \|	반품 배송비 청구 \|<br>EXTRAFEEE \|	추가 비용 청구 \|<br>RETURN_DELIVERYFEE_AND_EXTRAFEEE \|	반품 배송비 + 추가 비용 청구 \|<br>RETURN_PRODUCT_NOT_DELIVERED \|	반품 상품 미입고 \|<br>ETC \| 기타 사유 \|<br>EXCHANGE_DELIVERYFEE \| 교환 배송비 청구 \|<br>EXCHANGE_EXTRAFEE \|	추가 교환 비용 청구 \|<br>EXCHANGE_PRODUCT_READY \| 교환 상품 준비 중 \|<br>EXCHANGE_PRODUCT_NOT_DELIVERED \| 교환 상품 미입고 \|<br>SELLER_CONFIRM_NEED \| 판매자 확인 필요 \|<br>PURCHASER_CONFIRM_NEED \| 구매자 확인 필요 \|<br>SELLER_REMIT \| 판매자 직접 송금 \| |
| holdbackReturnDetailReason | body | string | 필수 | 보류 상세 사유 |
| extraReturnFeeAmount | body | number |  | 기타 반품 비용 |

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
curl -X POST 'https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders/{productOrderId}/claim/return/holdback' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```
