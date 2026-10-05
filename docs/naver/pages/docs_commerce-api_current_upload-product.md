<!-- https://apicenter.commerce.naver.com/docs/commerce-api/current/upload-product -->
# 상품 이미지 다건 등록 | 커머스API

상품 이미지 다건 등록

POST /v1/product-images/upload

POST multipart/form-data 방식으로 이미지 정보를 전송합니다.

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
