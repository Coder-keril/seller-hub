---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/create-product-1-product
---
# POST /v2/standard-group-products - (v2) 그룹상품 등록

이 API는 v2 그룹상품 도메인에서 같은 그룹으로 묶을 판매 옵션(specificProducts) 들을 한 번에 등록하는 엔드포인트로, 단일 원상품·채널상품 모델만 제공하던 v1 과 달리 표준형 판매 옵션 기반의 그룹상품을 라이프사이클의 시작점에서 생성합니다. 그룹상품 라이프사이클은 등록(POST /v2/standard-group-products), 전환(convert-products), 해제(release-group), 전환 유효성 검사(validate-conversion), 상세 정보 임시 저장(temp-detail-content), 수정(PUT /v2/standard-group-products/{groupProductNo}), 삭제(DELETE /v2/standard-group-products/{groupProductNo}) 로 구성되며 이 API 는 그 시작점입니다. 등록 시 카테고리는 판매 옵션 사용 가능 카테고리(useOptionYn=true)만 허용되고, guideId 는 카테고리별 판매 옵션 정보 조회 API 에서 허용한 가이드만 사용해야 하며, 카테고리에 따라 specificProducts 배열은 최대 20·100·200 개까지 등록할 수 있습니다. 상품 상세 정보는 그룹 공통(commonDetailContent) 으로 입력하거나 상품별로 상품 상세 정보 임시 저장 API 에서 발급받은 detailContentTempId 를 specificProducts 하위에 입력해 다르게 설정할 수 있으며, 추가 상품 정보(supplementProductInfo)를 함께 구성하는 경우 추가 상품 목록(supplementProducts)의 skuStatusType(REQUEST/COMPLETE/CLEAR/DISABLED/LATER)은 네이버 풀필먼트 이용 계정만 입력할 수 있고 입력하지 않으면 LATER 로 저장됩니다. specificProducts 하위의 superDangolYn 은 슈퍼단골 솔루션 구독 계정만 설정할 수 있으며, 값을 보내지 않거나 null 로 보내면 기본값이 적용됩니다. 그룹 공통 상품정보제공고시(productInfoProvidedNotice)의 내비게이션(navigation) 하위 certificationType 은 최대 200자이고, 인증 정보(productCertificationInfos)와 인증 대상 제외 정보(certificationTargetExcludeContent, chemicalCertifiedProductExclusionYn 등)는 판매 옵션(specificProducts)별로 입력해야 합니다. 처리 결과는 동기 응답이 아니라 requestId·progress.state(QUEUED/IN_PROGRESS/COMPLETED/ALREADY_RESERVED/ERROR/FAILED)로 비동기 진행되므로 호출 측은 진행 상태 조회로 폴링하여 최종 상태를 확인해야 하며, ALREADY_RESERVED 가 반환되면 동일 계정에서 이미 다른 등록·수정·전환 요청이 진행 중이므로 직전 작업이 끝난 뒤 재시도합니다. 400 은 카테고리·가이드·옵션 및 고시/인증 정보 검증 실패, 401/403 은 토큰·권한, 404 는 참조 자원 부재, 500 은 일시 장애로 보고 입력 재검증·진행 상태 조회·백오프 재시도를 적용하며, 308 응답을 받으면 안내된 위치로 재요청해 처리를 이어가야 합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 본문

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| groupProduct | body | object | 필수 | 그룹상품 정보 |
| groupProduct.leafCategoryId | body | string | 필수 | 그룹상품 등록, 수정, 전환 시 필수입니다.<br>- 그룹상품 등록<br>  - 판매 옵션 사용이 가능한 카테고리(GET /v2/standard-purchase-option-guides API 조회 결과에서 useOptionYn이 true인 카테고리)만 허용됩니다.<br>- 그룹상품 수정<br>  - 아래 조건을 모두 만족하는 경우에만 카테고리를 수정할 수 있습니다.<br>    1. 그룹상품에 속한 판매 옵션 중 하나라도 등록일로부터 30일 이내이거나 카테고리 수정일로부터 30일 이내<br>    2. 수정하려는 카테고리에 기존 카테고리와 동일한 판매 옵션이 존재<br>  - 대카테고리는 변경할 수 없습니다.<br>  - 모델명 등록으로 인해 카탈로그가 연결된 경우에는 카테고리를 변경할 수 없습니다.<br>  - 카테고리 수정 시에는 수정하려는 카테고리를 기준으로 판매 옵션 정보를 조회해, 해당 카테고리에서 허용하는 판매 옵션 가이드 ID와 판매 옵션 정보를 입력해야 합니다.<br>- 그룹상품 전환<br>  - 카테고리를 변경할 수 없습니다. 기존 상품과 동일한 카테고리 ID만 허용됩니다. |
| groupProduct.name | body | string | 필수 | 그룹상품에 공통으로 사용될 명칭으로, 판매 옵션별 상품명의 경우 그룹상품명+판매 옵션값명 조합으로 생성됩니다. |
| groupProduct.guideId | body | integer(int64) | 필수 | 판매 옵션 가이드(판매 옵션의 조합)의 ID를 입력합니다. 카테고리에서 사용 가능한 판매 옵션 가이드는 카테고리별 판매 옵션 정보 조회 API로 확인할 수 있으며, 카테고리에서 허용하지 않는 가이드 ID는 사용할 수 없습니다.<br>카테고리 수정 시에는 수정 후의 카테고리에서 허용하는 판매 옵션 가이드 ID를 입력해야 합니다.<br><br>- 수정 가능 조건: 그룹상품에 속한 판매 옵션 중 하나라도 등록일로부터 30일 이내이거나 카테고리 수정일로부터 30일 이내인 경우. 가장 최근 판매 옵션 등록일 혹은 가장 최근 카테고리 수정일 기준 31일째부터는 수정 실패합니다. |
| groupProduct.brandName | body | string |  |  |
| groupProduct.brandId | body | integer(int64) |  |  |
| groupProduct.manufacturerName | body | string |  |  |
| groupProduct.itselfProductionProductYn | body | boolean |  | 미입력 시 false로 저장됩니다. |
| groupProduct.taxType | body | string |  | 네이버 상품 API에서 부가가치세의 타입을 나타내기 위해 사용하는 코드입니다. 미입력 시 TAX(과세 상품)로 등록됩니다.<br>- TAX(과세 상품), DUTYFREE(면세 상품), SMALL(영세 상품). 허용값: `TAX`, `DUTYFREE`, `SMALL` |
| groupProduct.customsTaxType | body | string |  | deprecated. 상품별 `specificProducts[].customsTaxType` 사용을 권장합니다. 상품별 값을 입력하지 않은 경우에 한해 fallback으로 그룹상품의 값이 적용됩니다.<br><br>관부가세 타입 코드입니다. 출고지 주소가 해외 주소인 경우 필수 입력 항목입니다.<br>\| 코드 \| 설명 \| 비고 \|<br>\| --- \| --- \| --- \|<br>\| NOT_APPLICABLE \| 부과 대상 아님 \| - \|<br>\| INCLUDED \| 관부가세 포함 \| 노출 채널이 해외직구인 경우 INCLUDED만 허용 \|<br>\| EXCLUDED \| 관부가세 미포함 \| - \|. 허용값: `NOT_APPLICABLE`, `INCLUDED`, `EXCLUDED` |
| groupProduct.saleType | body | string |  | 상품 API에서 상품의 판매 유형을 나타내기 위해 사용하는 코드입니다. 미입력 시 NEW(새 상품)로 등록됩니다.<br>- NEW(새 상품), OLD(중고 상품). 허용값: `NEW`, `OLD` |
| groupProduct.minorPurchasable | body | boolean | 필수 | 성인 카테고리인 경우 불가능으로 입력해야 합니다. |
| groupProduct.brandCertificationYn | body | boolean |  |  |
| groupProduct.productInfoProvidedNotice | body | object | 필수 | 상품 요약 정보<br>- 상품 등록 및 수정 시 필수 |
| groupProduct.productInfoProvidedNotice.… | body | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| groupProduct.afterServiceInfo | body | object | 필수 | A/S 정보 |
| groupProduct.afterServiceInfo.… | body | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| groupProduct.sellerCommentContent | body | string |  | 판매자 특이 사항이 있는 경우 입력합니다. |
| groupProduct.supplementProductInfo | body | object |  | 추가 상품 정보 |
| groupProduct.supplementProductInfo.… | body | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| groupProduct.seoInfo | body | object |  | SEO(Search engine optimization) 정보 |
| groupProduct.seoInfo.… | body | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| groupProduct.commonDetailContent | body | string |  | 그룹상품 하위의 모든 원상품에 동일한 상품 상세 정보를 설정하는 경우 사용합니다.<br>원상품별로 다른 상품 상세 정보를 설정하려면 상품 상세 정보 임시 저장 API에서 반환된 tempId를 specificProducts 하위의 detailContentTempId에 입력해야 합니다.<br>- 그룹상품 조회 API에서는 그룹 공통으로 설정된 상품 상세 정보만 반환됩니다. 원상품별로 다른 상품 상세 정보가 설정된 경우에는 개별 상품 조회 API를 사용해야 합니다.<br>- 그룹상품 수정 API에서는 이 필드를 생략할 수 있으며, 생략 시 기존에 저장된 그룹상품 공통 상품 상세 정보가 유지됩니다.<br>- 그룹상품 전환 API에서는 이 필드를 생략할 수 있으며, 생략 시 전환 이전 상품 상세 정보가 유지됩니다. |
| groupProduct.productSize | body | object |  | 사이즈 정보 |
| groupProduct.productSize.… | body | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| groupProduct.smartstoreGroupChannel | body | object |  |  |
| groupProduct.smartstoreGroupChannel.… | body | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| groupProduct.windowGroupChannel | body | object |  |  |
| groupProduct.windowGroupChannel.… | body | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| groupProduct.specificProducts | body | array | 필수 | 같은 그룹상품으로 등록할 판매 옵션 상품 목록입니다. 등록할 상품 수만큼 반복하여 배열로 입력합니다.<br><br>specificProducts 배열의 각 요소는 하나의 판매 옵션을 의미하며, 카테고리에 따라 최대 20개, 100개 또는 200개까지 등록할 수 있습니다. 카테고리 수정 시에는 수정 후의 카테고리를 기준으로 판매 옵션 상품 수 제한이 적용됩니다. |
| groupProduct.specificProducts.… | body | - |  | 하위 구조 생략 (상세는 OAS 참조) |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| progress | - | object |  |  |
| progress.state | - | string |  | - QUEUED: 상품 등록/수정/전환 대기 중<br>- IN PROGRESS: 상품 등록/수정/전환 진행 중<br>- COMPLETED: 상품 등록/수정/전환 완료<br>- ALREADY_RESERVED: 동일 계정에서 이미 다른 요청이 진행 중<br>- FAILED: 상품 등록/수정/전환 실패<br>- ERROR: 시스템 오류. 허용값: `QUEUED`, `IN_PROGRESS`, `COMPLETED`, `ALREADY_RESERVED`, `ERROR`, `FAILED` |
| progress.invalidInputs | - | array |  |  |
| progress.invalidInputs.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| progress.errorMessage | - | string |  |  |
| progress.progress | - | integer(int32) |  |  |
| requestId | - | string |  | 요청을 식별하기 위한 고유 ID입니다. 처리 상태와 진행 상황을 조회할 수 있습니다. |
| groupProductNo | - | integer(int64) |  |  |
| productNos | - | array |  |  |
| productNos.originProductNo | - | integer(int64) |  |  |
| productNos.smartstoreChannelProductNo | - | integer(int64) |  |  |
| productNos.windowChannelProductNo | - | integer(int64) |  |  |
| standardPurchaseOptionsIds | - | array |  |  |
| standardPurchaseOptionsIds.originProductNo | - | integer(int64) |  |  |
| standardPurchaseOptionsIds.standardPurchaseOptionsIds | - | array |  |  |
| standardPurchaseOptionsIds.standardPurchaseOptionsIds.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |

### 에러 코드

| 상태 코드 | 설명 |
|-----------|------|
| 400 | 잘못된 요청<br/>- code : BAD_REQUEST |
| 401 | 인가되지 않은 요청<br/>- code : UNAUTHORIZED |
| 403 | 권한 없음<br/>- code : FORBIDDEN |
| 404 | 데이터 없음<br/>- code : NOT_FOUND |
| 500 | 내부 서버 오류<br/>- code : INTERNAL_SERVER_ERROR |

### 사용 enum 카탈로그

- 요청 본문 `groupProduct.taxType`: `TAX`, `DUTYFREE`, `SMALL`
- 요청 본문 `groupProduct.customsTaxType`: `NOT_APPLICABLE`, `INCLUDED`, `EXCLUDED`
- 요청 본문 `groupProduct.saleType`: `NEW`, `OLD`
- 요청 본문 `groupProduct.productInfoProvidedNotice.productInfoProvidedNoticeType`: `WEAR`, `SHOES`, `BAG`, `FASHION_ITEMS`, `SLEEPING_GEAR`, `FURNITURE`, `IMAGE_APPLIANCES`, `HOME_APPLIANCES`, `SEASON_APPLIANCES`, `OFFICE_APPLIANCES`, `OPTICS_APPLIANCES`, `MICROELECTRONICS`, `CELLPHONE`, `NAVIGATION`, `CAR_ARTICLES`, `MEDICAL_APPLIANCES`, `KITCHEN_UTENSILS`, `COSMETIC`, `JEWELLERY`, `FOOD`, `GENERAL_FOOD`, `DIET_FOOD`, `KIDS`, `MUSICAL_INSTRUMENT`, `SPORTS_EQUIPMENT`, `BOOKS`, `LODGMENT_RESERVATION`, `TRAVEL_PACKAGE`, `AIRLINE_TICKET`, `RENT_CAR`, `RENTAL_HA`, `RENTAL_ETC`, `DIGITAL_CONTENTS`, `GIFT_CARD`, `MOBILE_COUPON`, `MOVIE_SHOW`, `ETC_SERVICE`, `BIOCHEMISTRY`, `BIOCIDAL`, `ETC`
- 요청 본문 `groupProduct.productInfoProvidedNotice.seasonAppliances.releaseDate.month`: `JANUARY`, `FEBRUARY`, `MARCH`, `APRIL`, `MAY`, `JUNE`, `JULY`, `AUGUST`, `SEPTEMBER`, `OCTOBER`, `NOVEMBER`, `DECEMBER`
- 요청 본문 `groupProduct.productInfoProvidedNotice.officeAppliances.releaseDate.month`: `JANUARY`, `FEBRUARY`, `MARCH`, `APRIL`, `MAY`, `JUNE`, `JULY`, `AUGUST`, `SEPTEMBER`, `OCTOBER`, `NOVEMBER`, `DECEMBER`
- 요청 본문 `groupProduct.productInfoProvidedNotice.sportsEquipment.releaseDate.month`: `JANUARY`, `FEBRUARY`, `MARCH`, `APRIL`, `MAY`, `JUNE`, `JULY`, `AUGUST`, `SEPTEMBER`, `OCTOBER`, `NOVEMBER`, `DECEMBER`
- 요청 본문 `groupProduct.supplementProductInfo.sortType`: `CREATE`, `ABC`, `LOW_PRICE`, `HIGH_PRICE`
- 요청 본문 `groupProduct.supplementProductInfo.supplementProducts[].skuStatusType`: `REQUEST`, `COMPLETE`, `CLEAR`, `DISABLED`, `LATER`
- 요청 본문 `groupProduct.specificProducts[].immediateDiscountPolicy.discountMethod.unitType`: `PERCENT`, `WON`, `YEN`, `COUNT`
- 요청 본문 `groupProduct.specificProducts[].reservedDiscountPolicy.discountMethod.unitType`: `PERCENT`, `WON`, `YEN`, `COUNT`
- 요청 본문 `groupProduct.specificProducts[].customerBenefit.purchasePointPolicy.unitType`: `PERCENT`, `WON`, `YEN`, `COUNT`
- 요청 본문 `groupProduct.specificProducts[].customerBenefit.multiPurchaseDiscountPolicy.discountMethod.unitType`: `PERCENT`, `WON`, `YEN`, `COUNT`
- 요청 본문 `groupProduct.specificProducts[].customerBenefit.multiPurchaseDiscountPolicy.orderValueUnitType`: `PERCENT`, `WON`, `YEN`, `COUNT`
- 요청 본문 `groupProduct.specificProducts[].deliveryInfo.deliveryType`: `DELIVERY`, `DIRECT`
- 요청 본문 `groupProduct.specificProducts[].deliveryInfo.deliveryAttributeType`: `NORMAL`, `TODAY`, `OPTION_TODAY`, `HOPE`, `TODAY_ARRIVAL`, `DAWN_ARRIVAL`, `ARRIVAL_GUARANTEE`, `SELLER_GUARANTEE`, `HOPE_SELLER_GUARANTEE`, `QUICK`, `PICKUP`, `QUICK_PICKUP`
- 요청 본문 `groupProduct.specificProducts[].deliveryInfo.quickServiceAreas[]`: `SEOUL`, `GYEONGGI`, `GOYANG`, `GOCHON`, `GONJIAM`, `GWACHEON`, `GWANGMYEONG`, `GYEONGGIGWANGJU`, `GYOMUN`, `GURI`, `GUSEONG`, `GUNPO`, `GIMPO`, `BUCHEON`, `BUNDANG`, `SEONGNAM`, `SUWON`, `SUJI`, `SIHEUNG`, `ANSAN`, `ANYANG`, `YONGIN`, `UIWANG`, `UIJEONGBU`, `ICHEON`, `ILSAN`, `JICHUK`, `PAJU`, `HANAM`, `GWANGJU`, `DAEGU`, `DAEJEON`, `BUSAN`, `ULSAN`, `INCHEON`
- 요청 본문 `groupProduct.specificProducts[].deliveryInfo.deliveryFee.deliveryFeeType`: `FREE`, `CONDITIONAL_FREE`, `PAID`, `UNIT_QUANTITY_PAID`, `RANGE_QUANTITY_PAID`
- 요청 본문 `groupProduct.specificProducts[].deliveryInfo.deliveryFee.deliveryFeePayType`: `COLLECT`, `PREPAID`, `COLLECT_OR_PREPAID`
- 요청 본문 `groupProduct.specificProducts[].deliveryInfo.deliveryFee.deliveryFeeByArea.deliveryAreaType`: `AREA_2`, `AREA_3`
- 요청 본문 `groupProduct.specificProducts[].deliveryInfo.claimDeliveryInfo.returnDeliveryCompanyPriorityType`: `PRIMARY`, `SECONDARY_1`, `SECONDARY_2`, `SECONDARY_3`, `SECONDARY_4`, `SECONDARY_5`, `SECONDARY_6`, `SECONDARY_7`, `SECONDARY_8`, `SECONDARY_9`
- 요청 본문 `groupProduct.specificProducts[].deliveryInfo.expectedDeliveryPeriodType`: `ETC`, `TWO`, `THREE`, `FOUR`, `FIVE`, `SIX`, `SEVEN`, `EIGHT`, `NINE`, `TEN`, `ELEVEN`, `TWELVE`, `THIRTEEN`, `FOURTEEN`
- 요청 본문 `groupProduct.specificProducts[].productCertificationInfos[].certificationKindType`: `KC_CERTIFICATION`, `CHILD_CERTIFICATION`, `GREEN_PRODUCTS`, `CHEMICAL_CERTIFICATION`, `PARALLEL_IMPORT`, `OVERSEAS`, `ETC`
- 요청 본문 `groupProduct.specificProducts[].certificationTargetExcludeContent.kcExemptionType`: `OVERSEAS`, `SAFE_CRITERION`, `PARALLEL_IMPORT`
- 요청 본문 `groupProduct.specificProducts[].certificationTargetExcludeContent.kcCertifiedProductExclusionYn`: `FALSE`, `KC_EXEMPTION_OBJECT`, `TRUE`
- 요청 본문 `groupProduct.specificProducts[].customsTaxType`: `NOT_APPLICABLE`, `INCLUDED`, `EXCLUDED`
- 요청 본문 `groupProduct.specificProducts[].smartstoreChannelProduct.channelProductDisplayStatusType`: `WAIT`, `ON`, `SUSPENSION`
- 요청 본문 `groupProduct.specificProducts[].windowChannelProduct.channelProductDisplayStatusType`: `WAIT`, `ON`, `SUSPENSION`
- 요청 본문 `groupProduct.specificProducts[].preOrder.preOrderEndSaleStatus`: `SALE_END`, `ON_SALE`
- 응답 `progress.state`: `QUEUED`, `IN_PROGRESS`, `COMPLETED`, `ALREADY_RESERVED`, `ERROR`, `FAILED`

### 호출 예시

```bash
curl -X POST 'https://api.commerce.naver.com/external/v2/standard-group-products' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```
