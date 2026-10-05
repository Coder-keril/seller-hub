/**
 * 서비스 표시명과 공개 주소. **브랜드가 코드에 박히는 지점은 이 파일 하나다.**
 *
 * DB 스키마·API 경로에는 브랜드명을 쓰지 않는다(`CLAUDE.md` 용어 규약) — 리브랜딩이
 * 환경변수 두 줄로 끝나야 하기 때문이다. 화면 세 곳이 각자 `process.env.APP_NAME` 을
 * 읽고 있었는데, 폴백 문자열이 세 벌로 갈라지므로 여기로 모았다.
 *
 * `APP_URL` 은 **공개 주소**다(프록시 뒤의 내부 호스트가 아니다). 절대 URL 이 필요한 곳
 * — `metadataBase`, 메일 링크 — 에서 쓴다.
 */
export const APP_NAME = process.env.APP_NAME ?? "Merrycoco Lab";
export const APP_URL = process.env.APP_URL ?? "https://lab.merrycoco.co.kr";

/**
 * 이 사이트가 하는 일. 상품등록 대행이 아니라 **판매자가 숫자를 파악하게 돕는 쪽**이다 —
 * 마진 계산 · 판매 데이터 분석 · 원가 연구. 탭 설명과 로그인 화면이 같은 문장을 쓴다.
 */
export const APP_TAGLINE = "마진 계산 · 판매 데이터 분석 · 원가 연구";
