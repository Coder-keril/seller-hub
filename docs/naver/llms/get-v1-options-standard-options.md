---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/get-standard-option-by-category-product
---
# GET /v1/options/standard-options - 카테고리별 표준형 옵션 조회

옵션 도메인에서 특정 카테고리에 적용 가능한 표준형 옵션 정의를 조회하는 메타정보 API 로, 카테고리별로 사용 가능한 옵션 속성(예: 색상, 사이즈(공통), 사이즈(미국))과 그 속성에 대한 이미지 등록 가능 여부, 실값 사용 여부, 옵션 세트 필수 여부를 함께 제공한다. 상품 등록·수정 흐름에서 카테고리를 선택한 직후 본 API 를 호출해 옵션 입력 폼을 동적으로 구성하는 데 적합하며, useStandardOption 응답을 기준으로 표준형 옵션 사용 가능 여부를 우선 판단한 뒤 standardOptionCategoryGroups 로 세부 속성을 채운다. 카테고리별 옵션 정의는 변경 빈도가 낮으므로 클라이언트에서 적절한 TTL 로 캐시해 두고 일 단위·배포 주기로 갱신하는 운영이 권장된다. categoryId 쿼리 파라미터는 필수이며, 누락이나 형식 오류는 400 BAD_REQUEST, 존재하지 않는 카테고리는 404 NOT_FOUND 로 반환된다. 권한 부족은 403 FORBIDDEN, 인증 오류는 401 UNAUTHORIZED 로 구분되고, 500 INTERNAL_SERVER_ERROR 는 일시 장애로 간주해 지수 백오프 기반의 제한된 재시도와 캐시된 이전 응답으로의 폴백을 함께 적용하는 것이 안전하다. 308 응답이 반환될 수 있으므로 클라이언트는 리다이렉트 처리 정책을 확인하고, 자동 추적이 불가한 환경에서는 Location 헤더를 따라 재요청하도록 구현한다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| categoryId | query | string | 필수 | 카테고리 ID |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| useStandardOption | - | boolean |  |  |
| standardOptionCategoryGroups | - | array |  |  |
| standardOptionCategoryGroups.attributeId | - | integer(int64) |  |  |
| standardOptionCategoryGroups.attributeName | - | string | 필수 | 옵션 속성명(예: 색상, 사이즈(공통), 사이즈(미국)) |
| standardOptionCategoryGroups.groupName | - | string |  | (예: 사이즈, 색상) |
| standardOptionCategoryGroups.imageRegistrationUsable | - | boolean | 필수 |  |
| standardOptionCategoryGroups.realValueUsable | - | boolean | 필수 |  |
| standardOptionCategoryGroups.optionSetRequired | - | boolean | 필수 |  |
| standardOptionCategoryGroups.standardOptionAttributes | - | array |  |  |
| standardOptionCategoryGroups.standardOptionAttributes.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |

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
curl -X GET 'https://api.commerce.naver.com/external/v1/options/standard-options?categoryId={categoryId}' \
  -H 'Authorization: Bearer {access_token}'
```
