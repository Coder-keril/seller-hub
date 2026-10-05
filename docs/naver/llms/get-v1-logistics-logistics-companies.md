---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/get-logistics-companies-nfa
---
# GET /v1/logistics/logistics-companies - 물류사 연동 정보 조회

판매자 계정에 연동되어 있는 물류사 정보 목록을 일괄 조회하는 API로, 풀필먼트 또는 배송 물류사와 각 물류사가 지원하는 배송 속성 조합을 한 번에 확인할 수 있습니다. 응답은 logisticsCompanyId·logisticsCompanyName과 deliveryTypes를 제공하며, 풀필먼트 물류사는 NORMAL·TODAY·ARRIVAL_GUARANTEE 같은 속성을, 배송 물류사는 SELLER_GUARANTEE·HOPE_SELLER_GUARANTEE 같은 속성을 가질 수 있어 출고 라우팅·송장 발급·도착보장 표기 같은 운영 로직의 기준 데이터로 활용됩니다. 운영 시스템에서는 본 API 결과를 일정 TTL(수십 분~수 시간)로 캐시한 뒤 주문 처리·창고 매핑 화면에 반복적으로 사용하고, 물류사 신규 연동이나 해지가 발생했을 때 캐시를 즉시 무효화하는 정책을 함께 두는 것이 좋습니다. 별도 요청 파라미터가 없는 단순 조회이지만, 토큰의 권한 범위에 판매자 물류 영역이 포함되어 있어야 정상적인 결과를 받을 수 있습니다. 400 invalid_input은 호출 형식 자체 문제, 404 not_found는 잘못된 API 주소 또는 권한 매핑 문제로 발생하므로 경로와 토큰 매핑을 함께 점검합니다. 500 server_error는 일시적 장애로 보고 지수 백오프로 재시도하며, 반복 실패 시 운영 채널로 에스컬레이션합니다.

> Base URL: https://api.commerce.naver.com/external

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| logisticsCompanies | - | array |  | 물류사 정보 목록 |
| logisticsCompanies.logisticsCompanyId | - | string |  | 물류사 ID |
| logisticsCompanies.logisticsCompanyName | - | string |  | 물류사명 |
| logisticsCompanies.deliveryTypes | - | string |  | 배송 속성 목록<br>- 풀필먼트 물류사: NORMAL, TODAY, ARRIVAL_GUARANTEE<br>- 배송 물류사: SELLER_GUARANTEE, HOPE_SELLER_GUARANTEE. 허용값: `NORMAL`, `TODAY`, `ARRIVAL_GUARANTEE`, `SELLER_GUARANTEE`, `HOPE_SELLER_GUARANTEE` |

### 에러 코드

| 상태 코드 | 설명 |
|-----------|------|
| 400 | 유효성 검사 오류<br>- `code`: **invalid_input** |
| 404 | 잘못된 API 주소 또는 리소스를 찾을 수 없는 경우<br>- `code`: **not_found** |
| 500 | API 처리 중 오류 발생<br>- `code`: **server_error** |

### 사용 enum 카탈로그

- 응답 `logisticsCompanies[].deliveryTypes`: `NORMAL`, `TODAY`, `ARRIVAL_GUARANTEE`, `SELLER_GUARANTEE`, `HOPE_SELLER_GUARANTEE`

### 호출 예시

```bash
curl -X GET 'https://api.commerce.naver.com/external/v1/logistics/logistics-companies' \
  -H 'Authorization: Bearer {access_token}'
```