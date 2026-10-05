---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/update-options-product
---
# PUT /v1/products/origin-products/{originProductNo}/option-stock - 상품 옵션 재고 변경

이 API는 옵션 설정 상품의 옵션별 재고와 옵션가만 단건 갱신할 때 사용하는 v1 엔드포인트로, 옵션 타입·옵션명·옵션값 자체를 변경하려면 상품 수정 API 를 사용해야 합니다. 요청 본문에는 조합형 옵션(optionCombinations)의 재고·옵션가 또는 표준형 옵션(optionStandards)의 재고 변경 정보와 함께, 필요 시 productSalePrice·immediateDiscountPolicy 도 함께 전달할 수 있습니다. useStockManagement 를 false 로 설정하면 표준형 옵션의 수량이 자동으로 9,999 로 설정되는 동작이 있으므로 재고 관리 정책 전환은 의도적으로만 사용해야 합니다. 일반적인 사용 사례는 외부 WMS·POS 시스템이 옵션별 실재고를 주기적으로 폴링하여 변화량을 본 API 로 동기화하거나, 단기 프로모션에서 옵션가만 일시 조정하는 것입니다. 호출 시 옵션 단위 변경이 다수 SKU 에 걸쳐 발생할 때는 단일 상품 단위로 N+1 호출을 반복하지 말고 한 번의 호출에 옵션 배열 전체를 묶어 전송하여 동시성·레이트 리밋 부담을 줄이고, 실재고와의 정합성을 보장하기 위해 동일 원상품에 대한 동시 호출은 직렬화하는 것이 안전합니다. 응답으로는 갱신 결과가 반영된 원상품(originProduct) 데이터를 포함한 상품 상세 정보가 반환되며, 상품 상세 속성(detailAttribute)에는 superDangolYn 같은 속성이, 추가 상품 정보(supplementProductInfo)의 추가 상품 목록(supplementProducts)에는 SKU 상태(skuStatusType) 같은 확장 필드가 포함될 수 있으므로 클라이언트는 알 수 없는 필드에 대해 호환되도록 처리하는 것이 좋습니다. 400 은 옵션 구조 불일치·재고 음수, 401/403 은 토큰·권한, 404 는 존재하지 않는 originProductNo, 500 은 일시 장애로 보고 입력 재검증 또는 백오프 재시도를 적용합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| originProductNo | path | integer(int64) | 필수 | 원상품번호 |

### 요청 본문

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| productSalePrice | body | object |  | 판매가 정보 |
| productSalePrice.salePrice | body | integer(int32) | 필수 |  |
| immediateDiscountPolicy | body | object |  | mobileDiscountMethod로 설정한 값은 무시됩니다. 추후 오류 응답이 반환될 수 있으므로 discountMethod를 사용하세요. |
| immediateDiscountPolicy.discountMethod | body | object |  | 할인 혜택 |
| immediateDiscountPolicy.discountMethod.… | body | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| optionInfo | body | object | 필수 | 옵션 재고 및 옵션가 설정이 가능한 옵션 설정 상품에 대해 수정이 가능합니다. 옵션 타입 및 옵션명, 옵션값 수정이 필요한 경우 상품 수정 API를 이용해주세요. |
| optionInfo.optionCombinations | body | array |  |  |
| optionInfo.optionCombinations.… | body | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| optionInfo.optionStandards | body | array |  |  |
| optionInfo.optionStandards.… | body | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| optionInfo.useStockManagement | body | boolean |  | false로 설정하면 수량이 9,999로 설정됩니다(표준형 옵션). |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| originProductNo | - | integer(int64) |  |  |
| smartstoreChannelProductNo | - | integer(int64) |  |  |
| windowChannelProductNo | - | integer(int64) |  |  |
| originProduct | - | object |  | 응답용 원상품 정보. 원상품에 속한 채널 상품은 모두 상품 공통 속성을 참고합니다. |
| originProduct.statusType | - | string | 필수 | 허용값: `WAIT`, `SALE`, `OUTOFSTOCK`, `UNADMISSION`, `REJECTION`, `SUSPENSION`, `CLOSE`, `PROHIBITION`, `DELETE` |
| originProduct.saleType | - | string |  | 허용값: `NEW`, `OLD` |
| originProduct.leafCategoryId | - | string |  |  |
| originProduct.name | - | string | 필수 |  |
| originProduct.detailContent | - | string | 필수 |  |
| originProduct.images | - | object | 필수 | 상품 이미지로 대표 이미지(1000x1000픽셀 권장)와 최대 9개의 추가 이미지 목록을 제공할 수 있습니다. 대표 이미지는 필수이고 추가 이미지는 선택 사항입니다.<br><b>이미지 URL은 반드시 상품 이미지 다건 등록 API로 이미지를 업로드하고 반환받은 URL 값을 입력해야 합니다.</b> |
| originProduct.images.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| originProduct.saleStartDate | - | string(date-time) |  | 'yyyy-MM-dd'T'HH:mm[:ss][.SSS]XXX' 형식으로 입력합니다. |
| originProduct.saleEndDate | - | string(date-time) |  | 'yyyy-MM-dd'T'HH:mm[:ss][.SSS]XXX' 형식으로 입력합니다. |
| originProduct.salePrice | - | integer(int64) | 필수 | 최대 999999990 |
| originProduct.stockQuantity | - | integer(int32) |  | 최대 99999999 |
| originProduct.deliveryInfo | - | object |  | 배송 방식 및 배송비 등을 설정할 수 있습니다. 입력하지 않으면 배송 없는 상품으로 등록됩니다.<br>렌탈 또는 지금배달 상품의 경우에는 배송 정보를 필수로 입력해야 합니다. |
| originProduct.deliveryInfo.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| originProduct.productLogistics | - | array |  | 네이버 풀필먼트가 설정된 상품의 경우 조회됩니다. |
| originProduct.productLogistics.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| originProduct.detailAttribute | - | object | 필수 | 조회용 원상품 상세 속성 |
| originProduct.detailAttribute.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| originProduct.customerBenefit | - | object |  | 응답용 상품 고객 혜택 정보 |
| originProduct.customerBenefit.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| smartstoreChannelProduct | - | object |  |  |
| smartstoreChannelProduct.channelProductName | - | string |  | 채널 상품 전용 상품명을 사용하는 경우 입력합니다. 미입력 시 원상품명으로 적용됩니다. |
| smartstoreChannelProduct.bbsSeq | - | integer(int64) |  | 공지사항 |
| smartstoreChannelProduct.storeKeepExclusiveProduct | - | boolean |  | 미입력 시 false로 저장됩니다. |
| smartstoreChannelProduct.naverShoppingRegistration | - | boolean | 필수 | 네이버 쇼핑 광고주가 아닌 경우에는 false로 저장됩니다. |
| smartstoreChannelProduct.channelProductDisplayStatusType | - | string | 필수 | ON, SUSPENSION만 입력 가능합니다.<br>- WAIT(전시 대기), ON(전시 중), SUSPENSION(전시 중지). 허용값: `WAIT`, `ON`, `SUSPENSION` |
| windowChannelProduct | - | object |  |  |
| windowChannelProduct.channelProductName | - | string |  | 채널 상품 전용 상품명을 사용하는 경우 입력합니다. 미입력 시 원상품명으로 적용됩니다. |
| windowChannelProduct.bbsSeq | - | integer(int64) |  | 공지사항 |
| windowChannelProduct.storeKeepExclusiveProduct | - | boolean |  | 미입력 시 false로 저장됩니다. |
| windowChannelProduct.naverShoppingRegistration | - | boolean | 필수 | 네이버 쇼핑 광고주가 아닌 경우에는 false로 저장됩니다. |
| windowChannelProduct.channelNo | - | integer(int64) | 필수 | 전시할 윈도 채널 선택 |
| windowChannelProduct.best | - | boolean |  | 미입력 시 false로 저장됩니다. |
| windowChannelProduct.channelProductDisplayStatusType | - | string |  | WAIT(전시 대기), ON(전시 중), SUSPENSION(전시 중지). 허용값: `WAIT`, `ON`, `SUSPENSION` |

### 에러 코드

| 상태 코드 | 설명 |
|-----------|------|
| 400 | 잘못된 요청<br/>- code : BAD_REQUEST |
| 401 | 인가되지 않은 요청<br/>- code : UNAUTHORIZED |
| 403 | 권한 없음<br/>- code : FORBIDDEN |
| 404 | 데이터 없음<br/>- code : NOT_FOUND |
| 500 | 내부 서버 오류<br/>- code : INTERNAL_SERVER_ERROR |

### 사용 enum 카탈로그

- 요청 본문 `immediateDiscountPolicy.discountMethod.unitType`: `PERCENT`, `WON`, `YEN`, `COUNT`
- 응답 `originProduct.statusType`: `WAIT`, `SALE`, `OUTOFSTOCK`, `UNADMISSION`, `REJECTION`, `SUSPENSION`, `CLOSE`, `PROHIBITION`, `DELETE`
- 응답 `originProduct.saleType`: `NEW`, `OLD`
- 응답 `originProduct.deliveryInfo.deliveryType`: `DELIVERY`, `DIRECT`
- 응답 `originProduct.deliveryInfo.deliveryAttributeType`: `NORMAL`, `TODAY`, `OPTION_TODAY`, `HOPE`, `TODAY_ARRIVAL`, `DAWN_ARRIVAL`, `ARRIVAL_GUARANTEE`, `SELLER_GUARANTEE`, `HOPE_SELLER_GUARANTEE`, `QUICK`, `PICKUP`, `QUICK_PICKUP`
- 응답 `originProduct.deliveryInfo.quickServiceAreas[]`: `SEOUL`, `GYEONGGI`, `GOYANG`, `GOCHON`, `GONJIAM`, `GWACHEON`, `GWANGMYEONG`, `GYEONGGIGWANGJU`, `GYOMUN`, `GURI`, `GUSEONG`, `GUNPO`, `GIMPO`, `BUCHEON`, `BUNDANG`, `SEONGNAM`, `SUWON`, `SUJI`, `SIHEUNG`, `ANSAN`, `ANYANG`, `YONGIN`, `UIWANG`, `UIJEONGBU`, `ICHEON`, `ILSAN`, `JICHUK`, `PAJU`, `HANAM`, `GWANGJU`, `DAEGU`, `DAEJEON`, `BUSAN`, `ULSAN`, `INCHEON`
- 응답 `originProduct.deliveryInfo.deliveryFee.deliveryFeeType`: `FREE`, `CONDITIONAL_FREE`, `PAID`, `UNIT_QUANTITY_PAID`, `RANGE_QUANTITY_PAID`
- 응답 `originProduct.deliveryInfo.deliveryFee.deliveryFeePayType`: `COLLECT`, `PREPAID`, `COLLECT_OR_PREPAID`
- 응답 `originProduct.deliveryInfo.deliveryFee.deliveryFeeByArea.deliveryAreaType`: `AREA_2`, `AREA_3`
- 응답 `originProduct.deliveryInfo.claimDeliveryInfo.returnDeliveryCompanyPriorityType`: `PRIMARY`, `SECONDARY_1`, `SECONDARY_2`, `SECONDARY_3`, `SECONDARY_4`, `SECONDARY_5`, `SECONDARY_6`, `SECONDARY_7`, `SECONDARY_8`, `SECONDARY_9`
- 응답 `originProduct.deliveryInfo.expectedDeliveryPeriodType`: `ETC`, `TWO`, `THREE`, `FOUR`, `FIVE`, `SIX`, `SEVEN`, `EIGHT`, `NINE`, `TEN`, `ELEVEN`, `TWELVE`, `THIRTEEN`, `FOURTEEN`
- 응답 `originProduct.detailAttribute.optionInfo.simpleOptionSortType`: `CREATE`, `ABC`, `LOW_PRICE`, `HIGH_PRICE`
- 응답 `originProduct.detailAttribute.optionInfo.optionCombinationSortType`: `CREATE`, `ABC`, `LOW_PRICE`, `HIGH_PRICE`
- 응답 `originProduct.detailAttribute.supplementProductInfo.sortType`: `CREATE`, `ABC`, `LOW_PRICE`, `HIGH_PRICE`
- 응답 `originProduct.detailAttribute.supplementProductInfo.supplementProducts[].skuStatusType`: `REQUEST`, `COMPLETE`, `CLEAR`, `DISABLED`, `LATER`
- 응답 `originProduct.detailAttribute.taxType`: `TAX`, `DUTYFREE`, `SMALL`
- 응답 `originProduct.detailAttribute.customsTaxType`: `NOT_APPLICABLE`, `INCLUDED`, `EXCLUDED`
- 응답 `originProduct.detailAttribute.productCertificationInfos[].certificationKindType`: `KC_CERTIFICATION`, `CHILD_CERTIFICATION`, `GREEN_PRODUCTS`, `CHEMICAL_CERTIFICATION`, `PARALLEL_IMPORT`, `OVERSEAS`, `ETC`
- 응답 `originProduct.detailAttribute.certificationTargetExcludeContent.kcExemptionType`: `OVERSEAS`, `SAFE_CRITERION`, `PARALLEL_IMPORT`
- 응답 `originProduct.detailAttribute.certificationTargetExcludeContent.kcCertifiedProductExclusionYn`: `FALSE`, `KC_EXEMPTION_OBJECT`, `TRUE`
- 응답 `originProduct.detailAttribute.ecoupon.periodType`: `FIXED`, `FLEXIBLE`
- 응답 `originProduct.detailAttribute.ecoupon.usePlaceType`: `PLACE`, `ADDRESS`, `URL`
- 응답 `originProduct.detailAttribute.productInfoProvidedNotice.productInfoProvidedNoticeType`: `WEAR`, `SHOES`, `BAG`, `FASHION_ITEMS`, `SLEEPING_GEAR`, `FURNITURE`, `IMAGE_APPLIANCES`, `HOME_APPLIANCES`, `SEASON_APPLIANCES`, `OFFICE_APPLIANCES`, `OPTICS_APPLIANCES`, `MICROELECTRONICS`, `CELLPHONE`, `NAVIGATION`, `CAR_ARTICLES`, `MEDICAL_APPLIANCES`, `KITCHEN_UTENSILS`, `COSMETIC`, `JEWELLERY`, `FOOD`, `GENERAL_FOOD`, `DIET_FOOD`, `KIDS`, `MUSICAL_INSTRUMENT`, `SPORTS_EQUIPMENT`, `BOOKS`, `LODGMENT_RESERVATION`, `TRAVEL_PACKAGE`, `AIRLINE_TICKET`, `RENT_CAR`, `RENTAL_HA`, `RENTAL_ETC`, `DIGITAL_CONTENTS`, `GIFT_CARD`, `MOBILE_COUPON`, `MOVIE_SHOW`, `ETC_SERVICE`, `BIOCHEMISTRY`, `BIOCIDAL`, `ETC`
- 응답 `originProduct.detailAttribute.productInfoProvidedNotice.seasonAppliances.releaseDate.month`: `JANUARY`, `FEBRUARY`, `MARCH`, `APRIL`, `MAY`, `JUNE`, `JULY`, `AUGUST`, `SEPTEMBER`, `OCTOBER`, `NOVEMBER`, `DECEMBER`
- 응답 `originProduct.detailAttribute.productInfoProvidedNotice.officeAppliances.releaseDate.month`: `JANUARY`, `FEBRUARY`, `MARCH`, `APRIL`, `MAY`, `JUNE`, `JULY`, `AUGUST`, `SEPTEMBER`, `OCTOBER`, `NOVEMBER`, `DECEMBER`
- 응답 `originProduct.detailAttribute.productInfoProvidedNotice.sportsEquipment.releaseDate.month`: `JANUARY`, `FEBRUARY`, `MARCH`, `APRIL`, `MAY`, `JUNE`, `JULY`, `AUGUST`, `SEPTEMBER`, `OCTOBER`, `NOVEMBER`, `DECEMBER`
- 응답 `originProduct.detailAttribute.rentalInfo.contractGuideInfo.guideContents[].guideType`: `CONSUMABLE_FEE`, `WITHDRAWAL_FEE`, `TRANSFER_INSTALLATION_FEE`, `BREAKAGE_FEE`, `ADDITIONAL_FEE`
- 응답 `originProduct.detailAttribute.rentalInfo.onetimeFeeInfo.onetimeFeePaymentType`: `DIRECT`, `AFTER_ONE_TERM`
- 응답 `originProduct.detailAttribute.rentalInfo.onetimeFeeInfo.onetimeFeeContents[].feeType`: `REGISTRATION_FEE`, `ADDITIONAL_FEE`
- 응답 `originProduct.detailAttribute.rentalInfo.rentalContractConditions[].managementMethodType`: `ALL`, `NONE`, `VISIT`, `ONESELF`
- 응답 `originProduct.detailAttribute.rentalInfo.rentalContractConditions[].replacementServiceType`: `NONE`, `INCLUDE`, `NOT_INCLUDE`
- 응답 `originProduct.detailAttribute.rentalInfo.rentalContractConditions[].advancedPaymentFeeType`: `NONE`, `PAID`, `NO_SELECT`
- 응답 `originProduct.detailAttribute.rentalInfo.rentalContractConditions[].ownershipTransferType`: `NO_TRANSFER`, `AUTO`
- 응답 `originProduct.detailAttribute.rentalInfo.rentalContractBenefits[].contractPeriodType`: `ALL`, `CONDITIONAL`
- 응답 `originProduct.detailAttribute.rentalInfo.rentalContractBenefits[].commitmentPeriodType`: `ALL`, `CONDITIONAL`
- 응답 `originProduct.detailAttribute.rentalInfo.rentalContractBenefits[].managementMethodType`: `ALL`, `NONE`, `VISIT`, `ONESELF`
- 응답 `originProduct.detailAttribute.rentalInfo.rentalContractBenefits[].discountTermType`: `ALL`, `PERIOD`, `CONDITIONAL`
- 응답 `originProduct.detailAttribute.rentalInfo.rentalContractBenefits[].benefitUnitType`: `PERCENT`, `WON`, `YEN`, `COUNT`
- 응답 `originProduct.detailAttribute.preOrder.preOrderEndSaleStatus`: `SALE_END`, `ON_SALE`
- 응답 `originProduct.customerBenefit.immediateDiscountPolicy.discountMethod.unitType`: `PERCENT`, `WON`, `YEN`, `COUNT`
- 응답 `originProduct.customerBenefit.purchasePointPolicy.unitType`: `PERCENT`, `WON`, `YEN`, `COUNT`
- 응답 `originProduct.customerBenefit.multiPurchaseDiscountPolicy.discountMethod.unitType`: `PERCENT`, `WON`, `YEN`, `COUNT`
- 응답 `originProduct.customerBenefit.multiPurchaseDiscountPolicy.orderValueUnitType`: `PERCENT`, `WON`, `YEN`, `COUNT`
- 응답 `originProduct.customerBenefit.reservedDiscountPolicy.discountMethod.unitType`: `PERCENT`, `WON`, `YEN`, `COUNT`
- 응답 `originProduct.customerBenefit.promotionDiscountPolicies[].discountMethod.unitType`: `PERCENT`, `WON`, `YEN`, `COUNT`
- 응답 `smartstoreChannelProduct.channelProductDisplayStatusType`: `WAIT`, `ON`, `SUSPENSION`
- 응답 `windowChannelProduct.channelProductDisplayStatusType`: `WAIT`, `ON`, `SUSPENSION`

### 호출 예시

```bash
curl -X PUT 'https://api.commerce.naver.com/external/v1/products/origin-products/{originProductNo}/option-stock' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```
