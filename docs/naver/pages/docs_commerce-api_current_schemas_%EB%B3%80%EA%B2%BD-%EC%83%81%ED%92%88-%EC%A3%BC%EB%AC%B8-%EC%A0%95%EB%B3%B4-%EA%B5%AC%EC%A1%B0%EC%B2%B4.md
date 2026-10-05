<!-- https://apicenter.commerce.naver.com/docs/commerce-api/current/schemas/%EB%B3%80%EA%B2%BD-%EC%83%81%ED%92%88-%EC%A3%BC%EB%AC%B8-%EC%A0%95%EB%B3%B4-%EA%B5%AC%EC%A1%B0%EC%B2%B4 -->
# 변경 상품 주문 정보 구조체 | 커머스API

변경 상품 주문 정보 구조체

이 구조체는 주문건의 변경 상품 주문 정보를 표현하는 구조체입니다.
전체 주문건에서 지정된 조회 조건에 해당하는 주문건을 식별할 수 있는 일부 정보를 표현합니다.

이 구조체는 API 호출에 대한 응답으로만 사용합니다.

구조체의 객체 1개는 상품주문번호 1개를 표현합니다.

Array [

orderIdstring주문 ID. 20바이트 내외

productOrderIdstring상품 주문 ID. 20바이트 내외

lastChangedTypelastChangedType.pay-order-seller (string)최종 변경 구분. 250바이트 내외

코드설명비고PAY_WAITING결제 대기PAYED결제 완료EXCHANGE_OPTION옵션 변경선물하기DELIVERY_ADDRESS_CHANGED배송지 변경GIFT_RECEIVED선물 수락선물하기CLAIM_REJECTED클레임 철회DISPATCHED발송 처리CLAIM_REQUESTED클레임 요청COLLECT_DONE수거 완료CLAIM_COMPLETED클레임 완료PURCHASE_DECIDED구매 확정HOPE_DELIVERY_INFO_CHANGED배송 희망일 변경CLAIM_REDELIVERING교환 재배송처리

paymentDatestring<date-time>결제 일시. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

lastChangedDatestring<date-time>최종 변경 일시. 45바이트 내외Example: 2023-01-16T17:14:51.794+09:00

productOrderStatusproductOrderStatus.pay-order-seller (string)상품 주문 상태. 250바이트 내외

코드설명비고PAYMENT_WAITING결제 대기PAYED결제 완료DELIVERING배송 중DELIVERED배송 완료PURCHASE_DECIDED구매 확정EXCHANGED교환CANCELED취소RETURNED반품CANCELED_BY_NOPAYMENT미결제 취소

claimTypeclaimType.pay-order-seller (string)클레임 구분. 250바이트 내외

코드설명비고CANCEL취소RETURN반품EXCHANGE교환PURCHASE_DECISION_HOLDBACK구매 확정 보류ADMIN_CANCEL직권 취소

claimStatusclaimStatus.pay-order-seller (string)클레임 상태. 250바이트 내외

코드설명비고CANCEL_REQUEST취소 요청CANCELING취소 처리 중CANCEL_DONE취소 처리 완료CANCEL_REJECT취소 철회RETURN_REQUEST반품 요청EXCHANGE_REQUEST교환 요청COLLECTING수거 처리 중COLLECT_DONE수거 완료EXCHANGE_REDELIVERING교환 재배송 중RETURN_DONE반품 완료EXCHANGE_DONE교환 완료RETURN_REJECT반품 철회EXCHANGE_REJECT교환 철회PURCHASE_DECISION_HOLDBACK구매 확정 보류PURCHASE_DECISION_REQUEST구매 확정 요청PURCHASE_DECISION_HOLDBACK_RELEASE구매 확정 보류 해제ADMIN_CANCELING직권 취소 중ADMIN_CANCEL_DONE직권 취소 완료ADMIN_CANCEL_REJECT직권 취소 철회

receiverAddressChangedboolean배송지 정보 변경 여부. 45바이트 내외Default value: false

giftReceivingStatusgiftReceivingStatus.pay-order-seller (string)선물 수락 상태 구분. 250바이트 내외

코드설명비고WAIT_FOR_RECEIVING수락 대기(배송지 입력 대기)RECEIVED수락 완료

]

변경 상품 주문 정보 구조체
[
  {
    "orderId": "string",
    "productOrderId": "string",
    "lastChangedType": "string",
    "paymentDate": "2023-01-16T17:14:51.794+09:00",
    "lastChangedDate": "2023-01-16T17:14:51.794+09:00",
    "productOrderStatus": "string",
    "claimType": "string",
    "claimStatus": "string",
    "receiverAddressChanged": false,
    "giftReceivingStatus": "string"
  }
]
