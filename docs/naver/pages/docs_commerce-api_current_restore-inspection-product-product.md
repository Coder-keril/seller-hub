<!-- https://apicenter.commerce.naver.com/docs/commerce-api/current/restore-inspection-product-product -->
# 수정 요청 상품에 대해 복원 요청 | 커머스API

수정 요청 상품에 대해 복원 요청

PUT /v1/product-inspections/channel-product/:channelProductNo/restore

수정 요청 상품에 대해 복원을 요청합니다.

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
