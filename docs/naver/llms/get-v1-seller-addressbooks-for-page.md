---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/get-page-addresses-sellers
---
# GET /v1/seller/addressbooks-for-page - 주소록 목록 조회

판매자가 판매자센터에 저장해 둔 주소록 전체를 페이지 단위로 조회하는 API로, 사업장·추가 사업장·일반·출고지·반품/교환지·물류센터 출고지·물류센터 반품/교환지·해외 정산 계좌 은행 등 다양한 addressType의 주소를 한 번에 가져올 수 있습니다. page 쿼리(1~N, 기본 1)로 페이지를 넘기며 호출하고 응답의 totalPage와 비교해 마지막 페이지까지 순회하는 종료 조건을 명확히 두어야 하며, 한 번 적재한 주소록은 변경 빈도가 낮으므로 일정 TTL의 캐시로 활용해 출고지·반품지 선택 UI 응답 속도를 높이는 운영이 흔합니다. 응답에는 우편번호·기본/상세/전체 주소·연락처 두 개, 도로명 여부, 해외 주소 여부, Location 포함 여부가 함께 내려와 송장 출력·반품 라벨·해외 정산 화면 등 다양한 운영 화면에 즉시 사용할 수 있습니다. 401 UNAUTHORIZED는 토큰 갱신, 403 응답 코드(ROLE_NOT_FOUND/PROVISION_NOT_FOUND/INVALID_*_STATUS/RESOURCE_NOT_AVAILABLE)는 권한·약관·연동 상태 안내 화면으로 분기하고, 404 응답 코드(CHANNEL/STORE/REPRESENT/MEMBER/INTERLOCK_NOT_FOUND)는 매핑 끊김 가능성이므로 연동 점검이 필요합니다. 400 GENERAL_ERROR나 500(PARSING_FAIL/SERDES_FAIL/ENCDEC_FAIL/GENERAL_ERROR)은 일시 장애로 보고 지수 백오프로 재시도하며 반복 실패 시 운영 채널에 알립니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| page | query | integer(int32) |  | 조회하는 페이지 번호(1~N) |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| addressBooks | - | array |  | 주소록 목록 |
| addressBooks.addressBookNo | - | integer(int64) |  | 주소록 번호 |
| addressBooks.name | - | string |  | 이름 |
| addressBooks.addressType | - | string |  | 주소록 유형<br>* `REPRESENTATIVE`: 사업장<br>* `BUSINESS`: 추가 사업장<br>* `GENERAL`: 일반<br>* `RELEASE`: 출고지<br>* `REFUND_OR_EXCHANGE`: 반품/교환지<br>* `LOGISTICS_CENTER_RELEASE`: 물류센터 출고지<br>* `LOGISTICS_CENTER_REFUND_OR_EXCHANGE`: 물류센터 반품/교환지<br>* `OVERSEAS_BANK`: 해외 정산 계좌 은행. 허용값: `REPRESENTATIVE`, `BUSINESS`, `GENERAL`, `RELEASE`, `REFUND_OR_EXCHANGE`, `LOGISTICS_CENTER_RELEASE`, `LOGISTICS_CENTER_REFUND_OR_EXCHANGE`, `OVERSEAS_BANK` |
| addressBooks.postalCode | - | string |  | 우편번호 |
| addressBooks.baseAddress | - | string |  | 기본 주소 |
| addressBooks.detailAddress | - | string |  | 상세 주소 |
| addressBooks.address | - | string |  | 전체 주소 |
| addressBooks.phoneNumber1 | - | string |  | 연락처 1 |
| addressBooks.phoneNumber2 | - | string |  | 연락처 2 |
| addressBooks.hasLocation | - | boolean |  | Location 포함 여부 |
| addressBooks.roadNameAddress | - | boolean |  | 도로명 주소 여부 |
| addressBooks.overseasAddress | - | boolean |  | 해외 주소 여부 |
| page | - | integer(int32) |  | 현재 페이지 |
| totalPage | - | integer(int32) |  | 전체 페이지 수 |

### 에러 코드

| 상태 코드 | 설명 |
|-----------|------|
| 400 | ## Bad Request<br>----------<br>\| 코드 \| 설명 \|<br>\| -------- \| --- \|<br>\| GENERAL_ERROR \| 처리되지 않은 오류 \|<br>---------- |
| 401 | ## Unauthorized<br>----------<br>\| 코드 \| 설명 \|<br>\| -------- \| --- \|<br>\| UNAUTHORIZED \| 접근 권한이 없음 \|<br>---------- |
| 403 | ## Forbidden<br>----------<br>\| 코드 \| 설명 \|<br>\| -------- \| --- \|<br>\| ROLE_NOT_FOUND \| 권한 없음 \|<br>\| PROVISION_NOT_FOUND \| 약관 동의 필요 \|<br>\| INVALID_CHANNEL_STATUS \| 유효하지 않는 채널 상태 \|<br>\| INVALID_STORE_STATUS \| 유효하지 않은 스토어 상태 \|<br>\| INVALID_REPRESENT_STATUS \| 유효하지 않은 대표 상태 \|<br>\| INVALID_MEMBER_STATUS \| 유효하지 않은 회원 상태 \|<br>\| INVALID_INTERLOCK_STATUS \| 유효하지 않은 연동 상태 \|<br>\| RESOURCE_NOT_AVAILABLE \| 접근할 수 없는 자원 \|<br>---------- |
| 404 | ## Not Found<br>----------<br>\| 코드 \| 설명 \|<br>\| -------- \| --- \|<br>\| CHANNEL_NOT_FOUND \| 유효하지 않은 채널 번호 \|<br>\| STORE_NOT_FOUND \| 유효하지 않은 스토어 번호 \|<br>\| REPRESENT_NOT_FOUND \| 유효하지 않은 대표 번호 \|<br>\| MEMBER_NOT_FOUND \| 유효하지 않은 회원 번호 \|<br>\| INTERLOCK_NOT_FOUND \| 연동 정보 없음 \|<br>---------- |
| 500 | ## Internal Server Error<br>----------<br>\| 코드 \| 설명 \|<br>\| -------- \| --- \|<br>\| PARSING_FAIL \| 유효하지 않은 JSON 문법 \|<br>\| SERDES_FAIL \| 직렬화/역직렬화 실패 \|<br>\| ENCDEC_FAIL \| 암/복호화 실패 \|<br>\| GENERAL_ERROR \| 처리되지 않은 오류 \|<br>---------- |

### 사용 enum 카탈로그

- 응답 `addressBooks[].addressType`: `REPRESENTATIVE`, `BUSINESS`, `GENERAL`, `RELEASE`, `REFUND_OR_EXCHANGE`, `LOGISTICS_CENTER_RELEASE`, `LOGISTICS_CENTER_REFUND_OR_EXCHANGE`, `OVERSEAS_BANK`

### 호출 예시

```bash
curl -X GET 'https://api.commerce.naver.com/external/v1/seller/addressbooks-for-page' \
  -H 'Authorization: Bearer {access_token}'
```