---
url: https://apicenter.commerce.naver.com/docs/commerce-api/current/get-posts-contents
---
# GET /v1/contents/seller-notices - 공지사항 목록 조회

상품 공지사항 도메인에서 판매자가 등록한 공지사항 목록을 페이지네이션으로 조회하는 API 로, 공지의 생애주기 중 운영 현황을 한눈에 점검하는 출발점에 해당한다. 응답은 contents 배열에 sellerNoticeId, postCategoryType(ORDINARY, EVENT, DELIVERY, PRODUCT), title, importantNotice, wholeNotice, displayStartDate/EndDate 등을 담아 일반·이벤트·배송 지연·상품 공지를 구분해 노출할 수 있도록 한다. 일반적인 운영 흐름은 본 API 로 목록을 받아 만료된 공지를 삭제하거나 중요·전체 공지로 승격할 대상을 식별하고, 단건 조회로 상세를 본 뒤 등록·수정·삭제 API 와 채널 상품 적용 흐름을 이어가는 형태이다. page 와 size 쿼리 파라미터로 페이지를 제어하며 페이지당 최대 100건까지 조회할 수 있고, 미입력 시 기본값으로 동작한다. 권한 부족은 403 FORBIDDEN, 인증 오류는 401 UNAUTHORIZED, 형식 오류는 400 BAD_REQUEST, 데이터 부재는 404 NOT_FOUND 로 분리되어 응답된다. 500 INTERNAL_SERVER_ERROR 는 서버 일시 장애로 간주하여 지수 백오프 기반의 제한된 재시도만 적용하는 것이 안전하다.

> Base URL: https://api.commerce.naver.com/external

### 요청 파라미터

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| page | query | integer(int32) |  | 페이지 번호. 첫 번째 페이지 번호는 1입니다. |
| size | query | integer(int32) |  | 페이지 크기. 페이지당 최대 100건까지 조회할 수 있습니다. |

### 응답 스키마

| 이름 | 위치 | 타입 | 필수 | 설명 |
|------|------|------|:----:|------|
| contents | - | array |  |  |
| contents.sellerNoticeId | - | integer(int64) |  |  |
| contents.postCategoryType | - | string |  | - ORDINARY(일반), EVENT(이벤트), DELIVERY(배송 지연), PRODUCT(상품)<br>- 미입력 시 `ORDINARY(일반)` 유형으로 등록됩니다.. 허용값: `ORDINARY`, `EVENT`, `DELIVERY`, `PRODUCT` |
| contents.title | - | string | 필수 |  |
| contents.importantNotice | - | boolean |  | 중요 공지사항으로 등록 가능합니다. 미입력 시 false로 저장됩니다. |
| contents.importantNoticeStartDate | - | string(date-time) |  | - 공지사항 등록/수정 시: 입력한 시각의 00분으로 설정됩니다. <br>   - 중요 공지사항 여부를 true로 설정 후 입력이 가능 합니다.   <br> - 공지사항 조회 시: KST 기준으로 출력됩니다. |
| contents.importantNoticeEndDate | - | string(date-time) |  | - 공지사항 등록/수정 시: 입력한 시각의 59분으로 설정됩니다. <br>   - 중요 공지사항 여부를 true로 설정 후 입력이 가능 합니다.   <br> - 공지사항 조회 시: KST 기준으로 출력됩니다. |
| contents.wholeNotice | - | boolean |  | 전체 공지사항으로 등록 가능합니다. 단, 기존에 설정되어 있던 전체 공지사항은 해제됩니다(1건만 등록 가능). 미입력 시 false로 저장됩니다. |
| contents.displayStartDate | - | string(date-time) |  | - 공지사항 등록/수정 시: 입력한 시각의 00분으로 설정됩니다. <br>   - 미입력 시 현재 시각의 00분으로 저장됩니다.(예: 2022-09-02 16:00:00) <br> - 공지사항 조회 시: KST 기준으로 출력됩니다. |
| contents.displayEndDate | - | string(date-time) |  | - 공지사항 등록/수정 시: 입력한 시각의 59분으로 설정됩니다. <br>   - 공지사항 조회 시: KST 기준으로 출력됩니다. |
| page | - | integer(int32) |  |  |
| size | - | integer(int32) |  |  |
| totalElements | - | integer(int64) |  |  |
| totalPages | - | integer(int32) |  |  |
| sort | - | object |  |  |
| sort.sorted | - | boolean |  |  |
| sort.fields | - | array |  |  |
| sort.fields.… | - | - |  | 하위 구조 생략 (상세는 OAS 참조) |
| first | - | boolean |  |  |
| last | - | boolean |  |  |

### 에러 코드

| 상태 코드 | 설명 |
|-----------|------|
| 400 | 잘못된 요청<br>- code : BAD_REQUEST |
| 500 | 내부 서버 오류<br>- code : INTERNAL_SERVER_ERROR |
| 401 | 인가되지 않은 요청<br>- code : UNAUTHORIZED |
| 403 | 권한 없음<br>- code : FORBIDDEN |
| 404 | 데이터 없음<br>- code : NOT_FOUND |

### 사용 enum 카탈로그

- 응답 `contents[].postCategoryType`: `ORDINARY`, `EVENT`, `DELIVERY`, `PRODUCT`
- 응답 `sort.fields[].direction`: `asc`, `desc`

### 호출 예시

```bash
curl -X GET 'https://api.commerce.naver.com/external/v1/contents/seller-notices' \
  -H 'Authorization: Bearer {access_token}'
```