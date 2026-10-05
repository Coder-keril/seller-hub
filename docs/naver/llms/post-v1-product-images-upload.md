---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/upload-product
---
# POST /v1/product-images/upload - 상품 이미지 다건 등록

이 API는 상품 등록·수정에 사용할 이미지를 한 번의 호출로 다건 업로드하고 네이버 커머스 측 호스팅 URL 을 반환받는 엔트리 포인트입니다. multipart/form-data 형식의 imageFiles 필드로 한 번에 최대 10개까지 업로드할 수 있으며 지원 형식은 JPG, GIF, PNG, BMP 입니다. 반환된 images[].url 값은 v2 상품 등록·수정 API 의 originProduct.images, 채널 상품 수정, 그룹상품 등록 API 등에서 이미지 URL 입력란에 그대로 사용해야 하며, 외부 호스트의 직접 링크 입력은 거부되므로 반드시 이 API 의 응답 URL 만 사용해야 합니다. 일반적인 사용 사례는 신상품 등록 자동화 스크립트가 로컬 디렉터리의 대표·추가 이미지를 일괄 업로드한 뒤 반환 URL 을 그대로 상품 등록 본문에 전달하는 흐름입니다. 호출 시 파일 크기·형식 제한과 권장 픽셀(대표 이미지 1000x1000) 을 사전 확인해야 하며, 한 번에 너무 큰 파일을 묶으면 네트워크 타임아웃이나 400 BAD_REQUEST 가 발생할 수 있으므로 분할 업로드를 권장합니다. 400 은 파일 형식·개수 위반, 401/403 은 인증·권한 문제, 404 는 자원 부재, 500 은 일시 장애를 의미하므로 각 케이스별로 입력 재검증·토큰 재발급·재시도 전략을 적용합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 본문

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| imageFiles | body | array | 필수 | 최대 10개까지 등록 가능. 업로드할 수 있는 이미지의 형식은 JPG, GIF, PNG, BMP입니다. |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| images | - | array |  |  |
| images.url | - | string | 필수 |  |

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
curl -X POST 'https://api.commerce.naver.com/external/v1/product-images/upload' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```