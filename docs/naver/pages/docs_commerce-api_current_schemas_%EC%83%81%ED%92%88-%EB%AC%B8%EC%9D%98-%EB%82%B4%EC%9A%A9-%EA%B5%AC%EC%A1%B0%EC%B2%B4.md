<!-- https://apicenter.commerce.naver.com/docs/commerce-api/current/schemas/%EC%83%81%ED%92%88-%EB%AC%B8%EC%9D%98-%EB%82%B4%EC%9A%A9-%EA%B5%AC%EC%A1%B0%EC%B2%B4 -->
# 상품 문의 내용 구조체 | 커머스API

상품 문의 내용 구조체

이 구조체는 대상 상품의 상세 페이지에서 상품Q&A로 남겨진 상품 문의 내용 데이터를 표현하는 구조체입니다.

이 구조체는 API 호출에 대한 응답으로만 사용합니다.

구조체의 객체 1개는 상품Q&A로 남겨진 상품 문의 내용 1개를 표현합니다.
이 구조체는 대상 상품의 상세 페이지에서 상품Q&A로 남겨진 상품 문의 내용 데이터를 표현하는 구조체입니다.

이 구조체는 API 호출에 대한 응답으로만 사용합니다.

구조체의 객체 1개는 상품Q&A로 남겨진 상품 문의 내용 1개를 표현합니다.

createDate생성 일시 (string<date-time>)Example: 2026-08-31T14:08:02.016+09:00

question문의 내용 (string)

answer판매자 답변 내용(여러 개면 최초 답변을 반환) (string)

answers 판매자 답변 목록(등록순) (object)[]Array [

answer답변 내용 (string)

createDate답변 등록 일시 (string<date-time>)Example: 2026-08-31T14:08:02.037+09:00

]

answered판매자 답변 여부 (boolean)

productId채널 상품번호 (integer<int64>)

productName상품명 (string)

maskedWriterId마스킹된 작성자 ID (string)

questionId상품 문의 번호 (integer<int64>)

상품 문의 내용 구조체
{
  "createDate": "2026-08-31T14:08:02.016+09:00",
  "question": "string",
  "answer": "string",
  "answers": [
    {
      "answer": "string",
      "createDate": "2026-08-31T14:08:02.037+09:00"
    }
  ],
  "answered": true,
  "productId": 0,
  "productName": "string",
  "maskedWriterId": "string",
  "questionId": 0
}
