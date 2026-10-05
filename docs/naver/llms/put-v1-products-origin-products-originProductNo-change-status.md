---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/read-channel-product-product
---
# PUT /v1/products/origin-products/{originProductNo}/change-status - 판매 상태 변경

이 API는 원상품(originProductNo) 의 판매 상태(statusType) 만 단건으로 전이할 때 사용하는 v1 엔드포인트로, 입력 가능한 값은 SALE(판매 중)·OUTOFSTOCK(품절)·SUSPENSION(판매 중지) 의 3 가지로 제한됩니다. 상태 머신은 SALE → OUTOFSTOCK(재고 자동 0), SUSPENSION/OUTOFSTOCK → SALE(품절에서 복귀 시 stockQuantity 입력 필수), SALE/OUTOFSTOCK/WAIT → SUSPENSION 으로 정해져 있으며, 재고 수량이 0 인 상태에서는 어떤 statusType 을 전달하더라도 OUTOFSTOCK 상태가 유지됩니다. 다만 현재 상태가 SUSPENSION 인 경우에는 전달된 재고 수량이 0 이어도 SUSPENSION 으로 유지되는 점에서 다른 전이와 차별됩니다. 일반적인 사용 사례는 시즌 종료·재고 소진·임시 판매 중단·재입고 후 판매 재개처럼 정해진 상태 전이를 일과 시간 외 배치로 실행하거나, 옵션 재고 변경 API 와 조합해 재고 0 대비 자동 OUTOFSTOCK 운영을 구현하는 것입니다. 호출 시 saleStartDate/saleEndDate 를 함께 전달하면 판매 기간도 같은 호출에서 갱신되며, 품절에서 SALE 로 복귀할 때 stockQuantity 미입력은 400 BAD_REQUEST 로 거부됩니다. 응답은 공통 포맷(code·message·data) 으로 반환되므로 성공 여부를 code 와 message 로 확인하고, 검수 단계의 상품(UNADMISSION/REJECTION) 이나 종료된 상품(CLOSE/PROHIBITION/DELETE) 은 이 API 로 전이할 수 없습니다. 400 은 허용되지 않는 전이·재고 미입력, 401/403 은 토큰·권한, 404 는 존재하지 않는 originProductNo, 500 은 일시 장애로 보고 상태 재확인 또는 백오프 재시도를 적용합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| originProductNo | path | integer(int64) | 필수 | 원상품번호 |

### 요청 본문

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| statusType | body | string | 필수 | 변경하려는 상품 판매 상태<br>- SALE(판매 중), OUTOFSTOCK(품절), SUSPENSION(판매 중지)<br>현재 상태에 따라 변경 가능한 상태는 다음과 같습니다.<br>- SALE(판매 중) → OUTOFSTOCK(품절)으로 변경(재고 수량은 0으로 변경됨)<br>- SUSPENSION(판매 중지), OUTOFSTOCK(품절) → SALE(판매 중)로 변경(품절에서 판매 중으로 변경 시 재고 수량 입력 필수)<br>- SALE(판매 중), OUTOFSTOCK(품절), WAIT(판매 대기) → SUSPENSION(판매 중지)으로 변경<br><br>상품의 재고 수량이 0인 경우 상태는 전달된 값과 무관하게 OUTOFSTCOK(품절) 상태를 유지합니다.<br>단, 현재 상태가 SUSPENSION(판매 중지)이면 전송된 재고 수량이 0이어도 SUSPENSION(판매 중지)으로 유지됩니다.. 허용값: `WAIT`, `SALE`, `OUTOFSTOCK`, `UNADMISSION`, `REJECTION`, `SUSPENSION`, `CLOSE`, `PROHIBITION`, `DELETE` |
| saleStartDate | body | string(date-time) |  | 'yyyy-MM-dd'T'HH:mm[:ss][.SSS]XXX' 형식으로 입력합니다. |
| saleEndDate | body | string(date-time) |  | 'yyyy-MM-dd'T'HH:mm[:ss][.SSS]XXX' 형식으로 입력합니다. |
| stockQuantity | body | integer(int64) |  | 변경하려는 재고 수량. 최대 99999999 |

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

### 사용 enum 카탈로그

- 요청 본문 `statusType`: `WAIT`, `SALE`, `OUTOFSTOCK`, `UNADMISSION`, `REJECTION`, `SUSPENSION`, `CLOSE`, `PROHIBITION`, `DELETE`

### 호출 예시

```bash
curl -X PUT 'https://api.commerce.naver.com/external/v1/products/origin-products/{originProductNo}/change-status' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```