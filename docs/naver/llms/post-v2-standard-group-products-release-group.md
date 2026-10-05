---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/release-standard-group-product-product
---
# POST /v2/standard-group-products/release-group - (v2) 그룹상품 해제

이 API는 등록·전환을 통해 묶여 있는 v2 표준형 그룹상품을 해제하여 각 원상품을 다시 개별 상품으로 분리할 때 사용하는 엔드포인트입니다. 한 번의 호출로 최대 10 개의 그룹상품을 처리할 수 있으며, 그룹 전체를 해제하거나(originProductNos 미입력) originProductNos 를 명시해 그룹에서 특정 원상품만 분리하는 부분 해제가 가능합니다. 원상품번호 합계는 총 2,000 개까지 입력할 수 있으며, 입력한 원상품번호가 함께 입력한 standardGroupProductNo 에 속하지 않으면 요청이 실패하므로 그룹과 원상품의 소속 관계를 사전에 확인해야 합니다. releaseReasonType 으로 그룹 오설정·판매 옵션 추가/수정 필요·단위 부재·희망 옵션 부재·N배송 재고 연동 이슈·운영 불편·기타 같은 사유를 분류해 전달하고 releaseDetailReason 에 최대 500자까지 상세 사유를 보강할 수 있습니다. 일반적인 사용 사례는 그룹 운영 중 옵션 구성을 변경해야 하거나 일부 원상품만 별도 운영하고자 할 때 부분 해제로 분리하고, 그룹 전체 구조를 재설계해야 할 때 전체 해제 후 재등록하는 흐름이며, 해제된 원상품은 그룹 소속이 풀려 단일 원상품 상태로 돌아오므로 가격·재고·노출 정책이 그룹 단위에서 개별 단위로 분리되는 점을 인지해야 합니다. 400 은 그룹/원상품 소속 불일치·입력 한도 초과, 401/403 은 토큰·권한, 404 는 대상 그룹상품 미존재, 500 은 일시 장애로 보고 입력 재검증 또는 백오프 재시도를 적용합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 본문

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| targets | body | array | 필수 | 그룹 해제 대상 그룹상품 목록입니다.<br>한 번에 최대 10개의 그룹상품을 그룹 해제할 수 있습니다.<br>그룹 해제 대상 원상품번호는 총합 최대 2,000개까지 입력할 수 있습니다. |
| targets.standardGroupProductNo | body | integer(int64) | 필수 | 그룹 해제 대상 그룹상품번호입니다. |
| targets.originProductNos | body | array |  | 그룹 해제 대상 원상품번호 목록입니다.<br>- 원상품번호 입력 시, 그룹 내에서 해당 원상품만 그룹 해제됩니다. 이때 원상품번호는 함께 입력한 그룹상품번호(standardGroupProductNo)에 속해야 하며, 속하지 않은 경우 요청이 실패합니다.<br>- 원상품번호 미입력 시, 입력한 그룹상품번호에 속한 모든 원상품이 그룹 해제됩니다. |
| targets.originProductNos.… | body | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| releaseReasonType | body | string |  | 그룹 해제 사유 코드입니다.<br>\| 코드 \| 설명 \| 비고 \|<br>\| --- \| --- \| --- \|<br>\| GROUP_CONFIG_ERROR \| 그룹 오설정 \| - \|<br>\| ADD_PURCHASE_OPTION \| 판매 옵션 추가 필요 \| - \|<br>\| EDIT_PURCHASE_OPTION \| 판매 옵션 수정 필요 \| - \|<br>\| NO_UNIT_VALUE \| 해당하는 단위가 없음 \| - \|<br>\| NO_DESIRED_OPTION \| 희망하는 판매 옵션이 없음 \| - \|<br>\| STOCK_SYNC_ISSUE \| N배송 재고 연동이 어려움 \| - \|<br>\| SUSTAINING_ISSUE \| 운영하기가 불편함 \| - \|<br>\| ETC \| 기타 \| - \| |
| releaseDetailReason | body | string |  | 그룹 해제 사유에 대한 추가 설명이 필요한 경우 입력합니다.<br>최대 500자까지 입력할 수 있습니다. |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| results | - | array |  |  |
| results.standardGroupProductNo | - | integer(int64) |  |  |
| results.originProducts | - | array |  |  |
| results.originProducts.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |

### 에러 코드

| 상태 코드 | 설명 |
|-----------|------|
| 400 | 잘못된 요청<br/>- code : BAD_REQUEST |
| 401 | 인가되지 않은 요청<br/>- code : UNAUTHORIZED |
| 403 | 권한 없음<br/>- code : FORBIDDEN |
| 404 | 데이터 없음<br/>- code : NOT_FOUND |
| 500 | 내부 서버 오류<br/>- code : INTERNAL_SERVER_ERROR |

### 호출 예시

```bash
curl -X POST 'https://api.commerce.naver.com/external/v2/standard-group-products/release-group' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```