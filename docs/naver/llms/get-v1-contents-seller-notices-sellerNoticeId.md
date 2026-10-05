---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/get-post-contents
---
# GET /v1/contents/seller-notices/{sellerNoticeId} - 공지사항 단건 조회

상품 공지사항 도메인에서 특정 공지사항의 상세 정보를 단건 조회하는 API 로, 목록 조회로 식별한 공지의 세부 본문과 노출 정책을 확인할 때 사용한다. 응답에는 title, detailContents 와 함께 중요 공지(importantNotice)·전체 공지(wholeNotice)·팝업(popup) 여부와 각각의 노출 시작·종료 일시(KST 기준)가 포함되어, 현재 어떤 형태로 사용자에게 노출되고 있는지 판별하는 근거가 된다. 일반적인 사용 흐름은 본 API 로 상세를 확인한 뒤 수정·삭제 API 를 호출하거나 채널 상품에 공지를 적용·해제하는 후속 동작으로 이어진다. sellerNoticeId 경로 파라미터에는 대상 공지의 식별자를 정확히 전달해야 하고, 잘못된 형식은 400 BAD_REQUEST, 존재하지 않는 ID 는 404 NOT_FOUND 로 응답된다. 권한 부족은 403 FORBIDDEN, 인증 오류는 401 UNAUTHORIZED 로 분리되며, 500 INTERNAL_SERVER_ERROR 는 일시 장애로 간주해 지수 백오프 기반의 제한된 재시도만 적용한다. 일자 필드는 KST 로 반환되므로 타임존을 다루는 클라이언트에서는 표시 시점에 변환 정책을 명확히 두는 것이 좋다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| sellerNoticeId | path | integer(int64) | 필수 | 공지사항 ID |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| sellerNoticeId | - | integer(int64) |  |  |
| postCategoryType | - | string |  | - ORDINARY(일반), EVENT(이벤트), DELIVERY(배송 지연), PRODUCT(상품)<br>- 미입력 시 `ORDINARY(일반)` 유형으로 등록됩니다.. 허용값: `ORDINARY`, `EVENT`, `DELIVERY`, `PRODUCT` |
| title | - | string | 필수 |  |
| importantNotice | - | boolean |  | 중요 공지사항으로 등록 가능합니다. 미입력 시 false로 저장됩니다. |
| importantNoticeStartDate | - | string(date-time) |  | - 공지사항 등록/수정 시: 입력한 시각의 00분으로 설정됩니다. <br>   - 중요 공지사항 여부를 true로 설정 후 입력이 가능 합니다.   <br> - 공지사항 조회 시: KST 기준으로 출력됩니다. |
| importantNoticeEndDate | - | string(date-time) |  | - 공지사항 등록/수정 시: 입력한 시각의 59분으로 설정됩니다. <br>   - 중요 공지사항 여부를 true로 설정 후 입력이 가능 합니다.   <br> - 공지사항 조회 시: KST 기준으로 출력됩니다. |
| wholeNotice | - | boolean |  | 전체 공지사항으로 등록 가능합니다. 단, 기존에 설정되어 있던 전체 공지사항은 해제됩니다(1건만 등록 가능). 미입력 시 false로 저장됩니다. |
| displayStartDate | - | string(date-time) |  | - 공지사항 등록/수정 시: 입력한 시각의 00분으로 설정됩니다. <br>   - 미입력 시 현재 시각의 00분으로 저장됩니다.(예: 2022-09-02 16:00:00) <br> - 공지사항 조회 시: KST 기준으로 출력됩니다. |
| displayEndDate | - | string(date-time) |  | - 공지사항 등록/수정 시: 입력한 시각의 59분으로 설정됩니다. <br>   - 공지사항 조회 시: KST 기준으로 출력됩니다. |
| popup | - | boolean |  | 스토어의 팝업 여부를 나타냅니다. 단, 기존에 설정되어 있던 팝업 공지사항은 해제됩니다(1건만 등록 가능). 미입력 시 false로 저장됩니다. |
| popupStartDate | - | string(date-time) |  | - 공지사항 등록/수정 시: 입력한 시각의 00분으로 설정됩니다. <br>   - 팝업 여부를 true로 설정 후 팝업 시작 일시 미입력 시 현재 시각의 00분으로 저장됩니다.(예: 2022-09-02 16:00:00) <br> - 공지사항 조회 시: KST 기준으로 출력됩니다. |
| popupEndDate | - | string(date-time) |  | - 공지사항 등록/수정 시: 입력한 시각의 59분으로 설정됩니다. <br>   - 팝업 여부를 true로 설정 후 팝업 종료 일시 미입력 시 일주일 후 현재 시각의 59분으로 저장됩니다.(예: 2022-09-09 16:59:59) <br> - 공지사항 조회 시: KST 기준으로 출력됩니다. |
| detailContents | - | string | 필수 |  |

### 에러 코드

| 상태 코드 | 설명 |
|-----------|------|
| 400 | 잘못된 요청<br>- code : BAD_REQUEST |
| 500 | 내부 서버 오류<br>- code : INTERNAL_SERVER_ERROR |
| 401 | 인가되지 않은 요청<br>- code : UNAUTHORIZED |
| 403 | 권한 없음<br>- code : FORBIDDEN |
| 404 | 데이터 없음<br>- code : NOT_FOUND |

### 사용 enum 카탈로그

- 응답 `postCategoryType`: `ORDINARY`, `EVENT`, `DELIVERY`, `PRODUCT`

### 호출 예시

```bash
curl -X GET 'https://api.commerce.naver.com/external/v1/contents/seller-notices/{sellerNoticeId}' \
  -H 'Authorization: Bearer {access_token}'
```