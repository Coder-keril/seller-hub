// DB 접근 단일 지점.
//
// 판매자 데이터는 전부 한 DB 에 같이 들어 있고 tenant_id 로만 나뉜다. 그래서 쿼리 하나에서
// tenant_id 조건을 빼먹으면 남의 주문이 보인다. 그 사고를 막는 게 이 파일의 목적이다.
//
// 규칙은 하나다. **테넌트 데이터는 tquery() 로만 읽고 쓴다.** $1 은 항상 tenantId 다.
//
//   const orders = await tquery<Order>(tenantId,
//     `select * from orders where tenant_id = $1 and status = $2`, ["NEW"]);
//
// ponytail: assertTenantScoped 는 증명이 아니라 가드다. SQL 문자열에 tenant_id 가 들어있는지만
// 본다. 정말로 강제하려면 Postgres RLS 를 켜고 앱을 비소유자 역할로 접속시켜야 한다 —
// 판매자가 여러 명 붙는 시점에 올린다.
import pg from "pg";

// 풀은 **globalThis** 에 매단다. Next 개발 서버의 HMR 이 모듈을 다시 평가하므로
// 모듈 지역 변수에 두면 저장할 때마다 새 풀이 생기고, Supabase Session pooler 의
// 커넥션이 몇 번 고치는 사이에 바닥난다(Free 플랜은 한계가 낮다).
const POOL_KEY = Symbol.for("sellerhub.pg.pool");
type PoolHolder = { [POOL_KEY]?: pg.Pool };

export function pool(): pg.Pool {
  const holder = globalThis as PoolHolder;
  const existing = holder[POOL_KEY];
  if (existing) return existing;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL 이 없습니다.");
  // Supabase Session pooler 를 거치므로 앱에서는 작게 잡는다.
  const created = new pg.Pool({ connectionString, max: 10, idleTimeoutMillis: 30_000 });
  holder[POOL_KEY] = created;
  return created;
}

/**
 * uuid 모양인지만 본다. **쿼리에 넣기 전에 거르는 용도다.**
 *
 * Postgres 는 uuid 컬럼에 엉뚱한 문자열이 오면 `invalid input syntax for type uuid` 로
 * 예외를 던진다. 그 값이 URL·폼에서 왔다면 "없는 것"으로 다뤄야 하는데, 예외가 나면
 * 화면 전체가 죽는다(실제로 `/receipts?open=x` 가 그렇게 깨졌다).
 */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (v: unknown): v is string => typeof v === "string" && UUID_RE.test(v);

/**
 * `YYYY-MM-DD` 이고 **실제로 존재하는 날짜**인지. `::date` 캐스트에 넣기 전에 거른다.
 *
 * 모양만 보면 `2026-13-45` 가 통과해 Postgres 가 터진다(`/receipt-dashboard?from=2026-13-45`
 * 가 500 이었다). 그래서 Date 로 되돌려 같은 문자열이 나오는지까지 확인한다.
 * 화면 입력에서 온 날짜는 틀렸으면 **필터 없음**으로 다루는 것이 맞다 — 화면을 죽일 일이 아니다.
 */
export function isDateOnly(v: unknown): v is string {
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(`${v}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
}

export function assertTenantScoped(sql: string): void {
  if (!/\btenant_id\b/.test(sql)) {
    throw new Error(`테넌트 쿼리에 tenant_id 조건이 없습니다:\n${sql.trim()}`);
  }
  if (!/\$1\b/.test(sql)) {
    throw new Error(`테넌트 쿼리의 $1 은 tenantId 여야 합니다:\n${sql.trim()}`);
  }
}

/** 판매자 데이터. $1 에 tenantId 가 자동으로 들어간다. */
export async function tquery<T extends pg.QueryResultRow>(
  tenantId: string,
  sql: string,
  params: unknown[] = [],
): Promise<T[]> {
  assertTenantScoped(sql);
  const r = await pool().query<T>(sql, [tenantId, ...params]);
  return r.rows;
}

/**
 * 플랫폼 운영자(메리코코) 조회. **위임받은 테넌트로만** 범위가 제한된다.
 *
 * 운영자는 여러 판매자의 주문을 한 화면에서 처리해야 하므로 tquery() 를 쓸 수 없다. 그렇다고
 * 전체를 열어주면 격리가 무너진다. 그래서 fulfillment_delegation 이 접근 경계 역할을 한다 —
 * 위임하지 않은 판매자의 데이터는 운영자도 볼 수 없다.
 *
 * SQL 에 `$1` 자리로 위임 테넌트 목록이 들어간다. 이렇게 쓴다.
 *
 *   await dquery<Order>(`select * from orders where tenant_id = any($1) and status = $2`, ['NEW']);
 */
export async function dquery<T extends pg.QueryResultRow>(
  sql: string,
  params: unknown[] = [],
): Promise<T[]> {
  if (!/\$1\b/.test(sql)) {
    throw new Error(`운영자 쿼리의 $1 은 위임 테넌트 목록이어야 합니다:\n${sql.trim()}`);
  }
  if (!/\btenant_id\b/.test(sql)) {
    throw new Error(`운영자 쿼리에 tenant_id 조건이 없습니다:\n${sql.trim()}`);
  }
  const d = await pool().query<{ tenant_id: string }>(
    `select tenant_id from fulfillment_delegation where mode = 'MERRYCOCO'`);
  const tenants = d.rows.map((r) => r.tenant_id);
  if (!tenants.length) return [];
  const r = await pool().query<T>(sql, [tenants, ...params]);
  return r.rows;
}

/** 마스터 데이터(master_product 등). 전 테넌트 공용이라 tenant_id 가 없다. */
export async function mquery<T extends pg.QueryResultRow>(
  sql: string,
  params: unknown[] = [],
): Promise<T[]> {
  const r = await pool().query<T>(sql, params);
  return r.rows;
}

/**
 * 테넌트 트랜잭션. 여러 문장을 한 묶음으로 써야 할 때 쓴다(영수증 헤더 + 상세 교체 등).
 *
 * `q` 는 tquery() 와 같다 — `$1` 에 tenantId 가 들어가고 tenant_id 조건을 검사한다.
 * `child` 는 **검사를 건너뛴다.** receipt_item 처럼 tenant_id 컬럼이 없고 부모 id 로만
 * 닿는 상세 테이블용이다(order_item 과 같은 구조). 부모 id 를 **이 트랜잭션 안에서
 * 테넌트 범위로 얻었을 때만** 쓴다 — 밖에서 받은 id 를 그대로 넣으면 격리가 뚫린다.
 */
export interface Tx {
  q: <T extends pg.QueryResultRow>(sql: string, params?: unknown[]) => Promise<T[]>;
  child: <T extends pg.QueryResultRow>(sql: string, params?: unknown[]) => Promise<T[]>;
}

export async function ttx<T>(tenantId: string, fn: (tx: Tx) => Promise<T>): Promise<T> {
  const client = await pool().connect();
  try {
    await client.query("begin");
    const tx: Tx = {
      q: async (sql, params = []) => {
        assertTenantScoped(sql);
        return (await client.query(sql, [tenantId, ...params])).rows;
      },
      child: async (sql, params = []) => (await client.query(sql, params)).rows,
    };
    const out = await fn(tx);
    await client.query("commit");
    return out;
  } catch (err) {
    await client.query("rollback").catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}
