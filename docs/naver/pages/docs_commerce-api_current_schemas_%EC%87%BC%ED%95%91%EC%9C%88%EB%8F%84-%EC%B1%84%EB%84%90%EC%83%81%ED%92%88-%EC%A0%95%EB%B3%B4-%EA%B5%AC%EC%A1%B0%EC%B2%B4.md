<!-- https://apicenter.commerce.naver.com/docs/commerce-api/current/schemas/%EC%87%BC%ED%95%91%EC%9C%88%EB%8F%84-%EC%B1%84%EB%84%90%EC%83%81%ED%92%88-%EC%A0%95%EB%B3%B4-%EA%B5%AC%EC%A1%B0%EC%B2%B4 -->
# 쇼핑윈도 채널상품 정보 구조체 | 커머스API

쇼핑윈도 채널상품 정보 구조체

이 구조체는 상품 정보 중 쇼핑윈도 채널 상품 속성에 해당하는 상품 데이터를 표현하는 구조체입니다.

이 구조체는 API 호출에 대한 요청/응답 모두에서 사용합니다.

구조체의 객체 1개는 상품 1개에 대한 쇼핑윈도 채널 상품 정보를 표현합니다.

상품 단위별로 쇼핑윈도 채널 상품 정보는 단일 구조체로만 포함되나 계층 구조상 자매 개체로 원상품 구조체 혹은 스마트스토어 채널 상품 구조체와 함께 사용할 수 있습니다.

이 구조체는 아래 API에서 사용합니다.

상품 등록, 채널 상품 조회, 채널 상품 수정, 원상품 조회, 원상품 수정 등
이 구조체는 상품 정보 중 쇼핑윈도 채널상품 속성에 해당하는 상품 데이터를 표현하는 구조체입니다.

이 구조체는 API 호출에 대한 요청/응답 모두에서 사용합니다.

구조체의 객체 1개는 상품 1개에 대한 쇼핑윈도 채널상품 정보를 표현합니다.

상품 단위별로 쇼핑윈도 채널상품 정보는 단일 구조체로만 포함되나 계층 구조상 자매 개체로 원상품 구조체 혹은 스마트스토어 채널상품 구조체와 함께 사용할 수 있습니다.

이 구조체는 아래 API에서 사용합니다.

상품 등록, 채널 상품 조회, 채널 상품 수정, 원상품 조회, 원상품 수정 등

channelProductName채널 상품 전용 상품명 (string)채널 상품 전용 상품명을 사용하는 경우 입력합니다. 미입력 시 원상품명으로 적용됩니다.

bbsSeq콘텐츠 게시글 일련번호 (integer<int64>)공지사항

storeKeepExclusiveProduct알림받기 동의 회원 전용 상품 여부 (boolean)미입력 시 false로 저장됩니다.

naverShoppingRegistration네이버 쇼핑 등록 여부 (boolean)required네이버 쇼핑 광고주가 아닌 경우에는 false로 저장됩니다.

channelNo윈도 채널 상품 채널 번호 (integer<int64>)required전시할 윈도 채널 선택

best베스트 여부(윈도 채널 전용) (boolean)미입력 시 false로 저장됩니다.

channelProductDisplayStatusType전시 상태 코드(윈도 채널 읽기 전용) (string)WAIT(전시 대기), ON(전시 중), SUSPENSION(전시 중지)Possible values: [WAIT, ON, SUSPENSION]

쇼핑윈도 채널상품 정보 구조체
{
  "channelProductName": "string",
  "bbsSeq": 0,
  "storeKeepExclusiveProduct": true,
  "naverShoppingRegistration": true,
  "channelNo": 0,
  "best": true,
  "channelProductDisplayStatusType": "WAIT"
}
