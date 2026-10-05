---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/save-detail-info-product
---
# POST /v2/standard-group-products/temp-detail-content - (v2) 상품 상세 정보 임시 저장

이 API는 v2 그룹상품에서 원상품별로 서로 다른 상품 상세 정보를 입력해야 할 때 본문 콘텐츠를 사전에 임시 저장하고 임시 ID 를 발급받는 보조 엔드포인트입니다. 그룹상품 등록·수정·전환 API 는 commonDetailContent 로 그룹 공통 상세 정보를 받는 것을 기본으로 하지만, 원상품마다 다른 상세 정보를 사용하려면 이 API 로 콘텐츠를 미리 임시 저장하고 반환된 detailContentTempId 를 specificProducts 하위의 detailContentTempId 로 매핑해야 합니다. 반환된 detailContentTempId 는 발급 시점으로부터 1 시간 동안만 유효하므로, 임시 저장 직후 그룹상품 등록·수정 API 호출까지 연속적으로 처리하거나 만료 직전 갱신 전략을 고려해야 합니다. 호출 시 content 본문은 필수이며, 기존 detailContentTempId 를 함께 전달해 같은 임시 슬롯에 갱신하는 사용도 가능합니다. 일반적인 사용 사례는 동일 그룹에 속한 색상·사이즈별 SKU 가 자체 상세 페이지(설명·인증·사이즈표 등) 를 가질 때 원상품별로 임시 저장을 반복 호출한 뒤 그룹상품 등록 본문에 다수의 detailContentTempId 를 매핑해 일괄 전송하는 것입니다. 호출 후 그룹 등록·수정 API 호출이 실패하면 임시 ID 는 만료되거나 재사용되지 않을 수 있으므로, 재시도 시에는 임시 저장부터 다시 수행하는 것이 안전합니다. 400 은 본문 누락·형식 오류, 401/403 은 토큰·권한, 404 는 참조 임시 ID 부재(만료 가능성), 500 은 일시 장애로 보고 본문 재검증 또는 백오프 재시도를 적용합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 본문

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| detailContentTempId | body | integer(int64) |  | 임시 ID는 1시간 동안 유효합니다.<br>반환받은 임시 ID는 그룹상품 등록/수정 API에서 상품별로 상품 상세 정보를 다르게 입력하는 경우에 사용합니다. |
| content | body | string | 필수 |  |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| detailContentTempId | - | integer(int64) |  | 임시 ID는 1시간 동안 유효합니다.<br>반환받은 임시 ID는 그룹상품 등록/수정 API에서 상품별로 상품 상세 정보를 다르게 입력하는 경우에 사용합니다. |
| content | - | string | 필수 |  |

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
curl -X POST 'https://api.commerce.naver.com/external/v2/standard-group-products/temp-detail-content' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```