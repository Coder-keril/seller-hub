---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/update-hope-delivery-group-product
---
# PUT /v1/product-delivery-info/hope-delivery-groups/{hopeDeliveryGroupId} - 희망일배송 그룹 수정

이 API는 이미 등록된 희망일배송 그룹을 hopeDeliveryGroupId 기준으로 수정할 때 사용하는 v1 상품 배송 정보 엔드포인트입니다. 수정 가능한 항목은 그룹명·사용 여부·기본 그룹 여부·운영 시간(hopeGroupStartTime/EndTime)·정기 휴무일(regularHolidays)·사다리차 안내 문구·상품 수거 방식(productRemovalType: DOWN_FIRST_FLOOR/COLLECT_SELLER)·요일별 희망 배송 가능 일정(hopeDeliveryGroupDays) 등이며, 요청 본문의 hopeDeliveryGroup 객체를 통해 변경 내용을 전달합니다. 희망일배송 그룹은 일부 판매자에 한하여 지정 조건에서만 설정 가능한 운영 정책이므로 권한 없는 계정에서는 403 FORBIDDEN 이 발생하고, 정상 권한이 있더라도 grouopDays 가 비어 있거나 휴무 요일과 충돌하면 400 BAD_REQUEST 가 반환됩니다. 일반적인 사용 사례는 가구·가전 같은 대형 상품 판매자가 자체 배송망의 가능 요일·운영 시간을 시즌·인력 변동에 맞춰 갱신해 다수 상품에 일괄 반영되도록 운영하는 것입니다. 호출 시 baseGroup 을 true 로 변경하면 다른 그룹의 기본 여부와 충돌하지 않도록 정합성을 확인해야 하며, 변경된 운영 정책은 해당 그룹에 묶인 모든 상품의 희망일 선택 가능 범위에 즉시 영향을 줍니다. 응답으로는 수정된 그룹의 groupId 가 반환되며 이후 단건 조회·상품 등록·수정 API 에서 동일한 ID 를 사용합니다. 400 은 본문 누락·enum 오류·시간 충돌, 401/403 은 토큰·권한, 404 는 존재하지 않는 그룹 ID, 500 은 일시 장애로 보고 입력 재검증 또는 백오프 재시도를 적용합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| hopeDeliveryGroupId | path | integer(int64) | 필수 |  |

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
curl -X PUT 'https://api.commerce.naver.com/external/v1/product-delivery-info/hope-delivery-groups/{hopeDeliveryGroupId}' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```
