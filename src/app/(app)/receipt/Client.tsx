"use client";

import { useCallback, useRef, useState, type DragEvent } from "react";
import {
  parseReceipt,
  missingRequiredFields,
  type ParsedReceipt,
} from "@/lib/receipt/parse";

/**
 * 영수증 입력 화면 — `.txt` 드래그드랍(다중) 또는 붙여넣기 → 결정론적 파싱 → 목록 → 저장.
 *
 * 파싱은 **화면에서** `parseReceipt`(순수 함수)를 직접 불러 즉시 보여준다. 저장은 건별로
 * `POST /api/receipt/save` 를 쳐서 **서버가 다시 파싱**한 결과를 적재한다 — 화면 결과를
 * 믿지 않는다. `.txt` 한 개 = 영수증 1건이고, 붙여넣기도 목록의 1건이 된다.
 *
 * merrycoco-admin 의 같은 화면에서 가져왔다. 회원번호→이름 조회(사내 회원 마스터)와
 * txt 내보내기(사내 운영 도구)는 판매자용에 필요가 없어 떼어냈다.
 */

type SaveState =
  | { state: "idle" }
  | { state: "saving" }
  | { state: "saved"; id: string; items: number; inserted: boolean }
  | { state: "dup"; msg: string }
  | { state: "error"; msg: string };

interface Entry {
  id: string;
  name: string;
  text: string;
  parsed: ParsedReceipt;
  missing: string[];
  save: SaveState;
}

const won = (n: number | null | undefined) => (n == null ? "—" : n.toLocaleString("ko-KR"));

function CheckRow({
  label, left, right, ok,
}: { label: string; left: number | null; right: number | null; ok: boolean }) {
  return (
    <tr className={ok ? "" : "bg-red-50"}>
      <td className="px-2 py-1">{label}</td>
      <td className="tabular px-2 py-1 text-right">{won(left)}</td>
      <td className="px-2 py-1 text-center text-gray-400">{ok ? "=" : "≠"}</td>
      <td className="tabular px-2 py-1 text-right">{won(right)}</td>
      <td className="px-2 py-1 text-center">
        {ok ? <span className="text-green-600">✓</span> : <span className="font-bold text-red-600">✗</span>}
      </td>
    </tr>
  );
}

/** 선택된 영수증 상세 — 4중 검산 · 요약 · 품목. */
function ReceiptDetail({ p }: { p: ParsedReceipt }) {
  const c = p.checks;
  return (
    <>
      <div className={`rounded-lg border p-4 ${p.reconciled ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold text-white ${p.kind === "refund" ? "bg-amber-500" : "bg-slate-700"}`}>
            {p.kind === "refund" ? "환불(반품)" : "구매"}
          </span>
          <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold text-white ${p.reconciled ? "bg-green-600" : "bg-red-600"}`}>
            {p.reconciled ? "✓ 검증 통과" : "✗ 검증 실패"}
          </span>
          <span className="text-sm text-gray-600">
            {p.reconciled
              ? "4종 체크섬이 모두 일치 — 파싱이 정확하다."
              : "체크섬 불일치 — 원문과 파싱을 검토해야 한다."}
          </span>
        </div>
        <table className="mt-3 w-full border-collapse text-xs">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="px-2 py-1">체크</th>
              <th className="px-2 py-1 text-right">파싱값</th>
              <th className="px-2 py-1" />
              <th className="px-2 py-1 text-right">영수증값</th>
              <th className="px-2 py-1 text-center">결과</th>
            </tr>
          </thead>
          <tbody>
            <CheckRow label="수량 합 = 총 판매 상품 수" left={c.qty_sum} right={p.summary.item_count} ok={c.qty_ok} />
            <CheckRow label="쿠폰 할인 합 = 쿠폰합계" left={c.coupon_sum} right={p.summary.coupon_total} ok={c.coupon_ok} />
            <CheckRow
              label="면세 + 과세 + 부가세 = 합계"
              left={(p.summary.tax_free ?? 0) + (p.summary.taxable ?? 0) + (p.summary.vat ?? 0)}
              right={p.summary.total}
              ok={c.tax_ok}
            />
            <CheckRow label="품목 금액 합 − 쿠폰 = 합계" left={c.amount_sum - c.coupon_sum} right={p.summary.total} ok={c.amount_ok} />
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1 rounded-lg border border-gray-200 bg-white p-4 text-sm sm:grid-cols-3">
        <span>{p.kind === "refund" ? "처리일시" : "구매일시"} <b>{p.purchased_at ?? "—"}</b></span>
        <span>회원번호 <b className="tabular">{p.member_no ?? <span className="text-red-500">없음</span>}</b></span>
        <span>매장(REG) <b>{p.register ?? "—"}</b></span>
        {p.kind === "refund" && <span>원거래일 <b>{p.original_date ?? "—"}</b></span>}
        {p.original_approval_no && <span>원승인번호 <b className="tabular">{p.original_approval_no}</b></span>}
        <span>총 상품수 <b className="tabular">{p.summary.item_count ?? "—"}</b></span>
        <span>과세 <b className="tabular">{won(p.summary.taxable)}</b></span>
        <span>부가세 <b className="tabular">{won(p.summary.vat)}</b></span>
        <span>합계 <b className="tabular text-blue-700">{won(p.summary.total)}</b></span>
        <span>쿠폰합계 <b className="tabular">{won(p.summary.coupon_total)}</b></span>
        <span>카드 <b className="tabular">{won(p.summary.card)}</b></span>
        <span>현금 <b className="tabular">{won(p.summary.cash)}</b></span>
        {p.summary.reward != null && <span>포인트 <b className="tabular">{won(p.summary.reward)}</b></span>}
        {p.cash_approval_no && <span>현금승인 <b className="tabular">{p.cash_approval_no}</b></span>}
        <span>승인번호 <b>{p.payment.approval_no ?? "—"} {p.payment.card_brand ?? ""}</b></span>
        <span className="col-span-2 text-xs text-gray-400 sm:col-span-3">
          카드번호 {p.payment.card_number_masked ?? "—"} · 승인금액 {won(p.payment.approved_amount)} · 할부 {p.payment.installment_months ?? 0}개월
        </span>
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200 bg-white p-3">
        <table className="min-w-full border-collapse text-xs">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="w-8 px-2 py-1">#</th>
              <th className="px-2 py-1">상품명</th>
              <th className="px-2 py-1">상품코드</th>
              <th className="px-2 py-1 text-right">수량</th>
              <th className="px-2 py-1 text-right">단가</th>
              <th className="px-2 py-1 text-right">금액</th>
              <th className="px-2 py-1">쿠폰코드</th>
              <th className="px-2 py-1 text-right">할인</th>
            </tr>
          </thead>
          <tbody>
            {p.items.map((it, i) => (
              <tr key={i} className="border-t border-gray-100">
                <td className="px-2 py-1 text-gray-400">{i + 1}</td>
                <td className="px-2 py-1">{it.name ?? <span className="text-red-500">(이름 없음)</span>}</td>
                <td className="tabular px-2 py-1">{it.product_code}</td>
                <td className="tabular px-2 py-1 text-right">{it.qty}</td>
                <td className="tabular px-2 py-1 text-right">{won(it.unit_price)}</td>
                <td className="tabular px-2 py-1 text-right">{won(it.amount)}</td>
                <td className="tabular px-2 py-1 text-gray-500">{it.coupon?.code ?? ""}</td>
                <td className="tabular px-2 py-1 text-right text-red-600">
                  {it.coupon ? `-${won(it.coupon.discount)}` : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {p.unparsed.length > 0 && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          <b>미분류 줄 {p.unparsed.length}개</b> — 파서가 인식하지 못했다. 검토가 필요하다:
          <ul className="mt-1 list-disc pl-5">
            {p.unparsed.map((l, i) => <li key={i} className="font-mono">{l}</li>)}
          </ul>
        </div>
      )}
    </>
  );
}

function statusOf(e: Entry): { text: string; cls: string } {
  const s = e.save;
  if (s.state === "saving") return { text: "저장 중…", cls: "text-blue-600" };
  if (s.state === "saved") {
    return {
      text: `${s.inserted ? "저장완료" : "기존 갱신"} (${s.items}건)`,
      cls: "font-semibold text-emerald-700",
    };
  }
  if (s.state === "dup") return { text: "이미 등록됨", cls: "text-amber-600" };
  if (s.state === "error") return { text: s.msg, cls: "text-red-600" };
  if (e.missing.length) return { text: `누락: ${e.missing.join("·")}`, cls: "text-red-600" };
  if (!e.parsed.reconciled) return { text: "검증실패 (개별 저장은 가능)", cls: "text-amber-600" };
  return { text: "저장 가능", cls: "text-gray-500" };
}

export function ReceiptEntryClient() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [batchSaving, setBatchSaving] = useState(false);
  const idRef = useRef(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const addTexts = useCallback((items: { name: string; text: string }[]) => {
    const add: Entry[] = items
      .filter((it) => it.text.trim())
      .map((it) => {
        const parsed = parseReceipt(it.text);
        return {
          id: `e${++idRef.current}`,
          name: it.name,
          text: it.text,
          parsed,
          missing: missingRequiredFields(parsed),
          save: { state: "idle" as const },
        };
      });
    if (!add.length) return;
    setEntries((prev) => [...prev, ...add]);
    setSelectedId((cur) => cur ?? add[0]!.id);
  }, []);

  const readFiles = useCallback(
    async (files: File[]) => {
      const txts = files.filter((f) => /\.txt$/i.test(f.name) || f.type === "text/plain");
      if (!txts.length) return;
      const read = await Promise.all(txts.map(async (f) => ({ name: f.name, text: await f.text() })));
      addTexts(read);
    },
    [addTexts],
  );

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      void readFiles(Array.from(e.dataTransfer.files));
    },
    [readFiles],
  );

  const patch = (id: string, save: SaveState) =>
    setEntries((es) => es.map((e) => (e.id === id ? { ...e, save } : e)));

  const saveOne = useCallback(async (entry: Entry) => {
    patch(entry.id, { state: "saving" });
    try {
      const res = await fetch("/api/receipt/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: entry.text }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        id?: string; items?: number; inserted?: boolean; message?: string;
      };
      if (res.status === 409) {
        patch(entry.id, { state: "dup", msg: data.message ?? "이미 등록됨" });
        return;
      }
      if (!res.ok) throw new Error(data.message ?? `저장 실패 (HTTP ${res.status})`);
      patch(entry.id, {
        state: "saved",
        id: data.id ?? "",
        items: data.items ?? 0,
        inserted: data.inserted ?? true,
      });
    } catch (err) {
      patch(entry.id, { state: "error", msg: err instanceof Error ? err.message : "저장 실패" });
    }
  }, []);

  // 전체 저장은 **필수항목 충족 + 검증통과 + 미저장**만 대상으로 한다.
  // 검증 실패분은 사람이 원문을 본 뒤 개별로 저장하게 한다 — 일괄로 밀면 틀린 데이터가 조용히 쌓인다.
  const saveAll = useCallback(async () => {
    const targets = entries.filter(
      (e) => e.missing.length === 0 && e.parsed.reconciled && e.save.state !== "saved",
    );
    if (!targets.length) return;
    setBatchSaving(true);
    for (const e of targets) await saveOne(e);
    setBatchSaving(false);
  }, [entries, saveOne]);

  const addManual = () => {
    if (!text.trim()) return;
    addTexts([{ name: `붙여넣기 ${idRef.current + 1}`, text }]);
    setText("");
  };

  const removeEntry = (id: string) => {
    setEntries((es) => es.filter((e) => e.id !== id));
    setSelectedId((cur) => (cur === id ? null : cur));
  };

  const selected = entries.find((e) => e.id === selectedId) ?? null;
  const savable = entries.filter(
    (e) => e.missing.length === 0 && e.parsed.reconciled && e.save.state !== "saved",
  ).length;
  const savedCnt = entries.filter((e) => e.save.state === "saved").length;
  const blocked = entries.filter((e) => e.missing.length > 0).length;
  const failCnt = entries.filter((e) => !e.parsed.reconciled).length;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">영수증 입력</h1>
        <p className="mt-1 text-sm text-gray-600">
          코스트코 영수증 <b>.txt 파일을 끌어다 놓거나</b>(여러 개 가능) 텍스트를 붙여넣으면{" "}
          <b>결정론적으로 파싱</b>합니다. 영수증 자체 값으로 4중 검산하므로 OCR·AI 를 쓰지 않습니다.
        </p>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center text-sm transition-colors ${
          dragOver
            ? "border-blue-500 bg-blue-50 text-blue-700"
            : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
        }`}
      >
        여기로 <b>.txt 파일</b>을 끌어다 놓거나 <b>클릭해 선택</b>하세요 (여러 개 동시 가능)
        <input
          ref={fileRef}
          type="file"
          accept=".txt,text/plain"
          multiple
          className="hidden"
          onChange={(e) => { void readFiles(Array.from(e.target.files ?? [])); e.target.value = ""; }}
        />
      </div>

      <details className="rounded-lg border border-gray-200 bg-white p-3">
        <summary className="cursor-pointer text-sm text-gray-600">또는 텍스트 직접 붙여넣기</summary>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder="여기에 영수증 텍스트를 붙여넣으세요…"
          className="mt-2 w-full resize-y rounded border border-gray-300 p-2 font-mono text-xs"
        />
        <button
          type="button"
          onClick={addManual}
          disabled={!text.trim()}
          className="mt-2 rounded bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-40"
        >
          추가
        </button>
      </details>

      {entries.length > 0 && (
        <>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <span className="text-gray-600">
              총 <b>{entries.length}</b>건 · 저장가능 <b className="text-emerald-700">{savable}</b> ·
              검증실패 <b className="text-amber-600">{failCnt}</b> ·
              누락 <b className="text-red-600">{blocked}</b> ·
              저장완료 <b className="text-blue-700">{savedCnt}</b>
            </span>
            <button
              type="button"
              onClick={saveAll}
              disabled={batchSaving || savable === 0}
              className="rounded bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-40"
            >
              {batchSaving ? "저장 중…" : `전체 저장 (${savable})`}
            </button>
            <button
              type="button"
              onClick={() => { setEntries([]); setSelectedId(null); }}
              className="text-sm text-gray-400 hover:text-gray-700"
            >
              모두 지우기
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full text-xs">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-2 py-2">파일</th>
                  <th className="px-2 py-2">구분</th>
                  <th className="px-2 py-2">회원번호</th>
                  <th className="px-2 py-2 text-right">합계</th>
                  <th className="px-2 py-2">검증</th>
                  <th className="px-2 py-2">상태</th>
                  <th className="px-2 py-2" />
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => {
                  const st = statusOf(e);
                  return (
                    <tr
                      key={e.id}
                      onClick={() => setSelectedId(e.id)}
                      className={`cursor-pointer border-t border-gray-100 ${
                        selectedId === e.id ? "bg-blue-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="max-w-[14rem] truncate px-2 py-1.5" title={e.name}>{e.name}</td>
                      <td className="px-2 py-1.5">
                        {e.parsed.kind === "refund" ? <span className="text-amber-700">환불</span> : "구매"}
                      </td>
                      <td className="tabular px-2 py-1.5">
                        {e.parsed.member_no ?? <span className="text-red-500">없음</span>}
                      </td>
                      <td className="tabular px-2 py-1.5 text-right">{won(e.parsed.summary.total)}</td>
                      <td className="px-2 py-1.5">
                        {e.parsed.reconciled ? <span className="text-green-600">✓</span> : <span className="text-red-600">✗</span>}
                      </td>
                      <td className={`px-2 py-1.5 ${st.cls}`}>{st.text}</td>
                      <td className="whitespace-nowrap px-2 py-1.5 text-right">
                        <button
                          type="button"
                          onClick={(ev) => { ev.stopPropagation(); void saveOne(e); }}
                          disabled={e.missing.length > 0 || e.save.state === "saving" || e.save.state === "saved"}
                          className="rounded border border-emerald-300 px-2 py-0.5 text-[11px] font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-30"
                          title={e.missing.length ? `누락: ${e.missing.join(", ")}` : "이 영수증 저장"}
                        >
                          저장
                        </button>
                        <button
                          type="button"
                          onClick={(ev) => { ev.stopPropagation(); removeEntry(e.id); }}
                          className="ml-1 rounded border border-gray-200 px-2 py-0.5 text-[11px] text-gray-400 hover:bg-gray-100"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {selected && (
            <div>
              <div className="mb-2 text-sm font-semibold text-gray-800">{selected.name}</div>
              <ReceiptDetail p={selected.parsed} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
