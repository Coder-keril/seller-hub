<!-- https://apicenter.commerce.naver.com/docs/commerce-api/current/get-page-addresses-sellers -->
# 주소록 목록 조회 | 커머스API

주소록 목록 조회

GET /v1/seller/addressbooks-for-page

주소록을 페이징 형식의 목록으로 조회하는 API입니다. 조회 대상 판매자 번호에 대한 인증 토큰이 필요합니다.

페이지당 데이터 개수는 100개로 고정되어 있습니다.

Request​

Responses​
200400401403404500

성공

Bad Request

코드설명GENERAL_ERROR처리되지 않은 오류

Unauthorized

코드설명UNAUTHORIZED접근 권한이 없음

Forbidden

코드설명ROLE_NOT_FOUND권한 없음PROVISION_NOT_FOUND약관 동의 필요INVALID_CHANNEL_STATUS유효하지 않는 채널 상태INVALID_STORE_STATUS유효하지 않은 스토어 상태INVALID_REPRESENT_STATUS유효하지 않은 대표 상태INVALID_MEMBER_STATUS유효하지 않은 회원 상태INVALID_INTERLOCK_STATUS유효하지 않은 연동 상태RESOURCE_NOT_AVAILABLE접근할 수 없는 자원

Not Found

코드설명CHANNEL_NOT_FOUND유효하지 않은 채널 번호STORE_NOT_FOUND유효하지 않은 스토어 번호REPRESENT_NOT_FOUND유효하지 않은 대표 번호MEMBER_NOT_FOUND유효하지 않은 회원 번호INTERLOCK_NOT_FOUND연동 정보 없음

Internal Server Error

코드설명PARSING_FAIL유효하지 않은 JSON 문법SERDES_FAIL직렬화/역직렬화 실패ENCDEC_FAIL암/복호화 실패GENERAL_ERROR처리되지 않은 오류
