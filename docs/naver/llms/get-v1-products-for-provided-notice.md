---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/get-all-product-info-provided-notice-type-vo-product
---
# GET /v1/products-for-provided-notice - 상품정보제공고시 상품군 목록 조회

상품정보제공고시 상품군 목록 조회 API는 전자상거래법에 따라 의무 고지가 필요한 상품정보제공고시 상품군 유형(WEAR·SHOES·FOOD·COSMETIC 등)과 각 상품군이 요구하는 항목(필드명·필드 타입·설명·최대 길이) 의 마스터 목록을 받아오기 위한 메타 정보 조회 엔드포인트입니다. categoryId 를 함께 보내면 해당 카테고리에 매칭되는 상품군이 우선적으로 반환되므로, 상품 등록 시 카테고리를 먼저 확정한 뒤 본 API 를 호출해 입력 폼을 구성하는 흐름이 일반적입니다. 상품정보제공고시 마스터는 변경 주기가 길기 때문에 일 단위 정도의 캐싱으로 충분하며, 동일 카테고리에 대한 결과를 클라이언트 측에서 메모이즈해 두면 호출량을 줄일 수 있습니다. categoryId 형식이 잘못되면 400 BAD_REQUEST 가 반환되며, 매칭되는 상품군이 없으면 빈 결과가 응답될 수 있어 후처리에서 결과 길이를 점검합니다. 401·403 응답은 토큰 재발급과 권한 확인으로 대응하고, 500 응답은 일시 장애로 간주해 지수 백오프 기반 재시도를 적용합니다. 특정 상품군의 상세 필드 구조만 필요할 때는 상품정보제공고시 단건 조회 API를 호출하는 편이 효율적입니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| categoryId | query | string |  | 카테고리 ID |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| productInfoProvidedNoticeType | - | string |  | 허용값: `WEAR`, `SHOES`, `BAG`, `FASHION_ITEMS`, `SLEEPING_GEAR`, `FURNITURE`, `IMAGE_APPLIANCES`, `HOME_APPLIANCES`, `SEASON_APPLIANCES`, `OFFICE_APPLIANCES`, `OPTICS_APPLIANCES`, `MICROELECTRONICS`, `CELLPHONE`, `NAVIGATION`, `CAR_ARTICLES`, `MEDICAL_APPLIANCES`, `KITCHEN_UTENSILS`, `COSMETIC`, `JEWELLERY`, `FOOD`, `GENERAL_FOOD`, `DIET_FOOD`, `KIDS`, `MUSICAL_INSTRUMENT`, `SPORTS_EQUIPMENT`, `BOOKS`, `LODGMENT_RESERVATION`, `TRAVEL_PACKAGE`, `AIRLINE_TICKET`, `RENT_CAR`, `RENTAL_HA`, `RENTAL_ETC`, `DIGITAL_CONTENTS`, `GIFT_CARD`, `MOBILE_COUPON`, `MOVIE_SHOW`, `ETC_SERVICE`, `BIOCHEMISTRY`, `BIOCIDAL`, `ETC` |
| productInfoProvidedNoticeTypeName | - | string |  |  |
| productInfoProvidedNoticeContents | - | array |  |  |
| productInfoProvidedNoticeContents.fieldType | - | string |  |  |
| productInfoProvidedNoticeContents.fieldName | - | string |  |  |
| productInfoProvidedNoticeContents.fieldDescription | - | string |  |  |
| productInfoProvidedNoticeContents.fieldAddDescription | - | string |  |  |
| productInfoProvidedNoticeContents.fieldMaxLength | - | integer(int32) |  |  |

### 에러 코드

| 상태 코드 | 설명 |
|-----------|------|
| 400 | 잘못된 요청<br/>- code : BAD_REQUEST |
| 401 | 인가되지 않은 요청<br/>- code : UNAUTHORIZED |
| 403 | 권한 없음<br/>- code : FORBIDDEN |
| 404 | 데이터 없음<br/>- code : NOT_FOUND |
| 500 | 내부 서버 오류<br/>- code : INTERNAL_SERVER_ERROR |

### 사용 enum 카탈로그

- 응답 `[].productInfoProvidedNoticeType`: `WEAR`, `SHOES`, `BAG`, `FASHION_ITEMS`, `SLEEPING_GEAR`, `FURNITURE`, `IMAGE_APPLIANCES`, `HOME_APPLIANCES`, `SEASON_APPLIANCES`, `OFFICE_APPLIANCES`, `OPTICS_APPLIANCES`, `MICROELECTRONICS`, `CELLPHONE`, `NAVIGATION`, `CAR_ARTICLES`, `MEDICAL_APPLIANCES`, `KITCHEN_UTENSILS`, `COSMETIC`, `JEWELLERY`, `FOOD`, `GENERAL_FOOD`, `DIET_FOOD`, `KIDS`, `MUSICAL_INSTRUMENT`, `SPORTS_EQUIPMENT`, `BOOKS`, `LODGMENT_RESERVATION`, `TRAVEL_PACKAGE`, `AIRLINE_TICKET`, `RENT_CAR`, `RENTAL_HA`, `RENTAL_ETC`, `DIGITAL_CONTENTS`, `GIFT_CARD`, `MOBILE_COUPON`, `MOVIE_SHOW`, `ETC_SERVICE`, `BIOCHEMISTRY`, `BIOCIDAL`, `ETC`

### 호출 예시

```bash
curl -X GET 'https://api.commerce.naver.com/external/v1/products-for-provided-notice' \
  -H 'Authorization: Bearer {access_token}'
```