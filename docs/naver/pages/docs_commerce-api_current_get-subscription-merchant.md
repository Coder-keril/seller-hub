<!-- https://apicenter.commerce.naver.com/docs/commerce-api/current/get-subscription-merchant -->
# 사용 상태 조회 | 커머스API

사용 상태 조회

GET /v1/commerce-solutions/subscriptions/:accountUid

사용 상태 조회

Request​

Responses​
200400401402403404406409500503

사용 상태 조회 성공

Bad Request

코드설명비고BAD_REQUEST잘못된 요청NOTTING_TO_CHANGE변경할 사항이 없음CHANGE_COUNT_LIMIT변경 횟수 초과NOT_ALLOW_AFTER_UNSUBSCRIPTION해지 후 허락되지 않은 요청NOT_ALLOW_AFTER_PAYMENT다음 회차 결제 이후 허락되지 않은 요청INVALID_REQUEST_CONDITION유효하지 않은 조건INACTIVE_SOLUTION_REQUESTED비정상 상태인 솔루션에 대한 요청INVALID_SOLUTION유효하지 않은 솔루션에 대한 요청NOT_SUBSCRIBING사용하지 않는 솔루션에 대한 요청NOT_ACCOUNT_AUTHENTICATION미인증 계정INVALID_INPUT유효하지 않은 입력

Unauthorized

코드설명비고INVALID_USER유효하지 않은 사용자INVALID_SELLER_TOKEN유효하지 않은 SELLER 토큰EXPIRED_SELLER_TOKEN만료된 SELLER 토큰

Payment Required

코드설명비고BIZ_WALLET_USE_ERROR비즈월렛 오류

Forbidden

코드설명비고ABNORMAL_ACCOUNT_STATUS비정상 계정으로 접근ACCOUNT_ID_CHANGED요청과 다른 계정으로 접근SOLUTION_CHANGED유효하지 않은 솔루션NOT_SUBSCRIBABLE_SOLUTION_TYPE사용 불가능한 솔루션 유형NOT_AUTHORIZED_ACCOUNT_ROLE인가되지 않은 계정UNAUTHORIZED인가되지 않음ONLY_BETA_GRADE_AVAILABLE베타 요금제에서만 가능JUDGMENT_STATUS_IS_ACQUISITION양도 양수 상태의 계정REQUEST_SUBSCRIPTION_REQUIRED솔루션 사용 신청 필요ALREADY_SUBSCRIBING이미 사용 중인 솔루션NOT_ALLOWED_REFERER유효하지 않은 리퍼러NOT_ALLOWED_ACCOUNT유효하지 않은 계정NOT_ALLOWED_BUSINESS_TYPE유효하지 않은 비즈니스 타입NOT_ALLOWED_BRAND_STORE유효하지 않은 브랜드 스토어NOT_ALLOWED_REPRESENT_TYPE유효하지 않은 대표 타입NOT_ALLOWED_CHANNEL_TYPE유효하지 않은 채널 타입NOT_ALLOWED_GOOD_SERVICE유효하지 않은 굿서비스NOT_ALLOWED_SALE_ACTION_GRADE유효하지 않은 스토어 등급SUBSCRIBING_USER_EXISTS현재 사용자가 존재하여 애플리케이션 변경 불가

Not Found

코드설명비고NOT_FOUND발견되지 않음DATA_NOT_EXIST존재하지 않는 데이터SUBSCRIPTION_NOT_FOUND유효하지 않은 솔루션 사용SOLUTION_NOT_FOUND유효하지 않은 솔루션

Not Acceptable

코드설명비고BLOCK_TIME허용되지 않은 시간PREVENT_REJOIN_SAME_DAY당일 재가입 금지

Conflict

코드설명비고CONDITION_CHANGED유효하지 않은 조건DUPLICATE_SUBSCRIBE중복 사용 불가DUPLICATED_RESOURCE중복 불가

Internal Server Error

코드설명비고CRYPTO_FAILURE암호화/복호화 실패DATABASE_ERROR데이터베이스 오류DATA_ERROR유효하지 않은 데이터INVALID_DATA_STATUS유효하지 않은 상태의 데이터INVALID_INPUT_DATA유효하지 않은 입력 데이터NETWORK_ERROR네트워크 오류BILL_ERROR유효하지 않은 청구서UNKNOWN_ERROR미확인 오류

Service Unavailable

코드설명비고DATABASE_ROS데이터베이스가 읽기 모드 전용
