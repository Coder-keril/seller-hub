<!-- https://apicenter.commerce.naver.com/docs/commerce-api/current/update-options-product -->
# 상품 옵션 재고 변경 | 커머스API

상품 옵션 재고 변경

PUT /v1/products/origin-products/:originProductNo/option-stock

상품 옵션의 재고, 가격, 할인가를 변경합니다.

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
