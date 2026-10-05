// 파싱된 영수증 → Postgres 저장. 헤더 1건 + 상세 N건을 한 트랜잭션에 쓴다.
//
// merrycoco-admin 원본은 MSSQL 저장 프로시저(MERGE)였다. 여기서는 SQL 을 직접 쓴다 —
// 단일 풀 + `tenant_id` 구조라 SP 를 둘 이유가 없다.
//
// **멱등이다.** 같은 영수증을 다시 올리면 자연키(tenant_id · purchased_at · register)에서
// 부딪혀 헤더를 갱신하고 상세를 **교체**한다. 파서를 고친 뒤 재파싱해 다시 넣는 흐름이
// 그래서 안전하다. 상세를 지우고 다시 넣는 이유는 줄 번호가 재파싱으로 달라질 수 있어서다.
import { ttx } from "../db";
import { missingRequiredFields, type ParsedReceipt } from "./parse";
import { buildReceiptPayload } from "./payload";
import { receiptStatements } from "./statements";

export class ReceiptSaveError extends Error {}

/**
 * 유일성 위반. 자연키는 `on conflict` 로 갱신되므로 **평소에는 나지 않는다** — 방어용이다.
 *
 * 한때 `(날짜, 카드, 승인번호)` 유니크 인덱스를 두고 이걸 던졌는데, 실데이터에서 같은 날
 * 같은 카드의 승인번호가 반복되는 것이 확인돼 인덱스를 제거했다(sql/011).
 */
export class DuplicateReceiptError extends ReceiptSaveError {}

export interface SaveReceiptResult {
  id: string;
  kind: "purchase" | "refund";
  inserted: boolean; // false 면 기존 영수증을 갱신했다
  items: number;
}

export async function saveReceipt(
  tenantId: string,
  parsed: ParsedReceipt,
  rawText: string,
): Promise<SaveReceiptResult> {
  const missing = missingRequiredFields(parsed);
  if (missing.length) {
    throw new ReceiptSaveError(`저장 필수항목이 없습니다: ${missing.join(" · ")}`);
  }

  const p = buildReceiptPayload(parsed, rawText);
  const st = receiptStatements(p, parsed.kind === "refund" ? "REFUND" : "PURCHASE");

  try {
    return await ttx(tenantId, async (tx) => {
      const [row] = await tx.q<{ id: string; inserted: boolean }>(st.header.sql, st.header.params);
      if (!row) throw new ReceiptSaveError("영수증 헤더 저장이 아무 행도 돌려주지 않았습니다.");

      // 상세 교체 — 재파싱으로 줄 구성이 바뀔 수 있어 갱신이 아니라 지우고 다시 넣는다.
      await tx.child(st.deleteItems.sql, [row.id]);
      if (st.insertItems) await tx.child(st.insertItems.sql, [row.id, ...st.insertItems.params]);

      return { id: row.id, kind: parsed.kind, inserted: row.inserted, items: p.items.length };
    });
  } catch (err) {
    // 23505 = unique_violation. 자연키는 on conflict 로 처리되므로 여기 오면 예상 못 한 충돌이다.
    const e = err as { code?: string; constraint?: string };
    if (e.code === "23505") {
      throw new DuplicateReceiptError(
        `이미 등록된 영수증입니다 (${e.constraint ?? "유일성 위반"}).`,
      );
    }
    throw err;
  }
}
