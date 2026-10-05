<!-- https://apicenter.commerce.naver.com/docs/commerce-api/current/read-product-product -->
# (v2) 그룹상품 조회 | 커머스API

(v2) 그룹상품 조회

GET /v2/standard-group-products/:groupProductNo

그룹상품을 조회합니다.

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
