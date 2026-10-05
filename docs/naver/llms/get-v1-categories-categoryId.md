---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/get-category-product
---
# GET /v1/categories/{categoryId} - 카테고리 조회

카테고리 도메인에서 카테고리 ID 한 건의 상세 메타정보를 조회하는 API 로, 단순한 이름·경로 정보를 넘어서 해당 카테고리에 적용되는 예외 속성과 인증 요구사항을 함께 제공한다. exceptionalCategories 는 E쿠폰, 성인, 수산물, 도서, 어필리에이트, 정기구독·렌탈 등 카테고리 특수 규정을, certificationInfos 는 KC·친환경·어린이제품 등 인증 요건과 인증 마크 유형을 포함하므로 상품 등록 폼에서 카테고리 의존 필드를 동적으로 구성할 때 핵심 입력으로 사용된다. 일반적인 활용 흐름은 카테고리 선택 시 본 API 를 호출해 인증 항목 표시 여부와 필수 입력 항목을 결정하고, 카테고리별 속성·표준형 옵션 API 와 함께 페이지를 구성하는 형태이다. 카테고리 메타 데이터는 변경 빈도가 낮아 클라이언트 캐시 적용에 적합하며, 서버 배포 주기 또는 일 단위로 갱신하는 정책이 권장된다. categoryId 경로 파라미터에는 정확한 카테고리 식별자를 지정해야 하고, 형식 오류는 400 BAD_REQUEST, 존재하지 않는 카테고리는 404 NOT_FOUND 로 응답된다. 토큰 오류는 401 UNAUTHORIZED, 권한 부족은 403 FORBIDDEN 으로 구분되며, 308 리다이렉트가 반환될 수 있으므로 클라이언트는 Location 을 따라 재요청할 수 있도록 처리해야 한다. 500 INTERNAL_SERVER_ERROR 는 일시 장애로 간주해 지수 백오프 기반의 제한된 재시도와 캐시 폴백을 함께 적용하는 것이 안정적이다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| categoryId | path | string | 필수 | 카테고리 ID |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| wholeCategoryName | - | string | 필수 |  |
| id | - | string | 필수 |  |
| name | - | string | 필수 |  |
| last | - | boolean | 필수 |  |
| exceptionalCategories | - | array |  | - E_COUPON(E쿠폰), ADULT(성인), MARINE_PRODUCTS(수산물), REVIEW_UNEXPOSE(구매평 미노출), CHILD_CERTIFICATION(어린이제품 인증 대상), ORIGINAREA_PRODUCTS(원산지 입력 대상), GREEN_PRODUCTS(친환경 인증 대상), KC_CERTIFICATION(KC 인증 대상), CHEMICAL_CERTIFICATION(생활화학/살생물제 인증 대상), SAFE_CRITERION(안전기준준수대상), AFFILIATE(어필리에이트), TRADITIONAL_ALCOHOL(전통주), OPTION_PRICE(옵션가 제한 예외 카테고리), BOOK(도서_일반), BOOK_EBOOK(도서_E북), BOOK_AUDIO(도서_오디오북), BOOK_MAGAZINE(도서_잡지), BOOK_USED(도서_중고), BOOK_OVERSEAS(도서_해외), BOOK_FREE(도서_정가제free), PERFORMANCE(문화비_소득공제), FREE_RETURN_INSURANCE(반품안심케어), REGULAR_SUBSCRIPTION(정기구독), RENTAL_SUBSCRIPTION(렌탈), MANUFACTURE_DEFINE_NO(품번) |
| certificationInfos | - | array |  |  |
| certificationInfos.id | - | integer(int64) | 필수 |  |
| certificationInfos.name | - | string | 필수 |  |
| certificationInfos.kindTypes | - | array | 필수 | - KC_CERTIFICATION(KC 인증 대상), CHILD_CERTIFICATION(어린이제품 인증 대상), GREEN_PRODUCTS(친환경 인증 대상), CHEMICAL_CERTIFICATION(생활화학/살생물제 인증 대상), PARALLEL_IMPORT(병행수입), OVERSEAS(구매대행), ETC(기타 인증 유형) |
| certificationInfos.kindTypes.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| certificationInfos.green | - | boolean | 필수 |  |
| certificationInfos.certificationMarkType | - | string |  | 허용값: `KC`, `ORGANIC_AGRICULTURAL_PROD`, `ORGANIC_ANIMAL_PROD`, `NON_PESTICIDE`, `NON_ANTIBIOTIC`, `LOW_PESTICIDE`, `GAP`, `AGRICULTURAL_TRACEABILITY`, `PROCESSED_FOOD_KS`, `TRADITIONAL_FOOD`, `ORGANIC_PROCESSED_FOOD`, `QUALITY_SEAFOOD`, `ECO_SEAFOOD`, `HACCP`, `GMP`, `SAFETY`, `SIX_INDUSTRY`, `ANIMAL_WELFARE`, `FOOD_MASTER`, `ECO_PROCESSED_FOOD`, `ECO_ORGANIC_ANIMAL_PROD`, `TRADITIONAL_SEAFOOD`, `SOCIAL_ENTERPRISE`, `VILLAGE_ENTERPRISE`, `SPECIAL_SEAFOOD`, `SEA_ORGANIC_PROCESSED_FOOD`, `SEA_ORGANIC_PROD`, `SEA_NON_ANTIBIOTIC`, `SEA_NON_ACTIVE_TREATMENT`, `ALCOHOL`, `LIVING_CHEMISTRY_SAFETY`, `ECO_FRIENDLY`, `VEGAN`, `VEGAN_STANDARD_CERT`, `LOW_CARBON`, `OVERSEAS_PETA`, `OVERSEAS_V_LABEL`, `OVERSEAS_VEGAN_SOCIETY`, `OVERSEAS_EVE_VEGAN`, `ECO_OVERSEAS_MSC`, `ECO_OVERSEAS_USDA`, `ECO_OVERSEAS_ECOCERT`, `ECO_OVERSEAS_FSC`, `ECO_OVERSEAS_FAIR_TRADE`, `ECO_OVERSEAS_CARBON_TRUST` |
| certificationInfos.companyName | - | boolean |  |  |
| certificationInfos.certificationDate | - | boolean |  |  |
| certificationInfos.kcParallelImportExemptionObject | - | boolean |  |  |
| certificationInfos.nonEssential | - | boolean |  |  |

### 에러 코드

| 상태 코드 | 설명 |
|-----------|------|
| 400 | 잘못된 요청<br/>- code : BAD_REQUEST |
| 401 | 인가되지 않은 요청<br/>- code : UNAUTHORIZED |
| 403 | 권한 없음<br/>- code : FORBIDDEN |
| 404 | 데이터 없음<br/>- code : NOT_FOUND |
| 500 | 내부 서버 오류<br/>- code : INTERNAL_SERVER_ERROR |

### 사용 enum 카탈로그

- 응답 `exceptionalCategories[]`: `E_COUPON`, `ADULT`, `MARINE_PRODUCTS`, `REVIEW_UNEXPOSE`, `CHILD_CERTIFICATION`, `ORIGINAREA_PRODUCTS`, `GREEN_PRODUCTS`, `KC_CERTIFICATION`, `SAFE_CRITERION`, `AFFILIATE`, `TRADITIONAL_ALCOHOL`, `ALCOHOL`, `OPTION_PRICE`, `BOOK_CHILD`, `BOOK`, `BOOK_EBOOK`, `BOOK_AUDIO`, `BOOK_MAGAZINE`, `BOOK_USED`, `BOOK_OVERSEAS`, `BOOK_FREE`, `PERFORMANCE`, `FREE_RETURN_INSURANCE`, `REGULAR_SUBSCRIPTION`, `RENTAL_SUBSCRIPTION`, `VINTAGE_CITY`, `SEONE_AI_ASSISTANT_UNEXPOSE`, `GROUP_PRODUCT_MAX`, `DYNAMIC_PRICING_CONFIG`, `MANUFACTURE_DEFINE_NO`, `PREORDER_VALID_DATE`, `UNIT_PRICE`, `BUSINESSMALL_UNAVAILABLE`, `CHEMICAL_CERTIFICATION`
- 응답 `certificationInfos[].kindTypes[]`: `KC_CERTIFICATION`, `CHILD_CERTIFICATION`, `GREEN_PRODUCTS`, `CHEMICAL_CERTIFICATION`, `PARALLEL_IMPORT`, `OVERSEAS`, `ETC`
- 응답 `certificationInfos[].certificationMarkType`: `KC`, `ORGANIC_AGRICULTURAL_PROD`, `ORGANIC_ANIMAL_PROD`, `NON_PESTICIDE`, `NON_ANTIBIOTIC`, `LOW_PESTICIDE`, `GAP`, `AGRICULTURAL_TRACEABILITY`, `PROCESSED_FOOD_KS`, `TRADITIONAL_FOOD`, `ORGANIC_PROCESSED_FOOD`, `QUALITY_SEAFOOD`, `ECO_SEAFOOD`, `HACCP`, `GMP`, `SAFETY`, `SIX_INDUSTRY`, `ANIMAL_WELFARE`, `FOOD_MASTER`, `ECO_PROCESSED_FOOD`, `ECO_ORGANIC_ANIMAL_PROD`, `TRADITIONAL_SEAFOOD`, `SOCIAL_ENTERPRISE`, `VILLAGE_ENTERPRISE`, `SPECIAL_SEAFOOD`, `SEA_ORGANIC_PROCESSED_FOOD`, `SEA_ORGANIC_PROD`, `SEA_NON_ANTIBIOTIC`, `SEA_NON_ACTIVE_TREATMENT`, `ALCOHOL`, `LIVING_CHEMISTRY_SAFETY`, `ECO_FRIENDLY`, `VEGAN`, `VEGAN_STANDARD_CERT`, `LOW_CARBON`, `OVERSEAS_PETA`, `OVERSEAS_V_LABEL`, `OVERSEAS_VEGAN_SOCIETY`, `OVERSEAS_EVE_VEGAN`, `ECO_OVERSEAS_MSC`, `ECO_OVERSEAS_USDA`, `ECO_OVERSEAS_ECOCERT`, `ECO_OVERSEAS_FSC`, `ECO_OVERSEAS_FAIR_TRADE`, `ECO_OVERSEAS_CARBON_TRUST`

### 호출 예시

```bash
curl -X GET 'https://api.commerce.naver.com/external/v1/categories/{categoryId}' \
  -H 'Authorization: Bearer {access_token}'
```
