import { NextRequest, NextResponse } from "next/server";
import { parseReceipt, missingRequiredFields } from "@/lib/receipt/parse";
import { saveReceipt, DuplicateReceiptError, ReceiptSaveError } from "@/lib/receipt/save";
import { tenantOrNull } from "@/lib/session";

/**
 * 영수증 텍스트 → 파싱 → 저장. `POST { text }` → `{ id, kind, inserted, items, reconciled }`.
 *
 * **서버에서 다시 파싱한다.** 화면이 보낸 파싱 결과를 믿지 않는다 — 파서는 순수 함수라
 * 같은 입력이면 같은 결과가 나오고, 저장 시점의 파서 버전으로 재현하는 것이 권위다.
 * 구매·환불은 파서의 `kind` 로 자동 라우팅한다.
 *
 * 응답 코드:
 *   400 본문 형식·빈 텍스트   422 필수항목 누락·품목 0건
 *   409 같은 카드·승인번호가 다른 시각으로 들어옴(재업로드)
 *
 * `reconciled = false` 도 **저장한다**. 검증 실패를 버리면 왜 틀렸는지 되짚을 수 없다.
 */
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: { text?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ message: "잘못된 요청 형식입니다." }, { status: 400 });
  }

  const text = typeof body.text === "string" ? body.text : "";
  if (!text.trim()) {
    return NextResponse.json({ message: "영수증 텍스트를 입력하세요." }, { status: 400 });
  }

  // 라우트에서는 리다이렉트가 쓸모없다 — fetch 가 307 을 따라가 로그인 HTML 을 받는다.
  // 그래서 여기서만 직접 401 을 돌려준다.
  const tenant = await tenantOrNull();
  if (!tenant) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }

  try {
    const parsed = parseReceipt(text);

    const missing = missingRequiredFields(parsed);
    if (missing.length) {
      return NextResponse.json(
        { message: `필수 항목이 없어 저장할 수 없습니다: ${missing.join(" · ")}` },
        { status: 422 },
      );
    }
    if (parsed.items.length === 0) {
      return NextResponse.json({ message: "품목을 인식하지 못했습니다." }, { status: 422 });
    }

    const saved = await saveReceipt(tenant.id, parsed, text);
    return NextResponse.json({ ...saved, reconciled: parsed.reconciled });
  } catch (err) {
    if (err instanceof DuplicateReceiptError) {
      return NextResponse.json({ message: err.message }, { status: 409 });
    }
    if (err instanceof ReceiptSaveError) {
      return NextResponse.json({ message: err.message }, { status: 422 });
    }
    console.error("[receipt/save]", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "저장에 실패했습니다." },
      { status: 500 },
    );
  }
}
