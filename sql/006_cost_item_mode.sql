-- 고정비 항목에 위임 여부 차원 추가.
--
-- 택배비는 월 발송 규모에 따라 단가가 달라진다. 메리코코는 전 판매자 물량을 합치므로 단가가
-- 낮고, 직접 발송 판매자는 본인 물량 기준이라 높다. 같은 SHIPPING 항목이 위임/직접에서
-- 다른 금액을 가져야 한다.
--
-- mode 는 nullable enum 대신 '' 기본값 text 로 둔다. channel_fee.category 가 '' 를 기본값으로
-- 쓰는 것과 같은 패턴이고, nullable enum 을 coalesce 로 묶으면 인덱스가 IMMUTABLE 제약에
-- 걸린다.
--
--   mode = ''           위임 여부와 무관 (광고비 등)
--   mode = 'MERRYCOCO'  위임 발송일 때만
--   mode = 'SELF'       직접 발송일 때만

alter table cost_item
  add column mode text not null default ''
  check (mode in ('', 'SELF', 'MERRYCOCO'));

comment on column cost_item.mode is
  '발송 방식별 단가 구분. '''' 는 무관. 계산에서는 일치 항목이 '''' 항목을 덮어쓴다.';

drop index cost_item_channel_uk;
drop index cost_item_default_uk;

-- mode 가 NOT NULL 이라 부분 인덱스 둘로 충분하다
create unique index cost_item_channel_uk on cost_item (tenant_id, code, channel, mode)
  where channel is not null;
create unique index cost_item_default_uk on cost_item (tenant_id, code, mode)
  where channel is null;

-- 계산 시 고르는 규칙 (구체적인 것이 이긴다):
--   (channel 일치 + mode 일치) > (channel 일치 + mode='') > (channel null + mode 일치) > (둘 다 기본)
--
--   select distinct on (code) code, kind, amount
--     from cost_item
--    where tenant_id = $1 and active
--      and (channel = $2 or channel is null)
--      and (mode = $3 or mode = '')
--    order by code,
--             (channel is not null) desc,   -- 채널 지정이 우선
--             (mode <> '') desc;            -- 모드 지정이 우선
