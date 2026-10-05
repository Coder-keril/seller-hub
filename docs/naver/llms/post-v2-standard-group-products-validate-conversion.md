---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/validate-product-can-be-grouped-product
---
# POST /v2/standard-group-products/validate-conversion - (v2) 그룹상품 전환 유효성 검사

이 API는 개별 원상품들을 v2 표준형 그룹상품으로 전환하기 전에 전환 가능 여부를 사전 검증하는 엔드포인트로, 그룹상품 라이프사이클에서 실제 전환(convert-products) 호출 전에 호출하는 것이 권장됩니다. 요청 본문의 originProductNos 에 검증할 원상품번호를 최소 1 개 이상 입력하면 응답으로 canBeGrouped(true/false)와 위반 항목 상세(validations) 가 반환됩니다. validations 의 scope 가 STANDARD_GROUP 이면 카테고리 일치·출고지 구분·노출 윈도 채널·최대 상품 수 같은 그룹 단위 조건 위반을, PRODUCT 이면 originProductNo 와 함께 카테고리 허용 여부·결제 여부·판매 상태·옵션 제한 같은 상품 단위 조건 위반을 의미합니다. 일반적인 사용 사례는 운영자가 그룹 전환 후보 상품 묶음을 선정한 뒤 이 API 로 사전 검증해 위반 상품을 분리·수정한 다음 실제 convert-products 호출에서 일괄 실패를 예방하는 것입니다. 호출 시 violations 에 다수 항목이 반환될 수 있으므로 scope 별로 묶어 처리하고, STANDARD_GROUP 위반은 묶음 자체를 재구성, PRODUCT 위반은 해당 originProductNo 의 카테고리·옵션·상태를 먼저 수정한 뒤 다시 검증해야 합니다. 이 API 는 검증만 수행하므로 호출에 따른 데이터 변경은 발생하지 않아 반복 호출이 안전합니다. 400 은 입력 형식 오류, 401/403 은 토큰·권한, 404 는 참조 원상품 부재, 500 은 일시 장애로 보고 입력 재검증 또는 백오프 재시도를 적용합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 본문

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| originProductNos | body | array | 필수 | 그룹 전환 가능 여부를 검사할 원상품번호 목록입니다. 최소 1개 이상의 원상품번호를 입력해야 합니다. |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| canBeGrouped | - | boolean |  | - true: 그룹 전환 가능<br>- false: 그룹 전환 불가능. 이 경우 그룹 전환 유효성 결과 상세에 유효성 위반 상세가 함께 전달됩니다. |
| validations | - | array |  | canBeGrouped가 false인 경우, 그룹 단위(STANDARD_GROUP) 또는 상품 단위(PRODUCT)로 구분된 유효성 위반 상세가 전달됩니다. |
| validations.scope | - | string |  | 유효성 검사 범위를 나타냅니다.<br>- STANDARD_GROUP: 그룹 단위 조건(카테고리 일치, 출고지 구분, 노출윈도 채널, 최대 상품 수 등)<br>- PRODUCT: 상품 단위 조건(카테고리 허용 여부, 결제 여부, 판매 상태, 옵션 제한 등) |
| validations.originProductNo | - | integer(int64) |  | scope가 PRODUCT인 경우 해당 원상품번호가 전달되며, STANDARD_GROUP인 경우 null입니다. |
| validations.violations | - | array |  | 해당 범위에서 위반된 항목의 목록입니다. |
| validations.violations.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |

### 에러 코드

| 상태 코드 | 설명 |
|-----------|------|
| 400 | 잘못된 요청<br/>- code : BAD_REQUEST |
| 401 | 인가되지 않은 요청<br/>- code : UNAUTHORIZED |
| 403 | 권한 없음<br/>- code : FORBIDDEN |
| 404 | 데이터 없음<br/>- code : NOT_FOUND |
| 500 | 내부 서버 오류<br/>- code : INTERNAL_SERVER_ERROR |

### 호출 예시

```bash
curl -X POST 'https://api.commerce.naver.com/external/v2/standard-group-products/validate-conversion' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```