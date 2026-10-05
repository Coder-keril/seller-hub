<!-- https://apicenter.commerce.naver.com/docs/commerce-api/current/get-all-product-info-provided-notice-type-vo-product -->
# 상품정보제공고시 상품군 목록 조회 | 커머스API

상품정보제공고시 상품군 목록 조회

GET /v1/products-for-provided-notice

카테고리 ID 입력 시 카테고리에서 추천하는 상품정보제공고시 상품군 목록을 조회합니다.
카테고리 ID 미입력 시 전체 상품군 목록을 조회합니다.
입력하는 카테고리 ID는 대카테고리 ID입니다.

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
