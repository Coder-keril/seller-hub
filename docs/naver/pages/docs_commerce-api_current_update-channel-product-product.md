<!-- https://apicenter.commerce.naver.com/docs/commerce-api/current/update-channel-product-product -->
# (v2) 채널 상품 수정 | 커머스API

(v2) 채널 상품 수정

PUT /v2/products/channel-products/:channelProductNo

BAD_REQUEST 오류 응답 시, InvalidInputs 필드 정보가 없거나 InvalidInputs 필드만으로 정확한 판단이 어려울 수 있습니다. 이때는 message 내용을 활용한 오류 판단을 권장합니다.
Request​

Responses​
200308400401403404500

성공

리디렉션
- code : PERMANENT_REDIRECT

잘못된 요청
- code : BAD_REQUEST

인가되지 않은 요청
- code : UNAUTHORIZED

권한 없음
- code : FORBIDDEN

데이터 없음
- code : NOT_FOUND

내부 서버 오류
- code : INTERNAL_SERVER_ERROR
