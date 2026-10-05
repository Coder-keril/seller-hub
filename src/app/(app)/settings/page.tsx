import Link from "next/link";
import { listAliases, type AliasKind, type AliasRow } from "@/lib/alias";
import {
  CHANNELS, CHANNEL_LABEL, CONFIRMED_FIELDS, CRED_FIELDS, listAccounts, type Channel,
} from "@/lib/channel-account";
import { currentTenant } from "@/lib/session";
import {
  deleteAccountAction, saveAccountAction, saveAliasAction, toggleAccountAction,
} from "./actions";

export const metadata = { title: "설정" };

/** DB 를 읽는다 — 빌드 시점에 굳으면 남의 설정이 정적 파일로 노출된다. */
export const dynamic = "force-dynamic";

/**
 * 설정 — 별명(회원번호·카드번호)과 오픈마켓 API 키.
 *
 * 세 영역을 **한 화면**에 둔다. 각각이 표 하나와 입력 한 줄이라 화면을 나누면 이동만 늘어난다.
 * `?tab=` 으로 접었다 펼친다(상태가 URL 에 있어 클라이언트 JS 가 없다).
 *
 * ⚠️ **API 키 값은 화면으로 내려오지 않는다.** 봉인된 채 DB 에 있고, 여기서는 어떤 항목이
 *    채워졌는지만 보여준다. 수정할 때 빈 칸은 "안 바꿈" 이다.
 */
const TABS = [
  { v: "member", label: "회원번호 별명" },
  { v: "card", label: "카드번호 별명" },
  { v: "api", label: "오픈마켓 API 키" },
] as const;

type Tab = (typeof TABS)[number]["v"];

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const one = (k: string) => (Array.isArray(sp[k]) ? sp[k]![0] : sp[k]) as string | undefined;
  const raw = one("tab");
  const tab: Tab = TABS.some((t) => t.v === raw) ? (raw as Tab) : "member";
  const addChannel = (one("channel") ?? "NAVER") as Channel;
  const editId = one("edit") ?? "";

  const tenant = await currentTenant();

  // 보고 있는 영역만 읽는다. 세 쿼리를 늘 치면 설정 한 번 열 때마다 영수증 전체를 두 번 훑는다.
  const aliasKind: AliasKind | null = tab === "member" ? "MEMBER" : tab === "card" ? "CARD" : null;
  const [aliases, accounts] = await Promise.all([
    aliasKind ? listAliases(tenant.id, aliasKind) : Promise.resolve<AliasRow[]>([]),
    tab === "api" ? listAccounts(tenant.id) : Promise.resolve([]),
  ]);

  const editing = accounts.find((a) => a.id === editId) ?? null;
  const formChannel: Channel = editing?.channel ?? (CHANNELS.includes(addChannel) ? addChannel : "NAVER");

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">설정</h1>
        <p className="mt-1 text-sm text-gray-600">
          영수증에 찍힌 번호에 이름을 붙이고, 오픈마켓 API 키를 등록합니다.
        </p>
      </div>

      <div className="inline-flex overflow-hidden rounded-lg border border-gray-300">
        {TABS.map((t) => (
          <Link
            key={t.v}
            href={`/settings?tab=${t.v}`}
            className={`px-3 py-1.5 text-sm ${
              tab === t.v ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {/* ── 별명 ─────────────────────────────────── */}
      {aliasKind && (
        <section className="space-y-2">
          <p className="text-sm text-gray-600">
            {aliasKind === "MEMBER"
              ? "코스트코 회원번호에 이름을 붙입니다. 차액환불을 받으러 갈 때 어느 회원카드를 들고 가야 하는지 번호만 보고는 알 수 없습니다."
              : "결제에 쓴 카드번호에 이름을 붙입니다. 카운터에서 그때 결제한 카드를 제시해야 하므로 어느 카드인지 알아야 합니다."}
          </p>

          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs text-gray-500">
                <tr>
                  <th className="px-3 py-2">{aliasKind === "MEMBER" ? "회원번호" : "카드번호"}</th>
                  <th className="px-3 py-2">별명</th>
                  <th className="px-3 py-2 text-right">영수증</th>
                  <th className="px-3 py-2">최근</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody>
                {aliases.map((a) => (
                  <tr key={a.key} className="border-t border-gray-100">
                    <td className="tabular px-3 py-2">{a.key}</td>
                    {/* 행마다 작은 폼. 저장은 그 줄만 바꾼다 — 한 번에 전부 저장하는 폼이면
                        한 칸 고치려고 전체를 다시 보내야 하고, 충돌도 전부에 걸린다. */}
                    <td className="px-3 py-2" colSpan={1}>
                      <form action={saveAliasAction} className="flex items-center gap-2">
                        <input type="hidden" name="kind" value={aliasKind} />
                        <input type="hidden" name="key" value={a.key} />
                        <input
                          name="alias"
                          defaultValue={a.alias}
                          maxLength={60}
                          placeholder="예: 큰형 카드 · 본인 명의"
                          className="w-56 rounded border border-gray-300 px-2 py-1 text-sm"
                        />
                        <button
                          type="submit"
                          className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
                        >
                          저장
                        </button>
                      </form>
                    </td>
                    <td className="tabular px-3 py-2 text-right text-gray-600">{a.receipts}</td>
                    <td className="tabular px-3 py-2 text-gray-500">{a.lastAt ?? "—"}</td>
                    <td className="px-3 py-2 text-xs text-gray-400">
                      {a.receipts === 0 ? "영수증 없음" : ""}
                    </td>
                  </tr>
                ))}
                {aliases.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-3 py-10 text-center text-gray-400">
                      영수증이 없어 붙일 번호가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400">
            별명을 비우고 저장하면 지워집니다. 영수증을 지워도 별명은 남습니다.
          </p>
        </section>
      )}

      {/* ── API 키 ───────────────────────────────── */}
      {tab === "api" && (
        <section className="space-y-3">
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs text-gray-500">
                <tr>
                  <th className="px-3 py-2">마켓</th>
                  <th className="px-3 py-2">계정 별칭</th>
                  <th className="px-3 py-2">등록된 항목</th>
                  <th className="px-3 py-2">상태</th>
                  <th className="px-3 py-2">등록일</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody>
                {accounts.map((a) => (
                  <tr key={a.id} className="border-t border-gray-100">
                    <td className="px-3 py-2">{CHANNEL_LABEL[a.channel]}</td>
                    <td className="px-3 py-2">{a.alias}</td>
                    <td className="px-3 py-2 text-xs text-gray-500">
                      {a.filled.length ? a.filled.join(" · ") : "없음"}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold text-white ${
                          a.status === "ACTIVE"
                            ? "bg-green-600"
                            : a.status === "ERROR"
                              ? "bg-red-600"
                              : "bg-gray-400"
                        }`}
                        title={a.lastError ?? ""}
                      >
                        {a.status === "ACTIVE" ? "사용" : a.status === "ERROR" ? "오류" : "중지"}
                      </span>
                    </td>
                    <td className="tabular px-3 py-2 text-gray-500">{a.createdAt}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/settings?tab=api&edit=${a.id}`}
                          className="rounded border border-gray-300 px-2 py-0.5 text-xs text-gray-700 hover:bg-gray-50"
                        >
                          수정
                        </Link>
                        <form action={toggleAccountAction}>
                          <input type="hidden" name="id" value={a.id} />
                          <input
                            type="hidden"
                            name="next"
                            value={a.status === "ACTIVE" ? "DISABLED" : "ACTIVE"}
                          />
                          <button
                            type="submit"
                            className="rounded border border-gray-300 px-2 py-0.5 text-xs text-gray-700 hover:bg-gray-50"
                          >
                            {a.status === "ACTIVE" ? "중지" : "사용"}
                          </button>
                        </form>
                        {/* 삭제는 confirm 대화창을 쓰지 않는다 — 브라우저 모달은 이 앱의
                            무-JS 원칙과 어긋나고, 지워도 마켓 쪽 키는 남아 재등록이 가능하다. */}
                        <form action={deleteAccountAction}>
                          <input type="hidden" name="id" value={a.id} />
                          <button
                            type="submit"
                            className="rounded border border-red-200 px-2 py-0.5 text-xs text-red-600 hover:bg-red-50"
                          >
                            삭제
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
                {accounts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-3 py-8 text-center text-gray-400">
                      등록된 마켓 계정이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ── 추가·수정 폼 ─────────────────────── */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="mb-3 flex items-center gap-2">
              <h2 className="text-sm font-semibold text-gray-900">
                {editing ? `${CHANNEL_LABEL[editing.channel]} · ${editing.alias} 수정` : "마켓 계정 추가"}
              </h2>
              {editing && (
                <Link href="/settings?tab=api" className="text-xs text-gray-400 hover:text-gray-700">
                  취소
                </Link>
              )}
            </div>

            {/* 마켓을 바꾸면 입력 항목이 달라진다. onChange 제출은 JS 가 필요하므로
                주소(`?channel=`)로 바꾼다 — 추가할 때만 쓴다. */}
            {!editing && (
              <div className="mb-3 flex flex-wrap gap-1">
                {CHANNELS.map((c) => (
                  <Link
                    key={c}
                    href={`/settings?tab=api&channel=${c}`}
                    className={`rounded border px-2 py-1 text-xs ${
                      formChannel === c
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {CHANNEL_LABEL[c]}
                  </Link>
                ))}
              </div>
            )}

            {!CONFIRMED_FIELDS.has(formChannel) && (
              <p className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                이 마켓의 항목 이름은 <b>연동할 때 확정</b>합니다. 지금 입력한 값은 그대로
                보관되지만, 실제 연동 시 항목명이 바뀔 수 있습니다. (네이버만 확정)
              </p>
            )}

            <form action={saveAccountAction} className="flex flex-wrap items-end gap-3">
              {editing && <input type="hidden" name="id" value={editing.id} />}
              <input type="hidden" name="channel" value={formChannel} />

              <label className="block">
                <span className="mb-1 block text-xs text-gray-500">계정 별칭</span>
                <input
                  name="alias"
                  defaultValue={editing?.alias ?? ""}
                  required
                  maxLength={60}
                  placeholder="예: 메리코코 본점"
                  className="w-44 rounded border border-gray-300 px-2 py-1.5 text-sm"
                />
              </label>

              {CRED_FIELDS[formChannel].map((f) => (
                <label key={f.name} className="block">
                  <span className="mb-1 block text-xs text-gray-500">
                    {f.label}
                    {f.secret && <span className="ml-1 text-gray-400">(비밀)</span>}
                  </span>
                  <input
                    name={`cred.${f.name}`}
                    type={f.secret ? "password" : "text"}
                    autoComplete="off"
                    placeholder={
                      editing && editing.filled.includes(f.name) ? "등록됨 — 비우면 유지" : (f.hint ?? "")
                    }
                    className="w-52 rounded border border-gray-300 px-2 py-1.5 text-sm"
                  />
                </label>
              ))}

              <button
                type="submit"
                className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
              >
                {editing ? "수정 저장" : "추가"}
              </button>
            </form>
          </div>
        </section>
      )}
    </div>
  );
}
