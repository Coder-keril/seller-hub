---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/get-address-sellers
---
# GET /v1/seller/addressbooks/{addressBookNo} - 주소록 단건 조회

주소록 번호(addressBookNo)를 지정해 판매자의 특정 주소록 한 건을 상세 조회하는 API로, 사용자가 출고지·반품지·해외 정산 계좌 같은 주소를 화면에서 선택했을 때 후속 호출로 단건 상세를 가져오는 용도에 적합합니다. 응답에는 addressType(REPRESENTATIVE/BUSINESS/GENERAL/RELEASE/REFUND_OR_EXCHANGE/LOGISTICS_CENTER_RELEASE/LOGISTICS_CENTER_REFUND_OR_EXCHANGE/OVERSEAS_BANK), 우편번호, 기본/상세/전체 주소, 연락처 두 개, 도로명 여부·해외 주소 여부·Location 포함 여부가 포함되어 송장 출력·반품 라벨·해외 정산 화면 등에 즉시 활용할 수 있습니다. 목록 조회 API로 전체 주소록을 캐시한 뒤 본 단건 조회는 주소 변경이 의심되는 시점이나 상세 화면 진입 시에만 호출하는 식으로 호출량을 관리하는 운영이 일반적입니다. 401 UNAUTHORIZED는 토큰 갱신, 403 응답 코드(ROLE_NOT_FOUND/PROVISION_NOT_FOUND/INVALID_*_STATUS/RESOURCE_NOT_AVAILABLE)는 권한·약관·연동 상태별 안내 화면으로 분기하고, 404 응답 코드(CHANNEL/STORE/REPRESENT/MEMBER/INTERLOCK_NOT_FOUND)는 주소록 자체가 삭제되었거나 매핑이 끊겼을 가능성을 의미하므로 목록을 다시 조회해 캐시를 갱신해야 합니다. 400 GENERAL_ERROR나 500(PARSING_FAIL/SERDES_FAIL/ENCDEC_FAIL/GENERAL_ERROR)은 일시 장애로 보고 지수 백오프 후 제한된 횟수 내 재시도하며, 반복 실패 시 운영 채널에 에스컬레이션합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| addressBookNo | path | integer(int64) | 필수 | 주소록 번호 |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| addressBookNo | - | integer(int64) |  | 주소록 번호 |
| name | - | string |  | 이름 |
| addressType | - | string |  | 주소록 유형<br>* `REPRESENTATIVE`: 사업장<br>* `BUSINESS`: 추가 사업장<br>* `GENERAL`: 일반<br>* `RELEASE`: 출고지<br>* `REFUND_OR_EXCHANGE`: 반품/교환지<br>* `LOGISTICS_CENTER_RELEASE`: 물류센터 출고지<br>* `LOGISTICS_CENTER_REFUND_OR_EXCHANGE`: 물류센터 반품/교환지<br>* `OVERSEAS_BANK`: 해외 정산 계좌 은행. 허용값: `REPRESENTATIVE`, `BUSINESS`, `GENERAL`, `RELEASE`, `REFUND_OR_EXCHANGE`, `LOGISTICS_CENTER_RELEASE`, `LOGISTICS_CENTER_REFUND_OR_EXCHANGE`, `OVERSEAS_BANK` |
| postalCode | - | string |  | 우편번호 |
| baseAddress | - | string |  | 기본 주소 |
| detailAddress | - | string |  | 상세 주소 |
| address | - | string |  | 전체 주소 |
| phoneNumber1 | - | string |  | 연락처 1 |
| phoneNumber2 | - | string |  | 연락처 2 |
| hasLocation | - | boolean |  | Location 포함 여부 |
| roadNameAddress | - | boolean |  | 도로명 주소 여부 |
| overseasAddress | - | boolean |  | 해외 주소 여부 |

### 에러 코드

| 상태 코드 | 설명 |
|-----------|------|
| 400 | ## Bad Request<br>----------<br>\| 코드 \| 설명 \|<br>\| -------- \| --- \|<br>\| GENERAL_ERROR \| 처리되지 않은 오류 \|<br>---------- |
| 401 | ## Unauthorized<br>----------<br>\| 코드 \| 설명 \|<br>\| -------- \| --- \|<br>\| UNAUTHORIZED \| 접근 권한이 없음 \|<br>---------- |
| 403 | ## Forbidden<br>----------<br>\| 코드 \| 설명 \|<br>\| -------- \| --- \|<br>\| ROLE_NOT_FOUND \| 권한 없음 \|<br>\| PROVISION_NOT_FOUND \| 약관 동의 필요 \|<br>\| INVALID_CHANNEL_STATUS \| 유효하지 않는 채널 상태 \|<br>\| INVALID_STORE_STATUS \| 유효하지 않은 스토어 상태 \|<br>\| INVALID_REPRESENT_STATUS \| 유효하지 않은 대표 상태 \|<br>\| INVALID_MEMBER_STATUS \| 유효하지 않은 회원 상태 \|<br>\| INVALID_INTERLOCK_STATUS \| 유효하지 않은 연동 상태 \|<br>\| RESOURCE_NOT_AVAILABLE \| 접근할 수 없는 자원 \|<br>---------- |
| 404 | ## Not Found<br>----------<br>\| 코드 \| 설명 \|<br>\| -------- \| --- \|<br>\| CHANNEL_NOT_FOUND \| 유효하지 않은 채널 번호 \|<br>\| STORE_NOT_FOUND \| 유효하지 않은 스토어 번호 \|<br>\| REPRESENT_NOT_FOUND \| 유효하지 않은 대표 번호 \|<br>\| MEMBER_NOT_FOUND \| 유효하지 않은 회원 번호 \|<br>\| INTERLOCK_NOT_FOUND \| 연동 정보 없음 \|<br>---------- |
| 500 | ## Internal Server Error<br>----------<br>\| 코드 \| 설명 \|<br>\| -------- \| --- \|<br>\| PARSING_FAIL \| 유효하지 않은 JSON 문법 \|<br>\| SERDES_FAIL \| 직렬화/역직렬화 실패 \|<br>\| ENCDEC_FAIL \| 암/복호화 실패 \|<br>\| GENERAL_ERROR \| 처리되지 않은 오류 \|<br>---------- |

### 사용 enum 카탈로그

- 응답 `addressType`: `REPRESENTATIVE`, `BUSINESS`, `GENERAL`, `RELEASE`, `REFUND_OR_EXCHANGE`, `LOGISTICS_CENTER_RELEASE`, `LOGISTICS_CENTER_REFUND_OR_EXCHANGE`, `OVERSEAS_BANK`

### 호출 예시

```bash
curl -X GET 'https://api.commerce.naver.com/external/v1/seller/addressbooks/{addressBookNo}' \
  -H 'Authorization: Bearer {access_token}'
```