// 회원번호·카드번호의 별명.
//
// 영수증에는 `2000xxxxxxxx` 와 `1234-****-****-5678` 만 남는다. 차액환불을 받으러 갈 때
// **어느 회원카드와 어느 결제카드를 들고 가야 하는지**를 번호만 보고는 알 수 없다.
//
// 설계 두 가지:
//   ① 저장은 `receipt_alias` 한 테이블(`kind` 로 회원/카드 구분) — `sql/015_alias.sql` 참고.
//   ② 화면에서 쓰는 모양은 **Map 두 개**다. 표의 모든 행마다 쿼리를 치면 N+1 이 되므로
//      화면당 한 번 읽어 통째로 들고 다닌다.
import { isUuid, tquery } from "./db";

export type AliasKind = "MEMBER" | "CARD";

export interface AliasRow {
  key: string;
  alias: string;
  /** 이 번호가 찍힌 영수증 수. 쓰지 않는 번호와 주력 번호를 구별하려고 같이 센다. */
  receipts: number;
  lastAt: string | null;
}

export interface AliasMaps {
  member: Map<string, string>;
  card: Map<string, string>;
}

/** 빈 Map 두 개. 별명 기능을 쓰지 않는 화면이 조건문 없이 같은 코드를 쓰게 한다. */
export const NO_ALIAS: AliasMaps = { member: new Map(), card: new Map() };

/** 화면 한 번에 한 번만 부른다. 표의 행마다 부르면 N+1 이 된다. */
export async function loadAliases(tenantId: string): Promise<AliasMaps> {
  const rows = await tquery<{ kind: AliasKind; key: string; alias: string }>(
    tenantId,
    `select kind, key, alias from receipt_alias where tenant_id = $1`,
  );
  const m: AliasMaps = { member: new Map(), card: new Map() };
  for (const r of rows) (r.kind === "CARD" ? m.card : m.member).set(r.key, r.alias);
  return m;
}

/**
 * 표시용 문자열. **번호를 숨기지 않는다** — 카운터에서 실제로 대조하는 값이기 때문이다.
 *
 *   별명 있음:  "큰형 카드 (1234-****-****-5678)"
 *   별명 없음:  "1234-****-****-5678"
 */
export function aliasLabel(map: Map<string, string>, key: string | null | undefined): string {
  if (!key) return "—";
  const a = map.get(key);
  return a ? `${a} (${key})` : key;
}

/**
 * 설정 화면용 목록 — **영수증에 실제로 찍힌 번호**를 기준으로 왼쪽 조인한다.
 *
 * 별명 테이블만 읽으면 "아직 이름을 안 붙인 번호"가 보이지 않아 무엇을 입력해야 할지 알 수
 * 없다. 반대로 영수증만 읽으면 영수증이 지워진 번호의 별명이 사라져 보인다. 그래서 둘을
 * `full join` 한다.
 */
export async function listAliases(tenantId: string, kind: AliasKind): Promise<AliasRow[]> {
  const col = kind === "CARD" ? "card_number_masked" : "member_no";
  return tquery<AliasRow>(
    tenantId,
    `with used as (
       select ${col} as key, count(*)::int as receipts,
              to_char(max(purchased_at), 'YYYY-MM-DD') as last_at
         from receipt
        where tenant_id = $1 and ${col} is not null and ${col} <> ''
        group by ${col}
     ),
     named as (
       select key, alias from receipt_alias where tenant_id = $1 and kind = $2
     )
     select coalesce(u.key, n.key) as key,
            coalesce(n.alias, '') as alias,
            coalesce(u.receipts, 0) as receipts,
            u.last_at as "lastAt"
       from used u
       full join named n on n.key = u.key
      order by coalesce(u.receipts, 0) desc, coalesce(u.key, n.key)`,
    [kind],
  );
}

/** 별명 저장. 빈 문자열이면 **지운다** — 별도 삭제 버튼을 두지 않아도 되게. */
export async function saveAlias(
  tenantId: string,
  kind: AliasKind,
  key: string,
  alias: string,
): Promise<void> {
  const k = key.trim();
  if (!k) return;
  const a = alias.trim().slice(0, 60);   // 표에 들어갈 길이. 긴 메모는 이 기능의 목적이 아니다.

  if (!a) {
    await tquery(
      tenantId,
      `delete from receipt_alias where tenant_id = $1 and kind = $2 and key = $3`,
      [kind, k],
    );
    return;
  }
  await tquery(
    tenantId,
    `insert into receipt_alias (tenant_id, kind, key, alias)
     values ($1, $2, $3, $4)
     on conflict (tenant_id, kind, key)
       do update set alias = excluded.alias, updated_at = now()`,
    [kind, k, a],
  );
}

/** 폼에서 온 `kind` 를 믿지 않는다. 둘 중 하나가 아니면 거부한다. */
export function parseKind(v: unknown): AliasKind {
  if (v === "MEMBER" || v === "CARD") return v;
  throw new Error("별명 종류가 올바르지 않습니다.");
}

/** 테넌트 id 검사를 여기 둬서 호출부가 잊지 못하게 한다. */
export const assertTenant = (id: string) => {
  if (!isUuid(id)) throw new Error("테넌트가 올바르지 않습니다.");
};
