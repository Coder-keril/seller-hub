---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/create-hope-delivery-group-product
---
# POST /v1/product-delivery-info/hope-delivery-groups - 희망일배송 그룹 등록

이 API는 v1 상품 배송 정보 도메인에서 희망일배송 그룹을 새로 등록할 때 사용합니다. 희망일배송 그룹은 구매자가 받기를 원하는 날짜를 지정할 수 있도록 운영 시간(hopeGroupStartTime/EndTime)·정기 휴무일(regularHolidays)·요일별 배송 가능 일정(hopeDeliveryGroupDays)·사다리차 안내 문구·상품 수거 방식(productRemovalType) 등을 묶어 관리하는 단위이며, 등록된 그룹은 이후 상품 등록·수정 시 deliveryInfo.hopeDeliveryGroupId 로 참조해 상품에 묶입니다. 희망일배송 설정은 일부 판매자에 한하여 지정 조건을 충족할 때만 가능하므로, 권한이 없는 계정에서는 403 FORBIDDEN 이 발생할 수 있고 기능 자체가 노출되지 않습니다. 정상 호출 시 응답으로 groupId 가 반환되며, 이후 그룹 수정·단건 조회·다건 조회 API 에서 동일한 ID 를 사용합니다. 일반적인 사용 사례는 가구·가전 같은 대형 상품 판매자가 자체 배송망의 가능 요일과 시간대를 그룹으로 묶어 두고 여러 상품에 동일한 그룹을 재사용하는 것입니다. 호출 시 baseGroup 을 true 로 지정하면 기본 그룹이 되므로 한 판매자 내에서 동시에 두 개의 기본 그룹이 존재하지 않도록 유의하고, 휴무 요일과 배송 요일이 충돌하지 않게 검증한 뒤 등록해야 합니다. 400 BAD_REQUEST 는 필수 값 누락·요일 enum 오류·시간 범위 오류 등 입력 검증 실패를 의미하므로 요청 본문을 재검토하고, 401/403 은 토큰·권한, 404 는 참조 자원 부재, 500 은 일시적 오류로 보고 지수 백오프 재시도로 대응합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 본문

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| hopeDeliveryGroup | body | object | 필수 | 희망일배송 그룹.<br>이 구조체는 상품의 배송 정보 중 희망일배송 그룹 정보 데이터를 표현하는 구조체입니다.<br>희망일배송 그룹 정보는 희망일배송 설정 상품에만 적용 가능하며 희망일배송 설정은 일부 판매자에 한하여 지정 조건에서만 설정이 가능합니다.<br>- 이 구조체는 API 호출에 대한 요청/응답 모두에서 사용합니다.<br>- 구조체의 객체 1개는 희망일배송 그룹 1개를 표현합니다.<br>- 이 구조체는 아래 API에서 사용합니다.<br>  - 희망일배송 그룹 다건 조회, 희망일배송 그룹 등록, 희망일배송 그룹 단건 조회, 희망일배송 그룹 수정 |
| hopeDeliveryGroup.id | body | integer(int64) |  |  |
| hopeDeliveryGroup.name | body | string | 필수 |  |
| hopeDeliveryGroup.usable | body | boolean | 필수 |  |
| hopeDeliveryGroup.baseGroup | body | boolean | 필수 |  |
| hopeDeliveryGroup.hopeGroupStartTime | body | integer(int32) |  |  |
| hopeDeliveryGroup.hopeGroupEndTime | body | integer(int32) |  |  |
| hopeDeliveryGroup.regularHolidays | body | array |  | - SUNDAY(일요일), MONDAY(월요일), TUESDAY(화요일), WEDNESDAY(수요일), THURSDAY(목요일), FRIDAY(금요일), SATURDAY(토요일) |
| hopeDeliveryGroup.regularHolidays.… | body | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| hopeDeliveryGroup.ladderTruckUseComment | body | string |  |  |
| hopeDeliveryGroup.productRemovalType | body | string |  | - DOWN_FIRST_FLOOR(1층까지 내림), COLLECT_SELLER(수거). 허용값: `DOWN_FIRST_FLOOR`, `COLLECT_SELLER` |
| hopeDeliveryGroup.hopeDeliveryGroupDays | body | array | 필수 |  |
| hopeDeliveryGroup.hopeDeliveryGroupDays.… | body | - |  | 하위 구조 생략 (상세는 OAS 참조) |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| groupId | - | integer(int64) |  |  |

### 에러 코드

| 상태 코드 | 설명 |
|-----------|------|
| 400 | 잘못된 요청<br/>- code : BAD_REQUEST |
| 401 | 인가되지 않은 요청<br/>- code : UNAUTHORIZED |
| 403 | 권한 없음<br/>- code : FORBIDDEN |
| 404 | 데이터 없음<br/>- code : NOT_FOUND |
| 500 | 내부 서버 오류<br/>- code : INTERNAL_SERVER_ERROR |

### 사용 enum 카탈로그

- 요청 본문 `hopeDeliveryGroup.regularHolidays[]`: `SUNDAY`, `MONDAY`, `TUESDAY`, `WEDNESDAY`, `THURSDAY`, `FRIDAY`, `SATURDAY`
- 요청 본문 `hopeDeliveryGroup.productRemovalType`: `DOWN_FIRST_FLOOR`, `COLLECT_SELLER`

### 호출 예시

```bash
curl -X POST 'https://api.commerce.naver.com/external/v1/product-delivery-info/hope-delivery-groups' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```
