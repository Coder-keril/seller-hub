---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/get-brand-list-product
---
# GET /v1/product-brands - 브랜드 조회

브랜드 도메인에서 검색 키워드로 브랜드·제조사 후보를 조회하는 메타정보 API 로, 상품 등록·수정 화면의 브랜드 자동완성 필드에 후보를 채우는 데 사용한다. 응답은 id 와 name 으로 구성되어 자동완성 UI 에서 사용자에게는 name 을 노출하고 서버에는 id 를 함께 저장하는 일반적인 매핑 흐름에 적합하다. name 쿼리 파라미터는 필수이며 사용자가 입력한 문자열을 그대로 전달해 후보를 조회하는 형태이므로, 입력 디바운싱과 최소 글자수 정책을 클라이언트에서 함께 적용하면 호출 비용을 줄일 수 있다. 브랜드 데이터는 신규 등록이 점진적으로 누적되지만 변경 빈도가 낮으므로 동일 검색어에 대해 짧은 시간 동안 결과를 캐시해 두면 호출량을 효과적으로 절감할 수 있다. 누락·형식 오류는 400 BAD_REQUEST, 매칭 결과 부재 또는 자원 미존재는 404 NOT_FOUND 로 응답되고, 권한 부족은 403 FORBIDDEN, 인증 오류는 401 UNAUTHORIZED 로 분리된다. 500 INTERNAL_SERVER_ERROR 는 일시 장애로 간주해 지수 백오프 기반의 제한된 재시도만 적용한다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| name | query | string | 필수 | 검색할 브랜드 이름 |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| id | - | integer(int64) |  | 브랜드나 제조사 등의 ID 값 |
| name | - | string |  | 브랜드나 제조사 등의 이름 |

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
curl -X GET 'https://api.commerce.naver.com/external/v1/product-brands?name={name}' \
  -H 'Authorization: Bearer {access_token}'
```