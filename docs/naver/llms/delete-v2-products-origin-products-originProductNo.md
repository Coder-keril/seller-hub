---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/delete-origin-product-product
---
# DELETE /v2/products/origin-products/{originProductNo} - (v2) 원상품 삭제

상품 도메인 v2 에서 원상품 한 건을 삭제하는 비가역 작업으로, v2 의 원상품·채널 상품 분리 구조에서 마스터 데이터에 해당하는 원상품을 제거하면 그에 연결된 채널 상품 또한 정상적인 노출·판매 흐름을 유지하기 어렵기 때문에 일반적으로는 사전에 채널 상품을 먼저 정리한 뒤 호출하는 흐름이 권장된다. 주된 사용 사례는 단종 상품 정리, 잘못 등록된 마스터 데이터 회수, 그룹상품 재편성 전 정리 등이다. 요청에는 originProductNo 경로 파라미터로 식별자를 명확히 지정해야 하며, 형식 오류는 400 BAD_REQUEST, 존재하지 않는 ID 는 404 NOT_FOUND 로 응답된다. 권한이 부족하면 403 FORBIDDEN, 인증 토큰 문제는 401 UNAUTHORIZED 로 분리되어 반환되므로 호출 전 토큰 갱신과 권한 매트릭스를 점검할 것을 권장한다. 500 INTERNAL_SERVER_ERROR 는 서버 일시 장애로 간주하여 지수 백오프 기반의 제한된 재시도만 적용하고, 멱등성이 있으나 이미 삭제된 자원의 재호출은 404 로 반환된다는 점을 처리 로직에 반영한다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| originProductNo | path | integer(int64) | 필수 |  |

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
curl -X DELETE 'https://api.commerce.naver.com/external/v2/products/origin-products/{originProductNo}' \
  -H 'Authorization: Bearer {access_token}'
```