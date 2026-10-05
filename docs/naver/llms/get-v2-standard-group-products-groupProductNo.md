---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/read-product-product
---
# GET /v2/standard-group-products/{groupProductNo} - (v2) 그룹상품 조회

(v2) 그룹상품 조회 API는 groupProductNo를 path 파라미터로 지정해 그룹상품(동일한 카테고리·상품군에 속한 다수의 단품을 묶어 하나의 노출 단위로 운영하는 상품) 의 전체 정보를 조회하기 위한 엔드포인트입니다. 응답에는 그룹상품의 공통 속성(카테고리·브랜드·제조사·면세/세금 유형·상품정보제공고시·A/S·SEO·공통 상세 콘텐츠·사이즈) 과 그룹에 속한 개별 specificProducts 배열, 그리고 스마트스토어·윈도 채널별 그룹 노출 정보가 함께 포함되어 운영 화면에서 그룹 단위 통합 상세를 표시하거나 외부 시스템과 동기화할 때 단일 진입점으로 사용합니다. 응답 enum(taxType·customsTaxType·saleType·productInfoProvidedNoticeType 등) 은 OAS 에 정의된 코드를 기준으로 매핑해야 하며, specificProducts 하위에는 단품별 배송·인증·할인 정책이 그대로 포함되므로 필요한 영역만 선별해 가공합니다. 또한 인증 대상 제외 정보의 chemicalCertifiedProductExclusionYn 은 boolean, kcCertifiedProductExclusionYn 은 문자열로 처리해야 하며, specificProducts 하위에는 superDangolYn 항목이 있고 추가 상품 정보(supplementProductInfo)의 추가 상품 목록(supplementProducts)에는 skuStatusType(REQUEST, COMPLETE, CLEAR, DISABLED, LATER) 이 추가되었으므로 기존 파서·매핑 로직의 호환성을 점검해 누락 없이 처리해야 하며, 추가 상품 id 는 타입(integer)이 바뀌지 않았고 그룹상품 수정 요청에 조회한 id 를 넣으면 그 추가 상품이 수정됩니다. groupProductNo 가 누락되거나 형식이 잘못되면 400 BAD_REQUEST, 인증이 유효하지 않으면 401 UNAUTHORIZED, 권한이 없으면 403 FORBIDDEN, 존재하지 않는 그룹상품을 지정하면 404 NOT_FOUND 가 반환되므로 호출자 계정의 판매자 권한과 그룹 소유 관계를 먼저 확인해야 합니다. 500 응답은 일시 장애 가능성이 있어 지수 백오프 기반 재시도로 대응합니다. 리다이렉트가 필요한 경우 308 응답이 반환될 수 있으므로 클라이언트는 Location 헤더를 따라 동일 요청을 재시도하도록 처리해야 합니다. 그룹상품 등록·수정·전환 API 는 비동기로 동작하므로, 호출 직후 본 조회를 하기 전에 그룹상품 요청 결과 조회 API 로 처리 완료를 먼저 확인해야 합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| groupProductNo | path | integer(int64) | 필수 |  |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| groupProduct | - | object |  |  |
| groupProduct.leafCategoryId | - | string | 필수 |  |
| groupProduct.name | - | string | 필수 |  |
| groupProduct.guideId | - | integer(int64) |  |  |
| groupProduct.brandName | - | string |  |  |
| groupProduct.brandId | - | integer(int64) |  |  |
| groupProduct.manufacturerName | - | string |  |  |
| groupProduct.itselfProductionProductYn | - | boolean |  |  |
| groupProduct.taxType | - | string |  | 허용값: `TAX`, `DUTYFREE`, `SMALL` |
| groupProduct.customsTaxType | - | string |  | deprecated. 상품별 `specificProducts[].customsTaxType` 사용을 권장합니다.. 허용값: `NOT_APPLICABLE`, `INCLUDED`, `EXCLUDED` |
| groupProduct.saleType | - | string |  | 허용값: `NEW`, `OLD` |
| groupProduct.minorPurchasable | - | boolean |  |  |
| groupProduct.brandCertificationYn | - | boolean |  |  |
| groupProduct.productInfoProvidedNotice | - | object |  | 상품 요약 정보<br>- 상품 등록 및 수정 시 필수 |
| groupProduct.productInfoProvidedNotice.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| groupProduct.afterServiceInfo | - | object |  | A/S 정보 |
| groupProduct.afterServiceInfo.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| groupProduct.sellerCommentContent | - | string |  |  |
| groupProduct.supplementProductInfo | - | object |  | 추가 상품 정보 |
| groupProduct.supplementProductInfo.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| groupProduct.seoInfo | - | object |  | SEO(Search engine optimization) 정보 |
| groupProduct.seoInfo.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| groupProduct.commonDetailContent | - | string |  |  |
| groupProduct.productSize | - | object |  | 사이즈 정보 |
| groupProduct.productSize.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| groupProduct.specificProducts | - | array |  |  |
| groupProduct.specificProducts.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| groupProduct.smartstoreGroupChannel | - | object |  |  |
| groupProduct.smartstoreGroupChannel.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| groupProduct.windowGroupChannel | - | object |  |  |
| groupProduct.windowGroupChannel.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |

### 에러 코드

| 상태 코드 | 설명 |
|-----------|------|
| 400 | 잘못된 요청<br/>- code : BAD_REQUEST |
| 401 | 인가되지 않은 요청<br/>- code : UNAUTHORIZED |
| 403 | 권한 없음<br/>- code : FORBIDDEN |
| 404 | 데이터 없음<br/>- code : NOT_FOUND |
| 500 | 내부 서버 오류<br/>- code : INTERNAL_SERVER_ERROR |

### 사용 enum 카탈로그

- 응답 `groupProduct.taxType`: `TAX`, `DUTYFREE`, `SMALL`
- 응답 `groupProduct.customsTaxType`: `NOT_APPLICABLE`, `INCLUDED`, `EXCLUDED`
- 응답 `groupProduct.saleType`: `NEW`, `OLD`
- 응답 `groupProduct.productInfoProvidedNotice.productInfoProvidedNoticeType`: `WEAR`, `SHOES`, `BAG`, `FASHION_ITEMS`, `SLEEPING_GEAR`, `FURNITURE`, `IMAGE_APPLIANCES`, `HOME_APPLIANCES`, `SEASON_APPLIANCES`, `OFFICE_APPLIANCES`, `OPTICS_APPLIANCES`, `MICROELECTRONICS`, `CELLPHONE`, `NAVIGATION`, `CAR_ARTICLES`, `MEDICAL_APPLIANCES`, `KITCHEN_UTENSILS`, `COSMETIC`, `JEWELLERY`, `FOOD`, `GENERAL_FOOD`, `DIET_FOOD`, `KIDS`, `MUSICAL_INSTRUMENT`, `SPORTS_EQUIPMENT`, `BOOKS`, `LODGMENT_RESERVATION`, `TRAVEL_PACKAGE`, `AIRLINE_TICKET`, `RENT_CAR`, `RENTAL_HA`, `RENTAL_ETC`, `DIGITAL_CONTENTS`, `GIFT_CARD`, `MOBILE_COUPON`, `MOVIE_SHOW`, `ETC_SERVICE`, `BIOCHEMISTRY`, `BIOCIDAL`, `ETC`
- 응답 `groupProduct.productInfoProvidedNotice.seasonAppliances.releaseDate.month`: `JANUARY`, `FEBRUARY`, `MARCH`, `APRIL`, `MAY`, `JUNE`, `JULY`, `AUGUST`, `SEPTEMBER`, `OCTOBER`, `NOVEMBER`, `DECEMBER`
- 응답 `groupProduct.productInfoProvidedNotice.officeAppliances.releaseDate.month`: `JANUARY`, `FEBRUARY`, `MARCH`, `APRIL`, `MAY`, `JUNE`, `JULY`, `AUGUST`, `SEPTEMBER`, `OCTOBER`, `NOVEMBER`, `DECEMBER`
- 응답 `groupProduct.productInfoProvidedNotice.sportsEquipment.releaseDate.month`: `JANUARY`, `FEBRUARY`, `MARCH`, `APRIL`, `MAY`, `JUNE`, `JULY`, `AUGUST`, `SEPTEMBER`, `OCTOBER`, `NOVEMBER`, `DECEMBER`
- 응답 `groupProduct.supplementProductInfo.sortType`: `CREATE`, `ABC`, `LOW_PRICE`, `HIGH_PRICE`
- 응답 `groupProduct.supplementProductInfo.supplementProducts[].skuStatusType`: `REQUEST`, `COMPLETE`, `CLEAR`, `DISABLED`, `LATER`
- 응답 `groupProduct.specificProducts[].immediateDiscountPolicy.discountMethod.unitType`: `PERCENT`, `WON`, `YEN`, `COUNT`
- 응답 `groupProduct.specificProducts[].reservedDiscountPolicy.discountMethod.unitType`: `PERCENT`, `WON`, `YEN`, `COUNT`
- 응답 `groupProduct.specificProducts[].customerBenefit.purchasePointPolicy.unitType`: `PERCENT`, `WON`, `YEN`, `COUNT`
- 응답 `groupProduct.specificProducts[].customerBenefit.multiPurchaseDiscountPolicy.discountMethod.unitType`: `PERCENT`, `WON`, `YEN`, `COUNT`
- 응답 `groupProduct.specificProducts[].customerBenefit.multiPurchaseDiscountPolicy.orderValueUnitType`: `PERCENT`, `WON`, `YEN`, `COUNT`
- 응답 `groupProduct.specificProducts[].customerBenefit.promotionDiscountPolicies[].discountMethod.unitType`: `PERCENT`, `WON`, `YEN`, `COUNT`
- 응답 `groupProduct.specificProducts[].deliveryInfo.deliveryType`: `DELIVERY`, `DIRECT`
- 응답 `groupProduct.specificProducts[].deliveryInfo.deliveryAttributeType`: `NORMAL`, `TODAY`, `OPTION_TODAY`, `HOPE`, `TODAY_ARRIVAL`, `DAWN_ARRIVAL`, `ARRIVAL_GUARANTEE`, `SELLER_GUARANTEE`, `HOPE_SELLER_GUARANTEE`, `QUICK`, `PICKUP`, `QUICK_PICKUP`
- 응답 `groupProduct.specificProducts[].deliveryInfo.quickServiceAreas[]`: `SEOUL`, `GYEONGGI`, `GOYANG`, `GOCHON`, `GONJIAM`, `GWACHEON`, `GWANGMYEONG`, `GYEONGGIGWANGJU`, `GYOMUN`, `GURI`, `GUSEONG`, `GUNPO`, `GIMPO`, `BUCHEON`, `BUNDANG`, `SEONGNAM`, `SUWON`, `SUJI`, `SIHEUNG`, `ANSAN`, `ANYANG`, `YONGIN`, `UIWANG`, `UIJEONGBU`, `ICHEON`, `ILSAN`, `JICHUK`, `PAJU`, `HANAM`, `GWANGJU`, `DAEGU`, `DAEJEON`, `BUSAN`, `ULSAN`, `INCHEON`
- 응답 `groupProduct.specificProducts[].deliveryInfo.deliveryFee.deliveryFeeType`: `FREE`, `CONDITIONAL_FREE`, `PAID`, `UNIT_QUANTITY_PAID`, `RANGE_QUANTITY_PAID`
- 응답 `groupProduct.specificProducts[].deliveryInfo.deliveryFee.deliveryFeePayType`: `COLLECT`, `PREPAID`, `COLLECT_OR_PREPAID`
- 응답 `groupProduct.specificProducts[].deliveryInfo.deliveryFee.deliveryFeeByArea.deliveryAreaType`: `AREA_2`, `AREA_3`
- 응답 `groupProduct.specificProducts[].deliveryInfo.claimDeliveryInfo.returnDeliveryCompanyPriorityType`: `PRIMARY`, `SECONDARY_1`, `SECONDARY_2`, `SECONDARY_3`, `SECONDARY_4`, `SECONDARY_5`, `SECONDARY_6`, `SECONDARY_7`, `SECONDARY_8`, `SECONDARY_9`
- 응답 `groupProduct.specificProducts[].deliveryInfo.expectedDeliveryPeriodType`: `ETC`, `TWO`, `THREE`, `FOUR`, `FIVE`, `SIX`, `SEVEN`, `EIGHT`, `NINE`, `TEN`, `ELEVEN`, `TWELVE`, `THIRTEEN`, `FOURTEEN`
- 응답 `groupProduct.specificProducts[].productCertificationInfos[].certificationKindType`: `KC_CERTIFICATION`, `CHILD_CERTIFICATION`, `GREEN_PRODUCTS`, `CHEMICAL_CERTIFICATION`, `PARALLEL_IMPORT`, `OVERSEAS`, `ETC`
- 응답 `groupProduct.specificProducts[].certificationTargetExcludeContent.kcExemptionType`: `OVERSEAS`, `SAFE_CRITERION`, `PARALLEL_IMPORT`
- 응답 `groupProduct.specificProducts[].certificationTargetExcludeContent.kcCertifiedProductExclusionYn`: `FALSE`, `KC_EXEMPTION_OBJECT`, `TRUE`
- 응답 `groupProduct.specificProducts[].customsTaxType`: `NOT_APPLICABLE`, `INCLUDED`, `EXCLUDED`
- 응답 `groupProduct.specificProducts[].smartstoreChannelProduct.channelProductDisplayStatusType`: `WAIT`, `ON`, `SUSPENSION`
- 응답 `groupProduct.specificProducts[].windowChannelProduct.channelProductDisplayStatusType`: `WAIT`, `ON`, `SUSPENSION`
- 응답 `groupProduct.specificProducts[].preOrder.preOrderEndSaleStatus`: `SALE_END`, `ON_SALE`

### 호출 예시

```bash
curl -X GET 'https://api.commerce.naver.com/external/v2/standard-group-products/{groupProductNo}' \
  -H 'Authorization: Bearer {access_token}'
```
