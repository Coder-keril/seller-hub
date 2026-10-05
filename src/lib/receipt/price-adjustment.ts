// 차액환불 후보 — **내가 산 단가보다 지금이 싼** 구매 건을 찾는다.
//
// 한국 코스트코에는 미국식 가격조정(차액 환불) 제도가 없다. **환불 정책을 활용**한다 —
// 할인 중인 새 상품을 사서 결제하고, 과거 비싸게 산 건을 고객센터에서 반품 처리한다.
// 카운터에 필요한 것은 **회원카드와 그때 결제한 카드**이고 실물 영수증은 필요 없다.
// 그래서 이 화면이 내놓아야 하는 것은 그 두 가지 + 언제 얼마에 샀는지다.
//
// ⚠️ **기본은 기간 제한이 없다.** 코스트코의 100% 만족 보장은 대부분의 상품을 기간·사유
//    제한 없이 환불해 준다. 미국식 '구매일 + 30일' 은 한국에 없다.
//    예외만 기간이 있다 — 전자제품·대형가전 90일, 음식류는 유통기한 내.
//    담배·주류·티켓·귀금속·상품권·맞춤제작은 환불 자체가 안 된다.
//    품목 분류는 아직 세우지 않았으므로 **여기서 걸러내지 않는다.** 기간을 좁히고 싶으면
//    호출자가 `windowDays` 를 넘긴다(없으면 전체 기간).
//
// ⚠️ 비교 단가는 **쿠폰을 뺀 실지불 단가**다. 쿠폰을 받아 이미 행사가보다 싸게 샀을 수 있다.
//
// ⚠️ 행사가는 `npm run sync` 가 채운다(사내 개발머신에서만 돈다). 동기화 전에는 결과가 비어 있다.
import { tquery } from "../db";
import { NET_AMT_SQL } from "./statements";

export interface AdjustCandidate {
  receipt_id: string;
  purchased_at: string;
  days_ago: number;
  member_no: string;
  card_number_masked: string | null;
  approval_no: string | null;
  register: string | null;
  product_code: string;
  name: string | null;
  qty: number;
  paid_unit: number;
  sale_price: number;
  sale_start_date: string | null;
  sale_end_date: string | null;
  diff_unit: number;
  diff_total: number;
  /** 행사 종료까지 남은 일수. 음수는 없다(오늘 유효한 행사만 담기므로). null = 종료일 미정. */
  days_left: number | null;
}

export interface AdjustOptions {
  /**
   * 기간을 좁힐 때만 쓴다(일). **생략하면 전체 기간** — 기본 환불 정책에 기간 제한이 없다.
   * 전자제품·대형가전처럼 90일 제한이 있는 품목을 볼 때 90 을 넣는다.
   */
  windowDays?: number | null;
  /** 정상가로 쓰는 가격 채널 — price_policy.base_channel 과 같은 값('store'·'online'). */
  priceChannel?: string;
  /** 차액이 이 금액 미만이면 버린다. 몇백 원짜리는 다녀올 가치가 없다. */
  minDiffTotal?: number;
  /**
   * 'amount' = 차액 큰 것부터(기본) · 'urgency' = 행사 **종료 임박** 순.
   * 행사가 끝나면 그 기회는 사라지므로 판단에는 긴급도가 더 중요할 때가 많다.
   */
  sort?: "amount" | "urgency";
}

export async function findAdjustCandidates(
  tenantId: string,
  opts: AdjustOptions,
): Promise<AdjustCandidate[]> {
  // null = 기간 제한 없음. 값이 오면 1~3650 일로 자른다.
  const windowDays =
    opts.windowDays == null || !Number.isFinite(opts.windowDays)
      ? null
      : Math.min(Math.max(Math.trunc(opts.windowDays), 1), 3650);
  const channel = opts.priceChannel ?? "store";
  const minDiff = opts.minDiffTotal ?? 0;

  return tquery<AdjustCandidate>(
    tenantId,
    `with paid as (
       -- **영수증 × 상품으로 합산한다.** 같은 영수증에 같은 상품이 여러 줄 있을 수 있다
       -- (줄마다 쿠폰이 다르면 분리된다). 줄 단위로 내놓으면 ① 화면 키가 겹치고
       -- ② 처리 기록의 유일키 (영수증, 상품) 와 어긋나 뒤에 누른 줄이 앞을 덮어써
       -- **수량·회수액이 누락된다.** 카운터에서도 그 영수증의 해당 상품은 한꺼번에 처리한다.
       select r.id as receipt_id, r.member_no, r.card_number_masked, r.approval_no, r.register,
              to_char(r.purchased_at, 'YYYY-MM-DD"T"HH24:MI:SS') as purchased_at,
              (current_date - r.purchased_at::date) as days_ago,
              i.product_code, max(i.name) as name,
              sum(i.qty)::int as qty,
              sum(${NET_AMT_SQL}) as net_amt
         from receipt_item i
         join receipt r on r.id = i.receipt_id
        where r.tenant_id = $1
          and r.kind = 'PURCHASE'
          and ($2::int is null or r.purchased_at::date >= current_date - $2::int)
          -- 이미 반품한 건은 뺀다. 환불 영수증이 원승인번호로 그 구매를 가리킨다.
          and not exists (
            select 1 from receipt f
             where f.tenant_id = r.tenant_id
               and f.kind = 'REFUND'
               and f.original_approval_no is not null
               and f.original_approval_no = r.approval_no
          )
          -- 이미 차액환불로 처리한 건도 뺀다. 환불 영수증을 아직 안 넣었어도 목록에서 사라진다.
          and not exists (
            select 1 from price_adjust_claim cl
             where cl.tenant_id = r.tenant_id
               and cl.receipt_id = r.id
               and cl.product_code = i.product_code
          )
        group by r.id, r.member_no, r.card_number_masked, r.approval_no, r.register,
                 r.purchased_at, i.product_code
       having sum(i.qty) > 0        -- 전량 환불된 조합은 단가가 없다
     )
     select p.receipt_id, p.purchased_at, p.days_ago::int as days_ago,
            p.member_no, p.card_number_masked, p.approval_no, p.register,
            p.product_code, p.name, p.qty,
            (p.net_amt / p.qty)::float8 as paid_unit,
            mp.sale_price::float8 as sale_price,
            to_char(mp.sale_start_date, 'YYYY-MM-DD') as sale_start_date,
            to_char(mp.sale_end_date,   'YYYY-MM-DD') as sale_end_date,
            (p.net_amt / p.qty - mp.sale_price)::float8 as diff_unit,
            -- 줄별 차액의 합과 같다(가중평균 단가를 다시 곱하지 않으므로 반올림 드리프트가 없다).
            (p.net_amt - mp.sale_price * p.qty)::float8 as diff_total,
            (mp.sale_end_date - current_date)::int as days_left
       from paid p
       join master_price mp
         on mp.master_id = 'costco:' || p.product_code
        and mp.price_channel = $3
      where mp.sale_price is not null
        and mp.sale_price < p.net_amt / p.qty
        and p.net_amt - mp.sale_price * p.qty >= $4
      order by ${opts.sort === "urgency"
        ? "days_left asc nulls last, diff_total desc"
        : "diff_total desc"}`,
    [windowDays, channel, minDiff],
  );
}

/** 행사가가 아직 동기화되지 않았는지 — 화면이 "데이터 없음"과 "동기화 안 됨"을 구분하려고 쓴다. */
export async function saleSyncState(): Promise<{ withSale: number; syncedAt: string | null }> {
  const { pool } = await import("../db");
  const { rows } = await pool().query<{ with_sale: number; synced_at: string | null }>(
    `select count(*) filter (where sale_price is not null)::int as with_sale,
            to_char(max(sale_synced_at), 'YYYY-MM-DD HH24:MI') as synced_at
       from master_price`,
  );
  return { withSale: rows[0]?.with_sale ?? 0, syncedAt: rows[0]?.synced_at ?? null };
}
