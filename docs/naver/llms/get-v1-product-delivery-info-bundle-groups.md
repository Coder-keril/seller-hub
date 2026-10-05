---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/get-delivery-bundle-group-list-product
---
# GET /v1/product-delivery-info/bundle-groups - 묶음배송 그룹 다건 조회

상품 배송 정보 도메인에서 묶음배송 그룹 목록을 페이지네이션으로 조회하는 API 로, 묶음배송 그룹의 생애주기(등록·조회·수정) 중 현재 운영 중인 그룹 현황을 확인하는 출발점에 해당한다. 응답은 contents 배열에 묶음배송 그룹의 주요 속성을 담아 사용 가능 여부와 기본 그룹 여부를 한 번에 식별할 수 있도록 한다. 상품 등록·수정 흐름에서 본 API 로 그룹 후보를 받아 셀렉터에 노출하고 선택된 deliveryBundleGroupId 를 상품 페이로드에 매핑하면 그룹에 속한 상품들이 함께 묶여 배송비를 산정하게 된다. name(접두어 LIKE 검색), baseGroup, usable, page, size 쿼리로 필터링과 페이지 제어가 가능하며 페이지당 최대 100건까지 조회할 수 있다. 권한 부족은 403 FORBIDDEN, 인증 오류는 401 UNAUTHORIZED, 형식 오류는 400 BAD_REQUEST, 데이터 부재는 404 NOT_FOUND 로 응답되고, 500 INTERNAL_SERVER_ERROR 는 서버 일시 장애에 해당하므로 지수 백오프 기반의 제한된 재시도와 캐시 폴백을 함께 적용한다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| name | query | string |  | 묶음배송 그룹 이름. LIKE '묶음배송 그룹 이름%' 검색 |
| baseGroup | query | boolean |  | 기본 그룹 여부 |
| usable | query | boolean |  | 사용 여부 |
| page | query | integer(int32) |  | 페이지 번호. 첫 번째 페이지 번호는 1입니다. |
| size | query | integer(int32) |  | 페이지 크기. 페이지당 100건까지 조회할 수 있습니다. |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| contents | - | array |  |  |
| contents.id | - | integer(int64) |  | 등록 요청인 경우에는 입력값이 무시됩니다. |
| contents.name | - | string | 필수 |  |
| contents.usable | - | boolean | 필수 | 기본 그룹인 경우 자동으로 true로 설정됩니다. |
| contents.baseGroup | - | boolean | 필수 | 기본 그룹으로 지정 여부. 미입력 시 false로 설정됩니다. |
| contents.deliveryFeeChargeMethodType | - | string | 필수 | 묶음배송 그룹 등록 시 배송비 계산 방식을 입력하기 위한 코드입니다.<br>- MIN(묶음배송 그룹에서 가장 작은 배송비로 부과), MAX(묶음배송 그룹에서 가장 큰 배송비로 부과). 허용값: `MIN`, `MAX` |
| contents.deliveryFeeByArea | - | object |  | 지역별 추가 배송비 |
| contents.deliveryFeeByArea.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |
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

- 응답 `contents[].deliveryFeeChargeMethodType`: `MIN`, `MAX`
- 응답 `contents[].deliveryFeeByArea.deliveryAreaType`: `AREA_2`, `AREA_3`
- 응답 `sort.fields[].direction`: `ASC`, `DESC`

### 호출 예시

```bash
curl -X GET 'https://api.commerce.naver.com/external/v1/product-delivery-info/bundle-groups' \
  -H 'Authorization: Bearer {access_token}'
```
