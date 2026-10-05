<!-- https://apicenter.commerce.naver.com/docs/commerce-api/current/read-channel-product-product -->
# 판매 상태 변경 | 커머스API

판매 상태 변경

PUT /v1/products/origin-products/:originProductNo/change-status

원상품의 판매 상태를 변경합니다.

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
