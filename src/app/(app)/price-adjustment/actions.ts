"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { saveAdjustSetting } from "@/lib/receipt/adjust-setting";
import { recordClaim, removeClaim } from "@/lib/receipt/adjust-claim";
import { currentTenant } from "@/lib/session";

/**
 * 화면의 임계값을 **판매자 기본값으로** 저장한다.
 *
 * 평범한 `<form action={...}>` 으로 쓴다 — 서버 액션은 자바스크립트 없이도 POST 로 동작하므로
 * 이 화면의 "클라이언트 JS 없음" 원칙이 유지된다.
 * 저장 후 쿼리스트링 없는 주소로 보낸다. 덮어쓰기가 남아 있으면 방금 저장한 기본값이 안 보인다.
 */
export async function saveDefaults(formData: FormData) {
  const tenant = await currentTenant();
  const minRaw = String(formData.get("min") ?? "").trim();
  const daysRaw = String(formData.get("days") ?? "").trim();

  await saveAdjustSetting(tenant.id, {
    minDiffTotal: minRaw === "" ? 0 : Number(minRaw),
    windowDays: daysRaw === "" ? null : Number(daysRaw),
  });

  redirect("/price-adjustment");
}

/**
 * 후보 한 줄을 **차액환불 처리했다고 기록**한다.
 *
 * 환불 영수증에서 추론하지 않는 이유는 `sql/013_price_adjust_claim.sql` 에 있다 —
 * 실데이터에서 단순 반품과 구분할 단서가 없었다.
 * 기록하면 후보 목록에서 빠지고 대시보드 집계에 들어간다.
 */
export async function claimAdjustment(formData: FormData) {
  const tenant = await currentTenant();
  const num = (k: string) => Number(String(formData.get(k) ?? "").trim());
  await recordClaim(tenant.id, {
    receiptId: String(formData.get("receiptId") ?? ""),
    productCode: String(formData.get("productCode") ?? ""),
    name: (String(formData.get("name") ?? "") || null),
    qty: num("qty"),
    paidUnit: num("paidUnit"),
    salePrice: num("salePrice"),
  });
  revalidatePath("/price-adjustment");
  revalidatePath("/price-adjustment/stats");
}

/** 잘못 누른 기록을 되돌린다. 되돌리면 후보 목록에 다시 나타난다. */
export async function unclaimAdjustment(formData: FormData) {
  const tenant = await currentTenant();
  await removeClaim(tenant.id, String(formData.get("claimId") ?? ""));
  revalidatePath("/price-adjustment");
  revalidatePath("/price-adjustment/stats");
}
