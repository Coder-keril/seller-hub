---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/get-progress-product
---
# GET /v2/standard-group-products/status - (v2) 그룹상품 요청 결과 조회

(v2) 그룹상품 요청 결과 조회 API는 그룹상품 등록(CREATE)·수정(UPDATE)·전환(CONVERT) 요청이 비동기 작업 큐를 통해 처리되기 때문에, 작업의 진행 상태와 결과를 조회하기 위한 폴링 엔드포인트입니다. requestId 를 함께 보내면 요청 type 과 무관하게 해당 작업 결과가 조회되며(1일간 보관), requestId 를 생략하면 가장 최근 작업 결과(5분간 보관) 가 반환됩니다. progress.state 는 QUEUED·IN_PROGRESS·COMPLETED·ALREADY_RESERVED·FAILED·ERROR 의 라이프사이클을 따르므로, 클라이언트는 COMPLETED·FAILED·ERROR 같은 종결 상태에 도달할 때까지 적절한 주기(예: 1~5초) 의 폴링과 최대 시도 횟수 제한으로 무한 루프를 방지해야 합니다. 동일 계정에서 이미 다른 요청이 진행 중인 경우 ALREADY_RESERVED 가 반환되므로, 직전 요청이 종료된 뒤에 다음 요청을 보내도록 큐잉하는 것이 안전합니다. 응답에는 처리된 originProductNo·channelProductNo·standardPurchaseOptionsIds 가 포함되어 후속 호출에서 식별자 매핑에 활용할 수 있고, invalidInputs·errorMessage 가 채워진 경우에는 요청 페이로드를 보정해 재시도합니다. 401·403 응답은 토큰 재발급·권한 확인으로 대응하고, 500 응답은 일시 장애로 간주해 지수 백오프 재시도를 적용합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| type | query | string |  | 결과를 조회할 그룹상품 요청 API의 타입<br>- CREATE(그룹상품 등록), UPDATE(그룹상품 수정), CONVERT(그룹상품 전환). 허용값: `CREATE`, `UPDATE`, `CONVERT` |
| requestId | query | string |  | 조회할 요청 ID<br>- requestId를 입력한 경우, 요청 type과 무관하게 requestId의 작업 결과가 조회됩니다.(1일간 보관)<br>- requestId를 입력하지 않은 경우, 가장 최근의 작업 결과가 조회됩니다.(5분간 보관) |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| progress | - | object |  |  |
| progress.state | - | string |  | - QUEUED: 상품 등록/수정/전환 대기 중<br>- IN PROGRESS: 상품 등록/수정/전환 진행 중<br>- COMPLETED: 상품 등록/수정/전환 완료<br>- ALREADY_RESERVED: 동일 계정에서 이미 다른 요청이 진행 중<br>- FAILED: 상품 등록/수정/전환 실패<br>- ERROR: 시스템 오류. 허용값: `QUEUED`, `IN_PROGRESS`, `COMPLETED`, `ALREADY_RESERVED`, `ERROR`, `FAILED` |
| progress.invalidInputs | - | array |  |  |
| progress.invalidInputs.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| progress.errorMessage | - | string |  |  |
| progress.progress | - | integer(int32) |  |  |
| requestId | - | string |  | 요청을 식별하기 위한 고유 ID입니다. 처리 상태와 진행 상황을 조회할 수 있습니다. |
| groupProductNo | - | integer(int64) |  |  |
| productNos | - | array |  |  |
| productNos.originProductNo | - | integer(int64) |  |  |
| productNos.smartstoreChannelProductNo | - | integer(int64) |  |  |
| productNos.windowChannelProductNo | - | integer(int64) |  |  |
| standardPurchaseOptionsIds | - | array |  |  |
| standardPurchaseOptionsIds.originProductNo | - | integer(int64) |  |  |
| standardPurchaseOptionsIds.standardPurchaseOptionsIds | - | array |  |  |
| standardPurchaseOptionsIds.standardPurchaseOptionsIds.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |

### 에러 코드

| 상태 코드 | 설명 |
|-----------|------|
| 400 | 잘못된 요청<br/>- code : BAD_REQUEST |
| 401 | 인가되지 않은 요청<br/>- code : UNAUTHORIZED |
| 403 | 권한 없음<br/>- code : FORBIDDEN |
| 404 | 데이터 없음<br/>- code : NOT_FOUND |
| 500 | 내부 서버 오류<br/>- code : INTERNAL_SERVER_ERROR |

### 사용 enum 카탈로그

- 파라미터 `type`: `CREATE`, `UPDATE`, `CONVERT`
- 응답 `progress.state`: `QUEUED`, `IN_PROGRESS`, `COMPLETED`, `ALREADY_RESERVED`, `ERROR`, `FAILED`

### 호출 예시

```bash
curl -X GET 'https://api.commerce.naver.com/external/v2/standard-group-products/status' \
  -H 'Authorization: Bearer {access_token}'
```