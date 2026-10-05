---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/get-delivery-bundle-group-product
---
# GET /v1/product-delivery-info/bundle-groups/{deliveryBundleGroupId} - 묶음배송 그룹 단건 조회

상품 배송 정보 도메인에서 묶음배송 그룹 한 건의 상세 정보를 단건 조회하는 API 로, 다건 조회로 식별한 그룹의 정확한 설정값을 확인하고 후속 수정 또는 상품 매핑 흐름으로 이어갈 때 사용한다. 응답은 deliveryBundleGroup 구조체에 그룹의 운영 정책 전반을 담아 한 번에 노출한다. 일반적인 사용 흐름은 본 API 로 상세를 확인하고 그룹 수정 API 로 정책을 갱신하거나 상품 등록 페이로드에 deliveryBundleGroupId 를 매핑해 묶음배송 대상으로 편입시키는 형태이다. deliveryBundleGroupId 경로 파라미터는 필수이며, 잘못된 형식은 400 BAD_REQUEST, 존재하지 않는 그룹은 404 NOT_FOUND 로 응답된다. 권한 부족은 403 FORBIDDEN, 인증 오류는 401 UNAUTHORIZED 로 분리되고, 500 INTERNAL_SERVER_ERROR 는 서버 일시 장애로 간주해 지수 백오프 기반의 제한된 재시도만 적용한다. 리다이렉션이 필요한 경우 308 응답이 반환될 수 있으므로 클라이언트는 Location 헤더를 따라가도록 처리한다. 그룹 메타는 변경 빈도가 낮은 편이므로 상세를 짧은 TTL 로 캐시해 호출량을 줄이는 정책을 함께 고려할 수 있다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| deliveryBundleGroupId | path | integer(int64) | 필수 | 묶음배송 그룹 ID |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| deliveryBundleGroup | - | object |  | 묶음배송 그룹 정보.<br>이 구조체는 상품의 배송 정보 중 묶음배송 그룹 정보 데이터를 표현하는 구조체입니다.<br>- 이 구조체는 API 호출에 대한 요청/응답 모두에서 사용합니다.<br>- 구조체의 객체 1개는 묶음배송 그룹 1개를 표현합니다.<br>- 이 구조체는 아래 API에서 사용합니다.<br>  - 묶음배송 그룹 다건 조회, 묶음배송 그룹 등록, 묶음배송 그룹 단건 조회, 묶음배송 그룹 수정 |
| deliveryBundleGroup.id | - | integer(int64) |  | 등록 요청인 경우에는 입력값이 무시됩니다. |
| deliveryBundleGroup.name | - | string | 필수 |  |
| deliveryBundleGroup.usable | - | boolean | 필수 | 기본 그룹인 경우 자동으로 true로 설정됩니다. |
| deliveryBundleGroup.baseGroup | - | boolean | 필수 | 기본 그룹으로 지정 여부. 미입력 시 false로 설정됩니다. |
| deliveryBundleGroup.deliveryFeeChargeMethodType | - | string | 필수 | 묶음배송 그룹 등록 시 배송비 계산 방식을 입력하기 위한 코드입니다.<br>- MIN(묶음배송 그룹에서 가장 작은 배송비로 부과), MAX(묶음배송 그룹에서 가장 큰 배송비로 부과). 허용값: `MIN`, `MAX` |
| deliveryBundleGroup.deliveryFeeByArea | - | object |  | 지역별 추가 배송비 |
| deliveryBundleGroup.deliveryFeeByArea.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |

### 에러 코드

| 상태 코드 | 설명 |
|-----------|------|
| 400 | 잘못된 요청<br/>- code : BAD_REQUEST |
| 401 | 인가되지 않은 요청<br/>- code : UNAUTHORIZED |
| 403 | 권한 없음<br/>- code : FORBIDDEN |
| 404 | 데이터 없음<br/>- code : NOT_FOUND |
| 500 | 내부 서버 오류<br/>- code : INTERNAL_SERVER_ERROR |

### 사용 enum 카탈로그

- 응답 `deliveryBundleGroup.deliveryFeeChargeMethodType`: `MIN`, `MAX`
- 응답 `deliveryBundleGroup.deliveryFeeByArea.deliveryAreaType`: `AREA_2`, `AREA_3`

### 호출 예시

```bash
curl -X GET 'https://api.commerce.naver.com/external/v1/product-delivery-info/bundle-groups/{deliveryBundleGroupId}' \
  -H 'Authorization: Bearer {access_token}'
```
