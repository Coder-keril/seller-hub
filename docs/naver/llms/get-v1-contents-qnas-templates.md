---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/get-comment-templates-contents
---
# GET /v1/contents/qnas/templates - 상품 문의 답변 템플릿 목록 조회

판매자센터에 미리 저장해 둔 상품 문의 답변 템플릿 전체 목록을 조회하여 CS 자동화 시스템이나 상담사 UI에서 답변 본문을 빠르게 채워 넣는 용도로 사용하는 API입니다. 템플릿은 자주 변경되는 데이터가 아니므로 호출 결과를 일정 시간(예: 수십 분~수 시간) 캐시해 두고 답변 등록 워크플로우에서 재사용하는 편이 안정적이며, 캐시는 판매자가 템플릿을 새로 저장·삭제했을 때 무효화하는 정책을 함께 설계하는 것이 좋습니다. 호출 시 별도의 필수 파라미터는 없지만 토큰의 권한 범위에 상품 문의 영역이 포함되어 있어야 합니다. 토큰 누락·만료 시 401 UNAUTHORIZED, 해당 계정에 상품 문의 답변 권한이 없으면 403 FORBIDDEN, 잘못된 요청이면 400 BAD_REQUEST, 리소스를 찾을 수 없으면 404 NOT_FOUND, 일시적 장애 시 500 INTERNAL_SERVER_ERROR가 떨어질 수 있으므로 응답 코드별로 분기해 재시도·알림·권한 안내를 처리해야 합니다. 404 NOT_FOUND는 보통 채널 매핑이나 토큰 매핑이 끊긴 경우이므로 권한 점검 후 재호출합니다.

> Base URL: https://api.commerce.naver.com/external

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| questionType | - | string |  | PRODUCT(상품), DELIVERY(배송), RETURN(반품), EXCHANGE(교환), REFUND(환불), ETC(기타). 허용값: `PRODUCT`, `DELIVERY`, `RETURN`, `EXCHANGE`, `REFUND`, `ETC` |
| subject | - | string |  |  |
| content | - | string |  |  |

### 에러 코드

| 상태 코드 | 설명 |
|-----------|------|
| 400 | 잘못된 요청<br/>- code : BAD_REQUEST |
| 401 | 인가되지 않은 요청<br/>- code : UNAUTHORIZED |
| 403 | 권한 없음<br/>- code : FORBIDDEN |
| 404 | 데이터 없음<br/>- code : NOT_FOUND |
| 500 | 내부 서버 오류<br/>- code : INTERNAL_SERVER_ERROR |

### 사용 enum 카탈로그

- 응답 `questionType`: `PRODUCT`, `DELIVERY`, `RETURN`, `EXCHANGE`, `REFUND`, `ETC`

### 호출 예시

```bash
curl -X GET 'https://api.commerce.naver.com/external/v1/contents/qnas/templates' \
  -H 'Authorization: Bearer {access_token}'
```
