<!-- https://apicenter.commerce.naver.com/docs/commerce-api/current/get-product-info-provided-notice-type-vo-product -->
# 상품정보제공고시 상품군 단건 조회 | 커머스API

상품정보제공고시 상품군 단건 조회

GET /v1/products-for-provided-notice/:productInfoProvidedNoticeType

지정한 상품정보제공고시 상품군 유형의 정보를 조회합니다.

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
