-- ═══ 로그인 세션 ═══════════════════════════════════════════════════
--
-- 외부 인증 라이브러리를 쓰지 않는다. 읽어서 이해할 수 있는 최소 구조를 둔다 —
-- 쿠키에 **임의 토큰**, DB 에는 그 토큰의 **해시**만 저장한다.
--
-- ⚠️ **토큰 원본을 저장하지 않는 것이 요점이다.** DB 가 새어도 그것만으로는 세션을 위조할
--    수 없다(비밀번호를 해시로 저장하는 것과 같은 이유다). 조회는 토큰을 해시해서 찾는다.
--
-- 만료는 고정 14일이고 갱신하지 않는다. 쓰는 동안 늘려 주는 rolling 만료가 편하지만,
-- 그만큼 "언제 끊기는가"가 불명확해진다 — 필요해지면 그때 더한다.
create table app_session (
  token_hash text primary key,                 -- sha256(토큰). 토큰 원본은 어디에도 없다
  user_id    uuid not null references app_user(id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  user_agent text                              -- 어느 기기인지 사람이 알아보려는 용도뿐
);

-- 로그아웃·만료 정리에서 쓴다.
create index app_session_user_ix on app_session (user_id);
create index app_session_exp_ix on app_session (expires_at);

comment on table app_session is
  '로그인 세션. 쿠키의 토큰을 sha256 해서 찾는다 — 토큰 원본은 저장하지 않는다.';
