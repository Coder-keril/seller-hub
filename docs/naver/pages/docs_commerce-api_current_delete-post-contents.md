<!-- https://apicenter.commerce.naver.com/docs/commerce-api/current/delete-post-contents -->
# 공지사항 삭제 | 커머스API

공지사항 삭제

DELETE /v1/contents/seller-notices/:sellerNoticeId

입력한 공지사항 번호의 공지사항을 삭제합니다.
단, 상품에 연결된 공지사항은 삭제할 수 없습니다.

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
