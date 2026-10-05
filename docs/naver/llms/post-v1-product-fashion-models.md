---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/save-fashion-model-product
---
# POST /v1/product-fashion-models - 패션모델 저장

이 API는 패션 카테고리 상품에 활용할 패션모델 정보를 새로 저장할 때 사용합니다. 패션모델은 모델명·키·몸무게·상의/하의/신발 사이즈·모델 이미지 URL 로 구성되며, 등록된 모델은 패션 카테고리 상품 등록·수정 시 착용 사이즈 안내와 함께 노출 데이터로 활용됩니다. 일반적인 사용 사례는 의류·잡화 판매자가 자체 촬영 모델 정보를 카탈로그처럼 관리해 두고 신상품 등록 시마다 동일 모델을 재사용하여 사이즈 가이드 일관성을 유지하는 것입니다. 호출 시 modelImage.url 은 반드시 상품 이미지 다건 등록 API 로 업로드해 받은 URL 만 입력해야 하며, 외부 호스트의 직접 링크는 거부되어 400 BAD_REQUEST 가 반환될 수 있습니다. 응답으로 생성된 id 와 저장된 전체 필드가 반환되므로 이를 별도 저장해 두면 이후 수정·삭제·상품 등록 시점에서 참조할 수 있습니다. 401 UNAUTHORIZED 와 403 FORBIDDEN 은 토큰 만료나 권한 미부여 상황이므로 인증 토큰 재발급 또는 권한 확인 절차를 거치고, 404 는 참조 자원 부재, 500 은 일시 장애로 보고 백오프 후 재시도합니다.

> Base URL: https://api.commerce.naver.com/external

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
curl -X POST 'https://api.commerce.naver.com/external/v1/product-fashion-models' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```