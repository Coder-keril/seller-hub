---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/get-option-guides-by-category-id-product
---
# GET /v2/standard-purchase-option-guides - (v2) 판매 옵션 정보 조회

(v2) 판매 옵션 정보 조회 API는 리프 카테고리 ID 를 입력해 해당 카테고리에서 사용할 수 있는 표준 판매 옵션 가이드와 단위가격 설정 가능 여부를 받아오기 위한 메타 정보 조회 엔드포인트로, 응답의 useOptionYn 이 true 인 카테고리에 대해서만 그룹상품 설정이 가능합니다. 가이드에는 guideId 와 함께 옵션 목록(NUMBER·TEXT 타입의 옵션 항목)·단위가격 사용 여부·단위가격 값·단위 텍스트가 포함되므로, 상품 등록 전 옵션 유효성 검증과 단위가격 입력 폼 구성에 사용합니다. 일반적으로 카테고리를 먼저 확정한 뒤 본 API 로 표준 옵션 가이드를 조회하고, 그 결과를 바탕으로 그룹상품 등록·전환 페이로드의 standardPurchaseOptions 를 구성하는 흐름이 권장됩니다. 카테고리별 옵션 가이드는 변경 주기가 길기 때문에 동일 카테고리에 대한 결과를 클라이언트 측에서 캐싱해 두면 호출량과 응답 지연을 모두 줄일 수 있습니다. categoryId 는 필수이므로 누락 시 400 BAD_REQUEST, 존재하지 않는 카테고리 지정 시 404 NOT_FOUND 가 반환되며, 401·403 응답은 토큰 재발급·권한 확인으로 대응하고, 500 응답은 일시 장애로 간주해 지수 백오프 재시도를 적용합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| categoryId | query | string | 필수 | 리프 카테고리 ID |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| useOptionYn | - | boolean |  | true인 카테고리에 대해서만 그룹상품 설정이 가능합니다. |
| optionGuides | - | array |  | 판매 옵션 사용 가능 카테고리의 경우, 판매 옵션 가이드를 설정해야 합니다. |
| optionGuides.guideId | - | integer(int64) | 필수 |  |
| optionGuides.standardPurchaseOptions | - | array | 필수 | 가이드에 포함되는 옵션 목록입니다. |
| optionGuides.standardPurchaseOptions.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| optionGuides.useUnitPrice | - | boolean |  |  |
| optionGuides.unitPriceValue | - | integer(int32) |  |  |
| optionGuides.unitPriceText | - | string |  |  |

### 에러 코드

| 상태 코드 | 설명 |
|-----------|------|
| 400 | 잘못된 요청<br/>- code : BAD_REQUEST |
| 401 | 인가되지 않은 요청<br/>- code : UNAUTHORIZED |
| 403 | 권한 없음<br/>- code : FORBIDDEN |
| 404 | 데이터 없음<br/>- code : NOT_FOUND |
| 500 | 내부 서버 오류<br/>- code : INTERNAL_SERVER_ERROR |

### 사용 enum 카탈로그

- 응답 `optionGuides[].standardPurchaseOptions[].optionType`: `NUMBER`, `TEXT`

### 호출 예시

```bash
curl -X GET 'https://api.commerce.naver.com/external/v2/standard-purchase-option-guides?categoryId={categoryId}' \
  -H 'Authorization: Bearer {access_token}'
```