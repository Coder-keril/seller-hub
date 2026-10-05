<!-- https://apicenter.commerce.naver.com/docs/commerce-api/current/get-sub-origin-area-list-product -->
# 하위 원산지 코드 정보 다건 조회 | 커머스API

하위 원산지 코드 정보 다건 조회

GET /v1/product-origin-areas/sub-origin-areas

하위 원산지 코드 정보를 조회합니다. 원산지 코드를 입력하지 않으면 최상위 코드 정보를 조회합니다.

Request​

Responses​
200308400401403404500

성공

리디렉션
- code : PERMANENT_REDIRECT

잘못된 요청
- code : BAD_REQUEST

인가되지 않은 요청
- code : UNAUTHORIZED

권한 없음
- code : FORBIDDEN

데이터 없음
- code : NOT_FOUND

내부 서버 오류
- code : INTERNAL_SERVER_ERROR
