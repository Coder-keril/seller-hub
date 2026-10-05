---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/modify-today-dispatch-sellers
---
# POST /v1/seller/this-day-dispatch - 오늘출발 정보 설정

판매자의 오늘출발(당일 배송) 운영 기준 정보를 신규 설정하거나 기존 설정을 갱신하는 API로, 당일 배송 마감 시각(basisHour/basisMinute)과 설정 사유(reason)가 필수이며 휴무 요일(holidayOfTheWeek: SUNDAY~SATURDAY)과 판매자 휴무일 목록(sellerHolidays)을 선택적으로 함께 지정합니다. 판매자센터 운영 자동화나 외부 ERP에서 시즌별 마감 시각 조정, 임시 휴무 일정 반영 같은 워크플로우에서 호출되며, 응답이 204(No Content)이므로 호출 직후 조회 API로 최신 상태를 다시 읽어 캐시·UI를 동기화하는 패턴이 안전합니다. 설정이 즉시 주문 처리·도착 일정 표기에 영향을 주기 때문에 운영 시간대(특히 마감 임박 시각)에 호출할 때는 변경 범위와 적용 시점을 사내에서 명확히 확인한 뒤 진행해야 하며, 휴무 요일/휴무일 변경은 도착보장 약속과 충돌하지 않는지 함께 점검해야 합니다. 401 UNAUTHORIZED는 토큰 갱신, 403 응답 코드(ROLE_NOT_FOUND/PROVISION_NOT_FOUND/INVALID_*_STATUS/RESOURCE_NOT_AVAILABLE)는 권한·약관·연동 상태 안내로 분기하고, 404 응답 코드(CHANNEL/STORE/REPRESENT/MEMBER/INTERLOCK_NOT_FOUND)는 매핑 점검이 필요한 신호입니다. 400 GENERAL_ERROR나 500(PARSING_FAIL/SERDES_FAIL/ENCDEC_FAIL/GENERAL_ERROR)은 일시 장애로 보고 지수 백오프와 함께 제한된 횟수 내에서 재시도하며, 반복 실패 시 운영 채널로 즉시 에스컬레이션해 도착보장 표기와의 불일치를 최소화합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 본문

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| basisHour | body | integer(int32) | 필수 | 당일 배송 설정 시간 시 |
| basisMinute | body | integer(int32) | 필수 | 당일 배송 설정 시간 분 |
| holidayOfTheWeek | body | string |  | 휴무 요일<br>* `MONDAY`: 월요일<br>* `TUESDAY`: 화요일<br>* `WEDNESDAY`: 수요일<br>* `THURSDAY`: 목요일<br>* `FRIDAY`: 금요일. 허용값: `SUNDAY`, `MONDAY`, `TUESDAY`, `WEDNESDAY`, `THURSDAY`, `FRIDAY`, `SATURDAY` |
| sellerHolidays | body | array |  | 판매자 휴무일 목록 |
| reason | body | string | 필수 | 설정 사유 |

### 에러 코드

| 상태 코드 | 설명 |
|-----------|------|
| 400 | ## Bad Request<br>----------<br>\| 코드 \| 설명 \|<br>\| -------- \| --- \|<br>\| GENERAL_ERROR \| 처리되지 않은 오류 \|<br>---------- |
| 401 | ## Unauthorized<br>----------<br>\| 코드 \| 설명 \|<br>\| -------- \| --- \|<br>\| UNAUTHORIZED \| 접근 권한이 없음 \|<br>---------- |
| 403 | ## Forbidden<br>----------<br>\| 코드 \| 설명 \|<br>\| -------- \| --- \|<br>\| ROLE_NOT_FOUND \| 권한 없음 \|<br>\| PROVISION_NOT_FOUND \| 약관 동의 필요 \|<br>\| INVALID_CHANNEL_STATUS \| 유효하지 않는 채널 상태 \|<br>\| INVALID_STORE_STATUS \| 유효하지 않은 스토어 상태 \|<br>\| INVALID_REPRESENT_STATUS \| 유효하지 않은 대표 상태 \|<br>\| INVALID_MEMBER_STATUS \| 유효하지 않은 회원 상태 \|<br>\| INVALID_INTERLOCK_STATUS \| 유효하지 않은 연동 상태 \|<br>\| RESOURCE_NOT_AVAILABLE \| 접근할 수 없는 자원 \|<br>---------- |
| 404 | ## Not Found<br>----------<br>\| 코드 \| 설명 \|<br>\| -------- \| --- \|<br>\| CHANNEL_NOT_FOUND \| 유효하지 않은 채널 번호 \|<br>\| STORE_NOT_FOUND \| 유효하지 않은 스토어 번호 \|<br>\| REPRESENT_NOT_FOUND \| 유효하지 않은 대표 번호 \|<br>\| MEMBER_NOT_FOUND \| 유효하지 않은 회원 번호 \|<br>\| INTERLOCK_NOT_FOUND \| 연동 정보 없음 \|<br>---------- |
| 500 | ## Internal Server Error<br>----------<br>\| 코드 \| 설명 \|<br>\| -------- \| --- \|<br>\| PARSING_FAIL \| 유효하지 않은 JSON 문법 \|<br>\| SERDES_FAIL \| 직렬화/역직렬화 실패 \|<br>\| ENCDEC_FAIL \| 암/복호화 실패 \|<br>\| GENERAL_ERROR \| 처리되지 않은 오류 \|<br>---------- |

### 사용 enum 카탈로그

- 요청 본문 `holidayOfTheWeek`: `SUNDAY`, `MONDAY`, `TUESDAY`, `WEDNESDAY`, `THURSDAY`, `FRIDAY`, `SATURDAY`

### 호출 예시

```bash
curl -X POST 'https://api.commerce.naver.com/external/v1/seller/this-day-dispatch' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```