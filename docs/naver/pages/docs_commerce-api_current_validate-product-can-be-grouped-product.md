<!-- https://apicenter.commerce.naver.com/docs/commerce-api/current/validate-product-can-be-grouped-product -->
# (v2) 그룹상품 전환 유효성 검사 | 커머스API

(v2) 그룹상품 전환 유효성 검사

POST /v2/standard-group-products/validate-conversion

일반 상품을 그룹상품으로 전환할 수 있는지 여부를 확인합니다.

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
