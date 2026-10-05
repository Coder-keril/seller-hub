---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/delete-fashion-model-product
---
# DELETE /v1/product-fashion-models/{fashionModelId} - 패션모델 삭제

패션모델 도메인에서 사전에 등록한 모델 정보를 영구 삭제하는 비가역 작업으로, 패션·의류 상품 등록 시 코디네이션 이미지에 함께 노출되던 모델 프로필을 정리할 때 사용한다. 단종된 시즌 모델, 신원 변경으로 더 이상 사용할 수 없는 프로필, 잘못 업로드된 이미지 등을 제거하는 흐름이며, 이미 상품에 매핑되어 사용 중인 모델을 삭제하면 후속 상품 등록·수정 시 해당 모델이 더 이상 선택지로 노출되지 않으므로 사전에 사용 현황을 점검하는 것이 안전하다. 요청 시 fashionModelId 경로 파라미터에 대상 모델의 식별자를 지정하며, 존재하지 않는 ID 에 대해서는 404 NOT_FOUND 가 응답된다. 권한이 없는 계정의 호출은 403 FORBIDDEN, 토큰 오류는 401 UNAUTHORIZED 로 분리되고, 형식 오류는 400 BAD_REQUEST 로 반환되므로 입력값 검증 후 호출하는 흐름을 권장한다. 500 INTERNAL_SERVER_ERROR 는 서버 측 일시 장애에 해당하므로 지수 백오프 기반의 제한된 재시도만 적용하고, 동일 ID 재요청은 멱등성이 있으나 이미 삭제된 자원에 대해서는 404 가 반환됨을 처리 로직에 반영해야 한다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| fashionModelId | path | integer(int64) | 필수 | 패션모델 ID |

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
curl -X DELETE 'https://api.commerce.naver.com/external/v1/product-fashion-models/{fashionModelId}' \
  -H 'Authorization: Bearer {access_token}'
```