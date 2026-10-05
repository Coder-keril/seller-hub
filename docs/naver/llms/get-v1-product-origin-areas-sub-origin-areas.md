---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/get-sub-origin-area-list-product
---
# GET /v1/product-origin-areas/sub-origin-areas - 하위 원산지 코드 정보 다건 조회

하위 원산지 코드 정보 다건 조회 API는 상위 원산지 코드를 입력해 그 아래 단계에 속한 하위 원산지 코드와 이름 목록을 받아오기 위한 메타 정보 조회 엔드포인트입니다. 원산지 선택 UI를 광역 단위에서 시·군·구 단위로 점진적으로 좁혀 가는 드릴다운 방식으로 구현할 때 주로 사용하며, 전체 조회 API로 상위 코드를 확보한 뒤 사용자가 특정 상위 항목을 선택했을 때 본 API로 하위 후보를 갱신하는 흐름이 일반적입니다. code 파라미터는 선택이지만 미입력 시 의미 있는 결과가 반환되지 않을 수 있으므로 일반적으로 명시적으로 상위 코드를 지정해 호출합니다. 원산지 코드 체계는 변경 주기가 길기 때문에 동일 상위 코드에 대한 하위 목록을 클라이언트 측에서 캐싱하면 호출량과 응답 지연을 모두 줄일 수 있습니다. 잘못된 상위 코드를 보내면 400 BAD_REQUEST 또는 빈 결과가 반환될 수 있어 결과 길이를 먼저 점검하고, 401·403 응답은 인증·권한 문제로 토큰 재발급과 권한 확인 후 재시도하며, 500 응답은 일시 장애로 간주해 지수 백오프 재시도를 적용합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| code | query | string |  | 하위 원산지 코드. 조회하고자 하는 하위 원산지의 원산지 코드를 입력합니다. |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| subOriginAreaCodeNames | - | array |  |  |
| subOriginAreaCodeNames.code | - | string |  |  |
| subOriginAreaCodeNames.name | - | string |  |  |

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
curl -X GET 'https://api.commerce.naver.com/external/v1/product-origin-areas/sub-origin-areas' \
  -H 'Authorization: Bearer {access_token}'
```