<!-- https://apicenter.commerce.naver.com/docs/commerce-api/current/insert-inquiry-answer-pay-merchant -->
# 고객 문의 답변 등록 | 커머스API

고객 문의 답변 등록

POST /v1/pay-merchant/inquiries/:inquiryNo/answer

Request​

Responses​
200400500

OK

Bad Request

코드설명ERR-NC-101001정상적인 요청이 아닌 경우ERR-NC-101004문의 번호에 해당하는 문의가 없거나 삭제된 경우ERR-NC-101005문의가 유효하지 않은 경우ERR-NC-101007답변 권한이 없는 경우ERR-NC-101008판매자 번호가 유효하지 않은 경우ERR-NC-101010해당 문의에 이미 답변이 존재하는 경우

Internal Server Error

코드설명ERR-NC-101006서버 내부 오류
