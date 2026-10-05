<!-- https://apicenter.commerce.naver.com/docs/commerce-api/current/schemas/%EC%82%AC%EC%9A%A9-%EC%83%81%ED%83%9C-%EC%A0%95%EB%B3%B4-%EA%B5%AC%EC%A1%B0%EC%B2%B4 -->
# 사용 상태 정보 구조체 | 커머스API

사용 상태 정보 구조체

사용 현황 응답 데이터
이 구조체는 대상 사용자의 솔루션 사용 상태 정보를 표현하는 구조체입니다.

이 구조체는 API 호출에 대한 응답으로만 사용합니다.

구조체의 객체 1개는 사용자 1명에 대한 솔루션 사용 상태를 표현합니다.

accountUidstring계정 UID

solutionIdstring솔루션 ID

accountMappingIdstring솔루션 개발사에서 자체 관리하는 계정 매핑 ID

subscriptionIdstring최근 솔루션 사용 ID

plan PlanProjection.merchant (object)idstringrequired

gradestringrequiredPossible values: [DEFAULT, FREE, START, PLUS, PRO]

namestringrequired

additionalInfo objectproperty name*object

reserve 예약 사항 (object)예약 사항
typestringPossible values: [UNSUBSCRIPTION, DOWNGRADE]

plan PlanProjection.merchant (object)idstringrequired

gradestringrequiredPossible values: [DEFAULT, FREE, START, PLUS, PRO]

namestringrequired

additionalInfo objectproperty name*object

statusstring상태Example: SUBSCRIBING
Possible values: [SUBSCRIBING, WAITING_SUBSCRIPTION, ON_EXAMINATION, UNSUBSCRIBED, WAITING_UNSUBSCRIPTION, ON_PAYMENT_FAIL, CANCEL_SUBSCRIPTION]

roundinteger<int32>현재 회차Example: 1

roundStartDatestring<date-time>현재 회차 시작일Example: 2023-08-18T00:00:00.000+09:00

roundEndDatestring<date-time>현재 회차 종료(예상)일Example: 2023-08-18T00:00:00.000+09:00

requestDatestring<date-time>솔루션 신청일(생성일)Example: 2023-08-18T00:00:00.000+09:00

startDatestring<date-time>시작일(조건부 사용 타입의 경우 사용 요청일과 사용 시작일이 다름)Example: 2023-08-18T00:00:00.000+09:00

endDatestring<date-time>해지/취소일Example: 2023-08-18T00:00:00.000+09:00

requestUnsubscriptionDatestring<date-time>해지 요청일Example: 2023-08-18T00:00:00.000+09:00

reasonstring변경 사유Example: 정기결제 실패로 사용 해지

forceUpgradeboolean강제 업그레이드 여부Example: true

accountAuthenticationboolean계정 인증 여부Example: true

accountAuthenticatedDatestring<date-time>계정 인증일Example: 2023-08-18T00:00:00.000+09:00

사용 상태 정보 구조체
{
  "accountUid": "string",
  "solutionId": "string",
  "accountMappingId": "string",
  "subscriptionId": "string",
  "plan": {
    "id": "string",
    "grade": "DEFAULT",
    "name": "string",
    "additionalInfo": {}
  },
  "reserve": {
    "type": "UNSUBSCRIPTION",
    "plan": {
      "id": "string",
      "grade": "DEFAULT",
      "name": "string",
      "additionalInfo": {}
    }
  },
  "status": "SUBSCRIBING",
  "round": 1,
  "roundStartDate": "2023-08-18T00:00:00.000+09:00",
  "roundEndDate": "2023-08-18T00:00:00.000+09:00",
  "requestDate": "2023-08-18T00:00:00.000+09:00",
  "startDate": "2023-08-18T00:00:00.000+09:00",
  "endDate": "2023-08-18T00:00:00.000+09:00",
  "requestUnsubscriptionDate": "2023-08-18T00:00:00.000+09:00",
  "reason": "정기결제 실패로 사용 해지",
  "forceUpgrade": true,
  "accountAuthentication": true,
  "accountAuthenticatedDate": "2023-08-18T00:00:00.000+09:00"
}
