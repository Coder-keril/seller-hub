---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/delete-product-product
---
# DELETE /v2/standard-group-products/{groupProductNo} - (v2) 그룹상품 삭제

그룹상품 도메인에서 v2 그룹상품 한 건을 삭제하는 비가역 작업으로, v2 에서 도입된 그룹상품은 색상/사이즈 등 속성이 다른 단품들을 하나의 묶음으로 노출하는 마스터 자원이기 때문에 삭제 시 그룹 단위 노출이 즉시 해제되고 묶여 있던 단품들도 그룹 표시에서 분리된다. 일반적인 사용 사례는 단종에 따른 그룹 정리, 잘못 묶인 그룹의 재편성, 시즌 종료 후 그룹 폐기 등이며, 그룹 내 단품의 일반 판매를 유지해야 한다면 그룹만 분리 정리하는 흐름으로 활용한다. 요청에는 groupProductNo 경로 파라미터에 대상 그룹상품 식별자를 정확히 지정해야 하고, 잘못된 형식은 400 BAD_REQUEST, 존재하지 않는 그룹은 404 NOT_FOUND 로 응답된다. 권한이 없으면 403 FORBIDDEN, 인증 오류는 401 UNAUTHORIZED 로 분리되며, 500 INTERNAL_SERVER_ERROR 는 서버 일시 장애로 간주하여 지수 백오프 기반의 제한된 재시도만 적용한다. 멱등성을 갖지만 이미 삭제된 그룹의 재호출은 404 가 반환되므로 처리 흐름에 반영하고, 삭제 직후에는 채널 노출 결과를 그룹상품 단건 조회로 교차 검증하는 것이 안전하다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| groupProductNo | path | integer(int64) | 필수 |  |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| code | - | string |  | 코드 |
| message | - | string |  | 메시지 |
| data | - | object |  | 데이터 정보 |

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
curl -X DELETE 'https://api.commerce.naver.com/external/v2/standard-group-products/{groupProductNo}' \
  -H 'Authorization: Bearer {access_token}'
```