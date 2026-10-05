---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/get-hope-delivery-group-product
---
# GET /v1/product-delivery-info/hope-delivery-groups/{hopeDeliveryGroupId} - 희망일배송 그룹 단건 조회

상품 배송 정보 도메인에서 희망일배송 그룹 한 건의 상세를 단건 조회하는 API 로, 희망일배송 그룹은 일부 판매자에 한하여 지정 조건에서만 사용 가능한 자원이므로 본 API 는 실제 운영 정책(운영 시간대·정기 휴무·제품 철거 옵션·요일별 그룹일)을 확정적으로 확인하는 용도로 사용한다. 응답의 hopeDeliveryGroup 객체에는 그룹의 식별/명칭, 사용 가능 여부, 기준 그룹 여부, 운영 시간, 정기 휴무, 제품 철거 옵션, 요일별 그룹일 등 동작 규칙을 확인하는 데 필요한 정보가 포함된다. 일반적인 사용 흐름은 다건 조회로 후보를 식별한 뒤 본 API 로 상세를 확정하고 수정 API 또는 상품 등록 페이로드의 hopeDeliveryGroupId 매핑으로 이어가는 형태이다. hopeDeliveryGroupId 경로 파라미터는 필수이며, 잘못된 형식은 400 BAD_REQUEST, 존재하지 않는 그룹은 404 NOT_FOUND 로 응답된다. 권한 부족은 403 FORBIDDEN, 인증 오류는 401 UNAUTHORIZED 로 분리되고, 500 INTERNAL_SERVER_ERROR 는 일시 장애로 간주해 지수 백오프 기반의 제한된 재시도를 적용한다. 리다이렉션이 필요한 경우 308 응답이 반환될 수 있으므로, 클라이언트는 Location 을 따라가도록 설정하거나 동일 요청을 새 경로로 재시도할 때 무한 리다이렉션이 발생하지 않도록 횟수 제한을 둔다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| hopeDeliveryGroupId | path | integer(int64) | 필수 | 희망일배송 그룹 ID |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| hopeDeliveryGroup | - | object |  | 희망일배송 그룹.<br>이 구조체는 상품의 배송 정보 중 희망일배송 그룹 정보 데이터를 표현하는 구조체입니다.<br>희망일배송 그룹 정보는 희망일배송 설정 상품에만 적용 가능하며 희망일배송 설정은 일부 판매자에 한하여 지정 조건에서만 설정이 가능합니다.<br>- 이 구조체는 API 호출에 대한 요청/응답 모두에서 사용합니다.<br>- 구조체의 객체 1개는 희망일배송 그룹 1개를 표현합니다.<br>- 이 구조체는 아래 API에서 사용합니다.<br>  - 희망일배송 그룹 다건 조회, 희망일배송 그룹 등록, 희망일배송 그룹 단건 조회, 희망일배송 그룹 수정 |
| hopeDeliveryGroup.id | - | integer(int64) |  |  |
| hopeDeliveryGroup.name | - | string | 필수 |  |
| hopeDeliveryGroup.usable | - | boolean | 필수 |  |
| hopeDeliveryGroup.baseGroup | - | boolean | 필수 |  |
| hopeDeliveryGroup.hopeGroupStartTime | - | integer(int32) |  |  |
| hopeDeliveryGroup.hopeGroupEndTime | - | integer(int32) |  |  |
| hopeDeliveryGroup.regularHolidays | - | array |  | - SUNDAY(일요일), MONDAY(월요일), TUESDAY(화요일), WEDNESDAY(수요일), THURSDAY(목요일), FRIDAY(금요일), SATURDAY(토요일) |
| hopeDeliveryGroup.regularHolidays.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| hopeDeliveryGroup.ladderTruckUseComment | - | string |  |  |
| hopeDeliveryGroup.productRemovalType | - | string |  | - DOWN_FIRST_FLOOR(1층까지 내림), COLLECT_SELLER(수거). 허용값: `DOWN_FIRST_FLOOR`, `COLLECT_SELLER` |
| hopeDeliveryGroup.hopeDeliveryGroupDays | - | array | 필수 |  |
| hopeDeliveryGroup.hopeDeliveryGroupDays.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |

### 에러 코드

| 상태 코드 | 설명 |
|-----------|------|
| 400 | 잘못된 요청<br/>- code : BAD_REQUEST |
| 401 | 인가되지 않은 요청<br/>- code : UNAUTHORIZED |
| 403 | 권한 없음<br/>- code : FORBIDDEN |
| 404 | 데이터 없음<br/>- code : NOT_FOUND |
| 500 | 내부 서버 오류<br/>- code : INTERNAL_SERVER_ERROR |

### 사용 enum 카탈로그

- 응답 `hopeDeliveryGroup.regularHolidays[]`: `SUNDAY`, `MONDAY`, `TUESDAY`, `WEDNESDAY`, `THURSDAY`, `FRIDAY`, `SATURDAY`
- 응답 `hopeDeliveryGroup.productRemovalType`: `DOWN_FIRST_FLOOR`, `COLLECT_SELLER`

### 호출 예시

```bash
curl -X GET 'https://api.commerce.naver.com/external/v1/product-delivery-info/hope-delivery-groups/{hopeDeliveryGroupId}' \
  -H 'Authorization: Bearer {access_token}'
```
