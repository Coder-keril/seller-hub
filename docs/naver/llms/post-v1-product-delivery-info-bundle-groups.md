---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/create-delivery-bundle-group-product
---
# POST /v1/product-delivery-info/bundle-groups - 묶음배송 그룹 등록

묶음배송 그룹 등록 API는 동일한 배송 정책으로 묶어 출고하기 위한 묶음배송 그룹을 신규 등록하기 위한 엔드포인트로, 그룹 이름·사용 여부(usable)·기본 그룹 지정 여부(baseGroup)·배송비 계산 방식(deliveryFeeChargeMethodType: MIN/MAX)·지역별 추가 배송비(deliveryFeeByArea) 를 지정합니다. 등록 응답으로 반환되는 groupId 는 상품 등록·수정 시 deliveryBundleGroup 등에 참조되어, 묶음배송이 적용되는 다수의 상품을 하나의 그룹으로 운영할 수 있게 합니다. 기본 그룹(baseGroup) 으로 지정된 경우 usable 은 자동으로 true 로 설정되며, 기본 그룹은 계정당 1건만 유지되므로 신규 기본 그룹을 등록하면 기존 기본 그룹이 자동으로 해제되는 점을 운영자에게 안내해야 안전합니다. deliveryFeeChargeMethodType 은 그룹 내 가장 작은 배송비를 부과하는 MIN, 가장 큰 배송비를 부과하는 MAX 중 정책에 맞는 값을 사용하며, 잘못된 enum 값이나 필수 필드(name·usable·baseGroup·deliveryFeeChargeMethodType) 누락 시 400 BAD_REQUEST 가 반환됩니다. 동일한 이름의 그룹을 중복 등록하거나 동일 페이로드를 재시도하면 별도 그룹이 추가 생성될 수 있으므로, 네트워크 타임아웃 시 재시도 전에 묶음배송 그룹 다건 조회 API 로 등록 여부를 먼저 확인하는 것이 안전합니다. 401·403 응답은 토큰 재발급·권한 확인으로 대응하고, 500 응답은 일시 장애로 간주해 지수 백오프 재시도를 적용합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 본문

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| deliveryBundleGroup | body | object | 필수 | 묶음배송 그룹 정보.<br>이 구조체는 상품의 배송 정보 중 묶음배송 그룹 정보 데이터를 표현하는 구조체입니다.<br>- 이 구조체는 API 호출에 대한 요청/응답 모두에서 사용합니다.<br>- 구조체의 객체 1개는 묶음배송 그룹 1개를 표현합니다.<br>- 이 구조체는 아래 API에서 사용합니다.<br>  - 묶음배송 그룹 다건 조회, 묶음배송 그룹 등록, 묶음배송 그룹 단건 조회, 묶음배송 그룹 수정 |
| deliveryBundleGroup.id | body | integer(int64) |  | 등록 요청인 경우에는 입력값이 무시됩니다. |
| deliveryBundleGroup.name | body | string | 필수 |  |
| deliveryBundleGroup.usable | body | boolean | 필수 | 기본 그룹인 경우 자동으로 true로 설정됩니다. |
| deliveryBundleGroup.baseGroup | body | boolean | 필수 | 기본 그룹으로 지정 여부. 미입력 시 false로 설정됩니다. |
| deliveryBundleGroup.deliveryFeeChargeMethodType | body | string | 필수 | 묶음배송 그룹 등록 시 배송비 계산 방식을 입력하기 위한 코드입니다.<br>- MIN(묶음배송 그룹에서 가장 작은 배송비로 부과), MAX(묶음배송 그룹에서 가장 큰 배송비로 부과). 허용값: `MIN`, `MAX` |
| deliveryBundleGroup.deliveryFeeByArea | body | object |  | 지역별 추가 배송비 |
| deliveryBundleGroup.deliveryFeeByArea.… | body | - |  | 하위 구조 생략 (상세는 OAS 참조) |

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

- 요청 본문 `deliveryBundleGroup.deliveryFeeChargeMethodType`: `MIN`, `MAX`
- 요청 본문 `deliveryBundleGroup.deliveryFeeByArea.deliveryAreaType`: `AREA_2`, `AREA_3`

### 호출 예시

```bash
curl -X POST 'https://api.commerce.naver.com/external/v1/product-delivery-info/bundle-groups' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```
