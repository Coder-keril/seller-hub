<!-- https://apicenter.commerce.naver.com/docs/commerce-api/current/schemas/%EC%83%81%ED%92%88-%EC%A3%BC%EB%AC%B8-%EC%A0%95%EB%B3%B4-%EA%B5%AC%EC%A1%B0%EC%B2%B4 -->
# 상품 주문 정보 구조체 | 커머스API

상품 주문 정보 구조체

이 구조체는 주문건의 상세 정보를 표현하는 구조체입니다.

이 구조체는 API 호출에 대한 응답으로만 사용합니다.

주문건의 특성 및 진행 상황에 따라 하위 노드 필드 구성이 다양하게 제공될 수 있습니다.

구조체의 객체 1개는 상품주문번호 1개를 표현합니다

timestampstring<date-time>Example: 2023-01-16T17:14:51.794+09:00

traceIdstringrequired

data productOrdersInfo.pay-order-seller (object)[]Array [

order orderResponseContent.pay-order-seller (object)chargeAmountPaymentAmountinteger충전금 최종 결제 금액

checkoutAccumulationPaymentAmountinteger네이버페이 적립금 최종 결제 금액

generalPaymentAmountinteger일반 결제 수단 최종 결제 금액

naverMileagePaymentAmountinteger네이버페이 포인트 최종 결제 금액

orderDatestring<date-time>주문 일시. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

orderDiscountAmountinteger주문 할인액

orderIdstring주문 번호. 20바이트 내외

ordererIdstring주문자 ID. 20바이트 내외

ordererNamestring주문자 이름. 300바이트 내외 (선물 주문은 마스킹됨)

ordererTelstring주문자 연락처 (선물 주문은 마스킹됨). 45바이트 내외.

paymentDatestring<date-time>결제 일시(최종 결제). 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

paymentDueDatestring<date-time>결제 기한. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

paymentMeansstring결제 수단. 300바이트 내외

결제수단비고신용카드신용카드 간편결제휴대폰휴대폰 간편결제계좌 간편결제무통장입금포인트/머니결제패밀리결제후불결제

isDeliveryMemoParticularInputstring배송 메모 개별 입력 여부. 8바이트 내외

payLocationTypestring결제 위치 구분(PC/MOBILE). 300바이트 내외

ordererNostring주문자 번호. 20바이트 내외

payLaterPaymentAmountinteger후불 결제 최종 결제 금액

isMembershipSubscribedboolean주문시점 멤버십 여부

productOrder productOrderResponseContent.pay-order-seller (object)claimStatusclaimStatus.pay-order-seller (string)클레임 상태. 250바이트 내외

코드설명비고CANCEL_REQUEST취소 요청CANCELING취소 처리 중CANCEL_DONE취소 처리 완료CANCEL_REJECT취소 철회RETURN_REQUEST반품 요청EXCHANGE_REQUEST교환 요청COLLECTING수거 처리 중COLLECT_DONE수거 완료EXCHANGE_REDELIVERING교환 재배송 중RETURN_DONE반품 완료EXCHANGE_DONE교환 완료RETURN_REJECT반품 철회EXCHANGE_REJECT교환 철회PURCHASE_DECISION_HOLDBACK구매 확정 보류PURCHASE_DECISION_REQUEST구매 확정 요청PURCHASE_DECISION_HOLDBACK_RELEASE구매 확정 보류 해제ADMIN_CANCELING직권 취소 중ADMIN_CANCEL_DONE직권 취소 완료ADMIN_CANCEL_REJECT직권 취소 철회

claimTypeclaimType.pay-order-seller (string)클레임 구분. 250바이트 내외

코드설명비고CANCEL취소RETURN반품EXCHANGE교환PURCHASE_DECISION_HOLDBACK구매 확정 보류ADMIN_CANCEL직권 취소

decisionDatestring<date-time>구매 확정일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

delayedDispatchDetailedReasonstring발송 지연 상세 사유. 4000바이트 내외

delayedDispatchReasondelayedDispatchReason.pay-order-seller (string)발송 지연 사유 코드. 250바이트 내외

코드설명비고PRODUCT_PREPARE상품 준비 중CUSTOMER_REQUEST고객 요청CUSTOM_BUILD주문 제작RESERVED_DISPATCH예약 발송OVERSEA_DELIVERY해외 배송ETC기타
Example: PRODUCT_PREPARE

deliveryDiscountAmountinteger배송비 최종 할인액

deliveryFeeAmountinteger배송비 합계

deliveryPolicyTypestring배송비 정책(조건별 무료 등). 250바이트 내외

expectedDeliveryMethoddeliveryMethod.pay-order-seller (string)배송 방법 코드. 250바이트 내외

코드설명비고DELIVERY택배, 등기, 소포GDFW_ISSUE_SVC굿스플로 송장 출력VISIT_RECEIPT방문 수령DIRECT_DELIVERY직접 전달QUICK_SVC퀵서비스NOTHING배송 없음RETURN_DESIGNATED지정 반품 택배RETURN_DELIVERY일반 반품 택배RETURN_INDIVIDUAL직접 반송RETURN_MERCHANT판매자 직접 수거(장보기 전용)UNKNOWN알 수 없음(예외 처리에 사용)
Example: DELIVERY

freeGiftstring사은품. 1000바이트 내외

mallIdstring가맹점 ID. 20바이트 내외

optionPriceinteger옵션 금액

packageNumberstring묶음배송 번호. 20바이트 내외

placeOrderDatestring<date-time>발주 확인일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

placeOrderStatusplaceOrderStatus.pay-order-seller (string)발주 상태. 250바이트 내외

코드설명비고NOT_YET발주 미확인OK발주 확인CANCEL발주 확인 해제

productClassstring상품 종류(일반/추가 상품 구분). 250바이트 내외

productDiscountAmountinteger최초 상품별 할인액

initialProductDiscountAmountinteger최초 상품별 할인액

remainProductDiscountAmountinteger잔여 상품별 할인액

groupProductIdnumber그룹상품 번호

productIdstring채널 상품 번호. 150바이트 내외

originalProductIdstring원상품 번호. 150바이트 내외

merchantChannelIdstring채널 번호. 150바이트 내외

productNamestring상품명. 4000바이트 내외

productOptionstring상품 옵션(옵션명). 4000바이트 내외

productOrderIdstring상품 주문 번호. 20바이트 내외

productOrderStatusproductOrderStatus.pay-order-seller (string)상품 주문 상태. 250바이트 내외

코드설명비고PAYMENT_WAITING결제 대기PAYED결제 완료DELIVERING배송 중DELIVERED배송 완료PURCHASE_DECIDED구매 확정EXCHANGED교환CANCELED취소RETURNED반품CANCELED_BY_NOPAYMENT미결제 취소

quantityinteger최초 수량

initialQuantityinteger최초 수량

remainQuantityinteger잔여 수량

sectionDeliveryFeeinteger지역별 추가 배송비

sellerProductCodestring판매자 상품 코드(판매자가 임의로 지정). 150바이트 내외

shippingAddress shippingAddress.pay-order-seller (object)addressTypeaddressType.pay-order-seller (string)배송지 타입. 250바이트 내외

코드설명비고DOMESTIC국내FOREIGN국외

baseAddressstring기본 주소. 300바이트 내외

citystring도시. 국내 주소에는 빈 문자열('')을 입력합니다. 300바이트 내외

countrystring국가. 45바이트 내외

detailedAddressstring상세 주소. 300바이트 내외

namestring이름. 150바이트 내외

statestring주(state). 국내 주소에는 빈 문자열('')을 입력합니다. 300바이트 내외

tel1string연락처 1. 45바이트 내외

tel2string연락처 2. 45바이트 내외

zipCodestring우편번호. 45바이트 내외

isRoadNameAddressboolean도로명 주소 여부. 8바이트 내외

pickupLocationTypepickupLocationType.pay-order-seller (string)수령 위치. 250바이트 내외
장보기 및 일부 N배송, N희망일배송, N판매자배송 주문에 대해서만 제공됩니다

코드설명비고FRONT_OF_DOOR문 앞MANAGEMENT_OFFICE경비실 보관DIRECT_RECEIVE직접 수령OTHER기타
Possible values: [FRONT_OF_DOOR, MANAGEMENT_OFFICE, DIRECT_RECEIVE, OTHER]

pickupLocationContentstring수령 위치. 300바이트 내외
장보기 및 일부 N배송, N희망일배송, N판매자배송 주문에 대해서만 제공됩니다.

entryMethodentryMethod.pay-order-seller (string)출입 방법. 250바이트 내외
장보기 및 일부 N배송, N희망일배송, N판매자배송 주문에 대해서만 제공됩니다.

코드설명비고LOBBY_PW공동현관 비밀번호 입력MANAGEMENT_OFFICE경비실 호출FREE자유 출입 가능OTHER기타 출입 방법
Possible values: [LOBBY_PW, MANAGEMENT_OFFICE, FREE, OTHER]

entryMethodContentstring출입 방법. 300바이트 내외
장보기 및 일부 N배송, N희망일배송, N판매자배송 주문에 대해서만 제공됩니다.

buildingManagementNostring건물 관리 번호. 100바이트 내외

longitudestring경도. 50바이트 내외

latitudestring위도. 50바이트 내외

shippingStartDatestring<date-time>발송 시작일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

shippingDueDatestring<date-time>발송 기한. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

shippingFeeTypestring배송비 형태(선불/착불/무료). 250바이트 내외

shippingMemostring배송 메모. 4000바이트 내외

takingAddress 판매자 출고지 주소 (object)addressTypeaddressType.pay-order-seller (string)배송지 타입. 250바이트 내외

코드설명비고DOMESTIC국내FOREIGN국외

baseAddressstring기본 주소. 300바이트 내외

citystring도시. 국내 주소에는 빈 문자열('')을 입력합니다. 300바이트 내외

countrystring국가. 45바이트 내외

detailedAddressstring상세 주소. 300바이트 내외

namestring이름. 150바이트 내외

statestring주(state). 국내 주소에는 빈 문자열('')을 입력합니다. 300바이트 내외

tel1string연락처 1. 45바이트 내외

tel2string연락처 2. 45바이트 내외

zipCodestring우편번호. 45바이트 내외

isRoadNameAddressboolean도로명 주소 여부. 8바이트 내외

totalPaymentAmountinteger최초 결제 금액(할인 적용 후 금액)

initialPaymentAmountinteger최초 결제 금액(할인 적용 후 금액)

remainPaymentAmountinteger잔여 결제 금액(할인 적용 후 금액)

totalProductAmountinteger최초 주문 금액(할인 적용 전 금액)

initialProductAmountinteger최초 주문 금액(할인 적용 전 금액)

remainProductAmountinteger잔여 주문 금액(할인 적용 전 금액)

unitPriceinteger상품 가격

sellerBurdenDiscountAmountinteger판매자 부담 할인액

initialSellerBurdenDiscountAmountinteger최초 판매자 부담 할인액

remainSellerBurdenDiscountAmountinteger잔여 판매자 부담 할인액(26.03.19 이후 주문 건부터 제공)

commissionRatingTypestring수수료 과금 구분(결제 수수료/(구)판매 수수료/채널 수수료). 250바이트 내외

commissionPrePayStatuscommissionPrePayStatus.pay-order-seller (string)수수료 선결제 상태 구분. 250바이트 내외

코드설명비고GENERAL_PRD일반 상품PRE_PAY_PRD_NO_PAY선차감(차감 전)PRE_PAY_PRD_PAYED선차감(차감 후)

paymentCommissioninteger결제 수수료

saleCommissioninteger(구)판매 수수료

expectedSettlementAmountinteger정산 예정 금액

inflowPathstring유입 경로(검색광고(SA)/공동구매/밴드/네이버 쇼핑/네이버 쇼핑 외). 250바이트 내외

inflowPathAddstring유입 경로 추가 정보. 250바이트 내외

itemNostring옵션 상품이나 추가 상품 등록 시 자동 생성된 아이템 번호로, 옵션 상품, 추가 상품을 구분하는 고유한 값. 1000바이트 내외

optionManageCodestring옵션 상품이나 추가 상품 등록 시 판매자가 별도로 입력한 옵션 관리 코드. 옵션 상품이나 추가 상품인 경우에 입력합니다. 1000바이트 내외

sellerCustomCode1string판매자가 내부에서 사용하는 코드. 1000바이트 내외

sellerCustomCode2string판매자가 내부에서 사용하는 코드. 1000바이트 내외

claimIdstring클레임 번호. 20바이트 내외

channelCommissioninteger채널 수수료

individualCustomUniqueCodestring구매자 개인통관고유부호. 구매 확정, 교환, 반품, 취소, 미결제 취소 상태의 거래 종료 주문에서는 노출되지 않습니다. 300바이트 내외

productImediateDiscountAmountinteger상품별 즉시 할인 금액

initialProductImmediateDiscountAmountinteger최초 상품별 즉시 할인 금액

remainProductImmediateDiscountAmountinteger잔여 상품별 즉시 할인 금액

productProductDiscountAmountinteger상품별 상품 할인 쿠폰 금액

initialProductProductDiscountAmountinteger최초 상품별 상품 할인 쿠폰 금액

remainProductProductDiscountAmountinteger잔여 상품별 상품 할인 쿠폰 금액

productMultiplePurchaseDiscountAmountinteger상품별 복수 구매 할인 금액

sellerBurdenImediateDiscountAmountinteger판매자 부담 즉시 할인 금액

initialSellerBurdenImmediateDiscountAmountinteger최초 판매자 부담 즉시 할인 금액

remainSellerBurdenImmediateDiscountAmountinteger잔여 판매자 부담 즉시 할인 금액

sellerBurdenProductDiscountAmountinteger판매자 부담 상품 할인 쿠폰 금액

initialSellerBurdenProductDiscountAmountinteger최초 판매자 부담 상품 할인 쿠폰 금액

remainSellerBurdenProductDiscountAmountinteger잔여 판매자 부담 상품 할인 쿠폰 금액

sellerBurdenMultiplePurchaseDiscountAmountinteger판매자 부담 복수 구매 할인 금액

initialSellerBurdenMultiplePurchaseDiscountAmountinteger최초 판매자 부담 복수 구매 할인 금액

remainSellerBurdenMultiplePurchaseDiscountAmountinteger잔여 판매자 부담 복수 구매 할인 금액

knowledgeShoppingSellingInterlockCommissioninteger네이버 쇼핑 매출 연동 수수료

giftReceivingStatusgiftReceivingStatus.pay-order-seller (string)선물 수락 상태 구분. 250바이트 내외

코드설명비고WAIT_FOR_RECEIVING수락 대기(배송지 입력 대기)RECEIVED수락 완료

sellerBurdenStoreDiscountAmountinteger판매자 부담 스토어 할인 금액

initialSellerBurdenStoreDiscountAmountinteger최초 판매자 부담 스토어 할인 금액

remainSellerBurdenStoreDiscountAmountinteger잔여 판매자 부담 스토어 할인 금액(26.03.19 이후 주문 건부터 제공)

sellerBurdenMultiplePurchaseDiscountTypemultiplePurchaseDiscountType.pay-order-seller (string)판매자 부담 복수 구매 할인 타입. 250바이트 내외Possible values: [IGNORE_QUANTITY, QUANTITY]

logisticsCompanyIdstring물류사 코드. 45바이트 내외

logisticsCenterIdstring물류센터 코드. 45바이트 내외

skuMappings skuMapping.pay-order-seller (object)[]물류재고정보
Array [

nsIdstring네이버 SKU ID (네이버SKU를 연동한 풀필먼트 상품주문에 한정). 20바이트 내외

nsBarcodestringSKU 바코드 (네이버SKU를 연동한 풀필먼트 상품주문에 한정). 100바이트 내외

pickingQuantityPerOrderinteger주문당 피킹수량 (네이버SKU를 연동한 풀필먼트 상품주문에 한정).

]

hopeDelivery hopeDelivery.pay-order-seller (object)regionstring지역. 100바이트 내외

additionalFeeinteger배송 희망 지역 설정 배송비

hopeDeliveryYmdstring배송 희망일. yyyymmdd 형식의 연월일

hopeDeliveryHmstring배송 희망 시간. HHmm 형식의 시간

changeReasonstring변경 사유. 1000바이트 내외

changerstring변경한 사용자(구매회원/관리자/시스템/판매자/판매자API). 100바이트 내외

deliveryAttributeTypedeliveryAttributeType.pay-order-seller (string)배송 속성 타입 코드. 250바이트 내외

코드설명비고NORMAL일반배송TODAY오늘출발OPTION_TODAY옵션별 오늘출발HOPE희망일배송TODAY_ARRIVAL당일배송DAWN_ARRIVAL새벽배송PRE_ORDER예약구매ARRIVAL_GUARANTEEN배송SELLER_GUARANTEEN판매자배송HOPE_SELLER_GUARANTEEN희망일배송PICKUP픽업QUICK즉시배달

expectedDeliveryCompanydeliveryCompanyCode.pay-order-seller (string)택배사 코드. 250바이트 내외

코드설명비고CJGLSCJ대한통운HYUNDAI롯데택배HANJIN한진택배KGB로젠택배EPOST우체국택배MTINTER엠티인터내셔널1004HOME1004HOMETWOFASTEXPRESS2FAST익스프레스ACEACEexpressACIEXPRESSACIADCAIRADC항운택배AIRWAYAIRWAY익스프레스APEXAPEXARAMEXARAMEXARGOARGOAIRBOYAirboyExpressKOREXGCJ대한통운(국제택배)CUPARCELCU편의점택배CWAYEXPRESSCwayExpressDHLDHLDHLDEDHL(독일)DHLGLOBALMAILDHLGlobalMailDPDDPDECMSEXPRESSECMSExpressEFSEFSEMSEMSEZUSAEZUSAEUROPARCELEuroParcelFEDEXFEDEXGOPGOP당일택배GOSGOS당일택배GPSLOGIXGPSLOGIXGSFRESHGSFreshGSIEXPRESSGSI익스프레스GSMNTONGSMNTONGSPOSTBOXGSPostbox퀵CVSNETGSPostbox택배GS더프레시GSTHEFRESHGTSLOGISGTS로지스HYBRIDHI택배HYHYIKIK물류KGLNETKGL네트웍스KTKT EXPRESSLGELG전자배송센터LTLLTLNDEXKOREANDEX KOREASBGLSSBGLSSFEXSFexpressSLXSLX택배SSGSSGTNTTNTLOGISPARTNERUFO로지스UPSUPSUSPSUSPSWIZWAWIZWAYJSWORLDYJS글로벌YJSYJS글로벌(영국)YUNDAYUNDAEXPRESSIPARCELi-parcelKY건영복합물류KUNYOUNG건영택배KDEXP경동택배KIN경인택배KORYO고려택배GDSP골드스넵스KOKUSAI국제익스프레스GOODTOLUCK굿투럭NAEUN나은물류NOGOK노곡물류NONGHYUP농협택배HANAROMART농협하나로마트DAELIM대림통운DAESIN대신택배DAEWOON대운글로벌THEBAO더바오DODOFLEX도도플렉스DONGGANG동강물류DONGJIN동진특송CHAINLOGIS두발히어로당일택배DRABBIT딜리래빗JMNP딜리박스ONEDAYLOGIS라스트마일LINEEXP라인익스프레스ROADSUNEXPRESS로드썬익스프레스LOGISVALLEY로지스밸리POOLATHOME로지스올홈케어(풀앳홈)LOTOS로토스HLCGLOBAL롯데글로벌로지스(국제택배)LOTTECHILSUNG롯데칠성MDLOGIS모든로지스(SLO)DASONG물류대장BABABA바바바로지스BANPOOM반품구조대VALEX발렉스SHIPNERGY배송하기좋은날PANTOSLX판토스VROONG부릉BRIDGE브릿지로지스EKDP삼다수가정배송SELC삼성전자물류SEORIM서림물류SWGEXP성원글로벌SUNGHUN성훈물류SEBANG세방택배SMARTLOGIS스마트로지스SPARKLE스파클직배송SPASYS1스페이시스원CRLX시알로지텍ANYTRACK애니트랙ABOUTPET어바웃펫ESTHER에스더쉬핑VENDORPIA벤더피아ACTCORE에이씨티앤코아HKHOLDINGS에이치케이홀딩스NTLPS엔티엘피스TODAYPICKUP카카오T당일배송RUSH오늘회러쉬ALLIN올인닷컴ALLTAKOREA올타코리아WIDETECH와이드테크YONGMA용마로지스DCOMMERCE우리동네커머스WEVILL우리동네택배HONAM우리택배WOORIHB우리한방택배WOOJIN우진인터로지스REGISTPOST우편등기WOONGJI웅지익스프레스WARPEX워펙스WINION위니온로지스WIHTYOU위드유당일택배WEMOVE위무브UFREIGHT유프레이트코리아EUNHA은하쉬핑INNOS이노스(올인닷컴)EMARTEVERYDAY이마트에브리데이ESTLA이스트라ETOMARS이투마스GENERALPOST일반우편ILSHIN일신모닝택배ILYANG일양로지스GNETWORK자이언트ZENIEL제니엘시스템JLOGIST제이로지스트GENIEGO지니고당일특급GDAKOREA지디에이코리아GHSPEED지에이치스피드JIKGUMOON직구문CHUNIL천일택배CHOROC초록마을(외부연동)CHOROCMAEUL초록마을(네이버직연동)COSHIP캐나다쉬핑KJT케이제이티QRUN큐런CUBEFLOW큐브플로우QXPRESS트랙스로지스HEREWEGO탱고앤고TOMATO토마토앱TODAY투데이TSG티에스지로지스TEAMFRESH팀프레시PATEK파테크해운상공XINPATEK파테크해운항공PANASIA판월드로지스틱PANSTAR팬스타국제특송(PIEX)FOREVER퍼레버택배PULMUONE풀무원(로지스밸리)FREDIT프레딧FRESHMATES프레시메이트KURLY컬리넥스트마일PINGPONG핑퐁HOWSER하우저HIVECITY하이브시티HANDALUM한달음택배HANDEX한덱스HANMI한미포스트HANSSEM한샘HANWOORI한우리물류HPL한의사랑택배HDEXP합동택배HERWUZUG허우적GLOVIS현대글로비스HOMEINNO홈이노베이션로지스HOMEPICKTODAY홈픽오늘도착HOMEPICK홈픽택배HOMEPLUSDELIVERY홈플러스HOMEPLUSEXPRESS홈플러스익스프레스CARGOPLEASE화물을부탁해HWATONG화통CH1기타택배LETUS바로스LETUS3PL레터스CASA신세계까사GCS지씨에스GKGLOBAL지케이글로벌BRCH비알씨에이치DNDN든든택배GONELO고넬로JCLSJCLSJWTNLJWTNLGS25GS편의점(퀵배달용)CUCU편의점(퀵배달용)

arrivalGuaranteeDatestring<date-time>배송 도착 보장 일시. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

deliveryTagTypedeliveryTagType.pay-order-seller (string)배송태그타입. 일부 N배송, N희망일배송, N판매자배송 주문에 대해서만 제공됩니다.

코드설명비고TODAY오늘배송TOMORROW내일배송DAWN새벽배송SUNDAY일요배송STANDARDD+2이상배송HOPE희망일배송

taxTypetaxType.pay-order-seller (string)상품 과면세 여부

코드설명비고TAXATION과세TAX_EXEMPTION면세TAX_FREE영세

storageTypestorageType.pay-order-seller (string)옵션보관유형

코드설명비고DRY상온WET냉장FROZEN냉동

logisticsDirectContractedboolean물류직계약여부

appliedCoupons appliedCoupon.pay-order-seller (object)[]쿠폰사용정보
Array [

couponPublishNumberstring쿠폰 발행 번호

couponClassCodecouponClassCode.pay-order-seller (string)쿠폰 유형.

코드설명비고NMP_PRD_DCNT관리자 상품할인NMP_PRD_DUP_DCNT관리자/판매자 상품중복할인SELLER_STORE_DCNT스토어 할인 쿠폰(26.03.19 이후 주문 건부터 제공)

couponDiscountAmountinteger쿠폰 할인 금액

naverBurdenRatiointeger네이버 부담률

]

standardPurchaseOptions standardPurchaseOption.pay-order-seller (object)[]판매 옵션 정보
Array [

optionIdstring판매 옵션 ID

optionNamestring판매 옵션 이름

valueNamestring판매 옵션 값

]

appliedCardPromotion appliedCardPromotion.pay-order-seller (object)카드 프로모션 적용 정보
promotionNamestring프로모션 이름. 25바이트 내외

cardCompanyNamestring카드사 이름. 250바이트 내외

promotionApplyAmountinteger프로모션 혜택 금액

brandCompanyBurdenRatiointeger판매자/가맹점 분담 비율

cancel 취소 (2025년 상반기 중 제거 예정. currentClaim 하위의 동일 오브젝트 사용 권장.) (object)claimIdstring클레임 번호. 20바이트 내외

cancelApprovalDatestring<date-time>취소 승인일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

cancelCompletedDatestring<date-time>취소 완료일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

cancelDetailedReasonstring취소 상세 사유. 4000바이트 내외

cancelReasonclaimReason.pay-order-seller (string)클레임 요청 사유. 250바이트 내외

코드설명비고INTENT_CHANGED구매 의사 취소COLOR_AND_SIZE색상 및 사이즈 변경WRONG_ORDER다른 상품 잘못 주문PRODUCT_UNSATISFIED서비스 불만족DELAYED_DELIVERY배송 지연SOLD_OUT상품 품절DROPPED_DELIVERY배송 누락NOT_YET_DELIVERY미배송BROKEN상품 파손INCORRECT_INFO상품 정보 상이WRONG_DELIVERY오배송WRONG_OPTION색상 등 다른 상품 잘못 배송SIMPLE_INTENT_CHANGED단순 변심MISTAKE_ORDER주문 실수ETC기타API 에서 지정 불가DELAYED_DELIVERY_BY_PURCHASER배송 지연INCORRECT_INFO_BY_PURCHASER상품 정보 상이PRODUCT_UNSATISFIED_BY_PURCHASER서비스 불만족NOT_YET_DISCUSSION상호 협의가 완료되지 않은 주문 건OUT_OF_STOCK재고 부족으로 인한 판매 불가SALE_INTENT_CHANGED판매 의사 변심으로 인한 거부NOT_YET_PAYMENT구매자의 미결제로 인한 거부NOT_YET_RECEIVE상품 미수취WRONG_DELAYED_DELIVERY오배송 및 지연BROKEN_AND_BAD파손 및 불량RECEIVING_DUE_DATE_OVER수락 기한 만료RECEIVER_MISMATCHED수신인 불일치GIFT_INTENT_CHANGED보내기 취소GIFT_REFUSAL선물 거절MINOR_RESTRICTED상품 수신 불가RECEIVING_BLOCKED상품 수신 불가UNDER_QUANTITY주문 수량 미달ASYNC_FAIL_PAYMENT결제 승인 실패ASYNC_LONG_WAIT_PAYMENT결제 승인 실패FAMILY_PAY_REJECTED패밀리결제 거절BUSINESSMALL_PAY_REJECTED관리자 결제 거절FAIL_PAYMENT결제 승인 실패

claimRequestDatestring<date-time>클레임 요청일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

claimStatusclaimStatus.pay-order-seller (string)클레임 상태. 250바이트 내외

코드설명비고CANCEL_REQUEST취소 요청CANCELING취소 처리 중CANCEL_DONE취소 처리 완료CANCEL_REJECT취소 철회RETURN_REQUEST반품 요청EXCHANGE_REQUEST교환 요청COLLECTING수거 처리 중COLLECT_DONE수거 완료EXCHANGE_REDELIVERING교환 재배송 중RETURN_DONE반품 완료EXCHANGE_DONE교환 완료RETURN_REJECT반품 철회EXCHANGE_REJECT교환 철회PURCHASE_DECISION_HOLDBACK구매 확정 보류PURCHASE_DECISION_REQUEST구매 확정 요청PURCHASE_DECISION_HOLDBACK_RELEASE구매 확정 보류 해제ADMIN_CANCELING직권 취소 중ADMIN_CANCEL_DONE직권 취소 완료ADMIN_CANCEL_REJECT직권 취소 철회

refundExpectedDatestring<date-time>환불 예정일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

refundStandbyReasonstring환불 대기 사유. 300바이트 내외

refundStandbyStatusstring환불 대기 상태. 100바이트 내외

requestChannelstring접수 채널. 100바이트 내외

requestQuantityinteger요청 수량

return 반품 (2025년 상반기 중 제거 예정. currentClaim 하위의 동일 오브젝트 사용 권장.) (object)claimIdstring클레임 번호. 20바이트 내외

claimDeliveryFeeDemandAmountinteger반품 배송비 청구액

claimDeliveryFeePayMeansstring반품 배송비 결제 수단. 250바이트 내외

claimDeliveryFeePayMethodstring반품 배송비 결제 방법. 250바이트 내외

claimRequestDatestring<date-time>클레임 요청일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

claimStatusclaimStatus.pay-order-seller (string)클레임 상태. 250바이트 내외

코드설명비고CANCEL_REQUEST취소 요청CANCELING취소 처리 중CANCEL_DONE취소 처리 완료CANCEL_REJECT취소 철회RETURN_REQUEST반품 요청EXCHANGE_REQUEST교환 요청COLLECTING수거 처리 중COLLECT_DONE수거 완료EXCHANGE_REDELIVERING교환 재배송 중RETURN_DONE반품 완료EXCHANGE_DONE교환 완료RETURN_REJECT반품 철회EXCHANGE_REJECT교환 철회PURCHASE_DECISION_HOLDBACK구매 확정 보류PURCHASE_DECISION_REQUEST구매 확정 요청PURCHASE_DECISION_HOLDBACK_RELEASE구매 확정 보류 해제ADMIN_CANCELING직권 취소 중ADMIN_CANCEL_DONE직권 취소 완료ADMIN_CANCEL_REJECT직권 취소 철회

collectAddress 구매자 수거지 주소 (object)addressTypeaddressType.pay-order-seller (string)배송지 타입. 250바이트 내외

코드설명비고DOMESTIC국내FOREIGN국외

baseAddressstring기본 주소. 300바이트 내외

citystring도시. 국내 주소에는 빈 문자열('')을 입력합니다. 300바이트 내외

countrystring국가. 45바이트 내외

detailedAddressstring상세 주소. 300바이트 내외

namestring이름. 150바이트 내외

statestring주(state). 국내 주소에는 빈 문자열('')을 입력합니다. 300바이트 내외

tel1string연락처 1. 45바이트 내외

tel2string연락처 2. 45바이트 내외

zipCodestring우편번호. 45바이트 내외

isRoadNameAddressboolean도로명 주소 여부. 8바이트 내외

collectCompletedDatestring<date-time>수거 완료일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

collectDeliveryCompanydeliveryCompanyCode.pay-order-seller (string)택배사 코드. 250바이트 내외

코드설명비고CJGLSCJ대한통운HYUNDAI롯데택배HANJIN한진택배KGB로젠택배EPOST우체국택배MTINTER엠티인터내셔널1004HOME1004HOMETWOFASTEXPRESS2FAST익스프레스ACEACEexpressACIEXPRESSACIADCAIRADC항운택배AIRWAYAIRWAY익스프레스APEXAPEXARAMEXARAMEXARGOARGOAIRBOYAirboyExpressKOREXGCJ대한통운(국제택배)CUPARCELCU편의점택배CWAYEXPRESSCwayExpressDHLDHLDHLDEDHL(독일)DHLGLOBALMAILDHLGlobalMailDPDDPDECMSEXPRESSECMSExpressEFSEFSEMSEMSEZUSAEZUSAEUROPARCELEuroParcelFEDEXFEDEXGOPGOP당일택배GOSGOS당일택배GPSLOGIXGPSLOGIXGSFRESHGSFreshGSIEXPRESSGSI익스프레스GSMNTONGSMNTONGSPOSTBOXGSPostbox퀵CVSNETGSPostbox택배GS더프레시GSTHEFRESHGTSLOGISGTS로지스HYBRIDHI택배HYHYIKIK물류KGLNETKGL네트웍스KTKT EXPRESSLGELG전자배송센터LTLLTLNDEXKOREANDEX KOREASBGLSSBGLSSFEXSFexpressSLXSLX택배SSGSSGTNTTNTLOGISPARTNERUFO로지스UPSUPSUSPSUSPSWIZWAWIZWAYJSWORLDYJS글로벌YJSYJS글로벌(영국)YUNDAYUNDAEXPRESSIPARCELi-parcelKY건영복합물류KUNYOUNG건영택배KDEXP경동택배KIN경인택배KORYO고려택배GDSP골드스넵스KOKUSAI국제익스프레스GOODTOLUCK굿투럭NAEUN나은물류NOGOK노곡물류NONGHYUP농협택배HANAROMART농협하나로마트DAELIM대림통운DAESIN대신택배DAEWOON대운글로벌THEBAO더바오DODOFLEX도도플렉스DONGGANG동강물류DONGJIN동진특송CHAINLOGIS두발히어로당일택배DRABBIT딜리래빗JMNP딜리박스ONEDAYLOGIS라스트마일LINEEXP라인익스프레스ROADSUNEXPRESS로드썬익스프레스LOGISVALLEY로지스밸리POOLATHOME로지스올홈케어(풀앳홈)LOTOS로토스HLCGLOBAL롯데글로벌로지스(국제택배)LOTTECHILSUNG롯데칠성MDLOGIS모든로지스(SLO)DASONG물류대장BABABA바바바로지스BANPOOM반품구조대VALEX발렉스SHIPNERGY배송하기좋은날PANTOSLX판토스VROONG부릉BRIDGE브릿지로지스EKDP삼다수가정배송SELC삼성전자물류SEORIM서림물류SWGEXP성원글로벌SUNGHUN성훈물류SEBANG세방택배SMARTLOGIS스마트로지스SPARKLE스파클직배송SPASYS1스페이시스원CRLX시알로지텍ANYTRACK애니트랙ABOUTPET어바웃펫ESTHER에스더쉬핑VENDORPIA벤더피아ACTCORE에이씨티앤코아HKHOLDINGS에이치케이홀딩스NTLPS엔티엘피스TODAYPICKUP카카오T당일배송RUSH오늘회러쉬ALLIN올인닷컴ALLTAKOREA올타코리아WIDETECH와이드테크YONGMA용마로지스DCOMMERCE우리동네커머스WEVILL우리동네택배HONAM우리택배WOORIHB우리한방택배WOOJIN우진인터로지스REGISTPOST우편등기WOONGJI웅지익스프레스WARPEX워펙스WINION위니온로지스WIHTYOU위드유당일택배WEMOVE위무브UFREIGHT유프레이트코리아EUNHA은하쉬핑INNOS이노스(올인닷컴)EMARTEVERYDAY이마트에브리데이ESTLA이스트라ETOMARS이투마스GENERALPOST일반우편ILSHIN일신모닝택배ILYANG일양로지스GNETWORK자이언트ZENIEL제니엘시스템JLOGIST제이로지스트GENIEGO지니고당일특급GDAKOREA지디에이코리아GHSPEED지에이치스피드JIKGUMOON직구문CHUNIL천일택배CHOROC초록마을(외부연동)CHOROCMAEUL초록마을(네이버직연동)COSHIP캐나다쉬핑KJT케이제이티QRUN큐런CUBEFLOW큐브플로우QXPRESS트랙스로지스HEREWEGO탱고앤고TOMATO토마토앱TODAY투데이TSG티에스지로지스TEAMFRESH팀프레시PATEK파테크해운상공XINPATEK파테크해운항공PANASIA판월드로지스틱PANSTAR팬스타국제특송(PIEX)FOREVER퍼레버택배PULMUONE풀무원(로지스밸리)FREDIT프레딧FRESHMATES프레시메이트KURLY컬리넥스트마일PINGPONG핑퐁HOWSER하우저HIVECITY하이브시티HANDALUM한달음택배HANDEX한덱스HANMI한미포스트HANSSEM한샘HANWOORI한우리물류HPL한의사랑택배HDEXP합동택배HERWUZUG허우적GLOVIS현대글로비스HOMEINNO홈이노베이션로지스HOMEPICKTODAY홈픽오늘도착HOMEPICK홈픽택배HOMEPLUSDELIVERY홈플러스HOMEPLUSEXPRESS홈플러스익스프레스CARGOPLEASE화물을부탁해HWATONG화통CH1기타택배LETUS바로스LETUS3PL레터스CASA신세계까사GCS지씨에스GKGLOBAL지케이글로벌BRCH비알씨에이치DNDN든든택배GONELO고넬로JCLSJCLSJWTNLJWTNLGS25GS편의점(퀵배달용)CUCU편의점(퀵배달용)

collectDeliveryMethoddeliveryMethod.pay-order-seller (string)배송 방법 코드. 250바이트 내외

코드설명비고DELIVERY택배, 등기, 소포GDFW_ISSUE_SVC굿스플로 송장 출력VISIT_RECEIPT방문 수령DIRECT_DELIVERY직접 전달QUICK_SVC퀵서비스NOTHING배송 없음RETURN_DESIGNATED지정 반품 택배RETURN_DELIVERY일반 반품 택배RETURN_INDIVIDUAL직접 반송RETURN_MERCHANT판매자 직접 수거(장보기 전용)UNKNOWN알 수 없음(예외 처리에 사용)
Example: DELIVERY

collectStatuscollectStatus.pay-order-seller (string)수거 상태. 250바이트 내외

코드설명비고NOT_REQUESTED수거 미요청COLLECT_REQUEST_TO_AGENT수거 지시 완료COLLECT_REQUEST_TO_DELIVERY_COMPANY수거 요청COLLECT_WAITING택배사 수거 예정DELIVERING수거 진행 중DELIVERED수거 완료DELIVERY_FAILED배송 실패COLLECT_FAILED수거 실패WRONG_INVOICE오류 송장COLLECT_CANCELED수거 취소
Example: NOT_REQUESTED

collectTrackingNumberstring수거 송장 번호. 100바이트 내외

etcFeeDemandAmountinteger기타 비용 청구액

etcFeePayMeansstring기타 비용 결제 수단. 250바이트 내외

etcFeePayMethodstring기타 비용 결제 방법. 250바이트 내외

holdbackDetailedReasonstring보류 상세 사유. 4000바이트 내외

holdbackReasonholdbackReason.pay-order-seller (string)보류 유형. 250바이트 내외

코드설명비고RETURN_DELIVERYFEE반품 배송비 청구EXTRAFEEE추가 비용 청구RETURN_DELIVERYFEE_AND_EXTRAFEEE반품 배송비 + 추가 비용 청구RETURN_PRODUCT_NOT_DELIVERED반품 상품 미입고ETC기타 사유EXCHANGE_DELIVERYFEE교환 배송비 청구EXCHANGE_EXTRAFEE추가 교환 비용 청구EXCHANGE_PRODUCT_READY교환 상품 준비 중EXCHANGE_PRODUCT_NOT_DELIVERED교환 상품 미입고SELLER_CONFIRM_NEED판매자 확인 필요PURCHASER_CONFIRM_NEED구매자 확인 필요SELLER_REMIT판매자 직접 송금

holdbackStatusholdbackStatus.pay-order-seller (string)보류 상태. 250바이트 내외

코드설명비고HOLDBACK보류 중RELEASED보류 해제

refundExpectedDatestring<date-time>환불 예정일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

refundStandbyReasonstring환불 대기 사유. 250바이트 내외

refundStandbyStatusstring환불 대기 상태. 250바이트 내외

requestChannelstring접수 채널. 250바이트 내외

requestQuantityinteger요청 수량

returnDetailedReasonstring반품 상세 사유. 4000바이트 내외

returnReasonclaimReason.pay-order-seller (string)클레임 요청 사유. 250바이트 내외

코드설명비고INTENT_CHANGED구매 의사 취소COLOR_AND_SIZE색상 및 사이즈 변경WRONG_ORDER다른 상품 잘못 주문PRODUCT_UNSATISFIED서비스 불만족DELAYED_DELIVERY배송 지연SOLD_OUT상품 품절DROPPED_DELIVERY배송 누락NOT_YET_DELIVERY미배송BROKEN상품 파손INCORRECT_INFO상품 정보 상이WRONG_DELIVERY오배송WRONG_OPTION색상 등 다른 상품 잘못 배송SIMPLE_INTENT_CHANGED단순 변심MISTAKE_ORDER주문 실수ETC기타API 에서 지정 불가DELAYED_DELIVERY_BY_PURCHASER배송 지연INCORRECT_INFO_BY_PURCHASER상품 정보 상이PRODUCT_UNSATISFIED_BY_PURCHASER서비스 불만족NOT_YET_DISCUSSION상호 협의가 완료되지 않은 주문 건OUT_OF_STOCK재고 부족으로 인한 판매 불가SALE_INTENT_CHANGED판매 의사 변심으로 인한 거부NOT_YET_PAYMENT구매자의 미결제로 인한 거부NOT_YET_RECEIVE상품 미수취WRONG_DELAYED_DELIVERY오배송 및 지연BROKEN_AND_BAD파손 및 불량RECEIVING_DUE_DATE_OVER수락 기한 만료RECEIVER_MISMATCHED수신인 불일치GIFT_INTENT_CHANGED보내기 취소GIFT_REFUSAL선물 거절MINOR_RESTRICTED상품 수신 불가RECEIVING_BLOCKED상품 수신 불가UNDER_QUANTITY주문 수량 미달ASYNC_FAIL_PAYMENT결제 승인 실패ASYNC_LONG_WAIT_PAYMENT결제 승인 실패FAMILY_PAY_REJECTED패밀리결제 거절BUSINESSMALL_PAY_REJECTED관리자 결제 거절FAIL_PAYMENT결제 승인 실패

returnReceiveAddress 판매자 교환/반품 수취 주소 (object)addressTypeaddressType.pay-order-seller (string)배송지 타입. 250바이트 내외

코드설명비고DOMESTIC국내FOREIGN국외

baseAddressstring기본 주소. 300바이트 내외

citystring도시. 국내 주소에는 빈 문자열('')을 입력합니다. 300바이트 내외

countrystring국가. 45바이트 내외

detailedAddressstring상세 주소. 300바이트 내외

namestring이름. 150바이트 내외

statestring주(state). 국내 주소에는 빈 문자열('')을 입력합니다. 300바이트 내외

tel1string연락처 1. 45바이트 내외

tel2string연락처 2. 45바이트 내외

zipCodestring우편번호. 45바이트 내외

isRoadNameAddressboolean도로명 주소 여부. 8바이트 내외

logisticsCenterIdstring물류센터 ID. 60바이트

returnCompletedDatestring<date-time>반품 완료일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

holdbackConfigDatestring<date-time>보류 설정일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

holdbackConfigurerstring보류 설정자(구매자/판매자/관리자/시스템). 250바이트 내외

holdbackReleaseDatestring<date-time>보류 해제일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

holdbackReleaserstring보류 해제자(구매자/판매자/관리자/시스템). 250바이트 내외

claimDeliveryFeeProductOrderIdsstring반품 배송비 묶음 청구 상품 주문 번호(여러 개면 쉼표로 구분). 4000바이트 내외

claimDeliveryFeeDiscountAmountinteger반품 배송비 할인액

remoteAreaCostChargeAmountinteger반품 도서산간 배송비

membershipsArrivalGuaranteeClaimSupportingAmountinteger멤버십N배송 지원금액

returnImageUrlstring[]반품이미지 URL

claimDeliveryFeeSupportTypeclaimDeliveryFeeSupportType.pay-order-seller (string)클레임배송비지원타입

코드설명비고MEMBERSHIP_ARRIVAL_GUARANTEE멤버십도착보장MEMBERSHIP_KURLY멤버십컬리N마트

claimDeliveryFeeSupportAmountinteger클레임배송비지원금액

collectAttributeTypecollectAttributeType.pay-order-seller (string)수거 속성. 250바이트 내외

코드설명비고LOGISTICS_COLLECTNFA 수거LOGISTICS_NON_COLLECTNFA 미수거
Example: LOGISTICS_COLLECT

exchange 교환 (2025년 상반기 중 제거 예정. currentClaim 하위의 동일 오브젝트 사용 권장.) (object)claimIdstring클레임 번호. 20바이트 내외

claimDeliveryFeeDemandAmountinteger교환 배송비 청구액

claimDeliveryFeePayMeansstring교환 배송비 결제 수단. 100바이트 내외

claimDeliveryFeePayMethodstring교환 배송비 결제 방법. 100바이트 내외

claimRequestDatestring<date-time>클레임 요청일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

claimStatusclaimStatus.pay-order-seller (string)클레임 상태. 250바이트 내외

코드설명비고CANCEL_REQUEST취소 요청CANCELING취소 처리 중CANCEL_DONE취소 처리 완료CANCEL_REJECT취소 철회RETURN_REQUEST반품 요청EXCHANGE_REQUEST교환 요청COLLECTING수거 처리 중COLLECT_DONE수거 완료EXCHANGE_REDELIVERING교환 재배송 중RETURN_DONE반품 완료EXCHANGE_DONE교환 완료RETURN_REJECT반품 철회EXCHANGE_REJECT교환 철회PURCHASE_DECISION_HOLDBACK구매 확정 보류PURCHASE_DECISION_REQUEST구매 확정 요청PURCHASE_DECISION_HOLDBACK_RELEASE구매 확정 보류 해제ADMIN_CANCELING직권 취소 중ADMIN_CANCEL_DONE직권 취소 완료ADMIN_CANCEL_REJECT직권 취소 철회

collectAddress 구매자 수거지 주소 (object)addressTypeaddressType.pay-order-seller (string)배송지 타입. 250바이트 내외

코드설명비고DOMESTIC국내FOREIGN국외

baseAddressstring기본 주소. 300바이트 내외

citystring도시. 국내 주소에는 빈 문자열('')을 입력합니다. 300바이트 내외

countrystring국가. 45바이트 내외

detailedAddressstring상세 주소. 300바이트 내외

namestring이름. 150바이트 내외

statestring주(state). 국내 주소에는 빈 문자열('')을 입력합니다. 300바이트 내외

tel1string연락처 1. 45바이트 내외

tel2string연락처 2. 45바이트 내외

zipCodestring우편번호. 45바이트 내외

isRoadNameAddressboolean도로명 주소 여부. 8바이트 내외

collectCompletedDatestring<date-time>수거 완료일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

collectDeliveryCompanydeliveryCompanyCode.pay-order-seller (string)택배사 코드. 250바이트 내외

코드설명비고CJGLSCJ대한통운HYUNDAI롯데택배HANJIN한진택배KGB로젠택배EPOST우체국택배MTINTER엠티인터내셔널1004HOME1004HOMETWOFASTEXPRESS2FAST익스프레스ACEACEexpressACIEXPRESSACIADCAIRADC항운택배AIRWAYAIRWAY익스프레스APEXAPEXARAMEXARAMEXARGOARGOAIRBOYAirboyExpressKOREXGCJ대한통운(국제택배)CUPARCELCU편의점택배CWAYEXPRESSCwayExpressDHLDHLDHLDEDHL(독일)DHLGLOBALMAILDHLGlobalMailDPDDPDECMSEXPRESSECMSExpressEFSEFSEMSEMSEZUSAEZUSAEUROPARCELEuroParcelFEDEXFEDEXGOPGOP당일택배GOSGOS당일택배GPSLOGIXGPSLOGIXGSFRESHGSFreshGSIEXPRESSGSI익스프레스GSMNTONGSMNTONGSPOSTBOXGSPostbox퀵CVSNETGSPostbox택배GS더프레시GSTHEFRESHGTSLOGISGTS로지스HYBRIDHI택배HYHYIKIK물류KGLNETKGL네트웍스KTKT EXPRESSLGELG전자배송센터LTLLTLNDEXKOREANDEX KOREASBGLSSBGLSSFEXSFexpressSLXSLX택배SSGSSGTNTTNTLOGISPARTNERUFO로지스UPSUPSUSPSUSPSWIZWAWIZWAYJSWORLDYJS글로벌YJSYJS글로벌(영국)YUNDAYUNDAEXPRESSIPARCELi-parcelKY건영복합물류KUNYOUNG건영택배KDEXP경동택배KIN경인택배KORYO고려택배GDSP골드스넵스KOKUSAI국제익스프레스GOODTOLUCK굿투럭NAEUN나은물류NOGOK노곡물류NONGHYUP농협택배HANAROMART농협하나로마트DAELIM대림통운DAESIN대신택배DAEWOON대운글로벌THEBAO더바오DODOFLEX도도플렉스DONGGANG동강물류DONGJIN동진특송CHAINLOGIS두발히어로당일택배DRABBIT딜리래빗JMNP딜리박스ONEDAYLOGIS라스트마일LINEEXP라인익스프레스ROADSUNEXPRESS로드썬익스프레스LOGISVALLEY로지스밸리POOLATHOME로지스올홈케어(풀앳홈)LOTOS로토스HLCGLOBAL롯데글로벌로지스(국제택배)LOTTECHILSUNG롯데칠성MDLOGIS모든로지스(SLO)DASONG물류대장BABABA바바바로지스BANPOOM반품구조대VALEX발렉스SHIPNERGY배송하기좋은날PANTOSLX판토스VROONG부릉BRIDGE브릿지로지스EKDP삼다수가정배송SELC삼성전자물류SEORIM서림물류SWGEXP성원글로벌SUNGHUN성훈물류SEBANG세방택배SMARTLOGIS스마트로지스SPARKLE스파클직배송SPASYS1스페이시스원CRLX시알로지텍ANYTRACK애니트랙ABOUTPET어바웃펫ESTHER에스더쉬핑VENDORPIA벤더피아ACTCORE에이씨티앤코아HKHOLDINGS에이치케이홀딩스NTLPS엔티엘피스TODAYPICKUP카카오T당일배송RUSH오늘회러쉬ALLIN올인닷컴ALLTAKOREA올타코리아WIDETECH와이드테크YONGMA용마로지스DCOMMERCE우리동네커머스WEVILL우리동네택배HONAM우리택배WOORIHB우리한방택배WOOJIN우진인터로지스REGISTPOST우편등기WOONGJI웅지익스프레스WARPEX워펙스WINION위니온로지스WIHTYOU위드유당일택배WEMOVE위무브UFREIGHT유프레이트코리아EUNHA은하쉬핑INNOS이노스(올인닷컴)EMARTEVERYDAY이마트에브리데이ESTLA이스트라ETOMARS이투마스GENERALPOST일반우편ILSHIN일신모닝택배ILYANG일양로지스GNETWORK자이언트ZENIEL제니엘시스템JLOGIST제이로지스트GENIEGO지니고당일특급GDAKOREA지디에이코리아GHSPEED지에이치스피드JIKGUMOON직구문CHUNIL천일택배CHOROC초록마을(외부연동)CHOROCMAEUL초록마을(네이버직연동)COSHIP캐나다쉬핑KJT케이제이티QRUN큐런CUBEFLOW큐브플로우QXPRESS트랙스로지스HEREWEGO탱고앤고TOMATO토마토앱TODAY투데이TSG티에스지로지스TEAMFRESH팀프레시PATEK파테크해운상공XINPATEK파테크해운항공PANASIA판월드로지스틱PANSTAR팬스타국제특송(PIEX)FOREVER퍼레버택배PULMUONE풀무원(로지스밸리)FREDIT프레딧FRESHMATES프레시메이트KURLY컬리넥스트마일PINGPONG핑퐁HOWSER하우저HIVECITY하이브시티HANDALUM한달음택배HANDEX한덱스HANMI한미포스트HANSSEM한샘HANWOORI한우리물류HPL한의사랑택배HDEXP합동택배HERWUZUG허우적GLOVIS현대글로비스HOMEINNO홈이노베이션로지스HOMEPICKTODAY홈픽오늘도착HOMEPICK홈픽택배HOMEPLUSDELIVERY홈플러스HOMEPLUSEXPRESS홈플러스익스프레스CARGOPLEASE화물을부탁해HWATONG화통CH1기타택배LETUS바로스LETUS3PL레터스CASA신세계까사GCS지씨에스GKGLOBAL지케이글로벌BRCH비알씨에이치DNDN든든택배GONELO고넬로JCLSJCLSJWTNLJWTNLGS25GS편의점(퀵배달용)CUCU편의점(퀵배달용)

collectDeliveryMethoddeliveryMethod.pay-order-seller (string)배송 방법 코드. 250바이트 내외

코드설명비고DELIVERY택배, 등기, 소포GDFW_ISSUE_SVC굿스플로 송장 출력VISIT_RECEIPT방문 수령DIRECT_DELIVERY직접 전달QUICK_SVC퀵서비스NOTHING배송 없음RETURN_DESIGNATED지정 반품 택배RETURN_DELIVERY일반 반품 택배RETURN_INDIVIDUAL직접 반송RETURN_MERCHANT판매자 직접 수거(장보기 전용)UNKNOWN알 수 없음(예외 처리에 사용)
Example: DELIVERY

collectStatuscollectStatus.pay-order-seller (string)수거 상태. 250바이트 내외

코드설명비고NOT_REQUESTED수거 미요청COLLECT_REQUEST_TO_AGENT수거 지시 완료COLLECT_REQUEST_TO_DELIVERY_COMPANY수거 요청COLLECT_WAITING택배사 수거 예정DELIVERING수거 진행 중DELIVERED수거 완료DELIVERY_FAILED배송 실패COLLECT_FAILED수거 실패WRONG_INVOICE오류 송장COLLECT_CANCELED수거 취소
Example: NOT_REQUESTED

collectTrackingNumberstring수거 송장 번호. 100바이트 내외

etcFeeDemandAmountinteger기타 비용 청구액

etcFeePayMeansstring기타 비용 결제 수단. 100바이트 내외

etcFeePayMethodstring기타 비용 결제 방법. 100바이트 내외

exchangeDetailedReasonstring교환 상세 사유. 4000바이트 내외

exchangeReasonclaimReason.pay-order-seller (string)클레임 요청 사유. 250바이트 내외

코드설명비고INTENT_CHANGED구매 의사 취소COLOR_AND_SIZE색상 및 사이즈 변경WRONG_ORDER다른 상품 잘못 주문PRODUCT_UNSATISFIED서비스 불만족DELAYED_DELIVERY배송 지연SOLD_OUT상품 품절DROPPED_DELIVERY배송 누락NOT_YET_DELIVERY미배송BROKEN상품 파손INCORRECT_INFO상품 정보 상이WRONG_DELIVERY오배송WRONG_OPTION색상 등 다른 상품 잘못 배송SIMPLE_INTENT_CHANGED단순 변심MISTAKE_ORDER주문 실수ETC기타API 에서 지정 불가DELAYED_DELIVERY_BY_PURCHASER배송 지연INCORRECT_INFO_BY_PURCHASER상품 정보 상이PRODUCT_UNSATISFIED_BY_PURCHASER서비스 불만족NOT_YET_DISCUSSION상호 협의가 완료되지 않은 주문 건OUT_OF_STOCK재고 부족으로 인한 판매 불가SALE_INTENT_CHANGED판매 의사 변심으로 인한 거부NOT_YET_PAYMENT구매자의 미결제로 인한 거부NOT_YET_RECEIVE상품 미수취WRONG_DELAYED_DELIVERY오배송 및 지연BROKEN_AND_BAD파손 및 불량RECEIVING_DUE_DATE_OVER수락 기한 만료RECEIVER_MISMATCHED수신인 불일치GIFT_INTENT_CHANGED보내기 취소GIFT_REFUSAL선물 거절MINOR_RESTRICTED상품 수신 불가RECEIVING_BLOCKED상품 수신 불가UNDER_QUANTITY주문 수량 미달ASYNC_FAIL_PAYMENT결제 승인 실패ASYNC_LONG_WAIT_PAYMENT결제 승인 실패FAMILY_PAY_REJECTED패밀리결제 거절BUSINESSMALL_PAY_REJECTED관리자 결제 거절FAIL_PAYMENT결제 승인 실패

holdbackDetailedReasonstring보류 상세 사유. 4000바이트 내외

holdbackReasonholdbackReason.pay-order-seller (string)보류 유형. 250바이트 내외

코드설명비고RETURN_DELIVERYFEE반품 배송비 청구EXTRAFEEE추가 비용 청구RETURN_DELIVERYFEE_AND_EXTRAFEEE반품 배송비 + 추가 비용 청구RETURN_PRODUCT_NOT_DELIVERED반품 상품 미입고ETC기타 사유EXCHANGE_DELIVERYFEE교환 배송비 청구EXCHANGE_EXTRAFEE추가 교환 비용 청구EXCHANGE_PRODUCT_READY교환 상품 준비 중EXCHANGE_PRODUCT_NOT_DELIVERED교환 상품 미입고SELLER_CONFIRM_NEED판매자 확인 필요PURCHASER_CONFIRM_NEED구매자 확인 필요SELLER_REMIT판매자 직접 송금

holdbackStatusholdbackStatus.pay-order-seller (string)보류 상태. 250바이트 내외

코드설명비고HOLDBACK보류 중RELEASED보류 해제

reDeliveryMethoddeliveryMethod.pay-order-seller (string)배송 방법 코드. 250바이트 내외

코드설명비고DELIVERY택배, 등기, 소포GDFW_ISSUE_SVC굿스플로 송장 출력VISIT_RECEIPT방문 수령DIRECT_DELIVERY직접 전달QUICK_SVC퀵서비스NOTHING배송 없음RETURN_DESIGNATED지정 반품 택배RETURN_DELIVERY일반 반품 택배RETURN_INDIVIDUAL직접 반송RETURN_MERCHANT판매자 직접 수거(장보기 전용)UNKNOWN알 수 없음(예외 처리에 사용)
Example: DELIVERY

reDeliveryStatusdeliveryStatus.pay-order-seller (string)배송 상세 상태. 250바이트 내외

코드설명비고COLLECT_REQUEST수거 요청COLLECT_WAIT수거 대기COLLECT_CARGO집화DELIVERY_COMPLETION배송 완료DELIVERING배송중DELIVERY_FAIL배송 실패WRONG_INVOICE오류 송장COLLECT_CARGO_FAIL집화 실패COLLECT_CARGO_CANCEL집화 취소NOT_TRACKING배송 추적 없음
Example: COLLECT_REQUEST

reDeliveryCompanydeliveryCompanyCode.pay-order-seller (string)택배사 코드. 250바이트 내외

코드설명비고CJGLSCJ대한통운HYUNDAI롯데택배HANJIN한진택배KGB로젠택배EPOST우체국택배MTINTER엠티인터내셔널1004HOME1004HOMETWOFASTEXPRESS2FAST익스프레스ACEACEexpressACIEXPRESSACIADCAIRADC항운택배AIRWAYAIRWAY익스프레스APEXAPEXARAMEXARAMEXARGOARGOAIRBOYAirboyExpressKOREXGCJ대한통운(국제택배)CUPARCELCU편의점택배CWAYEXPRESSCwayExpressDHLDHLDHLDEDHL(독일)DHLGLOBALMAILDHLGlobalMailDPDDPDECMSEXPRESSECMSExpressEFSEFSEMSEMSEZUSAEZUSAEUROPARCELEuroParcelFEDEXFEDEXGOPGOP당일택배GOSGOS당일택배GPSLOGIXGPSLOGIXGSFRESHGSFreshGSIEXPRESSGSI익스프레스GSMNTONGSMNTONGSPOSTBOXGSPostbox퀵CVSNETGSPostbox택배GS더프레시GSTHEFRESHGTSLOGISGTS로지스HYBRIDHI택배HYHYIKIK물류KGLNETKGL네트웍스KTKT EXPRESSLGELG전자배송센터LTLLTLNDEXKOREANDEX KOREASBGLSSBGLSSFEXSFexpressSLXSLX택배SSGSSGTNTTNTLOGISPARTNERUFO로지스UPSUPSUSPSUSPSWIZWAWIZWAYJSWORLDYJS글로벌YJSYJS글로벌(영국)YUNDAYUNDAEXPRESSIPARCELi-parcelKY건영복합물류KUNYOUNG건영택배KDEXP경동택배KIN경인택배KORYO고려택배GDSP골드스넵스KOKUSAI국제익스프레스GOODTOLUCK굿투럭NAEUN나은물류NOGOK노곡물류NONGHYUP농협택배HANAROMART농협하나로마트DAELIM대림통운DAESIN대신택배DAEWOON대운글로벌THEBAO더바오DODOFLEX도도플렉스DONGGANG동강물류DONGJIN동진특송CHAINLOGIS두발히어로당일택배DRABBIT딜리래빗JMNP딜리박스ONEDAYLOGIS라스트마일LINEEXP라인익스프레스ROADSUNEXPRESS로드썬익스프레스LOGISVALLEY로지스밸리POOLATHOME로지스올홈케어(풀앳홈)LOTOS로토스HLCGLOBAL롯데글로벌로지스(국제택배)LOTTECHILSUNG롯데칠성MDLOGIS모든로지스(SLO)DASONG물류대장BABABA바바바로지스BANPOOM반품구조대VALEX발렉스SHIPNERGY배송하기좋은날PANTOSLX판토스VROONG부릉BRIDGE브릿지로지스EKDP삼다수가정배송SELC삼성전자물류SEORIM서림물류SWGEXP성원글로벌SUNGHUN성훈물류SEBANG세방택배SMARTLOGIS스마트로지스SPARKLE스파클직배송SPASYS1스페이시스원CRLX시알로지텍ANYTRACK애니트랙ABOUTPET어바웃펫ESTHER에스더쉬핑VENDORPIA벤더피아ACTCORE에이씨티앤코아HKHOLDINGS에이치케이홀딩스NTLPS엔티엘피스TODAYPICKUP카카오T당일배송RUSH오늘회러쉬ALLIN올인닷컴ALLTAKOREA올타코리아WIDETECH와이드테크YONGMA용마로지스DCOMMERCE우리동네커머스WEVILL우리동네택배HONAM우리택배WOORIHB우리한방택배WOOJIN우진인터로지스REGISTPOST우편등기WOONGJI웅지익스프레스WARPEX워펙스WINION위니온로지스WIHTYOU위드유당일택배WEMOVE위무브UFREIGHT유프레이트코리아EUNHA은하쉬핑INNOS이노스(올인닷컴)EMARTEVERYDAY이마트에브리데이ESTLA이스트라ETOMARS이투마스GENERALPOST일반우편ILSHIN일신모닝택배ILYANG일양로지스GNETWORK자이언트ZENIEL제니엘시스템JLOGIST제이로지스트GENIEGO지니고당일특급GDAKOREA지디에이코리아GHSPEED지에이치스피드JIKGUMOON직구문CHUNIL천일택배CHOROC초록마을(외부연동)CHOROCMAEUL초록마을(네이버직연동)COSHIP캐나다쉬핑KJT케이제이티QRUN큐런CUBEFLOW큐브플로우QXPRESS트랙스로지스HEREWEGO탱고앤고TOMATO토마토앱TODAY투데이TSG티에스지로지스TEAMFRESH팀프레시PATEK파테크해운상공XINPATEK파테크해운항공PANASIA판월드로지스틱PANSTAR팬스타국제특송(PIEX)FOREVER퍼레버택배PULMUONE풀무원(로지스밸리)FREDIT프레딧FRESHMATES프레시메이트KURLY컬리넥스트마일PINGPONG핑퐁HOWSER하우저HIVECITY하이브시티HANDALUM한달음택배HANDEX한덱스HANMI한미포스트HANSSEM한샘HANWOORI한우리물류HPL한의사랑택배HDEXP합동택배HERWUZUG허우적GLOVIS현대글로비스HOMEINNO홈이노베이션로지스HOMEPICKTODAY홈픽오늘도착HOMEPICK홈픽택배HOMEPLUSDELIVERY홈플러스HOMEPLUSEXPRESS홈플러스익스프레스CARGOPLEASE화물을부탁해HWATONG화통CH1기타택배LETUS바로스LETUS3PL레터스CASA신세계까사GCS지씨에스GKGLOBAL지케이글로벌BRCH비알씨에이치DNDN든든택배GONELO고넬로JCLSJCLSJWTNLJWTNLGS25GS편의점(퀵배달용)CUCU편의점(퀵배달용)

reDeliveryTrackingNumberstring재배송 송장 번호. 100바이트 내외

reDeliveryAddress 구매자 재배송지 주소 (object)addressTypeaddressType.pay-order-seller (string)배송지 타입. 250바이트 내외

코드설명비고DOMESTIC국내FOREIGN국외

baseAddressstring기본 주소. 300바이트 내외

citystring도시. 국내 주소에는 빈 문자열('')을 입력합니다. 300바이트 내외

countrystring국가. 45바이트 내외

detailedAddressstring상세 주소. 300바이트 내외

namestring이름. 150바이트 내외

statestring주(state). 국내 주소에는 빈 문자열('')을 입력합니다. 300바이트 내외

tel1string연락처 1. 45바이트 내외

tel2string연락처 2. 45바이트 내외

zipCodestring우편번호. 45바이트 내외

isRoadNameAddressboolean도로명 주소 여부. 8바이트 내외

requestChannelstring접수 채널. 100바이트 내외

requestQuantityinteger요청 수량

returnReceiveAddress 판매자 교환/반품 수취 주소 (object)addressTypeaddressType.pay-order-seller (string)배송지 타입. 250바이트 내외

코드설명비고DOMESTIC국내FOREIGN국외

baseAddressstring기본 주소. 300바이트 내외

citystring도시. 국내 주소에는 빈 문자열('')을 입력합니다. 300바이트 내외

countrystring국가. 45바이트 내외

detailedAddressstring상세 주소. 300바이트 내외

namestring이름. 150바이트 내외

statestring주(state). 국내 주소에는 빈 문자열('')을 입력합니다. 300바이트 내외

tel1string연락처 1. 45바이트 내외

tel2string연락처 2. 45바이트 내외

zipCodestring우편번호. 45바이트 내외

isRoadNameAddressboolean도로명 주소 여부. 8바이트 내외

logisticsCenterIdstring물류센터 ID. 60바이트

holdbackConfigDatestring<date-time>보류 설정일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

holdbackConfigurerstring보류 설정자(구매자/판매자/관리자/시스템). 100바이트 내외

holdbackReleaseDatestring<date-time>보류 해제일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

holdbackReleaserstring보류 해제자(구매자/판매자/관리자/시스템). 100바이트 내외

claimDeliveryFeeProductOrderIdsstring교환 배송비 묶음 청구 상품 주문 번호(여러 개면 쉼표로 구분). 4000바이트 내외

reDeliveryOperationDatestring<date-time>재배송 처리일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

claimDeliveryFeeDiscountAmountinteger교환 배송비 할인액

remoteAreaCostChargeAmountinteger교환 도서산간 배송비

membershipsArrivalGuaranteeClaimSupportingAmountinteger멤버십N배송 지원금액

exchangeImageUrlstring[]교환이미지 URL

claimDeliveryFeeSupportTypeclaimDeliveryFeeSupportType.pay-order-seller (string)클레임배송비지원타입

코드설명비고MEMBERSHIP_ARRIVAL_GUARANTEE멤버십도착보장MEMBERSHIP_KURLY멤버십컬리N마트

claimDeliveryFeeSupportAmountinteger클레임배송비지원금액

collectAttributeTypecollectAttributeType.pay-order-seller (string)수거 속성. 250바이트 내외

코드설명비고LOGISTICS_COLLECTNFA 수거LOGISTICS_NON_COLLECTNFA 미수거
Example: LOGISTICS_COLLECT

beforeClaim beforeClaimResponseContent.pay-order-seller (object)exchange exchangeResponseContent.pay-order-seller (object)claimIdstring클레임 번호. 20바이트 내외

claimDeliveryFeeDemandAmountinteger교환 배송비 청구액

claimDeliveryFeePayMeansstring교환 배송비 결제 수단. 100바이트 내외

claimDeliveryFeePayMethodstring교환 배송비 결제 방법. 100바이트 내외

claimRequestDatestring<date-time>클레임 요청일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

claimStatusclaimStatus.pay-order-seller (string)클레임 상태. 250바이트 내외

코드설명비고CANCEL_REQUEST취소 요청CANCELING취소 처리 중CANCEL_DONE취소 처리 완료CANCEL_REJECT취소 철회RETURN_REQUEST반품 요청EXCHANGE_REQUEST교환 요청COLLECTING수거 처리 중COLLECT_DONE수거 완료EXCHANGE_REDELIVERING교환 재배송 중RETURN_DONE반품 완료EXCHANGE_DONE교환 완료RETURN_REJECT반품 철회EXCHANGE_REJECT교환 철회PURCHASE_DECISION_HOLDBACK구매 확정 보류PURCHASE_DECISION_REQUEST구매 확정 요청PURCHASE_DECISION_HOLDBACK_RELEASE구매 확정 보류 해제ADMIN_CANCELING직권 취소 중ADMIN_CANCEL_DONE직권 취소 완료ADMIN_CANCEL_REJECT직권 취소 철회

collectAddress 구매자 수거지 주소 (object)addressTypeaddressType.pay-order-seller (string)배송지 타입. 250바이트 내외

코드설명비고DOMESTIC국내FOREIGN국외

baseAddressstring기본 주소. 300바이트 내외

citystring도시. 국내 주소에는 빈 문자열('')을 입력합니다. 300바이트 내외

countrystring국가. 45바이트 내외

detailedAddressstring상세 주소. 300바이트 내외

namestring이름. 150바이트 내외

statestring주(state). 국내 주소에는 빈 문자열('')을 입력합니다. 300바이트 내외

tel1string연락처 1. 45바이트 내외

tel2string연락처 2. 45바이트 내외

zipCodestring우편번호. 45바이트 내외

isRoadNameAddressboolean도로명 주소 여부. 8바이트 내외

collectCompletedDatestring<date-time>수거 완료일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

collectDeliveryCompanydeliveryCompanyCode.pay-order-seller (string)택배사 코드. 250바이트 내외

코드설명비고CJGLSCJ대한통운HYUNDAI롯데택배HANJIN한진택배KGB로젠택배EPOST우체국택배MTINTER엠티인터내셔널1004HOME1004HOMETWOFASTEXPRESS2FAST익스프레스ACEACEexpressACIEXPRESSACIADCAIRADC항운택배AIRWAYAIRWAY익스프레스APEXAPEXARAMEXARAMEXARGOARGOAIRBOYAirboyExpressKOREXGCJ대한통운(국제택배)CUPARCELCU편의점택배CWAYEXPRESSCwayExpressDHLDHLDHLDEDHL(독일)DHLGLOBALMAILDHLGlobalMailDPDDPDECMSEXPRESSECMSExpressEFSEFSEMSEMSEZUSAEZUSAEUROPARCELEuroParcelFEDEXFEDEXGOPGOP당일택배GOSGOS당일택배GPSLOGIXGPSLOGIXGSFRESHGSFreshGSIEXPRESSGSI익스프레스GSMNTONGSMNTONGSPOSTBOXGSPostbox퀵CVSNETGSPostbox택배GS더프레시GSTHEFRESHGTSLOGISGTS로지스HYBRIDHI택배HYHYIKIK물류KGLNETKGL네트웍스KTKT EXPRESSLGELG전자배송센터LTLLTLNDEXKOREANDEX KOREASBGLSSBGLSSFEXSFexpressSLXSLX택배SSGSSGTNTTNTLOGISPARTNERUFO로지스UPSUPSUSPSUSPSWIZWAWIZWAYJSWORLDYJS글로벌YJSYJS글로벌(영국)YUNDAYUNDAEXPRESSIPARCELi-parcelKY건영복합물류KUNYOUNG건영택배KDEXP경동택배KIN경인택배KORYO고려택배GDSP골드스넵스KOKUSAI국제익스프레스GOODTOLUCK굿투럭NAEUN나은물류NOGOK노곡물류NONGHYUP농협택배HANAROMART농협하나로마트DAELIM대림통운DAESIN대신택배DAEWOON대운글로벌THEBAO더바오DODOFLEX도도플렉스DONGGANG동강물류DONGJIN동진특송CHAINLOGIS두발히어로당일택배DRABBIT딜리래빗JMNP딜리박스ONEDAYLOGIS라스트마일LINEEXP라인익스프레스ROADSUNEXPRESS로드썬익스프레스LOGISVALLEY로지스밸리POOLATHOME로지스올홈케어(풀앳홈)LOTOS로토스HLCGLOBAL롯데글로벌로지스(국제택배)LOTTECHILSUNG롯데칠성MDLOGIS모든로지스(SLO)DASONG물류대장BABABA바바바로지스BANPOOM반품구조대VALEX발렉스SHIPNERGY배송하기좋은날PANTOSLX판토스VROONG부릉BRIDGE브릿지로지스EKDP삼다수가정배송SELC삼성전자물류SEORIM서림물류SWGEXP성원글로벌SUNGHUN성훈물류SEBANG세방택배SMARTLOGIS스마트로지스SPARKLE스파클직배송SPASYS1스페이시스원CRLX시알로지텍ANYTRACK애니트랙ABOUTPET어바웃펫ESTHER에스더쉬핑VENDORPIA벤더피아ACTCORE에이씨티앤코아HKHOLDINGS에이치케이홀딩스NTLPS엔티엘피스TODAYPICKUP카카오T당일배송RUSH오늘회러쉬ALLIN올인닷컴ALLTAKOREA올타코리아WIDETECH와이드테크YONGMA용마로지스DCOMMERCE우리동네커머스WEVILL우리동네택배HONAM우리택배WOORIHB우리한방택배WOOJIN우진인터로지스REGISTPOST우편등기WOONGJI웅지익스프레스WARPEX워펙스WINION위니온로지스WIHTYOU위드유당일택배WEMOVE위무브UFREIGHT유프레이트코리아EUNHA은하쉬핑INNOS이노스(올인닷컴)EMARTEVERYDAY이마트에브리데이ESTLA이스트라ETOMARS이투마스GENERALPOST일반우편ILSHIN일신모닝택배ILYANG일양로지스GNETWORK자이언트ZENIEL제니엘시스템JLOGIST제이로지스트GENIEGO지니고당일특급GDAKOREA지디에이코리아GHSPEED지에이치스피드JIKGUMOON직구문CHUNIL천일택배CHOROC초록마을(외부연동)CHOROCMAEUL초록마을(네이버직연동)COSHIP캐나다쉬핑KJT케이제이티QRUN큐런CUBEFLOW큐브플로우QXPRESS트랙스로지스HEREWEGO탱고앤고TOMATO토마토앱TODAY투데이TSG티에스지로지스TEAMFRESH팀프레시PATEK파테크해운상공XINPATEK파테크해운항공PANASIA판월드로지스틱PANSTAR팬스타국제특송(PIEX)FOREVER퍼레버택배PULMUONE풀무원(로지스밸리)FREDIT프레딧FRESHMATES프레시메이트KURLY컬리넥스트마일PINGPONG핑퐁HOWSER하우저HIVECITY하이브시티HANDALUM한달음택배HANDEX한덱스HANMI한미포스트HANSSEM한샘HANWOORI한우리물류HPL한의사랑택배HDEXP합동택배HERWUZUG허우적GLOVIS현대글로비스HOMEINNO홈이노베이션로지스HOMEPICKTODAY홈픽오늘도착HOMEPICK홈픽택배HOMEPLUSDELIVERY홈플러스HOMEPLUSEXPRESS홈플러스익스프레스CARGOPLEASE화물을부탁해HWATONG화통CH1기타택배LETUS바로스LETUS3PL레터스CASA신세계까사GCS지씨에스GKGLOBAL지케이글로벌BRCH비알씨에이치DNDN든든택배GONELO고넬로JCLSJCLSJWTNLJWTNLGS25GS편의점(퀵배달용)CUCU편의점(퀵배달용)

collectDeliveryMethoddeliveryMethod.pay-order-seller (string)배송 방법 코드. 250바이트 내외

코드설명비고DELIVERY택배, 등기, 소포GDFW_ISSUE_SVC굿스플로 송장 출력VISIT_RECEIPT방문 수령DIRECT_DELIVERY직접 전달QUICK_SVC퀵서비스NOTHING배송 없음RETURN_DESIGNATED지정 반품 택배RETURN_DELIVERY일반 반품 택배RETURN_INDIVIDUAL직접 반송RETURN_MERCHANT판매자 직접 수거(장보기 전용)UNKNOWN알 수 없음(예외 처리에 사용)
Example: DELIVERY

collectStatuscollectStatus.pay-order-seller (string)수거 상태. 250바이트 내외

코드설명비고NOT_REQUESTED수거 미요청COLLECT_REQUEST_TO_AGENT수거 지시 완료COLLECT_REQUEST_TO_DELIVERY_COMPANY수거 요청COLLECT_WAITING택배사 수거 예정DELIVERING수거 진행 중DELIVERED수거 완료DELIVERY_FAILED배송 실패COLLECT_FAILED수거 실패WRONG_INVOICE오류 송장COLLECT_CANCELED수거 취소
Example: NOT_REQUESTED

collectTrackingNumberstring수거 송장 번호. 100바이트 내외

etcFeeDemandAmountinteger기타 비용 청구액

etcFeePayMeansstring기타 비용 결제 수단. 100바이트 내외

etcFeePayMethodstring기타 비용 결제 방법. 100바이트 내외

exchangeDetailedReasonstring교환 상세 사유. 4000바이트 내외

exchangeReasonclaimReason.pay-order-seller (string)클레임 요청 사유. 250바이트 내외

코드설명비고INTENT_CHANGED구매 의사 취소COLOR_AND_SIZE색상 및 사이즈 변경WRONG_ORDER다른 상품 잘못 주문PRODUCT_UNSATISFIED서비스 불만족DELAYED_DELIVERY배송 지연SOLD_OUT상품 품절DROPPED_DELIVERY배송 누락NOT_YET_DELIVERY미배송BROKEN상품 파손INCORRECT_INFO상품 정보 상이WRONG_DELIVERY오배송WRONG_OPTION색상 등 다른 상품 잘못 배송SIMPLE_INTENT_CHANGED단순 변심MISTAKE_ORDER주문 실수ETC기타API 에서 지정 불가DELAYED_DELIVERY_BY_PURCHASER배송 지연INCORRECT_INFO_BY_PURCHASER상품 정보 상이PRODUCT_UNSATISFIED_BY_PURCHASER서비스 불만족NOT_YET_DISCUSSION상호 협의가 완료되지 않은 주문 건OUT_OF_STOCK재고 부족으로 인한 판매 불가SALE_INTENT_CHANGED판매 의사 변심으로 인한 거부NOT_YET_PAYMENT구매자의 미결제로 인한 거부NOT_YET_RECEIVE상품 미수취WRONG_DELAYED_DELIVERY오배송 및 지연BROKEN_AND_BAD파손 및 불량RECEIVING_DUE_DATE_OVER수락 기한 만료RECEIVER_MISMATCHED수신인 불일치GIFT_INTENT_CHANGED보내기 취소GIFT_REFUSAL선물 거절MINOR_RESTRICTED상품 수신 불가RECEIVING_BLOCKED상품 수신 불가UNDER_QUANTITY주문 수량 미달ASYNC_FAIL_PAYMENT결제 승인 실패ASYNC_LONG_WAIT_PAYMENT결제 승인 실패FAMILY_PAY_REJECTED패밀리결제 거절BUSINESSMALL_PAY_REJECTED관리자 결제 거절FAIL_PAYMENT결제 승인 실패

holdbackDetailedReasonstring보류 상세 사유. 4000바이트 내외

holdbackReasonholdbackReason.pay-order-seller (string)보류 유형. 250바이트 내외

코드설명비고RETURN_DELIVERYFEE반품 배송비 청구EXTRAFEEE추가 비용 청구RETURN_DELIVERYFEE_AND_EXTRAFEEE반품 배송비 + 추가 비용 청구RETURN_PRODUCT_NOT_DELIVERED반품 상품 미입고ETC기타 사유EXCHANGE_DELIVERYFEE교환 배송비 청구EXCHANGE_EXTRAFEE추가 교환 비용 청구EXCHANGE_PRODUCT_READY교환 상품 준비 중EXCHANGE_PRODUCT_NOT_DELIVERED교환 상품 미입고SELLER_CONFIRM_NEED판매자 확인 필요PURCHASER_CONFIRM_NEED구매자 확인 필요SELLER_REMIT판매자 직접 송금

holdbackStatusholdbackStatus.pay-order-seller (string)보류 상태. 250바이트 내외

코드설명비고HOLDBACK보류 중RELEASED보류 해제

reDeliveryMethoddeliveryMethod.pay-order-seller (string)배송 방법 코드. 250바이트 내외

코드설명비고DELIVERY택배, 등기, 소포GDFW_ISSUE_SVC굿스플로 송장 출력VISIT_RECEIPT방문 수령DIRECT_DELIVERY직접 전달QUICK_SVC퀵서비스NOTHING배송 없음RETURN_DESIGNATED지정 반품 택배RETURN_DELIVERY일반 반품 택배RETURN_INDIVIDUAL직접 반송RETURN_MERCHANT판매자 직접 수거(장보기 전용)UNKNOWN알 수 없음(예외 처리에 사용)
Example: DELIVERY

reDeliveryStatusdeliveryStatus.pay-order-seller (string)배송 상세 상태. 250바이트 내외

코드설명비고COLLECT_REQUEST수거 요청COLLECT_WAIT수거 대기COLLECT_CARGO집화DELIVERY_COMPLETION배송 완료DELIVERING배송중DELIVERY_FAIL배송 실패WRONG_INVOICE오류 송장COLLECT_CARGO_FAIL집화 실패COLLECT_CARGO_CANCEL집화 취소NOT_TRACKING배송 추적 없음
Example: COLLECT_REQUEST

reDeliveryCompanydeliveryCompanyCode.pay-order-seller (string)택배사 코드. 250바이트 내외

코드설명비고CJGLSCJ대한통운HYUNDAI롯데택배HANJIN한진택배KGB로젠택배EPOST우체국택배MTINTER엠티인터내셔널1004HOME1004HOMETWOFASTEXPRESS2FAST익스프레스ACEACEexpressACIEXPRESSACIADCAIRADC항운택배AIRWAYAIRWAY익스프레스APEXAPEXARAMEXARAMEXARGOARGOAIRBOYAirboyExpressKOREXGCJ대한통운(국제택배)CUPARCELCU편의점택배CWAYEXPRESSCwayExpressDHLDHLDHLDEDHL(독일)DHLGLOBALMAILDHLGlobalMailDPDDPDECMSEXPRESSECMSExpressEFSEFSEMSEMSEZUSAEZUSAEUROPARCELEuroParcelFEDEXFEDEXGOPGOP당일택배GOSGOS당일택배GPSLOGIXGPSLOGIXGSFRESHGSFreshGSIEXPRESSGSI익스프레스GSMNTONGSMNTONGSPOSTBOXGSPostbox퀵CVSNETGSPostbox택배GS더프레시GSTHEFRESHGTSLOGISGTS로지스HYBRIDHI택배HYHYIKIK물류KGLNETKGL네트웍스KTKT EXPRESSLGELG전자배송센터LTLLTLNDEXKOREANDEX KOREASBGLSSBGLSSFEXSFexpressSLXSLX택배SSGSSGTNTTNTLOGISPARTNERUFO로지스UPSUPSUSPSUSPSWIZWAWIZWAYJSWORLDYJS글로벌YJSYJS글로벌(영국)YUNDAYUNDAEXPRESSIPARCELi-parcelKY건영복합물류KUNYOUNG건영택배KDEXP경동택배KIN경인택배KORYO고려택배GDSP골드스넵스KOKUSAI국제익스프레스GOODTOLUCK굿투럭NAEUN나은물류NOGOK노곡물류NONGHYUP농협택배HANAROMART농협하나로마트DAELIM대림통운DAESIN대신택배DAEWOON대운글로벌THEBAO더바오DODOFLEX도도플렉스DONGGANG동강물류DONGJIN동진특송CHAINLOGIS두발히어로당일택배DRABBIT딜리래빗JMNP딜리박스ONEDAYLOGIS라스트마일LINEEXP라인익스프레스ROADSUNEXPRESS로드썬익스프레스LOGISVALLEY로지스밸리POOLATHOME로지스올홈케어(풀앳홈)LOTOS로토스HLCGLOBAL롯데글로벌로지스(국제택배)LOTTECHILSUNG롯데칠성MDLOGIS모든로지스(SLO)DASONG물류대장BABABA바바바로지스BANPOOM반품구조대VALEX발렉스SHIPNERGY배송하기좋은날PANTOSLX판토스VROONG부릉BRIDGE브릿지로지스EKDP삼다수가정배송SELC삼성전자물류SEORIM서림물류SWGEXP성원글로벌SUNGHUN성훈물류SEBANG세방택배SMARTLOGIS스마트로지스SPARKLE스파클직배송SPASYS1스페이시스원CRLX시알로지텍ANYTRACK애니트랙ABOUTPET어바웃펫ESTHER에스더쉬핑VENDORPIA벤더피아ACTCORE에이씨티앤코아HKHOLDINGS에이치케이홀딩스NTLPS엔티엘피스TODAYPICKUP카카오T당일배송RUSH오늘회러쉬ALLIN올인닷컴ALLTAKOREA올타코리아WIDETECH와이드테크YONGMA용마로지스DCOMMERCE우리동네커머스WEVILL우리동네택배HONAM우리택배WOORIHB우리한방택배WOOJIN우진인터로지스REGISTPOST우편등기WOONGJI웅지익스프레스WARPEX워펙스WINION위니온로지스WIHTYOU위드유당일택배WEMOVE위무브UFREIGHT유프레이트코리아EUNHA은하쉬핑INNOS이노스(올인닷컴)EMARTEVERYDAY이마트에브리데이ESTLA이스트라ETOMARS이투마스GENERALPOST일반우편ILSHIN일신모닝택배ILYANG일양로지스GNETWORK자이언트ZENIEL제니엘시스템JLOGIST제이로지스트GENIEGO지니고당일특급GDAKOREA지디에이코리아GHSPEED지에이치스피드JIKGUMOON직구문CHUNIL천일택배CHOROC초록마을(외부연동)CHOROCMAEUL초록마을(네이버직연동)COSHIP캐나다쉬핑KJT케이제이티QRUN큐런CUBEFLOW큐브플로우QXPRESS트랙스로지스HEREWEGO탱고앤고TOMATO토마토앱TODAY투데이TSG티에스지로지스TEAMFRESH팀프레시PATEK파테크해운상공XINPATEK파테크해운항공PANASIA판월드로지스틱PANSTAR팬스타국제특송(PIEX)FOREVER퍼레버택배PULMUONE풀무원(로지스밸리)FREDIT프레딧FRESHMATES프레시메이트KURLY컬리넥스트마일PINGPONG핑퐁HOWSER하우저HIVECITY하이브시티HANDALUM한달음택배HANDEX한덱스HANMI한미포스트HANSSEM한샘HANWOORI한우리물류HPL한의사랑택배HDEXP합동택배HERWUZUG허우적GLOVIS현대글로비스HOMEINNO홈이노베이션로지스HOMEPICKTODAY홈픽오늘도착HOMEPICK홈픽택배HOMEPLUSDELIVERY홈플러스HOMEPLUSEXPRESS홈플러스익스프레스CARGOPLEASE화물을부탁해HWATONG화통CH1기타택배LETUS바로스LETUS3PL레터스CASA신세계까사GCS지씨에스GKGLOBAL지케이글로벌BRCH비알씨에이치DNDN든든택배GONELO고넬로JCLSJCLSJWTNLJWTNLGS25GS편의점(퀵배달용)CUCU편의점(퀵배달용)

reDeliveryTrackingNumberstring재배송 송장 번호. 100바이트 내외

reDeliveryAddress 구매자 재배송지 주소 (object)addressTypeaddressType.pay-order-seller (string)배송지 타입. 250바이트 내외

코드설명비고DOMESTIC국내FOREIGN국외

baseAddressstring기본 주소. 300바이트 내외

citystring도시. 국내 주소에는 빈 문자열('')을 입력합니다. 300바이트 내외

countrystring국가. 45바이트 내외

detailedAddressstring상세 주소. 300바이트 내외

namestring이름. 150바이트 내외

statestring주(state). 국내 주소에는 빈 문자열('')을 입력합니다. 300바이트 내외

tel1string연락처 1. 45바이트 내외

tel2string연락처 2. 45바이트 내외

zipCodestring우편번호. 45바이트 내외

isRoadNameAddressboolean도로명 주소 여부. 8바이트 내외

requestChannelstring접수 채널. 100바이트 내외

requestQuantityinteger요청 수량

returnReceiveAddress 판매자 교환/반품 수취 주소 (object)addressTypeaddressType.pay-order-seller (string)배송지 타입. 250바이트 내외

코드설명비고DOMESTIC국내FOREIGN국외

baseAddressstring기본 주소. 300바이트 내외

citystring도시. 국내 주소에는 빈 문자열('')을 입력합니다. 300바이트 내외

countrystring국가. 45바이트 내외

detailedAddressstring상세 주소. 300바이트 내외

namestring이름. 150바이트 내외

statestring주(state). 국내 주소에는 빈 문자열('')을 입력합니다. 300바이트 내외

tel1string연락처 1. 45바이트 내외

tel2string연락처 2. 45바이트 내외

zipCodestring우편번호. 45바이트 내외

isRoadNameAddressboolean도로명 주소 여부. 8바이트 내외

logisticsCenterIdstring물류센터 ID. 60바이트

holdbackConfigDatestring<date-time>보류 설정일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

holdbackConfigurerstring보류 설정자(구매자/판매자/관리자/시스템). 100바이트 내외

holdbackReleaseDatestring<date-time>보류 해제일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

holdbackReleaserstring보류 해제자(구매자/판매자/관리자/시스템). 100바이트 내외

claimDeliveryFeeProductOrderIdsstring교환 배송비 묶음 청구 상품 주문 번호(여러 개면 쉼표로 구분). 4000바이트 내외

reDeliveryOperationDatestring<date-time>재배송 처리일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

claimDeliveryFeeDiscountAmountinteger교환 배송비 할인액

remoteAreaCostChargeAmountinteger교환 도서산간 배송비

membershipsArrivalGuaranteeClaimSupportingAmountinteger멤버십N배송 지원금액

exchangeImageUrlstring[]교환이미지 URL

claimDeliveryFeeSupportTypeclaimDeliveryFeeSupportType.pay-order-seller (string)클레임배송비지원타입

코드설명비고MEMBERSHIP_ARRIVAL_GUARANTEE멤버십도착보장MEMBERSHIP_KURLY멤버십컬리N마트

claimDeliveryFeeSupportAmountinteger클레임배송비지원금액

collectAttributeTypecollectAttributeType.pay-order-seller (string)수거 속성. 250바이트 내외

코드설명비고LOGISTICS_COLLECTNFA 수거LOGISTICS_NON_COLLECTNFA 미수거
Example: LOGISTICS_COLLECT

currentClaim currentClaimResponseContent.pay-order-seller (object)cancel cancelResponseContent.pay-order-seller (object)claimIdstring클레임 번호. 20바이트 내외

cancelApprovalDatestring<date-time>취소 승인일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

cancelCompletedDatestring<date-time>취소 완료일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

cancelDetailedReasonstring취소 상세 사유. 4000바이트 내외

cancelReasonclaimReason.pay-order-seller (string)클레임 요청 사유. 250바이트 내외

코드설명비고INTENT_CHANGED구매 의사 취소COLOR_AND_SIZE색상 및 사이즈 변경WRONG_ORDER다른 상품 잘못 주문PRODUCT_UNSATISFIED서비스 불만족DELAYED_DELIVERY배송 지연SOLD_OUT상품 품절DROPPED_DELIVERY배송 누락NOT_YET_DELIVERY미배송BROKEN상품 파손INCORRECT_INFO상품 정보 상이WRONG_DELIVERY오배송WRONG_OPTION색상 등 다른 상품 잘못 배송SIMPLE_INTENT_CHANGED단순 변심MISTAKE_ORDER주문 실수ETC기타API 에서 지정 불가DELAYED_DELIVERY_BY_PURCHASER배송 지연INCORRECT_INFO_BY_PURCHASER상품 정보 상이PRODUCT_UNSATISFIED_BY_PURCHASER서비스 불만족NOT_YET_DISCUSSION상호 협의가 완료되지 않은 주문 건OUT_OF_STOCK재고 부족으로 인한 판매 불가SALE_INTENT_CHANGED판매 의사 변심으로 인한 거부NOT_YET_PAYMENT구매자의 미결제로 인한 거부NOT_YET_RECEIVE상품 미수취WRONG_DELAYED_DELIVERY오배송 및 지연BROKEN_AND_BAD파손 및 불량RECEIVING_DUE_DATE_OVER수락 기한 만료RECEIVER_MISMATCHED수신인 불일치GIFT_INTENT_CHANGED보내기 취소GIFT_REFUSAL선물 거절MINOR_RESTRICTED상품 수신 불가RECEIVING_BLOCKED상품 수신 불가UNDER_QUANTITY주문 수량 미달ASYNC_FAIL_PAYMENT결제 승인 실패ASYNC_LONG_WAIT_PAYMENT결제 승인 실패FAMILY_PAY_REJECTED패밀리결제 거절BUSINESSMALL_PAY_REJECTED관리자 결제 거절FAIL_PAYMENT결제 승인 실패

claimRequestDatestring<date-time>클레임 요청일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

claimStatusclaimStatus.pay-order-seller (string)클레임 상태. 250바이트 내외

코드설명비고CANCEL_REQUEST취소 요청CANCELING취소 처리 중CANCEL_DONE취소 처리 완료CANCEL_REJECT취소 철회RETURN_REQUEST반품 요청EXCHANGE_REQUEST교환 요청COLLECTING수거 처리 중COLLECT_DONE수거 완료EXCHANGE_REDELIVERING교환 재배송 중RETURN_DONE반품 완료EXCHANGE_DONE교환 완료RETURN_REJECT반품 철회EXCHANGE_REJECT교환 철회PURCHASE_DECISION_HOLDBACK구매 확정 보류PURCHASE_DECISION_REQUEST구매 확정 요청PURCHASE_DECISION_HOLDBACK_RELEASE구매 확정 보류 해제ADMIN_CANCELING직권 취소 중ADMIN_CANCEL_DONE직권 취소 완료ADMIN_CANCEL_REJECT직권 취소 철회

refundExpectedDatestring<date-time>환불 예정일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

refundStandbyReasonstring환불 대기 사유. 300바이트 내외

refundStandbyStatusstring환불 대기 상태. 100바이트 내외

requestChannelstring접수 채널. 100바이트 내외

requestQuantityinteger요청 수량

return returnResponseContent.pay-order-seller (object)claimIdstring클레임 번호. 20바이트 내외

claimDeliveryFeeDemandAmountinteger반품 배송비 청구액

claimDeliveryFeePayMeansstring반품 배송비 결제 수단. 250바이트 내외

claimDeliveryFeePayMethodstring반품 배송비 결제 방법. 250바이트 내외

claimRequestDatestring<date-time>클레임 요청일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

claimStatusclaimStatus.pay-order-seller (string)클레임 상태. 250바이트 내외

코드설명비고CANCEL_REQUEST취소 요청CANCELING취소 처리 중CANCEL_DONE취소 처리 완료CANCEL_REJECT취소 철회RETURN_REQUEST반품 요청EXCHANGE_REQUEST교환 요청COLLECTING수거 처리 중COLLECT_DONE수거 완료EXCHANGE_REDELIVERING교환 재배송 중RETURN_DONE반품 완료EXCHANGE_DONE교환 완료RETURN_REJECT반품 철회EXCHANGE_REJECT교환 철회PURCHASE_DECISION_HOLDBACK구매 확정 보류PURCHASE_DECISION_REQUEST구매 확정 요청PURCHASE_DECISION_HOLDBACK_RELEASE구매 확정 보류 해제ADMIN_CANCELING직권 취소 중ADMIN_CANCEL_DONE직권 취소 완료ADMIN_CANCEL_REJECT직권 취소 철회

collectAddress 구매자 수거지 주소 (object)addressTypeaddressType.pay-order-seller (string)배송지 타입. 250바이트 내외

코드설명비고DOMESTIC국내FOREIGN국외

baseAddressstring기본 주소. 300바이트 내외

citystring도시. 국내 주소에는 빈 문자열('')을 입력합니다. 300바이트 내외

countrystring국가. 45바이트 내외

detailedAddressstring상세 주소. 300바이트 내외

namestring이름. 150바이트 내외

statestring주(state). 국내 주소에는 빈 문자열('')을 입력합니다. 300바이트 내외

tel1string연락처 1. 45바이트 내외

tel2string연락처 2. 45바이트 내외

zipCodestring우편번호. 45바이트 내외

isRoadNameAddressboolean도로명 주소 여부. 8바이트 내외

collectCompletedDatestring<date-time>수거 완료일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

collectDeliveryCompanydeliveryCompanyCode.pay-order-seller (string)택배사 코드. 250바이트 내외

코드설명비고CJGLSCJ대한통운HYUNDAI롯데택배HANJIN한진택배KGB로젠택배EPOST우체국택배MTINTER엠티인터내셔널1004HOME1004HOMETWOFASTEXPRESS2FAST익스프레스ACEACEexpressACIEXPRESSACIADCAIRADC항운택배AIRWAYAIRWAY익스프레스APEXAPEXARAMEXARAMEXARGOARGOAIRBOYAirboyExpressKOREXGCJ대한통운(국제택배)CUPARCELCU편의점택배CWAYEXPRESSCwayExpressDHLDHLDHLDEDHL(독일)DHLGLOBALMAILDHLGlobalMailDPDDPDECMSEXPRESSECMSExpressEFSEFSEMSEMSEZUSAEZUSAEUROPARCELEuroParcelFEDEXFEDEXGOPGOP당일택배GOSGOS당일택배GPSLOGIXGPSLOGIXGSFRESHGSFreshGSIEXPRESSGSI익스프레스GSMNTONGSMNTONGSPOSTBOXGSPostbox퀵CVSNETGSPostbox택배GS더프레시GSTHEFRESHGTSLOGISGTS로지스HYBRIDHI택배HYHYIKIK물류KGLNETKGL네트웍스KTKT EXPRESSLGELG전자배송센터LTLLTLNDEXKOREANDEX KOREASBGLSSBGLSSFEXSFexpressSLXSLX택배SSGSSGTNTTNTLOGISPARTNERUFO로지스UPSUPSUSPSUSPSWIZWAWIZWAYJSWORLDYJS글로벌YJSYJS글로벌(영국)YUNDAYUNDAEXPRESSIPARCELi-parcelKY건영복합물류KUNYOUNG건영택배KDEXP경동택배KIN경인택배KORYO고려택배GDSP골드스넵스KOKUSAI국제익스프레스GOODTOLUCK굿투럭NAEUN나은물류NOGOK노곡물류NONGHYUP농협택배HANAROMART농협하나로마트DAELIM대림통운DAESIN대신택배DAEWOON대운글로벌THEBAO더바오DODOFLEX도도플렉스DONGGANG동강물류DONGJIN동진특송CHAINLOGIS두발히어로당일택배DRABBIT딜리래빗JMNP딜리박스ONEDAYLOGIS라스트마일LINEEXP라인익스프레스ROADSUNEXPRESS로드썬익스프레스LOGISVALLEY로지스밸리POOLATHOME로지스올홈케어(풀앳홈)LOTOS로토스HLCGLOBAL롯데글로벌로지스(국제택배)LOTTECHILSUNG롯데칠성MDLOGIS모든로지스(SLO)DASONG물류대장BABABA바바바로지스BANPOOM반품구조대VALEX발렉스SHIPNERGY배송하기좋은날PANTOSLX판토스VROONG부릉BRIDGE브릿지로지스EKDP삼다수가정배송SELC삼성전자물류SEORIM서림물류SWGEXP성원글로벌SUNGHUN성훈물류SEBANG세방택배SMARTLOGIS스마트로지스SPARKLE스파클직배송SPASYS1스페이시스원CRLX시알로지텍ANYTRACK애니트랙ABOUTPET어바웃펫ESTHER에스더쉬핑VENDORPIA벤더피아ACTCORE에이씨티앤코아HKHOLDINGS에이치케이홀딩스NTLPS엔티엘피스TODAYPICKUP카카오T당일배송RUSH오늘회러쉬ALLIN올인닷컴ALLTAKOREA올타코리아WIDETECH와이드테크YONGMA용마로지스DCOMMERCE우리동네커머스WEVILL우리동네택배HONAM우리택배WOORIHB우리한방택배WOOJIN우진인터로지스REGISTPOST우편등기WOONGJI웅지익스프레스WARPEX워펙스WINION위니온로지스WIHTYOU위드유당일택배WEMOVE위무브UFREIGHT유프레이트코리아EUNHA은하쉬핑INNOS이노스(올인닷컴)EMARTEVERYDAY이마트에브리데이ESTLA이스트라ETOMARS이투마스GENERALPOST일반우편ILSHIN일신모닝택배ILYANG일양로지스GNETWORK자이언트ZENIEL제니엘시스템JLOGIST제이로지스트GENIEGO지니고당일특급GDAKOREA지디에이코리아GHSPEED지에이치스피드JIKGUMOON직구문CHUNIL천일택배CHOROC초록마을(외부연동)CHOROCMAEUL초록마을(네이버직연동)COSHIP캐나다쉬핑KJT케이제이티QRUN큐런CUBEFLOW큐브플로우QXPRESS트랙스로지스HEREWEGO탱고앤고TOMATO토마토앱TODAY투데이TSG티에스지로지스TEAMFRESH팀프레시PATEK파테크해운상공XINPATEK파테크해운항공PANASIA판월드로지스틱PANSTAR팬스타국제특송(PIEX)FOREVER퍼레버택배PULMUONE풀무원(로지스밸리)FREDIT프레딧FRESHMATES프레시메이트KURLY컬리넥스트마일PINGPONG핑퐁HOWSER하우저HIVECITY하이브시티HANDALUM한달음택배HANDEX한덱스HANMI한미포스트HANSSEM한샘HANWOORI한우리물류HPL한의사랑택배HDEXP합동택배HERWUZUG허우적GLOVIS현대글로비스HOMEINNO홈이노베이션로지스HOMEPICKTODAY홈픽오늘도착HOMEPICK홈픽택배HOMEPLUSDELIVERY홈플러스HOMEPLUSEXPRESS홈플러스익스프레스CARGOPLEASE화물을부탁해HWATONG화통CH1기타택배LETUS바로스LETUS3PL레터스CASA신세계까사GCS지씨에스GKGLOBAL지케이글로벌BRCH비알씨에이치DNDN든든택배GONELO고넬로JCLSJCLSJWTNLJWTNLGS25GS편의점(퀵배달용)CUCU편의점(퀵배달용)

collectDeliveryMethoddeliveryMethod.pay-order-seller (string)배송 방법 코드. 250바이트 내외

코드설명비고DELIVERY택배, 등기, 소포GDFW_ISSUE_SVC굿스플로 송장 출력VISIT_RECEIPT방문 수령DIRECT_DELIVERY직접 전달QUICK_SVC퀵서비스NOTHING배송 없음RETURN_DESIGNATED지정 반품 택배RETURN_DELIVERY일반 반품 택배RETURN_INDIVIDUAL직접 반송RETURN_MERCHANT판매자 직접 수거(장보기 전용)UNKNOWN알 수 없음(예외 처리에 사용)
Example: DELIVERY

collectStatuscollectStatus.pay-order-seller (string)수거 상태. 250바이트 내외

코드설명비고NOT_REQUESTED수거 미요청COLLECT_REQUEST_TO_AGENT수거 지시 완료COLLECT_REQUEST_TO_DELIVERY_COMPANY수거 요청COLLECT_WAITING택배사 수거 예정DELIVERING수거 진행 중DELIVERED수거 완료DELIVERY_FAILED배송 실패COLLECT_FAILED수거 실패WRONG_INVOICE오류 송장COLLECT_CANCELED수거 취소
Example: NOT_REQUESTED

collectTrackingNumberstring수거 송장 번호. 100바이트 내외

etcFeeDemandAmountinteger기타 비용 청구액

etcFeePayMeansstring기타 비용 결제 수단. 250바이트 내외

etcFeePayMethodstring기타 비용 결제 방법. 250바이트 내외

holdbackDetailedReasonstring보류 상세 사유. 4000바이트 내외

holdbackReasonholdbackReason.pay-order-seller (string)보류 유형. 250바이트 내외

코드설명비고RETURN_DELIVERYFEE반품 배송비 청구EXTRAFEEE추가 비용 청구RETURN_DELIVERYFEE_AND_EXTRAFEEE반품 배송비 + 추가 비용 청구RETURN_PRODUCT_NOT_DELIVERED반품 상품 미입고ETC기타 사유EXCHANGE_DELIVERYFEE교환 배송비 청구EXCHANGE_EXTRAFEE추가 교환 비용 청구EXCHANGE_PRODUCT_READY교환 상품 준비 중EXCHANGE_PRODUCT_NOT_DELIVERED교환 상품 미입고SELLER_CONFIRM_NEED판매자 확인 필요PURCHASER_CONFIRM_NEED구매자 확인 필요SELLER_REMIT판매자 직접 송금

holdbackStatusholdbackStatus.pay-order-seller (string)보류 상태. 250바이트 내외

코드설명비고HOLDBACK보류 중RELEASED보류 해제

refundExpectedDatestring<date-time>환불 예정일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

refundStandbyReasonstring환불 대기 사유. 250바이트 내외

refundStandbyStatusstring환불 대기 상태. 250바이트 내외

requestChannelstring접수 채널. 250바이트 내외

requestQuantityinteger요청 수량

returnDetailedReasonstring반품 상세 사유. 4000바이트 내외

returnReasonclaimReason.pay-order-seller (string)클레임 요청 사유. 250바이트 내외

코드설명비고INTENT_CHANGED구매 의사 취소COLOR_AND_SIZE색상 및 사이즈 변경WRONG_ORDER다른 상품 잘못 주문PRODUCT_UNSATISFIED서비스 불만족DELAYED_DELIVERY배송 지연SOLD_OUT상품 품절DROPPED_DELIVERY배송 누락NOT_YET_DELIVERY미배송BROKEN상품 파손INCORRECT_INFO상품 정보 상이WRONG_DELIVERY오배송WRONG_OPTION색상 등 다른 상품 잘못 배송SIMPLE_INTENT_CHANGED단순 변심MISTAKE_ORDER주문 실수ETC기타API 에서 지정 불가DELAYED_DELIVERY_BY_PURCHASER배송 지연INCORRECT_INFO_BY_PURCHASER상품 정보 상이PRODUCT_UNSATISFIED_BY_PURCHASER서비스 불만족NOT_YET_DISCUSSION상호 협의가 완료되지 않은 주문 건OUT_OF_STOCK재고 부족으로 인한 판매 불가SALE_INTENT_CHANGED판매 의사 변심으로 인한 거부NOT_YET_PAYMENT구매자의 미결제로 인한 거부NOT_YET_RECEIVE상품 미수취WRONG_DELAYED_DELIVERY오배송 및 지연BROKEN_AND_BAD파손 및 불량RECEIVING_DUE_DATE_OVER수락 기한 만료RECEIVER_MISMATCHED수신인 불일치GIFT_INTENT_CHANGED보내기 취소GIFT_REFUSAL선물 거절MINOR_RESTRICTED상품 수신 불가RECEIVING_BLOCKED상품 수신 불가UNDER_QUANTITY주문 수량 미달ASYNC_FAIL_PAYMENT결제 승인 실패ASYNC_LONG_WAIT_PAYMENT결제 승인 실패FAMILY_PAY_REJECTED패밀리결제 거절BUSINESSMALL_PAY_REJECTED관리자 결제 거절FAIL_PAYMENT결제 승인 실패

returnReceiveAddress 판매자 교환/반품 수취 주소 (object)addressTypeaddressType.pay-order-seller (string)배송지 타입. 250바이트 내외

코드설명비고DOMESTIC국내FOREIGN국외

baseAddressstring기본 주소. 300바이트 내외

citystring도시. 국내 주소에는 빈 문자열('')을 입력합니다. 300바이트 내외

countrystring국가. 45바이트 내외

detailedAddressstring상세 주소. 300바이트 내외

namestring이름. 150바이트 내외

statestring주(state). 국내 주소에는 빈 문자열('')을 입력합니다. 300바이트 내외

tel1string연락처 1. 45바이트 내외

tel2string연락처 2. 45바이트 내외

zipCodestring우편번호. 45바이트 내외

isRoadNameAddressboolean도로명 주소 여부. 8바이트 내외

logisticsCenterIdstring물류센터 ID. 60바이트

returnCompletedDatestring<date-time>반품 완료일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

holdbackConfigDatestring<date-time>보류 설정일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

holdbackConfigurerstring보류 설정자(구매자/판매자/관리자/시스템). 250바이트 내외

holdbackReleaseDatestring<date-time>보류 해제일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

holdbackReleaserstring보류 해제자(구매자/판매자/관리자/시스템). 250바이트 내외

claimDeliveryFeeProductOrderIdsstring반품 배송비 묶음 청구 상품 주문 번호(여러 개면 쉼표로 구분). 4000바이트 내외

claimDeliveryFeeDiscountAmountinteger반품 배송비 할인액

remoteAreaCostChargeAmountinteger반품 도서산간 배송비

membershipsArrivalGuaranteeClaimSupportingAmountinteger멤버십N배송 지원금액

returnImageUrlstring[]반품이미지 URL

claimDeliveryFeeSupportTypeclaimDeliveryFeeSupportType.pay-order-seller (string)클레임배송비지원타입

코드설명비고MEMBERSHIP_ARRIVAL_GUARANTEE멤버십도착보장MEMBERSHIP_KURLY멤버십컬리N마트

claimDeliveryFeeSupportAmountinteger클레임배송비지원금액

collectAttributeTypecollectAttributeType.pay-order-seller (string)수거 속성. 250바이트 내외

코드설명비고LOGISTICS_COLLECTNFA 수거LOGISTICS_NON_COLLECTNFA 미수거
Example: LOGISTICS_COLLECT

exchange exchangeResponseContent.pay-order-seller (object)claimIdstring클레임 번호. 20바이트 내외

claimDeliveryFeeDemandAmountinteger교환 배송비 청구액

claimDeliveryFeePayMeansstring교환 배송비 결제 수단. 100바이트 내외

claimDeliveryFeePayMethodstring교환 배송비 결제 방법. 100바이트 내외

claimRequestDatestring<date-time>클레임 요청일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

claimStatusclaimStatus.pay-order-seller (string)클레임 상태. 250바이트 내외

코드설명비고CANCEL_REQUEST취소 요청CANCELING취소 처리 중CANCEL_DONE취소 처리 완료CANCEL_REJECT취소 철회RETURN_REQUEST반품 요청EXCHANGE_REQUEST교환 요청COLLECTING수거 처리 중COLLECT_DONE수거 완료EXCHANGE_REDELIVERING교환 재배송 중RETURN_DONE반품 완료EXCHANGE_DONE교환 완료RETURN_REJECT반품 철회EXCHANGE_REJECT교환 철회PURCHASE_DECISION_HOLDBACK구매 확정 보류PURCHASE_DECISION_REQUEST구매 확정 요청PURCHASE_DECISION_HOLDBACK_RELEASE구매 확정 보류 해제ADMIN_CANCELING직권 취소 중ADMIN_CANCEL_DONE직권 취소 완료ADMIN_CANCEL_REJECT직권 취소 철회

collectAddress 구매자 수거지 주소 (object)addressTypeaddressType.pay-order-seller (string)배송지 타입. 250바이트 내외

코드설명비고DOMESTIC국내FOREIGN국외

baseAddressstring기본 주소. 300바이트 내외

citystring도시. 국내 주소에는 빈 문자열('')을 입력합니다. 300바이트 내외

countrystring국가. 45바이트 내외

detailedAddressstring상세 주소. 300바이트 내외

namestring이름. 150바이트 내외

statestring주(state). 국내 주소에는 빈 문자열('')을 입력합니다. 300바이트 내외

tel1string연락처 1. 45바이트 내외

tel2string연락처 2. 45바이트 내외

zipCodestring우편번호. 45바이트 내외

isRoadNameAddressboolean도로명 주소 여부. 8바이트 내외

collectCompletedDatestring<date-time>수거 완료일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

collectDeliveryCompanydeliveryCompanyCode.pay-order-seller (string)택배사 코드. 250바이트 내외

코드설명비고CJGLSCJ대한통운HYUNDAI롯데택배HANJIN한진택배KGB로젠택배EPOST우체국택배MTINTER엠티인터내셔널1004HOME1004HOMETWOFASTEXPRESS2FAST익스프레스ACEACEexpressACIEXPRESSACIADCAIRADC항운택배AIRWAYAIRWAY익스프레스APEXAPEXARAMEXARAMEXARGOARGOAIRBOYAirboyExpressKOREXGCJ대한통운(국제택배)CUPARCELCU편의점택배CWAYEXPRESSCwayExpressDHLDHLDHLDEDHL(독일)DHLGLOBALMAILDHLGlobalMailDPDDPDECMSEXPRESSECMSExpressEFSEFSEMSEMSEZUSAEZUSAEUROPARCELEuroParcelFEDEXFEDEXGOPGOP당일택배GOSGOS당일택배GPSLOGIXGPSLOGIXGSFRESHGSFreshGSIEXPRESSGSI익스프레스GSMNTONGSMNTONGSPOSTBOXGSPostbox퀵CVSNETGSPostbox택배GS더프레시GSTHEFRESHGTSLOGISGTS로지스HYBRIDHI택배HYHYIKIK물류KGLNETKGL네트웍스KTKT EXPRESSLGELG전자배송센터LTLLTLNDEXKOREANDEX KOREASBGLSSBGLSSFEXSFexpressSLXSLX택배SSGSSGTNTTNTLOGISPARTNERUFO로지스UPSUPSUSPSUSPSWIZWAWIZWAYJSWORLDYJS글로벌YJSYJS글로벌(영국)YUNDAYUNDAEXPRESSIPARCELi-parcelKY건영복합물류KUNYOUNG건영택배KDEXP경동택배KIN경인택배KORYO고려택배GDSP골드스넵스KOKUSAI국제익스프레스GOODTOLUCK굿투럭NAEUN나은물류NOGOK노곡물류NONGHYUP농협택배HANAROMART농협하나로마트DAELIM대림통운DAESIN대신택배DAEWOON대운글로벌THEBAO더바오DODOFLEX도도플렉스DONGGANG동강물류DONGJIN동진특송CHAINLOGIS두발히어로당일택배DRABBIT딜리래빗JMNP딜리박스ONEDAYLOGIS라스트마일LINEEXP라인익스프레스ROADSUNEXPRESS로드썬익스프레스LOGISVALLEY로지스밸리POOLATHOME로지스올홈케어(풀앳홈)LOTOS로토스HLCGLOBAL롯데글로벌로지스(국제택배)LOTTECHILSUNG롯데칠성MDLOGIS모든로지스(SLO)DASONG물류대장BABABA바바바로지스BANPOOM반품구조대VALEX발렉스SHIPNERGY배송하기좋은날PANTOSLX판토스VROONG부릉BRIDGE브릿지로지스EKDP삼다수가정배송SELC삼성전자물류SEORIM서림물류SWGEXP성원글로벌SUNGHUN성훈물류SEBANG세방택배SMARTLOGIS스마트로지스SPARKLE스파클직배송SPASYS1스페이시스원CRLX시알로지텍ANYTRACK애니트랙ABOUTPET어바웃펫ESTHER에스더쉬핑VENDORPIA벤더피아ACTCORE에이씨티앤코아HKHOLDINGS에이치케이홀딩스NTLPS엔티엘피스TODAYPICKUP카카오T당일배송RUSH오늘회러쉬ALLIN올인닷컴ALLTAKOREA올타코리아WIDETECH와이드테크YONGMA용마로지스DCOMMERCE우리동네커머스WEVILL우리동네택배HONAM우리택배WOORIHB우리한방택배WOOJIN우진인터로지스REGISTPOST우편등기WOONGJI웅지익스프레스WARPEX워펙스WINION위니온로지스WIHTYOU위드유당일택배WEMOVE위무브UFREIGHT유프레이트코리아EUNHA은하쉬핑INNOS이노스(올인닷컴)EMARTEVERYDAY이마트에브리데이ESTLA이스트라ETOMARS이투마스GENERALPOST일반우편ILSHIN일신모닝택배ILYANG일양로지스GNETWORK자이언트ZENIEL제니엘시스템JLOGIST제이로지스트GENIEGO지니고당일특급GDAKOREA지디에이코리아GHSPEED지에이치스피드JIKGUMOON직구문CHUNIL천일택배CHOROC초록마을(외부연동)CHOROCMAEUL초록마을(네이버직연동)COSHIP캐나다쉬핑KJT케이제이티QRUN큐런CUBEFLOW큐브플로우QXPRESS트랙스로지스HEREWEGO탱고앤고TOMATO토마토앱TODAY투데이TSG티에스지로지스TEAMFRESH팀프레시PATEK파테크해운상공XINPATEK파테크해운항공PANASIA판월드로지스틱PANSTAR팬스타국제특송(PIEX)FOREVER퍼레버택배PULMUONE풀무원(로지스밸리)FREDIT프레딧FRESHMATES프레시메이트KURLY컬리넥스트마일PINGPONG핑퐁HOWSER하우저HIVECITY하이브시티HANDALUM한달음택배HANDEX한덱스HANMI한미포스트HANSSEM한샘HANWOORI한우리물류HPL한의사랑택배HDEXP합동택배HERWUZUG허우적GLOVIS현대글로비스HOMEINNO홈이노베이션로지스HOMEPICKTODAY홈픽오늘도착HOMEPICK홈픽택배HOMEPLUSDELIVERY홈플러스HOMEPLUSEXPRESS홈플러스익스프레스CARGOPLEASE화물을부탁해HWATONG화통CH1기타택배LETUS바로스LETUS3PL레터스CASA신세계까사GCS지씨에스GKGLOBAL지케이글로벌BRCH비알씨에이치DNDN든든택배GONELO고넬로JCLSJCLSJWTNLJWTNLGS25GS편의점(퀵배달용)CUCU편의점(퀵배달용)

collectDeliveryMethoddeliveryMethod.pay-order-seller (string)배송 방법 코드. 250바이트 내외

코드설명비고DELIVERY택배, 등기, 소포GDFW_ISSUE_SVC굿스플로 송장 출력VISIT_RECEIPT방문 수령DIRECT_DELIVERY직접 전달QUICK_SVC퀵서비스NOTHING배송 없음RETURN_DESIGNATED지정 반품 택배RETURN_DELIVERY일반 반품 택배RETURN_INDIVIDUAL직접 반송RETURN_MERCHANT판매자 직접 수거(장보기 전용)UNKNOWN알 수 없음(예외 처리에 사용)
Example: DELIVERY

collectStatuscollectStatus.pay-order-seller (string)수거 상태. 250바이트 내외

코드설명비고NOT_REQUESTED수거 미요청COLLECT_REQUEST_TO_AGENT수거 지시 완료COLLECT_REQUEST_TO_DELIVERY_COMPANY수거 요청COLLECT_WAITING택배사 수거 예정DELIVERING수거 진행 중DELIVERED수거 완료DELIVERY_FAILED배송 실패COLLECT_FAILED수거 실패WRONG_INVOICE오류 송장COLLECT_CANCELED수거 취소
Example: NOT_REQUESTED

collectTrackingNumberstring수거 송장 번호. 100바이트 내외

etcFeeDemandAmountinteger기타 비용 청구액

etcFeePayMeansstring기타 비용 결제 수단. 100바이트 내외

etcFeePayMethodstring기타 비용 결제 방법. 100바이트 내외

exchangeDetailedReasonstring교환 상세 사유. 4000바이트 내외

exchangeReasonclaimReason.pay-order-seller (string)클레임 요청 사유. 250바이트 내외

코드설명비고INTENT_CHANGED구매 의사 취소COLOR_AND_SIZE색상 및 사이즈 변경WRONG_ORDER다른 상품 잘못 주문PRODUCT_UNSATISFIED서비스 불만족DELAYED_DELIVERY배송 지연SOLD_OUT상품 품절DROPPED_DELIVERY배송 누락NOT_YET_DELIVERY미배송BROKEN상품 파손INCORRECT_INFO상품 정보 상이WRONG_DELIVERY오배송WRONG_OPTION색상 등 다른 상품 잘못 배송SIMPLE_INTENT_CHANGED단순 변심MISTAKE_ORDER주문 실수ETC기타API 에서 지정 불가DELAYED_DELIVERY_BY_PURCHASER배송 지연INCORRECT_INFO_BY_PURCHASER상품 정보 상이PRODUCT_UNSATISFIED_BY_PURCHASER서비스 불만족NOT_YET_DISCUSSION상호 협의가 완료되지 않은 주문 건OUT_OF_STOCK재고 부족으로 인한 판매 불가SALE_INTENT_CHANGED판매 의사 변심으로 인한 거부NOT_YET_PAYMENT구매자의 미결제로 인한 거부NOT_YET_RECEIVE상품 미수취WRONG_DELAYED_DELIVERY오배송 및 지연BROKEN_AND_BAD파손 및 불량RECEIVING_DUE_DATE_OVER수락 기한 만료RECEIVER_MISMATCHED수신인 불일치GIFT_INTENT_CHANGED보내기 취소GIFT_REFUSAL선물 거절MINOR_RESTRICTED상품 수신 불가RECEIVING_BLOCKED상품 수신 불가UNDER_QUANTITY주문 수량 미달ASYNC_FAIL_PAYMENT결제 승인 실패ASYNC_LONG_WAIT_PAYMENT결제 승인 실패FAMILY_PAY_REJECTED패밀리결제 거절BUSINESSMALL_PAY_REJECTED관리자 결제 거절FAIL_PAYMENT결제 승인 실패

holdbackDetailedReasonstring보류 상세 사유. 4000바이트 내외

holdbackReasonholdbackReason.pay-order-seller (string)보류 유형. 250바이트 내외

코드설명비고RETURN_DELIVERYFEE반품 배송비 청구EXTRAFEEE추가 비용 청구RETURN_DELIVERYFEE_AND_EXTRAFEEE반품 배송비 + 추가 비용 청구RETURN_PRODUCT_NOT_DELIVERED반품 상품 미입고ETC기타 사유EXCHANGE_DELIVERYFEE교환 배송비 청구EXCHANGE_EXTRAFEE추가 교환 비용 청구EXCHANGE_PRODUCT_READY교환 상품 준비 중EXCHANGE_PRODUCT_NOT_DELIVERED교환 상품 미입고SELLER_CONFIRM_NEED판매자 확인 필요PURCHASER_CONFIRM_NEED구매자 확인 필요SELLER_REMIT판매자 직접 송금

holdbackStatusholdbackStatus.pay-order-seller (string)보류 상태. 250바이트 내외

코드설명비고HOLDBACK보류 중RELEASED보류 해제

reDeliveryMethoddeliveryMethod.pay-order-seller (string)배송 방법 코드. 250바이트 내외

코드설명비고DELIVERY택배, 등기, 소포GDFW_ISSUE_SVC굿스플로 송장 출력VISIT_RECEIPT방문 수령DIRECT_DELIVERY직접 전달QUICK_SVC퀵서비스NOTHING배송 없음RETURN_DESIGNATED지정 반품 택배RETURN_DELIVERY일반 반품 택배RETURN_INDIVIDUAL직접 반송RETURN_MERCHANT판매자 직접 수거(장보기 전용)UNKNOWN알 수 없음(예외 처리에 사용)
Example: DELIVERY

reDeliveryStatusdeliveryStatus.pay-order-seller (string)배송 상세 상태. 250바이트 내외

코드설명비고COLLECT_REQUEST수거 요청COLLECT_WAIT수거 대기COLLECT_CARGO집화DELIVERY_COMPLETION배송 완료DELIVERING배송중DELIVERY_FAIL배송 실패WRONG_INVOICE오류 송장COLLECT_CARGO_FAIL집화 실패COLLECT_CARGO_CANCEL집화 취소NOT_TRACKING배송 추적 없음
Example: COLLECT_REQUEST

reDeliveryCompanydeliveryCompanyCode.pay-order-seller (string)택배사 코드. 250바이트 내외

코드설명비고CJGLSCJ대한통운HYUNDAI롯데택배HANJIN한진택배KGB로젠택배EPOST우체국택배MTINTER엠티인터내셔널1004HOME1004HOMETWOFASTEXPRESS2FAST익스프레스ACEACEexpressACIEXPRESSACIADCAIRADC항운택배AIRWAYAIRWAY익스프레스APEXAPEXARAMEXARAMEXARGOARGOAIRBOYAirboyExpressKOREXGCJ대한통운(국제택배)CUPARCELCU편의점택배CWAYEXPRESSCwayExpressDHLDHLDHLDEDHL(독일)DHLGLOBALMAILDHLGlobalMailDPDDPDECMSEXPRESSECMSExpressEFSEFSEMSEMSEZUSAEZUSAEUROPARCELEuroParcelFEDEXFEDEXGOPGOP당일택배GOSGOS당일택배GPSLOGIXGPSLOGIXGSFRESHGSFreshGSIEXPRESSGSI익스프레스GSMNTONGSMNTONGSPOSTBOXGSPostbox퀵CVSNETGSPostbox택배GS더프레시GSTHEFRESHGTSLOGISGTS로지스HYBRIDHI택배HYHYIKIK물류KGLNETKGL네트웍스KTKT EXPRESSLGELG전자배송센터LTLLTLNDEXKOREANDEX KOREASBGLSSBGLSSFEXSFexpressSLXSLX택배SSGSSGTNTTNTLOGISPARTNERUFO로지스UPSUPSUSPSUSPSWIZWAWIZWAYJSWORLDYJS글로벌YJSYJS글로벌(영국)YUNDAYUNDAEXPRESSIPARCELi-parcelKY건영복합물류KUNYOUNG건영택배KDEXP경동택배KIN경인택배KORYO고려택배GDSP골드스넵스KOKUSAI국제익스프레스GOODTOLUCK굿투럭NAEUN나은물류NOGOK노곡물류NONGHYUP농협택배HANAROMART농협하나로마트DAELIM대림통운DAESIN대신택배DAEWOON대운글로벌THEBAO더바오DODOFLEX도도플렉스DONGGANG동강물류DONGJIN동진특송CHAINLOGIS두발히어로당일택배DRABBIT딜리래빗JMNP딜리박스ONEDAYLOGIS라스트마일LINEEXP라인익스프레스ROADSUNEXPRESS로드썬익스프레스LOGISVALLEY로지스밸리POOLATHOME로지스올홈케어(풀앳홈)LOTOS로토스HLCGLOBAL롯데글로벌로지스(국제택배)LOTTECHILSUNG롯데칠성MDLOGIS모든로지스(SLO)DASONG물류대장BABABA바바바로지스BANPOOM반품구조대VALEX발렉스SHIPNERGY배송하기좋은날PANTOSLX판토스VROONG부릉BRIDGE브릿지로지스EKDP삼다수가정배송SELC삼성전자물류SEORIM서림물류SWGEXP성원글로벌SUNGHUN성훈물류SEBANG세방택배SMARTLOGIS스마트로지스SPARKLE스파클직배송SPASYS1스페이시스원CRLX시알로지텍ANYTRACK애니트랙ABOUTPET어바웃펫ESTHER에스더쉬핑VENDORPIA벤더피아ACTCORE에이씨티앤코아HKHOLDINGS에이치케이홀딩스NTLPS엔티엘피스TODAYPICKUP카카오T당일배송RUSH오늘회러쉬ALLIN올인닷컴ALLTAKOREA올타코리아WIDETECH와이드테크YONGMA용마로지스DCOMMERCE우리동네커머스WEVILL우리동네택배HONAM우리택배WOORIHB우리한방택배WOOJIN우진인터로지스REGISTPOST우편등기WOONGJI웅지익스프레스WARPEX워펙스WINION위니온로지스WIHTYOU위드유당일택배WEMOVE위무브UFREIGHT유프레이트코리아EUNHA은하쉬핑INNOS이노스(올인닷컴)EMARTEVERYDAY이마트에브리데이ESTLA이스트라ETOMARS이투마스GENERALPOST일반우편ILSHIN일신모닝택배ILYANG일양로지스GNETWORK자이언트ZENIEL제니엘시스템JLOGIST제이로지스트GENIEGO지니고당일특급GDAKOREA지디에이코리아GHSPEED지에이치스피드JIKGUMOON직구문CHUNIL천일택배CHOROC초록마을(외부연동)CHOROCMAEUL초록마을(네이버직연동)COSHIP캐나다쉬핑KJT케이제이티QRUN큐런CUBEFLOW큐브플로우QXPRESS트랙스로지스HEREWEGO탱고앤고TOMATO토마토앱TODAY투데이TSG티에스지로지스TEAMFRESH팀프레시PATEK파테크해운상공XINPATEK파테크해운항공PANASIA판월드로지스틱PANSTAR팬스타국제특송(PIEX)FOREVER퍼레버택배PULMUONE풀무원(로지스밸리)FREDIT프레딧FRESHMATES프레시메이트KURLY컬리넥스트마일PINGPONG핑퐁HOWSER하우저HIVECITY하이브시티HANDALUM한달음택배HANDEX한덱스HANMI한미포스트HANSSEM한샘HANWOORI한우리물류HPL한의사랑택배HDEXP합동택배HERWUZUG허우적GLOVIS현대글로비스HOMEINNO홈이노베이션로지스HOMEPICKTODAY홈픽오늘도착HOMEPICK홈픽택배HOMEPLUSDELIVERY홈플러스HOMEPLUSEXPRESS홈플러스익스프레스CARGOPLEASE화물을부탁해HWATONG화통CH1기타택배LETUS바로스LETUS3PL레터스CASA신세계까사GCS지씨에스GKGLOBAL지케이글로벌BRCH비알씨에이치DNDN든든택배GONELO고넬로JCLSJCLSJWTNLJWTNLGS25GS편의점(퀵배달용)CUCU편의점(퀵배달용)

reDeliveryTrackingNumberstring재배송 송장 번호. 100바이트 내외

reDeliveryAddress 구매자 재배송지 주소 (object)addressTypeaddressType.pay-order-seller (string)배송지 타입. 250바이트 내외

코드설명비고DOMESTIC국내FOREIGN국외

baseAddressstring기본 주소. 300바이트 내외

citystring도시. 국내 주소에는 빈 문자열('')을 입력합니다. 300바이트 내외

countrystring국가. 45바이트 내외

detailedAddressstring상세 주소. 300바이트 내외

namestring이름. 150바이트 내외

statestring주(state). 국내 주소에는 빈 문자열('')을 입력합니다. 300바이트 내외

tel1string연락처 1. 45바이트 내외

tel2string연락처 2. 45바이트 내외

zipCodestring우편번호. 45바이트 내외

isRoadNameAddressboolean도로명 주소 여부. 8바이트 내외

requestChannelstring접수 채널. 100바이트 내외

requestQuantityinteger요청 수량

returnReceiveAddress 판매자 교환/반품 수취 주소 (object)addressTypeaddressType.pay-order-seller (string)배송지 타입. 250바이트 내외

코드설명비고DOMESTIC국내FOREIGN국외

baseAddressstring기본 주소. 300바이트 내외

citystring도시. 국내 주소에는 빈 문자열('')을 입력합니다. 300바이트 내외

countrystring국가. 45바이트 내외

detailedAddressstring상세 주소. 300바이트 내외

namestring이름. 150바이트 내외

statestring주(state). 국내 주소에는 빈 문자열('')을 입력합니다. 300바이트 내외

tel1string연락처 1. 45바이트 내외

tel2string연락처 2. 45바이트 내외

zipCodestring우편번호. 45바이트 내외

isRoadNameAddressboolean도로명 주소 여부. 8바이트 내외

logisticsCenterIdstring물류센터 ID. 60바이트

holdbackConfigDatestring<date-time>보류 설정일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

holdbackConfigurerstring보류 설정자(구매자/판매자/관리자/시스템). 100바이트 내외

holdbackReleaseDatestring<date-time>보류 해제일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

holdbackReleaserstring보류 해제자(구매자/판매자/관리자/시스템). 100바이트 내외

claimDeliveryFeeProductOrderIdsstring교환 배송비 묶음 청구 상품 주문 번호(여러 개면 쉼표로 구분). 4000바이트 내외

reDeliveryOperationDatestring<date-time>재배송 처리일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

claimDeliveryFeeDiscountAmountinteger교환 배송비 할인액

remoteAreaCostChargeAmountinteger교환 도서산간 배송비

membershipsArrivalGuaranteeClaimSupportingAmountinteger멤버십N배송 지원금액

exchangeImageUrlstring[]교환이미지 URL

claimDeliveryFeeSupportTypeclaimDeliveryFeeSupportType.pay-order-seller (string)클레임배송비지원타입

코드설명비고MEMBERSHIP_ARRIVAL_GUARANTEE멤버십도착보장MEMBERSHIP_KURLY멤버십컬리N마트

claimDeliveryFeeSupportAmountinteger클레임배송비지원금액

collectAttributeTypecollectAttributeType.pay-order-seller (string)수거 속성. 250바이트 내외

코드설명비고LOGISTICS_COLLECTNFA 수거LOGISTICS_NON_COLLECTNFA 미수거
Example: LOGISTICS_COLLECT

completedClaims completedClaimResponseContent.pay-order-seller (object)[]Array [

claimTypeclaimType.pay-order-seller (string)클레임 구분. 250바이트 내외

코드설명비고CANCEL취소RETURN반품EXCHANGE교환PURCHASE_DECISION_HOLDBACK구매 확정 보류ADMIN_CANCEL직권 취소

claimIdstring클레임 번호. 20바이트 내외

claimStatusclaimStatus.pay-order-seller (string)클레임 상태. 250바이트 내외

코드설명비고CANCEL_REQUEST취소 요청CANCELING취소 처리 중CANCEL_DONE취소 처리 완료CANCEL_REJECT취소 철회RETURN_REQUEST반품 요청EXCHANGE_REQUEST교환 요청COLLECTING수거 처리 중COLLECT_DONE수거 완료EXCHANGE_REDELIVERING교환 재배송 중RETURN_DONE반품 완료EXCHANGE_DONE교환 완료RETURN_REJECT반품 철회EXCHANGE_REJECT교환 철회PURCHASE_DECISION_HOLDBACK구매 확정 보류PURCHASE_DECISION_REQUEST구매 확정 요청PURCHASE_DECISION_HOLDBACK_RELEASE구매 확정 보류 해제ADMIN_CANCELING직권 취소 중ADMIN_CANCEL_DONE직권 취소 완료ADMIN_CANCEL_REJECT직권 취소 철회

claimRequestDatestring<date-time>클레임 요청일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

requestChannelstring접수 채널. 100바이트 내외

claimRequestDetailContentstring클레임 상세 사유. 4000바이트 내외

claimRequestReasonclaimReason.pay-order-seller (string)클레임 요청 사유. 250바이트 내외

코드설명비고INTENT_CHANGED구매 의사 취소COLOR_AND_SIZE색상 및 사이즈 변경WRONG_ORDER다른 상품 잘못 주문PRODUCT_UNSATISFIED서비스 불만족DELAYED_DELIVERY배송 지연SOLD_OUT상품 품절DROPPED_DELIVERY배송 누락NOT_YET_DELIVERY미배송BROKEN상품 파손INCORRECT_INFO상품 정보 상이WRONG_DELIVERY오배송WRONG_OPTION색상 등 다른 상품 잘못 배송SIMPLE_INTENT_CHANGED단순 변심MISTAKE_ORDER주문 실수ETC기타API 에서 지정 불가DELAYED_DELIVERY_BY_PURCHASER배송 지연INCORRECT_INFO_BY_PURCHASER상품 정보 상이PRODUCT_UNSATISFIED_BY_PURCHASER서비스 불만족NOT_YET_DISCUSSION상호 협의가 완료되지 않은 주문 건OUT_OF_STOCK재고 부족으로 인한 판매 불가SALE_INTENT_CHANGED판매 의사 변심으로 인한 거부NOT_YET_PAYMENT구매자의 미결제로 인한 거부NOT_YET_RECEIVE상품 미수취WRONG_DELAYED_DELIVERY오배송 및 지연BROKEN_AND_BAD파손 및 불량RECEIVING_DUE_DATE_OVER수락 기한 만료RECEIVER_MISMATCHED수신인 불일치GIFT_INTENT_CHANGED보내기 취소GIFT_REFUSAL선물 거절MINOR_RESTRICTED상품 수신 불가RECEIVING_BLOCKED상품 수신 불가UNDER_QUANTITY주문 수량 미달ASYNC_FAIL_PAYMENT결제 승인 실패ASYNC_LONG_WAIT_PAYMENT결제 승인 실패FAMILY_PAY_REJECTED패밀리결제 거절BUSINESSMALL_PAY_REJECTED관리자 결제 거절FAIL_PAYMENT결제 승인 실패

refundExpectedDatestring<date-time>환불 예정일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

refundStandbyReasonstring환불 대기 사유. 250바이트 내외

refundStandbyStatusstring환불 대기 상태. 250바이트 내외

requestQuantityinteger클레임 요청 수량

claimDeliveryFeeDemandAmountinteger클레임 배송비 청구액

claimDeliveryFeePayMeansstring클레임 배송비 결제 수단. 100바이트 내외

claimDeliveryFeePayMethodstring클레임 배송비 결제 방법. 100바이트 내외

returnReceiveAddress 판매자 교환/반품 수취 주소 (object)addressTypeaddressType.pay-order-seller (string)배송지 타입. 250바이트 내외

코드설명비고DOMESTIC국내FOREIGN국외

baseAddressstring기본 주소. 300바이트 내외

citystring도시. 국내 주소에는 빈 문자열('')을 입력합니다. 300바이트 내외

countrystring국가. 45바이트 내외

detailedAddressstring상세 주소. 300바이트 내외

namestring이름. 150바이트 내외

statestring주(state). 국내 주소에는 빈 문자열('')을 입력합니다. 300바이트 내외

tel1string연락처 1. 45바이트 내외

tel2string연락처 2. 45바이트 내외

zipCodestring우편번호. 45바이트 내외

isRoadNameAddressboolean도로명 주소 여부. 8바이트 내외

logisticsCenterIdstring물류센터 ID. 60바이트

collectAddress 구매자 수거지 주소 (object)addressTypeaddressType.pay-order-seller (string)배송지 타입. 250바이트 내외

코드설명비고DOMESTIC국내FOREIGN국외

baseAddressstring기본 주소. 300바이트 내외

citystring도시. 국내 주소에는 빈 문자열('')을 입력합니다. 300바이트 내외

countrystring국가. 45바이트 내외

detailedAddressstring상세 주소. 300바이트 내외

namestring이름. 150바이트 내외

statestring주(state). 국내 주소에는 빈 문자열('')을 입력합니다. 300바이트 내외

tel1string연락처 1. 45바이트 내외

tel2string연락처 2. 45바이트 내외

zipCodestring우편번호. 45바이트 내외

isRoadNameAddressboolean도로명 주소 여부. 8바이트 내외

collectCompletedDatestring<date-time>수거 완료일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

collectDeliveryCompanydeliveryCompanyCode.pay-order-seller (string)택배사 코드. 250바이트 내외

코드설명비고CJGLSCJ대한통운HYUNDAI롯데택배HANJIN한진택배KGB로젠택배EPOST우체국택배MTINTER엠티인터내셔널1004HOME1004HOMETWOFASTEXPRESS2FAST익스프레스ACEACEexpressACIEXPRESSACIADCAIRADC항운택배AIRWAYAIRWAY익스프레스APEXAPEXARAMEXARAMEXARGOARGOAIRBOYAirboyExpressKOREXGCJ대한통운(국제택배)CUPARCELCU편의점택배CWAYEXPRESSCwayExpressDHLDHLDHLDEDHL(독일)DHLGLOBALMAILDHLGlobalMailDPDDPDECMSEXPRESSECMSExpressEFSEFSEMSEMSEZUSAEZUSAEUROPARCELEuroParcelFEDEXFEDEXGOPGOP당일택배GOSGOS당일택배GPSLOGIXGPSLOGIXGSFRESHGSFreshGSIEXPRESSGSI익스프레스GSMNTONGSMNTONGSPOSTBOXGSPostbox퀵CVSNETGSPostbox택배GS더프레시GSTHEFRESHGTSLOGISGTS로지스HYBRIDHI택배HYHYIKIK물류KGLNETKGL네트웍스KTKT EXPRESSLGELG전자배송센터LTLLTLNDEXKOREANDEX KOREASBGLSSBGLSSFEXSFexpressSLXSLX택배SSGSSGTNTTNTLOGISPARTNERUFO로지스UPSUPSUSPSUSPSWIZWAWIZWAYJSWORLDYJS글로벌YJSYJS글로벌(영국)YUNDAYUNDAEXPRESSIPARCELi-parcelKY건영복합물류KUNYOUNG건영택배KDEXP경동택배KIN경인택배KORYO고려택배GDSP골드스넵스KOKUSAI국제익스프레스GOODTOLUCK굿투럭NAEUN나은물류NOGOK노곡물류NONGHYUP농협택배HANAROMART농협하나로마트DAELIM대림통운DAESIN대신택배DAEWOON대운글로벌THEBAO더바오DODOFLEX도도플렉스DONGGANG동강물류DONGJIN동진특송CHAINLOGIS두발히어로당일택배DRABBIT딜리래빗JMNP딜리박스ONEDAYLOGIS라스트마일LINEEXP라인익스프레스ROADSUNEXPRESS로드썬익스프레스LOGISVALLEY로지스밸리POOLATHOME로지스올홈케어(풀앳홈)LOTOS로토스HLCGLOBAL롯데글로벌로지스(국제택배)LOTTECHILSUNG롯데칠성MDLOGIS모든로지스(SLO)DASONG물류대장BABABA바바바로지스BANPOOM반품구조대VALEX발렉스SHIPNERGY배송하기좋은날PANTOSLX판토스VROONG부릉BRIDGE브릿지로지스EKDP삼다수가정배송SELC삼성전자물류SEORIM서림물류SWGEXP성원글로벌SUNGHUN성훈물류SEBANG세방택배SMARTLOGIS스마트로지스SPARKLE스파클직배송SPASYS1스페이시스원CRLX시알로지텍ANYTRACK애니트랙ABOUTPET어바웃펫ESTHER에스더쉬핑VENDORPIA벤더피아ACTCORE에이씨티앤코아HKHOLDINGS에이치케이홀딩스NTLPS엔티엘피스TODAYPICKUP카카오T당일배송RUSH오늘회러쉬ALLIN올인닷컴ALLTAKOREA올타코리아WIDETECH와이드테크YONGMA용마로지스DCOMMERCE우리동네커머스WEVILL우리동네택배HONAM우리택배WOORIHB우리한방택배WOOJIN우진인터로지스REGISTPOST우편등기WOONGJI웅지익스프레스WARPEX워펙스WINION위니온로지스WIHTYOU위드유당일택배WEMOVE위무브UFREIGHT유프레이트코리아EUNHA은하쉬핑INNOS이노스(올인닷컴)EMARTEVERYDAY이마트에브리데이ESTLA이스트라ETOMARS이투마스GENERALPOST일반우편ILSHIN일신모닝택배ILYANG일양로지스GNETWORK자이언트ZENIEL제니엘시스템JLOGIST제이로지스트GENIEGO지니고당일특급GDAKOREA지디에이코리아GHSPEED지에이치스피드JIKGUMOON직구문CHUNIL천일택배CHOROC초록마을(외부연동)CHOROCMAEUL초록마을(네이버직연동)COSHIP캐나다쉬핑KJT케이제이티QRUN큐런CUBEFLOW큐브플로우QXPRESS트랙스로지스HEREWEGO탱고앤고TOMATO토마토앱TODAY투데이TSG티에스지로지스TEAMFRESH팀프레시PATEK파테크해운상공XINPATEK파테크해운항공PANASIA판월드로지스틱PANSTAR팬스타국제특송(PIEX)FOREVER퍼레버택배PULMUONE풀무원(로지스밸리)FREDIT프레딧FRESHMATES프레시메이트KURLY컬리넥스트마일PINGPONG핑퐁HOWSER하우저HIVECITY하이브시티HANDALUM한달음택배HANDEX한덱스HANMI한미포스트HANSSEM한샘HANWOORI한우리물류HPL한의사랑택배HDEXP합동택배HERWUZUG허우적GLOVIS현대글로비스HOMEINNO홈이노베이션로지스HOMEPICKTODAY홈픽오늘도착HOMEPICK홈픽택배HOMEPLUSDELIVERY홈플러스HOMEPLUSEXPRESS홈플러스익스프레스CARGOPLEASE화물을부탁해HWATONG화통CH1기타택배LETUS바로스LETUS3PL레터스CASA신세계까사GCS지씨에스GKGLOBAL지케이글로벌BRCH비알씨에이치DNDN든든택배GONELO고넬로JCLSJCLSJWTNLJWTNLGS25GS편의점(퀵배달용)CUCU편의점(퀵배달용)

collectDeliveryMethoddeliveryMethod.pay-order-seller (string)배송 방법 코드. 250바이트 내외

코드설명비고DELIVERY택배, 등기, 소포GDFW_ISSUE_SVC굿스플로 송장 출력VISIT_RECEIPT방문 수령DIRECT_DELIVERY직접 전달QUICK_SVC퀵서비스NOTHING배송 없음RETURN_DESIGNATED지정 반품 택배RETURN_DELIVERY일반 반품 택배RETURN_INDIVIDUAL직접 반송RETURN_MERCHANT판매자 직접 수거(장보기 전용)UNKNOWN알 수 없음(예외 처리에 사용)
Example: DELIVERY

collectStatuscollectStatus.pay-order-seller (string)수거 상태. 250바이트 내외

코드설명비고NOT_REQUESTED수거 미요청COLLECT_REQUEST_TO_AGENT수거 지시 완료COLLECT_REQUEST_TO_DELIVERY_COMPANY수거 요청COLLECT_WAITING택배사 수거 예정DELIVERING수거 진행 중DELIVERED수거 완료DELIVERY_FAILED배송 실패COLLECT_FAILED수거 실패WRONG_INVOICE오류 송장COLLECT_CANCELED수거 취소
Example: NOT_REQUESTED

collectTrackingNumberstring수거 송장 번호. 100바이트 내외

etcFeeDemandAmountinteger기타 비용 청구액

etcFeePayMeansstring기타 비용 결제 수단. 100바이트 내외

etcFeePayMethodstring기타 비용 결제 방법. 100바이트 내외

holdbackDetailedReasonstring보류 상세 사유. 4000바이트 내외

holdbackReasonholdbackReason.pay-order-seller (string)보류 유형. 250바이트 내외

코드설명비고RETURN_DELIVERYFEE반품 배송비 청구EXTRAFEEE추가 비용 청구RETURN_DELIVERYFEE_AND_EXTRAFEEE반품 배송비 + 추가 비용 청구RETURN_PRODUCT_NOT_DELIVERED반품 상품 미입고ETC기타 사유EXCHANGE_DELIVERYFEE교환 배송비 청구EXCHANGE_EXTRAFEE추가 교환 비용 청구EXCHANGE_PRODUCT_READY교환 상품 준비 중EXCHANGE_PRODUCT_NOT_DELIVERED교환 상품 미입고SELLER_CONFIRM_NEED판매자 확인 필요PURCHASER_CONFIRM_NEED구매자 확인 필요SELLER_REMIT판매자 직접 송금

holdbackStatusholdbackStatus.pay-order-seller (string)보류 상태. 250바이트 내외

코드설명비고HOLDBACK보류 중RELEASED보류 해제

holdbackConfigDatestring<date-time>보류 설정일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

holdbackConfigurerstring보류 설정자(구매자/판매자/관리자/시스템). 250바이트 내외

holdbackReleaseDatestring<date-time>보류 해제일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

holdbackReleaserstring보류 해제자(구매자/판매자/관리자/시스템). 250바이트 내외

claimDeliveryFeeProductOrderIdsstring클레임 배송비 묶음 청구 상품 주문 번호(여러 개면 쉼표로 구분). 4000바이트 내외

claimDeliveryFeeDiscountAmountinteger반품 배송비 할인액

remoteAreaCostChargeAmountinteger반품 도서산간 배송비

claimCompleteOperationDatestring<date-time>반품 완료일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

claimRequestAdmissionDatestring<date-time>클레임 승인일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

collectOperationDatestring배송 일자. 8바이트 내외

collectStartTimestring수거 시작 시간. 8바이트 내외

collectEndTimestring수거 종료 시간. 8바이트 내외

collectSlotIdstring수거 슬롯 ID. 100바이트 내외

reDeliveryAddress 구매자 재배송지 주소 (object)addressTypeaddressType.pay-order-seller (string)배송지 타입. 250바이트 내외

코드설명비고DOMESTIC국내FOREIGN국외

baseAddressstring기본 주소. 300바이트 내외

citystring도시. 국내 주소에는 빈 문자열('')을 입력합니다. 300바이트 내외

countrystring국가. 45바이트 내외

detailedAddressstring상세 주소. 300바이트 내외

namestring이름. 150바이트 내외

statestring주(state). 국내 주소에는 빈 문자열('')을 입력합니다. 300바이트 내외

tel1string연락처 1. 45바이트 내외

tel2string연락처 2. 45바이트 내외

zipCodestring우편번호. 45바이트 내외

isRoadNameAddressboolean도로명 주소 여부. 8바이트 내외

reDeliveryMethoddeliveryMethod.pay-order-seller (string)배송 방법 코드. 250바이트 내외

코드설명비고DELIVERY택배, 등기, 소포GDFW_ISSUE_SVC굿스플로 송장 출력VISIT_RECEIPT방문 수령DIRECT_DELIVERY직접 전달QUICK_SVC퀵서비스NOTHING배송 없음RETURN_DESIGNATED지정 반품 택배RETURN_DELIVERY일반 반품 택배RETURN_INDIVIDUAL직접 반송RETURN_MERCHANT판매자 직접 수거(장보기 전용)UNKNOWN알 수 없음(예외 처리에 사용)
Example: DELIVERY

reDeliveryStatusdeliveryStatus.pay-order-seller (string)배송 상세 상태. 250바이트 내외

코드설명비고COLLECT_REQUEST수거 요청COLLECT_WAIT수거 대기COLLECT_CARGO집화DELIVERY_COMPLETION배송 완료DELIVERING배송중DELIVERY_FAIL배송 실패WRONG_INVOICE오류 송장COLLECT_CARGO_FAIL집화 실패COLLECT_CARGO_CANCEL집화 취소NOT_TRACKING배송 추적 없음
Example: COLLECT_REQUEST

reDeliveryCompanydeliveryCompanyCode.pay-order-seller (string)택배사 코드. 250바이트 내외

코드설명비고CJGLSCJ대한통운HYUNDAI롯데택배HANJIN한진택배KGB로젠택배EPOST우체국택배MTINTER엠티인터내셔널1004HOME1004HOMETWOFASTEXPRESS2FAST익스프레스ACEACEexpressACIEXPRESSACIADCAIRADC항운택배AIRWAYAIRWAY익스프레스APEXAPEXARAMEXARAMEXARGOARGOAIRBOYAirboyExpressKOREXGCJ대한통운(국제택배)CUPARCELCU편의점택배CWAYEXPRESSCwayExpressDHLDHLDHLDEDHL(독일)DHLGLOBALMAILDHLGlobalMailDPDDPDECMSEXPRESSECMSExpressEFSEFSEMSEMSEZUSAEZUSAEUROPARCELEuroParcelFEDEXFEDEXGOPGOP당일택배GOSGOS당일택배GPSLOGIXGPSLOGIXGSFRESHGSFreshGSIEXPRESSGSI익스프레스GSMNTONGSMNTONGSPOSTBOXGSPostbox퀵CVSNETGSPostbox택배GS더프레시GSTHEFRESHGTSLOGISGTS로지스HYBRIDHI택배HYHYIKIK물류KGLNETKGL네트웍스KTKT EXPRESSLGELG전자배송센터LTLLTLNDEXKOREANDEX KOREASBGLSSBGLSSFEXSFexpressSLXSLX택배SSGSSGTNTTNTLOGISPARTNERUFO로지스UPSUPSUSPSUSPSWIZWAWIZWAYJSWORLDYJS글로벌YJSYJS글로벌(영국)YUNDAYUNDAEXPRESSIPARCELi-parcelKY건영복합물류KUNYOUNG건영택배KDEXP경동택배KIN경인택배KORYO고려택배GDSP골드스넵스KOKUSAI국제익스프레스GOODTOLUCK굿투럭NAEUN나은물류NOGOK노곡물류NONGHYUP농협택배HANAROMART농협하나로마트DAELIM대림통운DAESIN대신택배DAEWOON대운글로벌THEBAO더바오DODOFLEX도도플렉스DONGGANG동강물류DONGJIN동진특송CHAINLOGIS두발히어로당일택배DRABBIT딜리래빗JMNP딜리박스ONEDAYLOGIS라스트마일LINEEXP라인익스프레스ROADSUNEXPRESS로드썬익스프레스LOGISVALLEY로지스밸리POOLATHOME로지스올홈케어(풀앳홈)LOTOS로토스HLCGLOBAL롯데글로벌로지스(국제택배)LOTTECHILSUNG롯데칠성MDLOGIS모든로지스(SLO)DASONG물류대장BABABA바바바로지스BANPOOM반품구조대VALEX발렉스SHIPNERGY배송하기좋은날PANTOSLX판토스VROONG부릉BRIDGE브릿지로지스EKDP삼다수가정배송SELC삼성전자물류SEORIM서림물류SWGEXP성원글로벌SUNGHUN성훈물류SEBANG세방택배SMARTLOGIS스마트로지스SPARKLE스파클직배송SPASYS1스페이시스원CRLX시알로지텍ANYTRACK애니트랙ABOUTPET어바웃펫ESTHER에스더쉬핑VENDORPIA벤더피아ACTCORE에이씨티앤코아HKHOLDINGS에이치케이홀딩스NTLPS엔티엘피스TODAYPICKUP카카오T당일배송RUSH오늘회러쉬ALLIN올인닷컴ALLTAKOREA올타코리아WIDETECH와이드테크YONGMA용마로지스DCOMMERCE우리동네커머스WEVILL우리동네택배HONAM우리택배WOORIHB우리한방택배WOOJIN우진인터로지스REGISTPOST우편등기WOONGJI웅지익스프레스WARPEX워펙스WINION위니온로지스WIHTYOU위드유당일택배WEMOVE위무브UFREIGHT유프레이트코리아EUNHA은하쉬핑INNOS이노스(올인닷컴)EMARTEVERYDAY이마트에브리데이ESTLA이스트라ETOMARS이투마스GENERALPOST일반우편ILSHIN일신모닝택배ILYANG일양로지스GNETWORK자이언트ZENIEL제니엘시스템JLOGIST제이로지스트GENIEGO지니고당일특급GDAKOREA지디에이코리아GHSPEED지에이치스피드JIKGUMOON직구문CHUNIL천일택배CHOROC초록마을(외부연동)CHOROCMAEUL초록마을(네이버직연동)COSHIP캐나다쉬핑KJT케이제이티QRUN큐런CUBEFLOW큐브플로우QXPRESS트랙스로지스HEREWEGO탱고앤고TOMATO토마토앱TODAY투데이TSG티에스지로지스TEAMFRESH팀프레시PATEK파테크해운상공XINPATEK파테크해운항공PANASIA판월드로지스틱PANSTAR팬스타국제특송(PIEX)FOREVER퍼레버택배PULMUONE풀무원(로지스밸리)FREDIT프레딧FRESHMATES프레시메이트KURLY컬리넥스트마일PINGPONG핑퐁HOWSER하우저HIVECITY하이브시티HANDALUM한달음택배HANDEX한덱스HANMI한미포스트HANSSEM한샘HANWOORI한우리물류HPL한의사랑택배HDEXP합동택배HERWUZUG허우적GLOVIS현대글로비스HOMEINNO홈이노베이션로지스HOMEPICKTODAY홈픽오늘도착HOMEPICK홈픽택배HOMEPLUSDELIVERY홈플러스HOMEPLUSEXPRESS홈플러스익스프레스CARGOPLEASE화물을부탁해HWATONG화통CH1기타택배LETUS바로스LETUS3PL레터스CASA신세계까사GCS지씨에스GKGLOBAL지케이글로벌BRCH비알씨에이치DNDN든든택배GONELO고넬로JCLSJCLSJWTNLJWTNLGS25GS편의점(퀵배달용)CUCU편의점(퀵배달용)

reDeliveryTrackingNumberstring재배송 송장 번호. 100바이트 내외

reDeliveryOperationDatestring<date-time>재배송 처리일. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

membershipsArrivalGuaranteeClaimSupportingAmountinteger멤버십N배송 지원금액

claimDeliveryFeeSupportTypeclaimDeliveryFeeSupportType.pay-order-seller (string)클레임배송비지원타입

코드설명비고MEMBERSHIP_ARRIVAL_GUARANTEE멤버십도착보장MEMBERSHIP_KURLY멤버십컬리N마트

claimDeliveryFeeSupportAmountinteger클레임배송비지원금액

collectAttributeTypecollectAttributeType.pay-order-seller (string)수거 속성. 250바이트 내외

코드설명비고LOGISTICS_COLLECTNFA 수거LOGISTICS_NON_COLLECTNFA 미수거
Example: LOGISTICS_COLLECT

]

delivery deliveryResponseContent.pay-order-seller (object)deliveredDatestring<date-time>배송 완료 일시. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

deliveryCompanydeliveryCompanyCode.pay-order-seller (string)택배사 코드. 250바이트 내외

코드설명비고CJGLSCJ대한통운HYUNDAI롯데택배HANJIN한진택배KGB로젠택배EPOST우체국택배MTINTER엠티인터내셔널1004HOME1004HOMETWOFASTEXPRESS2FAST익스프레스ACEACEexpressACIEXPRESSACIADCAIRADC항운택배AIRWAYAIRWAY익스프레스APEXAPEXARAMEXARAMEXARGOARGOAIRBOYAirboyExpressKOREXGCJ대한통운(국제택배)CUPARCELCU편의점택배CWAYEXPRESSCwayExpressDHLDHLDHLDEDHL(독일)DHLGLOBALMAILDHLGlobalMailDPDDPDECMSEXPRESSECMSExpressEFSEFSEMSEMSEZUSAEZUSAEUROPARCELEuroParcelFEDEXFEDEXGOPGOP당일택배GOSGOS당일택배GPSLOGIXGPSLOGIXGSFRESHGSFreshGSIEXPRESSGSI익스프레스GSMNTONGSMNTONGSPOSTBOXGSPostbox퀵CVSNETGSPostbox택배GS더프레시GSTHEFRESHGTSLOGISGTS로지스HYBRIDHI택배HYHYIKIK물류KGLNETKGL네트웍스KTKT EXPRESSLGELG전자배송센터LTLLTLNDEXKOREANDEX KOREASBGLSSBGLSSFEXSFexpressSLXSLX택배SSGSSGTNTTNTLOGISPARTNERUFO로지스UPSUPSUSPSUSPSWIZWAWIZWAYJSWORLDYJS글로벌YJSYJS글로벌(영국)YUNDAYUNDAEXPRESSIPARCELi-parcelKY건영복합물류KUNYOUNG건영택배KDEXP경동택배KIN경인택배KORYO고려택배GDSP골드스넵스KOKUSAI국제익스프레스GOODTOLUCK굿투럭NAEUN나은물류NOGOK노곡물류NONGHYUP농협택배HANAROMART농협하나로마트DAELIM대림통운DAESIN대신택배DAEWOON대운글로벌THEBAO더바오DODOFLEX도도플렉스DONGGANG동강물류DONGJIN동진특송CHAINLOGIS두발히어로당일택배DRABBIT딜리래빗JMNP딜리박스ONEDAYLOGIS라스트마일LINEEXP라인익스프레스ROADSUNEXPRESS로드썬익스프레스LOGISVALLEY로지스밸리POOLATHOME로지스올홈케어(풀앳홈)LOTOS로토스HLCGLOBAL롯데글로벌로지스(국제택배)LOTTECHILSUNG롯데칠성MDLOGIS모든로지스(SLO)DASONG물류대장BABABA바바바로지스BANPOOM반품구조대VALEX발렉스SHIPNERGY배송하기좋은날PANTOSLX판토스VROONG부릉BRIDGE브릿지로지스EKDP삼다수가정배송SELC삼성전자물류SEORIM서림물류SWGEXP성원글로벌SUNGHUN성훈물류SEBANG세방택배SMARTLOGIS스마트로지스SPARKLE스파클직배송SPASYS1스페이시스원CRLX시알로지텍ANYTRACK애니트랙ABOUTPET어바웃펫ESTHER에스더쉬핑VENDORPIA벤더피아ACTCORE에이씨티앤코아HKHOLDINGS에이치케이홀딩스NTLPS엔티엘피스TODAYPICKUP카카오T당일배송RUSH오늘회러쉬ALLIN올인닷컴ALLTAKOREA올타코리아WIDETECH와이드테크YONGMA용마로지스DCOMMERCE우리동네커머스WEVILL우리동네택배HONAM우리택배WOORIHB우리한방택배WOOJIN우진인터로지스REGISTPOST우편등기WOONGJI웅지익스프레스WARPEX워펙스WINION위니온로지스WIHTYOU위드유당일택배WEMOVE위무브UFREIGHT유프레이트코리아EUNHA은하쉬핑INNOS이노스(올인닷컴)EMARTEVERYDAY이마트에브리데이ESTLA이스트라ETOMARS이투마스GENERALPOST일반우편ILSHIN일신모닝택배ILYANG일양로지스GNETWORK자이언트ZENIEL제니엘시스템JLOGIST제이로지스트GENIEGO지니고당일특급GDAKOREA지디에이코리아GHSPEED지에이치스피드JIKGUMOON직구문CHUNIL천일택배CHOROC초록마을(외부연동)CHOROCMAEUL초록마을(네이버직연동)COSHIP캐나다쉬핑KJT케이제이티QRUN큐런CUBEFLOW큐브플로우QXPRESS트랙스로지스HEREWEGO탱고앤고TOMATO토마토앱TODAY투데이TSG티에스지로지스TEAMFRESH팀프레시PATEK파테크해운상공XINPATEK파테크해운항공PANASIA판월드로지스틱PANSTAR팬스타국제특송(PIEX)FOREVER퍼레버택배PULMUONE풀무원(로지스밸리)FREDIT프레딧FRESHMATES프레시메이트KURLY컬리넥스트마일PINGPONG핑퐁HOWSER하우저HIVECITY하이브시티HANDALUM한달음택배HANDEX한덱스HANMI한미포스트HANSSEM한샘HANWOORI한우리물류HPL한의사랑택배HDEXP합동택배HERWUZUG허우적GLOVIS현대글로비스HOMEINNO홈이노베이션로지스HOMEPICKTODAY홈픽오늘도착HOMEPICK홈픽택배HOMEPLUSDELIVERY홈플러스HOMEPLUSEXPRESS홈플러스익스프레스CARGOPLEASE화물을부탁해HWATONG화통CH1기타택배LETUS바로스LETUS3PL레터스CASA신세계까사GCS지씨에스GKGLOBAL지케이글로벌BRCH비알씨에이치DNDN든든택배GONELO고넬로JCLSJCLSJWTNLJWTNLGS25GS편의점(퀵배달용)CUCU편의점(퀵배달용)

deliveryMethoddeliveryMethod.pay-order-seller (string)배송 방법 코드. 250바이트 내외

코드설명비고DELIVERY택배, 등기, 소포GDFW_ISSUE_SVC굿스플로 송장 출력VISIT_RECEIPT방문 수령DIRECT_DELIVERY직접 전달QUICK_SVC퀵서비스NOTHING배송 없음RETURN_DESIGNATED지정 반품 택배RETURN_DELIVERY일반 반품 택배RETURN_INDIVIDUAL직접 반송RETURN_MERCHANT판매자 직접 수거(장보기 전용)UNKNOWN알 수 없음(예외 처리에 사용)
Example: DELIVERY

deliveryStatusdeliveryStatus.pay-order-seller (string)배송 상세 상태. 250바이트 내외

코드설명비고COLLECT_REQUEST수거 요청COLLECT_WAIT수거 대기COLLECT_CARGO집화DELIVERY_COMPLETION배송 완료DELIVERING배송중DELIVERY_FAIL배송 실패WRONG_INVOICE오류 송장COLLECT_CARGO_FAIL집화 실패COLLECT_CARGO_CANCEL집화 취소NOT_TRACKING배송 추적 없음
Example: COLLECT_REQUEST

isWrongTrackingNumberboolean오류 송장 여부. true는 송장에 오류가 있음을 의미합니다. 8바이트 내외

pickupDatestring<date-time>집화 일시. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

sendDatestring<date-time>발송 일시. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

trackingNumberstring송장 번호. 100바이트 내외

wrongTrackingNumberRegisteredDatestring<date-time>오류 송장 등록 일시. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

wrongTrackingNumberTypestring오류 사유. 300바이트 내외

]

상품 주문 정보 구조체
{
  "timestamp": "2023-01-16T17:14:51.794+09:00",
  "traceId": "string",
  "data": [
    {
      "order": {
        "chargeAmountPaymentAmount": 0,
        "checkoutAccumulationPaymentAmount": 0,
        "generalPaymentAmount": 0,
        "naverMileagePaymentAmount": 0,
        "orderDate": "2023-01-16T17:14:51.794+09:00",
        "orderDiscountAmount": 0,
        "orderId": "string",
        "ordererId": "string",
        "ordererName": "string",
        "ordererTel": "string",
        "paymentDate": "2023-01-16T17:14:51.794+09:00",
        "paymentDueDate": "2023-01-16T17:14:51.794+09:00",
        "paymentMeans": "string",
        "isDeliveryMemoParticularInput": "string",
        "payLocationType": "string",
        "ordererNo": "string",
        "payLaterPaymentAmount": 0,
        "isMembershipSubscribed": true
      },
      "productOrder": {
        "claimStatus": "string",
        "claimType": "string",
        "decisionDate": "2023-01-16T17:14:51.794+09:00",
        "delayedDispatchDetailedReason": "string",
        "delayedDispatchReason": "PRODUCT_PREPARE",
        "deliveryDiscountAmount": 0,
        "deliveryFeeAmount": 0,
        "deliveryPolicyType": "string",
        "expectedDeliveryMethod": "DELIVERY",
        "freeGift": "string",
        "mallId": "string",
        "optionPrice": 0,
        "packageNumber": "string",
        "placeOrderDate": "2023-01-16T17:14:51.794+09:00",
        "placeOrderStatus": "string",
        "productClass": "string",
        "productDiscountAmount": 0,
        "initialProductDiscountAmount": 0,
        "remainProductDiscountAmount": 0,
        "groupProductId": 0,
        "productId": "string",
        "originalProductId": "string",
        "merchantChannelId": "string",
        "productName": "string",
        "productOption": "string",
        "productOrderId": "string",
        "productOrderStatus": "string",
        "quantity": 0,
        "initialQuantity": 0,
        "remainQuantity": 0,
        "sectionDeliveryFee": 0,
        "sellerProductCode": "string",
        "shippingAddress": {
          "addressType": "string",
          "baseAddress": "string",
          "city": "string",
          "country": "string",
          "detailedAddress": "string",
          "name": "string",
          "state": "string",
          "tel1": "string",
          "tel2": "string",
          "zipCode": "string",
          "isRoadNameAddress": true,
          "pickupLocationType": "FRONT_OF_DOOR",
          "pickupLocationContent": "string",
          "entryMethod": "LOBBY_PW",
          "entryMethodContent": "string",
          "buildingManagementNo": "string",
          "longitude": "string",
          "latitude": "string"
        },
        "shippingStartDate": "2023-01-16T17:14:51.794+09:00",
        "shippingDueDate": "2023-01-16T17:14:51.794+09:00",
        "shippingFeeType": "string",
        "shippingMemo": "string",
        "takingAddress": {
          "addressType": "string",
          "baseAddress": "string",
          "city": "string",
          "country": "string",
          "detailedAddress": "string",
          "name": "string",
          "state": "string",
          "tel1": "string",
          "tel2": "string",
          "zipCode": "string",
          "isRoadNameAddress": true
        },
        "totalPaymentAmount": 0,
        "initialPaymentAmount": 0,
        "remainPaymentAmount": 0,
        "totalProductAmount": 0,
        "initialProductAmount": 0,
        "remainProductAmount": 0,
        "unitPrice": 0,
        "sellerBurdenDiscountAmount": 0,
        "initialSellerBurdenDiscountAmount": 0,
        "remainSellerBurdenDiscountAmount": 0,
        "commissionRatingType": "string",
        "commissionPrePayStatus": "string",
        "paymentCommission": 0,
        "saleCommission": 0,
        "expectedSettlementAmount": 0,
        "inflowPath": "string",
        "inflowPathAdd": "string",
        "itemNo": "string",
        "optionManageCode": "string",
        "sellerCustomCode1": "string",
        "sellerCustomCode2": "string",
        "claimId": "string",
        "channelCommission": 0,
        "individualCustomUniqueCode": "string",
        "productImediateDiscountAmount": 0,
        "initialProductImmediateDiscountAmount": 0,
        "remainProductImmediateDiscountAmount": 0,
        "productProductDiscountAmount": 0,
        "initialProductProductDiscountAmount": 0,
        "remainProductProductDiscountAmount": 0,
        "productMultiplePurchaseDiscountAmount": 0,
        "sellerBurdenImediateDiscountAmount": 0,
        "initialSellerBurdenImmediateDiscountAmount": 0,
        "remainSellerBurdenImmediateDiscountAmount": 0,
        "sellerBurdenProductDiscountAmount": 0,
        "initialSellerBurdenProductDiscountAmount": 0,
        "remainSellerBurdenProductDiscountAmount": 0,
        "sellerBurdenMultiplePurchaseDiscountAmount": 0,
        "initialSellerBurdenMultiplePurchaseDiscountAmount": 0,
        "remainSellerBurdenMultiplePurchaseDiscountAmount": 0,
        "knowledgeShoppingSellingInterlockCommission": 0,
        "giftReceivingStatus": "string",
        "sellerBurdenStoreDiscountAmount": 0,
        "initialSellerBurdenStoreDiscountAmount": 0,
        "remainSellerBurdenStoreDiscountAmount": 0,
        "sellerBurdenMultiplePurchaseDiscountType": "IGNORE_QUANTITY",
        "logisticsCompanyId": "string",
        "logisticsCenterId": "string",
        "skuMappings": [
          {
            "nsId": "string",
            "nsBarcode": "string",
            "pickingQuantityPerOrder": 0
          }
        ],
        "hopeDelivery": {
          "region": "string",
          "additionalFee": 0,
          "hopeDeliveryYmd": "string",
          "hopeDeliveryHm": "string",
          "changeReason": "string",
          "changer": "string"
        },
        "deliveryAttributeType": "string",
        "expectedDeliveryCompany": "string",
        "arrivalGuaranteeDate": "2023-01-16T17:14:51.794+09:00",
        "deliveryTagType": "string",
        "taxType": "string",
        "storageType": "string",
        "logisticsDirectContracted": true,
        "appliedCoupons": [
          {
            "couponPublishNumber": "string",
            "couponClassCode": "string",
            "couponDiscountAmount": 0,
            "naverBurdenRatio": 0
          }
        ],
        "standardPurchaseOptions": [
          {
            "optionId": "string",
            "optionName": "string",
            "valueName": "string"
          }
        ],
        "appliedCardPromotion": {
          "promotionName": "string",
          "cardCompanyName": "string",
          "promotionApplyAmount": 0,
          "brandCompanyBurdenRatio": 0
        }
      },
      "cancel": {
        "claimId": "string",
        "cancelApprovalDate": "2023-01-16T17:14:51.794+09:00",
        "cancelCompletedDate": "2023-01-16T17:14:51.794+09:00",
        "cancelDetailedReason": "string",
        "cancelReason": "string",
        "claimRequestDate": "2023-01-16T17:14:51.794+09:00",
        "claimStatus": "string",
        "refundExpectedDate": "2023-01-16T17:14:51.794+09:00",
        "refundStandbyReason": "string",
        "refundStandbyStatus": "string",
        "requestChannel": "string",
        "requestQuantity": 0
      },
      "return": {
        "claimId": "string",
        "claimDeliveryFeeDemandAmount": 0,
        "claimDeliveryFeePayMeans": "string",
        "claimDeliveryFeePayMethod": "string",
        "claimRequestDate": "2023-01-16T17:14:51.794+09:00",
        "claimStatus": "string",
        "collectAddress": {
          "addressType": "string",
          "baseAddress": "string",
          "city": "string",
          "country": "string",
          "detailedAddress": "string",
          "name": "string",
          "state": "string",
          "tel1": "string",
          "tel2": "string",
          "zipCode": "string",
          "isRoadNameAddress": true
        },
        "collectCompletedDate": "2023-01-16T17:14:51.794+09:00",
        "collectDeliveryCompany": "string",
        "collectDeliveryMethod": "DELIVERY",
        "collectStatus": "NOT_REQUESTED",
        "collectTrackingNumber": "string",
        "etcFeeDemandAmount": 0,
        "etcFeePayMeans": "string",
        "etcFeePayMethod": "string",
        "holdbackDetailedReason": "string",
        "holdbackReason": "string",
        "holdbackStatus": "string",
        "refundExpectedDate": "2023-01-16T17:14:51.794+09:00",
        "refundStandbyReason": "string",
        "refundStandbyStatus": "string",
        "requestChannel": "string",
        "requestQuantity": 0,
        "returnDetailedReason": "string",
        "returnReason": "string",
        "returnReceiveAddress": {
          "addressType": "string",
          "baseAddress": "string",
          "city": "string",
          "country": "string",
          "detailedAddress": "string",
          "name": "string",
          "state": "string",
          "tel1": "string",
          "tel2": "string",
          "zipCode": "string",
          "isRoadNameAddress": true,
          "logisticsCenterId": "string"
        },
        "returnCompletedDate": "2023-01-16T17:14:51.794+09:00",
        "holdbackConfigDate": "2023-01-16T17:14:51.794+09:00",
        "holdbackConfigurer": "string",
        "holdbackReleaseDate": "2023-01-16T17:14:51.794+09:00",
        "holdbackReleaser": "string",
        "claimDeliveryFeeProductOrderIds": "string",
        "claimDeliveryFeeDiscountAmount": 0,
        "remoteAreaCostChargeAmount": 0,
        "membershipsArrivalGuaranteeClaimSupportingAmount": 0,
        "returnImageUrl": [
          "string"
        ],
        "claimDeliveryFeeSupportType": "string",
        "claimDeliveryFeeSupportAmount": 0,
        "collectAttributeType": "LOGISTICS_COLLECT"
      },
      "exchange": {
        "claimId": "string",
        "claimDeliveryFeeDemandAmount": 0,
        "claimDeliveryFeePayMeans": "string",
        "claimDeliveryFeePayMethod": "string",
        "claimRequestDate": "2023-01-16T17:14:51.794+09:00",
        "claimStatus": "string",
        "collectAddress": {
          "addressType": "string",
          "baseAddress": "string",
          "city": "string",
          "country": "string",
          "detailedAddress": "string",
          "name": "string",
          "state": "string",
          "tel1": "string",
          "tel2": "string",
          "zipCode": "string",
          "isRoadNameAddress": true
        },
        "collectCompletedDate": "2023-01-16T17:14:51.794+09:00",
        "collectDeliveryCompany": "string",
        "collectDeliveryMethod": "DELIVERY",
        "collectStatus": "NOT_REQUESTED",
        "collectTrackingNumber": "string",
        "etcFeeDemandAmount": 0,
        "etcFeePayMeans": "string",
        "etcFeePayMethod": "string",
        "exchangeDetailedReason": "string",
        "exchangeReason": "string",
        "holdbackDetailedReason": "string",
        "holdbackReason": "string",
        "holdbackStatus": "string",
        "reDeliveryMethod": "DELIVERY",
        "reDeliveryStatus": "COLLECT_REQUEST",
        "reDeliveryCompany": "string",
        "reDeliveryTrackingNumber": "string",
        "reDeliveryAddress": {
          "addressType": "string",
          "baseAddress": "string",
          "city": "string",
          "country": "string",
          "detailedAddress": "string",
          "name": "string",
          "state": "string",
          "tel1": "string",
          "tel2": "string",
          "zipCode": "string",
          "isRoadNameAddress": true
        },
        "requestChannel": "string",
        "requestQuantity": 0,
        "returnReceiveAddress": {
          "addressType": "string",
          "baseAddress": "string",
          "city": "string",
          "country": "string",
          "detailedAddress": "string",
          "name": "string",
          "state": "string",
          "tel1": "string",
          "tel2": "string",
          "zipCode": "string",
          "isRoadNameAddress": true,
          "logisticsCenterId": "string"
        },
        "holdbackConfigDate": "2023-01-16T17:14:51.794+09:00",
        "holdbackConfigurer": "string",
        "holdbackReleaseDate": "2023-01-16T17:14:51.794+09:00",
        "holdbackReleaser": "string",
        "claimDeliveryFeeProductOrderIds": "string",
        "reDeliveryOperationDate": "2023-01-16T17:14:51.794+09:00",
        "claimDeliveryFeeDiscountAmount": 0,
        "remoteAreaCostChargeAmount": 0,
        "membershipsArrivalGuaranteeClaimSupportingAmount": 0,
        "exchangeImageUrl": [
          "string"
        ],
        "claimDeliveryFeeSupportType": "string",
        "claimDeliveryFeeSupportAmount": 0,
        "collectAttributeType": "LOGISTICS_COLLECT"
      },
      "beforeClaim": {
        "exchange": {
          "claimId": "string",
          "claimDeliveryFeeDemandAmount": 0,
          "claimDeliveryFeePayMeans": "string",
          "claimDeliveryFeePayMethod": "string",
          "claimRequestDate": "2023-01-16T17:14:51.794+09:00",
          "claimStatus": "string",
          "collectAddress": {
            "addressType": "string",
            "baseAddress": "string",
            "city": "string",
            "country": "string",
            "detailedAddress": "string",
            "name": "string",
            "state": "string",
            "tel1": "string",
            "tel2": "string",
            "zipCode": "string",
            "isRoadNameAddress": true
          },
          "collectCompletedDate": "2023-01-16T17:14:51.794+09:00",
          "collectDeliveryCompany": "string",
          "collectDeliveryMethod": "DELIVERY",
          "collectStatus": "NOT_REQUESTED",
          "collectTrackingNumber": "string",
          "etcFeeDemandAmount": 0,
          "etcFeePayMeans": "string",
          "etcFeePayMethod": "string",
          "exchangeDetailedReason": "string",
          "exchangeReason": "string",
          "holdbackDetailedReason": "string",
          "holdbackReason": "string",
          "holdbackStatus": "string",
          "reDeliveryMethod": "DELIVERY",
          "reDeliveryStatus": "COLLECT_REQUEST",
          "reDeliveryCompany": "string",
          "reDeliveryTrackingNumber": "string",
          "reDeliveryAddress": {
            "addressType": "string",
            "baseAddress": "string",
            "city": "string",
            "country": "string",
            "detailedAddress": "string",
            "name": "string",
            "state": "string",
            "tel1": "string",
            "tel2": "string",
            "zipCode": "string",
            "isRoadNameAddress": true
          },
          "requestChannel": "string",
          "requestQuantity": 0,
          "returnReceiveAddress": {
            "addressType": "string",
            "baseAddress": "string",
            "city": "string",
            "country": "string",
            "detailedAddress": "string",
            "name": "string",
            "state": "string",
            "tel1": "string",
            "tel2": "string",
            "zipCode": "string",
            "isRoadNameAddress": true,
            "logisticsCenterId": "string"
          },
          "holdbackConfigDate": "2023-01-16T17:14:51.794+09:00",
          "holdbackConfigurer": "string",
          "holdbackReleaseDate": "2023-01-16T17:14:51.794+09:00",
          "holdbackReleaser": "string",
          "claimDeliveryFeeProductOrderIds": "string",
          "reDeliveryOperationDate": "2023-01-16T17:14:51.794+09:00",
          "claimDeliveryFeeDiscountAmount": 0,
          "remoteAreaCostChargeAmount": 0,
          "membershipsArrivalGuaranteeClaimSupportingAmount": 0,
          "exchangeImageUrl": [
            "string"
          ],
          "claimDeliveryFeeSupportType": "string",
          "claimDeliveryFeeSupportAmount": 0,
          "collectAttributeType": "LOGISTICS_COLLECT"
        }
      },
      "currentClaim": {
        "cancel": {
          "claimId": "string",
          "cancelApprovalDate": "2023-01-16T17:14:51.794+09:00",
          "cancelCompletedDate": "2023-01-16T17:14:51.794+09:00",
          "cancelDetailedReason": "string",
          "cancelReason": "string",
          "claimRequestDate": "2023-01-16T17:14:51.794+09:00",
          "claimStatus": "string",
          "refundExpectedDate": "2023-01-16T17:14:51.794+09:00",
          "refundStandbyReason": "string",
          "refundStandbyStatus": "string",
          "requestChannel": "string",
          "requestQuantity": 0
        },
        "return": {
          "claimId": "string",
          "claimDeliveryFeeDemandAmount": 0,
          "claimDeliveryFeePayMeans": "string",
          "claimDeliveryFeePayMethod": "string",
          "claimRequestDate": "2023-01-16T17:14:51.794+09:00",
          "claimStatus": "string",
          "collectAddress": {
            "addressType": "string",
            "baseAddress": "string",
            "city": "string",
            "country": "string",
            "detailedAddress": "string",
            "name": "string",
            "state": "string",
            "tel1": "string",
            "tel2": "string",
            "zipCode": "string",
            "isRoadNameAddress": true
          },
          "collectCompletedDate": "2023-01-16T17:14:51.794+09:00",
          "collectDeliveryCompany": "string",
          "collectDeliveryMethod": "DELIVERY",
          "collectStatus": "NOT_REQUESTED",
          "collectTrackingNumber": "string",
          "etcFeeDemandAmount": 0,
          "etcFeePayMeans": "string",
          "etcFeePayMethod": "string",
          "holdbackDetailedReason": "string",
          "holdbackReason": "string",
          "holdbackStatus": "string",
          "refundExpectedDate": "2023-01-16T17:14:51.794+09:00",
          "refundStandbyReason": "string",
          "refundStandbyStatus": "string",
          "requestChannel": "string",
          "requestQuantity": 0,
          "returnDetailedReason": "string",
          "returnReason": "string",
          "returnReceiveAddress": {
            "addressType": "string",
            "baseAddress": "string",
            "city": "string",
            "country": "string",
            "detailedAddress": "string",
            "name": "string",
            "state": "string",
            "tel1": "string",
            "tel2": "string",
            "zipCode": "string",
            "isRoadNameAddress": true,
            "logisticsCenterId": "string"
          },
          "returnCompletedDate": "2023-01-16T17:14:51.794+09:00",
          "holdbackConfigDate": "2023-01-16T17:14:51.794+09:00",
          "holdbackConfigurer": "string",
          "holdbackReleaseDate": "2023-01-16T17:14:51.794+09:00",
          "holdbackReleaser": "string",
          "claimDeliveryFeeProductOrderIds": "string",
          "claimDeliveryFeeDiscountAmount": 0,
          "remoteAreaCostChargeAmount": 0,
          "membershipsArrivalGuaranteeClaimSupportingAmount": 0,
          "returnImageUrl": [
            "string"
          ],
          "claimDeliveryFeeSupportType": "string",
          "claimDeliveryFeeSupportAmount": 0,
          "collectAttributeType": "LOGISTICS_COLLECT"
        },
        "exchange": {
          "claimId": "string",
          "claimDeliveryFeeDemandAmount": 0,
          "claimDeliveryFeePayMeans": "string",
          "claimDeliveryFeePayMethod": "string",
          "claimRequestDate": "2023-01-16T17:14:51.794+09:00",
          "claimStatus": "string",
          "collectAddress": {
            "addressType": "string",
            "baseAddress": "string",
            "city": "string",
            "country": "string",
            "detailedAddress": "string",
            "name": "string",
            "state": "string",
            "tel1": "string",
            "tel2": "string",
            "zipCode": "string",
            "isRoadNameAddress": true
          },
          "collectCompletedDate": "2023-01-16T17:14:51.794+09:00",
          "collectDeliveryCompany": "string",
          "collectDeliveryMethod": "DELIVERY",
          "collectStatus": "NOT_REQUESTED",
          "collectTrackingNumber": "string",
          "etcFeeDemandAmount": 0,
          "etcFeePayMeans": "string",
          "etcFeePayMethod": "string",
          "exchangeDetailedReason": "string",
          "exchangeReason": "string",
          "holdbackDetailedReason": "string",
          "holdbackReason": "string",
          "holdbackStatus": "string",
          "reDeliveryMethod": "DELIVERY",
          "reDeliveryStatus": "COLLECT_REQUEST",
          "reDeliveryCompany": "string",
          "reDeliveryTrackingNumber": "string",
          "reDeliveryAddress": {
            "addressType": "string",
            "baseAddress": "string",
            "city": "string",
            "country": "string",
            "detailedAddress": "string",
            "name": "string",
            "state": "string",
            "tel1": "string",
            "tel2": "string",
            "zipCode": "string",
            "isRoadNameAddress": true
          },
          "requestChannel": "string",
          "requestQuantity": 0,
          "returnReceiveAddress": {
            "addressType": "string",
            "baseAddress": "string",
            "city": "string",
            "country": "string",
            "detailedAddress": "string",
            "name": "string",
            "state": "string",
            "tel1": "string",
            "tel2": "string",
            "zipCode": "string",
            "isRoadNameAddress": true,
            "logisticsCenterId": "string"
          },
          "holdbackConfigDate": "2023-01-16T17:14:51.794+09:00",
          "holdbackConfigurer": "string",
          "holdbackReleaseDate": "2023-01-16T17:14:51.794+09:00",
          "holdbackReleaser": "string",
          "claimDeliveryFeeProductOrderIds": "string",
          "reDeliveryOperationDate": "2023-01-16T17:14:51.794+09:00",
          "claimDeliveryFeeDiscountAmount": 0,
          "remoteAreaCostChargeAmount": 0,
          "membershipsArrivalGuaranteeClaimSupportingAmount": 0,
          "exchangeImageUrl": [
            "string"
          ],
          "claimDeliveryFeeSupportType": "string",
          "claimDeliveryFeeSupportAmount": 0,
          "collectAttributeType": "LOGISTICS_COLLECT"
        }
      },
      "completedClaims": [
        {
          "claimType": "string",
          "claimId": "string",
          "claimStatus": "string",
          "claimRequestDate": "2023-01-16T17:14:51.794+09:00",
          "requestChannel": "string",
          "claimRequestDetailContent": "string",
          "claimRequestReason": "string",
          "refundExpectedDate": "2023-01-16T17:14:51.794+09:00",
          "refundStandbyReason": "string",
          "refundStandbyStatus": "string",
          "requestQuantity": 0,
          "claimDeliveryFeeDemandAmount": 0,
          "claimDeliveryFeePayMeans": "string",
          "claimDeliveryFeePayMethod": "string",
          "returnReceiveAddress": {
            "addressType": "string",
            "baseAddress": "string",
            "city": "string",
            "country": "string",
            "detailedAddress": "string",
            "name": "string",
            "state": "string",
            "tel1": "string",
            "tel2": "string",
            "zipCode": "string",
            "isRoadNameAddress": true,
            "logisticsCenterId": "string"
          },
          "collectAddress": {
            "addressType": "string",
            "baseAddress": "string",
            "city": "string",
            "country": "string",
            "detailedAddress": "string",
            "name": "string",
            "state": "string",
            "tel1": "string",
            "tel2": "string",
            "zipCode": "string",
            "isRoadNameAddress": true
          },
          "collectCompletedDate": "2023-01-16T17:14:51.794+09:00",
          "collectDeliveryCompany": "string",
          "collectDeliveryMethod": "DELIVERY",
          "collectStatus": "NOT_REQUESTED",
          "collectTrackingNumber": "string",
          "etcFeeDemandAmount": 0,
          "etcFeePayMeans": "string",
          "etcFeePayMethod": "string",
          "holdbackDetailedReason": "string",
          "holdbackReason": "string",
          "holdbackStatus": "string",
          "holdbackConfigDate": "2023-01-16T17:14:51.794+09:00",
          "holdbackConfigurer": "string",
          "holdbackReleaseDate": "2023-01-16T17:14:51.794+09:00",
          "holdbackReleaser": "string",
          "claimDeliveryFeeProductOrderIds": "string",
          "claimDeliveryFeeDiscountAmount": 0,
          "remoteAreaCostChargeAmount": 0,
          "claimCompleteOperationDate": "2023-01-16T17:14:51.794+09:00",
          "claimRequestAdmissionDate": "2023-01-16T17:14:51.794+09:00",
          "collectOperationDate": "string",
          "collectStartTime": "string",
          "collectEndTime": "string",
          "collectSlotId": "string",
          "reDeliveryAddress": {
            "addressType": "string",
            "baseAddress": "string",
            "city": "string",
            "country": "string",
            "detailedAddress": "string",
            "name": "string",
            "state": "string",
            "tel1": "string",
            "tel2": "string",
            "zipCode": "string",
            "isRoadNameAddress": true
          },
          "reDeliveryMethod": "DELIVERY",
          "reDeliveryStatus": "COLLECT_REQUEST",
          "reDeliveryCompany": "string",
          "reDeliveryTrackingNumber": "string",
          "reDeliveryOperationDate": "2023-01-16T17:14:51.794+09:00",
          "membershipsArrivalGuaranteeClaimSupportingAmount": 0,
          "claimDeliveryFeeSupportType": "string",
          "claimDeliveryFeeSupportAmount": 0,
          "collectAttributeType": "LOGISTICS_COLLECT"
        }
      ],
      "delivery": {
        "deliveredDate": "2023-01-16T17:14:51.794+09:00",
        "deliveryCompany": "string",
        "deliveryMethod": "DELIVERY",
        "deliveryStatus": "COLLECT_REQUEST",
        "isWrongTrackingNumber": true,
        "pickupDate": "2023-01-16T17:14:51.794+09:00",
        "sendDate": "2023-01-16T17:14:51.794+09:00",
        "trackingNumber": "string",
        "wrongTrackingNumberRegisteredDate": "2023-01-16T17:14:51.794+09:00",
        "wrongTrackingNumberType": "string"
      }
    }
  ]
}
