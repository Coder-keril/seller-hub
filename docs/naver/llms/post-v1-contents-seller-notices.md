---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/create-post-contents
---
# POST /v1/contents/seller-notices - 공지사항 등록

공지사항 등록 API는 스마트스토어 운영자가 스토어 또는 특정 상품에 노출할 공지사항을 신규 등록하기 위한 엔드포인트로, 일반·이벤트·배송 지연·상품 카테고리 유형(postCategoryType) 과 함께 노출 기간(displayStartDate·displayEndDate)·중요 공지 기간(importantNoticeStartDate·importantNoticeEndDate)·팝업 기간(popupStartDate·popupEndDate) 을 지정해 동작을 제어합니다. 중요 공지(importantNotice) 와 팝업(popup) 은 각각의 시작·종료 일시 입력이 true 설정 이후에만 유효하며, 시각은 시작 일시가 입력한 시각의 00분, 종료 일시가 59분으로 저장되고 모든 일시는 KST 기준으로 표시됩니다. 전체 공지사항(wholeNotice) 과 팝업 공지사항은 각각 1건만 등록 가능하므로 신규 등록 시 기존에 설정되어 있던 동일 유형 공지가 자동으로 해제되며, 운영 정책상 이를 인지하고 사용자에게 안내하거나 사전 백업을 권장합니다. title 과 detailContents 는 필수이므로 누락 시 400 BAD_REQUEST 가 반환되고, postCategoryType 미입력 시 ORDINARY 로 기본 저장됩니다. 응답으로 반환되는 sellerNoticeId 는 후속 수정·삭제 호출과 상품-공지사항 매핑(채널 상품의 bbsSeq 등) 에서 참조되므로 저장해 두는 것이 안전합니다. 401·403 응답은 토큰 재발급·권한 확인으로 대응하고, 500 응답은 일시 장애로 간주해 지수 백오프 재시도를 적용합니다.

> Base URL: https://api.commerce.naver.com/external

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
curl -X POST 'https://api.commerce.naver.com/external/v1/contents/seller-notices' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```