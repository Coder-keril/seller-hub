<!-- https://apicenter.commerce.naver.com/docs/commerce-api/current/update-product-product -->
# (v2) 그룹상품 수정 | 커머스API

(v2) 그룹상품 수정

PUT /v2/standard-group-products/:groupProductNo

비동기로 동작합니다. 요청 결과는 그룹상품 요청 결과 조회 API로 확인할 수 있습니다.

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
