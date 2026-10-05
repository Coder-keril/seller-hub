<!-- https://apicenter.commerce.naver.com/docs/commerce-api/current/save-detail-info-product -->
# (v2) 상품 상세 정보 임시 저장 | 커머스API

(v2) 상품 상세 정보 임시 저장

POST /v2/standard-group-products/temp-detail-content

그룹상품 요청 시 개별 상품 상세 정보 저장이 필요한 경우 사전에 임시 저장합니다.

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
