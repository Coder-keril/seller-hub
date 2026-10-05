---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/apply-notice-product
---
# PUT /v1/products/channel-products/notice/apply - 채널 상품 공지사항 적용

이 API는 등록된 판매자 공지사항(sellerNoticeId) 을 여러 채널 상품(channelProductNos) 에 일괄 적용할 때 사용하는 v1 엔드포인트입니다. 한 번의 호출로 다수 채널 상품의 공지사항 연결 상태를 갱신할 수 있어, 동일 이벤트·동일 배송 지연 안내·동일 상품군 정책을 일괄 통보해야 할 때 운영 작업량을 크게 줄여줍니다. 일반적인 사용 사례는 시즌 프로모션 공지를 생성한 뒤 캠페인에 포함된 채널 상품 리스트에 한 번에 적용하거나, 출고 지연 공지를 영향 채널 상품 묶음에 적용하는 것입니다. sellerNoticeId 가 입력되지 않거나 적용 해제 의도로 비워 두는 운영 케이스가 가능한지는 응답 메시지를 확인하여 판단하고, 적용된 공지는 채널 상품 단건/다건 조회 API 에서 bbsSeq 등의 필드로 확인할 수 있습니다. 호출 시 channelProductNos 배열에 포함된 모든 채널 상품이 동일 판매자 소유여야 하며, 일부 상품이 권한 외 자원이면 전체 요청이 실패하거나 부분 적용으로 처리될 수 있으므로 응답의 data 와 message 를 함께 확인해 사후 검증해야 합니다. 응답은 공통 포맷(code·message·data) 으로 반환되며 일괄 적용은 트랜잭션 단위가 아니므로 재시도 시 이미 적용된 항목에 대한 중복 효과는 무시되지만, 실패 항목만 추려 재호출하는 것이 효율적입니다. 400 은 본문 누락·channelProductNos 형식 오류, 401/403 은 토큰·권한, 404 는 sellerNoticeId 또는 채널 상품 부재, 500 은 일시 장애로 보고 입력 재검증 또는 백오프 재시도를 적용합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 본문

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| sellerNoticeId | body | integer(int64) |  |  |
| channelProductNos | body | array | 필수 |  |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| code | - | string |  | 코드 |
| message | - | string |  | 메시지 |
| data | - | boolean |  | 데이터 정보 |

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
curl -X PUT 'https://api.commerce.naver.com/external/v1/products/channel-products/notice/apply' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```