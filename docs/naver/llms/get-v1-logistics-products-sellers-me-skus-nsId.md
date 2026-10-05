---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/get-ns-detail-1-nfa-product
---
# GET /v1/logistics/products/sellers/me/skus/{nsId} - 네이버 SKU 조회 (Deprecated)

이 엔드포인트는 판매자 본인의 물류 상품에 매핑된 네이버 SKU 정보를 nsId로 조회할 때 사용합니다. SKU의 등록 여부 확인, 타 시스템과의 상품 식별자 매칭, 주문·재고·정산 연동 전 사전 검증 등에서 주로 활용됩니다. nsId는 필수 식별자이므로 값이 누락되거나 형식이 올바르지 않으면 400 오류가 발생할 수 있습니다. 요청한 nsId에 해당하는 SKU가 존재하지 않거나 조회 권한 범위에 포함되지 않으면 404로 응답될 수 있으니, 연동 과정에서는 조회 실패 시 대체 식별자 확인이나 재동기화 로직을 준비하는 것이 좋습니다. 서버 내부 오류나 일시적 장애로 500이 반환될 수 있으므로, 재시도 시에는 짧은 간격의 무한 반복을 피하고 백오프를 적용해 안정적으로 처리하세요. 오류 응답이 발생하면 상태 코드에 따라 입력값 검증(400)과 리소스 존재 여부 확인(404)을 우선 수행한 뒤, 동일 증상이 지속되면 서버 오류(500)로 분류해 로그와 함께 점검하는 흐름을 권장합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| nsId | path | string | 필수 | 조회하고자 하는 SKU ID. 재고 구분을 위해 네이버에서 채번한 고유 SKU 관리 코드입니다.<br>- 영문/숫자 조합, 영문 대/소문자 구분, SKU ID당 최대 20자. 길이 1~20자 |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| nsId | - | string | 필수 | SKU ID. 재고 구분을 위해 네이버에서 채번한 고유 SKU 값입니다.<br>- 영문/숫자 조합, 영문 대/소문자 구분, SKU ID당 최대 20자 |
| nsBarcode | - | string |  | SKU 바코드 번호. SKU에 부착된 바코드 번호입니다.<br>- 영문/숫자/공백/하이픈(-)/언더스코어(_)/온점(.) 조합 가능, 영문 대/소문자 구분, 최대 100자 |
| nsName | - | string |  | SKU 이름 |
| storageTemperature | - | string |  | SKU 보관 온도. 허용값: `DRY`, `WET`, `FROZEN` |
| shelfLifeManagement | - | boolean |  | SKU 소비기한 관리 여부 |
| lotNoManagement | - | boolean |  | SKU 로트번호 관리 여부 |
| pieceWidth | - | number |  | SKU 가로 길이(cm) |
| pieceLength | - | number |  | SKU 세로 길이(cm) |
| pieceHeight | - | number |  | SKU 높이(cm) |
| pieceWeight | - | number |  | SKU 무게(kg) |
| nsType | - | string |  | SKU 유형. 허용값: `MAIN`, `FREEBIE` |
| linkedAlliances | - | array |  | 연동 물류사 목록 |
| linkedAlliances.allianceId | - | string | 필수 | SKU 정보가 연동된 물류사 ID |
| linkedAlliances.allianceLinkedYmdt | - | string(date-time) | 필수 | 물류사 SKU 정보 연동 일시. KST(UTC+09:00)로 응답합니다. |
| registrationYmdt | - | string(date-time) | 필수 | SKU 등록 일시. KST(UTC+09:00)로 응답합니다. |
| modificationYmdt | - | string(date-time) | 필수 | SKU 수정 일시. KST(UTC+09:00)로 응답합니다. |

### 에러 코드

| 상태 코드 | 설명 |
|-----------|------|
| 400 | Bad Request |
| 404 | Not Found |
| 500 | API 처리 중 오류 발생<br>- `code`: **server_error** |

### 사용 enum 카탈로그

- 응답 `storageTemperature`: `DRY`, `WET`, `FROZEN`
- 응답 `nsType`: `MAIN`, `FREEBIE`

### 호출 예시

```bash
curl -X GET 'https://api.commerce.naver.com/external/v1/logistics/products/sellers/me/skus/{nsId}' \
  -H 'Authorization: Bearer {access_token}'
```
