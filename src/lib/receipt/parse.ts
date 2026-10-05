/**
 * 코스트코 영수증 텍스트 → 구조화 파싱 (결정론적, LLM 불필요).
 *
 * merrycoco-admin `src/lib/receipt-parse.ts` 에서 **로직을 그대로** 가져왔다. 순수 함수라
 * DB·프레임워크 의존이 없어 손댈 것이 없었다. 테스트 전수(실제 영수증 기반)도 함께 옮겼다.
 *
 * 영수증은 규칙적이라 정규식 줄 분류로 정확히 파싱되고, **영수증 자체 값으로 자기검증**된다:
 *   ① 수량 합 == "총 판매 상품 수"   ② 쿠폰 할인 합 == "쿠폰합계"
 *   ③ 과세 + 부가세 == 합계          ④ 품목 금액 합 − 쿠폰 합 == 합계
 * 네 체크섬이 모두 맞으면 reconciled=true (파싱이 100% 정확함을 증명). 하나라도 어긋나면
 * false → 화면에서 검토(추후 LLM 폴백 대상).
 *
 * 줄 구조:
 *   <상품명>
 *   <상품코드> <수량> <단가> <금액> T          ← 품목
 *   *** CPN                                     ← 쿠폰 마커
 *   <상품명(때로 잘림)>
 *   <쿠폰코드> <수량> <단가> - <할인액> T        ← 쿠폰(직전 품목에 연결, '-' 가 표식)
 */

export interface ReceiptCoupon {
  code: string;
  qty: number;
  unit_discount: number | null;
  discount: number;
}

export interface ReceiptItem {
  name: string | null;
  product_code: string;
  qty: number;
  unit_price: number | null;
  amount: number | null;
  coupon: ReceiptCoupon | null;
}

export interface ReceiptSummary {
  tax_free: number | null;
  taxable: number | null;
  vat: number | null;
  total: number | null;
  coupon_total: number | null;
  item_count: number | null; // "총 판매 상품 수" (수량 합)
  amount_coupon: number | null; // "금액쿠폰"(주문단위 금액쿠폰, 음수) — 세금검사에 포함. 없으면 null
  card: number | null;
  cash: number | null;        // 현금 결제(카드가 아닌 경우) — 없으면 null
  reward: number | null;      // 리워드 결제(EM리워드 등) — 없으면 null
  change: number | null;
}

export interface ReceiptPayment {
  type: string | null;             // 거래구분 (구매)
  approved_amount: number | null;  // 승인금액
  installment_months: number | null;
  card_number_masked: string | null;
  approval_no: string | null;      // 승인번호
  card_brand: string | null;       // BC 등
}

export interface ReceiptChecks {
  qty_ok: boolean;     // 수량 합 == item_count
  coupon_ok: boolean;  // 쿠폰 할인 합 == coupon_total
  tax_ok: boolean;     // 과세 + 부가세 == 합계
  amount_ok: boolean;  // 품목 금액 합 − 쿠폰 합 == 합계
  qty_sum: number;
  coupon_sum: number;
  amount_sum: number;
}

export interface ParsedReceipt {
  kind: "purchase" | "refund"; // 구매 / 환불(반품) — 저장 시 이 값으로 헤더 테이블을 가른다
  member_no: string | null;    // 코스트코 멤버십 회원번호(11~12자리) — 맨 윗줄('판매'/'반품' 문구 윗줄)
  original_approval_no: string | null; // 원승인번호(환불이 참조하는 원구매 승인번호) — 있을 때만
  cash_approval_no: string | null;     // 현금 승인번호 — 카드+현금 분할결제에서 현금영수증 승인(카드 승인은 approval_no). 없으면 null
  purchased_at: string | null; // "2026-02-06T12:11:00" (영수증 로컬 시각)
  original_date: string | null; // 환불 전용: 원거래일("20260126"→"2026-01-26"). 구매는 null
  register: string | null;
  items: ReceiptItem[];
  summary: ReceiptSummary;
  payment: ReceiptPayment;
  reconciled: boolean;
  checks: ReceiptChecks;
  unparsed: string[]; // 분류 못 한 줄(무시 대상 제외) — 검토 참고
}

/**
 * 리네임 저장용 파일명(확장자 제외).
 *   · 형식: `구분_결제수단_일자_회원번호_카드번호_승인번호` (구분=구매|환불, 결제수단=카드|현금|포인트).
 *   · 결제수단: 카드(카드 결제) / 현금(현금·소득공제) / 포인트(리워드) / 기타(미상).
 *   · 현금영수증이면 카드번호 자리=전화번호, 승인번호=현금 승인번호. 결손은 no-member·no-card·no-approval·no-date.
 * 일자 = 구매/반품 일자(purchased_at 의 DATE). 파일시스템 금지문자(경로구분·제어문자)만 '_' 치환.
 */
export function receiptFileName(p: ParsedReceipt): string {
  const kind = p.kind === "refund" ? "환불" : "구매";
  // 결제수단: 있는 텐더를 카드·현금·포인트 순으로 결합(분할이면 '카드현금' 등). 금액줄 없이 카드번호/승인만 있으면 카드.
  const tenders = [p.summary.card != null && "카드", p.summary.cash != null && "현금", p.summary.reward != null && "포인트"].filter(Boolean) as string[];
  const pay = tenders.length > 0 ? tenders.join("") : ((p.payment.card_number_masked || p.payment.approval_no) ? "카드" : "기타");
  const date = p.purchased_at ? p.purchased_at.slice(0, 10) : "no-date";
  const member = p.member_no ?? "no-member";
  // 구분_결제수단_일자_회원번호_카드번호_승인번호. 현금(소득공제)은 전화번호가 card_number_masked, 현금 승인번호가 approval_no.
  const raw = `${kind}_${pay}_${date}_${member}_${p.payment.card_number_masked ?? "no-card"}_${p.payment.approval_no ?? "no-approval"}`;
  // 공백·경로구분('/')·카드마스크 '*' 를 '_' 로(날짜 하이픈은 보존). 경로이탈은 라우트의 path.basename 이 방어.
  return raw.replace(/[/*]/g, "_").replace(/ +/g, "_").trim();
}

/** 현금반품 여부 — 반품이면서 승인번호·카드번호가 모두 없으면 현금 결제 반품으로 본다. */
export function isCashRefund(p: ParsedReceipt): boolean {
  return p.kind === "refund" && !p.payment.approval_no && !p.payment.card_number_masked;
}

/**
 * 저장 필수항목 검증 — 누락 항목명 배열(빈 배열이면 저장 가능).
 *   · 구매(카드/현금소득공제) : 멤버십번호·카드번호·승인번호·구매일자
 *   · 반품(카드)              : 멤버십번호·카드번호·승인번호·원구매일·반품일자
 *   · 반품(현금 무기명)·리워드결제 : 카드번호·승인번호 면제(그 결제엔 원래 없음). 현금환불은 원구매일도 면제
 *       (1년 경과 등 원거래 미연결 건을 코스트코가 현금환불하는 유형 — 원거래일이 영수증에 없고 확보 데이터는 2026-03~ 라 연결 불가).
 *       나머지(멤버십·일자)는 필수.
 * 클라이언트(저장 버튼 차단)·서버(저장 거부) 공용이라 순수 파서 파일에 둔다.
 */
export function missingRequiredFields(p: ParsedReceipt): string[] {
  // 현금 결제(구매·환불)·리워드는 카드번호·승인번호가 원래 없거나 불필요 → 면제.
  //   (현금영수증이면 전화번호가 card_number_masked 에 채워지지만, 없어도 저장 가능.)
  const cardExempt = p.summary.cash != null || p.summary.reward != null || isCashRefund(p);
  const miss: string[] = [];
  if (!p.member_no) miss.push("멤버십번호");
  if (!p.purchased_at) miss.push(p.kind === "refund" ? "반품일자" : "구매일자");
  if (!cardExempt && !p.payment.card_number_masked) miss.push("카드번호");
  if (!cardExempt && !p.payment.approval_no) miss.push("승인번호");
  // 원구매일: 카드환불만 필수(원거래 연결 가능). 현금환불은 원거래 미연결이라 면제 — 있으면(자동/수동) 그대로 저장.
  if (p.kind === "refund" && !isCashRefund(p) && !p.original_date) miss.push("원구매일");
  return miss;
}

// ── 줄 패턴 ──
// 코드 수량 단가 금액 [T]. 과세품은 끝에 'T', **면세품은 T 없음**(예: 연세락토프리우유) → T 를 선택으로 둔다.
const RE_ITEM = /^(\d+)\s+(\d+)\s+([\d,]+)\s+([\d,]+)(?:\s+T)?$/;
// 코드 수량 단가 - 할인 [T]. 면세 상품의 쿠폰은 줄 끝 'T' 가 없다(예: 연세멸균우유 -12,000) → T 선택.
const RE_COUPON = /^(\d+)\s+(\d+)\s+([\d,]+)\s+-\s*([\d,]+)(?:\s+T)?$/;
const RE_DATETIME = /(\d{4})\/(\d{2})\/(\d{2})\s+(\d{1,2}):(\d{2}):(\d{2})\s*(AM|PM)?/i;
const RE_REG = /REG#\s*(\d+)/i;

// 정규식 캡처는 noUncheckedIndexedAccess 아래에서 `string | undefined` 다.
// 아래 String(s)+NaN 가드가 undefined 를 이미 null 로 떨어뜨리므로 그대로 받는다.
const toInt = (s: string | undefined): number | null => {
  const n = parseInt(String(s).replace(/,/g, ""), 10);
  return Number.isNaN(n) ? null : n;
};
/**
 * 줄의 마지막 숫자 + 인접 부호(환불 음수 대응).
 * "과세   - 34,536" → -34536, "카드   - 37,990" → -37990, "37,990-" → -37990, "0" → 0.
 * 구매 영수증엔 부호가 없어 lastNum 과 동일한 양수를 돌려준다(회귀 없음).
 */
const signedLastNum = (line: string): number | null => {
  const re = /(-\s*)?([\d,]+)(\s*-)?/g;
  let m: RegExpExecArray | null;
  let last: RegExpExecArray | null = null;
  while ((m = re.exec(line)) !== null) { if (m[2]) last = m; }
  if (!last) return null;
  const v = toInt(last[2]);
  if (v == null) return null;
  return (last[1] || last[3]) ? -v : v;
};

/** "2026/02/06 12:11:00 PM" → "2026-02-06T12:11:00" (12시간→24시간 보정). */
function parseDateTime(line: string): string | null {
  const m = line.match(RE_DATETIME);
  if (!m) return null;
  const [, y, mo, d, hh, mi, ss, ap] = m;
  let h = parseInt(hh!, 10);
  const mer = (ap || "").toUpperCase();
  if (mer === "PM" && h < 12) h += 12;
  if (mer === "AM" && h === 12) h = 0;
  return `${y}-${mo}-${d}T${String(h).padStart(2, "0")}:${mi}:${ss}`;
}

/**
 * 코스트코 멤버십 회원번호(11~12자리) 추출.
 *  · 구매 영수증: 맨 윗줄(= '판매' 문구 윗줄), 환불: '반품'/'*** RFND' 윗줄.
 *  · 1차: 상단의 11~12자리 단독 줄(가장 신뢰 — 품목/코드 줄은 T·다중숫자라 안 걸림). 상단부터 첫 매치.
 *  · 2차 폴백: '판매'/'반품' 문구 바로 윗줄에서 11~12자리 추출('총 판매 상품 수' 푸터는 제외).
 *  (회원번호 자릿수가 카드마다 11 또는 12자리로 다르다 — 예: 931327247700=12자리.)
 */
function extractMemberNo(lines: string[], isRefund: boolean): string | null {
  for (const l of lines) {
    const m = l.match(/^(\d{11,12})$/);
    if (m) return m[1]!;
  }
  const kw = isRefund ? /반품/ : /판매/;
  for (let i = 1; i < lines.length; i++) {
    if (kw.test(lines[i]!) && !/상품\s*수/.test(lines[i]!)) {
      const m = lines[i - 1]!.match(/(\d{11,12})/);
      if (m) return m[1]!;
      break;
    }
  }
  return null;
}

// 무시할 줄(구분선·홍보·단독 날짜)
const isIgnorable = (l: string): boolean =>
  /^-{3,}$/.test(l) ||                 // ----
  /^\*{2,}[^C]/.test(l) ||             // **** 홍보 (단, *** CPN 은 위에서 처리)
  /^\*\*\* .*\*\*\*$/.test(l) ||       // *** ... ***
  /^\d{4}\/\d{2}\/\d{2}$/.test(l);     // 단독 날짜

export function parseReceipt(text: string): ParsedReceipt {
  const raw = String(text ?? "");
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // 구매/환불 판별(사전 스캔). 환불이면 '-' 줄을 쿠폰이 아닌 "환불 품목"으로 해석하므로
  // 품목 줄을 만나기 전에 미리 알아야 한다. 마커·거래구분·음수 상품수 중 하나면 환불.
  const isRefund =
    /\*\*\*\s*RFND/i.test(raw) ||
    /거래구분\s*:\s*반품/.test(raw) ||
    /총\s*판매\s*상품\s*수\s+-/.test(raw);

  const member_no = extractMemberNo(lines, isRefund);

  const items: ReceiptItem[] = [];
  const summary: ReceiptSummary = {
    tax_free: null, taxable: null, vat: null, total: null,
    coupon_total: null, item_count: null, amount_coupon: null, card: null, cash: null, reward: null, change: null,
  };
  const payment: ReceiptPayment = {
    type: null, approved_amount: null, installment_months: null,
    card_number_masked: null, approval_no: null, card_brand: null,
  };
  let purchased_at: string | null = null;
  let original_date: string | null = null;
  let original_approval_no: string | null = null;
  let cash_approval_no: string | null = null;
  let hasRealCard = false; // '카드번호:' 줄을 봤는지 — 승인번호 카드/현금 구분용
  let register: string | null = null;
  const unparsed: string[] = [];

  let pendingName: string | null = null;
  let couponMode = false;
  let cancelMode = false; // '*** 취소' 직후의 '-' 줄은 쿠폰이 아니라 취소된 품목(음수)

  for (const line of lines) {
    // 0) 회원번호 단독 줄(11~12자리) — 이미 별도 추출했으므로 pendingName 오염 방지 차원에서 건너뛴다.
    if (/^\d{11,12}$/.test(line)) continue;

    // 1) 쿠폰 마커(구매) / 환불 마커 / 취소 마커. RFND 는 판별에만 쓰고 건너뛴다.
    if (/^\*\*\* ?CPN/i.test(line)) { couponMode = true; continue; }
    if (/^\*\*\* ?RFND/i.test(line)) { continue; }
    if (/^\*\*\* ?취소/.test(line)) { cancelMode = true; continue; } // 다음 '-' 줄 = 취소 품목(음수)

    // 1-b) '*** CPN' 직후인데 '-' 없는 양수 데이터 줄 = 환불 영수증의 쿠폰 반환(양수 표기).
    //      품목이 아니라 쿠폰(환불이라 음수 할인)으로 직전 품목에 연결. (구매 쿠폰은 '-' 표기라 여기 안 걸림.)
    if (couponMode && !RE_COUPON.test(line)) {
      const im = line.match(RE_ITEM);
      if (im) {
        const amt = toInt(im[4]) ?? 0;
        const coupon: ReceiptCoupon = { code: im[1]!, qty: toInt(im[2]) ?? 0, unit_discount: toInt(im[3]), discount: isRefund ? -amt : amt };
        if (items.length > 0) items[items.length - 1]!.coupon = coupon; else unparsed.push(line);
        couponMode = false;
        continue;
      }
    }

    // 2) '-' 표식 줄
    const mc = line.match(RE_COUPON);
    if (mc) {
      if (isRefund || cancelMode) {
        // 환불 영수증의 '-' 줄, 또는 구매 영수증의 '*** 취소' 직후 '-' 줄 = 취소/환불된 품목.
        // 수량·금액을 음수로 저장해 음수 합계·"총 판매 상품 수" 및 쿠폰합계와 체크섬이 맞는다(쿠폰 아님).
        const q = toInt(mc[2]) ?? 0;
        items.push({
          name: pendingName, product_code: mc[1]!, qty: -q,
          unit_price: toInt(mc[3]), amount: -(toInt(mc[4]) ?? 0), coupon: null,
        });
        pendingName = null;
        cancelMode = false;
        continue;
      }
      // 구매: 쿠폰 데이터 — 직전 품목에 연결
      const coupon: ReceiptCoupon = {
        code: mc[1]!, qty: toInt(mc[2]) ?? 0,
        unit_discount: toInt(mc[3]), discount: toInt(mc[4]) ?? 0,
      };
      if (items.length > 0) items[items.length - 1]!.coupon = coupon;
      else unparsed.push(line);
      couponMode = false;
      continue;
    }

    // 3) 품목 데이터
    const mi = line.match(RE_ITEM);
    if (mi) {
      items.push({
        name: pendingName, product_code: mi[1]!, qty: toInt(mi[2]) ?? 0,
        unit_price: toInt(mi[3]), amount: toInt(mi[4]), coupon: null,
      });
      pendingName = null;
      couponMode = false;
      continue;
    }

    // 4) 푸터 (한글 뒤 \b 는 매칭 안 되므로 \s 로 구분)
    //    금액은 signedLastNum 으로 환불 음수까지 잡는다(구매는 부호 없어 양수 그대로).
    if (/^면세\s/.test(line)) { summary.tax_free = signedLastNum(line); continue; }
    if (/^과세\s/.test(line)) { summary.taxable = signedLastNum(line); continue; }
    if (/^부가세\s/.test(line)) { summary.vat = signedLastNum(line); continue; }
    if (/합계/.test(line) && /VAT|합계/.test(line) && summary.total === null && /[\d,]/.test(line)) {
      // "**** 합계 (VAT 포함)   743,140"  /  환불 "… - 37,990"
      summary.total = signedLastNum(line); continue;
    }
    if (/^쿠폰합계/.test(line)) { summary.coupon_total = signedLastNum(line); continue; }
    if (/^총 ?판매 ?상품 ?수/.test(line)) { summary.item_count = signedLastNum(line); continue; }
    if (/^원거래일/.test(line)) {
      // 환불 전용: "원거래일: 20260126" → "2026-01-26"
      const m = line.match(/(\d{4})(\d{2})(\d{2})/);
      original_date = m ? `${m[1]}-${m[2]}-${m[3]}` : null;
      continue;
    }
    if (/^원승인번호/.test(line)) { // 환불이 참조하는 원구매 승인번호. '승인번호'보다 먼저 걸리게(문두 '원').
      original_approval_no = line.split(":")[1]?.trim().split(/\s+/)[0] ?? null;
      continue;
    }
    if (/^카드번호/.test(line)) {
      const m = line.split(":")[1]?.trim().split(/\s+/)[0];
      payment.card_number_masked = m ?? null;
      hasRealCard = true; // 실제 카드번호 줄 — 이 뒤 첫 승인번호가 카드 승인(대표)
      continue;
    }
    if (/^승인번호/.test(line)) {
      const rest = line.split(":")[1]?.trim().split(/\s+/) ?? [];
      const val = rest[0] ?? null;
      // 대표 승인번호(approval_no) = 첫 승인번호(카드 있으면 카드 승인, 순수 현금이면 현금 승인). 덮어쓰지 않는다.
      // 카드+현금 분할이면 카드번호 뒤 첫 승인=카드(대표), 현금영수증 뒤 두 번째 승인=현금 → cash_approval_no.
      if (!payment.approval_no) { payment.approval_no = val; payment.card_brand = rest[1] ?? null; }
      else if (hasRealCard && !cash_approval_no) { cash_approval_no = val; }
      continue;
    }
    if (/^승인금액/.test(line)) {
      const a = line.match(/[\d,]+/) ? toInt(line.match(/[\d,]+/)![0]) : null;
      // 환불이면 음수("37,990- 할부 …"). 구매는 양수.
      payment.approved_amount = a == null ? null : (isRefund ? -a : a);
      const hb = line.match(/할부\s*(\d+)\s*개월/);
      payment.installment_months = hb ? parseInt(hb[1]!, 10) : null;
      continue;
    }
    if (/^거래구분/.test(line)) { payment.type = line.split(":")[1]?.trim() ?? null; continue; }
    if (/^카드\s+-?\s*[\d,]+$/.test(line)) { summary.card = signedLastNum(line); continue; }
    // 현금영수증(소득공제/지출증빙 등) 전화번호 — 카드번호 필드에 저장(현금영수증의 결제 식별자로 취급).
    //   "현금(소득공제): 010****1201" / "현금(지출증빙): ...". 괄호 안 문구는 무엇이든 허용.
    const mCashPhone = line.match(/^현금\s*\([^)]*\)\s*:?\s*([\d*\-]+)/);
    if (mCashPhone) { if (!payment.card_number_masked) payment.card_number_masked = mCashPhone[1]!; continue; }
    if (/^현금\s/.test(line)) { summary.cash = (summary.cash ?? 0) + (signedLastNum(line) ?? 0); continue; } // 현금 결제(여러 줄 합산)
    if (/^금액쿠폰/.test(line)) { summary.amount_coupon = signedLastNum(line); continue; } // 주문단위 금액쿠폰(음수) — 세금검사 포함
    if (/^(EM)?리워드\s/.test(line)) { summary.reward = signedLastNum(line); continue; } // 리워드 결제(EM리워드 등)
    if (/^잔돈\s/.test(line)) { summary.change = signedLastNum(line); continue; }
    if (RE_DATETIME.test(line)) { purchased_at = parseDateTime(line); continue; }
    if (RE_REG.test(line)) { register = line.match(RE_REG)![1]!; continue; }

    // 5) 무시 대상
    if (isIgnorable(line)) continue;

    // 6) 그 외 — 쿠폰의 상품명(무시) 또는 다음 품목 이름
    if (couponMode) continue;      // 쿠폰 상품명 줄 → 무시(couponMode 유지)
    pendingName = line;            // 품목 이름 후보
  }

  // ── 체크섬 ──
  const qty_sum = items.reduce((a, it) => a + (it.qty || 0), 0);
  const coupon_sum = items.reduce((a, it) => a + (it.coupon?.discount || 0), 0);
  const amount_sum = items.reduce((a, it) => a + (it.amount || 0), 0);

  const checks: ReceiptChecks = {
    qty_ok: summary.item_count != null && qty_sum === summary.item_count,
    // 쿠폰합계 줄이 있으면 합과 대조, 없으면(환불·무쿠폰 구매) 쿠폰 합이 0 이어야 통과.
    coupon_ok: summary.coupon_total != null
      ? coupon_sum === summary.coupon_total
      : coupon_sum === 0,
    // 면세+과세+부가세(+금액쿠폰) == 합계. 면세는 total 에 포함되므로 더하고, 금액쿠폰(주문단위 할인, 음수)은 세금 뒤 차감.
    tax_ok: summary.taxable != null && summary.vat != null && summary.total != null &&
      (summary.tax_free ?? 0) + summary.taxable + summary.vat + (summary.amount_coupon ?? 0) === summary.total,
    amount_ok: summary.total != null && amount_sum - coupon_sum === summary.total,
    qty_sum, coupon_sum, amount_sum,
  };
  const reconciled = checks.qty_ok && checks.coupon_ok && checks.tax_ok && checks.amount_ok;

  return {
    kind: isRefund ? "refund" : "purchase",
    member_no, original_approval_no, cash_approval_no,
    purchased_at, original_date, register, items, summary, payment, reconciled, checks, unparsed,
  };
}
