---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/update-fashion-model-product
---
# PUT /v1/product-fashion-models/{fashionModelId} - 패션모델 수정

이 API는 이미 등록된 패션모델 정보를 fashionModelId 기준으로 수정할 때 사용하는 v1 엔드포인트입니다. 수정 가능한 항목은 모델명·키·몸무게·상의/하의/신발 사이즈·모델 이미지 URL 이며, modelImage.url 은 반드시 상품 이미지 다건 등록 API 로 업로드해 반환받은 URL 만 입력해야 합니다. 외부 호스트의 직접 링크는 거부되어 400 BAD_REQUEST 가 발생할 수 있으므로 모델 이미지 교체 시에도 업로드 단계를 거쳐 정식 URL 을 받아 적용합니다. 일반적인 사용 사례는 의류·잡화 판매자가 시즌 모델 교체나 사이즈 정보 정정 시 기존 모델 메타데이터를 갱신해 연결된 상품의 사이즈 가이드 노출을 일관되게 유지하는 것입니다. 호출 시 변경된 모델 정보는 이 모델을 참조 중인 모든 패션 상품의 노출 데이터에 반영되므로, 다수 상품에 미치는 영향도를 사전 확인한 뒤 일과 시간이나 운영 점검 시간대에 수정하는 것이 안전합니다. 응답으로는 수정된 모델의 전체 필드가 반환되어 클라이언트 측 캐시 갱신에 그대로 사용할 수 있습니다. 400 은 본문 누락·잘못된 이미지 URL, 401/403 은 토큰·권한, 404 는 존재하지 않는 fashionModelId, 500 은 일시 장애로 보고 입력 재검증 또는 백오프 재시도를 적용합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| fashionModelId | path | integer(int64) | 필수 | 패션모델 ID |

### 요청 본문

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| id | body | integer(int64) |  |  |
| name | body | string | 필수 |  |
| height | body | integer(int32) |  |  |
| weight | body | integer(int32) |  |  |
| top | body | string |  |  |
| bottom | body | string |  |  |
| shoe | body | string |  |  |
| modelImage | body | object |  |  |
| modelImage.url | body | string | 필수 |  |

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
curl -X PUT 'https://api.commerce.naver.com/external/v1/product-fashion-models/{fashionModelId}' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```