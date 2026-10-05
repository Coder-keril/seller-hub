---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/seller-re-delivery-exchange-pay-order-seller
---
# POST /v1/pay-order/seller/product-orders/{productOrderId}/claim/exchange/dispatch - 교환 재배송 처리

교환 클레임에서 수거가 완료된 상품 주문의 교환 상품을 판매자가 다시 발송하는 교환 재배송 처리 endpoint로, 클레임 상태 머신에서 교환수거완료 -> 교환재배송 단계로 전이시켜 구매자에게 교체품을 보냅니다. reDeliveryMethod로 배송 방법(DELIVERY, GDFW_ISSUE_SVC, QUICK_SVC 등)을 지정하고 reDeliveryCompany로 택배사 코드(CJGLS, HANJIN, EPOST 등)와 reDeliveryTrackingNumber로 송장 번호를 함께 전달해야 운영상 정상적인 배송 추적이 이뤄지며, OAS 상 required로 표기돼 있지 않더라도 이 송장 3종 세트는 실질 필수 파라미터로 간주합니다. 본 endpoint는 일반 발송(dispatch)과 별개의 흐름이므로 일반 발송 API를 사용하지 않도록 주의해야 합니다. 응답의 successProductOrderIds와 failProductOrderInfos를 분리해 받아 부분 실패에 대응하며, 교환 수거가 아직 완료되지 않았거나 보류 상태인 건은 처리 대상에서 제외됩니다. 재발송 송장은 한 번 입력되면 그대로 구매자 알림에 반영되므로 송장 번호 정정은 별도 API로 수행해야 합니다. 400은 상태 전이 불가·송장 형식 오류, 500은 일시 장애로 보고 traceId 기반 재시도와 idempotency 키 관리로 중복 재발송 처리를 방지합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| productOrderId | path | string | 필수 | 상품 주문 번호 |

### 요청 본문

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| reDeliveryMethod | body | string |  | 배송 방법 코드. 250바이트 내외<br>코드 \| 설명 \| 비고<br>-----\|-----\|------<br>DELIVERY \| 택배, 등기, 소포 \|<br>GDFW_ISSUE_SVC \| 굿스플로 송장 출력 \|<br>VISIT_RECEIPT \| 방문 수령 \|<br>DIRECT_DELIVERY \| 직접 전달 \|<br>QUICK_SVC \| 퀵서비스 \|<br>NOTHING \| 배송 없음 \|<br>RETURN_DESIGNATED \| 지정 반품 택배 \|<br>RETURN_DELIVERY \| 일반 반품 택배 \|<br>RETURN_INDIVIDUAL \| 직접 반송 \|<br>RETURN_MERCHANT \| 판매자 직접 수거(장보기 전용) \|<br>UNKNOWN \| 알 수 없음(예외 처리에 사용) \| |
| reDeliveryCompany | body | string |  | 택배사 코드. 250바이트 내외<br>코드 \| 설명 \| 비고<br>-----\|-----\|------<br>CJGLS \| CJ대한통운 \|<br>HYUNDAI \| 롯데택배 \|<br>HANJIN \| 한진택배 \|<br>KGB \| 로젠택배 \|<br>EPOST \| 우체국택배 \|<br>MTINTER \| 엠티인터내셔널 \|<br>1004HOME \| 1004HOME \|<br>TWOFASTEXPRESS \| 2FAST익스프레스 \|<br>ACE \| ACEexpress \|<br>ACIEXPRESS \| ACI \|<br>ADCAIR \| ADC항운택배 \|<br>AIRWAY \| AIRWAY익스프레스 \|<br>APEX \| APEX \|<br>ARAMEX \| ARAMEX \|<br>ARGO \| ARGO \|<br>AIRBOY \| AirboyExpress \|<br>KOREXG \| CJ대한통운(국제택배) \|<br>CUPARCEL \| CU편의점택배 \|<br>CWAYEXPRESS \| CwayExpress \|<br>DHL \| DHL \|<br>DHLDE \| DHL(독일) \|<br>DHLGLOBALMAIL \| DHLGlobalMail \|<br>DPD \| DPD \|<br>ECMSEXPRESS \| ECMSExpress \|<br>EFS \| EFS \|<br>EMS \| EMS \|<br>EZUSA \| EZUSA \|<br>EUROPARCEL \| EuroParcel \|<br>FEDEX \| FEDEX \|<br>GOP \| GOP당일택배 \|<br>GOS \| GOS당일택배 \|<br>GPSLOGIX \| GPSLOGIX \|<br>GSFRESH \| GSFresh \|<br>GSIEXPRESS \| GSI익스프레스 \|<br>GSMNTON \| GSMNTON \|<br>GSPOSTBOX \| GSPostbox퀵 \|<br>CVSNET \| GSPostbox택배 \|<br>GS더프레시 \| GSTHEFRESH \|<br>GTSLOGIS \| GTS로지스 \|<br>HYBRID \| HI택배 \|<br>HY \| HY \|<br>IK \| IK물류 \|<br>KGLNET \| KGL네트웍스 \|<br>KT \| KT EXPRESS \|<br>LGE \| LG전자배송센터 \|<br>LTL \| LTL \|<br>NDEXKOREA \| NDEX KOREA \|<br>SBGLS \| SBGLS \|<br>SFEX \| SFexpress \|<br>SLX \| SLX택배 \|<br>SSG \| SSG \|<br>TNT \| TNT \|<br>LOGISPARTNER \| UFO로지스 \|<br>UPS \| UPS \|<br>USPS \| USPS \|<br>WIZWA \| WIZWA \|<br>YJSWORLD \| YJS글로벌 \|<br>YJS \| YJS글로벌(영국) \|<br>YUNDA \| YUNDAEXPRESS \|<br>IPARCEL \| i-parcel \|<br>KY \| 건영복합물류 \|<br>KUNYOUNG \| 건영택배 \|<br>KDEXP \| 경동택배 \|<br>KIN \| 경인택배 \|<br>KORYO \| 고려택배 \|<br>GDSP \| 골드스넵스 \|<br>KOKUSAI \| 국제익스프레스 \|<br>GOODTOLUCK \| 굿투럭 \|<br>NAEUN \| 나은물류 \|<br>NOGOK \| 노곡물류 \|<br>NONGHYUP \| 농협택배 \|<br>HANAROMART \| 농협하나로마트 \|<br>DAELIM \| 대림통운 \|<br>DAESIN \| 대신택배 \|<br>DAEWOON \| 대운글로벌 \|<br>THEBAO \| 더바오 \|<br>DODOFLEX \| 도도플렉스 \|<br>DONGGANG \| 동강물류 \|<br>DONGJIN \| 동진특송 \|<br>CHAINLOGIS \| 두발히어로당일택배 \|<br>DRABBIT \| 딜리래빗 \|<br>JMNP \| 딜리박스 \|<br>ONEDAYLOGIS \| 라스트마일 \|<br>LINEEXP \| 라인익스프레스 \|<br>ROADSUNEXPRESS \| 로드썬익스프레스 \|<br>LOGISVALLEY \| 로지스밸리 \|<br>POOLATHOME \| 로지스올홈케어(풀앳홈) \|<br>LOTOS \| 로토스 \|<br>HLCGLOBAL \| 롯데글로벌로지스(국제택배) \|<br>LOTTECHILSUNG \| 롯데칠성 \|<br>MDLOGIS \| 모든로지스(SLO) \|<br>DASONG \| 물류대장 \|<br>BABABA \| 바바바로지스 \|<br>BANPOOM \| 반품구조대 \|<br>VALEX \| 발렉스 \|<br>SHIPNERGY \| 배송하기좋은날 \|<br>PANTOS \| LX판토스 \|<br>VROONG \| 부릉 \|<br>BRIDGE \| 브릿지로지스 \|<br>EKDP \| 삼다수가정배송 \|<br>SELC \| 삼성전자물류 \|<br>SEORIM\| 서림물류 \|<br>SWGEXP \| 성원글로벌 \|<br>SUNGHUN \| 성훈물류 \|<br>SEBANG \| 세방택배 \|<br>SMARTLOGIS \| 스마트로지스 \|<br>SPARKLE \| 스파클직배송 \|<br>SPASYS1 \| 스페이시스원 \|<br>CRLX \| 시알로지텍 \|<br>ANYTRACK \| 애니트랙 \|<br>ABOUTPET \| 어바웃펫 \|<br>ESTHER \| 에스더쉬핑 \|<br>VENDORPIA \| 벤더피아 \|<br>ACTCORE \| 에이씨티앤코아 \|<br>HKHOLDINGS \| 에이치케이홀딩스 \|<br>NTLPS \| 엔티엘피스 \|<br>TODAYPICKUP \| 카카오T당일배송 \|<br>RUSH \| 오늘회러쉬 \|<br>ALLIN \| 올인닷컴 \|<br>ALLTAKOREA \| 올타코리아 \|<br>WIDETECH \| 와이드테크 \|<br>YONGMA \| 용마로지스 \|<br>DCOMMERCE \| 우리동네커머스 \|<br>WEVILL \| 우리동네택배 \|<br>HONAM \| 우리택배 \|<br>WOORIHB \| 우리한방택배 \|<br>WOOJIN \| 우진인터로지스 \|<br>REGISTPOST \| 우편등기 \|<br>WOONGJI \| 웅지익스프레스 \|<br>WARPEX \| 워펙스 \|<br>WINION \| 위니온로지스 \|<br>WIHTYOU \| 위드유당일택배 \|<br>WEMOVE \| 위무브 \|<br>UFREIGHT \| 유프레이트코리아 \|<br>EUNHA \| 은하쉬핑 \|<br>INNOS \| 이노스(올인닷컴) \|<br>EMARTEVERYDAY \| 이마트에브리데이 \|<br>ESTLA \| 이스트라 \|<br>ETOMARS \| 이투마스 \|<br>GENERALPOST \| 일반우편 \|<br>ILSHIN \| 일신모닝택배 \|<br>ILYANG \| 일양로지스 \|<br>GNETWORK \| 자이언트 \|<br>ZENIEL \| 제니엘시스템 \|<br>JLOGIST \| 제이로지스트 \|<br>GENIEGO \| 지니고당일특급 \|<br>GDAKOREA \| 지디에이코리아 \|<br>GHSPEED \| 지에이치스피드 \|<br>JIKGUMOON \| 직구문 \|<br>CHUNIL \| 천일택배 \|<br>CHOROC \| 초록마을(외부연동) \|<br>CHOROCMAEUL \| 초록마을(네이버직연동) \|<br>COSHIP \| 캐나다쉬핑 \|<br>KJT \| 케이제이티 \|<br>QRUN \| 큐런 \|<br>CUBEFLOW \| 큐브플로우 \|<br>QXPRESS \| 트랙스로지스 \|<br>HEREWEGO \| 탱고앤고 \|<br>TOMATO \| 토마토앱 \|<br>TODAY \| 투데이 \|<br>TSG \| 티에스지로지스 \|<br>TEAMFRESH \| 팀프레시 \|<br>PATEK \| 파테크해운상공 \|<br>XINPATEK \| 파테크해운항공 \|<br>PANASIA \| 판월드로지스틱 \|<br>PANSTAR \| 팬스타국제특송(PIEX) \|<br>FOREVER \| 퍼레버택배 \|<br>PULMUONE \| 풀무원(로지스밸리) \|<br>FREDIT \| 프레딧 \|<br>FRESHMATES \| 프레시메이트 \|<br>KURLY \| 컬리넥스트마일 \|<br>PINGPONG \| 핑퐁 \|<br>HOWSER \| 하우저 \|<br>HIVECITY \| 하이브시티 \|<br>HANDALUM \| 한달음택배 \|<br>HANDEX \| 한덱스 \|<br>HANMI \| 한미포스트 \|<br>HANSSEM \| 한샘 \|<br>HANWOORI \| 한우리물류 \|<br>HPL \| 한의사랑택배 \|<br>HDEXP \| 합동택배 \|<br>HERWUZUG \| 허우적 \|<br>GLOVIS \| 현대글로비스 \|<br>HOMEINNO \| 홈이노베이션로지스 \|<br>HOMEPICKTODAY \| 홈픽오늘도착 \|<br>HOMEPICK \| 홈픽택배 \|<br>HOMEPLUSDELIVERY \| 홈플러스 \|<br>HOMEPLUSEXPRESS \| 홈플러스익스프레스 \|<br>CARGOPLEASE \| 화물을부탁해 \|<br>HWATONG \| 화통 \|<br>CH1 \| 기타택배 \|<br>LETUS \| 바로스 \|<br>LETUS3PL \| 레터스 \|<br>CASA \| 신세계까사 \|<br>GCS \| 지씨에스 \|<br>GKGLOBAL \| 지케이글로벌 \|<br>BRCH \| 비알씨에이치 \|<br>DNDN \| 든든택배 \|<br>GONELO \| 고넬로 \|<br>JCLS \| JCLS \|<br>JWTNL \| JWTNL \|<br>GS25 \| GS편의점(퀵배달용) \|<br>CU \| CU편의점(퀵배달용) \| |
| reDeliveryTrackingNumber | body | string |  | 재배송 송장 번호 |

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
curl -X POST 'https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders/{productOrderId}/claim/exchange/dispatch' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```