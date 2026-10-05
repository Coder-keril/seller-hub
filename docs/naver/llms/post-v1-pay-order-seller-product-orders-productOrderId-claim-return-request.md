---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/seller-request-return-pay-order-seller
---
# POST /v1/pay-order/seller/product-orders/{productOrderId}/claim/return/request - 반품 요청

발송 이후의 상품 주문에 대해 판매자가 반품 클레임을 시작하는 endpoint로, 발송완료·배송중·배송완료 상태에서 호출해 클레임 상태 머신의 반품요청 단계를 생성합니다. returnReason은 필수 enum(INTENT_CHANGED·BROKEN·WRONG_DELIVERY·WRONG_OPTION 등)에서 선택하고 collectDeliveryMethod도 필수로 지정해야 하며, 일반적으로 RETURN_DESIGNATED나 RETURN_DELIVERY 같은 반품 택배 코드와 함께 collectDeliveryCompany(택배사) 및 collectTrackingNumber(수거 송장 번호)를 함께 전달해 수거 추적이 가능하도록 합니다. returnQuantity를 생략하면 전체 수량 반품, 지정하면 부분 수량 반품으로 처리됩니다. 이 호출 이후 수거가 진행되고 판매자는 별도의 반품 승인(approve) endpoint로 클레임을 마무리해 환불을 확정하는 페어 호출이 일반적이며, 책임 소재나 사유 불일치가 있는 경우 반품 거부(reject) 또는 반품 보류(holdback)로 분기할 수 있습니다. 응답의 successProductOrderIds와 failProductOrderInfos로 부분 성공·실패를 분리해 받습니다. 400은 상태 전이 불가·사유나 수거 방법 누락, 500은 일시 장애로 보고 traceId 기반 재시도와 중복 클레임 방지를 위해 호출 전 currentClaim 상태를 확인합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| productOrderId | path | string | 필수 | 상품 주문 번호 |

### 요청 본문

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| returnReason | body | string | 필수 | 클레임 요청 사유. 250바이트 내외<br>코드 \| 설명 \| 비고<br>-----\|-----\|------<br>INTENT_CHANGED \| 구매 의사 취소 \|<br>COLOR_AND_SIZE \| 색상 및 사이즈 변경 \|<br>WRONG_ORDER \| 다른 상품 잘못 주문 \|<br>PRODUCT_UNSATISFIED \| 서비스 불만족 \|<br>DELAYED_DELIVERY \| 배송 지연 \|<br>SOLD_OUT \| 상품 품절 \|<br>DROPPED_DELIVERY \| 배송 누락 \|<br>BROKEN \| 상품 파손 \|<br>INCORRECT_INFO \| 상품 정보 상이 \|<br>WRONG_DELIVERY \| 오배송 \|<br>WRONG_OPTION \| 색상 등 다른 상품 잘못 배송 \| |
| collectDeliveryMethod | body | string | 필수 | 배송 방법 코드. 250바이트 내외<br>코드 \| 설명 \| 비고<br>-----\|-----\|------<br>DELIVERY \| 택배, 등기, 소포 \|<br>GDFW_ISSUE_SVC \| 굿스플로 송장 출력 \|<br>VISIT_RECEIPT \| 방문 수령 \|<br>DIRECT_DELIVERY \| 직접 전달 \|<br>QUICK_SVC \| 퀵서비스 \|<br>NOTHING \| 배송 없음 \|<br>RETURN_DESIGNATED \| 지정 반품 택배 \|<br>RETURN_DELIVERY \| 일반 반품 택배 \|<br>RETURN_INDIVIDUAL \| 직접 반송 \|<br>RETURN_MERCHANT \| 판매자 직접 수거(장보기 전용) \|<br>UNKNOWN \| 알 수 없음(예외 처리에 사용) \| |
| collectDeliveryCompany | body | string |  | 택배사 코드. 250바이트 내외<br>코드 \| 설명 \| 비고<br>-----\|-----\|------<br>CJGLS \| CJ대한통운 \|<br>HYUNDAI \| 롯데택배 \|<br>HANJIN \| 한진택배 \|<br>KGB \| 로젠택배 \|<br>EPOST \| 우체국택배 \|<br>MTINTER \| 엠티인터내셔널 \|<br>1004HOME \| 1004HOME \|<br>TWOFASTEXPRESS \| 2FAST익스프레스 \|<br>ACE \| ACEexpress \|<br>ACIEXPRESS \| ACI \|<br>ADCAIR \| ADC항운택배 \|<br>AIRWAY \| AIRWAY익스프레스 \|<br>APEX \| APEX \|<br>ARAMEX \| ARAMEX \|<br>ARGO \| ARGO \|<br>AIRBOY \| AirboyExpress \|<br>KOREXG \| CJ대한통운(국제택배) \|<br>CUPARCEL \| CU편의점택배 \|<br>CWAYEXPRESS \| CwayExpress \|<br>DHL \| DHL \|<br>DHLDE \| DHL(독일) \|<br>DHLGLOBALMAIL \| DHLGlobalMail \|<br>DPD \| DPD \|<br>ECMSEXPRESS \| ECMSExpress \|<br>EFS \| EFS \|<br>EMS \| EMS \|<br>EZUSA \| EZUSA \|<br>EUROPARCEL \| EuroParcel \|<br>FEDEX \| FEDEX \|<br>GOP \| GOP당일택배 \|<br>GOS \| GOS당일택배 \|<br>GPSLOGIX \| GPSLOGIX \|<br>GSFRESH \| GSFresh \|<br>GSIEXPRESS \| GSI익스프레스 \|<br>GSMNTON \| GSMNTON \|<br>GSPOSTBOX \| GSPostbox퀵 \|<br>CVSNET \| GSPostbox택배 \|<br>GS더프레시 \| GSTHEFRESH \|<br>GTSLOGIS \| GTS로지스 \|<br>HYBRID \| HI택배 \|<br>HY \| HY \|<br>IK \| IK물류 \|<br>KGLNET \| KGL네트웍스 \|<br>KT \| KT EXPRESS \|<br>LGE \| LG전자배송센터 \|<br>LTL \| LTL \|<br>NDEXKOREA \| NDEX KOREA \|<br>SBGLS \| SBGLS \|<br>SFEX \| SFexpress \|<br>SLX \| SLX택배 \|<br>SSG \| SSG \|<br>TNT \| TNT \|<br>LOGISPARTNER \| UFO로지스 \|<br>UPS \| UPS \|<br>USPS \| USPS \|<br>WIZWA \| WIZWA \|<br>YJSWORLD \| YJS글로벌 \|<br>YJS \| YJS글로벌(영국) \|<br>YUNDA \| YUNDAEXPRESS \|<br>IPARCEL \| i-parcel \|<br>KY \| 건영복합물류 \|<br>KUNYOUNG \| 건영택배 \|<br>KDEXP \| 경동택배 \|<br>KIN \| 경인택배 \|<br>KORYO \| 고려택배 \|<br>GDSP \| 골드스넵스 \|<br>KOKUSAI \| 국제익스프레스 \|<br>GOODTOLUCK \| 굿투럭 \|<br>NAEUN \| 나은물류 \|<br>NOGOK \| 노곡물류 \|<br>NONGHYUP \| 농협택배 \|<br>HANAROMART \| 농협하나로마트 \|<br>DAELIM \| 대림통운 \|<br>DAESIN \| 대신택배 \|<br>DAEWOON \| 대운글로벌 \|<br>THEBAO \| 더바오 \|<br>DODOFLEX \| 도도플렉스 \|<br>DONGGANG \| 동강물류 \|<br>DONGJIN \| 동진특송 \|<br>CHAINLOGIS \| 두발히어로당일택배 \|<br>DRABBIT \| 딜리래빗 \|<br>JMNP \| 딜리박스 \|<br>ONEDAYLOGIS \| 라스트마일 \|<br>LINEEXP \| 라인익스프레스 \|<br>ROADSUNEXPRESS \| 로드썬익스프레스 \|<br>LOGISVALLEY \| 로지스밸리 \|<br>POOLATHOME \| 로지스올홈케어(풀앳홈) \|<br>LOTOS \| 로토스 \|<br>HLCGLOBAL \| 롯데글로벌로지스(국제택배) \|<br>LOTTECHILSUNG \| 롯데칠성 \|<br>MDLOGIS \| 모든로지스(SLO) \|<br>DASONG \| 물류대장 \|<br>BABABA \| 바바바로지스 \|<br>BANPOOM \| 반품구조대 \|<br>VALEX \| 발렉스 \|<br>SHIPNERGY \| 배송하기좋은날 \|<br>PANTOS \| LX판토스 \|<br>VROONG \| 부릉 \|<br>BRIDGE \| 브릿지로지스 \|<br>EKDP \| 삼다수가정배송 \|<br>SELC \| 삼성전자물류 \|<br>SEORIM\| 서림물류 \|<br>SWGEXP \| 성원글로벌 \|<br>SUNGHUN \| 성훈물류 \|<br>SEBANG \| 세방택배 \|<br>SMARTLOGIS \| 스마트로지스 \|<br>SPARKLE \| 스파클직배송 \|<br>SPASYS1 \| 스페이시스원 \|<br>CRLX \| 시알로지텍 \|<br>ANYTRACK \| 애니트랙 \|<br>ABOUTPET \| 어바웃펫 \|<br>ESTHER \| 에스더쉬핑 \|<br>VENDORPIA \| 벤더피아 \|<br>ACTCORE \| 에이씨티앤코아 \|<br>HKHOLDINGS \| 에이치케이홀딩스 \|<br>NTLPS \| 엔티엘피스 \|<br>TODAYPICKUP \| 카카오T당일배송 \|<br>RUSH \| 오늘회러쉬 \|<br>ALLIN \| 올인닷컴 \|<br>ALLTAKOREA \| 올타코리아 \|<br>WIDETECH \| 와이드테크 \|<br>YONGMA \| 용마로지스 \|<br>DCOMMERCE \| 우리동네커머스 \|<br>WEVILL \| 우리동네택배 \|<br>HONAM \| 우리택배 \|<br>WOORIHB \| 우리한방택배 \|<br>WOOJIN \| 우진인터로지스 \|<br>REGISTPOST \| 우편등기 \|<br>WOONGJI \| 웅지익스프레스 \|<br>WARPEX \| 워펙스 \|<br>WINION \| 위니온로지스 \|<br>WIHTYOU \| 위드유당일택배 \|<br>WEMOVE \| 위무브 \|<br>UFREIGHT \| 유프레이트코리아 \|<br>EUNHA \| 은하쉬핑 \|<br>INNOS \| 이노스(올인닷컴) \|<br>EMARTEVERYDAY \| 이마트에브리데이 \|<br>ESTLA \| 이스트라 \|<br>ETOMARS \| 이투마스 \|<br>GENERALPOST \| 일반우편 \|<br>ILSHIN \| 일신모닝택배 \|<br>ILYANG \| 일양로지스 \|<br>GNETWORK \| 자이언트 \|<br>ZENIEL \| 제니엘시스템 \|<br>JLOGIST \| 제이로지스트 \|<br>GENIEGO \| 지니고당일특급 \|<br>GDAKOREA \| 지디에이코리아 \|<br>GHSPEED \| 지에이치스피드 \|<br>JIKGUMOON \| 직구문 \|<br>CHUNIL \| 천일택배 \|<br>CHOROC \| 초록마을(외부연동) \|<br>CHOROCMAEUL \| 초록마을(네이버직연동) \|<br>COSHIP \| 캐나다쉬핑 \|<br>KJT \| 케이제이티 \|<br>QRUN \| 큐런 \|<br>CUBEFLOW \| 큐브플로우 \|<br>QXPRESS \| 트랙스로지스 \|<br>HEREWEGO \| 탱고앤고 \|<br>TOMATO \| 토마토앱 \|<br>TODAY \| 투데이 \|<br>TSG \| 티에스지로지스 \|<br>TEAMFRESH \| 팀프레시 \|<br>PATEK \| 파테크해운상공 \|<br>XINPATEK \| 파테크해운항공 \|<br>PANASIA \| 판월드로지스틱 \|<br>PANSTAR \| 팬스타국제특송(PIEX) \|<br>FOREVER \| 퍼레버택배 \|<br>PULMUONE \| 풀무원(로지스밸리) \|<br>FREDIT \| 프레딧 \|<br>FRESHMATES \| 프레시메이트 \|<br>KURLY \| 컬리넥스트마일 \|<br>PINGPONG \| 핑퐁 \|<br>HOWSER \| 하우저 \|<br>HIVECITY \| 하이브시티 \|<br>HANDALUM \| 한달음택배 \|<br>HANDEX \| 한덱스 \|<br>HANMI \| 한미포스트 \|<br>HANSSEM \| 한샘 \|<br>HANWOORI \| 한우리물류 \|<br>HPL \| 한의사랑택배 \|<br>HDEXP \| 합동택배 \|<br>HERWUZUG \| 허우적 \|<br>GLOVIS \| 현대글로비스 \|<br>HOMEINNO \| 홈이노베이션로지스 \|<br>HOMEPICKTODAY \| 홈픽오늘도착 \|<br>HOMEPICK \| 홈픽택배 \|<br>HOMEPLUSDELIVERY \| 홈플러스 \|<br>HOMEPLUSEXPRESS \| 홈플러스익스프레스 \|<br>CARGOPLEASE \| 화물을부탁해 \|<br>HWATONG \| 화통 \|<br>CH1 \| 기타택배 \|<br>LETUS \| 바로스 \|<br>LETUS3PL \| 레터스 \|<br>CASA \| 신세계까사 \|<br>GCS \| 지씨에스 \|<br>GKGLOBAL \| 지케이글로벌 \|<br>BRCH \| 비알씨에이치 \|<br>DNDN \| 든든택배 \|<br>GONELO \| 고넬로 \|<br>JCLS \| JCLS \|<br>JWTNL \| JWTNL \|<br>GS25 \| GS편의점(퀵배달용) \|<br>CU \| CU편의점(퀵배달용) \| |
| collectTrackingNumber | body | string |  | 수거 송장 번호 |
| returnQuantity | body | integer |  | 반품 수량 (미입력 시 전체수량반품) |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| timestamp | - | string(date-time) |  |  |
| traceId | - | string | 필수 |  |
| data | - | object |  |  |
| data.successProductOrderIds | - | array |  | (성공) 상품 주문 번호 |
| data.successProductOrderIds.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| data.failProductOrderInfos | - | array |  |  |
| data.failProductOrderInfos.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |

### 에러 코드

| 상태 코드 | 설명 |
|-----------|------|
| 400 |  |
| 500 |  |

### 호출 예시

```bash
curl -X POST 'https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders/{productOrderId}/claim/return/request' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```