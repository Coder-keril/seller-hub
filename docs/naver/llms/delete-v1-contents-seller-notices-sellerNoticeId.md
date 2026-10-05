---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/delete-post-contents
---
# DELETE /v1/contents/seller-notices/{sellerNoticeId} - 공지사항 삭제

상품 공지사항 도메인에서 특정 공지사항을 삭제하는 비가역 작업으로, 스토어 또는 상품 노출 영역에 적용되어 있던 공지를 제거할 때 사용한다. 일반적으로는 운영 종료된 이벤트 공지, 만료된 배송 지연 안내, 잘못 등록된 공지의 정리에 활용하며 삭제 직후 노출 채널에서 즉시 사라지므로 사전에 영향 범위(중요/전체/팝업 공지 여부, 적용된 상품 수)를 확인해 두는 것이 안전하다. 호출 시 sellerNoticeId 경로 파라미터에 대상 공지의 식별자를 정확히 지정해야 하며, 임의 ID 로 반복 호출 시 404 응답으로 이어진다. 해당 작업은 멱등성을 가지므로 같은 ID 로 재호출해도 추가 영향은 없지만, 이미 삭제된 공지에 대해서는 404 NOT_FOUND 가 반환된다. 권한이 없는 마스터/매니저 계정이 호출하면 403 FORBIDDEN 으로 차단되고, 토큰 만료·서명 오류는 401 UNAUTHORIZED 로 분리되어 응답된다. 400 BAD_REQUEST 는 잘못된 형식의 ID 입력에서, 500 INTERNAL_SERVER_ERROR 는 서버 측 일시 장애에서 발생하므로 후자는 지수 백오프와 함께 제한된 횟수만 재시도하는 것이 권장된다. 성공 시 204 No Content 로 본문 없이 응답되며 별도 후속 검증이 필요하면 공지사항 목록 조회로 누락을 확인할 수 있다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| sellerNoticeId | path | integer(int64) | 필수 | 공지사항 ID |

### 에러 코드

| 상태 코드 | 설명 |
|-----------|------|
| 400 | 잘못된 요청<br>- code : BAD_REQUEST |
| 500 | 내부 서버 오류<br>- code : INTERNAL_SERVER_ERROR |
| 401 | 인가되지 않은 요청<br>- code : UNAUTHORIZED |
| 403 | 권한 없음<br>- code : FORBIDDEN |
| 404 | 데이터 없음<br>- code : NOT_FOUND |

### 호출 예시

```bash
curl -X DELETE 'https://api.commerce.naver.com/external/v1/contents/seller-notices/{sellerNoticeId}' \
  -H 'Authorization: Bearer {access_token}'
```