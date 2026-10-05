---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/get-today-dispatch-sellers
---
# GET /v1/seller/this-day-dispatch - 오늘출발 설정 정보 조회

판매자가 운영 중인 오늘출발(당일 배송) 설정 현황을 조회하는 API로, 당일 배송 마감 시각(basisHour/basisMinute), 휴무 요일(holidayOfTheWeek: SUNDAY~SATURDAY), 판매자가 직접 등록한 특정 휴무일 목록(sellerHolidays), 그리고 설정 사유(reason)를 한 번에 반환합니다. 외부 백오피스나 모니터링 시스템에서 현재 활성화된 오늘출발 기준을 사용자에게 노출하거나, 설정 변경 직전 현재 값을 보존해 비교/롤백 정보로 활용하는 워크플로우에 사용됩니다. 설정 값이 자주 바뀌지 않으므로 짧은 TTL의 메모리 캐시를 두고 설정 변경 API 호출 직후 즉시 무효화하는 운영이 안전합니다. 호출 시 별도 요청 파라미터는 없지만 토큰이 해당 판매자에 대한 권한 범위를 갖고 있어야 하며, 401 UNAUTHORIZED는 토큰 갱신 플로우, 403 응답 코드(ROLE_NOT_FOUND/PROVISION_NOT_FOUND/INVALID_*_STATUS/RESOURCE_NOT_AVAILABLE)는 권한·약관·연동 상태 안내 화면으로 분기합니다. 404 응답 코드(CHANNEL/STORE/REPRESENT/MEMBER/INTERLOCK_NOT_FOUND)는 연동 상태 점검이 필요하다는 신호이고, 400 GENERAL_ERROR나 500(PARSING_FAIL/SERDES_FAIL/ENCDEC_FAIL/GENERAL_ERROR)은 일시 장애로 보고 지수 백오프 후 제한된 횟수 내에서 재시도하며, 반복 실패 시 운영 채널로 즉시 에스컬레이션합니다.

> Base URL: https://api.commerce.naver.com/external

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| sellerId | - | string |  | 설정 대상 계정 ID |
| basisHour | - | integer(int32) |  | 당일 배송 설정 시간 시 |
| basisMinute | - | integer(int32) |  | 당일 배송 설정 시간 분 |
| holidayOfTheWeek | - | string |  | 휴무 요일<br>* `MONDAY`: 월요일<br>* `TUESDAY`: 화요일<br>* `WEDNESDAY`: 수요일<br>* `THURSDAY`: 목요일<br>* `FRIDAY`: 금요일. 허용값: `SUNDAY`, `MONDAY`, `TUESDAY`, `WEDNESDAY`, `THURSDAY`, `FRIDAY`, `SATURDAY` |
| sellerHolidays | - | array |  | 판매자 휴무일 목록 |
| reason | - | string |  | 설정 사유 |

### 에러 코드

| 상태 코드 | 설명 |
|-----------|------|
| 400 | ## Bad Request<br>----------<br>\| 코드 \| 설명 \|<br>\| -------- \| --- \|<br>\| GENERAL_ERROR \| 처리되지 않은 오류 \|<br>---------- |
| 401 | ## Unauthorized<br>----------<br>\| 코드 \| 설명 \|<br>\| -------- \| --- \|<br>\| UNAUTHORIZED \| 접근 권한이 없음 \|<br>---------- |
| 403 | ## Forbidden<br>----------<br>\| 코드 \| 설명 \|<br>\| -------- \| --- \|<br>\| ROLE_NOT_FOUND \| 권한 없음 \|<br>\| PROVISION_NOT_FOUND \| 약관 동의 필요 \|<br>\| INVALID_CHANNEL_STATUS \| 유효하지 않는 채널 상태 \|<br>\| INVALID_STORE_STATUS \| 유효하지 않은 스토어 상태 \|<br>\| INVALID_REPRESENT_STATUS \| 유효하지 않은 대표 상태 \|<br>\| INVALID_MEMBER_STATUS \| 유효하지 않은 회원 상태 \|<br>\| INVALID_INTERLOCK_STATUS \| 유효하지 않은 연동 상태 \|<br>\| RESOURCE_NOT_AVAILABLE \| 접근할 수 없는 자원 \|<br>---------- |
| 404 | ## Not Found<br>----------<br>\| 코드 \| 설명 \|<br>\| -------- \| --- \|<br>\| CHANNEL_NOT_FOUND \| 유효하지 않은 채널 번호 \|<br>\| STORE_NOT_FOUND \| 유효하지 않은 스토어 번호 \|<br>\| REPRESENT_NOT_FOUND \| 유효하지 않은 대표 번호 \|<br>\| MEMBER_NOT_FOUND \| 유효하지 않은 회원 번호 \|<br>\| INTERLOCK_NOT_FOUND \| 연동 정보 없음 \|<br>---------- |
| 500 | ## Internal Server Error<br>----------<br>\| 코드 \| 설명 \|<br>\| -------- \| --- \|<br>\| PARSING_FAIL \| 유효하지 않은 JSON 문법 \|<br>\| SERDES_FAIL \| 직렬화/역직렬화 실패 \|<br>\| ENCDEC_FAIL \| 암/복호화 실패 \|<br>\| GENERAL_ERROR \| 처리되지 않은 오류 \|<br>---------- |

### 사용 enum 카탈로그

- 응답 `holidayOfTheWeek`: `SUNDAY`, `MONDAY`, `TUESDAY`, `WEDNESDAY`, `THURSDAY`, `FRIDAY`, `SATURDAY`

### 호출 예시

```bash
curl -X GET 'https://api.commerce.naver.com/external/v1/seller/this-day-dispatch' \
  -H 'Authorization: Bearer {access_token}'
```