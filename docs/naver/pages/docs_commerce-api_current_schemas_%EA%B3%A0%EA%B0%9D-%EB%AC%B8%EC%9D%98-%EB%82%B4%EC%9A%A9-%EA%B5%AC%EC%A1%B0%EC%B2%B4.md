<!-- https://apicenter.commerce.naver.com/docs/commerce-api/current/schemas/%EA%B3%A0%EA%B0%9D-%EB%AC%B8%EC%9D%98-%EB%82%B4%EC%9A%A9-%EA%B5%AC%EC%A1%B0%EC%B2%B4 -->
# 고객 문의 내용 구조체 | 커머스API

고객 문의 내용 구조체

이 구조체는 구매자가 남긴 고객 문의 내용 데이터를 표현하는 구조체입니다.

이 구조체는 API 호출에 대한 응답으로만 사용합니다.

구조체의 객체 1개는 구매자가 남긴 고객 문의 내용 1개를 표현합니다.

inquiryNointeger<int64>required문의 번호

categorystring문의 유형. 상품, 배송, 반품, 교환, 환불, 기타가 존재합니다.

titlestringrequired문의 제목

inquiryContentstringrequired문의 내용

inquiryRegistrationDateTimestring<date-time>required문의 등록 일시(yyyy-MM-dd'T'HH:mm:ss.SSSXXX)

answerContentIdinteger<int64>최근 문의 답변 ID

answerContentstring최근 문의 답변 내용

answerTemplateNointeger<int64>최근 문의 답변 템플릿 번호

answerRegistrationDateTimestring<date-time>최근 문의 답변 등록 일시(yyyy-MM-dd'T'HH:mm:ss.SSSXXX)

answeredbooleanrequired문의 답변 여부

orderIdstringrequired주문 ID

productNostring상품번호

productOrderIdListstring상품 주문 ID 목록(여러 개의 상품 주문에 대해 문의했을 경우 각각의 상품 주문 ID가 ','로 구분되어 출력됨)

productNamestring상품명

productOrderOptionstring상품 주문 옵션

customerIdstring구매자 ID

customerNamestringrequired구매자 이름

고객 문의 내용 구조체
{
  "inquiryNo": 0,
  "category": "string",
  "title": "string",
  "inquiryContent": "string",
  "inquiryRegistrationDateTime": "2024-07-29T15:51:28.071Z",
  "answerContentId": 0,
  "answerContent": "string",
  "answerTemplateNo": 0,
  "answerRegistrationDateTime": "2024-07-29T15:51:28.071Z",
  "answered": true,
  "orderId": "string",
  "productNo": "string",
  "productOrderIdList": "string",
  "productName": "string",
  "productOrderOption": "string",
  "customerId": "string",
  "customerName": "string"
}
