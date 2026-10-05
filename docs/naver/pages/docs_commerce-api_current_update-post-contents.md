<!-- https://apicenter.commerce.naver.com/docs/commerce-api/current/update-post-contents -->
# 공지사항 수정 | 커머스API

공지사항 수정

PUT /v1/contents/seller-notices/:sellerNoticeId

Request​

Responses​
200400401403404500

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
