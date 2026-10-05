<!-- https://apicenter.commerce.naver.com/docs/commerce-api/current/schemas/%ED%9D%AC%EB%A7%9D%EC%9D%BC%EB%B0%B0%EC%86%A1-%EA%B7%B8%EB%A3%B9-%EC%A0%95%EB%B3%B4-%EA%B5%AC%EC%A1%B0%EC%B2%B4 -->
# 희망일배송 그룹 정보 구조체 | 커머스API

희망일배송 그룹 정보 구조체

희망일배송 그룹.
이 구조체는 상품의 배송 정보 중 희망일배송 그룹 정보 데이터를 표현하는 구조체입니다.
희망일배송 그룹 정보는 희망일배송 설정 상품에만 적용 가능하며 희망일배송 설정은 일부 판매자에 한하여 지정 조건에서만 설정이 가능합니다.

이 구조체는 API 호출에 대한 요청/응답 모두에서 사용합니다.

구조체의 객체 1개는 희망일배송 그룹 1개를 표현합니다.

이 구조체는 아래 API에서 사용합니다.

희망일배송 그룹 다건 조회, 희망일배송 그룹 등록, 희망일배송 그룹 단건 조회, 희망일배송 그룹 수정
이 구조체는 상품의 배송 정보 중 희망일배송 그룹 정보 데이터를 표현하는 구조체입니다.
희망일배송 그룹 정보는 희망일배송 설정 상품에만 적용 가능하며 희망일배송 설정은 일부 판매자에 한하여 지정 조건에서만 설정이 가능합니다.

이 구조체는 API 호출에 대한 요청/응답 모두에서 사용합니다.

구조체의 객체 1개는 희망일배송 그룹 1개를 표현합니다.

이 구조체는 아래 API에서 사용합니다.

희망일배송 그룹 다건 조회, 희망일배송 그룹 등록, 희망일배송 그룹 단건 조회, 희망일배송 그룹 수정

id희망일배송 그룹 ID (integer<int64>)

name희망일배송 그룹명 (string)required

usable사용 여부 (boolean)required

baseGroup기본 희망일배송 그룹 여부 (boolean)required

hopeGroupStartTime배송 희망시간 시작 시각 (integer<int32>)

hopeGroupEndTime배송 희망시간 종료 시각 (integer<int32>)

regularHolidays정기휴무 요일 목록 (string)[]
SUNDAY(일요일), MONDAY(월요일), TUESDAY(화요일), WEDNESDAY(수요일), THURSDAY(목요일), FRIDAY(금요일), SATURDAY(토요일)

Possible values: [SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY]

ladderTruckUseComment사다리차 이용 시 입력 사항 (string)

productRemovalType기존 상품 철거/수거 타입 (string)
DOWN_FIRST_FLOOR(1층까지 내림), COLLECT_SELLER(수거)

Possible values: [DOWN_FIRST_FLOOR, COLLECT_SELLER]

hopeDeliveryGroupDays 배송 희망일자 목록 (object)[]requiredArray [

id배송 희망일자 ID (integer<int64>)

regionName지역명 (string)required

usable사용 여부 (boolean)required

hopeStartDay배송 희망일자 시작일 (integer<int32>)

hopeEndDay배송 희망일자 종료일 (integer<int32>)

expectationDeliveryFee예상 배송비 (integer<int32>)Possible values: <= 100000

]

희망일배송 그룹 정보 구조체
{
  "id": 0,
  "name": "string",
  "usable": true,
  "baseGroup": true,
  "hopeGroupStartTime": 0,
  "hopeGroupEndTime": 0,
  "regularHolidays": [
    "SUNDAY"
  ],
  "ladderTruckUseComment": "string",
  "productRemovalType": "DOWN_FIRST_FLOOR",
  "hopeDeliveryGroupDays": [
    {
      "id": 0,
      "regionName": "string",
      "usable": true,
      "hopeStartDay": 0,
      "hopeEndDay": 0,
      "expectationDeliveryFee": 0
    }
  ]
}
