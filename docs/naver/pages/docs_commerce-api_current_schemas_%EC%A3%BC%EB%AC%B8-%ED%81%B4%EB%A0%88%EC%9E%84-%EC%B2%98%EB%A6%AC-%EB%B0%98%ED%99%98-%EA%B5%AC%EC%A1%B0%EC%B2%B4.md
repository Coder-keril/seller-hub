<!-- https://apicenter.commerce.naver.com/docs/commerce-api/current/schemas/%EC%A3%BC%EB%AC%B8-%ED%81%B4%EB%A0%88%EC%9E%84-%EC%B2%98%EB%A6%AC-%EB%B0%98%ED%99%98-%EA%B5%AC%EC%A1%B0%EC%B2%B4 -->
# 주문-클레임 처리 반환 구조체 | 커머스API

주문-클레임 처리 반환 구조체

이 구조체는 주문-클레임 처리 관련 다수 API에서 공통으로 사용하는 반환 메시지 형식을 표현하는 구조체입니다.
다양한 주문-클레임 처리 관련 API 호출의 응답 결과를 이 구조체를 활용하여 처리할 수 있습니다.

이 구조체는 API 호출에 대한 응답으로만 사용합니다.

'[주문] 발주 확인 처리 (POST /v1/pay-order/seller/product-orders/confirm)' API 응답은 이 구조체로 대응할 수 없습니다.

구조체의 객체 1개는 HTTP Response 1회에 대한 정보를 표현합니다.

timestampstring<date-time>Example: 2023-01-16T17:14:51.794+09:00

traceIdstringrequired

data objectsuccessProductOrderIdsstring[](성공) 상품 주문 번호

failProductOrderInfos object[]Array [

productOrderIdstring(실패) 상품 주문 번호

codeerrorCode.pay-order-seller (string)오류 코드 정의

코드설명비고4000잘못된 요청 파라미터오류 유형.객체명.필드명9999기타정의되지 않은 오류 코드100001상품 주문을 찾을 수 없음100003주문을 찾을 수 없음101009처리 권한이 없는 상품 주문 번호를 요청101011직계약 상품은 물류사만 발주확인 가능104105발송 기한 입력 범위 초과104116배송 방법 변경 필요(배송 없음 주문)104117배송 방법 변경 필요104118택배사 미입력104119택배사 코드 확인104120송장 번호 미입력104121배송 송장 오류(기사용 송장)104122배송 송장 오류(비유효 송장)104131상품 주문 번호 중복104133잘못된 요청104417교환 상태 확인 필요(재배송 처리 불가능 주문 상태)104139조회 가능한 날짜 범위를 초과104441희망일배송 상품 또는 N희망일배송 상품이 아님104442상품 주문 상태 확인 필요104443발주 상태 확인 필요104444배송 희망일 날짜가 유효하지 않음104445배송 희망일 변경 가능 날짜 초과104446기존과 동일한 희망일 배송일시104138배송 희망일 변경 실패104449배송 희망일 변경 가능 기간 아님104450N희망일배송 상품은 배송희망시간, 지역 입력 불가105306변경을 요청한 상태가 기존과 동일105308직계약 상품은 물류사만 발송처리 가능105001E쿠폰 요청 정보의 상품주문번호가 중복되었습니다.105002E쿠폰 발송처리의 인증번호가 유효하지 않습니다.

messagestring(실패) 메시지

]

주문-클레임 처리 반환 구조체
{
  "timestamp": "2023-01-16T17:14:51.794+09:00",
  "traceId": "string",
  "data": {
    "successProductOrderIds": [
      "string"
    ],
    "failProductOrderInfos": [
      {
        "productOrderId": "string",
        "code": "string",
        "message": "string"
      }
    ]
  }
}
