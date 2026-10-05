<!-- https://apicenter.commerce.naver.com/docs/solution-doc/3000/%EA%B8%B0%EB%B3%B8-%EC%97%B0%EB%8F%99-%EC%9A%94%EC%86%8C-%EA%B0%80%EC%9D%B4%EB%93%9C -->
# 기본 연동 요소 가이드 | 커머스API

On this page
기본 연동 요소 가이드
솔루션 구독자 식별​

JWT (JSON Web Token)​

이 문서는 '바로 사용' 형 솔루션의 구독을 신청한 판매자 또는 구독중인 판매자의 정보가 담긴 JWT의 구성요소를 설명하고 있습니다.

JWT는 커머스솔루션마켓 또는 스마트스토어센터 솔루션목록에서 판매자가 [신청하기] 또는 [사용하기] 버튼 클릭 시 솔루션 페이지로 이동하며 전달됩니다.

안전한 JWT 사용을 위해 토큰값의 유효성 검증 등 추가 대응 절차가 반드시 반영되어야 합니다. 하단의 ⚠ JWT 이용 주의사항 영역을 참조하시길 바랍니다.

JWT 구성 정보​

HEADER

파라미터 명의미비고alg알고리즘JWT 서명값 생성 시 사용한 알고리즘을 표현합니다.
JWT 검증 시 대상 알고리즘으로 유효성 검증을 해야 합니다.

PAYLOAD

파라미터 명의미비고issJWT 발급자고정 값으로만 표현됩니다.
▸ 값: "merc"subJWT 발급 상세 유형고정 값으로만 표현됩니다.
▸ 값: "SELLER_INFO"iatJWT 발급 일시생성된 JWT의 생성 일시를 초 단위까지 표현합니다. (UNIX Time 형식)expJWT 만료 일시생성된 JWT의 만료 일시를 초 단위로 표현합니다. (UNIX Time 형식)
대상 JWT는 '발급 일시(iat)'서부터 '만료 일시(exp)'까지만 유효합니다.
▸ JWT 처리 시점이 대상 JWT의 만료 일시 값 이후 시점인 경우 해당 JWT는 유효하지 않습니다.
▸ 통상적인 JWT 토큰 값은 생성 이후 60초간 유효합니다. (단, 사용 특성에 따라 만료 일시는 변동될 수 있습니다.)solutionId솔루션ID판매자가 사용하려는 솔루션의 ID를 표현합니다.accontUid스마트스토어 계정 UID개별 스토어를 구분하는 용도로 표현합니다.
▸ 이 값은 각 스토어 별로 고유한 값으로 사용자/스토어 매핑을 위한 키 값으로 활용할 수 있습니다.roleGroupType판매자 '매니저 권한' 유형솔루션을 사용하려는 판매자가 스마트스토어 내 보유한 '매니저 권한' 유형을 표현합니다.
매니저 권한 분류:
▸ REPRESENT (통합 매니저)
▸ MANAGER_GORUP (그룹 매니저)
▸ ACCOUNT (주 매니저)
▸ ACCOUNT_SUB (부 매니저) → 커머스솔루션 구독/사용 불가능
매니저 권한 도움말 보기 : 매니저별 권한이 어떻게 되나요?channelName스마트스토어 이름 (대표 채널명)판매자가 솔루션 구독 대상으로 지정한 스토어의 이름을 표현합니다.
대상 스토어 계정이 다수의 전시 채널(스마트스토어/쇼핑윈도)을 보유한 경우 대표 전시 채널로 설정한 1개 이름이 제공됩니다.
▸ 도움말 보기: 스마트스토어 판매자 비즈니스-계정-채널 구조 공식 매뉴얼representImageUrl스토어 대표 이미지 URL판매자가 솔루션 구독 대상으로 지정한 스토어의 대표 이미지 URL을 표현합니다.
스토어 대표 이미지가 설정되지 않은 경우 이 값은 null입니다.defaultChannelNo대표 채널 번호판매자가 솔루션 구독 대상으로 지정한 스토어에 설정한 대표 전시 채널의 채널 번호를 표현합니다.
▸ 도움말 보기: 스마트스토어 판매자 비즈니스-스토어(계정)-채널 구조 공식 매뉴얼type대표 채널 유형판매자가 솔루션 구독 대상으로 지정한 스토어의 대표 전시 채널 유형을 표현합니다.
▸ STOREFARM : 스마트스토어 채널 유형
▸ WINDOW : 쇼핑윈도 채널 유형url대표 채널 스토어URL판매자가 솔루션 구독 대상으로 지정한 스토어 계정의 대표 전시 채널 URL을 표현합니다.categoryId대표 판매 카테고리솔루션 구독 대상 스마트스토어의 대표 판매 카테고리를 표현합니다.
이 값은 판매자가 스마트스토어 가입 시 선택한 값입니다.representType판매자 유형판매자의 유형을 표현합니다.
판매자 유형 구분:
▸ DOMESTIC_PERSONAL (국내 개인)
▸ DOMESTIC_BUSINESS (국내 사업자)
▸ OVERSEAS_PERSONAL (해외 개인)
▸ OVERSEAS_BUSINESS (해외 사업자)businessType사업자 유형판매자의 사업자 유형을 표현합니다. (판매자 유형이 '국내 사업자'인 경우만 제공)
사업자 유형 구분:
▸ CORPORATION (법인 사업자)
▸ PRIVATE (개인 사업자)
▸ SIMPLE (간이 사업자)businessRegisterationNumber사업자 번호판매자의 사업자 번호를 표현합니다. (판매자 유형이 '국내 사업자'인 경우만 제공)actionGrade판매자 등급판매자가 솔루션 구독 대상으로 지정한 스토어의 등급을 표현합니다.
판매자 등급 산정 기준 도움말 보기 : 판매자 등급 산정 기준이 어떻게 되나요?
판매자 등급 구분:
▸ ZERO (플래티넘)
▸ FIRST (프리미엄)
▸ SECOND (빅파워)
▸ THIRD (파워)
▸ FOURTH (새싹)
▸ FIFTH (씨앗)planId솔루션 요금제ID판매자가 구독중인 솔루션 요금제 ID 값을 표현합니다.
대상 사용자의 '솔루션 사용 상태'가 <구독중>일 때에만 제공합니다.
▸ <결제실패중> 등과 같이 사용에 준하는 상태일 때에도 제공합니다.subscriptionId솔루션 사용ID판매자의 솔루션 사용 라이프 사이클을 구분하는 ID 값을 표현합니다.
사용 신청 ~ 해지)이 값은 판매자가 솔루션 사용 신청 시 최초로 생성되며, 해지 이전까지 동일 값으로 계속 유지됩니다.
해지 후 재사용을 신청할 경우 이전과는 다른 ID 값으로 제공합니다.round솔루션 현재 사용 회차 정보판매자의 솔루션 이용요금 결제 주기에 따른 현재 회차 정보를 표현합니다.
판매자의 '솔루션 사용 상태'가 <구독중>일 때에만 제공합니다.
▸ 무료 이용 회차인 경우 이 필드 값은 0으로 제공됩니다.roundEndDate솔루션 현재 사용 회차 종료일판매자의 솔루션 이용요금 결제 주기에 따른 현재 회차의 종료일시를 표현합니다.
UNIX Time 형식: 밀리초 단위까지 표현합니다. (13자리)downgradeTargetRound다운그레이드 예정 회차판매자가 사용하는 솔루션 요금제의 다운그레이드 전환 예정 회차를 표현합니다.
솔루션 요금제의 다운그레이드를 예약한 경우만 제공합니다.downgradePlanId다운그레이드 예정 요금제ID판매자가 사용하는 솔루션 요금제의 다운그레이드 전환 예정 요금제 ID를 표현합니다.
솔루션 요금제의 다운그레이드를 예약한 경우만 제공합니다.status솔루션 사용 상태판매자의 솔루션 사용 상태를 표현합니다.
▸ 도움말 보기: [가이드] 커머스솔루션의 상태 관련 정보

JWT 토큰/디코드 샘플​

토큰 값

eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJtZXJjIiwic3ViIjoiU0VMTEVSX0lORk8iLCJleHAiOjE3MDQ4NzY1NzAsImlhdCI6MTcwNDg3NjUxMCwic29sdXRpb25JZCI6IlVCc080dGQ1akVibDZ3Zm53WnI2RyIsImFjY291bnRVaWQiOiJ0ZXN0QWNjb3VudFVpZCIsInJvbGVHcm91cFR5cGUiOiJBQ0NPVU5UIiwiY2hhbm5lbE5hbWUiOiLsiqTthqDslrQg7J2066aEIiwiZGVmYXVsdENoYW5uZWxObyI6MTU0OCwidHlwZSI6IldJTkRPVyIsInVybCI6InVybCIsInJlcHJlc2VudEltYWdlVXJsIjoid3d3Lm5hdmVyLmNvbSIsImNhdGVnb3J5SWQiOiJjYXRlZ29yeUlkIiwicmVwcmVzZW50VHlwZSI6IkRPTUVTVElDX0JVU0lORVNTIiwiYnVzaW5lc3NUeXBlIjoiQ09SUE9SQVRJT04iLCJhY3Rpb25HcmFkZSI6IlRISVJEIiwic2VydmljZVNhdGlzZmFjdGlvbkdyYWRlIjpmYWxzZSwicGxhbklkIjoiSlVOSVRfUExBTl9JRF8wMDAiLCJzdWJzY3JpcHRpb25JZCI6InlOa205bkdCU1REV0R0TGJ0OWlDVyIsInJvdW5kIjoxLCJyb3VuZEVuZERhdGUiOjE3MDc0Njg1MTA1NDUsInN0YXR1cyI6IlNVQlNDUklCSU5HIn0.aCG1NS73OSP76jAfDDfIzMA6OAY-R_FItdb4l-I4iJEcobfFzWBnc4DWWtfv8PehpQSr2o_wrnneudKyescHLF263OY35G4VjojuwDKpzjB_Zki61Jdo2D1GU1C4VJ5Wg2KUXnpCfu9yWddOASd4PWNHcDgC3dXFEfRdYhoUOzU_VG9ArPXm1TZZNQTAf7-QwPb9sQ0ESW45_CYcxAEowjOg8P5D2tBxlO2MgmYnhl4BRbalkNUmjJ6rjwM-kSPINuOeiiIs7igikzP2uzDohvW2jiR2ysed4ZxRapbdvAwZo-SaSMWsovsVzyL8OWK8kBXIbyNZV1VJspcJkBB7IQ

디코드 결과

HEADER

{
  "alg": "RS256"
}

PAYLOAD

{
  "iss": "merc",
  "sub": "SELLER_INFO",
  "exp": 1704876570,
  "iat": 1704876510,
  "solutionId": "UBsO4td5jEbl6wfnwZr6G",
  "accountUid": "testAccountUid",
  "roleGroupType": "ACCOUNT",
  "channelName": "스토어 이름",
  "defaultChannelNo": 1548,
  "type": "WINDOW",
  "url": "url",
  "representImageUrl": "www.naver.com",
  "categoryId": "categoryId",
  "representType": "DOMESTIC_BUSINESS",
  "businessType": "CORPORATION",
  "actionGrade": "THIRD",
  "planId": "JUNIT_PLAN_ID_000",
  "subscriptionId": "yNkm9nGBSTDWDtLbt9iCW",
  "round": 1,
  "roundEndDate": 1707468510545,
  "status": "SUBSCRIBING"
}

JAVA 샘플코드 ( 검증 후 body(claim)값 가져오기 )​

public static Map`<String, Object>` getClaimWithVerify(String publicBase64, String jwt, String issuer, String subjectType){
    JwtConsumer jwtConsumer = null;
    try {
        jwtConsumer = new JwtConsumerBuilder()
            .setRequireExpirationTime()
            .setExpectedIssuer(issuer)
            .setExpectedSubject(subjectType)
            .setVerificationKey(RsaUtil.toPublicKeyFromBase64(publicBase64))
            .setJwsAlgorithmConstraints(
                AlgorithmConstraints.ConstraintType.PERMIT, AlgorithmIdentifiers.RSA_USING_SHA256) // which is only RS256 here
            .build();
    } catch (InvalidKeySpecException | NoSuchAlgorithmException e) {
        log.error(e.getMessage(), e);
        throw new ServerException(ServerErrorCode.CRYPTO_FAILURE, "JWT publicKey verify exception", e);
    }

    try {
        //  Validate the JWT and process it to the Claims
        JwtClaims jwtClaims = jwtConsumer.processToClaims(jwt);
        log.debug("JWT validation succeeded! " + jwtClaims);
        return jwtClaims.getClaimsMap();
    } catch (InvalidJwtException e) {
        String code = "Invalid JWT";
        String errorMsg = "Invalid JWT! " + e.getMessage();
        log.debug(errorMsg, e);

        if (e.hasExpired()) {
            code = "JWT expired";
            try {
                errorMsg = "JWT expired at " + e.getJwtContext().getJwtClaims().getExpirationTime();
                log.debug(errorMsg);
            } catch (MalformedClaimException malformedClaimException) {
                errorMsg = malformedClaimException.getMessage();
                log.error(malformedClaimException.getMessage(), malformedClaimException);
            }
        }
        throw new ClientException(ClientErrorCode.BAD_REQUEST, String.format("%s - %s", code, errorMsg), e);
    }
}

⚠ JWT 이용 주의사항​

JWT 이용 솔루션은 아래 내용을 반드시 포함하여 구현하여야 합니다.

솔루션은 JWT 수신 시 아래 3가지를 검증하여 대상 토큰의 유효성을 검증해야 합니다.

아래 3가지 유효성 검증이 모두 유효한 경우에만 대상 토큰 값을 신뢰하여 사용하도록 설계하시기 바랍니다.

검증 후 JWT 내 '스마트스토어 계정 UID(accountUid)'을 이용하여 개별 사용자를 구분하는 기준 식별자로 활용할 수 있도록 구현해야합니다.

또한, 검증 항목 중 어느 하나라도 검증에 실패한 경우 사용자를 아래 URL로 즉시 이동(Redirect)시켜야 합니다.

https://solution.smartstore.naver.com/ko/error

JWT 토큰 검증​

1. 제공받은 '솔루션 공개키(Public Key)'를 활용하여 토큰 값의 시그니처 검증 후 유효한 경우에만 신뢰해야 합니다.

솔루션 공개키는 솔루션 별로 다른 값을 제공합니다.

솔루션 공개키를 이용하여 시그니처 검증에 실패한 경우 커머스솔루션마켓에서 발행한 유효한 토큰이 아닙니다.

2. 수신 일시가 'JWT 발급 일시(iat)` 이후이며, 'JWT 만료 일시(exp)' 이전인 경우에만 신뢰해야 합니다.

수신 일시 기준은 솔루션 시스템의 시간을 참조하도록 하며, NTP(Network Time Protocol) 서비스를 활성화하여 수시로 표준시와 동기화하도록 유지해주시기 바랍니다.

'JWT 발급 일시(iat)' 이전에 전달된 토큰 값은 유효한 토큰이 아닙니다.

'JWT 만료 일시(exp)' 이후에 전달된 토큰 값은 유효한 토큰이 아닙니다.

'JWT 발급 일시'와 'JWT 만료 일시'의 시간차는 기본적으로 60초입니다.

3. JWT 내 솔루션 ID가 사용자가 사용하려는 정상적인 솔루션인 경우에만 신뢰해야합니다.

현재 운영중이지 않은 솔루션 ID인 경우 유효한 토큰이 아닙니다.

여러 솔루션을 운영중인 경우 JWT 내 솔루션 ID와 판매자가 사용하려는 솔루션이 동일 솔루션인지 검증해야 합니다.

사용 해지​

사용 해지 유형​

솔루션의 해지 유형은 다음과 같으며 1개 유형을 사전에 선택해야 합니다.

즉시 해지 유형: 판매자가 솔루션 해지를 요청하면 즉시 해지가 완료됩니다.

조건부 해지 유형: 판매자가 솔루션 해지를 요청하면 솔루션에서 해지 요청을 승인하는 시점에 해지가 완료됩니다.

(참고) '사용 중지 환불 API'는 구독자의 솔루션 사용을 즉시 해지합니다. 이는 솔루션 해지 유형 구분(즉시 해지/조건부 해지)과 관련없이 동일하게 동작합니다.

'네이버페이 비즈월렛'을 이용하여 커머스솔루션마켓 내 결제를 진행하는 유료 솔루션은 '사용 중지 환불 API' 호출일 기준으로 사용 회차 내 이용일이 일할계산되어 솔루션 개발사 정산 및 구독자 환불이 진행됩니다.

해당하는 케이스에서 이벤트훅 데이터 내 이벤트 유형은 '강제 해지(FORCE_UNSUBSCRIPTION)' 유형으로 정보가 제공됩니다.

즉시 해지 유형의 해지 프로세스​

판매자가 솔루션 해지 요청 시 이벤트 훅이 발생합니다.

요청 즉시 솔루션 해지가 완료되므로 이벤트 훅 수신 후 솔루션 사이트에서는 더 이상 API로 판매자 정보를 조회할 수 없습니다.

조건부 해지 유형의 해지 프로세스​

판매자가 솔루션 해지 요청 시 이벤트 훅이 발생합니다.

솔루션 사이트는 대상 판매자의 솔루션 해지 처리가 가능한 시점에 사용 해지 승인 API를 호출하여 해지 요청을 승인해야 합니다.

⚠️ 조건부 해지 유형의 솔루션은 네이버페이 비즈 월렛을 이용한 결제 연동이 불가능합니다.

커머스API 인증 토큰 발급​

커머스API 인증 토큰 유형​

커머스API를 호출하려면 먼저 인증 토큰 발급 요청 API를 호출하여 인증 토큰을 발급받아야 합니다. 이때 인증 토큰 유형(type)에 따라 발급받는 인증 토큰의 리소스 권한이 결정됩니다.

인증 토큰 유형권한사용 가능 API 예시SELF솔루션사 시스템 전용 API▸ JWE 해석 API
 ▸ 사용 승인 API
 ▸ 사용 해지 승인 APISELLER솔루션을 구독중인 판매자의 스마트스토어 데이터에 접근하여 명령을 수행하는 API▸ 상품 관리 관련 API
 ▸ 주문 수집/처리 관련 API
 ▸ 판매자 주소록 관련 API

인증 토큰 유효 시간​

기본 유효 시간: 180분

유효 시간 만료 시 해당 인증 토큰으로는 API 호출 불가

남은 유효 시간이 30분 미만인 경우 새 인증 토큰 발급 가능

기존 인증 토큰은 유효 시간 만료 이전까지 사용 가능

SELLER 유형 인증 토큰은 판매자(account_id)별로 별도 유효 시간 산정

인증 토큰 발급 요청 API 호출 URL 예시​

호출 API: [인증] 인증 토큰 발급 요청 (POST /v1/oauth2/token)

POST /external/v1/oauth2/token HTTP/1.1
Host: api.commerce.naver.com
Content-Type: application/x-www-form-urlencoded

인증 토큰 유형Request body (POST Payload)SELFclient_id={{솔루션 애플리케이션 ID}}&timestamp={{api_timestamp}}&client_secret_sign={{api_signature}}&grant_type=client_credentials&type=SELFSELLERclient_id={{솔루션 애플리케이션 ID}}&timestamp={{api_timestamp}}&client_secret_sign={{api_signature}}&grant_type=client_credentials&type=SELLER&account_id={{판매자 UID}}

커머스솔루션 상태 정보​

커머스솔루션마켓의 솔루션 노출 상태​

상태의미커머스솔루션 플랫폼 정책솔루션 개발사가 취할 수 있는 행동마켓 노출 중- 대상 솔루션이 커머스솔루션마켓에 신규 구독 가능하도록 표시됨
 - 모든 판매자가 대상 솔루션 소개 페이지에 접근하여 구독/구독 신청 가능-마켓 노출 중 → 마켓 노출 일시 중단 변경을 요청할 수 있습니다.마켓 노출 일시 중단- 대상 솔루션이 커머스솔루션마켓에 표시되지 않음
 - 구독하지 않은 판매자는 대상 솔루션 소개 페이지에 접근 불가현재 구독 대기 혹은 구독중 상태인 판매자는 노출 상태 구분과 관계없이 대상 솔루션의 소개 페이지에 접근하거나 구독중인 솔루션을 이용할 수 있습니다.마켓 노출 일시 중단 → 마켓 노출 중 변경을 요청할 수 있습니다.

판매자의 솔루션 구독 상태​

상태파라미터 값판매자의 솔루션 사용의미커머스솔루션 플랫폼 정책판매자가 취할 수 있는 행동미사용불가능판매자가 대상 솔루션을 한 번도 구독 신청한 적이 없는 상태--구독 대기WAITING_SUBSCRIPTION불가능판매자가 솔루션 구독을 신청했으나 아직 사용 승인 처리되지 않은 상태.
 판매자 커머스ID 인증과 솔루션의 사용 승인 API 호출 처리가 필요한 상태입니다.솔루션 중 판매자 인증 진행이 필요한 솔루션에서만 사용판매자 커머스ID 인증을 진행하여 구독 신청을 마무리하거나, 신청을 취소할 수 있습니다.구독 취소CANCEL_SUBSCRIPTION불가능판매자가 솔루션 구독을 신청하였으나
①'사용 승인' 처리 이전 사용자가 직접 구독 신청을 취소하거나,
②솔루션 개발사에서 '사용 시작 거절 API' 호출 처리를 통해 구독을 거절하거나,
③'구독 대기' 상태로 90일이 경과하여 커머스솔루션마켓에서 자동으로 사용이 거절된 상태입니다.솔루션 중 판매자 인증 진행이 필요한 솔루션에서만 사용커머스솔루션마켓에서 솔루션 구독을 다시 신청할 수 있습니다.구독중SUBSCRIBING가능판매자가 솔루션을 정상적으로 사용 중인 상태-커머스솔루션마켓에서 솔루션 구독을 해지할 수 있습니다.결제 실패중ON_PAYMENT_FAIL가능솔루션을 구독중인 판매자가 솔루션 요금제 결제에 실패하고 있는 상태월 사용 요금이 유료인 요금제를 구독중인 판매자인 경우에만 발생- 구독 다음 회차 시작일 도래 전 비즈월렛 충전, 또는 자동 충전 설정 통해 다음 회차 요금제 결제를 진행할 수 있습니다.
- 구독 다음 회차 시작일의 전일 23:30 최종 결제 시도까지 실패할 경우 솔루션 구독이 해지됩니다.해지 요청중WAITING_UNSUBSCRIPTION가능판매자가 솔루션 구독 해지를 신청하였으나 아직 해지 완료 처리되지 않은 상태.
 판매자의 스토어 정보를 커머스API로 호출 가능한 상태입니다(구독중 상태와 동일).
 해지 승인 API 호출이 정상 처리되면 해지 완료 상태로 변경됩니다.조건부 해지형 솔루션에서만 사용
 권장 승인 기한: 회차 종료일(roundEndDate) 이내커머스솔루션마켓에서 솔루션 구독 해지 신청을 취소할 수 있습니다.해지 완료UNSUBSCRIBED불가능판매자의 솔루션 구독이 해지되어 커머스API 호출이 불가능한 상태-커머스솔루션마켓에서 솔루션 구독을 다시 신청할 수 있습니다.

예상 개발 리소스(MD)​

커머스솔루션마켓 등록을 위한 세부적인 연동 과정은 솔루션사 재량으로 개발합니다.

아래의 예상 코스트는 중견 업체에서 관련 영역 개발 경력 3년 이상의 개발자 1인이 타 업무를 배제하고 온전히 커머스솔루션마켓 연동 개발만을 진행할 경우를 가정한 값입니다.

QA 기간 제외, 조건 및 연동 환경에 따라 실제와 다를 수 있음

구분개발 항목목적예상 코스트필수커머스ID 인증 창 활용 구조 개발솔루션 사이트 화면에서 솔루션을 사용하는 판매자의 인증 취득프런트엔드 - 5MD선택ㄴ간편 로그인 연계솔루션 회원 체계에 적합한 간편 로그인 인증 방식 제공예측 불가필수솔루션 애플리케이션 인증 연동커머스API를 호출하기 위한 인증 서버 환경 구축서버 - 5MD선택ㄴ기존에 제휴 등 애플리케이션 연동 이력이 있는 경우변경된 솔루션 애플리케이션 인증 정보를 사용하도록 ID/Secret 치환위의 5MD에서 2MD로 감소필수솔루션 전용 API 연동JWE 해석 API, 사용 승인 API, 사용 해지 승인 API 연동서버 - 5MD선택ㄴ판매자 정보 호출용 커머스API 연동솔루션의 성격에 맞는 커머스API 호출 개발 진행예측 불가필수이벤트 훅 수신 구조 구축커머스솔루션마켓에서 발생하는 다양한 이벤트를 수신하는 구조 연동서버 - 5MD선택ㄴ이벤트 훅 수신 후 후처리 개발수신한 이벤트 훅에 대응하는 후처리를 위한 개발예측 불가
