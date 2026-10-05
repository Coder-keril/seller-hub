<!-- https://apicenter.commerce.naver.com/docs/commerce-api/current/schemas/%EB%AA%A8%EB%8D%B8-%EC%B9%B4%ED%83%88%EB%A1%9C%EA%B7%B8-%EC%A0%95%EB%B3%B4-%EA%B5%AC%EC%A1%B0%EC%B2%B4 -->
# 모델 카탈로그 정보 구조체 | 커머스API

모델 카탈로그 정보 구조체

카탈로그.
이 구조체는 네이버쇼핑 모델 카탈로그 정보를 표현하는 구조체입니다.

이 구조체는 API 호출에 대한 응답으로만 사용합니다.

구조체의 객체 1개는 모델 카탈로그 정보 1개를 표현합니다.
이 구조체는 네이버쇼핑 모델 카탈로그 정보를 표현하는 구조체입니다.

이 구조체는 API 호출에 대한 응답으로만 사용합니다.

구조체의 객체 1개는 모델 카탈로그 정보 1개를 표현합니다.

wholeCategoryName전체 카테고리명 (string)

categoryId카테고리 ID (string)

manufacturerCode제조사 코드 (integer<int64>)제조사 ID

manufacturerName제조사명 (string)

brandCode브랜드 코드 (integer<int64>)브랜드 ID

brandName브랜드명 (string)

id카탈로그 ID (integer<int64>)

name카탈로그명 (string)

모델 카탈로그 정보 구조체
{
  "wholeCategoryName": "string",
  "categoryId": "string",
  "manufacturerCode": 0,
  "manufacturerName": "string",
  "brandCode": 0,
  "brandName": "string",
  "id": 0,
  "name": "string"
}
