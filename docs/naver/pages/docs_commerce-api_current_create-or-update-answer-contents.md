<!-- https://apicenter.commerce.naver.com/docs/commerce-api/current/create-or-update-answer-contents -->
# 상품 문의 답변 등록/수정 | 커머스API

상품 문의 답변 등록/수정

PUT /v1/contents/qnas/:questionId

상품 문의의 답변을 등록하거나 수정할 수 있습니다.

Request​

Responses​
204400401403404500

성공

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
