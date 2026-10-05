<!-- https://apicenter.commerce.naver.com/docs/commerce-api/current/schemas/%EC%9B%90%EC%83%81%ED%92%88-%EC%A0%95%EB%B3%B4-%EA%B5%AC%EC%A1%B0%EC%B2%B4 -->
# 원상품 정보 구조체 | 커머스API

원상품 정보 구조체

응답용 원상품 정보. 원상품에 속한 채널 상품은 모두 상품 공통 속성을 참고합니다.
이 구조체는 상품 정보 중 원상품 속성에 해당하는 상품 데이터를 표현하는 구조체입니다.

이 구조체는 API 호출에 대한 요청/응답 모두에서 사용합니다.

구조체의 객체 1개는 상품 1개에 대한 원상품 정보를 표현합니다.

상품 단위별로 원상품 정보는 단일 구조체로만 포함되나 계층 구조상 자매 개체로 스마트스토어 채널상품 구조체 혹은 쇼핑윈도 채널상품 구조체와 함께 사용할 수 있습니다.

이 구조체는 아래 API에서 사용합니다.

상품 등록, 채널 상품 조회, 채널 상품 수정, 원상품 조회, 원상품 수정 등
이 구조체는 상품 정보 중 원상품 속성에 해당하는 상품 데이터를 표현하는 구조체입니다.

이 구조체는 API 호출에 대한 요청/응답 모두에서 사용합니다.

구조체의 객체 1개는 상품 1개에 대한 원상품 정보를 표현합니다.

상품 단위별로 원상품 정보는 단일 구조체로만 포함되나 계층 구조상 자매 개체로 스마트스토어 채널상품 구조체 혹은 쇼핑윈도 채널상품 구조체와 함께 사용할 수 있습니다.

이 구조체는 아래 API에서 사용합니다.

상품 등록, 채널 상품 조회, 채널 상품 수정, 원상품 조회, 원상품 수정 등

statusType상품 판매 상태 코드 (string)requiredPossible values: [WAIT, SALE, OUTOFSTOCK, UNADMISSION, REJECTION, SUSPENSION, CLOSE, PROHIBITION, DELETE]

saleType상품 판매 유형 코드 (string)Possible values: [NEW, OLD]

leafCategoryId리프 카테고리 ID (string)

name상품명 (string)required

detailContent상품 상세 정보 (string)required

images 상품 이미지 (object)required상품 이미지로 대표 이미지(1000x1000픽셀 권장)와 최대 9개의 추가 이미지 목록을 제공할 수 있습니다. 대표 이미지는 필수이고 추가 이미지는 선택 사항입니다.
이미지 URL은 반드시 상품 이미지 다건 등록 API로 이미지를 업로드하고 반환받은 URL 값을 입력해야 합니다.
representativeImage 이미지 (object)requiredurl이미지 URL (string)required

optionalImages 이미지 (object)[]추가 이미지 목록. 최대 9개. 이미지 URL은 반드시 상품 이미지 다건 등록 API로 이미지를 업로드하고 반환받은 URL 값을 입력해야 합니다.
Array [

url이미지 URL (string)required

]

saleStartDate판매 시작 일시 (string<date-time>)'yyyy-MM-dd'T'HH:mm[:ss][.SSS]XXX' 형식으로 입력합니다.

saleEndDate판매 종료 일시 (string<date-time>)'yyyy-MM-dd'T'HH:mm[:ss][.SSS]XXX' 형식으로 입력합니다.

salePrice상품 판매 가격 (integer<int64>)requiredPossible values: <= 999999990

stockQuantity재고 수량 (integer<int32>)Possible values: <= 99999999

deliveryInfo 배송 정보 (object)배송 방식 및 배송비 등을 설정할 수 있습니다. 입력하지 않으면 배송 없는 상품으로 등록됩니다.
렌탈 또는 지금배달 상품의 경우에는 배송 정보를 필수로 입력해야 합니다.
deliveryType배송 방법 유형 코드 (string)required네이버 상품 API에서 배송 방법 유형을 나타내기 위해 사용하는 코드입니다.

DELIVERY(택배, 소포, 등기), DIRECT(직접배송(화물배달))

네이버 풀필먼트 상품, 배송 속성 SELLER_GUARANTEE(N판매자배송), 배송 속성 HOPE_SELLER_GUARANTEE(N희망일배송)인 경우 배송 방법은 DELIVERY(택배, 소포, 등기)만 허용됩니다.

Possible values: [DELIVERY, DIRECT]

deliveryAttributeType배송 속성 타입 코드 (string)required네이버 상품 API에서 배송 속성 타입을 나타내기 위해 사용하는 코드입니다.
네이버 풀필먼트 상품은 OPTION_TODAY(옵션별 오늘출발)을 설정할 수 없습니다.

상품 등록/수정 시: NORMAL(일반 배송), TODAY(오늘출발), OPTION_TODAY(옵션별 오늘출발), HOPE(희망일배송), TODAY_ARRIVAL(당일배송(지금배달 관련 기능)), DAWN_ARRIVAL(새벽배송(지금배달 관련 기능)), ARRIVAL_GUARANTEE(N배송), SELLER_GUARANTEE(N판매자배송), HOPE_SELLER_GUARANTEE(N희망일배송), QUICK(즉시배달(퀵커머스 관련 기능)), PICKUP(픽업(퀵커머스 관련 기능)), QUICK_PICKUP(배달,픽업(퀵커머스 관련 기능))

상품 일괄 수정 시: NORMAL(일반 배송), TODAY(오늘출발), HOPE(희망일배송), SELLER_GUARANTEE(N판매자배송), HOPE_SELLER_GUARANTEE(N희망일배송)

렌탈 상품 등록/수정 시: NORMAL(일반 배송), HOPE(희망일배송)

그룹상품 등록/수정 시: NORMAL(일반 배송), TODAY(오늘 출발), HOPE(희망일배송), ARRIVAL_GUARANTEE (N배송), SELLER_GUARANTEE(N판매자배송), HOPE_SELLER_GUARANTEE (N희망일배송)

Possible values: [NORMAL, TODAY, OPTION_TODAY, HOPE, TODAY_ARRIVAL, DAWN_ARRIVAL, ARRIVAL_GUARANTEE, SELLER_GUARANTEE, HOPE_SELLER_GUARANTEE, QUICK, PICKUP, QUICK_PICKUP]

deliveryCompany택배사 (string)DELIVERY(택배, 소포, 등기)일 때 필수 입력

주문 > 발주/발송 처리 > 발송 처리 API의 택배사 코드(deliveryCompanyCode)를 참고하여 코드값을 입력합니다.

배송 속성이 SELLER_GUARANTEE(N판매자배송), HOPE_SELLER_GUARANTEE(N희망일배송)인 경우 판매자정보 > 판매자 물류 > 물류사 연동 정보 조회 API에서 해당하는 deliveryTypes(배송 속성)의 logisticsCompanyId(물류사 ID)를 상품 API의 deliveryCompany(택배사)에 입력합니다.

outboundLocationId판매자 창고 ID (string)배송 속성이 SELLER_GURANTEE(N판매자배송), HOPE_SELLER_GUARANTEE(N희망일배송)인 경우 필수. 그 밖의 배송 속성에 입력된 판매자 창고 ID값은 무시됩니다.
판매자정보 > 판매자물류 > 판매자 창고 정보 조회 API에서 해당하는 deliveryType(배송 속성)의 창고 ID를 입력합니다.

deliveryBundleGroupUsable묶음배송 가능 여부 (boolean)묶음배송 그룹 코드가 존재하는 경우 자동으로 true로 설정됩니다.
배송 속성이 HOPE_SELLER_GUARANTEE(N희망일배송)인 경우 묶음배송을 설정할 수 없습니다.

deliveryBundleGroupId묶음배송 그룹 코드 (integer<int64>)묶음배송 가능이 true이고 묶음배송 그룹 코드가 null이면 기본 그룹으로 저장됩니다.(배송 속성이 ARRIVAL_GUARANTEE인 경우 제외)

quickServiceAreasstring[]퀵서비스 배송 지역 코드입니다.
네이버 풀필먼트 상품, N희망일배송 상품은 퀵서비스를 설정할 수 없습니다.

SEOUL(서울 전지역), GYEONGGI(경기 전지역), GOYANG(경기 고양), GOCHON(경기 고촌), GONJIAM(경기 곤지암), GWACHEON(경기 과천), GWANGMYEONG(경기 광명), GYEONGGIGWANGJU(경기 광주), GYOMUN(경기 교문리), GURI(경기 구리), GUSEONG(경기 구성), GUNPO(경기 군포), GIMPO(경기 김포), BUCHEON(경기 부천), BUNDANG(경기 분당), SEONGNAM(경기 성남), SUWON(경기 수원), SUJI(경기 수지), SIHEUNG(경기 시흥), ANSAN(경기 안산), ANYANG(경기 안양), YONGIN(경기 용인), UIWANG(경기 의왕), UIJEONGBU(경기 의정부), ICHEON(경기 이천), ILSAN(경기 일산), JICHUK(경기 지축), PAJU(경기 파주), HANAM(경기 하남), GWANGJU(광주 전지역), DAEGU(대구 전지역), DAEJEON(대전 전지역), BUSAN(부산 전지역), ULSAN(울산 전지역), INCHEON(인천 전지역)

Possible values: [SEOUL, GYEONGGI, GOYANG, GOCHON, GONJIAM, GWACHEON, GWANGMYEONG, GYEONGGIGWANGJU, GYOMUN, GURI, GUSEONG, GUNPO, GIMPO, BUCHEON, BUNDANG, SEONGNAM, SUWON, SUJI, SIHEUNG, ANSAN, ANYANG, YONGIN, UIWANG, UIJEONGBU, ICHEON, ILSAN, JICHUK, PAJU, HANAM, GWANGJU, DAEGU, DAEJEON, BUSAN, ULSAN, INCHEON]

visitAddressId방문 수령 주소록 ID (integer<int64>)방문 수령 주소 코드.
네이버 풀필먼트 상품, N희망일배송 상품은 방문 수령을 설정할 수 없습니다.

deliveryFee 배송비 정보 (object)required배송비 정보
deliveryFeeType배송비 타입 (string)배송비 타입을 입력하지 않으면 FREE(무료)로 설정됩니다.

FREE(무료), CONDITIONAL_FREE(조건부 무료), PAID(유료), UNIT_QUANTITY_PAID(수량별), RANGE_QUANTITY_PAID(구간별)

렌탈 상품 등록/수정 시: FREE(무료), PAID(유료)

Possible values: [FREE, CONDITIONAL_FREE, PAID, UNIT_QUANTITY_PAID, RANGE_QUANTITY_PAID]

baseFee기본 배송비 (integer<int32>)Possible values: <= 100000

freeConditionalAmount무료 조건 금액 (integer<int32>)배송비 유형이 '조건부 무료'일 경우 입력합니다.Possible values: <= 999999990

repeatQuantity기본 배송비 반복 부과 수량 (integer<int32>)반복 수량. 배송비 유형이 '수량별 부과 - 반복 구간'일 경우 입력합니다.

secondBaseQuantity배송비 조건 2구간 수량 (integer<int32>)2구간 최소 수량. 배송비 유형이 '수량별 부과 - 구간 직접 설정'일 경우 입력합니다.

secondExtraFee배송비 조건 2구간 수량 초과 시 추가 배송비 (integer<int32>)2구간 추가 배송비. 배송비 유형이 '수량별 부과 - 구간 직접 설정'일 경우 입력합니다.

thirdBaseQuantity배송비 조건 3구간 수량 (integer<int32>)3구간 최소 수량. 배송비 유형이 '수량별 부과 - 구간 직접 설정'일 경우 입력합니다.

thirdExtraFee배송비 조건 3구간 초과 시 추가 배송비 (integer<int32>)3구간 추가 배송비. 배송비 유형이 '수량별 부과 - 구간 직접 설정'일 경우 입력합니다.

deliveryFeePayType배송비 결제 방식 코드 (string)네이버 상품 API에서 배송비 결제 방식을 나타내기 위해 사용하는 코드입니다.

COLLECT(착불), PREPAID(선결제), COLLECT_OR_PREPAID(착불 또는 선결제)

Possible values: [COLLECT, PREPAID, COLLECT_OR_PREPAID]

deliveryFeeByArea 지역별 추가 배송비 (object)지역별 추가 배송비
deliveryAreaType지역별 추가 배송비 권역 코드 (string)required묶음배송 그룹 등록 시 지역별 추가 배송비 권역을 입력하기 위한 코드입니다.
묶음배송 가능 여부가 true인 경우 묶음배송 그룹에 설정된 값이 적용됩니다.(배송 속성이 ARRIVAL_GUARANTEE인 경우 제외).

AREA_2(내륙/제주 및 도서산간 지역으로 구분(2권역)), AREA_3(내륙/제주/제주 외 도서산간 지역으로 구분(3권역))

Possible values: [AREA_2, AREA_3]

area2extraFee2권역 추가 배송비 (integer<int32>)2권역인 경우 '제주 및 도서산간' 지역 추가 배송비.
3권역인 경우 '제주' 지역 추가 배송비.
묶음배송 가능 여부가 true인 경우 묶음배송 그룹에 설정된 값이 적용됩니다(배송 속성이 ARRIVAL_GUARANTEE인 경우 제외).Possible values: <= 200000

area3extraFee3권역 추가 배송비 (integer<int32>)'제주 외 도서산간' 지역 추가 배송비. deliveryAreaType이 3권역인 경우 필수.
묶음배송 가능 여부가 true인 경우 묶음배송 그룹에 설정된 값이 적용됩니다(배송 속성이 ARRIVAL_GUARANTEE인 경우 제외).Possible values: <= 200000

differentialFeeByArea지역별 차등 배송비 정보 (string)

claimDeliveryInfo 클레임(반품/교환) 정보 (object)required클레임(반품/교환) 정보
returnDeliveryCompanyPriorityType반품 택배사 우선순위 타입 (string)미입력 시 '기본 반품 택배사(PRIMARY)'로 설정됩니다.Possible values: [PRIMARY, SECONDARY_1, SECONDARY_2, SECONDARY_3, SECONDARY_4, SECONDARY_5, SECONDARY_6, SECONDARY_7, SECONDARY_8, SECONDARY_9]

returnDeliveryFee반품 배송비 (integer<int32>)requiredPossible values: <= 1000000

exchangeDeliveryFee교환 배송비 (integer<int32>)requiredPossible values: <= 1000000

shippingAddressId출고지 주소록 번호 (integer<int64>)배송 속성이 ARRIVAL_GUARANTEE(N배송)인 경우 null로 입력합니다.

returnAddressId반품/교환지 주소록 번호 (integer<int64>)

freeReturnInsuranceYn반품안심케어 설정 (boolean)

installation설치 여부 (boolean)배송 속성이 HOPE_SELLER_GUARANTEE(N희망일배송)인 경우에만 필수. 미입력 시 false로 설정됩니다. 그 외 배송 속성에 입력한 경우 무시됩니다.

installationFee별도 설치비 유무 (boolean)설치 여부가 false이면 별도 설치비 유무는 입력한 값에 관계 없이 false로 설정됩니다.

expectedDeliveryPeriodType주문 제작 상품 발송 예정일 타입 코드 (string)ETC는 상품 수정에만 사용 가능하며, 이미 저장된 '주문 후 예상 발송 기간' 값이 존재하거나 '직접 입력형'인 경우 설정 가능합니다.

ETC(직접 입력형), TWO(선택형: 2일), THREE(선택형: 3일), FOUR(선택형: 4일), FIVE(선택형: 5일), SIX(선택형: 6일), SEVEN(선택형: 7일), EIGHT(선택형: 8일), NINE(선택형: 9일), TEN(선택형: 10일), ELEVEN(선택형: 11일), TWELVE(선택형: 12일), THIRTEEN(선택형: 13일 ), FOURTEEN(선택형: 14일)

Possible values: [ETC, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE, TEN, ELEVEN, TWELVE, THIRTEEN, FOURTEEN]

expectedDeliveryPeriodDirectInput발송 예정일 직접 입력 값 (string)

todayStockQuantity오늘출발 상품 재고 수량 (integer<int32>)

customProductAfterOrderYn주문 확인 후 제작 상품 여부 (boolean)

hopeDeliveryGroupId희망일배송 그룹 번호 (integer<int64>)배송 속성 타입 코드가 희망일배송이고 희망일배송 그룹 번호가 Null이면 기본 그룹으로 저장됩니다.

businessCustomsClearanceSaleYn사업자 통관 판매 여부 (boolean)출고지 주소가 해외인 경우에만 적용됩니다. 미입력 시 false로 입력됩니다.

productLogistics 물류사 정보 (object)[]네이버 풀필먼트가 설정된 상품의 경우 조회됩니다.
Array [

logisticsCompanyId물류사 ID (string)required네이버 풀필먼트 서비스를 이용 중인 경우 입력할 수 있으며, (판매자 풀필먼트)물류사 연동 정보 조회 API로 확인한 물류사 ID를 입력합니다.

logisticsCenterId물류센터 ID(deprecated) (string)deprecated

]

detailAttribute 조회용 원상품 상세 속성 (object)required조회용 원상품 상세 속성
naverShoppingSearchInfo 네이버 쇼핑 검색 정보 (object)네이버 쇼핑 검색 정보
modelId상품 모델 ID (integer<int64>)

modelName상품 모델명 (string)

manufacturerName제조사명 (string)

brandId브랜드 ID (integer<int64>)

brandName브랜드명 (string)

catalogMatchingYn카탈로그 연결 완료 여부 (boolean)

true: 호출한 원상품이 스마트스토어 또는 쇼핑윈도 중 하나라도 카탈로그에 연결 완료된 상태. 이 상태에서는 modelId(모델 ID) 및 modelName(모델명) 수정 호출이 제한되며, 스마트스토어센터에서만 수정할 수 있습니다.

false: 호출한 원상품이 스마트스토어와 쇼핑윈도 모두 카탈로그에 연결되지 않은 상태를 의미합니다. 이 상태에서는 modelId(모델 ID) 및 modelName(모델명)을 수정 호출할 수 있습니다.

matchedCatalogId연결 완료된 카탈로그 ID (integer<int64>)catalogMatchingYn이 true인 경우에만 조회됩니다. 이 카탈로그 ID로 카탈로그 단건 조회를 호출해 상세 정보를 조회할 수 있습니다.

manufactureDefineNo품번 (string)

afterServiceInfo A/S 정보 (object)A/S 정보
afterServiceTelephoneNumberA/S 전화번호 (string)required

afterServiceGuideContentA/S 안내 (string)required

purchaseQuantityInfo 구매 수량 설정 정보 (object)구매 수량 정보
minPurchaseQuantity최소 구매 수량 (integer<int32>)Possible values: <= 10000

maxPurchaseQuantityPerId1인 최대 구매 수량 (integer<int32>)Possible values: <= 99999999

maxPurchaseQuantityPerOrder1회 최대 구매 수량 (integer<int32>)Possible values: <= 10000

originAreaInfo 원산지 정보 (object)원산지 정보
originAreaCode원산지 상세 지역 코드 (string)required
00(국산), 01(원양산), 02(수입산), 03(기타-상세 설명에 표시), 04(기타-직접 입력), 05(원산지 표기 의무 대상 아님)

importer수입사명 (string)수입산인 경우 필수

content원산지 표시 내용 (string)originAreaCode가 '기타: 직접 입력'인 경우 필수

plural복수 원산지 여부 (boolean)원산지가 다른 상품을 같이 등록하는지 여부. 미입력 시 false로 저장됩니다.

sellerCodeInfo 판매자 코드 정보 (object)판매자 코드 정보
sellerManagementCode판매자 관리 코드 (string)

sellerBarcode판매자 바코드 (string)

sellerCustomCode1판매자 내부 코드 1 (string)판매자가 내부에서 사용하는 코드

sellerCustomCode2판매자 내부 코드 2 (string)판매자가 내부에서 사용하는 코드

skuYnSKU 생성 여부 (boolean)

optionInfo 옵션 정보 (object)옵션 정보. 단독형 옵션, 조합형 옵션, 직접 입력형 옵션 중 최소 한 개는 입력해야 합니다. 렌탈 상품의 경우 조합형, 직접 입력형만 사용 가능합니다.

단독형 옵션과 조합형 옵션은 함께 사용할 수 없습니다.

simpleOptionSortType단독형 옵션 정렬 순서 (string)미입력 혹은 비허용 타입 입력 시 기본값인 등록순(CREATE)으로 설정됩니다. CREATE, ABC만 입력 가능합니다.

CREATE(등록순), ABC(가나다순)

Possible values: [CREATE, ABC, LOW_PRICE, HIGH_PRICE]

optionSimple 옵션 (object)[]최대 3개까지 등록할 수 있습니다.

표준형 옵션, 단독형 옵션, 조합형 옵션, 직접 입력형 옵션 중 최소 한 개는 입력해야 합니다.

표준형 옵션, 단독형 옵션과 조합형 옵션은 함께 사용할 수 없습니다.

상품 수정 시 SKU가 연결된 표준형/조합형 옵션을 단독형 옵션으로 수정하면 SKU 연결 정보가 삭제됩니다.

Array [

id옵션 ID (integer<int64>)옵션 ID 입력 시 기존 옵션 수정

groupName옵션명 (string)required

name옵션값 (string)"단독형 옵션"인 경우 입력합니다. "직접 입력형 옵션"인 경우 무시됩니다

usable사용 여부 (boolean)미입력 시 사용 여부는 true로 설정됩니다.Default value: true

]

optionCustom 옵션 (object)[]최대 5개까지 등록할 수 있습니다.

표준형 옵션, 단독형 옵션, 조합형 옵션, 직접 입력형 옵션 중 최소 한 개는 입력해야 합니다.

Array [

id옵션 ID (integer<int64>)옵션 ID 입력 시 기존 옵션 수정

groupName옵션명 (string)required

name옵션값 (string)"단독형 옵션"인 경우 입력합니다. "직접 입력형 옵션"인 경우 무시됩니다

usable사용 여부 (boolean)미입력 시 사용 여부는 true로 설정됩니다.Default value: true

]

optionCombinationSortType조합형 옵션 정렬 순서 (string)미입력 시 기본값인 등록순(CREATE)으로 설정됩니다.

CREATE(등록순), ABC(가나다순), LOW_PRICE(낮은 가격순), HIGH_PRICE(높은 가격순)

렌탈 상품의 경우 CREATE(등록순), ABC(가나다순)만 설정 가능합니다.

Possible values: [CREATE, ABC, LOW_PRICE, HIGH_PRICE]

optionCombinationGroupNames 조합형 옵션명 (object)조합형 옵션명 목록
optionGroupName1조합형 옵션명 1 (string)required

optionGroupName2조합형 옵션명 2 (string)

optionGroupName3조합형 옵션명 3 (string)

optionGroupName4조합형 옵션명 4 (string)"지점형 옵션"인 경우만 대상. "조합형 옵션"인 경우 무시됩니다.

optionCombinations 조합형 옵션 (object)[]최대 등록 가능한 옵션 개수는 조합형은 3개, 지점형은 4개입니다.

지금배달 상품의 경우 지점형 옵션은 반드시 등록해야 합니다.

표준형 옵션, 단독형 옵션, 조합형 옵션, 직접 입력형 옵션 중 최소 한 개는 입력해야 합니다.

표준형 옵션, 단독형 옵션, 조합형 옵션은 함께 사용할 수 없습니다.

Array [

id조합형 옵션 ID (integer<int64>)
상품 수정 시

옵션 ID를 입력한 경우, 옵션 ID의 옵션 정보를 수정합니다.

옵션 ID를 입력하지 않은 경우, 옵션값의 옵션 정보를 수정합니다(해당 옵션값이 존재하지 않으면 옵션 신규 등록).

지금배달, 퀵커머스 상품 수정 시

옵션값(optionName)에 기재된 지점 ID의 옵션 정보를 수정합니다.

기존 옵션 ID(id)와 다른 옵션값(optionName, 지점 ID)을 입력한 경우, 옵션 정보 수정 후 옵션 ID(id)가 변경됩니다.

stockQuantity재고 수량 (integer<int32>)미입력 시 0으로 설정됩니다.Possible values: <= 99999999

price옵션가 (integer<int32>)미입력 시 0으로 설정됩니다.Possible values: <= 999999990

usable사용 여부 (boolean)미입력 시 사용 여부는 true로 설정됩니다.Default value: true

optionName1조합형 옵션값 1 (string)requiredcombinationOptionNames의 옵션명 1에 해당하는 옵션값. 지금배달 계정 요청, 즉 지점 옵션(BRANCH)인 경우에는 옵션명이 아닌 지점 ID를 입력합니다.

optionName2조합형 옵션값 2 (string)combinationOptionNames의 옵션명 2에 해당하는 옵션값

optionName3조합형 옵션값 3 (string)combinationOptionNames의 옵션명 3에 해당하는 옵션값

optionName4조합형 옵션값 4 (string)combinationOptionNames의 옵션명 4에 해당하는 옵션값. '지점형 옵션'인 경우만 대상. "조합형 옵션"인 경우 무시됩니다.

sellerManagerCode판매자 관리 코드 (string)

skuYnSKU 생성 여부 (boolean)네이버 풀필먼트 서비스를 이용 중인 경우 입력할 수 있으며, 이용 권한이 없는 계정에 입력된 값은 무시됩니다.

재고 관리 메뉴에 신규 SKU를 생성하려는 경우 Y를 입력합니다. (모든 옵션에 공통으로 적용됩니다.)

상품 등록 시 SKU 생성 여부를 입력하지 않으면 N으로 등록됩니다.

상품 수정 시 SKU 생성 여부를 입력하지 않으면 기존 값이 유지됩니다.(상품 수정 시 요청된 N은 무시됩니다.)

]

standardOptionGroups 표준형 옵션 그룹 (object)[]표준형 옵션 그룹은 색상, 사이즈를 등록해야 합니다.
Array [

groupName표준형 옵션 그룹 타입 (string)required

standardOptionAttributes 표준형 옵션 상세 속성 (object)[]Array [

attributeId속성 ID (integer<int64>)required

attributeValueId속성값 ID (integer<int64>)required

attributeValueName속성값 이름 (string)required

imageUrls표준형 옵션에서 사용할 이미지 URL (string)[]이미지 URL은 반드시 상품 이미지 다건 등록 API로 이미지를 업로드하고 반환받은 URL 값을 입력해야 합니다.

]

]

optionStandards 표준형 옵션 (object)[]표준형 옵션, 단독형 옵션, 조합형 옵션, 직접 입력형 옵션 중 최소 한 개는 입력해야 합니다.

표준형 옵션, 단독형 옵션, 조합형 옵션은 함께 사용할 수 없습니다.

Array [

id표준형 옵션 ID (integer<int64>)
상품 수정 시

옵션 ID를 입력한 경우, 옵션 ID의 옵션 정보를 수정합니다.

옵션 ID를 입력하지 않은 경우, 옵션값의 옵션 정보를 수정합니다(해당 옵션값이 존재하지 않으면 옵션 신규 등록).

stockQuantity재고 수량 (integer<int32>)옵션 재고 수량 관리 사용 여부 설정 시에만 활용됩니다. 미입력 시 0으로 설정됩니다.Possible values: <= 99999999

usable사용 여부 (boolean)미입력 시 사용 여부는 true로 설정됩니다.Default value: true

optionName1표준형 옵션값 1 (string)required

optionName2표준형 옵션값 2 (string)

sellerManagerCode판매자 관리 코드 (string)

skuYnSKU 생성 여부 (boolean)네이버 풀필먼트 서비스를 이용 중인 경우 입력할 수 있으며, 이용 권한이 없는 계정에 입력된 값은 무시됩니다.

재고 관리 메뉴에 신규 SKU를 생성하려는 경우 Y를 입력합니다.

상품 등록 시 SKU 생성 여부를 입력하지 않으면 N으로 등록됩니다.

상품 수정 시 SKU 생성 여부를 입력하지 않으면 기존 값이 유지됩니다.(상품 수정 시 요청된 N은 무시됩니다.)

]

useStockManagement옵션 재고 수량 관리 사용 여부 (boolean)'옵션 재고 수량 관리 사용 여부'를 입력하지 않거나 false로 지정하면 수량이 9,999로 설정됩니다.

optionDeliveryAttributes옵션별 배송 속성 옵션값 목록 (string)[]옵션별 배송 속성인 경우 최소 한 개는 입력합니다. 첫 번째 옵션명에 해당하는 옵션값만 입력 가능합니다. 미입력 시 기존값이 유지됩니다.

supplementProductInfo 추가 상품 (object)추가 상품 정보
sortType추가 상품 정렬 구분 코드 (string)미입력 시 기본값인 등록순(CREATE)으로 설정됩니다.

CREATE(등록순), ABC(가나다순), LOW_PRICE(낮은 가격순), HIGH_PRICE(높은 가격순)

Possible values: [CREATE, ABC, LOW_PRICE, HIGH_PRICE]

supplementProducts 추가 상품 (object)[]Array [

id추가 상품 ID (integer<int64>)
상품 등록 시: 입력한 추가 상품 ID는 무시됩니다.

상품 수정 시

추가 상품 ID를 입력하면 해당 추가 상품을 수정합니다. 이때 요청에 포함되지 않은 비필수 필드(추가 상품 가격, 재고 수량, 판매자 관리 코드, 사용 여부)의 값은 각 필드의 기본값으로 변경됩니다.

추가 상품 ID를 입력하지 않으면 새로운 추가 상품을 생성합니다. 단, 이름과 가격이 같은 추가 상품이 이미 존재하면 해당 추가 상품을 수정합니다.

그룹상품 전환 시

추가 상품 ID를 입력하면 해당 추가 상품을 수정하면서 그룹상품으로 전환합니다. 이때 요청에 포함되지 않은 비필수 필드(추가 상품 가격, 재고 수량, 판매자 관리 코드, 사용 여부)의 값은 각 필드의 기본값으로 변경됩니다.

추가 상품 ID를 입력하지 않으면 새로운 추가 상품을 생성합니다. 기존 일반 상품에 이름과 가격이 같은 추가 상품이 이미 존재해도 추가 상품 ID가 새로 생성됩니다.

기존 SKU 연결을 유지하려면 추가 상품 ID를 입력해야 합니다.

groupName추가 상품 그룹명 (string)required추가 상품명

name추가 상품명 (string)required추가 상품값

price추가 상품가 (integer<int32>)미입력 시 0원으로 입력됩니다.Possible values: <= 999999990

skuStatusTypeSKU 상태 타입 (string)네이버 풀필먼트 서비스를 이용 중인 경우에만 입력할 수 있으며, 이용 권한이 없는 계정에 입력된 값은 무시됩니다.

코드설명비고REQUEST신규 SKU 생성N배송 재고관리 메뉴에 신규 SKU를 생성/연결하려는 경우 입력LATER나중에 하기N배송 재고관리 메뉴에 신규 SKU를 생성하지 않는 경우 입력COMPLETE연결됨SKU가 연결되어 있는 상태DISABLED재고연동 안함SKU 재고 연동을 하지 않는 경우 입력

상품 등록 시

SKU 상태 타입을 입력하지 않으면 LATER로 입력됩니다.

상품 수정 및 그룹상품 전환 시

기존 SKU 상태 타입이 COMPLETE인 경우 COMPLETE, REQUEST만 입력할 수 있습니다.

그룹상품의 일부 판매 옵션에만 네이버 풀필먼트가 설정된 경우 DISABLED만 입력할 수 있습니다.

SKU 상태 타입을 입력하지 않으면 기존값이 유지됩니다.

Possible values: [REQUEST, COMPLETE, CLEAR, DISABLED, LATER]

stockQuantity재고 수량 (integer<int32>)미입력 시 0개로 입력됩니다.Possible values: <= 99999999

sellerManagementCode판매자 관리 코드 (string)

usable사용 여부 (boolean)미입력 시 true로 입력됩니다.

]

purchaseReviewInfo 구매평 정보 (object)리뷰 노출 설정 정보
purchaseReviewExposure리뷰 노출 여부 (boolean)구매평 노출 설정 가능 카테고리일 경우(식품)에만 유효하며 그 외에는 true로 설정됩니다. 미입력 시 true로 저장됩니다.

reviewUnExposeReason리뷰 미노출 사유 (string)리뷰 노출 여부가 true일 경우 빈 값으로 저장됩니다.
리뷰 노출 여부가 false일 경우 리뷰 미노출 사유를 입력해야 합니다.

isbnInfo ISBN 정보 (object)ISBN 정보
isbn13ISBN 13자리 (string)'-' 없이 13자리 유효한 숫자를 입력합니다.

예외 카테고리 중 도서_일반, 도서_해외, 도서_중고, 도서_E북, 도서_오디오북에 해당하는 경우 필수.

예외 카테고리 중 도서_잡지, 도서_정가제free에 해당하는 경우 필수 아님.

독립출판물인 경우 필수 아님.

라이브러리를 통해 ISBN 값의 유효성 체크.

Possible values: Value must match regular expression ^[\d*]{13}$

issnISSN 8자리 (string)예외 카테고리 중 도서_잡지에 해당하는 경우 입력합니다. '-' 없이 8자리 유효한 숫자를 입력합니다.Possible values: Value must match regular expression ^[\d*]{7}[\d|X]{1}$

independentPublicationYn독립출판물 여부 (boolean)예외 카테고리 중 도서_일반, 도서_해외, 도서_중고, 도서_정가제free, 도서_E북, 도서_오디오북에 해당하는 경우 입력할 수 있습니다.

bookInfo 도서 정보 (object)도서 항목 부가 정보
publishDay출간일 (string)required'yyyy-MM-dd' 형식

publisher 출판사 (object)required출판사
code코드 (string)판매자센터에서 코드 조회 가능. 코드를 확인할 수 없으면 전송하지 않습니다.

text텍스트 (string)글작가명, 출판사는 필수값으로 입력해야 합니다.
코드가 NULL이 아닌 경우 해당 코드에 매핑된 이름으로 전송해야 합니다. 코드가 없으면, 코드 없이 이름만 전송합니다.

authors 글작가명 (object)[]requiredArray [

code코드 (string)판매자센터에서 코드 조회 가능. 코드를 확인할 수 없으면 전송하지 않습니다.

text텍스트 (string)글작가명, 출판사는 필수값으로 입력해야 합니다.
코드가 NULL이 아닌 경우 해당 코드에 매핑된 이름으로 전송해야 합니다. 코드가 없으면, 코드 없이 이름만 전송합니다.

]

illustrators 그림작가명 (object)[]Array [

code코드 (string)판매자센터에서 코드 조회 가능. 코드를 확인할 수 없으면 전송하지 않습니다.

text텍스트 (string)글작가명, 출판사는 필수값으로 입력해야 합니다.
코드가 NULL이 아닌 경우 해당 코드에 매핑된 이름으로 전송해야 합니다. 코드가 없으면, 코드 없이 이름만 전송합니다.

]

translators 번역자명 (object)[]Array [

code코드 (string)판매자센터에서 코드 조회 가능. 코드를 확인할 수 없으면 전송하지 않습니다.

text텍스트 (string)글작가명, 출판사는 필수값으로 입력해야 합니다.
코드가 NULL이 아닌 경우 해당 코드에 매핑된 이름으로 전송해야 합니다. 코드가 없으면, 코드 없이 이름만 전송합니다.

]

eventPhraseCont이벤트 문구(홍보 문구 대체) (string)

manufactureDate제조일자 (string<date>)

releaseDate출시일자 (string<date>)

validDate유효일자 (string<date>)'yyyy-MM-dd' 형식 입력

taxType부가가치세 타입 코드 (string)Possible values: [TAX, DUTYFREE, SMALL]

customsTaxType관부가세 타입 코드 (string)Possible values: [NOT_APPLICABLE, INCLUDED, EXCLUDED]

productCertificationInfos 인증 정보 목록 (object)[]Array [

certificationInfoId인증 일련번호 (integer<int64>)required

certificationKindType인증 정보 종류 코드 (string)인증 정보 종류 필드에 설정 가능한 코드입니다. 미입력 시 ETC로 저장됩니다.

KC_CERTIFICATION(KC 인증), CHILD_CERTIFICATION(어린이제품 인증), GREEN_PRODUCTS(친환경 인증), CHEMICAL_CERTIFICATION(생활화학/살생물제 인증), OVERSEAS(구매대행(구매대행 선택 시 인증 정보 필수 등록)), PARALLEL_IMPORT(병행수입(병행수입 선택 시 인증 정보 필수 등록)), ETC(기타 인증)

Possible values: [KC_CERTIFICATION, CHILD_CERTIFICATION, GREEN_PRODUCTS, CHEMICAL_CERTIFICATION, PARALLEL_IMPORT, OVERSEAS, ETC]

name인증 기관명 (string)required어린이제품/생활화학·살생물제 관련 제품/생활용품/전기용품 공급자적합성 유형인 경우 비필수

certificationNumber인증번호 (string)required어린이제품/생활용품/전기용품 공급자적합성 유형인 경우 비필수

certificationMark인증마크 사용 여부 (boolean)미입력 시 false로 저장됩니다.

companyName인증 상호명 (string)인증 유형이 방송통신기자재 적합인증/적합등록/잠정인증, 어린이제품 안전인증/안전확인인 경우 필수

certificationDate인증 일자 (string<date>)'yyyy-MM-dd' 형식 입력

]

certificationTargetExcludeContent 인증 대상 제외 여부 정보 (object)인증 대상 제외 여부 정보
childCertifiedProductExclusionYn어린이제품 인증 대상 제외 여부 (boolean)어린이제품 인증 대상 카테고리 상품인 경우 필수. 미입력 시 false로 저장됩니다.

kcExemptionTypeKC 면제 대상 타입 코드 (string)안전기준준수, 구매대행, 병행수입인 경우 필수 입력

SAFE_CRITERION(안전기준준수대상(안전기준준수대상 예외 카테고리가 아닌 경우에도 설정 가능, 식품 카테고리 외)), OVERSEAS(구매대행), PARALLEL_IMPORT(병행수입)

Possible values: [OVERSEAS, SAFE_CRITERION, PARALLEL_IMPORT]

kcCertifiedProductExclusionYnKC 상품 인증 대상 제외 타입 (string)'KC 인증 대상' 카테고리 상품인 경우 필수. 미입력 시 FALSE로 저장됩니다.

TRUE(KC 인증 대상 아님), FALSE(KC 인증 대상), KC_EXEMPTION_OBJECT(안전기준준수, 구매대행, 병행수입인 경우 필수 입력)

Possible values: [FALSE, KC_EXEMPTION_OBJECT, TRUE]

greenCertifiedProductExclusionYn친환경 인증 대상 제외 여부 (boolean)'친환경 인증 대상' 카테고리 상품인 경우 필수. 미입력 시 false로 저장됩니다.

chemicalCertifiedProductExclusionYn생활화학/살생물제 인증 대상 제외 여부 (boolean)인증 유형이 '생활화학/살생물제 인증'인 경우 필수. '생활화학/살생물제 인증 대상' 카테고리 상품인 경우 필수. 미입력 시 false로 저장됩니다.

sellerCommentContent판매자 특이 사항 (string)

sellerCommentUsable판매자 특이 사항 사용 여부 (boolean)

minorPurchasable미성년자 구매 가능 여부 (boolean)

ecoupon E쿠폰 (object)E쿠폰
periodTypeE쿠폰 유효기간 구분 코드 (string)
FIXED(특정 기간), FLEXIBLE(자동 기간)

Possible values: [FIXED, FLEXIBLE]

validStartDateE쿠폰 유효기간 시작일 (string<date>)E쿠폰 유효기간 구분 타입(PeriodType)이 '특정 기간'인 경우 필수. 'yyyy-MM-dd' 형식 입력.

validEndDateE쿠폰 유효기간 종료일 (string<date>)E쿠폰 유효기간 구분 타입(PeriodType)이 '특정 기간'인 경우 필수. 'yyyy-MM-dd' 형식 입력.

periodDaysE쿠폰 유효기간 내용(구매일로부터 00일) (integer<int32>)E쿠폰 유효기간 구분 타입(PeriodType)이 '자동 기간'인 경우 필수

publicInformationContentsE쿠폰 발행처 내용 (string)required

contactInformationContentsE쿠폰 연락처 내용 (string)required

usePlaceTypeE쿠폰 사용 장소 구분 코드 (string)required
PLACE(장소), ADDRESS(주소), URL(URL)

Possible values: [PLACE, ADDRESS, URL]

usePlaceContents사용 장소 내용 (string)requiredECouponUsePlaceType.ADDRESS인 경우 주소록 번호를 입력

restrictCart장바구니 구매 불가 여부 (boolean)E쿠폰 장바구니 제한. 미입력 시 false로 설정됩니다.

true: 즉시 구매만 가능, false: 즉시 구매, 장바구니 구매 가능

siteName사이트명 (string)

productInfoProvidedNotice 상품정보제공고시 (object)상품 요약 정보

상품 등록 시 필수

상품 수정 시에는 기존에 상품 요약 정보가 입력된 경우에만 생략할 수 있습니다. 이 경우 기존에 저장된 상품 요약 정보 값이 유지됩니다.

productInfoProvidedNoticeType상품정보제공고시 상품군 유형 (string)required상품 요약 정보를 나타내는 타입입니다. 하위 요소 중 하나를 선택해서 입력해야 하며 입력한 타입의 필드 정보가 등록됩니다.

WEAR(의류 상품 요약 정보, wear 필드에 정보 입력)

SHOES(구두/신발 상품 요약 정보, shoes 필드에 정보 입력)

BAG(가방 상품 요약 정보, bag 필드에 정보 입력)

FASHION_ITEMS(패션잡화(모자/벨트/액세서리) 상품 요약 정보, fashionItems 필드에 정보 입력)

SLEEPING_GEAR(침구류/커튼 상품 요약 정보, sleepingGear 필드에 정보 입력)

FURNITURE(가구(침대/소파/싱크대/DIY제품) 상품 요약 정보, furniture 필드에 정보 입력)

IMAGE_APPLIANCES(영상가전(TV류) 상품 요약 정보, imageAppliances 필드에 정보 입력)

HOME_APPLIANCES(가정용 전기제품(냉장고/세탁기/식기세척기/전자레인지) 상품 요약 정보, homeAppliances 필드에 정보 입력)

SEASON_APPLIANCES(계절가전(에어컨/온풍기) 상품 요약 정보, seasonAppliances 필드에 정보 입력)

OFFICE_APPLIANCES(사무용기기(컴퓨터/노트북/프린터) 상품 요약 정보, officeAppliances 필드에 정보 입력)

OPTICS_APPLIANCES(광학기기(디지털카메라/캠코더) 상품 요약 정보, opticsAppliances 필드에 정보 입력)

MICROELECTRONICS(소형전자(MP3/전자사전 등) 상품 요약 정보, microElectronics 필드에 정보 입력)

NAVIGATION(내비게이션 상품 요약 정보, navigation 필드에 정보 입력)

CAR_ARTICLES(자동차용품(자동차부품/기타 자동차용품) 상품 요약 정보, carArticles 필드에 정보 입력)

MEDICAL_APPLIANCES(의료기기 상품 요약 정보, medicalAppliances 필드에 정보 입력)

KITCHEN_UTENSILS(주방용품 상품 요약 정보, kitchenUtensils 필드에 정보 입력)

COSMETIC(화장품 상품 요약 정보, cosmetic 필드에 정보 입력)

JEWELLERY(귀금속/보석/시계류 상품 요약 정보, jewellery 필드에 정보 입력)

FOOD(식품(농ㆍ축ㆍ수산물) 상품 요약 정보, food 필드에 정보 입력)

GENERAL_FOOD(가공식품 상품 요약 정보, generalFood 필드에 정보 입력)

DIET_FOOD(건강기능식품 상품 요약 정보, dietFood 필드에 정보 입력)

KIDS(영유아용품 상품 요약 정보, kids 필드에 정보 입력)

MUSICAL_INSTRUMENT(악기 상품 요약 정보, musicalInstrument 필드에 정보 입력)

SPORTS_EQUIPMENT(스포츠용품 상품 요약 정보), sportsEquipment 필드에 정보 입력

BOOKS(서적 상품 요약 정보, books 필드에 정보 입력)

RENTAL_ETC(물품대여 서비스(서적, 유아용품, 행사용품 등) 상품 요약 정보, rentalEtc 필드에 정보 입력)

RENTAL_HA(물품대여 서비스(정수기, 비데, 공기청정기 등) 상품 요약 정보, rentalHa 필드에 정보 입력)

DIGITAL_CONTENTS(디지털 콘텐츠(음원, 게임, 인터넷강의 등) 상품 요약 정보, digitalContents 필드에 정보 입력)

GIFT_CARD(상품권/쿠폰 상품 요약 정보, giftCard 필드에 정보 입력)

MOBILE_COUPON(모바일 쿠폰 상품 요약 정보, mobileCoupon 필드에 정보 입력)

MOVIE_SHOW(영화/공연 상품 요약 정보, movieShow 필드에 정보 입력)

ETC_SERVICE(기타 용역 상품 요약 정보, etcService 필드에 정보 입력)

BIOCHEMISTRY(생활화학제품 요약 정보, biochemistry 필드에 정보 입력)

BIOCIDAL(살생물제품 요약 정보, biocidal 필드에 정보 입력)

CELLPHONE(휴대폰 요약 정보, cellPhone 필드에 정보 입력)

ETC(기타 상품 요약 정보, etc 필드에 정보 입력)

Possible values: [WEAR, SHOES, BAG, FASHION_ITEMS, SLEEPING_GEAR, FURNITURE, IMAGE_APPLIANCES, HOME_APPLIANCES, SEASON_APPLIANCES, OFFICE_APPLIANCES, OPTICS_APPLIANCES, MICROELECTRONICS, CELLPHONE, NAVIGATION, CAR_ARTICLES, MEDICAL_APPLIANCES, KITCHEN_UTENSILS, COSMETIC, JEWELLERY, FOOD, GENERAL_FOOD, DIET_FOOD, KIDS, MUSICAL_INSTRUMENT, SPORTS_EQUIPMENT, BOOKS, LODGMENT_RESERVATION, TRAVEL_PACKAGE, AIRLINE_TICKET, RENT_CAR, RENTAL_HA, RENTAL_ETC, DIGITAL_CONTENTS, GIFT_CARD, MOBILE_COUPON, MOVIE_SHOW, ETC_SERVICE, BIOCHEMISTRY, BIOCIDAL, ETC]

wear 의류 상품정보제공고시 (object)의류 상품정보제공고시
returnCostReason제품하자/오배송에 따른 청약철회 조항 (string)required제품하자ㆍ오배송 등에 따른 청약철회 등의 경우 청약철회 등의 기한 및 통신판매업자가 부담하는 반품 비용 등에 관한 정보. 미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래등에서의소비자보호에관한법률 등에 의한 제품의 하자 또는 오배송 등으로 인한 청약철회의 경우에는 상품 수령 후 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날로부터 30일 이내에 청약철회를 할 수 있으며, 반품 비용은 통신판매업자가 부담합니다.)

1 (상품상세 참조)

noRefundReason제품하자가 아닌 소비자의 단순변심에 따른 청약철회가 불가능한 경우 그 구체적 사유와 근거 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래 등에서의 소비자보호에 관한 법률 등에 의한 청약철회 제한 사유에 해당하는 경우 및 기타 객관적으로 이에 준하는 것으로 인정되는 경우 청약철회가 제한될 수 있습니다.)

1 (상품상세 참조)

qualityAssuranceStandard재화 등의 교환ㆍ반품ㆍ보증 조건 및 품질 보증 기준 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

compensationProcedure대금을 환불받기 위한 방법과 환불이 지연될 경우 지연배상금을 지급받을 수 있다는 사실 및 배상금 지급의 구체적인 조건·절차 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (주문취소 및 대금의 환불은 네이버페이 마이페이지에서 신청할 수 있으며, 전자상거래 등에서의 소비자보호에 관한 법률에 따라 소비자의 청약철회 후 판매자가 재화 등을 반환 받은 날로부터 3영업일 이내에 지급받은 대금의 환급을 정당한 사유 없이 지연하는 때에는 소비자는 지연기간에 대해서 연 15%의 지연배상금을 판매자에게 청구할 수 있습니다.)

1 (상품상세 참조)

troubleShootingContents소비자피해보상의 처리, 재화 등에 대한 불만 처리 및 소비자와 사업자 사이의 분쟁 처리에 관한 사항 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

material제품 소재 (string)required섬유의 조성 또는 혼용율을 백분율로 표시, 기능성인 경우 성적서 또는 허가서Possible values: <= 1500 characters

color색상 (string)requiredPossible values: <= 200 characters

size치수 (string)requiredPossible values: <= 200 characters

manufacturer제조자(사) (string)requiredPossible values: <= 200 characters

caution세탁 방법 및 취급 시 주의사항 (string)requiredPossible values: <= 1500 characters

packDate제조연월 (string<'yyyy-MM' 형식 입력>)Possible values: <= 300 characters

packDateText제조연월 직접 입력 (string<packDate를 입력하지 않은 경우에는 필수>)Possible values: <= 300 characters

warrantyPolicy품질 보증 기준 (string)requiredPossible values: <= 1500 characters

afterServiceDirectorA/S 책임자와 전화번호 (string)requiredPossible values: <= 200 characters

shoes 구두/신발 상품정보제공고시 (object)구두/신발 상품정보제공고시
returnCostReason제품하자/오배송에 따른 청약철회 조항 (string)required제품하자ㆍ오배송 등에 따른 청약철회 등의 경우 청약철회 등의 기한 및 통신판매업자가 부담하는 반품 비용 등에 관한 정보. 미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래등에서의소비자보호에관한법률 등에 의한 제품의 하자 또는 오배송 등으로 인한 청약철회의 경우에는 상품 수령 후 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날로부터 30일 이내에 청약철회를 할 수 있으며, 반품 비용은 통신판매업자가 부담합니다.)

1 (상품상세 참조)

noRefundReason제품하자가 아닌 소비자의 단순변심에 따른 청약철회가 불가능한 경우 그 구체적 사유와 근거 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래 등에서의 소비자보호에 관한 법률 등에 의한 청약철회 제한 사유에 해당하는 경우 및 기타 객관적으로 이에 준하는 것으로 인정되는 경우 청약철회가 제한될 수 있습니다.)

1 (상품상세 참조)

qualityAssuranceStandard재화 등의 교환ㆍ반품ㆍ보증 조건 및 품질 보증 기준 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

compensationProcedure대금을 환불받기 위한 방법과 환불이 지연될 경우 지연배상금을 지급받을 수 있다는 사실 및 배상금 지급의 구체적인 조건·절차 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (주문취소 및 대금의 환불은 네이버페이 마이페이지에서 신청할 수 있으며, 전자상거래 등에서의 소비자보호에 관한 법률에 따라 소비자의 청약철회 후 판매자가 재화 등을 반환 받은 날로부터 3영업일 이내에 지급받은 대금의 환급을 정당한 사유 없이 지연하는 때에는 소비자는 지연기간에 대해서 연 15%의 지연배상금을 판매자에게 청구할 수 있습니다.)

1 (상품상세 참조)

troubleShootingContents소비자피해보상의 처리, 재화 등에 대한 불만 처리 및 소비자와 사업자 사이의 분쟁 처리에 관한 사항 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

material제품의 주 소재 (string)required운동화인 경우에는 겉감, 안감을 구분하여 표시Possible values: <= 1500 characters

color색상 (string)requiredPossible values: <= 200 characters

size발길이 (string)required해외사이즈 표기 시 국내사이즈 병행 표기(단위: mm)Possible values: <= 200 characters

height굽높이 (string<해당 사항이 없으면 이 요소를 삭제하고 전송합니다.>)굽 재료를 사용하는 여성화에 한함(단위: cm)Possible values: <= 200 characters

manufacturer제조자(사) (string)requiredPossible values: <= 200 characters

caution취급 시 주의사항 (string)requiredPossible values: <= 1500 characters

warrantyPolicy품질 보증 기준 (string)requiredPossible values: <= 1500 characters

afterServiceDirectorA/S 책임자와 전화번호 (string)requiredPossible values: <= 200 characters

bag 가방 상품정보제공고시 (object)가방 상품정보제공고시
returnCostReason제품하자/오배송에 따른 청약철회 조항 (string)required제품하자ㆍ오배송 등에 따른 청약철회 등의 경우 청약철회 등의 기한 및 통신판매업자가 부담하는 반품 비용 등에 관한 정보. 미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래등에서의소비자보호에관한법률 등에 의한 제품의 하자 또는 오배송 등으로 인한 청약철회의 경우에는 상품 수령 후 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날로부터 30일 이내에 청약철회를 할 수 있으며, 반품 비용은 통신판매업자가 부담합니다.)

1 (상품상세 참조)

noRefundReason제품하자가 아닌 소비자의 단순변심에 따른 청약철회가 불가능한 경우 그 구체적 사유와 근거 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래 등에서의 소비자보호에 관한 법률 등에 의한 청약철회 제한 사유에 해당하는 경우 및 기타 객관적으로 이에 준하는 것으로 인정되는 경우 청약철회가 제한될 수 있습니다.)

1 (상품상세 참조)

qualityAssuranceStandard재화 등의 교환ㆍ반품ㆍ보증 조건 및 품질 보증 기준 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

compensationProcedure대금을 환불받기 위한 방법과 환불이 지연될 경우 지연배상금을 지급받을 수 있다는 사실 및 배상금 지급의 구체적인 조건·절차 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (주문취소 및 대금의 환불은 네이버페이 마이페이지에서 신청할 수 있으며, 전자상거래 등에서의 소비자보호에 관한 법률에 따라 소비자의 청약철회 후 판매자가 재화 등을 반환 받은 날로부터 3영업일 이내에 지급받은 대금의 환급을 정당한 사유 없이 지연하는 때에는 소비자는 지연기간에 대해서 연 15%의 지연배상금을 판매자에게 청구할 수 있습니다.)

1 (상품상세 참조)

troubleShootingContents소비자피해보상의 처리, 재화 등에 대한 불만 처리 및 소비자와 사업자 사이의 분쟁 처리에 관한 사항 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

type종류 (string)requiredPossible values: <= 200 characters

material소재 (string)requiredPossible values: <= 1500 characters

color색상 (string)requiredPossible values: <= 200 characters

size크기 (string)requiredPossible values: <= 200 characters

manufacturer제조자 (string)requiredPossible values: <= 200 characters

caution취급 시 주의사항 (string)requiredPossible values: <= 1500 characters

warrantyPolicy품질 보증 기준 (string)requiredPossible values: <= 1500 characters

afterServiceDirectorA/S 책임자와 전화번호 (string)requiredPossible values: <= 200 characters

fashionItems 패션잡화(모자/벨트/액세서리) 상품정보제공고시 (object)패션잡화(모자/벨트/액세서리) 상품정보제공고시
returnCostReason제품하자/오배송에 따른 청약철회 조항 (string)required제품하자ㆍ오배송 등에 따른 청약철회 등의 경우 청약철회 등의 기한 및 통신판매업자가 부담하는 반품 비용 등에 관한 정보. 미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래등에서의소비자보호에관한법률 등에 의한 제품의 하자 또는 오배송 등으로 인한 청약철회의 경우에는 상품 수령 후 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날로부터 30일 이내에 청약철회를 할 수 있으며, 반품 비용은 통신판매업자가 부담합니다.)

1 (상품상세 참조)

noRefundReason제품하자가 아닌 소비자의 단순변심에 따른 청약철회가 불가능한 경우 그 구체적 사유와 근거 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래 등에서의 소비자보호에 관한 법률 등에 의한 청약철회 제한 사유에 해당하는 경우 및 기타 객관적으로 이에 준하는 것으로 인정되는 경우 청약철회가 제한될 수 있습니다.)

1 (상품상세 참조)

qualityAssuranceStandard재화 등의 교환ㆍ반품ㆍ보증 조건 및 품질 보증 기준 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

compensationProcedure대금을 환불받기 위한 방법과 환불이 지연될 경우 지연배상금을 지급받을 수 있다는 사실 및 배상금 지급의 구체적인 조건·절차 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (주문취소 및 대금의 환불은 네이버페이 마이페이지에서 신청할 수 있으며, 전자상거래 등에서의 소비자보호에 관한 법률에 따라 소비자의 청약철회 후 판매자가 재화 등을 반환 받은 날로부터 3영업일 이내에 지급받은 대금의 환급을 정당한 사유 없이 지연하는 때에는 소비자는 지연기간에 대해서 연 15%의 지연배상금을 판매자에게 청구할 수 있습니다.)

1 (상품상세 참조)

troubleShootingContents소비자피해보상의 처리, 재화 등에 대한 불만 처리 및 소비자와 사업자 사이의 분쟁 처리에 관한 사항 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

type종류 (string)requiredPossible values: <= 200 characters

material소재 (string)requiredPossible values: <= 1500 characters

size치수 (string)requiredPossible values: <= 200 characters

manufacturer제조자(사) (string)requiredPossible values: <= 200 characters

caution취급 시 주의사항 (string)requiredPossible values: <= 1500 characters

warrantyPolicy품질 보증 기준 (string)requiredPossible values: <= 1500 characters

afterServiceDirectorA/S 책임자와 전화번호 (string)requiredPossible values: <= 200 characters

sleepingGear 침구류/커튼 상품정보제공고시 (object)침구류/커튼 상품정보제공고시
returnCostReason제품하자/오배송에 따른 청약철회 조항 (string)required제품하자ㆍ오배송 등에 따른 청약철회 등의 경우 청약철회 등의 기한 및 통신판매업자가 부담하는 반품 비용 등에 관한 정보. 미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래등에서의소비자보호에관한법률 등에 의한 제품의 하자 또는 오배송 등으로 인한 청약철회의 경우에는 상품 수령 후 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날로부터 30일 이내에 청약철회를 할 수 있으며, 반품 비용은 통신판매업자가 부담합니다.)

1 (상품상세 참조)

noRefundReason제품하자가 아닌 소비자의 단순변심에 따른 청약철회가 불가능한 경우 그 구체적 사유와 근거 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래 등에서의 소비자보호에 관한 법률 등에 의한 청약철회 제한 사유에 해당하는 경우 및 기타 객관적으로 이에 준하는 것으로 인정되는 경우 청약철회가 제한될 수 있습니다.)

1 (상품상세 참조)

qualityAssuranceStandard재화 등의 교환ㆍ반품ㆍ보증 조건 및 품질 보증 기준 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

compensationProcedure대금을 환불받기 위한 방법과 환불이 지연될 경우 지연배상금을 지급받을 수 있다는 사실 및 배상금 지급의 구체적인 조건·절차 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (주문취소 및 대금의 환불은 네이버페이 마이페이지에서 신청할 수 있으며, 전자상거래 등에서의 소비자보호에 관한 법률에 따라 소비자의 청약철회 후 판매자가 재화 등을 반환 받은 날로부터 3영업일 이내에 지급받은 대금의 환급을 정당한 사유 없이 지연하는 때에는 소비자는 지연기간에 대해서 연 15%의 지연배상금을 판매자에게 청구할 수 있습니다.)

1 (상품상세 참조)

troubleShootingContents소비자피해보상의 처리, 재화 등에 대한 불만 처리 및 소비자와 사업자 사이의 분쟁 처리에 관한 사항 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

material제품 소재 (string)required섬유의 조성 또는 혼용율을 백분율로 표시, 충전재를 사용한 제품은 충전재를 함께 표기Possible values: <= 1500 characters

color색상 (string)requiredPossible values: <= 200 characters

size치수 (string)requiredPossible values: <= 200 characters

components제품 구성 (string)requiredPossible values: <= 1000 characters

manufacturer제조자(사) (string)requiredPossible values: <= 200 characters

caution세탁 방법 및 취급 시 주의사항 (string)requiredPossible values: <= 1500 characters

warrantyPolicy품질 보증 기준 (string)requiredPossible values: <= 1500 characters

afterServiceDirectorA/S 책임자와 전화번호 (string)requiredPossible values: <= 200 characters

furniture 가구(침대/소파/싱크대/DIY제품) 상품정보제공고시 (object)가구(침대/소파/싱크대/DIY제품) 상품정보제공고시
returnCostReason제품하자/오배송에 따른 청약철회 조항 (string)required제품하자ㆍ오배송 등에 따른 청약철회 등의 경우 청약철회 등의 기한 및 통신판매업자가 부담하는 반품 비용 등에 관한 정보. 미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래등에서의소비자보호에관한법률 등에 의한 제품의 하자 또는 오배송 등으로 인한 청약철회의 경우에는 상품 수령 후 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날로부터 30일 이내에 청약철회를 할 수 있으며, 반품 비용은 통신판매업자가 부담합니다.)

1 (상품상세 참조)

noRefundReason제품하자가 아닌 소비자의 단순변심에 따른 청약철회가 불가능한 경우 그 구체적 사유와 근거 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래 등에서의 소비자보호에 관한 법률 등에 의한 청약철회 제한 사유에 해당하는 경우 및 기타 객관적으로 이에 준하는 것으로 인정되는 경우 청약철회가 제한될 수 있습니다.)

1 (상품상세 참조)

qualityAssuranceStandard재화 등의 교환ㆍ반품ㆍ보증 조건 및 품질 보증 기준 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

compensationProcedure대금을 환불받기 위한 방법과 환불이 지연될 경우 지연배상금을 지급받을 수 있다는 사실 및 배상금 지급의 구체적인 조건·절차 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (주문취소 및 대금의 환불은 네이버페이 마이페이지에서 신청할 수 있으며, 전자상거래 등에서의 소비자보호에 관한 법률에 따라 소비자의 청약철회 후 판매자가 재화 등을 반환 받은 날로부터 3영업일 이내에 지급받은 대금의 환급을 정당한 사유 없이 지연하는 때에는 소비자는 지연기간에 대해서 연 15%의 지연배상금을 판매자에게 청구할 수 있습니다.)

1 (상품상세 참조)

troubleShootingContents소비자피해보상의 처리, 재화 등에 대한 불만 처리 및 소비자와 사업자 사이의 분쟁 처리에 관한 사항 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

itemName품명 (string)requiredPossible values: <= 50 characters

certificationTypeKC 인증정보 (string)required｢전기용품 및 생활용품 안전관리법｣에 따른 공급자적합성확인대상제품에 한함Possible values: <= 200 characters

color색상 (string)requiredPossible values: <= 200 characters

components구성품 (string)requiredPossible values: <= 500 characters

material주요 소재 (string)requiredPossible values: <= 500 characters

manufacturer제조자(사) (string)required구성품별 제조자(사)가 다른 경우 각 구성품의 제조자(사)Possible values: <= 200 characters

importer수입자 (string<해당 사항이 없으면 이 요소를 삭제하고 전송합니다.>)수입품의 경우 수입자를 함께 표시. 구성품별 제조자가 다른 경우 각 구성품의 수입자Possible values: <= 200 characters

producer제조국 (string)required구성품별 제조국이 다른 경우 각 구성품의 제조국Possible values: <= 200 characters

size크기 (string)requiredPossible values: <= 200 characters

installedCharge배송 설치 비용 (string)requiredPossible values: <= 200 characters

warrantyPolicy품질 보증 기준 (string)requiredPossible values: <= 1500 characters

refurb재공급 사유 및 하자 (string<해당 사항이 없으면 이 요소를 삭제하고 전송합니다.>)재공급(리퍼브) 가구의 경우 재공급 사유 및 하자 부위 표시(예: 전시 상품으로 식탁 상판 등에 미세한 흠집 있음)Possible values: <= 200 characters

afterServiceDirectorA/S 책임자와 전화번호 (string)requiredPossible values: <= 200 characters

imageAppliances 영상가전(TV류) 상품정보제공고시 (object)영상가전(TV류) 상품정보제공고시
returnCostReason제품하자/오배송에 따른 청약철회 조항 (string)required제품하자ㆍ오배송 등에 따른 청약철회 등의 경우 청약철회 등의 기한 및 통신판매업자가 부담하는 반품 비용 등에 관한 정보. 미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래등에서의소비자보호에관한법률 등에 의한 제품의 하자 또는 오배송 등으로 인한 청약철회의 경우에는 상품 수령 후 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날로부터 30일 이내에 청약철회를 할 수 있으며, 반품 비용은 통신판매업자가 부담합니다.)

1 (상품상세 참조)

noRefundReason제품하자가 아닌 소비자의 단순변심에 따른 청약철회가 불가능한 경우 그 구체적 사유와 근거 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래 등에서의 소비자보호에 관한 법률 등에 의한 청약철회 제한 사유에 해당하는 경우 및 기타 객관적으로 이에 준하는 것으로 인정되는 경우 청약철회가 제한될 수 있습니다.)

1 (상품상세 참조)

qualityAssuranceStandard재화 등의 교환ㆍ반품ㆍ보증 조건 및 품질 보증 기준 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

compensationProcedure대금을 환불받기 위한 방법과 환불이 지연될 경우 지연배상금을 지급받을 수 있다는 사실 및 배상금 지급의 구체적인 조건·절차 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (주문취소 및 대금의 환불은 네이버페이 마이페이지에서 신청할 수 있으며, 전자상거래 등에서의 소비자보호에 관한 법률에 따라 소비자의 청약철회 후 판매자가 재화 등을 반환 받은 날로부터 3영업일 이내에 지급받은 대금의 환급을 정당한 사유 없이 지연하는 때에는 소비자는 지연기간에 대해서 연 15%의 지연배상금을 판매자에게 청구할 수 있습니다.)

1 (상품상세 참조)

troubleShootingContents소비자피해보상의 처리, 재화 등에 대한 불만 처리 및 소비자와 사업자 사이의 분쟁 처리에 관한 사항 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

itemName품명 (string)requiredPossible values: <= 50 characters

modelName모델명 (string)requiredPossible values: <= 50 characters

certificationTypeKC 인증정보 (string)required｢전기용품 및 생활용품 안전관리법｣에 따른 안전인증·안전확인·공급자적합성확인대상 제품 및 ｢전파법｣에 따른 적합인증·적합등록 대상 기자재에 한함Possible values: <= 200 characters

ratedVoltage정격전압 (string<해당 사항이 없으면 이 요소를 삭제하고 전송합니다.>)Possible values: <= 200 characters

powerConsumption소비전력 (string<해당 사항이 없으면 이 요소를 삭제하고 전송합니다.>)Possible values: <= 200 characters

energyEfficiencyRating에너지소비효율등급 (string<해당 사항이 없으면 이 요소를 삭제하고 전송합니다.>)｢에너지이용 합리화법｣에 따른 에너지소비효율등급 표시대상 기자재에 한함Possible values: <= 200 characters

releaseDate동일 모델의 출시연월 (string<'yyyy-MM' 형식 입력>)Possible values: <= 300 characters

releaseDateText동일 모델 출시연월일 직접 입력 (string<releaseDate를 입력하지 않은 경우에는 필수>)Possible values: <= 300 characters

manufacturer제조자(사) (string)requiredPossible values: <= 200 characters

size크기, 형태 (string)requiredPossible values: <= 200 characters

additionalCost추가 설치 비용 (string)requiredPossible values: <= 200 characters

displaySpecification화면 사양 (string)required화면 크기, 해상도, 화면 비율 등Possible values: <= 200 characters

warrantyPolicy품질 보증 기준 (string)requiredPossible values: <= 1500 characters

afterServiceDirectorA/S 책임자와 전화번호 (string)requiredPossible values: <= 200 characters

homeAppliances 가정용 전기제품(냉장고/세탁기/식기세척기/전자레인지) 상품정보제공고시 (object)가정용 전기제품(냉장고/세탁기/식기세척기/전자레인지) 상품정보제공고시
returnCostReason제품하자/오배송에 따른 청약철회 조항 (string)required제품하자ㆍ오배송 등에 따른 청약철회 등의 경우 청약철회 등의 기한 및 통신판매업자가 부담하는 반품 비용 등에 관한 정보. 미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래등에서의소비자보호에관한법률 등에 의한 제품의 하자 또는 오배송 등으로 인한 청약철회의 경우에는 상품 수령 후 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날로부터 30일 이내에 청약철회를 할 수 있으며, 반품 비용은 통신판매업자가 부담합니다.)

1 (상품상세 참조)

noRefundReason제품하자가 아닌 소비자의 단순변심에 따른 청약철회가 불가능한 경우 그 구체적 사유와 근거 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래 등에서의 소비자보호에 관한 법률 등에 의한 청약철회 제한 사유에 해당하는 경우 및 기타 객관적으로 이에 준하는 것으로 인정되는 경우 청약철회가 제한될 수 있습니다.)

1 (상품상세 참조)

qualityAssuranceStandard재화 등의 교환ㆍ반품ㆍ보증 조건 및 품질 보증 기준 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

compensationProcedure대금을 환불받기 위한 방법과 환불이 지연될 경우 지연배상금을 지급받을 수 있다는 사실 및 배상금 지급의 구체적인 조건·절차 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (주문취소 및 대금의 환불은 네이버페이 마이페이지에서 신청할 수 있으며, 전자상거래 등에서의 소비자보호에 관한 법률에 따라 소비자의 청약철회 후 판매자가 재화 등을 반환 받은 날로부터 3영업일 이내에 지급받은 대금의 환급을 정당한 사유 없이 지연하는 때에는 소비자는 지연기간에 대해서 연 15%의 지연배상금을 판매자에게 청구할 수 있습니다.)

1 (상품상세 참조)

troubleShootingContents소비자피해보상의 처리, 재화 등에 대한 불만 처리 및 소비자와 사업자 사이의 분쟁 처리에 관한 사항 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

itemName품명 (string)requiredPossible values: <= 50 characters

modelName모델명 (string)requiredPossible values: <= 50 characters

certificationTypeKC 인증정보 (string)required｢전기용품 및 생활용품 안전관리법｣에 따른 안전인증·안전확인·공급자적합성확인대상 제품 및 ｢전파법｣에 따른 적합인증·적합등록 대상 기자재에 한함Possible values: <= 200 characters

ratedVoltage정격전압 (string<해당 사항이 없으면 이 요소를 삭제하고 전송합니다.>)Possible values: <= 200 characters

powerConsumption소비전력 (string<해당 사항이 없으면 이 요소를 삭제하고 전송합니다.>)Possible values: <= 200 characters

energyEfficiencyRating에너지소비효율등급 (string<해당 사항이 없으면 이 요소를 삭제하고 전송합니다.>)｢에너지이용 합리화법｣에 따른 에너지소비효율등급 표시대상 기자재에 한함Possible values: <= 200 characters

releaseDate동일 모델의 출시연월 (string<'yyyy-MM' 형식 입력>)Possible values: <= 300 characters

releaseDateText동일 모델 출시연월일 직접 입력 (string<releaseDate를 입력하지 않은 경우에는 필수>)Possible values: <= 300 characters

manufacturer제조자(사) (string)requiredPossible values: <= 200 characters

size크기, 용량, 형태 (string)requiredPossible values: <= 200 characters

additionalCost추가 설치 비용 (string)requiredPossible values: <= 200 characters

warrantyPolicy품질 보증 기준 (string)requiredPossible values: <= 1500 characters

afterServiceDirectorA/S 책임자와 전화번호 (string)requiredPossible values: <= 200 characters

seasonAppliances 계절가전(에어컨/온풍기) 상품정보제공고시 (object)계절가전(에어컨/온풍기) 상품정보제공고시
returnCostReason제품하자/오배송에 따른 청약철회 조항 (string)required제품하자ㆍ오배송 등에 따른 청약철회 등의 경우 청약철회 등의 기한 및 통신판매업자가 부담하는 반품 비용 등에 관한 정보. 미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래등에서의소비자보호에관한법률 등에 의한 제품의 하자 또는 오배송 등으로 인한 청약철회의 경우에는 상품 수령 후 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날로부터 30일 이내에 청약철회를 할 수 있으며, 반품 비용은 통신판매업자가 부담합니다.)

1 (상품상세 참조)

noRefundReason제품하자가 아닌 소비자의 단순변심에 따른 청약철회가 불가능한 경우 그 구체적 사유와 근거 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래 등에서의 소비자보호에 관한 법률 등에 의한 청약철회 제한 사유에 해당하는 경우 및 기타 객관적으로 이에 준하는 것으로 인정되는 경우 청약철회가 제한될 수 있습니다.)

1 (상품상세 참조)

qualityAssuranceStandard재화 등의 교환ㆍ반품ㆍ보증 조건 및 품질 보증 기준 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

compensationProcedure대금을 환불받기 위한 방법과 환불이 지연될 경우 지연배상금을 지급받을 수 있다는 사실 및 배상금 지급의 구체적인 조건·절차 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (주문취소 및 대금의 환불은 네이버페이 마이페이지에서 신청할 수 있으며, 전자상거래 등에서의 소비자보호에 관한 법률에 따라 소비자의 청약철회 후 판매자가 재화 등을 반환 받은 날로부터 3영업일 이내에 지급받은 대금의 환급을 정당한 사유 없이 지연하는 때에는 소비자는 지연기간에 대해서 연 15%의 지연배상금을 판매자에게 청구할 수 있습니다.)

1 (상품상세 참조)

troubleShootingContents소비자피해보상의 처리, 재화 등에 대한 불만 처리 및 소비자와 사업자 사이의 분쟁 처리에 관한 사항 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

itemName품명 (string)requiredPossible values: <= 50 characters

modelName모델명 (string)requiredPossible values: <= 50 characters

certificationTypeKC 인증정보 (string)required｢전기용품 및 생활용품 안전관리법｣에 따른 안전인증·안전확인·공급자적합성확인대상 제품 및 ｢전파법｣에 따른 적합인증·적합등록 대상 기자재에 한함Possible values: <= 200 characters

ratedVoltage정격전압 (string<해당 사항이 없으면 이 요소를 삭제하고 전송합니다.>)Possible values: <= 200 characters

powerConsumption소비전력 (string<해당 사항이 없으면 이 요소를 삭제하고 전송합니다.>)Possible values: <= 200 characters

energyEfficiencyRating에너지소비효율등급 (string<해당 사항이 없으면 이 요소를 삭제하고 전송합니다.>)｢에너지이용 합리화법｣에 따른 에너지소비효율등급 표시대상 기자재에 한함Possible values: <= 200 characters

releaseDate 동일 모델의 출시연월 (object<'yyyy-MM' 형식 입력>)Possible values: <= 300 characters
yearinteger<int32>

monthstringPossible values: [JANUARY, FEBRUARY, MARCH, APRIL, MAY, JUNE, JULY, AUGUST, SEPTEMBER, OCTOBER, NOVEMBER, DECEMBER]

monthValueinteger<int32>

leapYearboolean

releaseDateText동일 모델 출시연월 직접 입력 (string<releaseDate를 입력하지 않은 경우에는 필수>)Possible values: <= 300 characters

manufacturer제조자(사) (string)requiredPossible values: <= 200 characters

size크기, 형태 (string)required실외기 포함Possible values: <= 200 characters

area냉난방 면적 (string)requiredPossible values: <= 200 characters

installedCharge추가 설치 비용 (string)requiredPossible values: <= 500 characters

warrantyPolicy품질 보증 기준 (string)requiredPossible values: <= 1500 characters

afterServiceDirectorA/S 책임자와 전화번호 (string)requiredPossible values: <= 200 characters

officeAppliances 사무용기기(컴퓨터/노트북/프린터) 상품정보제공고시 (object)사무용기기(컴퓨터/노트북/프린터) 상품정보제공고시
returnCostReason제품하자/오배송에 따른 청약철회 조항 (string)required제품하자ㆍ오배송 등에 따른 청약철회 등의 경우 청약철회 등의 기한 및 통신판매업자가 부담하는 반품 비용 등에 관한 정보. 미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래등에서의소비자보호에관한법률 등에 의한 제품의 하자 또는 오배송 등으로 인한 청약철회의 경우에는 상품 수령 후 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날로부터 30일 이내에 청약철회를 할 수 있으며, 반품 비용은 통신판매업자가 부담합니다.)

1 (상품상세 참조)

noRefundReason제품하자가 아닌 소비자의 단순변심에 따른 청약철회가 불가능한 경우 그 구체적 사유와 근거 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래 등에서의 소비자보호에 관한 법률 등에 의한 청약철회 제한 사유에 해당하는 경우 및 기타 객관적으로 이에 준하는 것으로 인정되는 경우 청약철회가 제한될 수 있습니다.)

1 (상품상세 참조)

qualityAssuranceStandard재화 등의 교환ㆍ반품ㆍ보증 조건 및 품질 보증 기준 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

compensationProcedure대금을 환불받기 위한 방법과 환불이 지연될 경우 지연배상금을 지급받을 수 있다는 사실 및 배상금 지급의 구체적인 조건·절차 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (주문취소 및 대금의 환불은 네이버페이 마이페이지에서 신청할 수 있으며, 전자상거래 등에서의 소비자보호에 관한 법률에 따라 소비자의 청약철회 후 판매자가 재화 등을 반환 받은 날로부터 3영업일 이내에 지급받은 대금의 환급을 정당한 사유 없이 지연하는 때에는 소비자는 지연기간에 대해서 연 15%의 지연배상금을 판매자에게 청구할 수 있습니다.)

1 (상품상세 참조)

troubleShootingContents소비자피해보상의 처리, 재화 등에 대한 불만 처리 및 소비자와 사업자 사이의 분쟁 처리에 관한 사항 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

itemName품명 (string)requiredPossible values: <= 50 characters

modelName모델명 (string)requiredPossible values: <= 50 characters

certificationTypeKC 인증정보 (string)required｢전기용품 및 생활용품 안전관리법｣에 따른 안전인증·안전확인·공급자적합성확인대상 제품 및 ｢전파법｣에 따른 적합인증·적합등록 대상 기자재에 한함Possible values: <= 200 characters

ratedVoltage정격전압 (string<해당 사항이 없으면 이 요소를 삭제하고 전송합니다.>)Possible values: <= 200 characters

powerConsumption소비전력 (string<해당 사항이 없으면 이 요소를 삭제하고 전송합니다.>)Possible values: <= 200 characters

energyEfficiencyRating에너지소비효율등급 (string<해당 사항이 없으면 이 요소를 삭제하고 전송합니다.>)｢에너지이용 합리화법｣에 따른 에너지소비효율등급 표시대상 기자재에 한함Possible values: <= 200 characters

releaseDate 동일 모델의 출시연월 (object<'yyyy-MM' 형식 입력>)Possible values: <= 300 characters
yearinteger<int32>

monthstringPossible values: [JANUARY, FEBRUARY, MARCH, APRIL, MAY, JUNE, JULY, AUGUST, SEPTEMBER, OCTOBER, NOVEMBER, DECEMBER]

monthValueinteger<int32>

leapYearboolean

releaseDateText동일 모델 출시연월 직접 입력 (string<releaseDate를 입력하지 않은 경우에는 필수>)Possible values: <= 300 characters

manufacturer제조자(사) (string)requiredPossible values: <= 200 characters

size크기 (string)requiredPossible values: <= 200 characters

weight무게 (string<해당 사항이 없으면 이 요소를 삭제하고 전송합니다.>)무게는 노트북 등 휴대형 기기에 한함Possible values: <= 200 characters

specification주요 사양 (string)required컴퓨터와 노트북의 경우 성능, 용량, 운영체제 포함 여부 등. 프린터의 경우 인쇄 속도 등.Possible values: <= 1500 characters

warrantyPolicy품질 보증 기준 (string)requiredPossible values: <= 1500 characters

afterServiceDirectorA/S 책임자와 전화번호 (string)requiredPossible values: <= 200 characters

opticsAppliances 광학기기(디지털카메라/캠코더) 상품정보제공고시 (object)광학기기(디지털카메라/캠코더) 상품정보제공고시
returnCostReason제품하자/오배송에 따른 청약철회 조항 (string)required제품하자ㆍ오배송 등에 따른 청약철회 등의 경우 청약철회 등의 기한 및 통신판매업자가 부담하는 반품 비용 등에 관한 정보. 미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래등에서의소비자보호에관한법률 등에 의한 제품의 하자 또는 오배송 등으로 인한 청약철회의 경우에는 상품 수령 후 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날로부터 30일 이내에 청약철회를 할 수 있으며, 반품 비용은 통신판매업자가 부담합니다.)

1 (상품상세 참조)

noRefundReason제품하자가 아닌 소비자의 단순변심에 따른 청약철회가 불가능한 경우 그 구체적 사유와 근거 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래 등에서의 소비자보호에 관한 법률 등에 의한 청약철회 제한 사유에 해당하는 경우 및 기타 객관적으로 이에 준하는 것으로 인정되는 경우 청약철회가 제한될 수 있습니다.)

1 (상품상세 참조)

qualityAssuranceStandard재화 등의 교환ㆍ반품ㆍ보증 조건 및 품질 보증 기준 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

compensationProcedure대금을 환불받기 위한 방법과 환불이 지연될 경우 지연배상금을 지급받을 수 있다는 사실 및 배상금 지급의 구체적인 조건·절차 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (주문취소 및 대금의 환불은 네이버페이 마이페이지에서 신청할 수 있으며, 전자상거래 등에서의 소비자보호에 관한 법률에 따라 소비자의 청약철회 후 판매자가 재화 등을 반환 받은 날로부터 3영업일 이내에 지급받은 대금의 환급을 정당한 사유 없이 지연하는 때에는 소비자는 지연기간에 대해서 연 15%의 지연배상금을 판매자에게 청구할 수 있습니다.)

1 (상품상세 참조)

troubleShootingContents소비자피해보상의 처리, 재화 등에 대한 불만 처리 및 소비자와 사업자 사이의 분쟁 처리에 관한 사항 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

itemName품명 (string)requiredPossible values: <= 50 characters

modelName모델명 (string)requiredPossible values: <= 50 characters

certificationTypeKC 인증정보 (string)required｢전기용품 및 생활용품 안전관리법｣에 따른 안전인증·안전확인·공급자적합성확인대상 제품 및 ｢전파법｣에 따른 적합인증·적합등록 대상 기자재에 한함Possible values: <= 200 characters

releaseDate동일 모델의 출시연월 (string<'yyyy-MM' 형식 입력>)Possible values: <= 300 characters

releaseDateText동일 모델 출시연월 직접 입력 (string<releaseDate를 입력하지 않은 경우에는 필수>)Possible values: <= 300 characters

manufacturer제조자(사) (string)requiredPossible values: <= 200 characters

size크기 (string)requiredPossible values: <= 200 characters

weight무게 (string)requiredPossible values: <= 200 characters

specification주요 사양 (string)required컴퓨터와 노트북의 경우 성능, 용량, 운영체제 포함 여부 등. 프린터의 경우 인쇄 속도 등.Possible values: <= 1500 characters

warrantyPolicy품질 보증 기준 (string)requiredPossible values: <= 1500 characters

afterServiceDirectorA/S 책임자와 전화번호 (string)requiredPossible values: <= 200 characters

microElectronics 소형전자(MP3/전자사전 등) 상품정보제공고시 (object)소형전자(MP3/전자사전 등) 상품정보제공고시
returnCostReason제품하자/오배송에 따른 청약철회 조항 (string)required제품하자ㆍ오배송 등에 따른 청약철회 등의 경우 청약철회 등의 기한 및 통신판매업자가 부담하는 반품 비용 등에 관한 정보. 미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래등에서의소비자보호에관한법률 등에 의한 제품의 하자 또는 오배송 등으로 인한 청약철회의 경우에는 상품 수령 후 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날로부터 30일 이내에 청약철회를 할 수 있으며, 반품 비용은 통신판매업자가 부담합니다.)

1 (상품상세 참조)

noRefundReason제품하자가 아닌 소비자의 단순변심에 따른 청약철회가 불가능한 경우 그 구체적 사유와 근거 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래 등에서의 소비자보호에 관한 법률 등에 의한 청약철회 제한 사유에 해당하는 경우 및 기타 객관적으로 이에 준하는 것으로 인정되는 경우 청약철회가 제한될 수 있습니다.)

1 (상품상세 참조)

qualityAssuranceStandard재화 등의 교환ㆍ반품ㆍ보증 조건 및 품질 보증 기준 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

compensationProcedure대금을 환불받기 위한 방법과 환불이 지연될 경우 지연배상금을 지급받을 수 있다는 사실 및 배상금 지급의 구체적인 조건·절차 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (주문취소 및 대금의 환불은 네이버페이 마이페이지에서 신청할 수 있으며, 전자상거래 등에서의 소비자보호에 관한 법률에 따라 소비자의 청약철회 후 판매자가 재화 등을 반환 받은 날로부터 3영업일 이내에 지급받은 대금의 환급을 정당한 사유 없이 지연하는 때에는 소비자는 지연기간에 대해서 연 15%의 지연배상금을 판매자에게 청구할 수 있습니다.)

1 (상품상세 참조)

troubleShootingContents소비자피해보상의 처리, 재화 등에 대한 불만 처리 및 소비자와 사업자 사이의 분쟁 처리에 관한 사항 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

itemName품명 (string)requiredPossible values: <= 50 characters

modelName모델명 (string)requiredPossible values: <= 50 characters

certificationTypeKC 인증정보 (string)required｢전기용품 및 생활용품 안전관리법｣에 따른 안전인증·안전확인·공급자적합성확인대상 제품 및 ｢전파법｣에 따른 적합인증·적합등록 대상 기자재에 한함Possible values: <= 200 characters

ratedVoltage정격전압 (string)requiredPossible values: <= 200 characters

powerConsumption소비전력 (string)requiredPossible values: <= 200 characters

releaseDate출시연월 (string<'yyyy-MM' 형식 입력>)Possible values: <= 300 characters

releaseDateText동일 모델 출시연월 직접 입력 (string<releaseDate를 입력하지 않은 경우에는 필수>)Possible values: <= 300 characters

manufacturer제조자(사) (string)requiredPossible values: <= 200 characters

size크기 (string)requiredPossible values: <= 200 characters

weight무게 (string)requiredPossible values: <= 200 characters

specification주요 사양 (string)requiredPossible values: <= 1500 characters

warrantyPolicy품질 보증 기준 (string)requiredPossible values: <= 1500 characters

afterServiceDirectorA/S 책임자와 전화번호 (string)requiredPossible values: <= 200 characters

navigation 내비게이션 상품정보제공고시 (object)내비게이션 상품정보제공고시
returnCostReason제품하자/오배송에 따른 청약철회 조항 (string)required제품하자ㆍ오배송 등에 따른 청약철회 등의 경우 청약철회 등의 기한 및 통신판매업자가 부담하는 반품 비용 등에 관한 정보. 미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래등에서의소비자보호에관한법률 등에 의한 제품의 하자 또는 오배송 등으로 인한 청약철회의 경우에는 상품 수령 후 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날로부터 30일 이내에 청약철회를 할 수 있으며, 반품 비용은 통신판매업자가 부담합니다.)

1 (상품상세 참조)

noRefundReason제품하자가 아닌 소비자의 단순변심에 따른 청약철회가 불가능한 경우 그 구체적 사유와 근거 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래 등에서의 소비자보호에 관한 법률 등에 의한 청약철회 제한 사유에 해당하는 경우 및 기타 객관적으로 이에 준하는 것으로 인정되는 경우 청약철회가 제한될 수 있습니다.)

1 (상품상세 참조)

qualityAssuranceStandard재화 등의 교환ㆍ반품ㆍ보증 조건 및 품질 보증 기준 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

compensationProcedure대금을 환불받기 위한 방법과 환불이 지연될 경우 지연배상금을 지급받을 수 있다는 사실 및 배상금 지급의 구체적인 조건·절차 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (주문취소 및 대금의 환불은 네이버페이 마이페이지에서 신청할 수 있으며, 전자상거래 등에서의 소비자보호에 관한 법률에 따라 소비자의 청약철회 후 판매자가 재화 등을 반환 받은 날로부터 3영업일 이내에 지급받은 대금의 환급을 정당한 사유 없이 지연하는 때에는 소비자는 지연기간에 대해서 연 15%의 지연배상금을 판매자에게 청구할 수 있습니다.)

1 (상품상세 참조)

troubleShootingContents소비자피해보상의 처리, 재화 등에 대한 불만 처리 및 소비자와 사업자 사이의 분쟁 처리에 관한 사항 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

itemName품명 (string)requiredPossible values: <= 50 characters

modelName모델명 (string)requiredPossible values: <= 50 characters

certificationTypeKC 인증정보 (string)required｢전기용품 및 생활용품 안전관리법｣에 따른 안전인증·안전확인·공급자적합성확인대상 제품 및 ｢전파법｣에 따른 적합인증·적합등록 대상 기자재에 한함Possible values: <= 200 characters

ratedVoltage정격전압 (string)requiredPossible values: <= 200 characters

powerConsumption소비전력 (string)requiredPossible values: <= 200 characters

releaseDate동일 모델의 출시연월 (string<'yyyy-MM' 형식 입력>)Possible values: <= 300 characters

releaseDateText동일 모델 출시연월 직접 입력 (string<releaseDate를 입력하지 않은 경우에는 필수>)Possible values: <= 300 characters

manufacturer제조자(사) (string)requiredPossible values: <= 200 characters

size크기 (string)requiredPossible values: <= 200 characters

weight무게 (string)requiredPossible values: <= 200 characters

specification주요 사양 (string)requiredPossible values: <= 1500 characters

updateCost맵 업데이트 비용 (string)requiredPossible values: <= 200 characters

freeCostPeriod무상 기간 (string)requiredPossible values: <= 200 characters

warrantyPolicy품질 보증 기준 (string)requiredPossible values: <= 1500 characters

afterServiceDirectorA/S 책임자와 전화번호 (string)requiredPossible values: <= 200 characters

carArticles 자동차용품(자동차부품/기타 자동차용품) 상품정보제공고시 (object)자동차용품(자동차부품/기타 자동차용품) 상품정보제공고시
returnCostReason제품하자/오배송에 따른 청약철회 조항 (string)required제품하자ㆍ오배송 등에 따른 청약철회 등의 경우 청약철회 등의 기한 및 통신판매업자가 부담하는 반품 비용 등에 관한 정보. 미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래등에서의소비자보호에관한법률 등에 의한 제품의 하자 또는 오배송 등으로 인한 청약철회의 경우에는 상품 수령 후 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날로부터 30일 이내에 청약철회를 할 수 있으며, 반품 비용은 통신판매업자가 부담합니다.)

1 (상품상세 참조)

noRefundReason제품하자가 아닌 소비자의 단순변심에 따른 청약철회가 불가능한 경우 그 구체적 사유와 근거 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래 등에서의 소비자보호에 관한 법률 등에 의한 청약철회 제한 사유에 해당하는 경우 및 기타 객관적으로 이에 준하는 것으로 인정되는 경우 청약철회가 제한될 수 있습니다.)

1 (상품상세 참조)

qualityAssuranceStandard재화 등의 교환ㆍ반품ㆍ보증 조건 및 품질 보증 기준 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

compensationProcedure대금을 환불받기 위한 방법과 환불이 지연될 경우 지연배상금을 지급받을 수 있다는 사실 및 배상금 지급의 구체적인 조건·절차 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (주문취소 및 대금의 환불은 네이버페이 마이페이지에서 신청할 수 있으며, 전자상거래 등에서의 소비자보호에 관한 법률에 따라 소비자의 청약철회 후 판매자가 재화 등을 반환 받은 날로부터 3영업일 이내에 지급받은 대금의 환급을 정당한 사유 없이 지연하는 때에는 소비자는 지연기간에 대해서 연 15%의 지연배상금을 판매자에게 청구할 수 있습니다.)

1 (상품상세 참조)

troubleShootingContents소비자피해보상의 처리, 재화 등에 대한 불만 처리 및 소비자와 사업자 사이의 분쟁 처리에 관한 사항 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

itemName품명 (string)requiredPossible values: <= 50 characters

modelName모델명 (string)requiredPossible values: <= 50 characters

releaseDate동일 모델 출시연월 (string<'yyyy-MM' 형식 입력>)Possible values: <= 300 characters

releaseDateText동일 모델 출시연월 직접 입력 (string<releaseDate를 입력하지 않은 경우에는 필수>)Possible values: <= 300 characters

certificationTypeKC 인증정보 (string)required｢자동차관리법｣에 따른 부품자기인증 대상 자동차부품 ｢전기용품 및 생활용품 안전관리법｣에 따른 안전인증·안전확인·공급자적합성확인대상제품 및 ｢전파법｣에 따른 적합인증·적합등록 대상 기자재에 한함Possible values: <= 200 characters

caution제품 사용으로 인한 위험 및 유의사항 (string)required연료절감장치에 한함Possible values: <= 200 characters

manufacturer제조자 (string)requiredPossible values: <= 200 characters

size크기 (string)requiredPossible values: <= 200 characters

applyModel적용 차종 (string)requiredPossible values: <= 1000 characters

warrantyPolicy품질 보증 기준 (string)requiredPossible values: <= 1500 characters

roadWorthyCertification검사합격증 번호 (string)required｢대기환경보전법｣에 따른 첨가제·촉매제에 한함Possible values: <= 50 characters

afterServiceDirectorA/S 책임자와 전화번호 (string)requiredPossible values: <= 200 characters

medicalAppliances 의료기기 상품정보제공고시 (object)의료기기 상품정보제공고시
returnCostReason제품하자/오배송에 따른 청약철회 조항 (string)required제품하자ㆍ오배송 등에 따른 청약철회 등의 경우 청약철회 등의 기한 및 통신판매업자가 부담하는 반품 비용 등에 관한 정보. 미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래등에서의소비자보호에관한법률 등에 의한 제품의 하자 또는 오배송 등으로 인한 청약철회의 경우에는 상품 수령 후 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날로부터 30일 이내에 청약철회를 할 수 있으며, 반품 비용은 통신판매업자가 부담합니다.)

1 (상품상세 참조)

noRefundReason제품하자가 아닌 소비자의 단순변심에 따른 청약철회가 불가능한 경우 그 구체적 사유와 근거 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래 등에서의 소비자보호에 관한 법률 등에 의한 청약철회 제한 사유에 해당하는 경우 및 기타 객관적으로 이에 준하는 것으로 인정되는 경우 청약철회가 제한될 수 있습니다.)

1 (상품상세 참조)

qualityAssuranceStandard재화 등의 교환ㆍ반품ㆍ보증 조건 및 품질 보증 기준 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

compensationProcedure대금을 환불받기 위한 방법과 환불이 지연될 경우 지연배상금을 지급받을 수 있다는 사실 및 배상금 지급의 구체적인 조건·절차 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (주문취소 및 대금의 환불은 네이버페이 마이페이지에서 신청할 수 있으며, 전자상거래 등에서의 소비자보호에 관한 법률에 따라 소비자의 청약철회 후 판매자가 재화 등을 반환 받은 날로부터 3영업일 이내에 지급받은 대금의 환급을 정당한 사유 없이 지연하는 때에는 소비자는 지연기간에 대해서 연 15%의 지연배상금을 판매자에게 청구할 수 있습니다.)

1 (상품상세 참조)

troubleShootingContents소비자피해보상의 처리, 재화 등에 대한 불만 처리 및 소비자와 사업자 사이의 분쟁 처리에 관한 사항 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

itemName품명 (string)requiredPossible values: <= 50 characters

modelName모델명 (string)requiredPossible values: <= 50 characters

licenceNo허가·인증·신고번호 (string<해당 사항이 없으면 이 요소를 삭제하고 전송합니다.>)｢의료기기법｣에 따른 허가·인증·신고 대상 의료기기에 한함Possible values: <= 30 characters

advertisingCertificationType광고사전심의 필 유무 (string)requiredPossible values: <= 200 characters

ratedVoltage정격전압 (string<해당 사항이 없으면 이 요소를 삭제하고 전송합니다.>)전기용품에 한함Possible values: <= 1500 characters

powerConsumption소비전력 (string<해당 사항이 없으면 이 요소를 삭제하고 전송합니다.>)전기용품에 한함Possible values: <= 200 characters

releaseDate출시연월 (string<'yyyy-MM' 형식 입력>)Possible values: <= 300 characters

releaseDateText동일 모델 출시연월 직접 입력 (string<releaseDate를 입력하지 않은 경우에는 필수>)Possible values: <= 300 characters

manufacturer제조자(사) (string)requiredPossible values: <= 200 characters

purpose제품의 사용 목적 (string)requiredPossible values: <= 500 characters

usage사용 방법 (string)requiredPossible values: <= 500 characters

caution취급 시 주의사항 (string)requiredPossible values: <= 1500 characters

warrantyPolicy품질 보증 기준 (string)requiredPossible values: <= 1500 characters

afterServiceDirectorA/S 책임자와 전화번호 (string)requiredPossible values: <= 200 characters

kitchenUtensils 주방용품 상품정보제공고시 (object)주방용품 상품정보제공고시
returnCostReason제품하자/오배송에 따른 청약철회 조항 (string)required제품하자ㆍ오배송 등에 따른 청약철회 등의 경우 청약철회 등의 기한 및 통신판매업자가 부담하는 반품 비용 등에 관한 정보. 미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래등에서의소비자보호에관한법률 등에 의한 제품의 하자 또는 오배송 등으로 인한 청약철회의 경우에는 상품 수령 후 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날로부터 30일 이내에 청약철회를 할 수 있으며, 반품 비용은 통신판매업자가 부담합니다.)

1 (상품상세 참조)

noRefundReason제품하자가 아닌 소비자의 단순변심에 따른 청약철회가 불가능한 경우 그 구체적 사유와 근거 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래 등에서의 소비자보호에 관한 법률 등에 의한 청약철회 제한 사유에 해당하는 경우 및 기타 객관적으로 이에 준하는 것으로 인정되는 경우 청약철회가 제한될 수 있습니다.)

1 (상품상세 참조)

qualityAssuranceStandard재화 등의 교환ㆍ반품ㆍ보증 조건 및 품질 보증 기준 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

compensationProcedure대금을 환불받기 위한 방법과 환불이 지연될 경우 지연배상금을 지급받을 수 있다는 사실 및 배상금 지급의 구체적인 조건·절차 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (주문취소 및 대금의 환불은 네이버페이 마이페이지에서 신청할 수 있으며, 전자상거래 등에서의 소비자보호에 관한 법률에 따라 소비자의 청약철회 후 판매자가 재화 등을 반환 받은 날로부터 3영업일 이내에 지급받은 대금의 환급을 정당한 사유 없이 지연하는 때에는 소비자는 지연기간에 대해서 연 15%의 지연배상금을 판매자에게 청구할 수 있습니다.)

1 (상품상세 참조)

troubleShootingContents소비자피해보상의 처리, 재화 등에 대한 불만 처리 및 소비자와 사업자 사이의 분쟁 처리에 관한 사항 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

itemName품명 (string)requiredPossible values: <= 50 characters

modelName모델명 (string)requiredPossible values: <= 50 characters

material재질 (string)requiredPossible values: <= 200 characters

component구성품 (string)requiredPossible values: <= 500 characters

size크기 (string)requiredPossible values: <= 200 characters

releaseDate출시연월 (string<'yyyy-MM' 형식 입력>)Possible values: <= 300 characters

releaseDateText동일 모델 출시연월 직접 입력 (string<releaseDate를 입력하지 않은 경우에는 필수>)Possible values: <= 300 characters

manufacturer제조자(사) (string)requiredPossible values: <= 200 characters

producer제조국 (string)requiredPossible values: <= 200 characters

importDeclaration수입식품안전관리특별법에 따른 수입신고 (boolean<미입력 시 false로 설정됩니다. true: 수입식품안전관리특별법에 따른 수입신고를 필함. false: 해당 사항 없음>)｢수입식품안전관리 특별법｣에 따른 수입기구 또는 용기·포장의 경우

warrantyPolicy품질 보증 기준 (string)requiredPossible values: <= 1500 characters

afterServiceDirectorA/S 책임자와 전화번호 (string)requiredPossible values: <= 200 characters

cosmetic 화장품 상품정보제공고시 (object)화장품 상품정보제공고시
returnCostReason제품하자/오배송에 따른 청약철회 조항 (string)required제품하자ㆍ오배송 등에 따른 청약철회 등의 경우 청약철회 등의 기한 및 통신판매업자가 부담하는 반품 비용 등에 관한 정보. 미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래등에서의소비자보호에관한법률 등에 의한 제품의 하자 또는 오배송 등으로 인한 청약철회의 경우에는 상품 수령 후 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날로부터 30일 이내에 청약철회를 할 수 있으며, 반품 비용은 통신판매업자가 부담합니다.)

1 (상품상세 참조)

noRefundReason제품하자가 아닌 소비자의 단순변심에 따른 청약철회가 불가능한 경우 그 구체적 사유와 근거 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래 등에서의 소비자보호에 관한 법률 등에 의한 청약철회 제한 사유에 해당하는 경우 및 기타 객관적으로 이에 준하는 것으로 인정되는 경우 청약철회가 제한될 수 있습니다.)

1 (상품상세 참조)

qualityAssuranceStandard재화 등의 교환ㆍ반품ㆍ보증 조건 및 품질 보증 기준 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

compensationProcedure대금을 환불받기 위한 방법과 환불이 지연될 경우 지연배상금을 지급받을 수 있다는 사실 및 배상금 지급의 구체적인 조건·절차 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (주문취소 및 대금의 환불은 네이버페이 마이페이지에서 신청할 수 있으며, 전자상거래 등에서의 소비자보호에 관한 법률에 따라 소비자의 청약철회 후 판매자가 재화 등을 반환 받은 날로부터 3영업일 이내에 지급받은 대금의 환급을 정당한 사유 없이 지연하는 때에는 소비자는 지연기간에 대해서 연 15%의 지연배상금을 판매자에게 청구할 수 있습니다.)

1 (상품상세 참조)

troubleShootingContents소비자피해보상의 처리, 재화 등에 대한 불만 처리 및 소비자와 사업자 사이의 분쟁 처리에 관한 사항 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

capacity내용물의 용량 및 중량 (string)requiredPossible values: <= 200 characters

specification제품 주요 사양 (string)required피부 타입, 색상(호, 번) 등Possible values: <= 1500 characters

expirationDate사용기한 또는 개봉 후 사용기간 (string<'yyyy-MM' 형식 입력>)Possible values: <= 300 characters

expirationDateText사용기한 또는 개봉 후 사용기간 직접 입력 (string<expirationDate를 입력하지 않은 경우에는 필수>)Possible values: <= 300 characters

usage사용 방법 (string)requiredPossible values: <= 1500 characters

manufacturer화장품 제조업자 (string)requiredPossible values: <= 200 characters

producer제조국 (string)requiredPossible values: <= 200 characters

distributor화장품책임판매업자 (string)requiredPossible values: <= 200 characters

customizedDistributor맞춤형 화장품판매업자 (string<해당 사항이 없으면 이 요소를 삭제하고 전송합니다.>)Possible values: <= 200 characters

mainIngredient｢화장품법｣에 따라 기재ㆍ표시하여야 하는 모든 성분 (string)requiredPossible values: <= 1500 characters

certificationType｢화장품법｣에 따른 기능성 화장품(미백, 주름개선, 자외선 차단제품 등)의 경우 (string)required화장품법에 따른 기능성 화장품 심사(또는 보고)를 필함Possible values: <= 200 characters

caution사용할 때의 주의사항 (string)requiredPossible values: <= 1500 characters

warrantyPolicy품질 보증 기준 (string)requiredPossible values: <= 1500 characters

customerServicePhoneNumber소비자 상담 관련 전화번호 (string)requiredPossible values: <= 30 characters

jewellery 귀금속/보석/시계류 상품정보제공고시 (object)귀금속/보석/시계류 상품정보제공고시
returnCostReason제품하자/오배송에 따른 청약철회 조항 (string)required제품하자ㆍ오배송 등에 따른 청약철회 등의 경우 청약철회 등의 기한 및 통신판매업자가 부담하는 반품 비용 등에 관한 정보. 미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래등에서의소비자보호에관한법률 등에 의한 제품의 하자 또는 오배송 등으로 인한 청약철회의 경우에는 상품 수령 후 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날로부터 30일 이내에 청약철회를 할 수 있으며, 반품 비용은 통신판매업자가 부담합니다.)

1 (상품상세 참조)

noRefundReason제품하자가 아닌 소비자의 단순변심에 따른 청약철회가 불가능한 경우 그 구체적 사유와 근거 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래 등에서의 소비자보호에 관한 법률 등에 의한 청약철회 제한 사유에 해당하는 경우 및 기타 객관적으로 이에 준하는 것으로 인정되는 경우 청약철회가 제한될 수 있습니다.)

1 (상품상세 참조)

qualityAssuranceStandard재화 등의 교환ㆍ반품ㆍ보증 조건 및 품질 보증 기준 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

compensationProcedure대금을 환불받기 위한 방법과 환불이 지연될 경우 지연배상금을 지급받을 수 있다는 사실 및 배상금 지급의 구체적인 조건·절차 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (주문취소 및 대금의 환불은 네이버페이 마이페이지에서 신청할 수 있으며, 전자상거래 등에서의 소비자보호에 관한 법률에 따라 소비자의 청약철회 후 판매자가 재화 등을 반환 받은 날로부터 3영업일 이내에 지급받은 대금의 환급을 정당한 사유 없이 지연하는 때에는 소비자는 지연기간에 대해서 연 15%의 지연배상금을 판매자에게 청구할 수 있습니다.)

1 (상품상세 참조)

troubleShootingContents소비자피해보상의 처리, 재화 등에 대한 불만 처리 및 소비자와 사업자 사이의 분쟁 처리에 관한 사항 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

material소재 (string)requiredPossible values: <= 200 characters

purity순도 (string)requiredPossible values: <= 200 characters

bandMaterial밴드 재질 (string<해당 사항이 없으면 이 요소를 삭제하고 전송합니다.>)시계의 경우Possible values: <= 200 characters

weight중량 (string)requiredPossible values: <= 200 characters

manufacturer제조자(사) (string)requiredPossible values: <= 200 characters

producer제조국(원산지, 가공지 등이 다를 경우) (string<해당 사항이 없으면 이 요소를 삭제하고 전송합니다.>)원산지, 가공지 등이 다를 경우 함께 표기Possible values: <= 200 characters

size치수 (string)requiredPossible values: <= 200 characters

caution착용 시 주의사항 (string)requiredPossible values: <= 1500 characters

specification주요 사양 (string)required귀금속, 보석류의 경우 등급, 시계의 경우 기능, 방수 등Possible values: <= 1500 characters

provideWarranty보증서 제공 여부 (string)requiredPossible values: <= 200 characters

warrantyPolicy품질 보증 기준 (string)requiredPossible values: <= 1500 characters

afterServiceDirectorA/S 책임자와 전화번호 (string)requiredPossible values: <= 200 characters

food 식품(농.축.수산물) 상품정보제공고시 (object)식품(농수산물) 상품정보제공고시
returnCostReason제품하자/오배송에 따른 청약철회 조항 (string)required제품하자ㆍ오배송 등에 따른 청약철회 등의 경우 청약철회 등의 기한 및 통신판매업자가 부담하는 반품 비용 등에 관한 정보. 미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래등에서의소비자보호에관한법률 등에 의한 제품의 하자 또는 오배송 등으로 인한 청약철회의 경우에는 상품 수령 후 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날로부터 30일 이내에 청약철회를 할 수 있으며, 반품 비용은 통신판매업자가 부담합니다.)

1 (상품상세 참조)

noRefundReason제품하자가 아닌 소비자의 단순변심에 따른 청약철회가 불가능한 경우 그 구체적 사유와 근거 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래 등에서의 소비자보호에 관한 법률 등에 의한 청약철회 제한 사유에 해당하는 경우 및 기타 객관적으로 이에 준하는 것으로 인정되는 경우 청약철회가 제한될 수 있습니다.)

1 (상품상세 참조)

qualityAssuranceStandard재화 등의 교환ㆍ반품ㆍ보증 조건 및 품질 보증 기준 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

compensationProcedure대금을 환불받기 위한 방법과 환불이 지연될 경우 지연배상금을 지급받을 수 있다는 사실 및 배상금 지급의 구체적인 조건·절차 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (주문취소 및 대금의 환불은 네이버페이 마이페이지에서 신청할 수 있으며, 전자상거래 등에서의 소비자보호에 관한 법률에 따라 소비자의 청약철회 후 판매자가 재화 등을 반환 받은 날로부터 3영업일 이내에 지급받은 대금의 환급을 정당한 사유 없이 지연하는 때에는 소비자는 지연기간에 대해서 연 15%의 지연배상금을 판매자에게 청구할 수 있습니다.)

1 (상품상세 참조)

troubleShootingContents소비자피해보상의 처리, 재화 등에 대한 불만 처리 및 소비자와 사업자 사이의 분쟁 처리에 관한 사항 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

foodItem품목 또는 명칭 (string)requiredPossible values: <= 200 characters

weight포장 단위별 용량(중량), 수량, 크기 (string)requiredPossible values: <= 50 characters

amount포장 단위별 수량 (string)requiredPossible values: <= 200 characters

size포장 단위별 크기 (string)requiredPossible values: <= 200 characters

packDate제조연월일 (string<date>)Possible values: <= 300 characters

packDateText제조연월일 직접 입력 (string<packDate를 입력하지 않은 경우에는 필수>)Possible values: <= 300 characters

expirationDate유통기한 (string<date>)deprecatedPossible values: <= 300 characters

expirationDateText유통기한 직접 입력 (string<expirationDate를 입력하지 않은 경우에는 필수>)deprecatedPossible values: <= 300 characters

consumptionDate소비기한 또는 품질유지기한 (string<date>)Possible values: <= 300 characters

consumptionDateText소비기한 또는 품질유지기한 직접 입력 (string<consumptionDate를 입력하지 않은 경우에는 필수>)Possible values: <= 300 characters

producer생산자 (string)requiredPossible values: <= 200 characters

relevantLawContent세부 품목군별 표시사항 (string<해당 사항이 없으면 이 요소를 삭제하고 전송합니다.>)농산물

｢농수산물 품질관리법｣에 따른 유전자변형농수산물 표시, 지리적 표시 축산물

축산법에 따른 등급 표시 등급(1++ 국내산 쇠고기의 경우 ｢소·돼지 식육의 표시방법 및 부위 구분기준｣에 따라 근내지방도 정보를 포함하여 표시), ｢가축 및 축산물 이력관리에 관한 법률｣에 따른 이력관리대상축산물 유무 수입 농수축산물

수입식품안전관리특별법에 따른 수입신고를 필함

Possible values: <= 200 characters

productComposition상품 구성 (string)requiredPossible values: <= 200 characters

keep보관 방법 또는 취급 방법 (string)requiredPossible values: <= 500 characters

adCaution소비자 안전을 위한 주의사항 (string)required｢식품 등의 표시ㆍ광고에 관한 법률 시행규칙｣ 제5조 및 [별표 2]에 따른 표시사항을 말함Possible values: <= 500 characters

customerServicePhoneNumber소비자 상담 관련 전화번호 (string)requiredPossible values: <= 30 characters

generalFood 가공식품 상품정보제공고시 (object)가공식품 상품정보제공고시
returnCostReason제품하자/오배송에 따른 청약철회 조항 (string)required제품하자ㆍ오배송 등에 따른 청약철회 등의 경우 청약철회 등의 기한 및 통신판매업자가 부담하는 반품 비용 등에 관한 정보. 미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래등에서의소비자보호에관한법률 등에 의한 제품의 하자 또는 오배송 등으로 인한 청약철회의 경우에는 상품 수령 후 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날로부터 30일 이내에 청약철회를 할 수 있으며, 반품 비용은 통신판매업자가 부담합니다.)

1 (상품상세 참조)

noRefundReason제품하자가 아닌 소비자의 단순변심에 따른 청약철회가 불가능한 경우 그 구체적 사유와 근거 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래 등에서의 소비자보호에 관한 법률 등에 의한 청약철회 제한 사유에 해당하는 경우 및 기타 객관적으로 이에 준하는 것으로 인정되는 경우 청약철회가 제한될 수 있습니다.)

1 (상품상세 참조)

qualityAssuranceStandard재화 등의 교환ㆍ반품ㆍ보증 조건 및 품질 보증 기준 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

compensationProcedure대금을 환불받기 위한 방법과 환불이 지연될 경우 지연배상금을 지급받을 수 있다는 사실 및 배상금 지급의 구체적인 조건·절차 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (주문취소 및 대금의 환불은 네이버페이 마이페이지에서 신청할 수 있으며, 전자상거래 등에서의 소비자보호에 관한 법률에 따라 소비자의 청약철회 후 판매자가 재화 등을 반환 받은 날로부터 3영업일 이내에 지급받은 대금의 환급을 정당한 사유 없이 지연하는 때에는 소비자는 지연기간에 대해서 연 15%의 지연배상금을 판매자에게 청구할 수 있습니다.)

1 (상품상세 참조)

troubleShootingContents소비자피해보상의 처리, 재화 등에 대한 불만 처리 및 소비자와 사업자 사이의 분쟁 처리에 관한 사항 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

productName제품명 (string)requiredPossible values: <= 200 characters

foodType식품의 유형 (string)requiredPossible values: <= 200 characters

producer생산자 (string)requiredPossible values: <= 200 characters

location소재지 (string)required수입품의 경우 생산자, 수입자 및 제조국Possible values: <= 200 characters

packDate제조연월일 (string<date>)Possible values: <= 300 characters

packDateText제조연월일 직접 입력 (string<packDate를 입력하지 않은 경우에는 필수>)Possible values: <= 300 characters

expirationDate유통기한 (string<date>)deprecatedPossible values: <= 300 characters

expirationDateText유통기한 직접 입력 (string<expirationDate를 입력하지 않은 경우에는 필수>)deprecatedPossible values: <= 300 characters

consumptionDate소비기한 또는 품질유지기한 (string<date>)Possible values: <= 300 characters

consumptionDateText소비기한 또는 품질유지기한 직접 입력 (string<consumptionDate를 입력하지 않은 경우에는 필수>)Possible values: <= 300 characters

weight포장 단위별 내용물의 용량(중량), 수량 (string)requiredPossible values: <= 200 characters

amount포장 단위별 수량 (string)requiredPossible values: <= 200 characters

ingredients원재료명(｢농수산물의 원산지 표시 등에 관한 법률｣에 따른 원산지 표시 포함) 및 함량 (string)required단, 함량의 경우에는 원재료 함량 표시대상 식품에 한함Possible values: <= 1000 characters

nutritionFacts영양 성분 (string)영양성분 표시대상 식품에 한함Possible values: <= 1000 characters

geneticallyModified유전자변형식품에 해당하는 경우의 표시 (boolean)required

consumerSafetyCaution소비자안전을 위한 주의사항 (string)required｢식품 등의 표시ㆍ광고에 관한 법률 시행규칙｣ 제5조 및 [별표 2]에 따른 표시사항을 말함Possible values: <= 500 characters

importDeclarationCheck수입식품의 경우 신고 필 유무 (boolean<- true: 수입식품안전관리특별법에 따른 수입 신고를 필함
- false: 해당 사항 없음>)required

customerServicePhoneNumber소비자 상담 관련 전화번호 (string)requiredPossible values: <= 30 characters

dietFood 건강기능식품 상품정보제공고시 (object)건강기능식품 상품정보제공고시
returnCostReason제품하자/오배송에 따른 청약철회 조항 (string)required제품하자ㆍ오배송 등에 따른 청약철회 등의 경우 청약철회 등의 기한 및 통신판매업자가 부담하는 반품 비용 등에 관한 정보. 미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래등에서의소비자보호에관한법률 등에 의한 제품의 하자 또는 오배송 등으로 인한 청약철회의 경우에는 상품 수령 후 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날로부터 30일 이내에 청약철회를 할 수 있으며, 반품 비용은 통신판매업자가 부담합니다.)

1 (상품상세 참조)

noRefundReason제품하자가 아닌 소비자의 단순변심에 따른 청약철회가 불가능한 경우 그 구체적 사유와 근거 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래 등에서의 소비자보호에 관한 법률 등에 의한 청약철회 제한 사유에 해당하는 경우 및 기타 객관적으로 이에 준하는 것으로 인정되는 경우 청약철회가 제한될 수 있습니다.)

1 (상품상세 참조)

qualityAssuranceStandard재화 등의 교환ㆍ반품ㆍ보증 조건 및 품질 보증 기준 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

compensationProcedure대금을 환불받기 위한 방법과 환불이 지연될 경우 지연배상금을 지급받을 수 있다는 사실 및 배상금 지급의 구체적인 조건·절차 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (주문취소 및 대금의 환불은 네이버페이 마이페이지에서 신청할 수 있으며, 전자상거래 등에서의 소비자보호에 관한 법률에 따라 소비자의 청약철회 후 판매자가 재화 등을 반환 받은 날로부터 3영업일 이내에 지급받은 대금의 환급을 정당한 사유 없이 지연하는 때에는 소비자는 지연기간에 대해서 연 15%의 지연배상금을 판매자에게 청구할 수 있습니다.)

1 (상품상세 참조)

troubleShootingContents소비자피해보상의 처리, 재화 등에 대한 불만 처리 및 소비자와 사업자 사이의 분쟁 처리에 관한 사항 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

productName제품명 (string)requiredPossible values: <= 200 characters

producer제조업소 (string)requiredPossible values: <= 200 characters

location소재지 (string)required수입품의 경우 수입업소명, 제조업소명 및 수출국명Possible values: <= 200 characters

expirationDate유통기한 (string<date>)deprecatedPossible values: <= 300 characters

expirationDateText유통기한 직접 입력 (string<expirationDate를 입력하지 않은 경우에는 필수>)deprecatedPossible values: <= 300 characters

consumptionDate소비기한 (string<date>)Possible values: <= 300 characters

consumptionDateText소비기한 직접 입력 (string<consumptionDate를 입력하지 않은 경우에는 필수>)Possible values: <= 300 characters

storageMethod보관방법 (string)requiredPossible values: <= 200 characters

weight포장 단위별 내용물의 용량(중량), 수량 (string)requiredPossible values: <= 200 characters

amount포장 단위별 수량 (string)requiredPossible values: <= 200 characters

ingredients원료명 및 함량 (string)required｢농수산물의 원산지 표시 등에 관한 법률｣에 따른 원산지 표시 포함Possible values: <= 1000 characters

nutritionFacts영양 정보 (string)requiredPossible values: <= 1000 characters

specification기능 정보 (string)requiredPossible values: <= 1000 characters

cautionAndSideEffect섭취량, 섭취 방법 및 섭취 시 주의사항 (string)requiredPossible values: <= 1000 characters

nonMedicinalUsesMessage질병의 예방 및 치료를 위한 의약품이 아니라는 내용의 문구 (string)requiredPossible values: <= 200 characters

geneticallyModified유전자변형건강기능식품에 해당하는 경우의 표시 (boolean)required

importDeclarationCheck수입 건강기능식품에 해당하는 경우 (boolean<- true: 수입식품안전관리특별법에 따른 수입 신고를 필함
- false: 해당 사항 없음>)required

consumerSafetyCaution소비자안전을 위한 주의사항 (string)required｢식품 등의 표시ㆍ광고에 관한 법률 시행규칙｣ 제5조 및 [별표 2]에 따른 표시사항을 말함Possible values: <= 500 characters

customerServicePhoneNumber소비자 상담 관련 전화번호 (string)requiredPossible values: <= 30 characters

kids 영유아용품 상품정보제공고시 (object)어린이제품요약정보 상품정보제공고시
returnCostReason제품하자/오배송에 따른 청약철회 조항 (string)required제품하자ㆍ오배송 등에 따른 청약철회 등의 경우 청약철회 등의 기한 및 통신판매업자가 부담하는 반품 비용 등에 관한 정보. 미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래등에서의소비자보호에관한법률 등에 의한 제품의 하자 또는 오배송 등으로 인한 청약철회의 경우에는 상품 수령 후 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날로부터 30일 이내에 청약철회를 할 수 있으며, 반품 비용은 통신판매업자가 부담합니다.)

1 (상품상세 참조)

noRefundReason제품하자가 아닌 소비자의 단순변심에 따른 청약철회가 불가능한 경우 그 구체적 사유와 근거 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래 등에서의 소비자보호에 관한 법률 등에 의한 청약철회 제한 사유에 해당하는 경우 및 기타 객관적으로 이에 준하는 것으로 인정되는 경우 청약철회가 제한될 수 있습니다.)

1 (상품상세 참조)

qualityAssuranceStandard재화 등의 교환ㆍ반품ㆍ보증 조건 및 품질 보증 기준 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

compensationProcedure대금을 환불받기 위한 방법과 환불이 지연될 경우 지연배상금을 지급받을 수 있다는 사실 및 배상금 지급의 구체적인 조건·절차 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (주문취소 및 대금의 환불은 네이버페이 마이페이지에서 신청할 수 있으며, 전자상거래 등에서의 소비자보호에 관한 법률에 따라 소비자의 청약철회 후 판매자가 재화 등을 반환 받은 날로부터 3영업일 이내에 지급받은 대금의 환급을 정당한 사유 없이 지연하는 때에는 소비자는 지연기간에 대해서 연 15%의 지연배상금을 판매자에게 청구할 수 있습니다.)

1 (상품상세 참조)

troubleShootingContents소비자피해보상의 처리, 재화 등에 대한 불만 처리 및 소비자와 사업자 사이의 분쟁 처리에 관한 사항 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

itemName품명 (string)requiredPossible values: <= 50 characters

modelName모델명 (string)requiredPossible values: <= 50 characters

certificationTypeKC 인증정보 (string)required｢어린이제품 안전 특별법｣에 따른 안전인증·안전확인·공급자적합성확인대상 어린이제품에 한함Possible values: <= 200 characters

size크기 (string)requiredPossible values: <= 200 characters

weight중량 (string)required섬유제품 등의 경우 치수 정보로 대체 가능Possible values: <= 200 characters

color색상 (string)requiredPossible values: <= 200 characters

material재질 (string)required섬유의 경우 혼용율Possible values: <= 200 characters

recommendedAge사용 연령 또는 권장 사용 연령 (string)requiredPossible values: <= 30 characters

releaseDate동일 모델의 출시연월 (string<'yyyy-MM' 형식 입력>)Possible values: <= 300 characters

releaseDateText동일 모델 출시연월 직접 입력 (string<releaseDate를 입력하지 않은 경우에는 필수>)Possible values: <= 300 characters

manufacturer제조자(사) (string)requiredPossible values: <= 200 characters

caution취급방법 및 취급 시 주의사항, 안전표시(주의, 경고 등) (string)requiredPossible values: <= 1500 characters

warrantyPolicy품질 보증 기준 (string)requiredPossible values: <= 1500 characters

afterServiceDirectorA/S 책임자와 전화번호 (string)requiredPossible values: <= 200 characters

numberLimit크기·체중의 한계 (string<해당 사항이 없으면 이 요소를 삭제하고 전송합니다.>)착용 또는 탑승용 어린이제품과 같이 크기·체중에 제한이 있는 품목의 경우 반드시 표시Possible values: <= 200 characters

musicalInstrument 악기 상품정보제공고시 (object)악기 상품정보제공고시
returnCostReason제품하자/오배송에 따른 청약철회 조항 (string)required제품하자ㆍ오배송 등에 따른 청약철회 등의 경우 청약철회 등의 기한 및 통신판매업자가 부담하는 반품 비용 등에 관한 정보. 미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래등에서의소비자보호에관한법률 등에 의한 제품의 하자 또는 오배송 등으로 인한 청약철회의 경우에는 상품 수령 후 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날로부터 30일 이내에 청약철회를 할 수 있으며, 반품 비용은 통신판매업자가 부담합니다.)

1 (상품상세 참조)

noRefundReason제품하자가 아닌 소비자의 단순변심에 따른 청약철회가 불가능한 경우 그 구체적 사유와 근거 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래 등에서의 소비자보호에 관한 법률 등에 의한 청약철회 제한 사유에 해당하는 경우 및 기타 객관적으로 이에 준하는 것으로 인정되는 경우 청약철회가 제한될 수 있습니다.)

1 (상품상세 참조)

qualityAssuranceStandard재화 등의 교환ㆍ반품ㆍ보증 조건 및 품질 보증 기준 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

compensationProcedure대금을 환불받기 위한 방법과 환불이 지연될 경우 지연배상금을 지급받을 수 있다는 사실 및 배상금 지급의 구체적인 조건·절차 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (주문취소 및 대금의 환불은 네이버페이 마이페이지에서 신청할 수 있으며, 전자상거래 등에서의 소비자보호에 관한 법률에 따라 소비자의 청약철회 후 판매자가 재화 등을 반환 받은 날로부터 3영업일 이내에 지급받은 대금의 환급을 정당한 사유 없이 지연하는 때에는 소비자는 지연기간에 대해서 연 15%의 지연배상금을 판매자에게 청구할 수 있습니다.)

1 (상품상세 참조)

troubleShootingContents소비자피해보상의 처리, 재화 등에 대한 불만 처리 및 소비자와 사업자 사이의 분쟁 처리에 관한 사항 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

itemName품명 (string)requiredPossible values: <= 50 characters

modelName모델명 (string)requiredPossible values: <= 50 characters

size크기 (string)requiredPossible values: <= 200 characters

color색상 (string)requiredPossible values: <= 200 characters

material재질 (string)requiredPossible values: <= 200 characters

components제품 구성 (string)requiredPossible values: <= 1000 characters

releaseDate동일 모델의 출시연월 (string<'yyyy-MM' 형식 입력>)Possible values: <= 300 characters

releaseDateText동일 모델 출시연월 직접 입력 (string<releaseDate를 입력하지 않은 경우에는 필수>)Possible values: <= 300 characters

manufacturer제조자(사) (string)requiredPossible values: <= 200 characters

detailContent상품별 세부 사양 (string)requiredPossible values: <= 1000 characters

warrantyPolicy품질 보증 기준 (string)requiredPossible values: <= 1500 characters

afterServiceDirectorA/S 책임자와 전화번호 (string)requiredPossible values: <= 200 characters

sportsEquipment 스포츠용품 상품정보제공고시 (object)스포츠용품 상품정보제공고시
returnCostReason제품하자/오배송에 따른 청약철회 조항 (string)required제품하자ㆍ오배송 등에 따른 청약철회 등의 경우 청약철회 등의 기한 및 통신판매업자가 부담하는 반품 비용 등에 관한 정보. 미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래등에서의소비자보호에관한법률 등에 의한 제품의 하자 또는 오배송 등으로 인한 청약철회의 경우에는 상품 수령 후 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날로부터 30일 이내에 청약철회를 할 수 있으며, 반품 비용은 통신판매업자가 부담합니다.)

1 (상품상세 참조)

noRefundReason제품하자가 아닌 소비자의 단순변심에 따른 청약철회가 불가능한 경우 그 구체적 사유와 근거 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래 등에서의 소비자보호에 관한 법률 등에 의한 청약철회 제한 사유에 해당하는 경우 및 기타 객관적으로 이에 준하는 것으로 인정되는 경우 청약철회가 제한될 수 있습니다.)

1 (상품상세 참조)

qualityAssuranceStandard재화 등의 교환ㆍ반품ㆍ보증 조건 및 품질 보증 기준 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

compensationProcedure대금을 환불받기 위한 방법과 환불이 지연될 경우 지연배상금을 지급받을 수 있다는 사실 및 배상금 지급의 구체적인 조건·절차 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (주문취소 및 대금의 환불은 네이버페이 마이페이지에서 신청할 수 있으며, 전자상거래 등에서의 소비자보호에 관한 법률에 따라 소비자의 청약철회 후 판매자가 재화 등을 반환 받은 날로부터 3영업일 이내에 지급받은 대금의 환급을 정당한 사유 없이 지연하는 때에는 소비자는 지연기간에 대해서 연 15%의 지연배상금을 판매자에게 청구할 수 있습니다.)

1 (상품상세 참조)

troubleShootingContents소비자피해보상의 처리, 재화 등에 대한 불만 처리 및 소비자와 사업자 사이의 분쟁 처리에 관한 사항 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

itemName품명 (string)requiredPossible values: <= 50 characters

modelName모델명 (string)requiredPossible values: <= 50 characters

certificationTypeKC 인증정보 (string)required｢전기용품 및 생활용품 안전관리법｣에 따른 안전인증·안전확인·공급자적합성확인대상 제품에 한함Possible values: <= 200 characters

size크기 (string)requiredPossible values: <= 200 characters

weight중량 (string)requiredPossible values: <= 200 characters

color색상 (string)requiredPossible values: <= 200 characters

material재질 (string)requiredPossible values: <= 200 characters

components제품 구성 (string)requiredPossible values: <= 1000 characters

releaseDate 동일 모델의 출시연월 (object<'yyyy-MM' 형식 입력>)Possible values: <= 300 characters
yearinteger<int32>

monthstringPossible values: [JANUARY, FEBRUARY, MARCH, APRIL, MAY, JUNE, JULY, AUGUST, SEPTEMBER, OCTOBER, NOVEMBER, DECEMBER]

monthValueinteger<int32>

leapYearboolean

releaseDateText동일 모델 출시연월 직접 입력 (string<releaseDate를 입력하지 않은 경우에는 필수>)Possible values: <= 300 characters

manufacturer제조자(사) (string)requiredPossible values: <= 200 characters

detailContent상품별 세부 사양 (string)requiredPossible values: <= 1000 characters

warrantyPolicy품질 보증 기준 (string)requiredPossible values: <= 1500 characters

afterServiceDirectorA/S 책임자와 전화번호 (string)requiredPossible values: <= 200 characters

books 서적 상품정보제공고시 (object)서적 상품정보제공고시
returnCostReason제품하자/오배송에 따른 청약철회 조항 (string)required제품하자ㆍ오배송 등에 따른 청약철회 등의 경우 청약철회 등의 기한 및 통신판매업자가 부담하는 반품 비용 등에 관한 정보. 미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래등에서의소비자보호에관한법률 등에 의한 제품의 하자 또는 오배송 등으로 인한 청약철회의 경우에는 상품 수령 후 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날로부터 30일 이내에 청약철회를 할 수 있으며, 반품 비용은 통신판매업자가 부담합니다.)

1 (상품상세 참조)

noRefundReason제품하자가 아닌 소비자의 단순변심에 따른 청약철회가 불가능한 경우 그 구체적 사유와 근거 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래 등에서의 소비자보호에 관한 법률 등에 의한 청약철회 제한 사유에 해당하는 경우 및 기타 객관적으로 이에 준하는 것으로 인정되는 경우 청약철회가 제한될 수 있습니다.)

1 (상품상세 참조)

qualityAssuranceStandard재화 등의 교환ㆍ반품ㆍ보증 조건 및 품질 보증 기준 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

compensationProcedure대금을 환불받기 위한 방법과 환불이 지연될 경우 지연배상금을 지급받을 수 있다는 사실 및 배상금 지급의 구체적인 조건·절차 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (주문취소 및 대금의 환불은 네이버페이 마이페이지에서 신청할 수 있으며, 전자상거래 등에서의 소비자보호에 관한 법률에 따라 소비자의 청약철회 후 판매자가 재화 등을 반환 받은 날로부터 3영업일 이내에 지급받은 대금의 환급을 정당한 사유 없이 지연하는 때에는 소비자는 지연기간에 대해서 연 15%의 지연배상금을 판매자에게 청구할 수 있습니다.)

1 (상품상세 참조)

troubleShootingContents소비자피해보상의 처리, 재화 등에 대한 불만 처리 및 소비자와 사업자 사이의 분쟁 처리에 관한 사항 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

title도서명 (string)requiredPossible values: <= 200 characters

author저자 (string)requiredPossible values: <= 200 characters

publisher출판사 (string)requiredPossible values: <= 200 characters

size크기 (string)requiredPossible values: <= 200 characters

pages쪽수 (string)requiredPossible values: <= 30 characters

components제품 구성(전집 또는 세트일 경우 낱권 구성, CD 등) (string<해당 사항이 없으면 이 요소를 삭제하고 전송합니다.>)전집 또는 세트일경우 낱권 구성, CD 등Possible values: <= 1000 characters

publishDate발행일 (string<date>)｢출판문화산업 진흥법｣ 제2조 및 제22조의 규정에 따른 것으로, 매 판을 처음 인쇄한 날을 말함. 단, 매 판을 구분할 때에 오탈자의 변경 등 경미한 변경에 따라 다시 인쇄하는 경우는 제외Possible values: <= 200 characters

publishDateText발행일 직접 입력 (string<publishDate를 입력하지 않은 경우에는 필수>)｢출판문화산업 진흥법｣ 제2조 및 제22조의 규정에 따른 것으로, 매 판을 처음 인쇄한 날을 말함. 단, 매 판을 구분할 때에 오탈자의 변경 등 경미한 변경에 따라 다시 인쇄하는 경우는 제외Possible values: <= 200 characters

description목차 또는 책 소개 (string)required아동용 학습교재의 경우 사용 연령을 포함Possible values: <= 1000 characters

rentalEtc 물품대여 서비스(서적, 유아용품, 행사용품 등) 상품정보제공고시 (object)물품대여 서비스(서적, 유아용품, 행사용품 등) 상품정보제공고시
returnCostReason제품하자/오배송에 따른 청약철회 조항 (string)required제품하자ㆍ오배송 등에 따른 청약철회 등의 경우 청약철회 등의 기한 및 통신판매업자가 부담하는 반품 비용 등에 관한 정보. 미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래등에서의소비자보호에관한법률 등에 의한 제품의 하자 또는 오배송 등으로 인한 청약철회의 경우에는 상품 수령 후 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날로부터 30일 이내에 청약철회를 할 수 있으며, 반품 비용은 통신판매업자가 부담합니다.)

1 (상품상세 참조)

noRefundReason제품하자가 아닌 소비자의 단순변심에 따른 청약철회가 불가능한 경우 그 구체적 사유와 근거 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래 등에서의 소비자보호에 관한 법률 등에 의한 청약철회 제한 사유에 해당하는 경우 및 기타 객관적으로 이에 준하는 것으로 인정되는 경우 청약철회가 제한될 수 있습니다.)

1 (상품상세 참조)

qualityAssuranceStandard재화 등의 교환ㆍ반품ㆍ보증 조건 및 품질 보증 기준 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

compensationProcedure대금을 환불받기 위한 방법과 환불이 지연될 경우 지연배상금을 지급받을 수 있다는 사실 및 배상금 지급의 구체적인 조건·절차 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (주문취소 및 대금의 환불은 네이버페이 마이페이지에서 신청할 수 있으며, 전자상거래 등에서의 소비자보호에 관한 법률에 따라 소비자의 청약철회 후 판매자가 재화 등을 반환 받은 날로부터 3영업일 이내에 지급받은 대금의 환급을 정당한 사유 없이 지연하는 때에는 소비자는 지연기간에 대해서 연 15%의 지연배상금을 판매자에게 청구할 수 있습니다.)

1 (상품상세 참조)

troubleShootingContents소비자피해보상의 처리, 재화 등에 대한 불만 처리 및 소비자와 사업자 사이의 분쟁 처리에 관한 사항 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

itemName품명 (string)requiredPossible values: <= 50 characters

modelName모델명 (string)requiredPossible values: <= 50 characters

ownershipTransferCondition소유권 이전 조건 (string<해당 사항이 없으면 이 요소를 삭제하고 전송합니다.>)소유권이 이전되는 경우에 한하며, 소유권 이전에 필요한 렌탈 기간 또는 총 렌탈 금액 등 요건을 구체적으로 명시Possible values: <= 500 characters

payingForLossOrDamage상품의 고장, 분실, 훼손 시 소비자 책임 (string)requiredPossible values: <= 200 characters

refundPolicyForCancel중도 해약 시 환불 기준 (string)requiredPossible values: <= 500 characters

customerServicePhoneNumber소비자 상담 관련 전화번호 (string)requiredPossible values: <= 30 characters

rentalHa 물품대여 서비스(정수기, 비데, 공기청정기 등) 상품정보제공고시 (object)물품대여 서비스(정수기, 비데, 공기청정기 등) 상품정보제공고시
returnCostReason제품하자/오배송에 따른 청약철회 조항 (string)required제품하자ㆍ오배송 등에 따른 청약철회 등의 경우 청약철회 등의 기한 및 통신판매업자가 부담하는 반품 비용 등에 관한 정보. 미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래등에서의소비자보호에관한법률 등에 의한 제품의 하자 또는 오배송 등으로 인한 청약철회의 경우에는 상품 수령 후 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날로부터 30일 이내에 청약철회를 할 수 있으며, 반품 비용은 통신판매업자가 부담합니다.)

1 (상품상세 참조)

noRefundReason제품하자가 아닌 소비자의 단순변심에 따른 청약철회가 불가능한 경우 그 구체적 사유와 근거 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래 등에서의 소비자보호에 관한 법률 등에 의한 청약철회 제한 사유에 해당하는 경우 및 기타 객관적으로 이에 준하는 것으로 인정되는 경우 청약철회가 제한될 수 있습니다.)

1 (상품상세 참조)

qualityAssuranceStandard재화 등의 교환ㆍ반품ㆍ보증 조건 및 품질 보증 기준 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

compensationProcedure대금을 환불받기 위한 방법과 환불이 지연될 경우 지연배상금을 지급받을 수 있다는 사실 및 배상금 지급의 구체적인 조건·절차 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (주문취소 및 대금의 환불은 네이버페이 마이페이지에서 신청할 수 있으며, 전자상거래 등에서의 소비자보호에 관한 법률에 따라 소비자의 청약철회 후 판매자가 재화 등을 반환 받은 날로부터 3영업일 이내에 지급받은 대금의 환급을 정당한 사유 없이 지연하는 때에는 소비자는 지연기간에 대해서 연 15%의 지연배상금을 판매자에게 청구할 수 있습니다.)

1 (상품상세 참조)

troubleShootingContents소비자피해보상의 처리, 재화 등에 대한 불만 처리 및 소비자와 사업자 사이의 분쟁 처리에 관한 사항 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

itemName품명 (string)requiredPossible values: <= 50 characters

modelName모델명 (string)requiredPossible values: <= 50 characters

ownershipTransferCondition소유권 이전 조건 (string<해당 사항이 없으면 이 요소를 삭제하고 전송합니다.>)소유권이 이전되는 경우에 한하며, 소유권 이전에 필요한 렌탈 기간 또는 총 렌탈 금액 등 요건을 구체적으로 명시Possible values: <= 500 characters

payingForLossOrDamage상품의 고장, 분실, 훼손 시 소비자 책임 (string)requiredPossible values: <= 200 characters

refundPolicyForCancel중도 해약 시 환불 기준 (string)requiredPossible values: <= 500 characters

customerServicePhoneNumber소비자 상담 관련 전화번호 (string)requiredPossible values: <= 30 characters

maintenance유지 보수 조건 (string)

specification제품 사양 (string)

digitalContents 디지털 콘텐츠(음원, 게임, 인터넷강의 등) 상품정보제공고시 (object)디지털 콘텐츠 상품정보제공고시
returnCostReason제품하자/오배송에 따른 청약철회 조항 (string)required제품하자ㆍ오배송 등에 따른 청약철회 등의 경우 청약철회 등의 기한 및 통신판매업자가 부담하는 반품 비용 등에 관한 정보. 미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래등에서의소비자보호에관한법률 등에 의한 제품의 하자 또는 오배송 등으로 인한 청약철회의 경우에는 상품 수령 후 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날로부터 30일 이내에 청약철회를 할 수 있으며, 반품 비용은 통신판매업자가 부담합니다.)

1 (상품상세 참조)

noRefundReason제품하자가 아닌 소비자의 단순변심에 따른 청약철회가 불가능한 경우 그 구체적 사유와 근거 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래 등에서의 소비자보호에 관한 법률 등에 의한 청약철회 제한 사유에 해당하는 경우 및 기타 객관적으로 이에 준하는 것으로 인정되는 경우 청약철회가 제한될 수 있습니다.)

1 (상품상세 참조)

qualityAssuranceStandard재화 등의 교환ㆍ반품ㆍ보증 조건 및 품질 보증 기준 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

compensationProcedure대금을 환불받기 위한 방법과 환불이 지연될 경우 지연배상금을 지급받을 수 있다는 사실 및 배상금 지급의 구체적인 조건·절차 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (주문취소 및 대금의 환불은 네이버페이 마이페이지에서 신청할 수 있으며, 전자상거래 등에서의 소비자보호에 관한 법률에 따라 소비자의 청약철회 후 판매자가 재화 등을 반환 받은 날로부터 3영업일 이내에 지급받은 대금의 환급을 정당한 사유 없이 지연하는 때에는 소비자는 지연기간에 대해서 연 15%의 지연배상금을 판매자에게 청구할 수 있습니다.)

1 (상품상세 참조)

troubleShootingContents소비자피해보상의 처리, 재화 등에 대한 불만 처리 및 소비자와 사업자 사이의 분쟁 처리에 관한 사항 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

producer제작자 또는 공급자 (string)requiredPossible values: <= 50 characters

termsOfUse이용 조건 (string)requiredPossible values: <= 500 characters

usePeriod이용 기간 (string)requiredPossible values: <= 200 characters

medium상품 제공 방식 (string)requiredCD, 다운로드, 실시간 스트리밍 등Possible values: <= 30 characters

requirement최소 시스템 사양, 필수 소프트웨어 (string)requiredPossible values: <= 200 characters

cancelationPolicy청약철회 및 계약의 해제, 해지에 따른 효과 (string)requiredPossible values: <= 500 characters

customerServicePhoneNumber소비자 상담 관련 전화번호 (string)requiredPossible values: <= 30 characters

giftCard 상품권/쿠폰 상품정보제공고시 (object)상품권/쿠폰 상품정보제공고시
returnCostReason제품하자/오배송에 따른 청약철회 조항 (string)required제품하자ㆍ오배송 등에 따른 청약철회 등의 경우 청약철회 등의 기한 및 통신판매업자가 부담하는 반품 비용 등에 관한 정보. 미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래등에서의소비자보호에관한법률 등에 의한 제품의 하자 또는 오배송 등으로 인한 청약철회의 경우에는 상품 수령 후 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날로부터 30일 이내에 청약철회를 할 수 있으며, 반품 비용은 통신판매업자가 부담합니다.)

1 (상품상세 참조)

noRefundReason제품하자가 아닌 소비자의 단순변심에 따른 청약철회가 불가능한 경우 그 구체적 사유와 근거 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래 등에서의 소비자보호에 관한 법률 등에 의한 청약철회 제한 사유에 해당하는 경우 및 기타 객관적으로 이에 준하는 것으로 인정되는 경우 청약철회가 제한될 수 있습니다.)

1 (상품상세 참조)

qualityAssuranceStandard재화 등의 교환ㆍ반품ㆍ보증 조건 및 품질 보증 기준 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

compensationProcedure대금을 환불받기 위한 방법과 환불이 지연될 경우 지연배상금을 지급받을 수 있다는 사실 및 배상금 지급의 구체적인 조건·절차 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (주문취소 및 대금의 환불은 네이버페이 마이페이지에서 신청할 수 있으며, 전자상거래 등에서의 소비자보호에 관한 법률에 따라 소비자의 청약철회 후 판매자가 재화 등을 반환 받은 날로부터 3영업일 이내에 지급받은 대금의 환급을 정당한 사유 없이 지연하는 때에는 소비자는 지연기간에 대해서 연 15%의 지연배상금을 판매자에게 청구할 수 있습니다.)

1 (상품상세 참조)

troubleShootingContents소비자피해보상의 처리, 재화 등에 대한 불만 처리 및 소비자와 사업자 사이의 분쟁 처리에 관한 사항 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

issuer발행자 (string)requiredPossible values: <= 20 characters

periodStartDate유효기간 시작일 (string<date>)Possible values: <= 200 characters

periodEndDate유효기간 종료일 (string<date>)Possible values: <= 200 characters

periodDays유효기간(구매일로부터 00일) (integer<int32>)Possible values: <= 200 characters

termsOfUse이용 조건 (string)required유효기간 경과 시 보상 기준, 사용 제한 품목 제한 및 기간 등Possible values: <= 200 characters

useStorePlace이용 가능 매장(장소) (string<useStorePlace, useStoreAddressId, useStoreUrl 셋 중 하나는 필수>)Possible values: <= 330 characters

useStoreAddressId이용 가능 매장(판매자 주소 ID) (integer<int64>)

useStoreUrl이용 가능 매장(URL) (string<useStorePlace, useStoreAddressId, useStoreUrl 셋 중 하나는 필수>)Possible values: <= 330 characters

refundPolicy잔액 환급 조건 (string)requiredPossible values: <= 500 characters

customerServicePhoneNumber소비자 상담 관련 전화번호 (string)requiredPossible values: <= 30 characters

mobileCoupon 모바일 쿠폰 상품정보제공고시 (object)모바일 쿠폰 상품정보제공고시
returnCostReason제품하자/오배송에 따른 청약철회 조항 (string)required제품하자ㆍ오배송 등에 따른 청약철회 등의 경우 청약철회 등의 기한 및 통신판매업자가 부담하는 반품 비용 등에 관한 정보. 미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래등에서의소비자보호에관한법률 등에 의한 제품의 하자 또는 오배송 등으로 인한 청약철회의 경우에는 상품 수령 후 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날로부터 30일 이내에 청약철회를 할 수 있으며, 반품 비용은 통신판매업자가 부담합니다.)

1 (상품상세 참조)

noRefundReason제품하자가 아닌 소비자의 단순변심에 따른 청약철회가 불가능한 경우 그 구체적 사유와 근거 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래 등에서의 소비자보호에 관한 법률 등에 의한 청약철회 제한 사유에 해당하는 경우 및 기타 객관적으로 이에 준하는 것으로 인정되는 경우 청약철회가 제한될 수 있습니다.)

1 (상품상세 참조)

qualityAssuranceStandard재화 등의 교환ㆍ반품ㆍ보증 조건 및 품질 보증 기준 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

compensationProcedure대금을 환불받기 위한 방법과 환불이 지연될 경우 지연배상금을 지급받을 수 있다는 사실 및 배상금 지급의 구체적인 조건·절차 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (주문취소 및 대금의 환불은 네이버페이 마이페이지에서 신청할 수 있으며, 전자상거래 등에서의 소비자보호에 관한 법률에 따라 소비자의 청약철회 후 판매자가 재화 등을 반환 받은 날로부터 3영업일 이내에 지급받은 대금의 환급을 정당한 사유 없이 지연하는 때에는 소비자는 지연기간에 대해서 연 15%의 지연배상금을 판매자에게 청구할 수 있습니다.)

1 (상품상세 참조)

troubleShootingContents소비자피해보상의 처리, 재화 등에 대한 불만 처리 및 소비자와 사업자 사이의 분쟁 처리에 관한 사항 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

issuer발행자 (string)requiredPossible values: <= 20 characters

usableCondition유효기간, 이용 조건 (string)required유효기간 경과 시 보상 기준 포함Possible values: <= 200 characters

usableStore이용 가능 매장 (string)requiredPossible values: <= 330 characters

cancelationPolicy환불 조건 및 방법 (string)requiredPossible values: <= 200 characters

customerServicePhoneNumber소비자 상담 관련 전화번호 (string)requiredPossible values: <= 30 characters

movieShow 영화/공연 상품정보제공고시 (object)영화/공연 상품정보제공고시
returnCostReason제품하자/오배송에 따른 청약철회 조항 (string)required제품하자ㆍ오배송 등에 따른 청약철회 등의 경우 청약철회 등의 기한 및 통신판매업자가 부담하는 반품 비용 등에 관한 정보. 미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래등에서의소비자보호에관한법률 등에 의한 제품의 하자 또는 오배송 등으로 인한 청약철회의 경우에는 상품 수령 후 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날로부터 30일 이내에 청약철회를 할 수 있으며, 반품 비용은 통신판매업자가 부담합니다.)

1 (상품상세 참조)

noRefundReason제품하자가 아닌 소비자의 단순변심에 따른 청약철회가 불가능한 경우 그 구체적 사유와 근거 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래 등에서의 소비자보호에 관한 법률 등에 의한 청약철회 제한 사유에 해당하는 경우 및 기타 객관적으로 이에 준하는 것으로 인정되는 경우 청약철회가 제한될 수 있습니다.)

1 (상품상세 참조)

qualityAssuranceStandard재화 등의 교환ㆍ반품ㆍ보증 조건 및 품질 보증 기준 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

compensationProcedure대금을 환불받기 위한 방법과 환불이 지연될 경우 지연배상금을 지급받을 수 있다는 사실 및 배상금 지급의 구체적인 조건·절차 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (주문취소 및 대금의 환불은 네이버페이 마이페이지에서 신청할 수 있으며, 전자상거래 등에서의 소비자보호에 관한 법률에 따라 소비자의 청약철회 후 판매자가 재화 등을 반환 받은 날로부터 3영업일 이내에 지급받은 대금의 환급을 정당한 사유 없이 지연하는 때에는 소비자는 지연기간에 대해서 연 15%의 지연배상금을 판매자에게 청구할 수 있습니다.)

1 (상품상세 참조)

troubleShootingContents소비자피해보상의 처리, 재화 등에 대한 불만 처리 및 소비자와 사업자 사이의 분쟁 처리에 관한 사항 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

sponsor주최 또는 기획 (string)required공연에 한함Possible values: <= 200 characters

actor주연 (string)required공연에 한함Possible values: <= 200 characters

rating관람 등급 (string)requiredPossible values: <= 200 characters

showTime상영ㆍ공연 시간 (string)requiredPossible values: <= 200 characters

showPlace상영ㆍ공연 장소 (string)requiredPossible values: <= 200 characters

cancelationCondition예매 취소 조건 (string)requiredPossible values: <= 200 characters

cancelationPolicy취소ㆍ환불 방법 (string)requiredPossible values: <= 200 characters

customerServicePhoneNumber소비자 상담 관련 전화번호 (string)requiredPossible values: <= 30 characters

etcService 기타 용역 상품정보제공고시 (object)기타 용역 상품정보제공고시
returnCostReason제품하자/오배송에 따른 청약철회 조항 (string)required제품하자ㆍ오배송 등에 따른 청약철회 등의 경우 청약철회 등의 기한 및 통신판매업자가 부담하는 반품 비용 등에 관한 정보. 미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래등에서의소비자보호에관한법률 등에 의한 제품의 하자 또는 오배송 등으로 인한 청약철회의 경우에는 상품 수령 후 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날로부터 30일 이내에 청약철회를 할 수 있으며, 반품 비용은 통신판매업자가 부담합니다.)

1 (상품상세 참조)

noRefundReason제품하자가 아닌 소비자의 단순변심에 따른 청약철회가 불가능한 경우 그 구체적 사유와 근거 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래 등에서의 소비자보호에 관한 법률 등에 의한 청약철회 제한 사유에 해당하는 경우 및 기타 객관적으로 이에 준하는 것으로 인정되는 경우 청약철회가 제한될 수 있습니다.)

1 (상품상세 참조)

qualityAssuranceStandard재화 등의 교환ㆍ반품ㆍ보증 조건 및 품질 보증 기준 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

compensationProcedure대금을 환불받기 위한 방법과 환불이 지연될 경우 지연배상금을 지급받을 수 있다는 사실 및 배상금 지급의 구체적인 조건·절차 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (주문취소 및 대금의 환불은 네이버페이 마이페이지에서 신청할 수 있으며, 전자상거래 등에서의 소비자보호에 관한 법률에 따라 소비자의 청약철회 후 판매자가 재화 등을 반환 받은 날로부터 3영업일 이내에 지급받은 대금의 환급을 정당한 사유 없이 지연하는 때에는 소비자는 지연기간에 대해서 연 15%의 지연배상금을 판매자에게 청구할 수 있습니다.)

1 (상품상세 참조)

troubleShootingContents소비자피해보상의 처리, 재화 등에 대한 불만 처리 및 소비자와 사업자 사이의 분쟁 처리에 관한 사항 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

serviceProvider서비스 제공 사업자 (string)requiredPossible values: <= 200 characters

certificateDetails법에 의한 인증ㆍ허가 등을 받았음을 확인할 수 있는 경우 그에 대한 사항 (string)requiredPossible values: <= 200 characters

usableCondition이용 조건 (string)required이용 가능 기간·장소, 추가 비용 등Possible values: <= 200 characters

cancelationStandard취소ㆍ중도해약ㆍ해지 조건 및 환불 기준 (string)requiredPossible values: <= 200 characters

cancelationPolicy취소ㆍ환불 방법 (string)requiredPossible values: <= 200 characters

customerServicePhoneNumber소비자 상담 관련 전화번호 (string)requiredPossible values: <= 30 characters

biochemistry 생활화학제품 상품정보제공고시 (object)생활화학제품 상품정보제공고시
returnCostReason제품하자/오배송에 따른 청약철회 조항 (string)required제품하자ㆍ오배송 등에 따른 청약철회 등의 경우 청약철회 등의 기한 및 통신판매업자가 부담하는 반품 비용 등에 관한 정보. 미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래등에서의소비자보호에관한법률 등에 의한 제품의 하자 또는 오배송 등으로 인한 청약철회의 경우에는 상품 수령 후 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날로부터 30일 이내에 청약철회를 할 수 있으며, 반품 비용은 통신판매업자가 부담합니다.)

1 (상품상세 참조)

noRefundReason제품하자가 아닌 소비자의 단순변심에 따른 청약철회가 불가능한 경우 그 구체적 사유와 근거 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래 등에서의 소비자보호에 관한 법률 등에 의한 청약철회 제한 사유에 해당하는 경우 및 기타 객관적으로 이에 준하는 것으로 인정되는 경우 청약철회가 제한될 수 있습니다.)

1 (상품상세 참조)

qualityAssuranceStandard재화 등의 교환ㆍ반품ㆍ보증 조건 및 품질 보증 기준 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

compensationProcedure대금을 환불받기 위한 방법과 환불이 지연될 경우 지연배상금을 지급받을 수 있다는 사실 및 배상금 지급의 구체적인 조건·절차 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (주문취소 및 대금의 환불은 네이버페이 마이페이지에서 신청할 수 있으며, 전자상거래 등에서의 소비자보호에 관한 법률에 따라 소비자의 청약철회 후 판매자가 재화 등을 반환 받은 날로부터 3영업일 이내에 지급받은 대금의 환급을 정당한 사유 없이 지연하는 때에는 소비자는 지연기간에 대해서 연 15%의 지연배상금을 판매자에게 청구할 수 있습니다.)

1 (상품상세 참조)

troubleShootingContents소비자피해보상의 처리, 재화 등에 대한 불만 처리 및 소비자와 사업자 사이의 분쟁 처리에 관한 사항 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

productName품목 및 제품명 (string)requiredPossible values: <= 200 characters

dosageForm용도 및 제형 (string)required표백제의 경우 계열을 함께 표시Possible values: <= 200 characters

packDate제조연월 (string<'yyyy-MM' 형식 입력>)Possible values: <= 300 characters

packDateText제조연월 직접 입력 (string<packDate를 입력하지 않은 경우에는 필수>)Possible values: <= 300 characters

expirationDate유통기한 (string<'yyyy-MM' 형식 입력>)해당 사항이 없으면 생략하고 expirationDateText에 '해당사항 없음' 입력Possible values: <= 300 characters

expirationDateText유통기한 직접 입력 (string<expirationDate를 입력하지 않은 경우에는 필수>)해당 사항이 없으면 '해당사항 없음' 입력Possible values: <= 300 characters

weight중량·용량·매수·크기 (string)requiredPossible values: <= 1500 characters

effect효능ㆍ효과 (string)required승인 대상 생활화학제품에 한함Possible values: <= 200 characters

importer수입자 (string<해당 사항이 없으면 이 요소를 삭제하고 전송합니다.>)수입제품에 한함Possible values: <= 200 characters

producer제조국 (string)requiredPossible values: <= 200 characters

manufacturer제조자(사) (string)requiredPossible values: <= 200 characters

childProtection어린이보호포장 대상 제품 여부 (string)requiredPossible values: <= 200 characters

chemicals제품에 사용된 화학 물질 명칭 (string)required｢안전확인대상 생활화학제품 지정 및 안전·표시기준｣ [별표6]에 따른 표시대상 화학물질로서 주요물질, 보존제, 알레르기반응가능물질 등의 명칭Possible values: <= 200 characters

caution사용상 주의사항 (string)requiredPossible values: <= 500 characters

safeCriterionNo안전기준적합확인신고번호 또는 안전확인대상 생활화학제품승인번호 (string)required화학제품안전법 시행일(경과조치 기간 포함) 이전에 생산·수입된 위해우려제품의 경우 종전 법에 따른 자가 검사번호를 표시Possible values: <= 200 characters

customerServicePhoneNumber소비자 상담 관련 전화번호 (string)requiredPossible values: <= 30 characters

biocidal 살생물제품 상품정보제공고시 (object)살생물제품 상품정보제공고시
returnCostReason제품하자/오배송에 따른 청약철회 조항 (string)required제품하자ㆍ오배송 등에 따른 청약철회 등의 경우 청약철회 등의 기한 및 통신판매업자가 부담하는 반품 비용 등에 관한 정보. 미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래등에서의소비자보호에관한법률 등에 의한 제품의 하자 또는 오배송 등으로 인한 청약철회의 경우에는 상품 수령 후 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날로부터 30일 이내에 청약철회를 할 수 있으며, 반품 비용은 통신판매업자가 부담합니다.)

1 (상품상세 참조)

noRefundReason제품하자가 아닌 소비자의 단순변심에 따른 청약철회가 불가능한 경우 그 구체적 사유와 근거 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래 등에서의 소비자보호에 관한 법률 등에 의한 청약철회 제한 사유에 해당하는 경우 및 기타 객관적으로 이에 준하는 것으로 인정되는 경우 청약철회가 제한될 수 있습니다.)

1 (상품상세 참조)

qualityAssuranceStandard재화 등의 교환ㆍ반품ㆍ보증 조건 및 품질 보증 기준 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

compensationProcedure대금을 환불받기 위한 방법과 환불이 지연될 경우 지연배상금을 지급받을 수 있다는 사실 및 배상금 지급의 구체적인 조건·절차 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (주문취소 및 대금의 환불은 네이버페이 마이페이지에서 신청할 수 있으며, 전자상거래 등에서의 소비자보호에 관한 법률에 따라 소비자의 청약철회 후 판매자가 재화 등을 반환 받은 날로부터 3영업일 이내에 지급받은 대금의 환급을 정당한 사유 없이 지연하는 때에는 소비자는 지연기간에 대해서 연 15%의 지연배상금을 판매자에게 청구할 수 있습니다.)

1 (상품상세 참조)

troubleShootingContents소비자피해보상의 처리, 재화 등에 대한 불만 처리 및 소비자와 사업자 사이의 분쟁 처리에 관한 사항 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

productName제품명 및 살생물제품유형 (string)requiredPossible values: <= 200 characters

weight중량 또는 용량 및 표준 사용량 (string)requiredPossible values: <= 200 characters

effect효능ㆍ효과 (string)requiredPossible values: <= 200 characters

rangeOfUse사용 대상자 및 사용 범위 (string)requiredPossible values: <= 200 characters

importer수입자 (string<해당 사항이 없으면 이 요소를 삭제하고 전송합니다.>)수입제품에 한함Possible values: <= 200 characters

producer제조국 (string)requiredPossible values: <= 200 characters

manufacturer제조자(사) (string)requiredPossible values: <= 200 characters

childProtection어린이보호포장 대상 제품 여부 (string)requiredPossible values: <= 200 characters

harmfulChemicalSubstance살생물물질, 나노물질, 유해화학물질(또는 중점관리물질)의 명칭 (string)requiredPossible values: <= 200 characters

maleficence제품 유해성ㆍ위해성 표시 (string)requiredPossible values: <= 200 characters

caution사용 방법 및 사용상 주의사항 (string)requiredPossible values: <= 500 characters

approvalNumber승인번호 (string)requiredPossible values: <= 200 characters

customerServicePhoneNumber소비자상담 전화번호 (string)requiredPossible values: <= 30 characters

expirationDate유통기한 (string<date>)'yyyy-MM-dd' 형식 입력Possible values: <= 300 characters

expirationDateText유통기한 직접 입력 (string)expirationDate를 입력하지 않은 경우에는 필수Possible values: <= 300 characters

cellPhone 휴대폰 상품정보제공고시 (object)휴대폰 상품정보제공고시
returnCostReason제품하자/오배송에 따른 청약철회 조항 (string)required제품하자ㆍ오배송 등에 따른 청약철회 등의 경우 청약철회 등의 기한 및 통신판매업자가 부담하는 반품 비용 등에 관한 정보. 미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래등에서의소비자보호에관한법률 등에 의한 제품의 하자 또는 오배송 등으로 인한 청약철회의 경우에는 상품 수령 후 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날로부터 30일 이내에 청약철회를 할 수 있으며, 반품 비용은 통신판매업자가 부담합니다.)

1 (상품상세 참조)

noRefundReason제품하자가 아닌 소비자의 단순변심에 따른 청약철회가 불가능한 경우 그 구체적 사유와 근거 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래 등에서의 소비자보호에 관한 법률 등에 의한 청약철회 제한 사유에 해당하는 경우 및 기타 객관적으로 이에 준하는 것으로 인정되는 경우 청약철회가 제한될 수 있습니다.)

1 (상품상세 참조)

qualityAssuranceStandard재화 등의 교환ㆍ반품ㆍ보증 조건 및 품질 보증 기준 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

compensationProcedure대금을 환불받기 위한 방법과 환불이 지연될 경우 지연배상금을 지급받을 수 있다는 사실 및 배상금 지급의 구체적인 조건·절차 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (주문취소 및 대금의 환불은 네이버페이 마이페이지에서 신청할 수 있으며, 전자상거래 등에서의 소비자보호에 관한 법률에 따라 소비자의 청약철회 후 판매자가 재화 등을 반환 받은 날로부터 3영업일 이내에 지급받은 대금의 환급을 정당한 사유 없이 지연하는 때에는 소비자는 지연기간에 대해서 연 15%의 지연배상금을 판매자에게 청구할 수 있습니다.)

1 (상품상세 참조)

troubleShootingContents소비자피해보상의 처리, 재화 등에 대한 불만 처리 및 소비자와 사업자 사이의 분쟁 처리에 관한 사항 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

itemName품목 (string)requiredPossible values: <= 50 characters

modelName모델명 (string)requiredPossible values: <= 50 characters

certificationTypeKC 인증정보 (string)required｢전기용품 및 생활용품 안전관리법｣에 따른 안전인증·안전확인·공급자적합성확인대상 제품 및 ｢전파법｣에 따른 적합인증·적합등록 대상 기자재에 한함Possible values: <= 50 characters

releaseDate동일 모델의 출시연월 (string<'yyyy-MM' 형식 입력>)Possible values: <= 300 characters

releaseDateText동일 모델 출시연월일 직접 입력 (string<releaseDate를 입력하지 않은 경우에는 필수>)Possible values: <= 300 characters

manufacturer제조자(사) (string)requiredPossible values: <= 200 characters

importer수입자 (string<해당 사항이 없으면 이 요소를 삭제하고 전송합니다.>)수입품의 경우 수입자를 함께 표시Possible values: <= 200 characters

producer제조국 (string)requiredPossible values: <= 200 characters

size크기 (string)requiredPossible values: <= 50 characters

weight무게 (string)requiredPossible values: <= 50 characters

telecomType이동통신사 (string)requiredPossible values: <= 50 characters

joinProcess가입절차 (string)requiredPossible values: <= 50 characters

extraBurden소비자의 추가적인 부담사항 (string)required가입비, 유심카드 구입비 등 추가로 부담하여야 할 금액, 부가서비스, 의무사용기간, 위약금 등Possible values: <= 50 characters

specification주요 사양 (string)requiredPossible values: <= 500 characters

warrantyPolicy품질 보증 기준 (string)requiredPossible values: <= 500 characters

afterServiceDirectorA/S 책임자와 전화번호 (string)requiredPossible values: <= 200 characters

etc 기타 재화 상품정보제공고시 (object)기타 재화 상품정보제공고시
returnCostReason제품하자/오배송에 따른 청약철회 조항 (string)required제품하자ㆍ오배송 등에 따른 청약철회 등의 경우 청약철회 등의 기한 및 통신판매업자가 부담하는 반품 비용 등에 관한 정보. 미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래등에서의소비자보호에관한법률 등에 의한 제품의 하자 또는 오배송 등으로 인한 청약철회의 경우에는 상품 수령 후 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날로부터 30일 이내에 청약철회를 할 수 있으며, 반품 비용은 통신판매업자가 부담합니다.)

1 (상품상세 참조)

noRefundReason제품하자가 아닌 소비자의 단순변심에 따른 청약철회가 불가능한 경우 그 구체적 사유와 근거 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (전자상거래 등에서의 소비자보호에 관한 법률 등에 의한 청약철회 제한 사유에 해당하는 경우 및 기타 객관적으로 이에 준하는 것으로 인정되는 경우 청약철회가 제한될 수 있습니다.)

1 (상품상세 참조)

qualityAssuranceStandard재화 등의 교환ㆍ반품ㆍ보증 조건 및 품질 보증 기준 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

compensationProcedure대금을 환불받기 위한 방법과 환불이 지연될 경우 지연배상금을 지급받을 수 있다는 사실 및 배상금 지급의 구체적인 조건·절차 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (주문취소 및 대금의 환불은 네이버페이 마이페이지에서 신청할 수 있으며, 전자상거래 등에서의 소비자보호에 관한 법률에 따라 소비자의 청약철회 후 판매자가 재화 등을 반환 받은 날로부터 3영업일 이내에 지급받은 대금의 환급을 정당한 사유 없이 지연하는 때에는 소비자는 지연기간에 대해서 연 15%의 지연배상금을 판매자에게 청구할 수 있습니다.)

1 (상품상세 참조)

troubleShootingContents소비자피해보상의 처리, 재화 등에 대한 불만 처리 및 소비자와 사업자 사이의 분쟁 처리에 관한 사항 (string)required미입력 시 상품상세 참조로 입력됩니다.

0 (소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.)

1 (상품상세 참조)

itemName품명 (string)requiredPossible values: <= 50 characters

modelName모델명 (string)requiredPossible values: <= 50 characters

certificateDetails법에 의한 인증, 허가 등을 받았음을 확인할 수 있는 경우 그에 대한 사항 (string<해당 사항이 없으면 이 요소를 삭제하고 전송합니다.>)Possible values: <= 500 characters

manufacturer제조자(사) (string)requiredPossible values: <= 200 characters

afterServiceDirectorA/S 책임자 (string)Possible values: <= 200 characters

customerServicePhoneNumber소비자 상담 관련 전화번호 (string<afterServiceDirector를 입력하지 않은 경우에는 필수>)Possible values: <= 30 characters

productAttributes 상품 속성 목록 (object)[]Array [

attributeSeq속성 ID (integer<int64>)

attributeValueSeq속성값 ID (integer<int64>)required

attributeRealValue속성 실제 값 (string)범위형인 경우 입력합니다. 범위형처럼 속성의 특정 값을 지정할 수 없을 때 사용합니다.

attributeRealValueUnitCode속성 실제 값 단위 코드 (string)범위형인 경우 입력합니다.

]

cultureCostIncomeDeductionYn문화비 소득공제 여부 (boolean)

customProductYn맞춤 제작 상품 여부 (boolean)

superDangolYn슈퍼단골 적립 여부 (boolean)

itselfProductionProductYn자체 제작 상품 여부 (boolean)

brandCertificationYn브랜드 인증 여부 (boolean)

seoInfo SEO(Search engine optimization) 정보 (object)SEO(Search engine optimization) 정보
pageTitle페이지 타이틀 (string)Possible values: <= 100 characters

metaDescription메타 정보 (string)Possible values: <= 160 characters

sellerTags 판매자 입력 태그 (object)[]Possible values: <= 4000 characters
Array [

code태그 ID (integer<int64>)태그 ID는 추천 태그 조회 API를 통해 확인할 수 있습니다.
입력한 태그 ID와 태그명이 일치하지 않는 경우 요청은 실패합니다.
추천 태그가 아닌 직접 입력 태그의 경우 태그 ID(code)는 입력하지 않습니다.

text태그명 (string)required

]

productSize 상품 사이즈 (object)사이즈 정보
sizeTypeNo사이즈 타입 번호 (integer<int64>)

sizeAttributes 상세 사이즈 정보 (object)[]requiredArray [

name상품 상세 사이즈 항목 이름 (string)required

sizeValues 사이즈 값 (object)[]requiredArray [

sizeValueTypeNo사이즈 값 타입 번호 (integer<int64>)required

value사이즈 값 (number<double>)required

]

]

models 패션모델 정보 (object)[]Array [

modelId패션모델 ID (integer<int64>)required

name패션모델명 (string)

height패션모델 키 (integer<int32>)

weight패션모델 몸무게 (integer<int32>)

top패션모델 상의 사이즈 (string)

bottom패션모델 하의 사이즈 (string)

shoe패션모델 신발 사이즈 (string)

]

unitCapacity 단위가격 (object)가격표시제에 의해 단위가격 표시의무 카테고리에 해당하는 경우 단위가격 정보를 반드시 입력해야 합니다.
unitPriceYn단위가격 사용 여부 (boolean)
true: totalCapacityValue, unitCapacity, indicationUnit 모두 필수 입력

false: totalCapacityValue, unitCapacity, indicationUnit 모두 입력 불가

totalCapacityValue총 용량 (number)판매 상품의 총 용량 또는 수량
(허용 범위: 0.001 ~ 999999999.000, 소수점 셋째 자리까지 입력 가능)

unitCapacity표시 용량 (integer<int32>)판매 상품의 단위가격 표시 용량 또는 수량
(허용 범위: 1 ~ 999)

indicationUnit표시 단위 (string)다음 단위를 지원합니다.(입력 문자열 기준, 영문 대/소문자 구분)

g, kg, ml, L, cm, m, 개, 개입, 매, 매입, 정, 캡슐, 구미, 포, 구

preOrder 예약구매 정보 (object)예약구매 정보
salePeriod 주문 기간 (object)required판매 기간 정보
saleStartDate판매 시작 일시 (string<date-time>)매 시각 00분으로만 설정 가능합니다. 'yyyy-MM-dd'T'HH:mm[:ss][.SSS]XXX' 형식으로 입력합니다.

saleEndDate판매 종료 일시 (string<date-time>)매 시각 59분으로만 설정 가능합니다. 'yyyy-MM-dd'T'HH:mm[:ss][.SSS]XXX' 형식으로 입력합니다.

preOrderEndSaleStatus예약구매 기간 종료 후 상품 판매 상태 (string)Possible values: [SALE_END, ON_SALE]

minOrderQty최소 주문 수량 (integer<int32>)Possible values: >= 5 and <= 99999999

deliveryStartDate발송 시작일 (string<date-time>)'yyyy-MM-dd'T'HH:mm[:ss][.SSS]XXX' 형식으로 입력합니다.

입력 내용 중 일자만 저장합니다.

입력 일자는 주문 종료일 이후, 발송 완료일 이전이어야 합니다.

deliveryEndDate발송 완료일 (string<date-time>)required'yyyy-MM-dd'T'HH:mm[:ss][.SSS]XXX' 형식으로 입력합니다.

입력 내용 중 일자만 저장합니다.

입력 일자는 주문 종료일로부터 90일 이내, 발송 시작일 이후여야 합니다.

giftPolicy 사은품 정책 (object)사은품 정책
presentContent사은품 (string)사은품 내용

customerBenefit 상품 고객 혜택 정보 응답 (object)응답용 상품 고객 혜택 정보
immediateDiscountPolicy 판매자 기본 할인 정책 (object)mobileDiscountMethod로 설정한 값은 무시됩니다. 추후 오류 응답이 반환될 수 있으므로 discountMethod를 사용하세요.
discountMethod 할인 혜택 (object)할인 혜택
value할인 값 (number)required할인 단위에 따른 값을 입력합니다.

예: 정율 10%이면 10, 정액 100원이면 100

Possible values: >= 1 and <= 10000000

unitType할인 단위 (string)required할인 단위 타입. PERCENT, WON만 입력 가능합니다.

PERCENT(정율), WON(정액)

Possible values: [PERCENT, WON, YEN, COUNT]

startDate할인 시작일 (string<date-time>)매 시각 00, 10, 20, 30, 40, 50분으로만 설정 가능합니다. 'yyyy-MM-dd'T'HH:mm[:ss][.SSS]XXX' 형식으로 입력합니다.

endDate할인 종료일 (string<date-time>)매 시각 09, 19, 29, 39, 49, 59분으로만 설정 가능합니다. 'yyyy-MM-dd'T'HH:mm[:ss][.SSS]XXX' 형식으로 입력합니다.

purchasePointPolicy 상품 구매 포인트 정책 (object)판매자 상품 구매 포인트 정책
value상품 구매 포인트 값 (number)required포인트 단위에 따른 값을 입력합니다.

예: 정율 10%이면 10, 정액 100원이면 100

unitType상품 구매 포인트 단위 (string)required상품 구매 포인트 단위 타입. PERCENT, WON만 입력 가능합니다.

PERCENT(정율), WON(정액)

Possible values: [PERCENT, WON, YEN, COUNT]

startDate적립 시작일 (string<date>)'yyyy-MM-dd' 형식 입력

endDate적립 종료일 (string<date>)시작일을 입력한 경우 필수. 'yyyy-MM-dd' 형식 입력.

reviewPointPolicy 구매평 포인트 정책 (object)판매자 상품 리뷰 포인트 정책
textReviewPoint텍스트 리뷰 포인트 (integer<int32>)텍스트 리뷰 작성 시 적립되는 네이버페이 포인트

photoVideoReviewPoint포토/동영상 리뷰 포인트 (integer<int32>)포토/동영상 리뷰 작성 시 적립되는 네이버페이 포인트

afterUseTextReviewPoint한 달 사용 텍스트 리뷰 포인트 (integer<int32>)한 달 사용 텍스트 리뷰 작성 시 적립되는 네이버페이 포인트

afterUsePhotoVideoReviewPoint한 달 사용 포토/동영상 리뷰 포인트 (integer<int32>)한 달 사용 포토/동영상 리뷰 작성 시 적립되는 네이버페이 포인트

storeMemberReviewPoint알림받기 동의/소식알림(톡톡친구) 회원 리뷰 추가 적립 포인트 (integer<int32>)알림받기 동의/톡톡친구 회원이 상품 리뷰, 한 달 사용 리뷰 작성 시 추가 적립되는 네이버페이 포인트

텍스트 리뷰나 포토/동영상 리뷰 구분 없이 1회만 지급

startDate적립 시작일 (string<date>)네이버페이 포인트 유효기간 시작일. 'yyyy-MM-dd' 형식 입력.

endDate적립 종료일 (string<date>)네이버페이 포인트 유효기간 종료일. 시작일을 입력한 경우 필수. 'yyyy-MM-dd' 형식 입력.

freeInterestPolicy 무이자 할부 정책 (object)무이자 할부 정책
value무이자 할부 개월 수 (integer<int32>)required

startDate무이자 할부 시작일 (string<date>)'yyyy-MM-dd' 형식 입력

endDate무이자 할부 종료일 (string<date>)시작일을 입력한 경우 필수. 'yyyy-MM-dd' 형식 입력.

giftPolicy 사은품 정책 (object)사은품 정책
presentContent사은품 (string)사은품 내용

multiPurchaseDiscountPolicy 복수 구매 할인 정책 (object)판매자 복수 구매 할인 정책
discountMethod 복수 구매 할인 혜택 (object)복수 구매 할인 혜택
value할인 값 (number)required할인 단위에 따른 값을 입력합니다.

예: 정율 10%이면 10, 정액 100원이면 100

Possible values: >= 1 and <= 10000000

unitType할인 단위 (string)required할인 단위 타입. PERCENT, WON만 입력 가능합니다.

PERCENT(정율), WON(정액)

Possible values: [PERCENT, WON, YEN, COUNT]

startDate할인 시작일 (string<date>)복수 구매 할인의 경우 날짜로만 지정됩니다. 'yyyy-MM-dd' 형식으로 입력합니다.

endDate할인 종료일 (string<date>)복수 구매 할인의 경우 날짜로만 지정됩니다. 'yyyy-MM-dd' 형식으로 입력합니다.

orderValue주문 금액(수량) 값 (number)required

orderValueUnitType주문 금액(수량) 단위 (string)requiredCOUNT, WON만 입력 가능합니다.

COUNT(개수), WON(정액)

Possible values: [PERCENT, WON, YEN, COUNT]

reservedDiscountPolicy 예약 할인 정책 (object)예약 할인 정책
discountMethod 예약 할인 혜택 (object)예약 할인 혜택
value할인 값 (number)required할인 단위에 따른 값을 입력합니다.

예: 정율 10%이면 10, 정액 100원이면 100

Possible values: >= 1 and <= 10000000

unitType할인 단위 (string)required할인 단위 타입. PERCENT, WON만 입력 가능합니다.

PERCENT(정율), WON(정액)

Possible values: [PERCENT, WON, YEN, COUNT]

startDate할인 시작일 (string<date-time>)required매 시각 00, 10, 20, 30, 40, 50분으로만 설정 가능합니다. 'yyyy-MM-dd'T'HH:mm[:ss][.SSS]XXX' 형식으로 입력합니다.

endDate할인 종료일 (string<date-time>)required매 시각 09, 19, 29, 39, 49, 59분으로만 설정 가능합니다. 'yyyy-MM-dd'T'HH:mm[:ss][.SSS]XXX' 형식으로 입력합니다.

promotionDiscountPolicies 프로모션 할인 정책 (object)[]Array [

promotionName프로모션명 (string)

discountMethod 프로모션 할인 혜택 (object)프로모션 할인 혜택
value할인 값 (number)required

unitType할인 단위 (string)requiredPossible values: [PERCENT, WON, YEN, COUNT]

startDate할인 시작일 (string<date-time>)

endDate할인 종료일 (string<date-time>)

]

원상품 정보 구조체
{
  "statusType": "WAIT",
  "saleType": "NEW",
  "leafCategoryId": "string",
  "name": "string",
  "detailContent": "string",
  "images": {
    "representativeImage": {
      "url": "string"
    },
    "optionalImages": [
      {
        "url": "string"
      }
    ]
  },
  "saleStartDate": "2024-07-29T15:51:28.071Z",
  "saleEndDate": "2024-07-29T15:51:28.071Z",
  "salePrice": 0,
  "stockQuantity": 0,
  "deliveryInfo": {
    "deliveryType": "DELIVERY",
    "deliveryAttributeType": "NORMAL",
    "deliveryCompany": "string",
    "outboundLocationId": "string",
    "deliveryBundleGroupUsable": true,
    "deliveryBundleGroupId": 0,
    "quickServiceAreas": [
      "SEOUL"
    ],
    "visitAddressId": 0,
    "deliveryFee": {
      "deliveryFeeType": "FREE",
      "baseFee": 0,
      "freeConditionalAmount": 0,
      "repeatQuantity": 0,
      "secondBaseQuantity": 0,
      "secondExtraFee": 0,
      "thirdBaseQuantity": 0,
      "thirdExtraFee": 0,
      "deliveryFeePayType": "COLLECT",
      "deliveryFeeByArea": {
        "deliveryAreaType": "AREA_2",
        "area2extraFee": 0,
        "area3extraFee": 0
      },
      "differentialFeeByArea": "string"
    },
    "claimDeliveryInfo": {
      "returnDeliveryCompanyPriorityType": "PRIMARY",
      "returnDeliveryFee": 0,
      "exchangeDeliveryFee": 0,
      "shippingAddressId": 0,
      "returnAddressId": 0,
      "freeReturnInsuranceYn": true
    },
    "installation": true,
    "installationFee": true,
    "expectedDeliveryPeriodType": "ETC",
    "expectedDeliveryPeriodDirectInput": "string",
    "todayStockQuantity": 0,
    "customProductAfterOrderYn": true,
    "hopeDeliveryGroupId": 0,
    "businessCustomsClearanceSaleYn": true
  },
  "productLogistics": [
    {
      "logisticsCompanyId": "string"
    }
  ],
  "detailAttribute": {
    "naverShoppingSearchInfo": {
      "modelId": 0,
      "modelName": "string",
      "manufacturerName": "string",
      "brandId": 0,
      "brandName": "string",
      "catalogMatchingYn": true,
      "matchedCatalogId": 0
    },
    "manufactureDefineNo": "string",
    "afterServiceInfo": {
      "afterServiceTelephoneNumber": "string",
      "afterServiceGuideContent": "string"
    },
    "purchaseQuantityInfo": {
      "minPurchaseQuantity": 0,
      "maxPurchaseQuantityPerId": 0,
      "maxPurchaseQuantityPerOrder": 0
    },
    "originAreaInfo": {
      "originAreaCode": "string",
      "importer": "string",
      "content": "string",
      "plural": true
    },
    "sellerCodeInfo": {
      "sellerManagementCode": "string",
      "sellerBarcode": "string",
      "sellerCustomCode1": "string",
      "sellerCustomCode2": "string"
    },
    "skuYn": true,
    "optionInfo": {
      "simpleOptionSortType": "CREATE",
      "optionSimple": [
        {
          "id": 0,
          "groupName": "string",
          "name": "string",
          "usable": true
        }
      ],
      "optionCustom": [
        {
          "id": 0,
          "groupName": "string",
          "name": "string",
          "usable": true
        }
      ],
      "optionCombinationSortType": "CREATE",
      "optionCombinationGroupNames": {
        "optionGroupName1": "string",
        "optionGroupName2": "string",
        "optionGroupName3": "string",
        "optionGroupName4": "string"
      },
      "optionCombinations": [
        {
          "id": 0,
          "stockQuantity": 0,
          "price": 0,
          "usable": true,
          "optionName1": "string",
          "optionName2": "string",
          "optionName3": "string",
          "optionName4": "string",
          "sellerManagerCode": "string",
          "skuYn": true
        }
      ],
      "standardOptionGroups": [
        {
          "groupName": "string",
          "standardOptionAttributes": [
            {
              "attributeId": 0,
              "attributeValueId": 0,
              "attributeValueName": "string",
              "imageUrls": [
                "string"
              ]
            }
          ]
        }
      ],
      "optionStandards": [
        {
          "id": 0,
          "stockQuantity": 0,
          "usable": true,
          "optionName1": "string",
          "optionName2": "string",
          "sellerManagerCode": "string",
          "skuYn": true
        }
      ],
      "useStockManagement": true,
      "optionDeliveryAttributes": [
        "string"
      ]
    },
    "supplementProductInfo": {
      "sortType": "CREATE",
      "supplementProducts": [
        {
          "id": 0,
          "groupName": "string",
          "name": "string",
          "price": 0,
          "skuStatusType": "REQUEST",
          "stockQuantity": 0,
          "sellerManagementCode": "string",
          "usable": true
        }
      ]
    },
    "purchaseReviewInfo": {
      "purchaseReviewExposure": true,
      "reviewUnExposeReason": "string"
    },
    "isbnInfo": {
      "isbn13": "string",
      "issn": "string",
      "independentPublicationYn": true
    },
    "bookInfo": {
      "publishDay": "string",
      "publisher": {
        "code": "string",
        "text": "string"
      },
      "authors": [
        {
          "code": "string",
          "text": "string"
        }
      ],
      "illustrators": [
        {
          "code": "string",
          "text": "string"
        }
      ],
      "translators": [
        {
          "code": "string",
          "text": "string"
        }
      ]
    },
    "eventPhraseCont": "string",
    "manufactureDate": "2024-07-29",
    "releaseDate": "2024-07-29",
    "validDate": "2024-07-29",
    "taxType": "TAX",
    "customsTaxType": "NOT_APPLICABLE",
    "productCertificationInfos": [
      {
        "certificationInfoId": 0,
        "certificationKindType": "KC_CERTIFICATION",
        "name": "string",
        "certificationNumber": "string",
        "certificationMark": true,
        "companyName": "string",
        "certificationDate": "2024-07-29"
      }
    ],
    "certificationTargetExcludeContent": {
      "childCertifiedProductExclusionYn": true,
      "kcExemptionType": "OVERSEAS",
      "kcCertifiedProductExclusionYn": "FALSE",
      "greenCertifiedProductExclusionYn": true,
      "chemicalCertifiedProductExclusionYn": true
    },
    "sellerCommentContent": "string",
    "sellerCommentUsable": true,
    "minorPurchasable": true,
    "ecoupon": {
      "periodType": "FIXED",
      "validStartDate": "2024-07-29",
      "validEndDate": "2024-07-29",
      "periodDays": 0,
      "publicInformationContents": "string",
      "contactInformationContents": "string",
      "usePlaceType": "PLACE",
      "usePlaceContents": "string",
      "restrictCart": true,
      "siteName": "string"
    },
    "productInfoProvidedNotice": {
      "productInfoProvidedNoticeType": "WEAR",
      "wear": {
        "returnCostReason": "string",
        "noRefundReason": "string",
        "qualityAssuranceStandard": "string",
        "compensationProcedure": "string",
        "troubleShootingContents": "string",
        "material": "string",
        "color": "string",
        "size": "string",
        "manufacturer": "string",
        "caution": "string",
        "packDate": "string",
        "packDateText": "string",
        "warrantyPolicy": "string",
        "afterServiceDirector": "string"
      },
      "shoes": {
        "returnCostReason": "string",
        "noRefundReason": "string",
        "qualityAssuranceStandard": "string",
        "compensationProcedure": "string",
        "troubleShootingContents": "string",
        "material": "string",
        "color": "string",
        "size": "string",
        "height": "string",
        "manufacturer": "string",
        "caution": "string",
        "warrantyPolicy": "string",
        "afterServiceDirector": "string"
      },
      "bag": {
        "returnCostReason": "string",
        "noRefundReason": "string",
        "qualityAssuranceStandard": "string",
        "compensationProcedure": "string",
        "troubleShootingContents": "string",
        "type": "string",
        "material": "string",
        "color": "string",
        "size": "string",
        "manufacturer": "string",
        "caution": "string",
        "warrantyPolicy": "string",
        "afterServiceDirector": "string"
      },
      "fashionItems": {
        "returnCostReason": "string",
        "noRefundReason": "string",
        "qualityAssuranceStandard": "string",
        "compensationProcedure": "string",
        "troubleShootingContents": "string",
        "type": "string",
        "material": "string",
        "size": "string",
        "manufacturer": "string",
        "caution": "string",
        "warrantyPolicy": "string",
        "afterServiceDirector": "string"
      },
      "sleepingGear": {
        "returnCostReason": "string",
        "noRefundReason": "string",
        "qualityAssuranceStandard": "string",
        "compensationProcedure": "string",
        "troubleShootingContents": "string",
        "material": "string",
        "color": "string",
        "size": "string",
        "components": "string",
        "manufacturer": "string",
        "caution": "string",
        "warrantyPolicy": "string",
        "afterServiceDirector": "string"
      },
      "furniture": {
        "returnCostReason": "string",
        "noRefundReason": "string",
        "qualityAssuranceStandard": "string",
        "compensationProcedure": "string",
        "troubleShootingContents": "string",
        "itemName": "string",
        "certificationType": "string",
        "color": "string",
        "components": "string",
        "material": "string",
        "manufacturer": "string",
        "importer": "string",
        "producer": "string",
        "size": "string",
        "installedCharge": "string",
        "warrantyPolicy": "string",
        "refurb": "string",
        "afterServiceDirector": "string"
      },
      "imageAppliances": {
        "returnCostReason": "string",
        "noRefundReason": "string",
        "qualityAssuranceStandard": "string",
        "compensationProcedure": "string",
        "troubleShootingContents": "string",
        "itemName": "string",
        "modelName": "string",
        "certificationType": "string",
        "ratedVoltage": "string",
        "powerConsumption": "string",
        "energyEfficiencyRating": "string",
        "releaseDate": "string",
        "releaseDateText": "string",
        "manufacturer": "string",
        "size": "string",
        "additionalCost": "string",
        "displaySpecification": "string",
        "warrantyPolicy": "string",
        "afterServiceDirector": "string"
      },
      "homeAppliances": {
        "returnCostReason": "string",
        "noRefundReason": "string",
        "qualityAssuranceStandard": "string",
        "compensationProcedure": "string",
        "troubleShootingContents": "string",
        "itemName": "string",
        "modelName": "string",
        "certificationType": "string",
        "ratedVoltage": "string",
        "powerConsumption": "string",
        "energyEfficiencyRating": "string",
        "releaseDate": "string",
        "releaseDateText": "string",
        "manufacturer": "string",
        "size": "string",
        "additionalCost": "string",
        "warrantyPolicy": "string",
        "afterServiceDirector": "string"
      },
      "seasonAppliances": {
        "returnCostReason": "string",
        "noRefundReason": "string",
        "qualityAssuranceStandard": "string",
        "compensationProcedure": "string",
        "troubleShootingContents": "string",
        "itemName": "string",
        "modelName": "string",
        "certificationType": "string",
        "ratedVoltage": "string",
        "powerConsumption": "string",
        "energyEfficiencyRating": "string",
        "releaseDate": {
          "year": 0,
          "month": "JANUARY",
          "monthValue": 0,
          "leapYear": true
        },
        "releaseDateText": "string",
        "manufacturer": "string",
        "size": "string",
        "area": "string",
        "installedCharge": "string",
        "warrantyPolicy": "string",
        "afterServiceDirector": "string"
      },
      "officeAppliances": {
        "returnCostReason": "string",
        "noRefundReason": "string",
        "qualityAssuranceStandard": "string",
        "compensationProcedure": "string",
        "troubleShootingContents": "string",
        "itemName": "string",
        "modelName": "string",
        "certificationType": "string",
        "ratedVoltage": "string",
        "powerConsumption": "string",
        "energyEfficiencyRating": "string",
        "releaseDate": {
          "year": 0,
          "month": "JANUARY",
          "monthValue": 0,
          "leapYear": true
        },
        "releaseDateText": "string",
        "manufacturer": "string",
        "size": "string",
        "weight": "string",
        "specification": "string",
        "warrantyPolicy": "string",
        "afterServiceDirector": "string"
      },
      "opticsAppliances": {
        "returnCostReason": "string",
        "noRefundReason": "string",
        "qualityAssuranceStandard": "string",
        "compensationProcedure": "string",
        "troubleShootingContents": "string",
        "itemName": "string",
        "modelName": "string",
        "certificationType": "string",
        "releaseDate": "string",
        "releaseDateText": "string",
        "manufacturer": "string",
        "size": "string",
        "weight": "string",
        "specification": "string",
        "warrantyPolicy": "string",
        "afterServiceDirector": "string"
      },
      "microElectronics": {
        "returnCostReason": "string",
        "noRefundReason": "string",
        "qualityAssuranceStandard": "string",
        "compensationProcedure": "string",
        "troubleShootingContents": "string",
        "itemName": "string",
        "modelName": "string",
        "certificationType": "string",
        "ratedVoltage": "string",
        "powerConsumption": "string",
        "releaseDate": "string",
        "releaseDateText": "string",
        "manufacturer": "string",
        "size": "string",
        "weight": "string",
        "specification": "string",
        "warrantyPolicy": "string",
        "afterServiceDirector": "string"
      },
      "navigation": {
        "returnCostReason": "string",
        "noRefundReason": "string",
        "qualityAssuranceStandard": "string",
        "compensationProcedure": "string",
        "troubleShootingContents": "string",
        "itemName": "string",
        "modelName": "string",
        "certificationType": "string",
        "ratedVoltage": "string",
        "powerConsumption": "string",
        "releaseDate": "string",
        "releaseDateText": "string",
        "manufacturer": "string",
        "size": "string",
        "weight": "string",
        "specification": "string",
        "updateCost": "string",
        "freeCostPeriod": "string",
        "warrantyPolicy": "string",
        "afterServiceDirector": "string"
      },
      "carArticles": {
        "returnCostReason": "string",
        "noRefundReason": "string",
        "qualityAssuranceStandard": "string",
        "compensationProcedure": "string",
        "troubleShootingContents": "string",
        "itemName": "string",
        "modelName": "string",
        "releaseDate": "string",
        "releaseDateText": "string",
        "certificationType": "string",
        "caution": "string",
        "manufacturer": "string",
        "size": "string",
        "applyModel": "string",
        "warrantyPolicy": "string",
        "roadWorthyCertification": "string",
        "afterServiceDirector": "string"
      },
      "medicalAppliances": {
        "returnCostReason": "string",
        "noRefundReason": "string",
        "qualityAssuranceStandard": "string",
        "compensationProcedure": "string",
        "troubleShootingContents": "string",
        "itemName": "string",
        "modelName": "string",
        "licenceNo": "string",
        "advertisingCertificationType": "string",
        "ratedVoltage": "string",
        "powerConsumption": "string",
        "releaseDate": "string",
        "releaseDateText": "string",
        "manufacturer": "string",
        "purpose": "string",
        "usage": "string",
        "caution": "string",
        "warrantyPolicy": "string",
        "afterServiceDirector": "string"
      },
      "kitchenUtensils": {
        "returnCostReason": "string",
        "noRefundReason": "string",
        "qualityAssuranceStandard": "string",
        "compensationProcedure": "string",
        "troubleShootingContents": "string",
        "itemName": "string",
        "modelName": "string",
        "material": "string",
        "component": "string",
        "size": "string",
        "releaseDate": "string",
        "releaseDateText": "string",
        "manufacturer": "string",
        "producer": "string",
        "importDeclaration": true,
        "warrantyPolicy": "string",
        "afterServiceDirector": "string"
      },
      "cosmetic": {
        "returnCostReason": "string",
        "noRefundReason": "string",
        "qualityAssuranceStandard": "string",
        "compensationProcedure": "string",
        "troubleShootingContents": "string",
        "capacity": "string",
        "specification": "string",
        "expirationDate": "string",
        "expirationDateText": "string",
        "usage": "string",
        "manufacturer": "string",
        "producer": "string",
        "distributor": "string",
        "customizedDistributor": "string",
        "mainIngredient": "string",
        "certificationType": "string",
        "caution": "string",
        "warrantyPolicy": "string",
        "customerServicePhoneNumber": "string"
      },
      "jewellery": {
        "returnCostReason": "string",
        "noRefundReason": "string",
        "qualityAssuranceStandard": "string",
        "compensationProcedure": "string",
        "troubleShootingContents": "string",
        "material": "string",
        "purity": "string",
        "bandMaterial": "string",
        "weight": "string",
        "manufacturer": "string",
        "producer": "string",
        "size": "string",
        "caution": "string",
        "specification": "string",
        "provideWarranty": "string",
        "warrantyPolicy": "string",
        "afterServiceDirector": "string"
      },
      "food": {
        "returnCostReason": "string",
        "noRefundReason": "string",
        "qualityAssuranceStandard": "string",
        "compensationProcedure": "string",
        "troubleShootingContents": "string",
        "foodItem": "string",
        "weight": "string",
        "amount": "string",
        "size": "string",
        "packDate": "2024-07-29",
        "packDateText": "string",
        "consumptionDate": "2024-07-29",
        "consumptionDateText": "string",
        "producer": "string",
        "relevantLawContent": "string",
        "productComposition": "string",
        "keep": "string",
        "adCaution": "string",
        "customerServicePhoneNumber": "string"
      },
      "generalFood": {
        "returnCostReason": "string",
        "noRefundReason": "string",
        "qualityAssuranceStandard": "string",
        "compensationProcedure": "string",
        "troubleShootingContents": "string",
        "productName": "string",
        "foodType": "string",
        "producer": "string",
        "location": "string",
        "packDate": "2024-07-29",
        "packDateText": "string",
        "consumptionDate": "2024-07-29",
        "consumptionDateText": "string",
        "weight": "string",
        "amount": "string",
        "ingredients": "string",
        "nutritionFacts": "string",
        "geneticallyModified": true,
        "consumerSafetyCaution": "string",
        "importDeclarationCheck": true,
        "customerServicePhoneNumber": "string"
      },
      "dietFood": {
        "returnCostReason": "string",
        "noRefundReason": "string",
        "qualityAssuranceStandard": "string",
        "compensationProcedure": "string",
        "troubleShootingContents": "string",
        "productName": "string",
        "producer": "string",
        "location": "string",
        "consumptionDate": "2024-07-29",
        "consumptionDateText": "string",
        "storageMethod": "string",
        "weight": "string",
        "amount": "string",
        "ingredients": "string",
        "nutritionFacts": "string",
        "specification": "string",
        "cautionAndSideEffect": "string",
        "nonMedicinalUsesMessage": "string",
        "geneticallyModified": true,
        "importDeclarationCheck": true,
        "consumerSafetyCaution": "string",
        "customerServicePhoneNumber": "string"
      },
      "kids": {
        "returnCostReason": "string",
        "noRefundReason": "string",
        "qualityAssuranceStandard": "string",
        "compensationProcedure": "string",
        "troubleShootingContents": "string",
        "itemName": "string",
        "modelName": "string",
        "certificationType": "string",
        "size": "string",
        "weight": "string",
        "color": "string",
        "material": "string",
        "recommendedAge": "string",
        "releaseDate": "string",
        "releaseDateText": "string",
        "manufacturer": "string",
        "caution": "string",
        "warrantyPolicy": "string",
        "afterServiceDirector": "string",
        "numberLimit": "string"
      },
      "musicalInstrument": {
        "returnCostReason": "string",
        "noRefundReason": "string",
        "qualityAssuranceStandard": "string",
        "compensationProcedure": "string",
        "troubleShootingContents": "string",
        "itemName": "string",
        "modelName": "string",
        "size": "string",
        "color": "string",
        "material": "string",
        "components": "string",
        "releaseDate": "string",
        "releaseDateText": "string",
        "manufacturer": "string",
        "detailContent": "string",
        "warrantyPolicy": "string",
        "afterServiceDirector": "string"
      },
      "sportsEquipment": {
        "returnCostReason": "string",
        "noRefundReason": "string",
        "qualityAssuranceStandard": "string",
        "compensationProcedure": "string",
        "troubleShootingContents": "string",
        "itemName": "string",
        "modelName": "string",
        "certificationType": "string",
        "size": "string",
        "weight": "string",
        "color": "string",
        "material": "string",
        "components": "string",
        "releaseDate": {
          "year": 0,
          "month": "JANUARY",
          "monthValue": 0,
          "leapYear": true
        },
        "releaseDateText": "string",
        "manufacturer": "string",
        "detailContent": "string",
        "warrantyPolicy": "string",
        "afterServiceDirector": "string"
      },
      "books": {
        "returnCostReason": "string",
        "noRefundReason": "string",
        "qualityAssuranceStandard": "string",
        "compensationProcedure": "string",
        "troubleShootingContents": "string",
        "title": "string",
        "author": "string",
        "publisher": "string",
        "size": "string",
        "pages": "string",
        "components": "string",
        "publishDate": "2024-07-29",
        "publishDateText": "string",
        "description": "string"
      },
      "rentalEtc": {
        "returnCostReason": "string",
        "noRefundReason": "string",
        "qualityAssuranceStandard": "string",
        "compensationProcedure": "string",
        "troubleShootingContents": "string",
        "itemName": "string",
        "modelName": "string",
        "ownershipTransferCondition": "string",
        "payingForLossOrDamage": "string",
        "refundPolicyForCancel": "string",
        "customerServicePhoneNumber": "string"
      },
      "rentalHa": {
        "returnCostReason": "string",
        "noRefundReason": "string",
        "qualityAssuranceStandard": "string",
        "compensationProcedure": "string",
        "troubleShootingContents": "string",
        "itemName": "string",
        "modelName": "string",
        "ownershipTransferCondition": "string",
        "payingForLossOrDamage": "string",
        "refundPolicyForCancel": "string",
        "customerServicePhoneNumber": "string",
        "maintenance": "string",
        "specification": "string"
      },
      "digitalContents": {
        "returnCostReason": "string",
        "noRefundReason": "string",
        "qualityAssuranceStandard": "string",
        "compensationProcedure": "string",
        "troubleShootingContents": "string",
        "producer": "string",
        "termsOfUse": "string",
        "usePeriod": "string",
        "medium": "string",
        "requirement": "string",
        "cancelationPolicy": "string",
        "customerServicePhoneNumber": "string"
      },
      "giftCard": {
        "returnCostReason": "string",
        "noRefundReason": "string",
        "qualityAssuranceStandard": "string",
        "compensationProcedure": "string",
        "troubleShootingContents": "string",
        "issuer": "string",
        "periodStartDate": "2024-07-29",
        "periodEndDate": "2024-07-29",
        "periodDays": 0,
        "termsOfUse": "string",
        "useStorePlace": "string",
        "useStoreAddressId": 0,
        "useStoreUrl": "string",
        "refundPolicy": "string",
        "customerServicePhoneNumber": "string"
      },
      "mobileCoupon": {
        "returnCostReason": "string",
        "noRefundReason": "string",
        "qualityAssuranceStandard": "string",
        "compensationProcedure": "string",
        "troubleShootingContents": "string",
        "issuer": "string",
        "usableCondition": "string",
        "usableStore": "string",
        "cancelationPolicy": "string",
        "customerServicePhoneNumber": "string"
      },
      "movieShow": {
        "returnCostReason": "string",
        "noRefundReason": "string",
        "qualityAssuranceStandard": "string",
        "compensationProcedure": "string",
        "troubleShootingContents": "string",
        "sponsor": "string",
        "actor": "string",
        "rating": "string",
        "showTime": "string",
        "showPlace": "string",
        "cancelationCondition": "string",
        "cancelationPolicy": "string",
        "customerServicePhoneNumber": "string"
      },
      "etcService": {
        "returnCostReason": "string",
        "noRefundReason": "string",
        "qualityAssuranceStandard": "string",
        "compensationProcedure": "string",
        "troubleShootingContents": "string",
        "serviceProvider": "string",
        "certificateDetails": "string",
        "usableCondition": "string",
        "cancelationStandard": "string",
        "cancelationPolicy": "string",
        "customerServicePhoneNumber": "string"
      },
      "biochemistry": {
        "returnCostReason": "string",
        "noRefundReason": "string",
        "qualityAssuranceStandard": "string",
        "compensationProcedure": "string",
        "troubleShootingContents": "string",
        "productName": "string",
        "dosageForm": "string",
        "packDate": "string",
        "packDateText": "string",
        "expirationDate": "string",
        "expirationDateText": "string",
        "weight": "string",
        "effect": "string",
        "importer": "string",
        "producer": "string",
        "manufacturer": "string",
        "childProtection": "string",
        "chemicals": "string",
        "caution": "string",
        "safeCriterionNo": "string",
        "customerServicePhoneNumber": "string"
      },
      "biocidal": {
        "returnCostReason": "string",
        "noRefundReason": "string",
        "qualityAssuranceStandard": "string",
        "compensationProcedure": "string",
        "troubleShootingContents": "string",
        "productName": "string",
        "weight": "string",
        "effect": "string",
        "rangeOfUse": "string",
        "importer": "string",
        "producer": "string",
        "manufacturer": "string",
        "childProtection": "string",
        "harmfulChemicalSubstance": "string",
        "maleficence": "string",
        "caution": "string",
        "approvalNumber": "string",
        "customerServicePhoneNumber": "string",
        "expirationDate": "2024-07-29",
        "expirationDateText": "string"
      },
      "cellPhone": {
        "returnCostReason": "string",
        "noRefundReason": "string",
        "qualityAssuranceStandard": "string",
        "compensationProcedure": "string",
        "troubleShootingContents": "string",
        "itemName": "string",
        "modelName": "string",
        "certificationType": "string",
        "releaseDate": "string",
        "releaseDateText": "string",
        "manufacturer": "string",
        "importer": "string",
        "producer": "string",
        "size": "string",
        "weight": "string",
        "telecomType": "string",
        "joinProcess": "string",
        "extraBurden": "string",
        "specification": "string",
        "warrantyPolicy": "string",
        "afterServiceDirector": "string"
      },
      "etc": {
        "returnCostReason": "string",
        "noRefundReason": "string",
        "qualityAssuranceStandard": "string",
        "compensationProcedure": "string",
        "troubleShootingContents": "string",
        "itemName": "string",
        "modelName": "string",
        "certificateDetails": "string",
        "manufacturer": "string",
        "afterServiceDirector": "string",
        "customerServicePhoneNumber": "string"
      }
    },
    "productAttributes": [
      {
        "attributeSeq": 0,
        "attributeValueSeq": 0,
        "attributeRealValue": "string",
        "attributeRealValueUnitCode": "string"
      }
    ],
    "cultureCostIncomeDeductionYn": true,
    "customProductYn": true,
    "superDangolYn": true,
    "itselfProductionProductYn": true,
    "brandCertificationYn": true,
    "seoInfo": {
      "pageTitle": "string",
      "metaDescription": "string",
      "sellerTags": [
        {
          "code": 0,
          "text": "string"
        }
      ]
    },
    "productSize": {
      "sizeTypeNo": 0,
      "sizeAttributes": [
        {
          "name": "string",
          "sizeValues": [
            {
              "sizeValueTypeNo": 0,
              "value": 0
            }
          ]
        }
      ],
      "models": [
        {
          "modelId": 0,
          "name": "string",
          "height": 0,
          "weight": 0,
          "top": "string",
          "bottom": "string",
          "shoe": "string"
        }
      ]
    },
    "unitCapacity": {
      "unitPriceYn": true,
      "totalCapacityValue": 0,
      "unitCapacity": 0,
      "indicationUnit": "string"
    },
    "preOrder": {
      "salePeriod": {
        "saleStartDate": "2024-07-29T15:51:28.071Z",
        "saleEndDate": "2024-07-29T15:51:28.071Z"
      },
      "preOrderEndSaleStatus": "SALE_END",
      "minOrderQty": 0,
      "deliveryStartDate": "2024-07-29T15:51:28.071Z",
      "deliveryEndDate": "2024-07-29T15:51:28.071Z",
      "giftPolicy": {
        "presentContent": "string"
      }
    }
  },
  "customerBenefit": {
    "immediateDiscountPolicy": {
      "discountMethod": {
        "value": 0,
        "unitType": "PERCENT",
        "startDate": "2024-07-29T15:51:28.071Z",
        "endDate": "2024-07-29T15:51:28.071Z"
      }
    },
    "purchasePointPolicy": {
      "value": 0,
      "unitType": "PERCENT",
      "startDate": "2024-07-29",
      "endDate": "2024-07-29"
    },
    "reviewPointPolicy": {
      "textReviewPoint": 0,
      "photoVideoReviewPoint": 0,
      "afterUseTextReviewPoint": 0,
      "afterUsePhotoVideoReviewPoint": 0,
      "storeMemberReviewPoint": 0,
      "startDate": "2024-07-29",
      "endDate": "2024-07-29"
    },
    "freeInterestPolicy": {
      "value": 0,
      "startDate": "2024-07-29",
      "endDate": "2024-07-29"
    },
    "giftPolicy": {
      "presentContent": "string"
    },
    "multiPurchaseDiscountPolicy": {
      "discountMethod": {
        "value": 0,
        "unitType": "PERCENT",
        "startDate": "2024-07-29",
        "endDate": "2024-07-29"
      },
      "orderValue": 0,
      "orderValueUnitType": "PERCENT"
    },
    "reservedDiscountPolicy": {
      "discountMethod": {
        "value": 0,
        "unitType": "PERCENT",
        "startDate": "2024-07-29T15:51:28.071Z",
        "endDate": "2024-07-29T15:51:28.071Z"
      }
    },
    "promotionDiscountPolicies": [
      {
        "promotionName": "string",
        "discountMethod": {
          "value": 0,
          "unitType": "PERCENT",
          "startDate": "2024-07-29T15:51:28.071Z",
          "endDate": "2024-07-29T15:51:28.071Z"
        }
      }
    ]
  }
}
