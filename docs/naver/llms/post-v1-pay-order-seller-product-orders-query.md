---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/seller-get-product-orders-pay-order-seller
---
# POST /v1/pay-order/seller/product-orders/query - 상품 주문 상세 내역 조회

요청 본문의 productOrderIds(필수, 최대 300개)에 상품 주문 번호 목록을 담아 한 번에 다건의 상품 주문 상세 내역을 조회하는 endpoint로, 주문(order)·상품 주문(productOrder)·클레임(currentClaim·completedClaims)·배송(delivery) 정보까지 한 응답에 묶어 반환합니다. 변경 상품 주문 내역 조회(last-changed-statuses)로 변경 식별자만 수집한 뒤, 동기화가 필요한 상품 주문들을 묶어 본 API로 풀세부 데이터를 끌어오는 폴링 파이프라인의 후속 단계로 주로 사용됩니다. 응답의 data는 상품 주문 상세 항목 배열로 제공되며, 클레임 정보는 제거 예정인 cancel·return·exchange 대신 currentClaim 하위의 같은 객체를 쓰고, 그룹상품 번호(groupProductId)는 productOrder 하위에 숫자 타입으로 내려옵니다. 완료된 클레임 정보에서는 claimRequestReason이 문자열로 제공됩니다. 한 요청에서 식별자 단위로 일부만 조회 실패할 수 있으므로 응답 길이와 요청 길이를 비교해 누락 여부를 확인합니다. 400은 요청 본문 누락이나 형식 오류로 보고 입력값 검증 후 재호출하며, 500은 일시적 장애로 보고 traceId 기반 재시도와 무한 루프 방지를 적용합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 본문

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| productOrderIds | body | array | 필수 |  |
| quantityClaimCompatibility | body | boolean |  | 수량클레임 변경사항 개발 대응 완료 여부 (수량클레임 변경사항에 대한 개발 대응 완료 시 true 값으로 호출) |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| timestamp | - | string(date-time) |  |  |
| traceId | - | string | 필수 |  |
| data | - | array |  |  |
| data.order | - | object |  |  |
| data.order.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| data.productOrder | - | object |  |  |
| data.productOrder.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| data.cancel | - | object |  | 취소 (2025년 상반기 중 제거 예정. currentClaim 하위의 동일 오브젝트 사용 권장.) |
| data.cancel.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| data.return | - | object |  | 반품 (2025년 상반기 중 제거 예정. currentClaim 하위의 동일 오브젝트 사용 권장.) |
| data.return.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| data.exchange | - | object |  | 교환 (2025년 상반기 중 제거 예정. currentClaim 하위의 동일 오브젝트 사용 권장.) |
| data.exchange.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| data.beforeClaim | - | object |  |  |
| data.beforeClaim.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| data.currentClaim | - | object |  |  |
| data.currentClaim.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| data.completedClaims | - | array |  |  |
| data.completedClaims.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| data.delivery | - | object |  |  |
| data.delivery.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |

### 에러 코드

| 상태 코드 | 설명 |
|-----------|------|
| 400 |  |
| 500 |  |

### 사용 enum 카탈로그

- 응답 `data[].productOrder.shippingAddress.pickupLocationType`: `FRONT_OF_DOOR`, `MANAGEMENT_OFFICE`, `DIRECT_RECEIVE`, `OTHER`
- 응답 `data[].productOrder.shippingAddress.entryMethod`: `LOBBY_PW`, `MANAGEMENT_OFFICE`, `FREE`, `OTHER`
- 응답 `data[].productOrder.sellerBurdenMultiplePurchaseDiscountType`: `IGNORE_QUANTITY`, `QUANTITY`

### 호출 예시

```bash
curl -X POST 'https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders/query' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```
