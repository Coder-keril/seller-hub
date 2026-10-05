import { describe, it, expect } from "vitest";
import { computePrice, PricingError, type Policy, type FeeLine, type CostLine } from "./pricing";

const fee = (kind: string, rate: number, fixed = 0): FeeLine =>
  ({ kind, rate, fixed, source: "테스트" });
const cost = (code: string, kind: "FIXED" | "RATE", amount: number): CostLine =>
  ({ code, name: code, kind, amount, scope: "테스트" });

const MARGIN = (r: number): Policy =>
  ({ mode: "MARGIN", targetRate: r, targetProfit: 0, roundTo: 100 });
const MARKUP = (r: number): Policy =>
  ({ mode: "MARKUP", targetRate: r, targetProfit: 0, roundTo: 100 });
const FIXED = (p: number): Policy =>
  ({ mode: "FIXED_PROFIT", targetRate: 0, targetProfit: p, roundTo: 100 });

describe("세 가지 계산 기준", () => {
  // 정상가 10,000 · 수수료 10% · 택배비 3,000 · 목표 15%
  const fees = [fee("SALE", 0.1)];
  const costs = [cost("SHIPPING", "FIXED", 3000)];

  it("마진 — 판매가의 15%가 남는다", () => {
    const q = computePrice(10000, MARGIN(0.15), fees, costs);
    // (10000 + 3000) / (1 - 0.10 - 0.15) = 17,333 → 17,400
    expect(q.salePrice).toBe(17400);
    // 17400 - 1740 - 10000 - 3000 = 2,660 → 판매가의 15.3%
    expect(q.profit).toBe(2660);
    expect(q.profit / q.salePrice).toBeGreaterThanOrEqual(0.15);
  });

  it("마크업 — 정상가의 15%를 붙인다", () => {
    const q = computePrice(10000, MARKUP(0.15), fees, costs);
    // (10000 × 1.15 + 3000) / (1 - 0.10) = 16,111 → 16,200
    expect(q.salePrice).toBe(16200);
    expect(q.profit).toBe(16200 - 1620 - 10000 - 3000);
  });

  it("고정이익 — 건당 2,000원이 남는다", () => {
    const q = computePrice(10000, FIXED(2000), fees, costs);
    // (10000 + 3000 + 2000) / (1 - 0.10) = 16,667 → 16,700
    expect(q.salePrice).toBe(16700);
    expect(q.profit).toBeGreaterThanOrEqual(2000);
  });

  it("같은 15%라도 기준에 따라 판매가가 다르다", () => {
    const a = computePrice(10000, MARGIN(0.15), fees, costs).salePrice;
    const b = computePrice(10000, MARKUP(0.15), fees, costs).salePrice;
    expect(a).toBeGreaterThan(b);
  });
});

describe("반올림", () => {
  const fees = [fee("SALE", 0.1)];
  const costs = [cost("SHIPPING", "FIXED", 3000)];

  it("올림이다 — 내리면 목표 수익에 미달한다", () => {
    const q = computePrice(10000, MARGIN(0.15), fees, costs);
    expect(q.salePrice % 100).toBe(0);
    expect(q.salePrice).toBeGreaterThanOrEqual(17334);   // 정확값 17,333.3
  });

  it("올림 단위를 1원으로 두면 그대로 쓴다", () => {
    const q = computePrice(10000, { ...MARGIN(0.15), roundTo: 1 }, fees, costs);
    expect(q.salePrice).toBe(17334);
  });

  it("올림 단위가 0이면 1원으로 처리한다", () => {
    const q = computePrice(10000, { ...MARGIN(0.15), roundTo: 0 }, fees, costs);
    expect(q.salePrice).toBe(17334);
  });
});

describe("수수료 항목 합산", () => {
  it("SALE 과 PAYMENT 는 더해진다 — 네이버처럼 항목이 분리된 마켓", () => {
    // 둘 다 VAT 포함 실효율이다. 공시 '3% (VAT 별도 2.73%)' 는 3% 가 VAT 포함 값이라는 뜻이다.
    const q = computePrice(20990, FIXED(10000),
      [fee("PAYMENT", 0.0363), fee("SALE", 0.03)],   // 주문관리 3.63%(일반) + 판매 3%
      [cost("SHIPPING", "FIXED", 3000)]);
    expect(q.feeRate).toBeCloseTo(0.0663, 4);
    expect(q.profit).toBeGreaterThanOrEqual(10000);
  });

  it("건당 정액 수수료도 반영한다", () => {
    const a = computePrice(10000, FIXED(2000), [fee("SALE", 0.1)], []);
    const b = computePrice(10000, FIXED(2000), [fee("SALE", 0.1, 500)], []);
    expect(b.salePrice).toBeGreaterThan(a.salePrice);
    expect(b.profit).toBeGreaterThanOrEqual(2000);
  });
});

describe("고정비와 비율비", () => {
  it("FIXED 는 분자에, RATE 는 분모에 들어간다", () => {
    const withFixed = computePrice(10000, MARGIN(0.1), [fee("SALE", 0.1)],
      [cost("PACKING", "FIXED", 1000)]);
    const withRate = computePrice(10000, MARGIN(0.1), [fee("SALE", 0.1)],
      [cost("AD", "RATE", 0.05)]);
    expect(withFixed.costFixed).toBe(1000);
    expect(withFixed.costRate).toBe(0);
    expect(withRate.costRate).toBe(0.05);
    expect(withRate.costFixed).toBe(0);
  });

  it("비율비가 늘면 판매가가 오른다", () => {
    const a = computePrice(10000, MARGIN(0.1), [fee("SALE", 0.1)], []);
    const b = computePrice(10000, MARGIN(0.1), [fee("SALE", 0.1)], [cost("AD", "RATE", 0.05)]);
    expect(b.salePrice).toBeGreaterThan(a.salePrice);
  });

  it("위임·직접 택배비 차이가 판매가에 반영된다", () => {
    const delegated = computePrice(20990, FIXED(10000), [fee("SALE", 0.0693)],
      [cost("SHIPPING", "FIXED", 2800), cost("PACKING", "FIXED", 300)]);
    const self = computePrice(20990, FIXED(10000), [fee("SALE", 0.0693)],
      [cost("SHIPPING", "FIXED", 3000)]);
    // 위임은 택배비가 싸지만 박스비가 붙어 총 3,100원 — 직접(3,000)보다 비싸다
    expect(delegated.costFixed).toBe(3100);
    expect(self.costFixed).toBe(3000);
    expect(delegated.salePrice).toBeGreaterThan(self.salePrice);
  });
});

describe("계산이 불가능한 설정을 막는다", () => {
  it("수수료 + 마진이 100%를 넘으면 거부한다", () => {
    expect(() => computePrice(10000, MARGIN(0.95), [fee("SALE", 0.1)], []))
      .toThrow(PricingError);
  });

  it("비율비까지 합쳐 100%를 넘으면 거부한다", () => {
    expect(() => computePrice(10000, MARGIN(0.5), [fee("SALE", 0.3)],
      [cost("AD", "RATE", 0.25)])).toThrow(/100%/);
  });

  it("정상가가 0이면 거부한다 — 마스터에 0원 데이터가 2건 있다", () => {
    expect(() => computePrice(0, MARGIN(0.15), [fee("SALE", 0.1)], []))
      .toThrow(/정상가/);
  });

  it("음수 정상가도 거부한다", () => {
    expect(() => computePrice(-100, MARGIN(0.15), [], [])).toThrow(PricingError);
  });
});

describe("실제 사례 — 포카리스웨트 240ML×30", () => {
  // 매장 정상가 20,990 · 순이익 10,000 목표 · 택배비 3,000
  const costs = [cost("SHIPPING", "FIXED", 3000)];

  it("추정 수수료(6.31%)로는 36,300원", () => {
    const q = computePrice(20990, FIXED(10000), [fee("SALE", 0.0631)], costs);
    expect(q.salePrice).toBe(36300);
  });

  it("일반 등급(6.63% = 주문관리 3.63% + 판매 3%)이면 36,500원", () => {
    const q = computePrice(20990, FIXED(10000), [fee("SALE", 0.0663)], costs);
    expect(q.salePrice).toBe(36500);
    expect(q.profit).toBeGreaterThanOrEqual(10000);

    // 추정값(6.31%)으로 매긴 36,300 에 팔면 목표에 미달한다
    const under = 36300 - Math.round(36300 * 0.0663) - 20990 - 3000;
    expect(under).toBeLessThan(10000);
  });

  it("이지오피스 확정값 — 영세 등급 4.947% 면 35,800원", () => {
    // 판매자센터 > 정산관리 > 정산내역 확인: 영세 3억, Npay 1.947% + 판매 3%
    const q = computePrice(20990, FIXED(10000),
      [fee("PAYMENT", 0.01947), fee("SALE", 0.03)], costs);
    expect(q.feeRate).toBeCloseTo(0.04947, 5);
    expect(q.salePrice).toBe(35800);
    expect(q.profit).toBeGreaterThanOrEqual(10000);
  });

  it("등급이 낮으면 판매가가 내려간다", () => {
    const 일반 = computePrice(20990, FIXED(10000), [fee("SALE", 0.0663)], costs);
    const 영세 = computePrice(20990, FIXED(10000), [fee("SALE", 0.04947)], costs);
    expect(영세.salePrice).toBeLessThan(일반.salePrice);
    expect(일반.salePrice - 영세.salePrice).toBe(700);
  });
});
