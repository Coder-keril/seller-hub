<!-- https://apicenter.commerce.naver.com/docs/commerce-api/current/get-logistics-companies-nfa -->
# 물류사 연동 정보 조회 | 커머스API

물류사 연동 정보 조회

GET /v1/logistics/logistics-companies

판매자 계정이 물류데이터플랫폼에서 연동 중인 물류사에 대해 물류사 ID, 물류사명을 조회합니다.

Responses​
200400404500

OK

유효성 검사 오류

code: invalid_input

잘못된 API 주소 또는 리소스를 찾을 수 없는 경우

code: not_found

API 처리 중 오류 발생

code: server_error
