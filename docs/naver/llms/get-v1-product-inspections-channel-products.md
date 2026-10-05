---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/get-inspection-products-request-product
---
# GET /v1/product-inspections/channel-products - 수정 요청 상품 목록을 조회

상품 검수 도메인에서 운영자 검수 결과로 수정 요청이 발생한 채널 상품 목록을 페이지네이션으로 조회하는 API 로, 검수 후 액션이 필요한 상품을 일괄 식별해 후속 수정·복원 흐름을 이어가는 출발점에 해당한다. 응답은 contents 배열에 channelProductNo, reason(수정 요청 사유), action(요구 액션), restorationRequestAvailable(복원 요청 가능 여부) 을 담아, 이미 복원 요청해 검수 진행 중인 상품은 restorationRequestAvailable 가 N 으로 내려와 중복 요청을 방지할 수 있도록 한다. 일반적인 운영 흐름은 본 API 로 수정 요청 대상을 식별한 뒤 상품 수정 API 로 정정 내용을 반영하고 필요 시 복원 요청 API 를 호출하는 형태이며, 정기적으로 호출해 미처리 잔여 건을 관리하는 배치 흐름과도 잘 맞는다. page 와 size 쿼리로 페이지를 제어하고 size 는 10, 50, 100 만 허용하며 기본값은 100 이다. 권한 부족은 403 FORBIDDEN, 인증 오류는 401 UNAUTHORIZED, 형식 오류는 400 BAD_REQUEST, 데이터 부재는 404 NOT_FOUND 로 응답되고, 500 INTERNAL_SERVER_ERROR 는 일시 장애로 간주해 지수 백오프 기반의 제한된 재시도만 적용한다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| page | query | integer(int32) |  | 조회할 페이지 번호. 기본값은 1 |
| size | query | integer(int32) |  | 페이지 크기. 10, 50, 100만 입력 가능, 기본값은 100 |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| contents | - | array |  |  |
| contents.channelProductNo | - | integer(int64) |  |  |
| contents.reason | - | string |  |  |
| contents.action | - | string |  |  |
| contents.restorationRequestAvailable | - | boolean |  | Y 또는 N. 이미 복원 요청하여 검수 진행 중인 상품의 경우 N을 입력합니다. |
| page | - | integer(int32) |  |  |
| size | - | integer(int32) |  |  |
| totalElements | - | integer(int32) |  |  |
| totalPages | - | integer(int32) |  |  |
| first | - | boolean |  |  |
| last | - | boolean |  |  |

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
curl -X GET 'https://api.commerce.naver.com/external/v1/product-inspections/channel-products' \
  -H 'Authorization: Bearer {access_token}'
```