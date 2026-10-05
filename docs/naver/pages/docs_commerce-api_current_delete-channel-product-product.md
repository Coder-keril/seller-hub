<!-- https://apicenter.commerce.naver.com/docs/commerce-api/current/delete-channel-product-product -->
# (v2) 채널 상품 삭제 | 커머스API

(v2) 채널 상품 삭제

DELETE /v2/products/channel-products/:channelProductNo

채널 상품을 삭제합니다.

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
