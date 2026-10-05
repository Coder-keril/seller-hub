import { describe, it, expect } from "vitest";
import { parseReceipt, missingRequiredFields, isCashRefund, receiptFileName } from "./parse";
import { buildReceiptPayload } from "./payload";

// 실제 코스트코 온라인 영수증 1건 (2026-02-06)
const RECEIPT = `트레비탄산수레몬
631244   1   12,990   12,990 T
*** CPN
트레비탄산수레몬
8381   1   2,500   - 2,500 T
연세 커피우유
665921   1   14,990   14,990 T
*** CPN
연세 커피우
17511   1   3,000   - 3,000 T
맥심모카믹스380T
603187   1   51,990   51,990 T
연세 커피우유
665921   2   14,990   29,980 T
*** CPN
연세 커피우
17511   2   3,000   - 6,000 T
GUM GUARD ORIGINAL
656838   2   17,490   34,980 T
고려은단100MLX40
641110   1   14,990   14,990 T
*** CPN
고려은단40 IRC
9892   1   2,300   - 2,300 T
토피넛라떼
679916   2   17,790   35,580 T
3IN1에탄올워셔3P
627620   1   11,490   11,490 T
컵시리얼40G X 18
672332   2   18,490   36,980 T
*** CPN
컵시리얼40G X 18
19464   2   3,000   - 6,000 T
파워에이드520ML
680475   1   23,990   23,990 T
*** CPN
파워에이드
22068   1   3,600   - 3,600 T
폴바셋돌체라떼
652590   1   28,990   28,990 T
*** CPN
폴바셋돌체IRC
13409   1   5,000   - 5,000 T
크리넥스미용티슈
591501   1   18,290   18,290 T
*** CPN
크리넥스미용티슈
1930   1   3,400   - 3,400 T
프렌치버터크라상
586503   2   11,790   23,580 T
페브리즈화장실
660352   6   21,990   131,940 T
HERA SENSUAL NUDE
685307   2   54,900   109,800 T
KS구운　재래김
833639   1   12,490   12,490 T
버츠비립밤5PCS
632912   1   14,790   14,790 T
*** CPN
버츠비립밤 PP
3665   1   3,000   - 3,000 T
토피넛라떼
679916   1   17,790   17,790 T
프로쉬식기세척세
671922   2   22,990   45,980 T
*** CPN
식기세척기 72
20670   2   5,800   - 11,600 T
미니버터크라상
683002   1   8,990   8,990 T
컵시리얼40G X 18
672332   1   18,490   18,490 T
*** CPN
컵시리얼40G X 18
19464   1   3,000   - 3,000 T
버츠비립밤5PCS
632912   2   14,790   29,580 T
*** CPN
버츠비립밤 PP
3665   2   3,000   - 6,000 T
500억유산균
650725   1   44,990   44,990 T
*** CPN
500억유산균IRC
1365   1   9,000   - 9,000 T
컵시리얼40G X 18
672332   1   18,490   18,490 T
*** CPN
컵시리얼40G X 18
19464   1   3,000   - 3,000 T
토레타　이온음료
619895   1   21,790   21,790 T
*** CPN
토레타　이온음료
6490   1   3,400   - 3,400 T
면세   0
과세   675,581
부가세   67,559
**** 합계 (VAT 포함)   743,140
---------------------------------------------
거래구분:구매
승인금액: 743,140 할부 00개월
카드번호: 40201780____180_
승인번호: 00786770 BC AP
---------------------------------------------
카드   743,140
잔돈   0
쿠폰합계 70,800
총 판매 상품 수 38
2026/02/06 12:11:00 PM 855 8 77 140

REG#8

2026/02/06`;

describe("parseReceipt", () => {
  const r = parseReceipt(RECEIPT);

  it("모든 체크섬이 맞아 reconciled=true", () => {
    expect(r.checks.qty_ok).toBe(true);
    expect(r.checks.coupon_ok).toBe(true);
    expect(r.checks.tax_ok).toBe(true);
    expect(r.checks.amount_ok).toBe(true);
    expect(r.reconciled).toBe(true);
  });

  it("체크섬 값이 영수증 값과 일치", () => {
    expect(r.checks.qty_sum).toBe(38);        // 총 판매 상품 수
    expect(r.checks.coupon_sum).toBe(70800);  // 쿠폰합계
    expect(r.summary.total).toBe(743140);
    expect(r.summary.taxable).toBe(675581);
    expect(r.summary.vat).toBe(67559);
    expect(r.summary.item_count).toBe(38);
    expect(r.summary.coupon_total).toBe(70800);
  });

  it("품목 25건, 미분류 0", () => {
    expect(r.items).toHaveLength(25);
    expect(r.unparsed).toHaveLength(0);
  });

  it("첫 품목 + 쿠폰 연결", () => {
    const it0 = r.items[0]!;
    expect(it0.product_code).toBe("631244");
    expect(it0.name).toBe("트레비탄산수레몬");
    expect(it0.qty).toBe(1);
    expect(it0.unit_price).toBe(12990);
    expect(it0.amount).toBe(12990);
    expect(it0.coupon).toEqual({ code: "8381", qty: 1, unit_discount: 2500, discount: 2500 });
  });

  it("쿠폰 없는 품목(맥심)", () => {
    const maxim = r.items.find((x) => x.product_code === "603187");
    expect(maxim?.coupon).toBeNull();
    expect(maxim?.amount).toBe(51990);
  });

  it("결제/메타", () => {
    expect(r.purchased_at).toBe("2026-02-06T12:11:00");
    expect(r.register).toBe("8");
    expect(r.payment.approval_no).toBe("00786770");
    expect(r.payment.card_brand).toBe("BC");
    expect(r.payment.card_number_masked).toBe("40201780____180_");
    expect(r.payment.installment_months).toBe(0);
    expect(r.summary.card).toBe(743140);
    expect(r.summary.change).toBe(0);
  });

  it("구매 영수증은 kind=purchase, original_date=null", () => {
    expect(r.kind).toBe("purchase");
    expect(r.original_date).toBeNull();
  });
});

// 실제 환불(반품) 영수증 1건 (2026-02-08, 원거래 2026-01-26)
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
카드번호: 40201780____180_
승인번호: 00861070 BC AP
원거래일: 20260126
---------------------------------------------
카드   - 37,990
잔돈   0
총 판매 상품 수 -1
2026/02/08 10:50:00 AM 855 83 26 617

REG#83

2026/02/08`;

describe("parseReceipt (환불)", () => {
  const r = parseReceipt(REFUND);

  it("kind=refund, 원거래일 파싱", () => {
    expect(r.kind).toBe("refund");
    expect(r.original_date).toBe("2026-01-26");
  });

  it("음수 합계·상품수로 4종 체크섬 통과 → reconciled=true", () => {
    expect(r.summary.taxable).toBe(-34536);
    expect(r.summary.vat).toBe(-3454);
    expect(r.summary.total).toBe(-37990);
    expect(r.summary.item_count).toBe(-1);
    expect(r.summary.card).toBe(-37990);
    expect(r.checks.qty_ok).toBe(true);
    expect(r.checks.coupon_ok).toBe(true);  // 쿠폰 없음 → coupon_sum 0
    expect(r.checks.tax_ok).toBe(true);
    expect(r.checks.amount_ok).toBe(true);
    expect(r.reconciled).toBe(true);
  });

  it("환불 품목 1건 — 수량·금액 음수, 미분류 0", () => {
    expect(r.items).toHaveLength(1);
    expect(r.unparsed).toHaveLength(0);
    const it0 = r.items[0]!;
    expect(it0.product_code).toBe("658883");
    expect(it0.name).toBe("프리즘데스크램프");
    expect(it0.qty).toBe(-1);
    expect(it0.unit_price).toBe(37990);
    expect(it0.amount).toBe(-37990);
    expect(it0.coupon).toBeNull();
  });

  it("결제/메타(환불)", () => {
    expect(r.purchased_at).toBe("2026-02-08T10:50:00");
    expect(r.register).toBe("83");
    expect(r.payment.type).toBe("반품");
    expect(r.payment.approval_no).toBe("00861070");
    expect(r.payment.card_brand).toBe("BC");
    expect(r.payment.approved_amount).toBe(-37990);
    expect(r.payment.installment_months).toBe(0);
  });
});

// 현금 환불 — 승인번호/거래구분/원거래일 없음, 현금·잔돈 있음, 수량 -2
const CASH_REFUND = `*** RFND
불스원디퓨저3P
602026   2   24,990   - 49,980 T
면세   0
과세   - 45,436
부가세   - 4,544
**** 합계 (VAT 포함)   - 49,980
현금   0
잔돈   49,980
총 판매 상품 수 -2
2026/03/29 11:16:00 AM 855 81 29 613

REG#81

2026/03/29`;

describe("parseReceipt (현금 환불)", () => {
  const r = parseReceipt(CASH_REFUND);

  it("kind=refund, 승인번호·원구매일 없음, 현금 결제", () => {
    expect(r.kind).toBe("refund");
    expect(r.payment.approval_no).toBeNull();
    expect(r.payment.type).toBeNull(); // 거래구분 라인 없음
    expect(r.original_date).toBeNull();
    expect(r.summary.cash).toBe(0);
    expect(r.summary.change).toBe(49980);
  });

  it("음수 합계·상품수(-2)로 4종 체크섬 통과", () => {
    expect(r.summary.taxable).toBe(-45436);
    expect(r.summary.vat).toBe(-4544);
    expect(r.summary.total).toBe(-49980);
    expect(r.summary.item_count).toBe(-2);
    expect(r.reconciled).toBe(true);
  });

  it("환불 품목 1건 — 수량 -2, 금액 -49980", () => {
    expect(r.items).toHaveLength(1);
    const it0 = r.items[0]!;
    expect(it0.product_code).toBe("602026");
    expect(it0.qty).toBe(-2);
    expect(it0.unit_price).toBe(24990);
    expect(it0.amount).toBe(-49980);
  });
});

describe("멤버십 회원번호(member_no) 추출", () => {
  it("구매: 맨 윗줄 11자리('판매' 윗줄)", () => {
    const r = parseReceipt("12345678901\n판매\n631244 1 12990 12990 T\n**** 합계 (VAT 포함) 12990\n과세 11809\n부가세 1181\n총 판매 상품 수 1");
    expect(r.kind).toBe("purchase");
    expect(r.member_no).toBe("12345678901");
  });
  it("환불: 11자리('반품' 윗줄)", () => {
    const r = parseReceipt("98765432109\n반품\n*** RFND\n602026 2 24990 -49980 T\n총 판매 상품 수 -2");
    expect(r.kind).toBe("refund");
    expect(r.member_no).toBe("98765432109");
  });
  it("회원번호 없으면 null · 품목 이름은 보존", () => {
    const r = parseReceipt("트레비탄산수레몬\n631244 1 12990 12990 T");
    expect(r.member_no).toBeNull();
    expect(r.items[0]?.name).toBe("트레비탄산수레몬");
  });
});

describe("면세 상품(T 없음) 포함 영수증", () => {
  // 락토프리우유 등 면세품은 줄 끝에 'T' 표식이 없다 → 예전엔 품목에서 누락돼 체크섬이 깨졌다(2026-07-30 고도화).
  const R = `97866803502
판매
연세락토프리우유
676546    10    14,490    144,900
KAMIL HAND CREAM
686408    1    9,970    9,970 T
면세    144,900
과세    9,064
부가세    906
**** 합계 (VAT 포함)    154,870
총 판매 상품 수 11
2026/03/31 03:36:00 PM 855 8 256 143
REG#8`;
  const r = parseReceipt(R);
  it("면세 품목도 파싱 — 2건, 수량합 11", () => {
    expect(r.items).toHaveLength(2);
    expect(r.checks.qty_sum).toBe(11);
    const milk = r.items.find((x) => x.product_code === "676546");
    expect(milk?.qty).toBe(10);
    expect(milk?.amount).toBe(144900);
    expect(milk?.name).toBe("연세락토프리우유");
  });
  it("면세+과세+부가세=합계 로 tax_ok, 전체 reconciled", () => {
    expect(r.summary.tax_free).toBe(144900);
    expect(r.checks.tax_ok).toBe(true);
    expect(r.reconciled).toBe(true);
  });
  it("회원번호 추출", () => {
    expect(r.member_no).toBe("97866803502");
  });
});

describe("저장 필수항목(missingRequiredFields)", () => {
  const PURCHASE_OK = `97866803502
판매
KAMIL HAND CREAM
686408    1    9,970    9,970 T
면세    0
과세    9,064
부가세    906
**** 합계 (VAT 포함)    9,970
승인금액: 9,970 할부 00개월
카드번호: 40457700****120*
승인번호: 00752248 IC AP
총 판매 상품 수 1
2026/03/25 12:21:00 PM 5062 5 58 137
REG#5`;
  const REFUND_OK = `97866803502
반품
*** RFND
프렌치버터크라상
586503    1    11,490    - 11,490 T
면세    0
과세    - 10,445
부가세    - 1,045
**** 합계 (VAT 포함)    - 11,490
승인금액: 11,490- 할부 00개월
카드번호: 40457700****120*
승인번호: 00341297 IC AP
원거래일: 20260327
총 판매 상품 수 -1
2026/03/29 10:42:00 AM 855 81 16 613
REG#81`;

  it("구매: 필수 모두 있으면 통과", () => {
    expect(missingRequiredFields(parseReceipt(PURCHASE_OK))).toEqual([]);
  });
  it("반품: 필수 모두 있으면 통과(원구매일 포함)", () => {
    expect(missingRequiredFields(parseReceipt(REFUND_OK))).toEqual([]);
  });
  it("카드번호·승인번호 없으면(현금) 누락으로 잡힌다", () => {
    const cash = PURCHASE_OK.replace("카드번호: 40457700****120*\n", "").replace("승인번호: 00752248 IC AP\n", "");
    const miss = missingRequiredFields(parseReceipt(cash));
    expect(miss).toContain("카드번호");
    expect(miss).toContain("승인번호");
  });
  it("반품에서 원거래일 없으면 원구매일 누락", () => {
    const noOrig = REFUND_OK.replace("원거래일: 20260327\n", "");
    expect(missingRequiredFields(parseReceipt(noOrig))).toContain("원구매일");
  });
});

describe("현금반품 예외(카드번호·승인번호·원구매일 면제 — 멤버십·반품일자는 필수)", () => {
  const CASH_REFUND = `97866803502
반품
*** RFND
불스원디퓨저3P
602026    2    24,990    - 49,980 T
면세    0
과세    - 45,436
부가세    - 4,544
**** 합계 (VAT 포함)    - 49,980
원거래일: 20260209
현금    0
잔돈    49,980
총 판매 상품 수 -2
2026/03/29 11:16:00 AM 855 81 29 613
REG#81`;
  const r = parseReceipt(CASH_REFUND);

  it("현금반품으로 판별", () => {
    expect(r.kind).toBe("refund");
    expect(r.payment.approval_no).toBeNull();
    expect(r.payment.card_number_masked).toBeNull();
    expect(isCashRefund(r)).toBe(true);
  });
  it("멤버십번호·원구매일·반품일자 있으면 저장 가능(카드·승인 면제)", () => {
    expect(r.member_no).toBe("97866803502");
    expect(r.original_date).toBe("2026-02-09");
    expect(missingRequiredFields(r)).toEqual([]);
  });
  it("현금반품은 원구매일 없어도 저장 가능(원거래 미연결 = 코스트코 현금환불 유형)", () => {
    const noOrig = parseReceipt(CASH_REFUND.replace("원거래일: 20260209\n", ""));
    expect(isCashRefund(noOrig)).toBe(true);
    expect(noOrig.original_date).toBeNull();
    expect(missingRequiredFields(noOrig)).toEqual([]); // 원구매일 면제
  });
  it("멤버십번호 없으면 그것도 누락", () => {
    const noMem = parseReceipt(CASH_REFUND.replace("97866803502\n", ""));
    expect(missingRequiredFields(noMem)).toContain("멤버십번호");
  });
  it("카드반품은 카드·승인 면제 아님", () => {
    const cardRefund = CASH_REFUND
      .replace("현금    0\n잔돈    49,980\n", "카드    - 49,980\n승인번호: 00180178 IC AP\n카드번호: 40457700****120*\n");
    const cr = parseReceipt(cardRefund);
    expect(isCashRefund(cr)).toBe(false);
    expect(missingRequiredFields(cr)).toEqual([]); // 카드·승인·원구매일 모두 존재
  });
  it("카드반품은 원구매일 없으면 누락(현금환불과 달리 원거래 연결 필수)", () => {
    const cardRefundNoOrig = CASH_REFUND
      .replace("원거래일: 20260209\n", "")
      .replace("현금    0\n잔돈    49,980\n", "카드    - 49,980\n승인번호: 00180178 IC AP\n카드번호: 40457700****120*\n");
    const cr = parseReceipt(cardRefundNoOrig);
    expect(isCashRefund(cr)).toBe(false);
    expect(cr.original_date).toBeNull();
    expect(missingRequiredFields(cr)).toEqual(["원구매일"]);
  });
});

describe("리네임 파일명(receiptFileName)", () => {
  const CARD = `93132724701
판매
서울커피우유
668791    1    10,690    10,690 T
면세    0
과세    9,718
부가세    972
**** 합계 (VAT 포함)    10,690
카드번호: 40201780____180_
승인번호: 00250837 BC AP
총 판매 상품 수 1
2026/07/21 03:42:00 PM 850 8 334 103
REG#8`;
  const CASH_REFUND = `97866803502
반품
*** RFND
불스원디퓨저3P
602026    2    24,990    - 49,980 T
면세    0
과세    - 45,436
부가세    - 4,544
**** 합계 (VAT 포함)    - 49,980
원거래일: 20260209
현금    0
잔돈    49,980
총 판매 상품 수 -2
2026/03/29 11:16:00 AM 855 81 29 613
REG#81`;

  it("카드: 일자_회원_카드_승인 (하이픈·'*' 보존)", () => {
    expect(receiptFileName(parseReceipt(CARD))).toBe("구매_카드_2026-07-21_93132724701_40201780____180__00250837");
  });
  it("현금(무기명 환불): no-card_no-approval", () => {
    expect(receiptFileName(parseReceipt(CASH_REFUND))).toBe("환불_현금_2026-03-29_97866803502_no-card_no-approval");
  });
  it("회원번호 NULL → '회원번호 없음' 표시", () => {
    const noMem = parseReceipt(CARD.replace("93132724701\n", ""));
    expect(receiptFileName(noMem)).toBe("구매_카드_2026-07-21_no-member_40201780____180__00250837");
  });
  it("승인번호 NULL → '승인번호 없음' 표시(카드번호는 있어 카드형식 유지)", () => {
    const noAppr = parseReceipt(CARD.replace("승인번호: 00250837 BC AP\n", ""));
    expect(receiptFileName(noAppr)).toBe("구매_카드_2026-07-21_93132724701_40201780____180__no-approval");
  });
});

describe("현금(소득공제) 영수증 — 전화번호를 카드필드로", () => {
  const R = `97866803502
판매
맥심모카믹스380T
603187    3    51,990    155,970 T
뉴디너롤36CT
663092    6    5,690    34,140 T
퓨전 면도날20
683774    5    69,900    349,500 T
서울커피우유12
668791    5    10,690    53,450 T
워터보일드베이글
675724    1    9,990    9,990 T
아비노바디로션1L
720702    1    22,990    22,990 T
아비노바디로션1L
720702    1    22,990    22,990 T
면세    0
과세    590,027
부가세    59,003
**** 합계 (VAT 포함)    649,030
현금    500,000
현금    150,000
잔돈    970

현금(소득공제): 010****1201
승인번호: 122995014
승인금액: 649030
현금영수증 문의 : 126

총 판매 상품 수 22
2026/05/07 10:42:00 AM 855 12 30 174
REG#12`;
  const r = parseReceipt(R);
  it("소득공제 전화번호를 card_number_masked 에, 승인번호 파싱", () => {
    expect(r.payment.card_number_masked).toBe("010****1201");
    expect(r.payment.approval_no).toBe("122995014");
  });
  it("현금 여러 줄 합산(650,000) + 잔돈 970, 전체 reconciled", () => {
    expect(r.summary.cash).toBe(650000);
    expect(r.summary.change).toBe(970);
    expect(r.reconciled).toBe(true);
    expect(r.items).toHaveLength(7);
  });
  it("필수항목 충족(카드경로) + 파일명은 전화번호 자리", () => {
    expect(missingRequiredFields(r)).toEqual([]);
    expect(receiptFileName(r)).toBe("구매_현금_2026-05-07_97866803502_010____1201_122995014");
  });
});

describe("'*** 취소'(라인 취소) — 음수 품목 처리", () => {
  // 구매 영수증의 '*** 취소' 직후 '-' 줄은 쿠폰이 아니라 취소된 품목(음수). 예전엔 쿠폰으로 오파싱해 수량합·쿠폰합이 깨졌다.
  const R = `97866803502
판매
CJ유기농　맛밤
603724    5    16,490    82,450 T
CJ유기농　맛밤
603724    1    16,490    16,490 T
*** 취소
CJ유기농　맛밤
603724    1    16,490    - 16,490 T
면세    0
과세    74,955
부가세    7,495
**** 합계 (VAT 포함)    82,450
카드번호: 40457700****120*
승인번호: 00916588 IC AP
카드    82,450
잔돈    0
총 판매 상품 수 5
2026/03/03 11:18:00 AM 855 12 38 152
REG#12`;
  const r = parseReceipt(R);
  it("취소 품목이 음수(-1) 품목으로, 쿠폰 아님", () => {
    const cancel = r.items.find((x) => x.qty < 0);
    expect(cancel?.product_code).toBe("603724");
    expect(cancel?.qty).toBe(-1);
    expect(cancel?.amount).toBe(-16490);
    expect(r.items.every((x) => x.coupon === null)).toBe(true);
  });
  it("수량합=5, 쿠폰합=0, 전체 reconciled", () => {
    expect(r.checks.qty_sum).toBe(5);
    expect(r.checks.coupon_sum).toBe(0);
    expect(r.reconciled).toBe(true);
  });
});

describe("면세 상품 쿠폰(줄 끝 'T' 없음)", () => {
  // 면세 품목의 쿠폰은 줄 끝에 'T'가 없다 → 예전엔 RE_COUPON(T 필수)이 놓쳐 쿠폰합·금액이 깨졌다.
  const R = `97917227700
판매
연세락토프리우유
676546    6    14,490    86,940
*** CPN
연세멸균우유
21595    6    2,000    - 12,000
뉴디너롤36CT
663092    1    5,690    5,690 T
면세    74,940
과세    5,173
부가세    517
**** 합계 (VAT 포함)    80,630
카드번호: 40201780****180*
승인번호: 00982464 BC AP
카드    80,630
잔돈    0
쿠폰합계 12,000
총 판매 상품 수 7
2026/03/10 01:08:00 PM 855 13 138 173
REG#13`;
  const r = parseReceipt(R);
  it("면세 쿠폰이 면세 품목에 연결(-12,000)", () => {
    const milk = r.items.find((x) => x.product_code === "676546");
    expect(milk?.coupon?.discount).toBe(12000);
  });
  it("쿠폰합=12,000, 전체 reconciled", () => {
    expect(r.checks.coupon_sum).toBe(12000);
    expect(r.reconciled).toBe(true);
  });
});

describe("환불 영수증의 쿠폰 반환(양수 표기, '-' 없음)", () => {
  // 환불에서 '*** CPN' 뒤 쿠폰은 부호 없는 양수로 찍힌다(쿠폰 반환). 예전엔 품목으로 오파싱해 수량합·쿠폰합이 깨졌다.
  const R = `97866803502
반품
*** RFND
다크아메리카노
674122    1    45,990    - 45,990 T
*** RFND
CJ맛콩검은콩
692849    5    13,990    - 69,950 T
*** CPN
CJ 맛콩쿠폰
694354    5    3,000    15,000 T
면세    0
과세    - 91,763
부가세    - 9,177
**** 합계 (VAT 포함)    - 100,940
현금    0
잔돈    100,940
현금(소득공제): 010****1201
승인번호: 122994882
승인금액: -100940
원거래일: 20260511 사유:환불
원승인번호:122983635
쿠폰합계 - 15,000
총 판매 상품 수 -6
2026/05/12 10:58:00 AM 855 84 27 625
REG#84`;
  const r = parseReceipt(R);
  it("쿠폰 반환이 품목 아닌 쿠폰(-15,000)으로 연결, 품목은 환불 2건만", () => {
    expect(r.items).toHaveLength(2);
    expect(r.items.find((x) => x.product_code === "692849")?.coupon?.discount).toBe(-15000);
  });
  it("수량합 -6, 쿠폰합 -15,000, 전체 reconciled", () => {
    expect(r.checks.qty_sum).toBe(-6);
    expect(r.checks.coupon_sum).toBe(-15000);
    expect(r.reconciled).toBe(true);
  });
  it("승인번호는 반품 자체(122994882) — 원승인번호는 잡지 않음", () => {
    expect(r.payment.approval_no).toBe("122994882");
    expect(r.original_approval_no).toBe("122983635");
  });
});

describe("금액쿠폰 + 리워드(EM리워드) 결제", () => {
  // 금액쿠폰(주문단위 할인)은 세금 뒤 차감 → tax_ok 는 면세+과세+부가세+금액쿠폰=합계. 결제는 EM리워드.
  const R = `93132724702
판매
BOUCHARD씨솔트
673871    1    32,990    32,990 T
카스라이트330X24
688810    1    24,290    24,290 T
*** CPN
앤쿠폰카스L330
24524    1    1,200    - 1,200
면세    0
과세    52,073
부가세    5,207
금액쿠폰    - 1,200
**** 합계 (VAT 포함)    56,080
EM리워드    100,000
잔돈    43,920
쿠폰합계 1,200
총 판매 상품 수 2
2026/05/15 12:05:00 PM 855 15 71 167
REG#15`;
  const r = parseReceipt(R);
  it("금액쿠폰(-1,200) 파싱 + tax_ok(면세+과세+부가세+금액쿠폰=합계)", () => {
    expect(r.summary.amount_coupon).toBe(-1200);
    expect(r.checks.tax_ok).toBe(true);
    expect(r.reconciled).toBe(true);
  });
  it("리워드 결제 파싱 — 카드번호·승인번호 없이도 저장 가능(면제)", () => {
    expect(r.summary.reward).toBe(100000);
    expect(r.summary.card).toBeNull();
    expect(r.summary.cash).toBeNull();
    expect(buildReceiptPayload(r, R).payment_method).toBe("reward");
    expect(missingRequiredFields(r)).toEqual([]); // 카드번호·승인번호 면제
  });
});

describe("현금(지출증빙) 구매 — 전화번호 포착 + 현금은 카드번호·승인번호 면제", () => {
  const R = `97866803502
판매
SYNTHA 단백질
660152    5    79,900    399,500 T
면세    0
과세    363,182
부가세    36,318
**** 합계 (VAT 포함)    399,500
현금    400,000
잔돈    500
현금(지출증빙): 010****1201
승인번호: 122988567
승인금액: 399500
총 판매 상품 수 5
2026/05/08 12:48:00 PM 855 14 114 152
REG#14`;
  const r = parseReceipt(R);
  it("지출증빙 전화번호를 card_number_masked 에", () => {
    expect(r.payment.card_number_masked).toBe("010****1201");
    expect(r.summary.cash).toBe(400000);
  });
  it("현금 구매는 카드번호·승인번호 없어도 저장 가능(면제)", () => {
    expect(missingRequiredFields(r)).toEqual([]);
    expect(receiptFileName(r)).toBe("구매_현금_2026-05-08_97866803502_010____1201_122988567");
  });
});

describe("카드+현금 분할결제 — 텐더/승인 분리", () => {
  const R = `97866803502
판매
미츠칸쯔유1.8L
579734    13    7,790    101,270 T
프렌치버터크라상
586503    2    11,790    23,580 T
*** 취소
프렌치버터크라상
586503    1    11,790    - 11,790 T
서울커피우유12
668791    1    10,690    10,690 T
*** CPN
커피우유
18156    1    1,500    - 1,500 T
면세    0
과세    111,127
부가세    11,113
**** 합계 (VAT 포함)    122,240
현금    500,000
거래구분:구매
승인금액: 122,240 할부 00개월
카드번호: 40457700****120*
승인번호: 00179020 IC AP
카드    122,240
잔돈    0
현금(소득공제): 010****1201
승인번호: 121006577
승인금액: 500000
쿠폰합계 1,500
총 판매 상품 수 15
2026/03/04 11:51:00 AM 855 14 34 136
REG#14`;
  const r = parseReceipt(R);
  it("대표 승인=카드(00179020, IC), 현금 승인=cash_approval_no(121006577)", () => {
    expect(r.payment.approval_no).toBe("00179020");
    expect(r.payment.card_brand).toBe("IC");
    expect(r.payment.card_number_masked).toBe("40457700****120*"); // 카드번호(전화번호로 안 덮임)
    expect(r.cash_approval_no).toBe("121006577");
  });
  it("텐더 금액: 카드+현금 둘 다, payment_method='복합', 파일명 구매_카드현금", () => {
    expect(r.summary.card).toBe(122240);
    expect(r.summary.cash).toBe(500000);
    expect(buildReceiptPayload(r, R).payment_method).toBe("복합");
    expect(receiptFileName(r)).toBe("구매_카드현금_2026-03-04_97866803502_40457700____120__00179020");
  });
});
