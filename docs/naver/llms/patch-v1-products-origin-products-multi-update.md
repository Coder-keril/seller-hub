---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/update-multi-products-product
---
# PATCH /v1/products/origin-products/multi-update - 멀티 상품 변경

멀티 상품 변경 API는 다수의 원상품에 대해 판매가(SALE_PRICE)·기본 할인(IMMEDIATE_DISCOUNT)·재고(STOCK)·판매 상태(PRODUCT_STATUS_SALE·PRODUCT_STATUS_SUSPENSION) 를 한 번의 PATCH 호출로 일괄 변경하기 위한 엔드포인트로, 운영자가 운영 화면에서 다건의 상품 속성을 동시에 갱신하는 케이스에 사용합니다. 요청 본문의 multiProductUpdateRequestVos 배열에는 originProductNo 와 함께 변경 대상 영역을 명시하는 multiUpdateTypes 와 해당 영역에 매칭되는 값(productSalePrice·immediateDiscountPolicy·stockQuantity 등) 을 지정해야 하며, immediateDiscountPolicy 의 mobileDiscountMethod 는 무시되고 추후 오류 응답이 반환될 수 있으므로 discountMethod 만 사용합니다. 본 API 는 idempotency 가 항목 단위로 보장되지 않으므로 동일 페이로드를 중복 호출하면 가격·재고 등이 의도와 다르게 누적·중복 적용될 수 있어, 클라이언트 측에서 요청 ID 또는 변경 사유를 함께 관리하고 네트워크 타임아웃 시 재시도 전에 최신 상태를 다시 조회해 비교하는 것이 안전합니다. 트랜잭션은 전체 배열 단위가 아닌 항목 단위로 처리될 수 있으므로 응답의 code·message·data 를 항목별로 점검해 부분 실패 케이스를 보정해야 하고, 한 번에 보내는 항목 수가 지나치게 많으면 응답 지연과 부분 실패 위험이 커지므로 적정 배치 크기로 분할 호출합니다. 400 응답은 페이로드 형식·enum 값 오류로 보고 요청 내용을 수정하고, 401·403 응답은 토큰 재발급·권한 확인으로 대응하며, 404 응답은 대상 원상품의 존재 여부를 재확인합니다. 500 응답은 일시 장애로 간주해 지수 백오프 재시도를 적용하고, 308 응답이 반환될 수 있으므로 클라이언트는 리다이렉션을 따라가도록 설정합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 본문

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| multiProductUpdateRequestVos | body | array | 필수 |  |
| multiProductUpdateRequestVos.originProductNo | body | integer(int64) | 필수 |  |
| multiProductUpdateRequestVos.multiUpdateTypes | body | array | 필수 | - SALE_PRICE(판매가), IMMEDIATE_DISCOUNT(기본 할인), STOCK(재고 변경), PRODUCT_STATUS_SALE(판매 중 변경), PRODUCT_STATUS_SUSPENSION(판매 중지 변경) |
| multiProductUpdateRequestVos.multiUpdateTypes.… | body | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| multiProductUpdateRequestVos.productSalePrice | body | object |  | 판매가 정보 |
| multiProductUpdateRequestVos.productSalePrice.… | body | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| multiProductUpdateRequestVos.immediateDiscountPolicy | body | object |  | mobileDiscountMethod로 설정한 값은 무시됩니다. 추후 오류 응답이 반환될 수 있으므로 discountMethod를 사용하세요. |
| multiProductUpdateRequestVos.immediateDiscountPolicy.… | body | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| multiProductUpdateRequestVos.stockQuantity | body | integer(int32) |  |  |

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

### 사용 enum 카탈로그

- 요청 본문 `multiProductUpdateRequestVos[].multiUpdateTypes[]`: `SALE_PRICE`, `IMMEDIATE_DISCOUNT`, `STOCK`, `PRODUCT_STATUS_SALE`, `PRODUCT_STATUS_SUSPENSION`
- 요청 본문 `multiProductUpdateRequestVos[].immediateDiscountPolicy.discountMethod.unitType`: `PERCENT`, `WON`, `YEN`, `COUNT`

### 호출 예시

```bash
curl -X PATCH 'https://api.commerce.naver.com/external/v1/products/origin-products/multi-update' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```
