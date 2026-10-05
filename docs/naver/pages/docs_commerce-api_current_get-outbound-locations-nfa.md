<!-- https://apicenter.commerce.naver.com/docs/commerce-api/current/get-outbound-locations-nfa -->
# 판매자 창고 정보 조회 | 커머스API

판매자 창고 정보 조회

GET /v1/logistics/outbound-locations

판매자 계정이 운영 중인 창고에 대한 창고 ID, 창고명, 택배사, 배송 속성을 조회합니다.

Responses​
200400404500

OK

유효성 검사 오류

code: invalid_input

잘못된 API 주소 또는 리소스를 찾을 수 없는 경우

code: not_found

API 처리 중 오류 발생

code: server_error
