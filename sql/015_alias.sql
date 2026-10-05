-- 회원번호·카드번호에 사람이 읽을 이름을 붙인다.
--
-- 영수증에 찍히는 것은 `2000xxxxxxxx`(회원번호)와 `1234-****-****-5678`(마스킹 카드번호)뿐이다.
-- 차액환불을 받으러 갈 때 **어느 회원카드와 어느 결제카드를 들고 가야 하는지**를 번호만
-- 보고 판단할 수 없다 — 그래서 별명을 붙인다.
--
-- **한 테이블에 `kind` 로 둘을 담는다.** 회원번호용·카드번호용 테이블을 따로 두면 조회·저장·
-- 화면 코드가 두 벌이 된다. 다루는 것이 (키 → 이름) 한 쌍뿐이라 나눌 이유가 없다.
--
-- 키를 그대로 PK 에 쓴다 — 별명은 번호당 하나이고, 번호가 조회 조건이다.
-- `tenant_id` 가 맨 앞이라 판매자별 스캔이 인덱스를 탄다(훗날 파티셔닝 키).
--
-- ⚠️ 영수증을 지워도 별명은 남는다(FK 를 걸지 않는다). 영수증을 다시 올리면 별명이
--    그대로 붙어 있어야 하고, `receipt` 에는 회원번호·카드번호의 유일성이 없어 FK 를 걸 수도 없다.
create table receipt_alias (
  tenant_id  uuid not null references tenant(id) on delete cascade,
  kind       text not null check (kind in ('MEMBER', 'CARD')),
  key        text not null,
  alias      text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (tenant_id, kind, key)
);
