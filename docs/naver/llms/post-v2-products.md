---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/create-product-product
---
# POST /v2/products - (v2) 상품 등록

이 API는 v2 상품 도메인의 신규 상품 등록 엔드포인트로, originProduct(원상품)와 smartstoreChannelProduct/windowChannelProduct(채널상품)를 한 번에 입력하면 원상품 등록과 함께 지정된 채널상품이 자동 생성됩니다. v1 단일 상품 모델과 달리 v2 는 상품 공통 속성(원상품)과 채널별 노출 속성(스마트스토어/쇼핑윈도)을 분리하여 한 원상품을 여러 채널에 동시에 노출할 수 있는 구조를 가집니다. 필수 메타 의존성으로는 leafCategoryId(카테고리)·name·detailContent·images·salePrice·detailAttribute·productInfoProvidedNotice 등 카테고리·상세속성·정보고시 데이터가 모두 충족되어야 하며, originProduct.images 의 URL 은 반드시 상품 이미지 다건 등록 API 로 업로드해 반환받은 URL 만 입력해야 합니다. 또한 productCertificationInfos, certificationTargetExcludeContent(화학/ KC/ 친환경 인증 대상 제외 여부 포함), productInfoProvidedNotice 및 그 하위 navigation.certificationType(최대 200자) 입력 규칙을 최신 스키마에 맞춰 구성해야 하며, detailAttribute 의 superDangolYn 은 슈퍼단골 솔루션 구독 계정만 설정할 수 있고, 추가 상품 목록(supplementProductInfo.supplementProducts)에 새로 추가된 skuStatusType 은 네이버 풀필먼트 이용 계정만 입력할 수 있으며 입력하지 않으면 LATER 로 저장됩니다. 호출 시 statusType 은 SALE 만 허용되며, SUSPENSION 으로 입력해도 SALE 로 등록되고 stockQuantity 가 0 이면 자동으로 OUTOFSTOCK 으로 저장되는 점을 인지해야 합니다. 일반적인 사용 사례는 신규 상품 등록 시 카테고리·브랜드·정보고시·이미지를 사전 조회·업로드해 두고 한 번의 호출로 원상품과 채널상품을 함께 생성한 뒤 응답의 originProductNo·smartstoreChannelProductNo·windowChannelProductNo 를 내부 시스템에 보존하는 흐름입니다. windowChannelProduct 의 channelNo 는 쇼핑윈도 채널 단위로 사전에 결정되어야 하며, 잘못된 채널 번호 입력 시 등록이 실패합니다. 400 은 카테고리·옵션·정보고시/인증·이미지 URL 등 검증 실패, 401/403 은 토큰·권한, 404 는 참조 자원 부재, 500 은 일시 장애로 보고 입력 재검증 또는 지수 백오프 재시도를 적용합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 본문

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| originProduct | body | object | 필수 | 상품 공통 속성. 원상품에 속한 채널 상품은 모두 상품 공통 속성을 참고하게 됩니다. |
| originProduct.statusType | body | string | 필수 | 상품 API에서 상품의 판매 상태를 나타내기 위해 사용하는 코드입니다.<br>상품 등록 시에는 SALE(판매 중)만 입력할 수 있으며, 상품 수정 시에는 SALE(판매 중), SUSPENSION(판매 중지)만 입력할 수 있습니다. 상품 등록 시에 SUSPENSION(판매 중지)을 입력하면 SALE(판매 중)로 등록됩니다. StockQuantity의 값이 0인 경우 상품 상태는 OUTOFSTOCK(품절)으로 등록됩니다.<br>품절 상태의 상품을 판매 중으로 변경하는 경우, StockQuantity(재고 수량)와 함께 statusType을 SALE(판매 중)로 입력해야 합니다.<br>- WAIT(판매 대기), SALE(판매 중), OUTOFSTOCK(품절), UNADMISSION(승인 대기), REJECTION(승인 거부), SUSPENSION(판매 중지), CLOSE(판매 종료), PROHIBITION(판매 금지). 허용값: `WAIT`, `SALE`, `OUTOFSTOCK`, `UNADMISSION`, `REJECTION`, `SUSPENSION`, `CLOSE`, `PROHIBITION`, `DELETE` |
| originProduct.saleType | body | string |  | 상품 API에서 상품의 판매 유형을 나타내기 위해 사용하는 코드입니다. 미입력 시 NEW(새 상품)로 저장됩니다.<br>- NEW(새 상품), OLD(중고 상품). 허용값: `NEW`, `OLD` |
| originProduct.leafCategoryId | body | string |  | 상품 등록 시 필수입니다.<br>상품 수정 시 카탈로그 ID(modelId)를 입력한 경우 필수입니다.<br>표준형 옵션 카테고리 상품 수정 요청의 경우 CategoryId 변경 요청은 무시됩니다.(렌탈 상품은 정상 처리됨) |
| originProduct.name | body | string | 필수 |  |
| originProduct.detailContent | body | string | 필수 | 상품 수정 시에만 생략할 수 있습니다. 이 경우 기존에 저장된 상품 상세 정보 값이 유지됩니다. |
| originProduct.images | body | object | 필수 | 상품 이미지로 대표 이미지(1000x1000픽셀 권장)와 최대 9개의 추가 이미지 목록을 제공할 수 있습니다. 대표 이미지는 필수이고 추가 이미지는 선택 사항입니다.<br><b>이미지 URL은 반드시 상품 이미지 다건 등록 API로 이미지를 업로드하고 반환받은 URL 값을 입력해야 합니다.</b> |
| originProduct.images.… | body | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| originProduct.saleStartDate | body | string(date-time) |  | 매 시각 00분으로만 설정 가능합니다. 'yyyy-MM-dd'T'HH:mm[:ss][.SSS]XXX' 형식으로 입력합니다. |
| originProduct.saleEndDate | body | string(date-time) |  | 매 시각 59분으로만 설정 가능합니다. 'yyyy-MM-dd'T'HH:mm[:ss][.SSS]XXX' 형식으로 입력합니다. |
| originProduct.salePrice | body | integer(int64) | 필수 | 최대 999999990 |
| originProduct.stockQuantity | body | integer(int32) |  | 상품 등록 시 필수. 상품 수정 시 재고 수량을 입력하지 않으면 스마트스토어 데이터베이스에 저장된 현재 재고 값이 변하지 않습니다. 수정 시 재고 수량이 0으로 입력되면 StatusType으로 전달된 항목은 무시되며 상품 상태는 OUTOFSTOCK(품절)으로 저장됩니다.. 최대 99999999 |
| originProduct.deliveryInfo | body | object |  | 배송 방식 및 배송비 등을 설정할 수 있습니다. 입력하지 않으면 배송 없는 상품으로 등록됩니다.<br>렌탈 또는 지금배달 상품의 경우에는 배송 정보를 필수로 입력해야 합니다. |
| originProduct.deliveryInfo.… | body | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| originProduct.productLogistics | body | array |  | 풀필먼트 이용 상품은 필수 입력 |
| originProduct.productLogistics.… | body | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| originProduct.detailAttribute | body | object | 필수 | 원상품 상세 속성 |
| originProduct.detailAttribute.… | body | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| originProduct.customerBenefit | body | object |  | 상품 고객 혜택 정보 |
| originProduct.customerBenefit.… | body | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| smartstoreChannelProduct | body | object | 필수 | 이 구조체는 상품 정보 중 스마트스토어 채널 상품 속성에 해당하는 상품 데이터를 표현하는 구조체입니다.<br> - 이 구조체는 API 호출에 대한 요청/응답 모두에서 사용합니다.<br> - 구조체의 객체 1개는 상품 1개에 대한 스마트스토어 채널 상품 정보를 표현합니다.<br> - 상품 단위별로 스마트스토어 채널 상품 정보는 단일 구조체로만 포함되나 계층 구조상 자매 개체로 원상품 구조체 혹은 쇼핑윈도 채널 상품 구조체와 함께 사용할 수 있습니다.<br> - 이 구조체는 아래 API에서 사용합니다.<br>   - 상품 등록, 채널 상품 조회, 채널 상품 수정, 원상품 조회, 원상품 수정 등 |
| smartstoreChannelProduct.channelProductName | body | string |  | 채널 상품 전용 상품명을 사용하는 경우 입력합니다. 미입력 시 원상품명으로 적용됩니다. |
| smartstoreChannelProduct.bbsSeq | body | integer(int64) |  | 공지사항 |
| smartstoreChannelProduct.storeKeepExclusiveProduct | body | boolean |  | 미입력 시 false로 저장됩니다. |
| smartstoreChannelProduct.naverShoppingRegistration | body | boolean | 필수 | 네이버 쇼핑 광고주가 아닌 경우에는 false로 저장됩니다. |
| smartstoreChannelProduct.channelProductDisplayStatusType | body | string | 필수 | ON, SUSPENSION만 입력 가능합니다.<br>- WAIT(전시 대기), ON(전시 중), SUSPENSION(전시 중지). 허용값: `WAIT`, `ON`, `SUSPENSION` |
| windowChannelProduct | body | object |  | 이 구조체는 상품 정보 중 쇼핑윈도 채널 상품 속성에 해당하는 상품 데이터를 표현하는 구조체입니다.<br>- 이 구조체는 API 호출에 대한 요청/응답 모두에서 사용합니다.<br>- 구조체의 객체 1개는 상품 1개에 대한 쇼핑윈도 채널 상품 정보를 표현합니다.<br>- 상품 단위별로 쇼핑윈도 채널 상품 정보는 단일 구조체로만 포함되나 계층 구조상 자매 개체로 원상품 구조체 혹은 스마트스토어 채널 상품 구조체와 함께 사용할 수 있습니다.<br>- 이 구조체는 아래 API에서 사용합니다.<br>  - 상품 등록, 채널 상품 조회, 채널 상품 수정, 원상품 조회, 원상품 수정 등 |
| windowChannelProduct.channelProductName | body | string |  | 채널 상품 전용 상품명을 사용하는 경우 입력합니다. 미입력 시 원상품명으로 적용됩니다. |
| windowChannelProduct.bbsSeq | body | integer(int64) |  | 공지사항 |
| windowChannelProduct.storeKeepExclusiveProduct | body | boolean |  | 미입력 시 false로 저장됩니다. |
| windowChannelProduct.naverShoppingRegistration | body | boolean | 필수 | 네이버 쇼핑 광고주가 아닌 경우에는 false로 저장됩니다. |
| windowChannelProduct.channelNo | body | integer(int64) | 필수 | 전시할 윈도 채널 선택 |
| windowChannelProduct.best | body | boolean |  | 미입력 시 false로 저장됩니다. |
| windowChannelProduct.channelProductDisplayStatusType | body | string |  | WAIT(전시 대기), ON(전시 중), SUSPENSION(전시 중지). 허용값: `WAIT`, `ON`, `SUSPENSION` |

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

- 요청 본문 `originProduct.statusType`: `WAIT`, `SALE`, `OUTOFSTOCK`, `UNADMISSION`, `REJECTION`, `SUSPENSION`, `CLOSE`, `PROHIBITION`, `DELETE`
- 요청 본문 `originProduct.saleType`: `NEW`, `OLD`
- 요청 본문 `originProduct.deliveryInfo.deliveryType`: `DELIVERY`, `DIRECT`
- 요청 본문 `originProduct.deliveryInfo.deliveryAttributeType`: `NORMAL`, `TODAY`, `OPTION_TODAY`, `HOPE`, `TODAY_ARRIVAL`, `DAWN_ARRIVAL`, `ARRIVAL_GUARANTEE`, `SELLER_GUARANTEE`, `HOPE_SELLER_GUARANTEE`, `QUICK`, `PICKUP`, `QUICK_PICKUP`
- 요청 본문 `originProduct.deliveryInfo.quickServiceAreas[]`: `SEOUL`, `GYEONGGI`, `GOYANG`, `GOCHON`, `GONJIAM`, `GWACHEON`, `GWANGMYEONG`, `GYEONGGIGWANGJU`, `GYOMUN`, `GURI`, `GUSEONG`, `GUNPO`, `GIMPO`, `BUCHEON`, `BUNDANG`, `SEONGNAM`, `SUWON`, `SUJI`, `SIHEUNG`, `ANSAN`, `ANYANG`, `YONGIN`, `UIWANG`, `UIJEONGBU`, `ICHEON`, `ILSAN`, `JICHUK`, `PAJU`, `HANAM`, `GWANGJU`, `DAEGU`, `DAEJEON`, `BUSAN`, `ULSAN`, `INCHEON`
- 요청 본문 `originProduct.deliveryInfo.deliveryFee.deliveryFeeType`: `FREE`, `CONDITIONAL_FREE`, `PAID`, `UNIT_QUANTITY_PAID`, `RANGE_QUANTITY_PAID`
- 요청 본문 `originProduct.deliveryInfo.deliveryFee.deliveryFeePayType`: `COLLECT`, `PREPAID`, `COLLECT_OR_PREPAID`
- 요청 본문 `originProduct.deliveryInfo.deliveryFee.deliveryFeeByArea.deliveryAreaType`: `AREA_2`, `AREA_3`
- 요청 본문 `originProduct.deliveryInfo.claimDeliveryInfo.returnDeliveryCompanyPriorityType`: `PRIMARY`, `SECONDARY_1`, `SECONDARY_2`, `SECONDARY_3`, `SECONDARY_4`, `SECONDARY_5`, `SECONDARY_6`, `SECONDARY_7`, `SECONDARY_8`, `SECONDARY_9`
- 요청 본문 `originProduct.deliveryInfo.expectedDeliveryPeriodType`: `ETC`, `TWO`, `THREE`, `FOUR`, `FIVE`, `SIX`, `SEVEN`, `EIGHT`, `NINE`, `TEN`, `ELEVEN`, `TWELVE`, `THIRTEEN`, `FOURTEEN`
- 요청 본문 `originProduct.detailAttribute.optionInfo.simpleOptionSortType`: `CREATE`, `ABC`, `LOW_PRICE`, `HIGH_PRICE`
- 요청 본문 `originProduct.detailAttribute.optionInfo.optionCombinationSortType`: `CREATE`, `ABC`, `LOW_PRICE`, `HIGH_PRICE`
- 요청 본문 `originProduct.detailAttribute.supplementProductInfo.sortType`: `CREATE`, `ABC`, `LOW_PRICE`, `HIGH_PRICE`
- 요청 본문 `originProduct.detailAttribute.supplementProductInfo.supplementProducts[].skuStatusType`: `REQUEST`, `COMPLETE`, `CLEAR`, `DISABLED`, `LATER`
- 요청 본문 `originProduct.detailAttribute.taxType`: `TAX`, `DUTYFREE`, `SMALL`
- 요청 본문 `originProduct.detailAttribute.customsTaxType`: `NOT_APPLICABLE`, `INCLUDED`, `EXCLUDED`
- 요청 본문 `originProduct.detailAttribute.productCertificationInfos[].certificationKindType`: `KC_CERTIFICATION`, `CHILD_CERTIFICATION`, `GREEN_PRODUCTS`, `CHEMICAL_CERTIFICATION`, `PARALLEL_IMPORT`, `OVERSEAS`, `ETC`
- 요청 본문 `originProduct.detailAttribute.certificationTargetExcludeContent.kcExemptionType`: `OVERSEAS`, `SAFE_CRITERION`, `PARALLEL_IMPORT`
- 요청 본문 `originProduct.detailAttribute.certificationTargetExcludeContent.kcCertifiedProductExclusionYn`: `FALSE`, `KC_EXEMPTION_OBJECT`, `TRUE`
- 요청 본문 `originProduct.detailAttribute.ecoupon.periodType`: `FIXED`, `FLEXIBLE`
- 요청 본문 `originProduct.detailAttribute.ecoupon.usePlaceType`: `PLACE`, `ADDRESS`, `URL`
- 요청 본문 `originProduct.detailAttribute.productInfoProvidedNotice.productInfoProvidedNoticeType`: `WEAR`, `SHOES`, `BAG`, `FASHION_ITEMS`, `SLEEPING_GEAR`, `FURNITURE`, `IMAGE_APPLIANCES`, `HOME_APPLIANCES`, `SEASON_APPLIANCES`, `OFFICE_APPLIANCES`, `OPTICS_APPLIANCES`, `MICROELECTRONICS`, `CELLPHONE`, `NAVIGATION`, `CAR_ARTICLES`, `MEDICAL_APPLIANCES`, `KITCHEN_UTENSILS`, `COSMETIC`, `JEWELLERY`, `FOOD`, `GENERAL_FOOD`, `DIET_FOOD`, `KIDS`, `MUSICAL_INSTRUMENT`, `SPORTS_EQUIPMENT`, `BOOKS`, `LODGMENT_RESERVATION`, `TRAVEL_PACKAGE`, `AIRLINE_TICKET`, `RENT_CAR`, `RENTAL_HA`, `RENTAL_ETC`, `DIGITAL_CONTENTS`, `GIFT_CARD`, `MOBILE_COUPON`, `MOVIE_SHOW`, `ETC_SERVICE`, `BIOCHEMISTRY`, `BIOCIDAL`, `ETC`
- 요청 본문 `originProduct.detailAttribute.productInfoProvidedNotice.seasonAppliances.releaseDate.month`: `JANUARY`, `FEBRUARY`, `MARCH`, `APRIL`, `MAY`, `JUNE`, `JULY`, `AUGUST`, `SEPTEMBER`, `OCTOBER`, `NOVEMBER`, `DECEMBER`
- 요청 본문 `originProduct.detailAttribute.productInfoProvidedNotice.officeAppliances.releaseDate.month`: `JANUARY`, `FEBRUARY`, `MARCH`, `APRIL`, `MAY`, `JUNE`, `JULY`, `AUGUST`, `SEPTEMBER`, `OCTOBER`, `NOVEMBER`, `DECEMBER`
- 요청 본문 `originProduct.detailAttribute.productInfoProvidedNotice.sportsEquipment.releaseDate.month`: `JANUARY`, `FEBRUARY`, `MARCH`, `APRIL`, `MAY`, `JUNE`, `JULY`, `AUGUST`, `SEPTEMBER`, `OCTOBER`, `NOVEMBER`, `DECEMBER`
- 요청 본문 `originProduct.detailAttribute.preOrder.preOrderEndSaleStatus`: `SALE_END`, `ON_SALE`
- 요청 본문 `originProduct.customerBenefit.immediateDiscountPolicy.discountMethod.unitType`: `PERCENT`, `WON`, `YEN`, `COUNT`
- 요청 본문 `originProduct.customerBenefit.purchasePointPolicy.unitType`: `PERCENT`, `WON`, `YEN`, `COUNT`
- 요청 본문 `originProduct.customerBenefit.multiPurchaseDiscountPolicy.discountMethod.unitType`: `PERCENT`, `WON`, `YEN`, `COUNT`
- 요청 본문 `originProduct.customerBenefit.multiPurchaseDiscountPolicy.orderValueUnitType`: `PERCENT`, `WON`, `YEN`, `COUNT`
- 요청 본문 `originProduct.customerBenefit.reservedDiscountPolicy.discountMethod.unitType`: `PERCENT`, `WON`, `YEN`, `COUNT`
- 요청 본문 `smartstoreChannelProduct.channelProductDisplayStatusType`: `WAIT`, `ON`, `SUSPENSION`
- 요청 본문 `windowChannelProduct.channelProductDisplayStatusType`: `WAIT`, `ON`, `SUSPENSION`
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
curl -X POST 'https://api.commerce.naver.com/external/v2/products' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```
