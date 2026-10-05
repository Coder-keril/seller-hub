---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/get-hope-delivery-group-list-product
---
# GET /v1/product-delivery-info/hope-delivery-groups - 희망일배송 그룹 다건 조회

상품 배송 정보 도메인에서 희망일배송 그룹 목록을 페이지네이션으로 조회하는 API 로, 희망일배송 그룹은 일부 판매자에 한하여 지정 조건에서만 사용 가능하므로 운영 중인 그룹의 현황을 점검하는 출발점으로 활용한다. 응답은 contents 배열에 id, name, usable, baseGroup, hopeGroupStartTime/EndTime, regularHolidays(요일 enum), productRemovalType(DOWN_FIRST_FLOOR/COLLECT_SELLER), hopeDeliveryGroupDays 등을 담아 시간대·정기 휴무·제품 철거 옵션·요일별 운영 규칙을 한 번에 확인할 수 있다. 상품 등록·수정 흐름에서 본 API 로 그룹 후보를 받아 셀렉터에 노출한 뒤 선택된 hopeDeliveryGroupId 를 상품 페이로드에 매핑하면 해당 상품이 희망일배송 흐름에 편입된다. name(접두어 LIKE 검색), baseGroup, usable, page, size 쿼리로 필터링과 페이지 제어가 가능하며 페이지당 최대 100건까지 조회할 수 있다. 권한 부족은 403 FORBIDDEN, 인증 오류는 401 UNAUTHORIZED, 형식 오류는 400 BAD_REQUEST, 데이터 부재는 404 NOT_FOUND 로 응답되고, 500 INTERNAL_SERVER_ERROR 는 일시 장애로 간주해 지수 백오프 기반의 제한된 재시도만 적용한다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| name | query | string |  | 희망일배송 그룹 이름. LIKE '희망일배송 그룹 이름%' 검색 |
| baseGroup | query | boolean |  | 기본 그룹 여부 |
| usable | query | boolean |  | 사용 여부 |
| page | query | integer(int32) |  | 페이지 번호. 첫 번째 페이지 번호는 1입니다. |
| size | query | integer(int32) |  | 페이지 크기. 페이지당 100건까지 조회할 수 있습니다. |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| contents | - | array |  |  |
| contents.id | - | integer(int64) |  |  |
| contents.name | - | string | 필수 |  |
| contents.usable | - | boolean | 필수 |  |
| contents.baseGroup | - | boolean | 필수 |  |
| contents.hopeGroupStartTime | - | integer(int32) |  |  |
| contents.hopeGroupEndTime | - | integer(int32) |  |  |
| contents.regularHolidays | - | array |  | - SUNDAY(일요일), MONDAY(월요일), TUESDAY(화요일), WEDNESDAY(수요일), THURSDAY(목요일), FRIDAY(금요일), SATURDAY(토요일) |
| contents.regularHolidays.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| contents.ladderTruckUseComment | - | string |  |  |
| contents.productRemovalType | - | string |  | - DOWN_FIRST_FLOOR(1층까지 내림), COLLECT_SELLER(수거). 허용값: `DOWN_FIRST_FLOOR`, `COLLECT_SELLER` |
| contents.hopeDeliveryGroupDays | - | array | 필수 |  |
| contents.hopeDeliveryGroupDays.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| page | - | integer(int32) |  |  |
| size | - | integer(int32) |  |  |
| totalElements | - | integer(int64) |  |  |
| totalPages | - | integer(int32) |  |  |
| sort | - | object |  | 정렬 정보 |
| sort.sorted | - | boolean |  |  |
| sort.fields | - | array |  |  |
| sort.fields.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| first | - | boolean |  |  |
| last | - | boolean |  |  |

### 에러 코드

| 상태 코드 | 설명 |
|-----------|------|
| 400 | 잘못된 요청<br/>- code : BAD_REQUEST |
| 401 | 인가되지 않은 요청<br/>- code : UNAUTHORIZED |
| 403 | 권한 없음<br/>- code : FORBIDDEN |
| 404 | 데이터 없음<br/>- code : NOT_FOUND |
| 500 | 내부 서버 오류<br/>- code : INTERNAL_SERVER_ERROR |

### 사용 enum 카탈로그

- 응답 `contents[].regularHolidays[]`: `SUNDAY`, `MONDAY`, `TUESDAY`, `WEDNESDAY`, `THURSDAY`, `FRIDAY`, `SATURDAY`
- 응답 `contents[].productRemovalType`: `DOWN_FIRST_FLOOR`, `COLLECT_SELLER`
- 응답 `sort.fields[].direction`: `ASC`, `DESC`

### 호출 예시

```bash
curl -X GET 'https://api.commerce.naver.com/external/v1/product-delivery-info/hope-delivery-groups' \
  -H 'Authorization: Bearer {access_token}'
```
