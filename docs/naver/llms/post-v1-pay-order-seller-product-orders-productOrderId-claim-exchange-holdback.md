---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/seller-holdback-exchange-pay-order-seller
---
# POST /v1/pay-order/seller/product-orders/{productOrderId}/claim/exchange/holdback - 교환 보류

진행 중인 교환 클레임을 판매자가 일시적으로 보류시켜 자동 교환 완료·구매 확정 처리를 멈추는 endpoint로, 교환 배송비나 추가 비용 청구, 교환 상품 미입고·준비 중 같은 사유로 즉시 교환을 진행하기 어려운 상황을 클레임 상태 머신에서 보류 상태로 고정합니다. 보류 사유 코드를 지정해 구매자에게 안내할 상세 사유와 함께 보류를 등록하며, 청구가 필요한 경우에는 추가 비용을 함께 명시합니다. 보류 endpoint는 반드시 페어인 교환 보류 해제(claim/exchange/holdback/release)와 함께 운영되어, 청구가 정산되거나 교환 상품이 준비·입고되면 해제 호출로 보류를 풀고 교환 수거 완료(collect/approve) 또는 재배송(dispatch), 거부(reject) 흐름으로 이어가야 합니다. 400은 상태 전이 불가·필수 값 누락·금액 형식 오류로 보고 요청 전 교환 클레임의 현재 상태와 입력값을 점검해 수정 후 재호출합니다. 500은 일시 장애로 보고 traceId 기반 재시도와 호출 전 클레임 상태 확인으로 중복 보류 등록을 방지합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| productOrderId | path | string | 필수 | 상품 주문 번호 |

### 요청 본문

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| holdbackClassType | body | string | 필수 | 보류 유형. 250바이트 내외<br>코드 \| 설명 \| 비고<br>-----\|-----\|------<br>RETURN_DELIVERYFEE \|	반품 배송비 청구 \|<br>EXTRAFEEE \|	추가 비용 청구 \|<br>RETURN_DELIVERYFEE_AND_EXTRAFEEE \|	반품 배송비 + 추가 비용 청구 \|<br>RETURN_PRODUCT_NOT_DELIVERED \|	반품 상품 미입고 \|<br>ETC \| 기타 사유 \|<br>EXCHANGE_DELIVERYFEE \| 교환 배송비 청구 \|<br>EXCHANGE_EXTRAFEE \|	추가 교환 비용 청구 \|<br>EXCHANGE_PRODUCT_READY \| 교환 상품 준비 중 \|<br>EXCHANGE_PRODUCT_NOT_DELIVERED \| 교환 상품 미입고 \|<br>SELLER_CONFIRM_NEED \| 판매자 확인 필요 \|<br>PURCHASER_CONFIRM_NEED \| 구매자 확인 필요 \|<br>SELLER_REMIT \| 판매자 직접 송금 \| |
| holdbackExchangeDetailReason | body | string | 필수 | 보류 상세 사유 |
| extraExchangeFeeAmount | body | number |  | 기타 교환 비용 |

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
curl -X POST 'https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders/{productOrderId}/claim/exchange/holdback' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```
