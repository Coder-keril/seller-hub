<!-- https://apicenter.commerce.naver.com/docs/commerce-api/current/update-multi-products-product -->
# 멀티 상품 변경 | 커머스API

멀티 상품 변경

PATCH /v1/products/origin-products/multi-update

여러 상품의 판매가, 재고, 할인, 판매 상태를 다르게 변경할 수 있습니다.

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
