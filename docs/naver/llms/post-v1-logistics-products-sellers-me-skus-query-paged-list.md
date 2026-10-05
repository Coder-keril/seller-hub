---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/get-ns-information-paged-list-nfa-product
---
# POST /v1/logistics/products/sellers/me/skus/query-paged-list - 네이버 SKU 목록 조회

이 API는 판매자 본인 계정에 등록된 네이버 SKU 목록을 페이지 단위로 조회할 때 사용합니다. 상품 운영 중 특정 조건에 맞는 SKU를 찾아 상세 정보 확인, 재고·가격·노출 상태 점검, 외부 시스템과의 동기화 대상 선별 같은 시나리오에 활용됩니다. 조회 결과는 페이지 기반으로 제공되므로 연속 조회가 필요하면 다음 페이지를 순차적으로 요청하고, 중복 조회나 무한 반복을 피하도록 종료 조건을 명확히 두는 것이 좋습니다. 요청은 판매자 본인(me) 범위에 한정되므로 적절한 인증/권한이 없는 경우 조회가 제한될 수 있습니다. 400 응답이 반환되면 요청 조건이나 형식 오류 가능성이 높으니 입력 값과 조회 조건 조합을 재검증해야 합니다. 404는 접근 대상이 없거나 유효하지 않은 경로/자원으로 요청된 경우일 수 있으므로 요청 환경과 접근 범위를 확인하세요. 500은 일시적 서버 오류일 수 있어 재시도하되, 동일 증상이 반복되면 요청 식별 정보와 함께 지원 채널로 문의하는 것을 권장합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 본문

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| searchKeywordType | body | string |  | 검색 키워드 타입<br>- NS_ID: SKU ID로 검색<br>- BARCODE: 바코드 번호로 검색 |
| nsIds | body | array |  | SKU ID 목록. 재고 구분을 위해 네이버에서 채번한 고유 SKU 관리 코드입니다.<br>- 영문/숫자 조합, 영문 대/소문자 구분, SKU ID당 최대 20자 |
| nsBarcodes | body | array |  | SKU 바코드 번호 목록. SKU에 부착된 바코드 번호입니다.<br>- 영문/숫자/공백/하이픈(-)/언더스코어(_)/온점(.) 조합 가능, 영문 대/소문자 구분, 최대 100자 |
| periodType | body | string |  | 검색 기간 유형<br>- SKU_REG_DAY: SKU 등록일을 기준으로 조회<br>- SKU_MOD_DAY: SKU 수정일을 기준으로 조회 |
| fromDate | body | string |  | 검색 기간 시작일<br>- 'yyyy-MM-dd' 형식으로 입력 |
| toDate | body | string |  | 검색 기간 종료일<br>- 'yyyy-MM-dd' 형식으로 입력 |
| page | body | number |  | 페이지 번호. 첫 번째 페이지 번호는 1입니다.. 1 이상 100000 이하 |
| size | body | number |  | 페이지 크기. 페이지당 최대 500건까지 조회할 수 있으며, 총 10만 건까지 조회할 수 있습니다.. 1 이상 500 이하 |
| orderType | body | string |  | 정렬 기준.<br>- MODIFICATION(SKU 수정일순), REGISTRATION(SKU 등록일순) |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| content | - | array | 필수 | SKU 목록<br>- 조회 조건에 해당하는 SKU 정보가 존재하지 않는 경우, 빈 값(empty array)으로 전달합니다.. 항목 0~500개 |
| content.nsId | - | string | 필수 | SKU ID |
| content.nsName | - | string |  | SKU 이름 |
| content.nsBarcode | - | string |  | SKU 바코드 번호 |
| content.storageTemperature | - | string |  | 재고 보관 온도<br>\| 코드 \| 설명 \|<br>\|-----\|-----\|<br>\| DRY \| 상온 \|<br>\| WET \| 냉장 \|<br>\| FROZEN \| 냉동 \|. 허용값: `DRY`, `WET`, `FROZEN` |
| content.shelfLifeManagement | - | boolean |  | 소비기한 관리 여부 |
| content.lotNoManagement | - | boolean |  | 로트번호 관리 여부 |
| content.nsMappingCount | - | integer(int32) | 필수 | SKU ID에 연결된 판매 상품의 수 |
| content.registrationYmdt | - | string(date-time) | 필수 | SKU 정보가 등록된 최초 일시. KST(UTC+09:00)로 응답합니다. |
| content.modificationYmdt | - | string(date-time) | 필수 | SKU 정보가 변경된 최종 일시. KST(UTC+09:00)로 응답합니다. |
| totalPages | - | integer(int32) | 필수 | 전체 페이지 수. 최소 0 |
| totalElements | - | integer(int64) | 필수 | 전체 SKU 수. 최소 0 |
| page | - | integer(int32) | 필수 | 페이지 번호. 최소 1 |
| size | - | integer(int32) | 필수 | 페이지 크기. 최소 0 |
| sort | - | string | 필수 | 정렬 기준<br>\| 코드            \| 설명             \|<br>\|----------------\|-----------------\|<br>\| MODIFICATION       \| SKU 수정 일시     \|<br>\| REGISTRATION    \| SKU 등록 일시     \| |
| first | - | boolean | 필수 | 첫 번째 페이지 여부 |
| last | - | boolean | 필수 | 마지막 페이지 여부 |

### 에러 코드

| 상태 코드 | 설명 |
|-----------|------|
| 400 | Bad Request |
| 404 | Not Found |
| 500 | API 처리 중 오류 발생<br>- `code`: **server_error** |

### 사용 enum 카탈로그

- 응답 `content[].storageTemperature`: `DRY`, `WET`, `FROZEN`

### 호출 예시

```bash
curl -X POST 'https://api.commerce.naver.com/external/v1/logistics/products/sellers/me/skus/query-paged-list' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```
