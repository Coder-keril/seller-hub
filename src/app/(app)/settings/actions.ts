"use server";

import { revalidatePath } from "next/cache";
import { parseKind, saveAlias } from "@/lib/alias";
import {
  deleteAccount, parseChannel, saveAccount, setAccountStatus, type AccountRow,
} from "@/lib/channel-account";
import { currentTenant } from "@/lib/session";

/**
 * 설정 화면의 서버 액션. 전부 **자바스크립트 없이 POST 로 동작**한다.
 *
 * ⚠️ 테넌트는 항상 `currentTenant()` 에서 온다 — 폼에서 받지 않는다. 폼에서 받으면
 *    테넌트 id 를 바꿔 보내 남의 설정을 고칠 수 있다.
 */
export async function saveAliasAction(form: FormData): Promise<void> {
  const t = await currentTenant();
  await saveAlias(
    t.id,
    parseKind(form.get("kind")),
    String(form.get("key") ?? ""),
    String(form.get("alias") ?? ""),
  );
  revalidatePath("/settings");
}

export async function saveAccountAction(form: FormData): Promise<void> {
  const t = await currentTenant();
  const channel = parseChannel(form.get("channel"));

  // `cred.<항목명>` 으로 온 칸만 모은다. 빈 칸은 saveAccount 가 "안 바꿈"으로 다룬다.
  const creds: Record<string, string> = {};
  for (const [k, v] of form.entries()) {
    if (k.startsWith("cred.") && typeof v === "string") creds[k.slice(5)] = v;
  }

  await saveAccount(t.id, {
    id: String(form.get("id") ?? "") || undefined,
    channel,
    alias: String(form.get("alias") ?? ""),
    creds,
  });
  revalidatePath("/settings");
}

export async function deleteAccountAction(form: FormData): Promise<void> {
  const t = await currentTenant();
  await deleteAccount(t.id, String(form.get("id") ?? ""));
  revalidatePath("/settings");
}

export async function toggleAccountAction(form: FormData): Promise<void> {
  const t = await currentTenant();
  const next = form.get("next");
  const ok: AccountRow["status"][] = ["ACTIVE", "DISABLED"];
  if (!ok.includes(next as AccountRow["status"])) return;
  await setAccountStatus(t.id, String(form.get("id") ?? ""), next as AccountRow["status"]);
  revalidatePath("/settings");
}
