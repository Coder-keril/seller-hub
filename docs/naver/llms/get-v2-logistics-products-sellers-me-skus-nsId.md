---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/get-ns-detail-nfa-product
---
# GET /v2/logistics/products/sellers/me/skus/{nsId} - (v2) SKU 조회 V2

이 엔드포인트는 로그인된 판매자 계정 기준으로 특정 SKU(NS ID)를 조회해, 물류/상품 운영에 필요한 SKU 기본 정보를 확인할 때 사용합니다. SKU 상세 화면 구성, 주문·출고 처리 전 SKU 존재 여부 검증, 내부 시스템의 SKU 동기화 등에서 일반적으로 호출됩니다. 요청 경로의 NS ID는 판매자 소유 SKU에 해당해야 하며, 권한이 없거나 대상이 존재하지 않으면 정상적으로 조회되지 않을 수 있습니다. 400 응답이 반환되면 식별자 형식 오류나 필수 값 누락 등 요청 자체의 문제를 먼저 점검하고, 수정 후 재시도하는 방식으로 처리합니다. 404 응답은 SKU가 없거나 접근 가능한 범위에 존재하지 않는 경우이므로 식별자와 판매자 범위를 재확인해야 합니다. 500 응답은 일시적인 서버 오류일 수 있으니 동일 요청을 무한 반복하지 말고 재시도 간격을 두거나, 지속될 경우 장애로 분류해 모니터링 및 문의로 전환하는 것을 권장합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| nsId | path | string | 필수 | 조회하고자 하는 SKU ID. 재고 구분을 위해 네이버에서 채번한 고유 SKU 관리 코드입니다.<br>- 영문/숫자 조합, 영문 대/소문자 구분, SKU ID당 최대 20자. 길이 1~20자, 패턴: ^\S(?:.*\S)?$ |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| nsId | - | string | 필수 | SKU ID. 재고 구분을 위해 네이버에서 채번한 고유 SKU 값입니다.<br>- 영문/숫자 조합, 영문 대/소문자 구분, SKU ID당 최대 20자 구성 |
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
| collectRequired | - | boolean |  | 상품 자동 수거 |
| defectiveInventoryTreatmentType | - | string |  | 하자 재고 처리. 허용값: `RETURN`, `DISPOSAL` |
| refurbish | - | boolean |  | 등급화 재공급(리퍼브) |
| inspectionType | - | string |  | 검품 방식. 허용값: `GENERAL`, `FASHION` |
| normalInventoryTreatmentType | - | string |  | 정상 재고 처리. 허용값: `RESELL`, `RETURN`, `DISPOSAL` |
| reconditionTreatmentType | - | string |  | 박스 재포장. 허용값: `NONE`, `GENERAL`, `BRAND` |
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
- 응답 `defectiveInventoryTreatmentType`: `RETURN`, `DISPOSAL`
- 응답 `inspectionType`: `GENERAL`, `FASHION`
- 응답 `normalInventoryTreatmentType`: `RESELL`, `RETURN`, `DISPOSAL`
- 응답 `reconditionTreatmentType`: `NONE`, `GENERAL`, `BRAND`

### 호출 예시

```bash
curl -X GET 'https://api.commerce.naver.com/external/v2/logistics/products/sellers/me/skus/{nsId}' \
  -H 'Authorization: Bearer {access_token}'
```
