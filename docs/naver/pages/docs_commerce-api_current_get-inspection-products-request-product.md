<!-- https://apicenter.commerce.naver.com/docs/commerce-api/current/get-inspection-products-request-product -->
# 수정 요청 상품 목록을 조회 | 커머스API

수정 요청 상품 목록을 조회

GET /v1/product-inspections/channel-products

상품 검수에서 수정 요청 상품으로 지정한 상품 목록을 조회합니다.

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
