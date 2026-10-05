---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/seller-release-return-holdback-pay-order-seller
---
# POST /v1/pay-order/seller/product-orders/{productOrderId}/claim/return/holdback/release - 반품 보류 해제

반품 보류 상태로 고정된 클레임의 보류 플래그를 풀어 다시 정상적인 반품 흐름으로 되돌리는 endpoint로, 반품 보류(claim/return/holdback)와 페어를 이루며 보류 사유가 해소된 시점에 호출합니다. 반품 배송비나 추가 비용이 정산되었거나, 미입고였던 반품 상품이 입고되었거나, 구매자 협의가 완료된 상황에서 본 endpoint를 호출하면 클레임 상태 머신이 보류 -> 반품요청·수거 진행 상태로 복귀해 이후 반품 승인(approve) 또는 거부(reject)로 마무리할 수 있게 됩니다. path의 productOrderId만 받으며 별도 본문이 필요 없고, 보류 상태가 아닌 건이나 이미 반품완료로 종결된 건은 처리 대상이 아니므로 응답의 successProductOrderIds와 failProductOrderInfos를 분리해 확인합니다. 해제 후에는 자동 환불·반품 완료 처리가 다시 가능해지므로 호출 직후 반품 승인 또는 거부 호출까지 함께 이어가는 운영이 일반적입니다. 동일 productOrderId로 재호출해도 이미 해제된 건은 무시되어 idempotent 하게 동작합니다. 400은 상태 전이 불가, 500은 일시 장애로 보고 traceId 기반 백오프 재시도와 클레임 상태 사전 조회로 잘못된 해제 호출을 방지합니다.

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
curl -X POST 'https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders/{productOrderId}/claim/return/holdback/release' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```