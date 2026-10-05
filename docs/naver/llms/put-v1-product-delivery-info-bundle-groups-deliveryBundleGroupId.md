---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/update-delivery-bundle-group-product
---
# PUT /v1/product-delivery-info/bundle-groups/{deliveryBundleGroupId} - 묶음배송 그룹 수정

이 API는 이미 등록된 묶음배송 그룹을 deliveryBundleGroupId 기준으로 수정할 때 사용하는 v1 상품 배송 정보 엔드포인트입니다. 요청 본문은 deliveryBundleGroup 객체를 통해 그룹 설정을 갱신하며, 수정 가능한 항목은 그룹명·사용 여부(usable)·기본 그룹 여부(baseGroup)·배송비 계산 방식(deliveryFeeChargeMethodType=MIN/MAX)·지역별 추가 배송비(deliveryFeeByArea) 등입니다. baseGroup 이 true 면 usable 은 자동으로 true 로 설정됩니다. 묶음배송 그룹은 동일 그룹에 묶인 여러 상품을 한 번의 결제 흐름으로 배송할 때 적용할 그룹 단위 배송비 규칙을 정의하므로, MIN(가장 작은 배송비) 또는 MAX(가장 큰 배송비) 변경은 묶음 주문의 실결제 금액에 즉시 영향을 줍니다. 일반적인 사용 사례는 시즌별 프로모션이나 권역별 정책 변경에 맞춰 추가 배송비·과금 방식을 일괄 조정하거나, 기본 그룹 위치를 다른 그룹으로 이전하는 것입니다. 호출 시 한 판매자 내에서 기본 그룹은 한 개만 유지되어야 하므로 baseGroup 변경은 다른 그룹의 기본 여부와의 정합성을 확인한 뒤 수행하고, 묶음 그룹에 이미 다수 상품이 연결되어 있을 때는 변경이 광범위한 결제 영향을 가져올 수 있으므로 사전 영향도 확인이 필요합니다. 400 은 본문 누락·enum 오류, 401/403 은 토큰·권한, 404 는 존재하지 않는 그룹 ID, 500 은 일시 장애로 보고 입력 재검증 또는 백오프 재시도를 적용합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| deliveryBundleGroupId | path | integer(int64) | 필수 |  |

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
curl -X PUT 'https://api.commerce.naver.com/external/v1/product-delivery-info/bundle-groups/{deliveryBundleGroupId}' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```
