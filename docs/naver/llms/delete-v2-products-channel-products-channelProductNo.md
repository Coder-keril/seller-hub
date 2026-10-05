---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/delete-channel-product-product
---
# DELETE /v2/products/channel-products/{channelProductNo} - (v2) 채널 상품 삭제

상품 도메인 v2 에서 채널 상품 한 건을 삭제하는 비가역 작업으로, v2 는 원상품(originProduct)과 채널 상품(channelProduct)이 분리된 구조이기 때문에 채널 상품만 정리하고 원상품은 유지하는 운영에 적합하다. 일반적으로 특정 채널에서만 판매 종료가 필요하거나, 잘못 노출된 채널 매핑을 정리하거나, 마케팅 전략 변경으로 채널 단위 폐기가 필요할 때 호출한다. 삭제 후에는 해당 채널에서의 상품 노출이 즉시 중단되고 진행 중이던 주문 흐름과 분리되므로, 호출 전에 진행 중 주문·교환/반품 잔여 건·재고 차단 여부를 확인해 두는 것이 안전하다. 요청에는 channelProductNo 경로 파라미터로 식별자를 정확히 지정해야 하며, 잘못된 ID 는 400 BAD_REQUEST, 존재하지 않는 ID 는 404 NOT_FOUND 로 반환된다. 권한이 부족하면 403 FORBIDDEN, 토큰 오류는 401 UNAUTHORIZED 로 응답되고, 500 INTERNAL_SERVER_ERROR 는 서버 측 일시 장애이므로 지수 백오프와 함께 제한된 횟수만 재시도한다. 작업 자체는 멱등성을 갖지만 이미 삭제된 자원의 재호출에서는 404 가 반환됨을 일반적인 처리 흐름에 반영해야 한다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| channelProductNo | path | integer(int64) | 필수 |  |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| code | - | string |  | 코드 |
| message | - | string |  | 메시지 |
| data | - | object |  | 데이터 정보 |

### 에러 코드

| 상태 코드 | 설명 |
|-----------|------|
| 400 | 잘못된 요청<br/>- code : BAD_REQUEST |
| 401 | 인가되지 않은 요청<br/>- code : UNAUTHORIZED |
| 403 | 권한 없음<br/>- code : FORBIDDEN |
| 404 | 데이터 없음<br/>- code : NOT_FOUND |
| 500 | 내부 서버 오류<br/>- code : INTERNAL_SERVER_ERROR |

### 호출 예시

```bash
curl -X DELETE 'https://api.commerce.naver.com/external/v2/products/channel-products/{channelProductNo}' \
  -H 'Authorization: Bearer {access_token}'
```