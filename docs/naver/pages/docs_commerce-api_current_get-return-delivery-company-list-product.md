<!-- https://apicenter.commerce.naver.com/docs/commerce-api/current/get-return-delivery-company-list-product -->
# (v2) 반품 택배사 다건 조회 | 커머스API

(v2) 반품 택배사 다건 조회

GET /v2/product-delivery-info/return-delivery-companies

반품/교환 택배사 코드 목록을 조회합니다. 반품/교환 택배사명 파라미터에 값을 입력하지 않으면 전체 반품/교환 택배사 코드 목록을 조회합니다.

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
