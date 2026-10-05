---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/get-fashion-models-product
---
# GET /v1/product-fashion-models - 전체 패션모델 조회

패션모델 도메인에서 사전에 등록된 전체 패션모델 목록을 조회하는 메타정보 API 로, 패션·의류 상품 등록 시 코디네이션 이미지에 함께 노출할 모델 후보를 셀렉터로 노출하는 데 사용한다. 응답은 id, name, height, weight, top, bottom, shoe 와 modelImage.url 까지 포함되어 사용자에게 모델의 신체 정보와 표준 사이즈, 대표 이미지를 함께 보여줄 수 있어 상품 매핑 의사 결정에 그대로 활용된다. 일반적인 사용 흐름은 본 API 로 후보를 받아 사용자가 모델을 선택하면 fashionModelId 를 상품 등록 페이로드에 매핑하고, 더 이상 사용하지 않는 모델은 패션모델 삭제 API 로 정리해 후보 목록을 깔끔하게 유지하는 형태이다. 모델 데이터는 변경 빈도가 낮으므로 클라이언트에서 적절한 TTL 로 캐시해 두는 운영이 권장된다. 권한 부족은 403 FORBIDDEN, 인증 오류는 401 UNAUTHORIZED, 형식 오류는 400 BAD_REQUEST, 데이터 부재는 404 NOT_FOUND 로 응답된다. 500 INTERNAL_SERVER_ERROR 는 일시 장애로 보아 지수 백오프 기반의 제한된 재시도와 캐시 폴백을 함께 적용하는 것이 안정적이다.

> Base URL: https://api.commerce.naver.com/external

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| id | - | integer(int64) |  |  |
| name | - | string | 필수 |  |
| height | - | integer(int32) |  |  |
| weight | - | integer(int32) |  |  |
| top | - | string |  |  |
| bottom | - | string |  |  |
| shoe | - | string |  |  |
| modelImage | - | object |  |  |
| modelImage.url | - | string | 필수 |  |

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
curl -X GET 'https://api.commerce.naver.com/external/v1/product-fashion-models' \
  -H 'Authorization: Bearer {access_token}'
```