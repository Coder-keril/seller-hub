// 차액환불 후보 화면(`/price-adjustment`)의 판매자별 기본 임계값.
//
// 화면은 쿼리스트링으로 건별 덮어쓰기를 받고, 여기 저장한 값이 **기본값**이 된다.
// 행이 없으면 아래 코드 기본값을 쓴다 — 테넌트마다 미리 행을 만들지 않는다.
import { tquery } from "../db";

/**
 * 최소 차액 기본값. 실데이터 109건 분포(2026-10-05)에서 고른 값이다 —
 * 5,000원에서 끊으면 건수가 109 → 47 로 절반 이하가 되는데 **금액은 88% 가 남는다**.
 * 1만원으로 올리면 금액 21% 를 버리고, 0원이면 몇천 원짜리가 목록을 덮는다.
 */
export const DEFAULT_MIN_DIFF = 5000;

/** 기간 기본값은 **없음**이다. 코스트코 100% 만족 보장에 기간 제한이 없다. */
export const DEFAULT_WINDOW_DAYS: number | null = null;

export interface AdjustSetting {
  minDiffTotal: number;
  windowDays: number | null;
  /** false = 아직 저장한 적이 없어 코드 기본값을 쓰는 중이다. */
  saved: boolean;
  updatedAt: string | null;
}

export async function loadAdjustSetting(tenantId: string): Promise<AdjustSetting> {
  const [row] = await tquery<{ min_diff_total: string; window_days: number | null; updated_at: string }>(
    tenantId,
    `select min_diff_total::text, window_days,
            to_char(updated_at, 'YYYY-MM-DD HH24:MI') as updated_at
       from price_adjust_setting where tenant_id = $1`,
  );
  if (!row) {
    return {
      minDiffTotal: DEFAULT_MIN_DIFF,
      windowDays: DEFAULT_WINDOW_DAYS,
      saved: false,
      updatedAt: null,
    };
  }
  return {
    minDiffTotal: Number(row.min_diff_total),
    windowDays: row.window_days,
    saved: true,
    updatedAt: row.updated_at,
  };
}

export async function saveAdjustSetting(
  tenantId: string,
  v: { minDiffTotal: number; windowDays: number | null },
): Promise<void> {
  // DB 의 CHECK 와 같은 범위로 미리 자른다 — 화면이 보낸 값을 그대로 믿지 않는다.
  const min = Math.max(0, Math.round(Number.isFinite(v.minDiffTotal) ? v.minDiffTotal : 0));
  const days =
    v.windowDays == null || !Number.isFinite(v.windowDays)
      ? null
      : Math.min(Math.max(Math.trunc(v.windowDays), 1), 3650);

  await tquery(
    tenantId,
    `insert into price_adjust_setting (tenant_id, min_diff_total, window_days)
     values ($1, $2, $3)
     on conflict (tenant_id)
       do update set min_diff_total = excluded.min_diff_total,
                     window_days = excluded.window_days,
                     updated_at = now()`,
    [min, days],
  );
}
