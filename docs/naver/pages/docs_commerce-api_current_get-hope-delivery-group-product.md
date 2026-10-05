<!-- https://apicenter.commerce.naver.com/docs/commerce-api/current/get-hope-delivery-group-product -->
# 희망일배송 그룹 단건 조회 | 커머스API

희망일배송 그룹 단건 조회

GET /v1/product-delivery-info/hope-delivery-groups/:hopeDeliveryGroupId

희망일배송 그룹 정보를 조회합니다.

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
