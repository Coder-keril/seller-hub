import { describe, it, expect } from "vitest";
import { parseReceipt } from "./parse";
import { buildReceiptPayload } from "./payload";

// 구매 영수증(발췌 — 중복 코드/쿠폰 포함). buildReceiptPayload 의 헤더+상세 매핑을 검증.
const RECEIPT = `트레비탄산수레몬
631244   1   12,990   12,990 T
*** CPN
트레비탄산수레몬
8381   1   2,500   - 2,500 T
연세 커피우유
665921   2   14,990   29,980 T
*** CPN
연세 커피우
17511   2   3,000   - 6,000 T
맥심모카믹스380T
603187   1   51,990   51,990 T
면세   0
과세   675,581
부가세   67,559
**** 합계 (VAT 포함)   743,140
---------------------------------------------
거래구분:구매
승인금액: 743,140 할부 00개월
카드번호: 40201780****180*
승인번호: 00786770 BC AP
---------------------------------------------
카드   743,140
잔돈   0
쿠폰합계 70,800
총 판매 상품 수 38
2026/02/06 12:11:00 PM 855 8 77 140

REG#8

2026/02/06`;

describe("buildReceiptPayload — 구입 헤더+상세", () => {
  const parsed = parseReceipt(RECEIPT);
  const rec = buildReceiptPayload(parsed, RECEIPT);

  it("헤더 항목", () => {
    expect(rec.approval_no).toBe("00786770");
    expect(rec.purchased_at).toBe("2026-02-06T12:11:00");
    expect(rec.register).toBe("8");
    expect(rec.total).toBe(743140);
    expect(rec.coupon_total).toBe(70800);
    expect(rec.item_count).toBe(38);
    expect(rec.change_amount).toBe(0);
    expect(rec.card_brand).toBe("BC");
    expect(rec.reconciled).toBe(parsed.reconciled); // passthrough(발췌라 값 자체는 미검증)
    expect(rec.raw_text).toBe(RECEIPT);
  });

  it("상세 = 영수증 원본 줄 그대로(집계 안 함) + 쿠폰 평탄화", () => {
    const items = rec.items;   // payload.ts 가 타입을 주므로 캐스트가 필요 없다
    expect(items).toHaveLength(parsed.items.length); // 3줄
    expect(items[0]).toMatchObject({
      line_no: 1, product_code: "631244", qty: 1, unit_price: 12990, amount: 12990,
      coupon_code: "8381", coupon_qty: 1, coupon_unit_discount: 2500, coupon_discount: 2500,
    });
    // 665921 은 수량 2줄이 집계되지 않고 원본 그대로 1줄(발췌본에선 2짜리 한 줄)
    const it1 = items[1];
    expect(it1).toMatchObject({ line_no: 2, product_code: "665921", qty: 2, coupon_discount: 6000 });
    // 쿠폰 없는 품목
    const maxim = items.find((x) => x.product_code === "603187")!;
    expect(maxim.coupon_code).toBeNull();
  });
});

// 환불(반품) — 상세 수량·금액 음수, original_date
const REFUND = `*** RFND
프리즘데스크램프
658883   1   37,990   - 37,990 T
면세   0
과세   - 34,536
부가세   - 3,454
**** 합계 (VAT 포함)   - 37,990
---------------------------------------------
거래구분:반품
승인금액: 37,990- 할부 00개월
카드번호: 40201780****180*
승인번호: 00861070 BC AP
원거래일: 20260126
---------------------------------------------
카드   - 37,990
잔돈   0
총 판매 상품 수 -1
2026/02/08 10:50:00 AM 855 83 26 617

REG#83

2026/02/08`;

describe("buildReceiptPayload — 환불 헤더+상세", () => {
  const parsed = parseReceipt(REFUND);
  const rec = buildReceiptPayload(parsed, REFUND);

  it("헤더 — 승인번호(반품 자체)·원거래일·음수 합계", () => {
    expect(rec.approval_no).toBe("00861070"); // 환불 자체의 승인번호(구매와 별개)
    expect(rec.purchased_at).toBe("2026-02-08T10:50:00");
    expect(rec.original_date).toBe("2026-01-26");
    expect(rec.total).toBe(-37990);
    expect(rec.item_count).toBe(-1);
    expect(rec.payment_type).toBe("반품");
  });

  it("상세 — 수량·금액 음수, 쿠폰 없음", () => {
    const items = rec.items;   // payload.ts 가 타입을 주므로 캐스트가 필요 없다
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      line_no: 1, product_code: "658883", qty: -1, unit_price: 37990, amount: -37990, coupon_code: null,
    });
  });
});
