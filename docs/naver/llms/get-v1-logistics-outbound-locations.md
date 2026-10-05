---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/get-outbound-locations-nfa
---
# GET /v1/logistics/outbound-locations - 판매자 창고 정보 조회

판매자가 판매자센터에 등록해 둔 출고 창고 정보와, 각 창고에 매핑된 택배사·배송 속성 조합을 일괄 조회하는 API입니다. 응답은 창고 ID·창고명과, 그 창고에 대해 주문 마감 시각/CAPA/휴무 정보가 설정된 택배사·배송 속성(SELLER_GUARANTEE 도착보장, HOPE_SELLER_GUARANTEE 희망일 도착보장) 매핑 목록(mappings)으로 구성되어 풀필먼트 라우팅·출고지 분기 로직의 기반 데이터로 사용됩니다. 주문 처리 시스템에서는 본 API의 결과를 주기적으로 캐시해 두고 주문별 출고지·송장사 자동 결정에 활용하며, 창고 추가·삭제·매핑 변경은 자주 일어나지 않으므로 일정 TTL(예: 수십 분~수 시간) 동안 메모리 캐시 후 변경 이벤트나 운영 신호로 무효화하는 운영이 일반적입니다. 별도 필수 파라미터가 없는 단순 조회 API이지만 토큰의 권한 범위에 판매자 물류 영역이 포함되어 있어야 합니다. 400 invalid_input은 호출 형식 자체에 문제가 있을 때, 404 not_found는 잘못된 API 주소 또는 권한 매핑 문제로 발생하므로 호출 경로와 토큰 매핑을 함께 점검합니다. 500 server_error는 일시적 서버 오류이므로 지수 백오프와 함께 제한된 횟수 내에서 재시도하고, 반복 실패 시 운영 채널로 즉시 에스컬레이션해 출고 라우팅 지연을 최소화합니다.

> Base URL: https://api.commerce.naver.com/external

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| outboundLocationId | - | string |  | 창고 ID |
| outboundLocationName | - | string |  | 창고명 |
| mappings | - | array |  | 창고에 대해 주문 마감 시각, CAPA, 휴무 정보가 설정된 택배사, 배송 속성 목록. (판매자센터 매핑 DB) 창고 ID를 포함하는 판매자센터 매핑 ID 목록을 응답합니다. |
| mappings.allianceId | - | string |  | 택배사 ID |
| mappings.allianceName | - | string |  | 택배사명 |
| mappings.deliveryType | - | string |  | 배송 속성. 허용값: `SELLER_GUARANTEE`, `HOPE_SELLER_GUARANTEE` |

### 에러 코드

| 상태 코드 | 설명 |
|-----------|------|
| 400 | 유효성 검사 오류<br>- `code`: **invalid_input** |
| 404 | 잘못된 API 주소 또는 리소스를 찾을 수 없는 경우<br>- `code`: **not_found** |
| 500 | API 처리 중 오류 발생<br>- `code`: **server_error** |

### 사용 enum 카탈로그

- 응답 `[].mappings[].deliveryType`: `SELLER_GUARANTEE`, `HOPE_SELLER_GUARANTEE`

### 호출 예시

```bash
curl -X GET 'https://api.commerce.naver.com/external/v1/logistics/outbound-locations' \
  -H 'Authorization: Bearer {access_token}'
```