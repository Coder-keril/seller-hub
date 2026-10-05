<!-- https://apicenter.commerce.naver.com/docs/commerce-api/current/get-delivery-bundle-group-list-product -->
# 묶음배송 그룹 다건 조회 | 커머스API

묶음배송 그룹 다건 조회

GET /v1/product-delivery-info/bundle-groups

묶음배송 그룹 코드 목록을 조회합니다. 묶음배송 그룹명을 입력하지 않으면 전체 목록을 조회합니다. 판매자 등록 후 판매자센터에 접속하지 않은 상태로 API를 호출하는 판매자의 경우 '기본 묶음배송 그룹'이 자동으로 등록됩니다.

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
