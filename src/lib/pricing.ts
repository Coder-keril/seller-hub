// 판매가 계산.
//
// 수수료가 판매가에 비례하므로 정상가에 비율을 더하는 방식으로는 목표 수익에 도달하지 못한다.
// 역산해야 한다. 분모가 (1 - 수수료율 - 비율비 - 목표율) 인 것이 이 계산의 전부다.
//
//   MARGIN        순이익 = 판매가 × r   → (정상가 + F) / (1 - f - c - r)
//   MARKUP        순이익 = 정상가 × r    → (정상가 × (1+r) + F) / (1 - f - c)
//   FIXED_PROFIT  순이익 = 정액 P       → (정상가 + F + P) / (1 - f - c)
//
//     f = 마켓 수수료율 합 (VAT 반영)      channel_fee
//     F = 건당 정액 비용 합                 cost_item(FIXED) + channel_fee.fixed
//     c = 판매가 대비 비율 비용 합          cost_item(RATE)
//
// 계산은 순수 함수로 두고 조회와 분리한다. 돈 계산이라 DB 없이 테스트할 수 있어야 한다.
import { pool } from "./db";

export type PriceMode = "MARGIN" | "MARKUP" | "FIXED_PROFIT";
export type DelegationMode = "SELF" | "MERRYCOCO";

export interface Policy {
  mode: PriceMode;
  targetRate: number;      // MARGIN·MARKUP 일 때 비율 (0.15 = 15%)
  targetProfit: number;    // FIXED_PROFIT 일 때 건당 순이익
  roundTo: number;         // 판매가 올림 단위 (원)
}

export interface FeeLine {
  kind: string;            // SALE · PAYMENT · SETTLE · AD · OTHER
  rate: number;            // VAT 반영 후 실효율
  fixed: number;
  source: string;          // 어느 카테고리 설정에서 왔는지 (화면 표시·검증용)
}

export interface CostLine {
  code: string;
  name: string;
  kind: "FIXED" | "RATE";
  amount: number;
  scope: string;           // 어느 설정이 적용됐는지
}

export interface Quote {
  normalPrice: number;
  salePrice: number;
  feeRate: number;         // f
  feeFixed: number;
  costFixed: number;       // F 중 cost_item 몫
  costRate: number;        // c
  feeAmount: number;       // 실제 부과될 수수료 금액
  profit: number;          // 반올림 후 실제 순이익
  fees: FeeLine[];
  costs: CostLine[];
}

/** 분모가 0 이하면 계산이 불가능하다. 수수료 10% + 마진 95% 같은 설정. */
export class PricingError extends Error {}

/**
 * 판매가 역산. 순수 함수 — DB 를 보지 않는다.
 *
 * 반올림은 **올림**이다. 내리면 목표 수익에 미달한다.
 */
export function computePrice(
  normalPrice: number,
  policy: Policy,
  fees: FeeLine[],
  costs: CostLine[],
): Quote {
  if (!(normalPrice > 0)) throw new PricingError(`정상가가 0 이하입니다: ${normalPrice}`);

  const feeRate = fees.reduce((a, f) => a + f.rate, 0);
  const feeFixed = fees.reduce((a, f) => a + f.fixed, 0);
  const costFixed = costs.filter((c) => c.kind === "FIXED").reduce((a, c) => a + c.amount, 0);
  const costRate = costs.filter((c) => c.kind === "RATE").reduce((a, c) => a + c.amount, 0);

  const F = feeFixed + costFixed;
  let numerator: number;
  let denominator: number;

  switch (policy.mode) {
    case "MARGIN":
      numerator = normalPrice + F;
      denominator = 1 - feeRate - costRate - policy.targetRate;
      break;
    case "MARKUP":
      numerator = normalPrice * (1 + policy.targetRate) + F;
      denominator = 1 - feeRate - costRate;
      break;
    case "FIXED_PROFIT":
      numerator = normalPrice + F + policy.targetProfit;
      denominator = 1 - feeRate - costRate;
      break;
  }

  if (denominator <= 0) {
    throw new PricingError(
      `계산 불가 — 수수료 ${(feeRate * 100).toFixed(2)}% + 비율비 ${(costRate * 100).toFixed(2)}%`
      + `${policy.mode === "MARGIN" ? ` + 목표마진 ${(policy.targetRate * 100).toFixed(2)}%` : ""}`
      + ` 가 100% 를 넘습니다.`);
  }

  const step = policy.roundTo > 0 ? policy.roundTo : 1;
  const salePrice = Math.ceil(numerator / denominator / step) * step;
  const feeAmount = Math.round(salePrice * feeRate) + feeFixed;
  const profit = salePrice - feeAmount - normalPrice - costFixed - Math.round(salePrice * costRate);

  return { normalPrice, salePrice, feeRate, feeFixed, costFixed, costRate, feeAmount, profit, fees, costs };
}

/**
 * 마켓 수수료 조회. **`channel_fee.category` 는 마켓 카테고리 코드다** (마스터 카테고리가 아니다).
 *
 * 수수료표는 보통 대분류 수준으로 오는데 상품은 리프에 등록된다. 그래서 리프의 전체 경로를
 * 거슬러 **가장 구체적인 설정**을 쓴다. 경로는 channel_ref.full_name 으로 유도한다.
 *
 *   '식품>음료>청량/탄산음료>이온음료' 에 등록된 상품이라면
 *   '식품>음료>청량/탄산음료' 설정 > '식품>음료' 설정 > '식품' 설정 > 채널 기본('')
 *
 * 항목 종류(kind)별로 각각 하나씩 고른다 — SALE 과 PAYMENT 는 더해지는 별개 항목이다.
 */
export async function resolveFees(
  tenantId: string,
  channel: string,
  channelCategoryCode?: string,
): Promise<FeeLine[]> {
  const { rows } = await pool().query<{
    kind: string; rate: string; fixed: string; vat_included: boolean;
    category: string; depth: number;
  }>(
    `with target as (
       select full_name from channel_ref
        where channel = $2 and kind = 'CATEGORY' and code = $3
     ),
     ancestors as (
       -- 리프 경로의 접두사인 카테고리들. 자기 자신도 포함된다.
       select r.code, length(r.full_name) as depth
         from channel_ref r, target t
        where r.channel = $2 and r.kind = 'CATEGORY'
          and t.full_name like r.full_name || '%'
     )
     select f.kind, f.rate::text, f.fixed::text, f.vat_included, f.category,
            coalesce(a.depth, 0) as depth
       from channel_fee f
       left join ancestors a on a.code = f.category
      where f.tenant_id = $1 and f.channel = $2
        and (f.category = '' or a.code is not null)
      order by f.kind, coalesce(a.depth, 0) desc`,
    [tenantId, channel, channelCategoryCode ?? ""],
  );

  // kind 별로 가장 구체적인(depth 큰) 것 하나씩
  const picked = new Map<string, FeeLine>();
  for (const r of rows) {
    if (picked.has(r.kind)) continue;
    // 마켓 공시 수수료율은 보통 VAT 별도다. 그대로 넣었으면 1.1 을 곱해 실효율로 만든다.
    const vat = r.vat_included ? 1 : 1.1;
    picked.set(r.kind, {
      kind: r.kind,
      rate: Number(r.rate) * vat,
      fixed: Number(r.fixed),
      source: r.category === "" ? "채널 기본" : r.category,
    });
  }
  return [...picked.values()];
}

/**
 * 고정비 조회. 구체적인 설정이 기본값을 덮어쓴다.
 *
 *   (채널 일치 + 발송방식 일치) > (채널 일치) > (발송방식 일치) > (둘 다 기본)
 *
 * 택배비는 월 발송 규모에 따라 단가가 달라지므로 위임/직접이 다르다. mode 가 그것을 가른다.
 */
export async function resolveCosts(
  tenantId: string,
  channel: string,
  mode: DelegationMode,
): Promise<CostLine[]> {
  const { rows } = await pool().query<{
    code: string; name: string; kind: "FIXED" | "RATE"; amount: string;
    channel: string | null; mode: string;
  }>(
    `select distinct on (code) code, name, kind, amount::text, channel::text, mode
       from cost_item
      where tenant_id = $1 and active
        and (channel = $2 or channel is null)
        and (mode = $3 or mode = '')
      order by code, (channel is not null) desc, (mode <> '') desc`,
    [tenantId, channel, mode],
  );
  return rows.map((r) => ({
    code: r.code,
    name: r.name,
    kind: r.kind,
    amount: Number(r.amount),
    scope: [r.channel ?? "전채널", r.mode === "" ? "발송무관" : r.mode].join(" · "),
  }));
}

/** 정책 조회. 채널별 설정이 있으면 그것, 없으면 판매자 기본값. */
export async function resolvePolicy(tenantId: string, channel: string): Promise<Policy> {
  const { rows } = await pool().query<{
    mode: PriceMode; target_rate: string; target_profit: string; round_to: number;
  }>(
    `select mode, target_rate::text, target_profit::text, round_to
       from price_policy
      where tenant_id = $1 and (channel = $2 or channel is null)
      order by (channel is not null) desc
      limit 1`,
    [tenantId, channel],
  );
  const p = rows[0];
  if (!p) throw new PricingError(`판매자 ${tenantId} 의 가격정책이 없습니다.`);
  return {
    mode: p.mode,
    targetRate: Number(p.target_rate),
    targetProfit: Number(p.target_profit),
    roundTo: p.round_to,
  };
}

/** 조회 + 계산을 묶은 것. 화면과 등록 코드가 이것을 쓴다. */
export async function quote(args: {
  tenantId: string;
  channel: string;
  normalPrice: number;
  channelCategoryCode?: string;
  mode?: DelegationMode;
}): Promise<Quote> {
  const mode = args.mode ?? "SELF";
  const [policy, fees, costs] = await Promise.all([
    resolvePolicy(args.tenantId, args.channel),
    resolveFees(args.tenantId, args.channel, args.channelCategoryCode),
    resolveCosts(args.tenantId, args.channel, mode),
  ]);
  return computePrice(args.normalPrice, policy, fees, costs);
}
