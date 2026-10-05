<!-- https://apicenter.commerce.naver.com/docs/commerce-api/current/schemas/%EB%B0%98%ED%92%88-%ED%83%9D%EB%B0%B0%EC%82%AC-%EC%A0%95%EB%B3%B4-%EA%B5%AC%EC%A1%B0%EC%B2%B4 -->
# 반품 택배사 정보 구조체 | 커머스API

반품 택배사 정보 구조체

이 구조체는 상품의 배송 정보 중 반품 택배사 정보 데이터를 표현하는 구조체입니다.
사전에 스마트스토어센터로 등록한 반품 택배사 계약 정보에 따라 선택 가능한 반품 택배사 목록을 표현합니다.

이 구조체는 API 호출에 대한 응답으로만 사용합니다.

구조체의 객체 1개는 선택 가능한 반품 택배사 정보 1개를 표현합니다.
이 구조체는 상품의 배송 정보 중 반품 택배사 정보 데이터를 표현하는 구조체입니다.
사전에 스마트스토어센터로 등록한 반품 택배사 계약 정보에 따라 선택 가능한 반품 택배사 목록을 표현합니다.

이 구조체는 API 호출에 대한 응답으로만 사용합니다.

구조체의 객체 1개는 선택 가능한 반품 택배사 정보 1개를 표현합니다.

idID (integer<int64>)

name이름 (string)

returnDeliveryCompanyPriorityType반품 택배사 우선순위 타입 (string)Possible values: [PRIMARY, SECONDARY_1, SECONDARY_2, SECONDARY_3, SECONDARY_4, SECONDARY_5, SECONDARY_6, SECONDARY_7, SECONDARY_8, SECONDARY_9]

반품 택배사 정보 구조체
{
  "id": 0,
  "name": "string",
  "returnDeliveryCompanyPriorityType": "PRIMARY"
}
