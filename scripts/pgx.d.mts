// pgx.mjs 의 타입 선언. scripts/ 를 typecheck 대상에 넣기 위해 필요하다.
export declare const ROOT: string;
export declare function loadEnv(): string;
export declare const BATCH: number;
export declare function upsert<T extends object>(
  db: { query(sql: string, params?: unknown[]): Promise<unknown> },
  table: string,
  cols: string[],
  conflictCols: string[],
  rows: readonly T[],
): Promise<number>;
