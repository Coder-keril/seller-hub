---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/bulk-update-origin-product-product
---
# PUT /v1/products/origin-products/bulk-update - 상품 벌크 업데이트

이 API는 다수 원상품(originProductNos) 을 한 번의 호출로 일괄 수정하는 v1 상품 일괄 수정 엔드포인트로, productBulkUpdateType 으로 IMMEDIATE_DISCOUNT(기본 할인)·SALE_PRICE(판매가)·SALE_PERIOD(판매 기간)·DELIVERY(배송 정보)·DELIVERY_ATTRIBUTE(배송 속성)·DELIVERY_HOPE(희망일배송)·PURCHASE_BENEFIT(구매/리뷰 혜택)·PURCHASE_QUANTITY_LIMIT(구매 수량 제한) 중 하나의 변경 영역을 지정한 뒤 해당 영역의 본문 객체만 채워 보냅니다. 일반적인 사용 사례는 시즌 프로모션 시 다수 상품의 즉시 할인 정책·판매가를 일괄 변경하거나, 배송망 변경에 맞춰 묶음배송 그룹·배송 속성을 일괄 갱신하거나, 희망일배송 그룹 ID 를 다수 상품에 동시에 적용하는 것입니다. 일괄 업데이트는 단일 트랜잭션으로 묶이지 않아 일부 항목만 성공할 수 있으므로 응답의 code·message·data 와 사후 조회로 적용 결과를 재확인해야 하며, 동일 요청을 재시도하면 이미 변경된 항목에 대해 중복 효과가 발생하지 않는 idempotent 한 갱신이 되도록 입력값을 멱등하게 설계하는 것이 안전합니다. product.detailAttribute 객체를 통해 상품의 상세 속성을 함께 갱신할 수 있으며, detailAttribute 내에는 superDangolYn 값을 포함해 설정할 수 있습니다. productSalePrice 의 변경 방식은 UP(인상)·DOWN(인하)·TO(절대값 지정) 중 선택하고 단위는 PERCENT(정율) 또는 WON(정액) 만 사용하며, 일괄 수정 시 배송 속성은 NORMAL/TODAY/HOPE/SELLER_GUARANTEE/HOPE_SELLER_GUARANTEE 만 허용되는 점에 유의합니다. 호출 시 originProductNos 의 규모가 크면 응답 지연이 커지므로 1 회 호출당 적정 건수로 분할하고, N+1 호출 방식으로 단건 수정 API 를 반복 호출하는 것보다 본 API 의 일괄 경로를 우선 사용해야 합니다. 400 은 변경 유형과 입력 객체 불일치·enum 오류, 401/403 은 토큰·권한, 404 는 대상 원상품 부재, 500 은 일시 장애로 보고 입력 재검증·결과 재확인·백오프 재시도를 적용합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 본문

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| originProductNos | body | array | 필수 |  |
| productBulkUpdateType | body | string |  | - IMMEDIATE_DISCOUNT(기본 할인), SALE_PRICE(판매가), SALE_PERIOD(판매 기간), DELIVERY(배송 정보), DELIVERY_ATTRIBUTE(배송 속성), DELIVERY_HOPE(희망일배송), PURCHASE_BENEFIT(구매/리뷰 혜택), PURCHASE_QUANTITY_LIMIT(구매 수량 제한). 허용값: `IMMEDIATE_DISCOUNT`, `SALE_PRICE`, `SALE_PERIOD`, `DELIVERY`, `DELIVERY_ATTRIBUTE`, `DELIVERY_HOPE`, `PURCHASE_BENEFIT`, `PURCHASE_QUANTITY_LIMIT` |
| immediateDiscountPolicy | body | object |  | mobileDiscountMethod로 설정한 값은 무시됩니다. 추후 오류 응답이 반환될 수 있으므로 discountMethod를 사용하세요. |
| immediateDiscountPolicy.discountMethod | body | object |  | 할인 혜택 |
| immediateDiscountPolicy.discountMethod.… | body | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| productSalePrice | body | object |  | 판매가 변경 사항 |
| productSalePrice.value | body | integer(int32) | 필수 |  |
| productSalePrice.productSalePriceChangerType | body | string | 필수 | 허용값: `UP`, `DOWN`, `TO` |
| productSalePrice.productSalePriceChangerUnitType | body | string | 필수 | PERCENT, WON만 입력 가능합니다.<br>- PERCENT(정율), WON(정액) |
| productSalePeriod | body | object |  | 판매 기간 정보 |
| productSalePeriod.saleStartDate | body | string(date-time) |  | 매 시각 00분으로만 설정 가능합니다. 'yyyy-MM-dd'T'HH:mm[:ss][.SSS]XXX' 형식으로 입력합니다. |
| productSalePeriod.saleEndDate | body | string(date-time) |  | 매 시각 59분으로만 설정 가능합니다. 'yyyy-MM-dd'T'HH:mm[:ss][.SSS]XXX' 형식으로 입력합니다. |
| deliveryInfo | body | object |  | 배송 방식 및 배송비 등을 설정할 수 있습니다. 입력하지 않으면 배송 없는 상품으로 등록됩니다.<br>렌탈 또는 지금배달 상품의 경우에는 배송 정보를 필수로 입력해야 합니다. |
| deliveryInfo.deliveryType | body | string | 필수 | 네이버 상품 API에서 배송 방법 유형을 나타내기 위해 사용하는 코드입니다.<br>- DELIVERY(택배, 소포, 등기), DIRECT(직접배송(화물배달))<br>- 네이버 풀필먼트 상품, 배송 속성 SELLER_GUARANTEE(N판매자배송), 배송 속성 HOPE_SELLER_GUARANTEE(N희망일배송)인 경우 배송 방법은 DELIVERY(택배, 소포, 등기)만 허용됩니다.. 허용값: `DELIVERY`, `DIRECT` |
| deliveryInfo.deliveryAttributeType | body | string | 필수 | 네이버 상품 API에서 배송 속성 타입을 나타내기 위해 사용하는 코드입니다.<br>네이버 풀필먼트 상품은 OPTION_TODAY(옵션별 오늘출발)을 설정할 수 없습니다.<br>- 상품 등록/수정 시: NORMAL(일반 배송), TODAY(오늘출발), OPTION_TODAY(옵션별 오늘출발), HOPE(희망일배송), TODAY_ARRIVAL(당일배송(지금배달 관련 기능)), DAWN_ARRIVAL(새벽배송(지금배달 관련 기능)), ARRIVAL_GUARANTEE(N배송), SELLER_GUARANTEE(N판매자배송), HOPE_SELLER_GUARANTEE(N희망일배송), QUICK(즉시배달(퀵커머스 관련 기능)), PICKUP(픽업(퀵커머스 관련 기능)), QUICK_PICKUP(배달,픽업(퀵커머스 관련 기능))<br>- 상품 일괄 수정 시: NORMAL(일반 배송), TODAY(오늘출발), HOPE(희망일배송), SELLER_GUARANTEE(N판매자배송), HOPE_SELLER_GUARANTEE(N희망일배송)<br>- 렌탈 상품 등록/수정 시: NORMAL(일반 배송), HOPE(희망일배송)<br>- 그룹상품 등록/수정 시: NORMAL(일반 배송), TODAY(오늘 출발), HOPE(희망일배송), ARRIVAL_GUARANTEE (N배송), SELLER_GUARANTEE(N판매자배송), HOPE_SELLER_GUARANTEE (N희망일배송). 허용값: `NORMAL`, `TODAY`, `OPTION_TODAY`, `HOPE`, `TODAY_ARRIVAL`, `DAWN_ARRIVAL`, `ARRIVAL_GUARANTEE`, `SELLER_GUARANTEE`, `HOPE_SELLER_GUARANTEE`, `QUICK`, `PICKUP`, `QUICK_PICKUP` |
| deliveryInfo.deliveryCompany | body | string |  | DELIVERY(택배, 소포, 등기)일 때 필수 입력<br>- 주문 > 발주/발송 처리 > 발송 처리 API의 택배사 코드(deliveryCompanyCode)를 참고하여 코드값을 입력합니다.<br>- 배송 속성이 SELLER_GUARANTEE(N판매자배송), HOPE_SELLER_GUARANTEE(N희망일배송)인 경우 판매자정보 > 판매자 물류 > 물류사 연동 정보 조회 API에서 해당하는 deliveryTypes(배송 속성)의 logisticsCompanyId(물류사 ID)를 상품 API의 deliveryCompany(택배사)에 입력합니다. |
| deliveryInfo.outboundLocationId | body | string |  | 배송 속성이 SELLER_GURANTEE(N판매자배송), HOPE_SELLER_GUARANTEE(N희망일배송)인 경우 필수. 그 밖의 배송 속성에 입력된 판매자 창고 ID값은 무시됩니다.<br>판매자정보 > 판매자물류 > 판매자 창고 정보 조회 API에서 해당하는 deliveryType(배송 속성)의 창고 ID를 입력합니다. |
| deliveryInfo.deliveryBundleGroupUsable | body | boolean |  | 묶음배송 그룹 코드가 존재하는 경우 자동으로 true로 설정됩니다.<br>배송 속성이 HOPE_SELLER_GUARANTEE(N희망일배송)인 경우 묶음배송을 설정할 수 없습니다. |
| deliveryInfo.deliveryBundleGroupId | body | integer(int64) |  | 묶음배송 가능이 true이고 묶음배송 그룹 코드가 null이면 기본 그룹으로 저장됩니다.(배송 속성이 ARRIVAL_GUARANTEE인 경우 제외) |
| deliveryInfo.quickServiceAreas | body | array |  | 퀵서비스 배송 지역 코드입니다.<br>네이버 풀필먼트 상품, N희망일배송 상품은 퀵서비스를 설정할 수 없습니다.<br>- SEOUL(서울 전지역), GYEONGGI(경기 전지역), GOYANG(경기 고양), GOCHON(경기 고촌), GONJIAM(경기 곤지암), GWACHEON(경기 과천), GWANGMYEONG(경기 광명), GYEONGGIGWANGJU(경기 광주), GYOMUN(경기 교문리), GURI(경기 구리), GUSEONG(경기 구성), GUNPO(경기 군포), GIMPO(경기 김포), BUCHEON(경기 부천), BUNDANG(경기 분당), SEONGNAM(경기 성남), SUWON(경기 수원), SUJI(경기 수지), SIHEUNG(경기 시흥), ANSAN(경기 안산), ANYANG(경기 안양), YONGIN(경기 용인), UIWANG(경기 의왕), UIJEONGBU(경기 의정부), ICHEON(경기 이천), ILSAN(경기 일산), JICHUK(경기 지축), PAJU(경기 파주), HANAM(경기 하남), GWANGJU(광주 전지역), DAEGU(대구 전지역), DAEJEON(대전 전지역), BUSAN(부산 전지역), ULSAN(울산 전지역), INCHEON(인천 전지역) |
| deliveryInfo.quickServiceAreas.… | body | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| deliveryInfo.visitAddressId | body | integer(int64) |  | 방문 수령 주소 코드.<br>네이버 풀필먼트 상품, N희망일배송 상품은 방문 수령을 설정할 수 없습니다. |
| deliveryInfo.deliveryFee | body | object | 필수 | 배송비 정보 |
| deliveryInfo.deliveryFee.… | body | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| deliveryInfo.claimDeliveryInfo | body | object | 필수 | 클레임(반품/교환) 정보 |
| deliveryInfo.claimDeliveryInfo.… | body | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| deliveryInfo.installation | body | boolean |  | 배송 속성이 HOPE_SELLER_GUARANTEE(N희망일배송)인 경우에만 필수. 미입력 시 false로 설정됩니다. 그 외 배송 속성에 입력한 경우 무시됩니다. |
| deliveryInfo.installationFee | body | boolean |  | 설치 여부가 false이면 별도 설치비 유무는 입력한 값에 관계 없이 false로 설정됩니다. |
| deliveryInfo.expectedDeliveryPeriodType | body | string |  | ETC는 상품 수정에만 사용 가능하며, 이미 저장된 '주문 후 예상 발송 기간' 값이 존재하거나 '직접 입력형'인 경우 설정 가능합니다.<br>- ETC(직접 입력형), TWO(선택형: 2일), THREE(선택형: 3일), FOUR(선택형: 4일), FIVE(선택형: 5일), SIX(선택형: 6일), SEVEN(선택형: 7일), EIGHT(선택형: 8일), NINE(선택형: 9일), TEN(선택형: 10일), ELEVEN(선택형: 11일), TWELVE(선택형: 12일), THIRTEEN(선택형: 13일 ), FOURTEEN(선택형: 14일). 허용값: `ETC`, `TWO`, `THREE`, `FOUR`, `FIVE`, `SIX`, `SEVEN`, `EIGHT`, `NINE`, `TEN`, `ELEVEN`, `TWELVE`, `THIRTEEN`, `FOURTEEN` |
| deliveryInfo.expectedDeliveryPeriodDirectInput | body | string |  |  |
| deliveryInfo.todayStockQuantity | body | integer(int32) |  |  |
| deliveryInfo.customProductAfterOrderYn | body | boolean |  |  |
| deliveryInfo.hopeDeliveryGroupId | body | integer(int64) |  | 배송 속성 타입 코드가 희망일배송이고 희망일배송 그룹 번호가 Null이면 기본 그룹으로 저장됩니다. |
| deliveryInfo.businessCustomsClearanceSaleYn | body | boolean |  | 출고지 주소가 해외인 경우에만 적용됩니다. 미입력 시 false로 입력됩니다. |
| deliveryAttribute | body | object |  |  |
| deliveryAttribute.deliveryAttributeType | body | string | 필수 | - NORMAL(일반 배송), TODAY(오늘출발), HOPE(희망일배송)-productBulkUpdateType이 'DELIVERY_HOPE'인 경우에만 설정 가능. 허용값: `NORMAL`, `TODAY`, `OPTION_TODAY`, `HOPE`, `TODAY_ARRIVAL`, `DAWN_ARRIVAL`, `ARRIVAL_GUARANTEE`, `SELLER_GUARANTEE`, `HOPE_SELLER_GUARANTEE`, `QUICK`, `PICKUP`, `QUICK_PICKUP` |
| deliveryAttribute.todayStockQuantity | body | integer(int32) |  |  |
| deliveryAttribute.expectedDeliveryPeriodType | body | string |  | ETC는 상품 수정에만 사용 가능하며, 이미 저장된 '주문 후 예상 발송 기간' 값이 존재하거나 '직접 입력형'인 경우 설정 가능합니다.<br>- ETC(직접 입력형), TWO(선택형: 2일), THREE(선택형: 3일), FOUR(선택형: 4일), FIVE(선택형: 5일), SIX(선택형: 6일), SEVEN(선택형: 7일), EIGHT(선택형: 8일), NINE(선택형: 9일), TEN(선택형: 10일), ELEVEN(선택형: 11일), TWELVE(선택형: 12일), THIRTEEN(선택형: 13일 ), FOURTEEN(선택형: 14일). 허용값: `ETC`, `TWO`, `THREE`, `FOUR`, `FIVE`, `SIX`, `SEVEN`, `EIGHT`, `NINE`, `TEN`, `ELEVEN`, `TWELVE`, `THIRTEEN`, `FOURTEEN` |
| deliveryAttribute.expectedDeliveryPeriodDirectInput | body | string |  |  |
| deliveryAttribute.customProductAfterOrderYn | body | boolean |  |  |
| deliveryAttribute.hopeDeliveryGroupId | body | integer(int64) |  | 배송 속성 타입 코드가 희망일배송이고 희망일배송 그룹 번호가 Null이면 기본 그룹으로 저장됩니다. |
| purchaseBenefit | body | object |  |  |
| purchaseBenefit.multiPurchaseDiscountPolicy | body | object |  | 판매자 복수 구매 할인 정책 |
| purchaseBenefit.multiPurchaseDiscountPolicy.… | body | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| purchaseBenefit.purchasePointPolicy | body | object |  | 판매자 상품 구매 포인트 정책 |
| purchaseBenefit.purchasePointPolicy.… | body | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| purchaseBenefit.reviewPointPolicy | body | object |  | 판매자 상품 리뷰 포인트 정책 |
| purchaseBenefit.reviewPointPolicy.… | body | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| purchaseBenefit.freeInterestPolicy | body | object |  | 무이자 할부 정책 |
| purchaseBenefit.freeInterestPolicy.… | body | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| purchaseBenefit.giftPolicy | body | object |  | 사은품 정책 |
| purchaseBenefit.giftPolicy.… | body | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| purchaseQuantityInfo | body | object |  | 구매 수량 정보 |
| purchaseQuantityInfo.minPurchaseQuantity | body | integer(int32) |  | 최대 10000 |
| purchaseQuantityInfo.maxPurchaseQuantityPerId | body | integer(int32) |  | 최대 99999999 |
| purchaseQuantityInfo.maxPurchaseQuantityPerOrder | body | integer(int32) |  | 최대 10000 |
| detailAttribute | body | object |  |  |
| detailAttribute.customsTaxType | body | string |  | 관부가세 타입을 나타내기 위해 사용하는 코드입니다.<br>- NOT_APPLICABLE(부과 대상 아님), INCLUDED(관부가세 포함), EXCLUDED(관부가세 미포함). 허용값: `NOT_APPLICABLE`, `INCLUDED`, `EXCLUDED` |
| detailAttribute.superDangolYn | body | boolean |  | PURCHASE_BENEFIT(구매/리뷰 혜택) 유형에만 반영됩니다. 슈퍼단골 솔루션 구독 계정만 true/false를 설정할 수 있습니다. 값을 전송하지 않거나 또는 null로 전송하는 경우, 기존 설정값은 초기화되며 아래 기본값이 적용됩니다.<br>- 슈퍼단골 솔루션 구독 계정: 적립함<br>- 슈퍼단골 솔루션 미구독 계정 또는 적립 불가 상품: 적립 안 함 |

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

- 요청 본문 `productBulkUpdateType`: `IMMEDIATE_DISCOUNT`, `SALE_PRICE`, `SALE_PERIOD`, `DELIVERY`, `DELIVERY_ATTRIBUTE`, `DELIVERY_HOPE`, `PURCHASE_BENEFIT`, `PURCHASE_QUANTITY_LIMIT`
- 요청 본문 `immediateDiscountPolicy.discountMethod.unitType`: `PERCENT`, `WON`, `YEN`, `COUNT`
- 요청 본문 `productSalePrice.productSalePriceChangerType`: `UP`, `DOWN`, `TO`
- 요청 본문 `deliveryInfo.deliveryType`: `DELIVERY`, `DIRECT`
- 요청 본문 `deliveryInfo.deliveryAttributeType`: `NORMAL`, `TODAY`, `OPTION_TODAY`, `HOPE`, `TODAY_ARRIVAL`, `DAWN_ARRIVAL`, `ARRIVAL_GUARANTEE`, `SELLER_GUARANTEE`, `HOPE_SELLER_GUARANTEE`, `QUICK`, `PICKUP`, `QUICK_PICKUP`
- 요청 본문 `deliveryInfo.quickServiceAreas[]`: `SEOUL`, `GYEONGGI`, `GOYANG`, `GOCHON`, `GONJIAM`, `GWACHEON`, `GWANGMYEONG`, `GYEONGGIGWANGJU`, `GYOMUN`, `GURI`, `GUSEONG`, `GUNPO`, `GIMPO`, `BUCHEON`, `BUNDANG`, `SEONGNAM`, `SUWON`, `SUJI`, `SIHEUNG`, `ANSAN`, `ANYANG`, `YONGIN`, `UIWANG`, `UIJEONGBU`, `ICHEON`, `ILSAN`, `JICHUK`, `PAJU`, `HANAM`, `GWANGJU`, `DAEGU`, `DAEJEON`, `BUSAN`, `ULSAN`, `INCHEON`
- 요청 본문 `deliveryInfo.deliveryFee.deliveryFeeType`: `FREE`, `CONDITIONAL_FREE`, `PAID`, `UNIT_QUANTITY_PAID`, `RANGE_QUANTITY_PAID`
- 요청 본문 `deliveryInfo.deliveryFee.deliveryFeePayType`: `COLLECT`, `PREPAID`, `COLLECT_OR_PREPAID`
- 요청 본문 `deliveryInfo.deliveryFee.deliveryFeeByArea.deliveryAreaType`: `AREA_2`, `AREA_3`
- 요청 본문 `deliveryInfo.claimDeliveryInfo.returnDeliveryCompanyPriorityType`: `PRIMARY`, `SECONDARY_1`, `SECONDARY_2`, `SECONDARY_3`, `SECONDARY_4`, `SECONDARY_5`, `SECONDARY_6`, `SECONDARY_7`, `SECONDARY_8`, `SECONDARY_9`
- 요청 본문 `deliveryInfo.expectedDeliveryPeriodType`: `ETC`, `TWO`, `THREE`, `FOUR`, `FIVE`, `SIX`, `SEVEN`, `EIGHT`, `NINE`, `TEN`, `ELEVEN`, `TWELVE`, `THIRTEEN`, `FOURTEEN`
- 요청 본문 `deliveryAttribute.deliveryAttributeType`: `NORMAL`, `TODAY`, `OPTION_TODAY`, `HOPE`, `TODAY_ARRIVAL`, `DAWN_ARRIVAL`, `ARRIVAL_GUARANTEE`, `SELLER_GUARANTEE`, `HOPE_SELLER_GUARANTEE`, `QUICK`, `PICKUP`, `QUICK_PICKUP`
- 요청 본문 `deliveryAttribute.expectedDeliveryPeriodType`: `ETC`, `TWO`, `THREE`, `FOUR`, `FIVE`, `SIX`, `SEVEN`, `EIGHT`, `NINE`, `TEN`, `ELEVEN`, `TWELVE`, `THIRTEEN`, `FOURTEEN`
- 요청 본문 `purchaseBenefit.multiPurchaseDiscountPolicy.discountMethod.unitType`: `PERCENT`, `WON`, `YEN`, `COUNT`
- 요청 본문 `purchaseBenefit.multiPurchaseDiscountPolicy.orderValueUnitType`: `PERCENT`, `WON`, `YEN`, `COUNT`
- 요청 본문 `purchaseBenefit.purchasePointPolicy.unitType`: `PERCENT`, `WON`, `YEN`, `COUNT`
- 요청 본문 `detailAttribute.customsTaxType`: `NOT_APPLICABLE`, `INCLUDED`, `EXCLUDED`

### 호출 예시

```bash
curl -X PUT 'https://api.commerce.naver.com/external/v1/products/origin-products/bulk-update' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```
