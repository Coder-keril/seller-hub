<!-- https://apicenter.commerce.naver.com/docs/solution-doc/3000/%EC%9D%B4%EB%B2%A4%ED%8A%B8-%ED%9B%85-%EC%97%B0%EB%8F%99-%EC%9A%94%EC%86%8C-%EA%B0%80%EC%9D%B4%EB%93%9C -->
# 이벤트 훅 연동 요소 가이드 | 커머스API

On this page
이벤트 훅 연동 요소 가이드
이벤트 훅​

커머스솔루션은 웹훅 형식의 이벤트 콜백을 지원합니다. 이를 '이벤트 훅 API'라고 합니다.

커머스솔루션에 이벤트 훅 API URL을 설정하면 솔루션에서 발생하는 이벤트 정보를 수신할 수 있습니다.

수신 가능한 이벤트 유형에는 구독 회차 시작, 해지 예약 등 판매자 행동을 기반으로 발생하는 이벤트와 커머스솔루션마켓 시스템 행동을 기반으로 발생하는 이벤트가 있습니다.

이벤트 훅 API URL 등록은 이벤트 훅 API 개발 후 운영 환경 호출이 가능한 시점에 커머스API센터 내 솔루션 관리에서 직접 등록하여 관리합니다.

솔루션 이벤트 유형​

무료/유료 구분은 커머스솔루션마켓 내 네이버페이 비즈 월렛을 통한 결제 여부 기준을 따릅니다.

즉시 해지와 조건부 해지의 차이는 링크를 확인하세요.

비즈월렛 사용/미사용해지 유형이벤트 훅 changeType 이름이벤트 훅 changeType 표시 값비즈 월렛 미사용 솔루션즉시 해지솔루션 해지END_SUBSCRIPTION솔루션 강제 해지FORCE_UNSUBSCRIPTION회차 시작START_ROUND회차 종료END_ROUND구독 신청 시작 (심사 후 승인형 Only)REQUEST_SUBSCRIPTION구독 신청 취소 (심사 후 승인형 Only)CANCEL_REQUEST_SUBSCRIPTION조건부 해지솔루션 해지 요청REQUEST_UNSUBSCRIPTION솔루션 해지 요청 취소CANCEL_REQUEST_UNSUBSCRIPTION솔루션 강제 해지FORCE_UNSUBSCRIPTION회차 시작START_ROUND회차 종료END_ROUND구독 신청 시작 (심사 후 승인형 Only)REQUEST_SUBSCRIPTION구독 신청 취소 (심사 후 승인형 Only)CANCEL_REQUEST_SUBSCRIPTION구독 시작 거절 (심사 후 승인형 Only)REJECT_REQUEST_SUBSCRIPTION비즈 월렛 사용 솔루션즉시 해지솔루션 해지 예약RESERVE_UNSUBSCRIPTION솔루션 해지 예약 취소CANCEL_RESERVE_UNSUBSCRIPTION솔루션 해지END_SUBSCRIPTION솔루션 강제 해지FORCE_UNSUBSCRIPTION구독 신청 시작 (심사 후 승인형 Only)REQUEST_SUBSCRIPTION구독 신청 취소 (심사 후 승인형 Only)CANCEL_REQUEST_SUBSCRIPTION구독 신청 거절 (심사 후 승인형 Only)REJECT_REQUEST_SUBSCRIPTION회차 시작START_ROUND회차 종료END_ROUND솔루션 업그레이드UPGRADE솔루션 다운그레이드 예약RESERVE_DOWNGRADE솔루션 다운그레이드 취소CANCEL_RESERVE_DOWNGRADE솔루션 다운그레이드DOWNGRADE결제 실패PAYMENT_FAIL결제 성공PAYMENT_SUCCESS환불 완료REFUND_SUCCESS조건부 해지TBDTBD

연동 개발 가이드​

이벤트 훅 API URL의 도메인과 경로는 솔루션사 재량으로 결정합니다.

이벤트 훅은 1회 호출에 1개 이상의 이벤트 객체가 배열 형태로 전달됩니다. 최상위 노드가 배열 형태임을 감안하여 다수의 이벤트 객체를 동시에 처리할 수 있는 구조로 설계해야 합니다.

인증 (Authorization)​

커머스솔루션마켓에서 발생한 이벤트 훅 API 호출은 유효한 HTTP 호출임을 증명하기 위해, 솔루션사가 사전에 전달한 키 이름과 키 값을  HTTP 헤더에 포함합니다.

솔루션사는 이벤트 훅 API 개발 시 HTTP 헤더의 키 값을 인증하는 방식의 보안 설계를 적용하고, URL 등록 요청 시 키 이름과 키 값을 함께 전달해야 합니다.

Payload 샘플​

[
    {
        "eventId": "string",
        "accountId": "string",
        "accountUid": "string",
        "solutionId": "string",
        "subscriptionStatus": "string",             // 현재 판매자의 솔루션 구독 상태
        "accountMappingId": "string",               // 사용 승인 API 호출 시 솔루션 업체에서 발급한 판매자 식별자
        "plan": {
            "id": "string",                         // 요금제 ID
            "grade": "null|FREE|START|PLUS|PRO",    // 요금제 등급
        },
        "beforePlan": object(Plan),                 // 요금 변경 유형 이벤트인 경우 변경 전 요금제
        "afterPlan": object(Plan),                  // 요금 변경 유형 이벤트인 경우 변경 후(예정) 요금제
        "round": integer,                           // 구독 회차
        "changeType": "string",                     // 이벤트 유형 구분 (예: "END_SUBSCRIPTION")
        "createdDate" : "Date"                      // 데이터 생성일
        "eventDate": "Date"                         // 이벤트 훅 발생일 (데이터 생성일보다 늦을 수 있음)
    }
]

제공하는 정보​

기본 필드는 모든 호출에 기본적으로 포함되고 이벤트별 추가 필드는 이벤트 유형에 따라 필드의 포함 여부가 달라집니다.

기본 필드

필드 이름필드 구분solutionId솔루션 IDeventId이벤트 IDaccountId판매자 계정 IDaccountUid판매자 계정 UIDchangeType이벤트 유형createdDate데이터 생성일eventDate이벤트 훅 발생일subscriptionStatus판매자의 구독 상태plan이벤트 발생 적용 요금제(플랜)accountMappingId솔루션 계정 매핑 ID
 - 대상 판매자의 솔루션 구독 승인 시(사용 승인 API) accountMappingId로 호출한 내용이 전달됩니다.
 - 솔루션 시스템에서 대상 판매자를 구분하는 용도로 활용할 수 있습니다.

추가 제공 필드

이벤트 훅 이름이벤트 훅 changeType 표시 값이벤트 의미파라미터 이름스트링 내 표시솔루션 구독 신청 시작REQUEST_SUBSCRIPTION판매자가 심사 후 승인형 솔루션(커머스ID인증 포함)솔루션을 신규 구독 신청함
(구독 대기 상태)솔루션 구독 신청 취소CANCEL_REQUEST_SUBSCRIPTION판매자가 심사 후 승인형 솔루션(커머스ID인증 포함)솔루션을 신규 구독 신청을 취소함
(구독 취소 상태)솔루션 구독 신청 거절REJECT_REQUEST_SUBSCRIPTION커머스솔루션마켓에서 판매자가 솔루션을 신규 구독 신청 시 솔루션 개발사에서 '사용 시작 거절 API' 호출 처리를 통해 구독을 거절하거나 솔루션 개발사의 승인 및 거절 없이, 판매자의 구독 신청 90일이 경과하여 커머스솔루션마켓에서 자동으로 구독이 거절됨솔루션 해지 예약RESERVE_UNSUBSCRIPTION판매자가 유료 솔루션 구독 해지를 예약함예약 적용 일시reserveApplyDate
(예: 4월 19일 0시에 해지되는 경우 UTC시간 기준으로 2023-04-18 15:00:00으로 표시)솔루션 해지 예약 취소CANCEL_RESERVE_UNSUBSCRIPTION판매자가 유료 솔루션 구독 해지를 취소함솔루션 해지END_SUBSCRIPTION판매자의 솔루션 해지가 완료됨솔루션 해지 요청REQUEST_UNSUBSCRIPTION판매자가 솔루션을 해지 요청한 상태로, 구독 상태가 해지 대기 상태가 됨현 회차 종료일roundEndDate솔루션 해지 요청 취소CANCEL_REQUEST_UNSUBSCRIPTION판매자가 솔루션을 해지 요청했다가 해지를 취소함솔루션 강제 해지FORCE_UNSUBSCRIPTION판매자가 솔루션 해지를 요청하지 않았으나, 아래의 이유로 강제로 해지됨
개발사가 직접 사용 중지 API 호출판매자의 정기 결제 최종 실패
이벤트 변경 구분eventChangeType
개발사가 직접 사용 중지 API 호출 시: API_OPERATION판매자의 정기 결제 최종 실패 시: LAST_PAYMENT_FAILED
사유reason
(예: 정기 결제 최종 실패 시, "정기 결제 최종 실패" 로 전송)회차 시작START_ROUND판매자의 구독 회차가 새로 시작됨현 회차round
(1부터 시작, 0: 무료)현 회차 시작일roundStartDate현 회차 종료일roundEndDate회차 종료END_ROUND판매자의 이번 구독 회차가 종료됨종료된 회차round
(1부터 시작, 0: 무료)종료된 회차 시작일roundStartDate종료된 회차 종료일roundEndDate업그레이드UPGRADE판매자가 솔루션 구독 플랜을 업그레이드함변경 전 요금제beforePlan변경 전 플랜 IDid변경 전 플랜 이름name변경 전 플랜 등급grade변경 후 요금제afterPlan변경 후 플랜 IDid변경 후 플랜 이름name변경 후 플랜 등급grade현 회차round
(1부터 시작, 0: 무료)다운그레이드 예약RESERVE_DOWNGRADE판매자가 솔루션 구독 플랜을 다운그레이드하도록 예약함변경 전 요금제beforePlan변경 전 플랜 IDid변경 전 플랜 이름name변경 전 플랜 등급grade변경 후 요금제afterPlan변경 후 플랜 IDid변경 후 플랜 이름name변경 후 플랜 등급grade현 회차round
(1부터 시작, 0: 무료)예약 적용 일시reserveApplyDate다운그레이드 예약 취소CANCEL_RESERVE_DOWNGRADE판매자가 솔루션 구독 플랜을 다운그레이드하도록 예약 취소함다운그레이드DOWNGRADE판매자의 솔루션 구독 플랜 다운그레이드가 완료됨변경 전 요금제beforePlan변경 전 플랜 IDid변경 전 플랜 이름name변경 전 플랜 등급grade변경 후 요금제afterPlan변경 후 플랜 IDid변경 후 플랜 이름name변경 후 플랜 등급grade현 회차round
(1부터 시작, 0: 무료)결제 실패PAYMENT_FAIL판매자의 솔루션 사용 요금 정기 결제가 실패함사유reason결제 실패 건 IDtransactionId결제 유형 구분transactionType총 금액totalAmount결제 대상 요금제billingPlan결제 성공PAYMENT_SUCCESS판매자의 솔루션 사용 요금 월 정기 결제가 성공함결제 건 IDtransactionId결제 유형 구분transactionType총 금액totalAmount결제 대상 요금제billingPlan환불 완료REFUND_SUCCESS판매자에게 환불이 완료됨결제 건 IDtransactionId결제 유형 구분transactionType총 금액totalAmount결제 대상 요금제billingPlan

설계 시 주의사항​

이벤트 객체는 솔루션(solutionId)별, 판매자 계정 UID(accountUid)별 이벤트 전달 순서가 보장됩니다.

1개 솔루션에 발생 이벤트별로 서로 다른 엔드포인트(API URL)를 설정할 수 있습니다.

특정 이벤트의 엔드포인트에서 API 호출에 대한 응답으로 성공 응답(200 status code) 외 다른 코드가 응답되면 동일 이벤트 유형의 이벤트 훅 호출은 중단됩니다.

이 경우 커머스솔루션마켓 시스템은 전달에 실패한 이벤트 훅 데이터 호출을 재시도(retry)합니다.

재시도로 성공 응답을 확인한 경우 쌓여있는 다음 이벤트 훅 데이터들을 모아서 전달합니다.

이벤트 훅 데이터는 기본적으로 이벤트 ID(eventId)에 따라 고유합니다. 그러나 특정 상황에서 이벤트 ID가 다른 동일 이벤트 데이터가 중복 전송될 수 있습니다. 이벤트 훅 API는 동일 요청 건이 중복 처리되지 않도록 멱동성 있게 개발되어야 합니다.

KNOWN ISSUE : 구독자가 솔루션 해지 시, END_ROUND 이벤트와 END_SUBSCRIPTION 이벤트가 같은 eventId로 나갈 수 있습니다. (수정 예정)

이벤트 훅 개발을 완료하면, ▼아래의 예시 내 {{변수}} 값 변경 후 호출을 시도했을 때 정상적으로 훅이 수신되면 등록이 가능합니다.

curl -X POST `{{이벤트훅 수신할 URL}}` -H '`{{인증헤더명}}`: `{{인증키값}}`' -H 'Content-Type: application/json' -d '[ { "accountUid": "`{{테스트용 판매자 UID}}`", "accountId": "ncp_01234_sp", "round": 1, "solutionId": "ThfFnTusDkDlEl1234567890", "plan": { "id": "VmfFosDkDlEl1234567890", "name": "무료", "grade": "FREE" }, "createdDate": "2023-06-02T12:43:23.447+0000", "eventDate": "2023-06-07T08:47:30.849+0000", "applicationId": "DoVmfFlZpDlTus012345", "eventId": "testevent01234", "changeType": "END_SUBSCRIPTION", "subscriptionStatus": "UNSUBSCRIBED" } ]'
