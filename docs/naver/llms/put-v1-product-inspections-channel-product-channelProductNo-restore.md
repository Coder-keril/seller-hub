---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/restore-inspection-product-product
---
# PUT /v1/product-inspections/channel-product/{channelProductNo}/restore - 수정 요청 상품에 대해 복원 요청

이 API는 상품 검수 도메인에서 수정 요청된 채널 상품을 검수 이전 상태로 복원할 때 사용하는 v1 엔드포인트입니다. 판매자가 채널 상품을 수정 요청한 뒤 검수 결과 또는 운영 판단에 따라 수정 요청을 철회해야 할 때, 이 API 를 호출하면 해당 채널 상품의 검수 트랙이 이전 승인 상태로 되돌아가 검수 대기 큐에서 빠집니다. 일반적인 사용 사례는 수정 내용에 오타·잘못된 이미지·가격 입력 실수가 있어 검수 통과 전에 변경을 취소하거나, 마케팅 일정 변경으로 수정 적용을 보류해야 할 때 운영자 페이지 자동화 스크립트에서 호출하는 것입니다. 호출 시 channelProductNo 경로 변수만 입력하면 되고 요청 본문은 없으며, 응답은 공통 포맷(code·message·data) 으로 반환되어 성공 여부를 code 와 message 로 판단합니다. 복원 처리가 적용된 시점부터 채널 상품의 노출·판매 데이터는 수정 요청 직전 승인 데이터로 되돌아가므로, 진행 중이던 검수 결과·이력 확인은 별도 검수 조회 API 로 확인해야 합니다. 검수 진행 단계에 따라 복원이 불가능한 경우가 있으므로 응답 메시지를 기반으로 처리 가능 여부를 판단해야 합니다. 400 은 복원 불가 상태·잘못된 입력, 401/403 은 토큰·권한, 404 는 존재하지 않는 채널상품 또는 복원 대상 없음, 500 은 일시 장애로 보고 검수 상태 재확인 또는 백오프 재시도를 적용합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| channelProductNo | path | integer(int64) | 필수 |  |

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
curl -X PUT 'https://api.commerce.naver.com/external/v1/product-inspections/channel-product/{channelProductNo}/restore' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```