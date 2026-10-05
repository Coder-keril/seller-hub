---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/update-post-contents
---
# PUT /v1/contents/seller-notices/{sellerNoticeId} - 공지사항 수정

이 API는 이미 등록된 판매자 공지사항을 sellerNoticeId 기준으로 수정할 때 사용하는 v1 엔드포인트입니다. 수정 가능한 항목은 카테고리 유형(ORDINARY/EVENT/DELIVERY/PRODUCT)·제목·상세 콘텐츠·중요 공지 여부와 노출 기간·전체 공지 여부·팝업 여부와 팝업 기간이며, 모든 일시는 시작 시 00 분·종료 시 59 분으로 강제됩니다. wholeNotice 또는 popup 을 true 로 변경하면 동일 스토어에 등록된 기존 전체 공지·팝업 공지는 자동 해제되어 1 건만 활성 상태가 되므로, 다른 운영자가 동시에 변경하지 않도록 작업 순서를 정리해야 합니다. importantNotice·popup 같은 부가 속성은 true 로 설정한 경우에만 해당 시작/종료 일시 값이 의미를 가지므로 false 로 전환할 때는 일시 값도 일관되게 정리하는 것이 좋습니다. 일반적인 사용 사례는 이벤트·배송 지연·상품 점검 등 운영 이벤트가 변경될 때 기존 공지의 본문과 노출 기간을 갱신해 재발행 없이 한 게시물로 운영하는 것입니다. 응답으로는 수정된 sellerNoticeId 가 반환되며, 이후 채널 상품 공지사항 적용 API 와 연동해 특정 상품에 공지를 적용·해제하는 흐름에서도 동일한 ID 를 사용합니다. 400 은 본문 누락·일시 범위 오류, 401/403 은 토큰·권한, 404 는 존재하지 않는 sellerNoticeId, 500 은 일시 장애로 보고 입력 재검증 또는 백오프 재시도를 적용합니다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| sellerNoticeId | path | integer(int64) | 필수 | 공지사항 ID |

### 요청 본문

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| sellerNoticeId | body | integer(int64) |  |  |
| postCategoryType | body | string |  | - ORDINARY(일반), EVENT(이벤트), DELIVERY(배송 지연), PRODUCT(상품)<br>- 미입력 시 `ORDINARY(일반)` 유형으로 등록됩니다.. 허용값: `ORDINARY`, `EVENT`, `DELIVERY`, `PRODUCT` |
| title | body | string | 필수 |  |
| importantNotice | body | boolean |  | 중요 공지사항으로 등록 가능합니다. 미입력 시 false로 저장됩니다. |
| importantNoticeStartDate | body | string(date-time) |  | - 공지사항 등록/수정 시: 입력한 시각의 00분으로 설정됩니다. <br>   - 중요 공지사항 여부를 true로 설정 후 입력이 가능 합니다.   <br> - 공지사항 조회 시: KST 기준으로 출력됩니다. |
| importantNoticeEndDate | body | string(date-time) |  | - 공지사항 등록/수정 시: 입력한 시각의 59분으로 설정됩니다. <br>   - 중요 공지사항 여부를 true로 설정 후 입력이 가능 합니다.   <br> - 공지사항 조회 시: KST 기준으로 출력됩니다. |
| wholeNotice | body | boolean |  | 전체 공지사항으로 등록 가능합니다. 단, 기존에 설정되어 있던 전체 공지사항은 해제됩니다(1건만 등록 가능). 미입력 시 false로 저장됩니다. |
| displayStartDate | body | string(date-time) |  | - 공지사항 등록/수정 시: 입력한 시각의 00분으로 설정됩니다. <br>   - 미입력 시 현재 시각의 00분으로 저장됩니다.(예: 2022-09-02 16:00:00) <br> - 공지사항 조회 시: KST 기준으로 출력됩니다. |
| displayEndDate | body | string(date-time) |  | - 공지사항 등록/수정 시: 입력한 시각의 59분으로 설정됩니다. <br>   - 공지사항 조회 시: KST 기준으로 출력됩니다. |
| popup | body | boolean |  | 스토어의 팝업 여부를 나타냅니다. 단, 기존에 설정되어 있던 팝업 공지사항은 해제됩니다(1건만 등록 가능). 미입력 시 false로 저장됩니다. |
| popupStartDate | body | string(date-time) |  | - 공지사항 등록/수정 시: 입력한 시각의 00분으로 설정됩니다. <br>   - 팝업 여부를 true로 설정 후 팝업 시작 일시 미입력 시 현재 시각의 00분으로 저장됩니다.(예: 2022-09-02 16:00:00) <br> - 공지사항 조회 시: KST 기준으로 출력됩니다. |
| popupEndDate | body | string(date-time) |  | - 공지사항 등록/수정 시: 입력한 시각의 59분으로 설정됩니다. <br>   - 팝업 여부를 true로 설정 후 팝업 종료 일시 미입력 시 일주일 후 현재 시각의 59분으로 저장됩니다.(예: 2022-09-09 16:59:59) <br> - 공지사항 조회 시: KST 기준으로 출력됩니다. |
| detailContents | body | string | 필수 |  |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| sellerNoticeId | - | integer(int64) |  |  |

### 에러 코드

| 상태 코드 | 설명 |
|-----------|------|
| 400 | 잘못된 요청<br>- code : BAD_REQUEST |
| 500 | 내부 서버 오류<br>- code : INTERNAL_SERVER_ERROR |
| 401 | 인가되지 않은 요청<br>- code : UNAUTHORIZED |
| 403 | 권한 없음<br>- code : FORBIDDEN |
| 404 | 데이터 없음<br>- code : NOT_FOUND |

### 사용 enum 카탈로그

- 요청 본문 `postCategoryType`: `ORDINARY`, `EVENT`, `DELIVERY`, `PRODUCT`

### 호출 예시

```bash
curl -X PUT 'https://api.commerce.naver.com/external/v1/contents/seller-notices/{sellerNoticeId}' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```