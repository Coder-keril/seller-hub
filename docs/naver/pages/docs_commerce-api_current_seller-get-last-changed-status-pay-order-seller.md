<!-- https://apicenter.commerce.naver.com/docs/commerce-api/current/seller-get-last-changed-status-pay-order-seller -->
# 변경 상품 주문 내역 조회 | 커머스API

변경 상품 주문 내역 조회

GET /v1/pay-order/seller/product-orders/last-changed-statuses

조회 요청 범위의 기준은 변경 일시(date-time)입니다.

조회 종료 일시(lastChangedTo) 값을 생략하면 조회 시작 일시(lastChangedFrom)로부터 이후 24시간의 내역을 조회합니다. 조회 결과는 변경 일시 기준 오름차순으로 정렬되며, 일시가 같으면 상품 주문 번호 기준 오름차순으로 정렬됩니다.

조회 결과는 요청 범위 내에서 최대 300개(또는 limitCount)의 변경된 상품 주문 내역을 제공합니다. 예를 들어 조회 요청 범위 내에 345개의 변경된 상품 주문 내역이 있어도 첫 요청의 응답에는 300개만 제공합니다. 이어서 나머지 45개의 정렬된 데이터를 조회하려면 앞 요청의 응답에 포함된 more 객체의 moreFrom과 moreSequence 값을 다음 요청의 lastChangedFrom과 moreSequence에 각각 입력합니다. 만약 조회 요청 범위 내에 변경된 상품 주문 내역이 300개(또는 limitCount) 이하라면 more 객체는 제공되지 않습니다. 응답의 more 객체의 설명과 예를 참고 바랍니다.

Request​

Responses​
200400500

(성공) 변경 상품 주문 내역

(실패) 잘못된 요청

(실패) 서버 내부
