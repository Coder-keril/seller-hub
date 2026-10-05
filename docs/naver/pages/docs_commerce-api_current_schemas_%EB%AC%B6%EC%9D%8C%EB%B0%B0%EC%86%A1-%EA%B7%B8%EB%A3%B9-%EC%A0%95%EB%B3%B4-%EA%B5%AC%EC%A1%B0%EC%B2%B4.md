<!-- https://apicenter.commerce.naver.com/docs/commerce-api/current/schemas/%EB%AC%B6%EC%9D%8C%EB%B0%B0%EC%86%A1-%EA%B7%B8%EB%A3%B9-%EC%A0%95%EB%B3%B4-%EA%B5%AC%EC%A1%B0%EC%B2%B4 -->
# 묶음배송 그룹 정보 구조체 | 커머스API

묶음배송 그룹 정보 구조체

묶음배송 그룹 정보.
이 구조체는 상품의 배송 정보 중 묶음배송 그룹 정보 데이터를 표현하는 구조체입니다.

이 구조체는 API 호출에 대한 요청/응답 모두에서 사용합니다.

구조체의 객체 1개는 묶음배송 그룹 1개를 표현합니다.

이 구조체는 아래 API에서 사용합니다.

묶음배송 그룹 다건 조회, 묶음배송 그룹 등록, 묶음배송 그룹 단건 조회, 묶음배송 그룹 수정
이 구조체는 상품의 배송 정보 중 묶음배송 그룹 정보 데이터를 표현하는 구조체입니다.

이 구조체는 API 호출에 대한 요청/응답 모두에서 사용합니다.

구조체의 객체 1개는 묶음배송 그룹 1개를 표현합니다.

이 구조체는 아래 API에서 사용합니다.

묶음배송 그룹 다건 조회, 묶음배송 그룹 등록, 묶음배송 그룹 단건 조회, 묶음배송 그룹 수정

id묶음배송 그룹 ID (integer<int64>)등록 요청인 경우에는 입력값이 무시됩니다.

name묶음배송 그룹명 (string)required

usable사용 여부 (boolean)required기본 그룹인 경우 자동으로 true로 설정됩니다.

baseGroup기본 묶음배송 그룹 여부 (boolean)required기본 그룹으로 지정 여부. 미입력 시 false로 설정됩니다.

deliveryFeeChargeMethodType배송비 계산 방식 코드 (string)required묶음배송 그룹 등록 시 배송비 계산 방식을 입력하기 위한 코드입니다.

MIN(묶음배송 그룹에서 가장 작은 배송비로 부과), MAX(묶음배송 그룹에서 가장 큰 배송비로 부과)

Possible values: [MIN, MAX]

deliveryFeeByArea 지역별 추가 배송비 (object)지역별 추가 배송비
deliveryAreaType지역별 추가 배송비 권역 코드 (string)required묶음배송 그룹 등록 시 지역별 추가 배송비 권역을 입력하기 위한 코드입니다.
묶음배송 가능 여부가 true인 경우 묶음배송 그룹에 설정된 값이 적용됩니다(배송 속성이 ARRIVAL_GUARANTEE인 경우 제외).

AREA_2(내륙/제주 및 도서산간 지역으로 구분(2권역)), AREA_3(내륙/제주/제주 외 도서산간 지역으로 구분(3권역))

Possible values: [AREA_2, AREA_3]

area2extraFee2권역 추가 배송비 (integer<int32>)2권역인 경우 '제주 및 도서산간' 지역 추가 배송비.
3권역인 경우 '제주' 지역 추가 배송비.
묶음배송 가능 여부가 true인 경우 묶음배송 그룹에 설정된 값이 적용됩니다(배송 속성이 ARRIVAL_GUARANTEE인 경우 제외).Possible values: <= 200000

area3extraFee3권역 추가 배송비 (integer<int32>)'제주 외 도서산간' 지역 추가 배송비. deliveryAreaType이 3권역인 경우 필수.
묶음배송 가능 여부가 true인 경우 묶음배송 그룹에 설정된 값이 적용됩니다(배송 속성이 ARRIVAL_GUARANTEE인 경우 제외).Possible values: <= 200000

묶음배송 그룹 정보 구조체
{
  "id": 0,
  "name": "string",
  "usable": true,
  "baseGroup": true,
  "deliveryFeeChargeMethodType": "MIN",
  "deliveryFeeByArea": {
    "deliveryAreaType": "AREA_2",
    "area2extraFee": 0,
    "area3extraFee": 0
  }
}
