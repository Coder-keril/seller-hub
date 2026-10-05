// merrycoco_web (MSSQL) → SellerHub Postgres 마스터 동기화
//
//   ⚠️ **이 스크립트는 분리 전 과도기다.** seller-hub 앱은 MSSQL 에 접속하지 않는 것이 원칙이고,
//      동기화는 **별도 sync 서비스**로 떼어낼 예정이다. 그때 이 파일은 이 저장소를 떠난다.
//      넘겨줄 때의 접점은 Supabase 쪽 테이블과 `sync_state`(커서) 다 — 그 계약만 지키면 된다.
//
//   이지오피스 GCP 그룹 밖에서는 merrycoco MSSQL 에 접속할 수 없다. 그래서 이 스크립트는
//   사내 개발머신 cron 에서만 돈다. Postgres 는 인터넷 너머(GCP VM)에 있으므로 TLS 필수.
//
//   딩컴딜 sync-d1 과 달리 전체 교체(DELETE+INSERT)를 하지 않는다. tenant_product 가
//   master_product 를 FK 로 참조하기 때문에, 지우면 판매자가 가져온 상품이 같이 날아간다.
//   → UpdateDate 기준 증분 upsert.
//
//   ponytail: 원천에서 물리 삭제된 행은 감지하지 못한다. merrycoco 는 temporal table
//   (valid_from/valid_to) 이라 실제로는 soft delete 이고, is_exposed=0 변경은 UpdateDate 가
//   바뀌므로 따라온다. 물리 삭제가 실제로 생기면 주 1회 전체 키 대조를 추가한다.
//
//   실행: node scripts/sync-master.mjs [--full]
//
import sql from "mssql";
import pg from "pg";
import { upsert, loadEnv } from "./pgx.mjs";
loadEnv();

const FULL = process.argv.includes("--full");
const EPOCH = "1970-01-01T00:00:00Z";

const mssql = await sql.connect({
  server: process.env.MSSQL_HOST,
  port: Number(process.env.MSSQL_PORT ?? 1433),
  database: process.env.MSSQL_DB ?? "merrycoco_web",
  user: process.env.MSSQL_USER,
  password: process.env.MSSQL_PASSWORD,
  options: { encrypt: false, trustServerCertificate: true },
  requestTimeout: 120_000,
});

const db = new pg.Client({ connectionString: process.env.DATABASE_URL });
await db.connect();

const getCursor = async (source) => {
  if (FULL) return EPOCH;
  const r = await db.query("select cursor from sync_state where source = $1", [source]);
  return r.rows[0]?.cursor?.toISOString() ?? EPOCH;
};

const setCursor = (source, cursor, rows) =>
  db.query(
    `insert into sync_state (source, cursor, rows_synced, synced_at) values ($1,$2,$3,now())
     on conflict (source) do update set cursor = $2, rows_synced = $3, synced_at = now()`,
    [source, cursor, rows]
  );

const query = async (q, cursor) =>
  (await mssql.request().input("cursor", sql.DateTime2, new Date(cursor)).query(q)).recordset;

const id = (r) => `${r.retailer}:${r.product_code}`;
let total = 0;

// ── 1. 상품 ────────────────────────────────────────────────────
// name / category 는 검수된 override 를 우선한다 (딩컴딜과 같은 규칙).
// 바코드는 TB_shop_sku 경유라 약 26% 만 채워진다 — 없는 게 정상이다.
{
  const src = "TB_retail_products";
  const cursor = await getCursor(src);
  const rows = await query(
    `SELECT p.retailer, p.product_code,
            COALESCE(p.name_override, p.name) name,
            COALESCE(p.category_override, p.category) category,
            p.description, p.unit_qty, p.unit_type, p.pack_count, p.total_qty,
            p.is_exposed, p.UpdateDate,
            sk.barcode
       FROM dbo.TB_retail_products p
       OUTER APPLY (
         SELECT TOP 1 s.barcode
           FROM dbo.TB_shop_sku_retail_link l
           JOIN dbo.TB_shop_sku s ON s.sku_id = l.sku_id
          WHERE l.retailer = p.retailer AND l.product_code = p.product_code
            AND s.barcode IS NOT NULL
          ORDER BY l.is_primary DESC
       ) sk
      WHERE p.UpdateDate > @cursor
      ORDER BY p.UpdateDate`,
    cursor
  );
  // 이름 없는 행은 마켓에 올릴 수 없다. 넘긴다.
  const usable = rows.filter((r) => r.name);
  const mapped = usable.map((r) => ({
    id: id(r),
    retailer: r.retailer,
    product_code: r.product_code,
    name: r.name,
    category: r.category,
    description: r.description,
    barcode: r.barcode,
    unit_qty: r.unit_qty,
    unit_type: r.unit_type,
    pack_count: r.pack_count,
    total_qty: r.total_qty,
    is_exposed: r.is_exposed,
    source_updated_at: r.UpdateDate,
    synced_at: new Date(),
  }));
  const n = await upsert(db, "master_product",
    ["id","retailer","product_code","name","category","description","barcode",
     "unit_qty","unit_type","pack_count","total_qty","is_exposed","source_updated_at","synced_at"],
    ["id"],
    mapped
  );
  if (rows.length) await setCursor(src, rows.at(-1).UpdateDate, n);
  console.log(`상품 ${n}건 upsert (이름없음 ${rows.length - usable.length}건 제외)`);
  total += n;
}

// ── 2. 정상가 ──────────────────────────────────────────────────
// 채널별로 여러 건이다 (매장가/온라인가). 어느 채널을 정상가로 쓸지는 price_policy.base_channel.
{
  const src = "TB_retail_price";
  const cursor = await getCursor(src);
  const rows = await query(
    `SELECT retailer, product_code, channel, original_price, UpdateDate
       FROM dbo.TB_retail_price
      WHERE UpdateDate > @cursor AND original_price IS NOT NULL
      ORDER BY UpdateDate`,
    cursor
  );
  // 상품이 아직 안 들어온 가격은 FK 에 걸린다. 다음 회차에 따라온다.
  const known = await knownIds(rows);
  const mapped = rows
    .filter((r) => known.has(id(r)))
    .map((r) => ({
      master_id: id(r),
      price_channel: r.channel,
      original_price: r.original_price,
      synced_at: new Date(),
    }));
  const n = await upsert(db, "master_price",
    ["master_id","price_channel","original_price","synced_at"],
    ["master_id","price_channel"], mapped);
  if (rows.length) await setCursor(src, rows.at(-1).UpdateDate, n);
  console.log(`가격 ${n}건 upsert (상품 미존재 ${rows.length - mapped.length}건 보류)`);
  total += n;
}

// ── 2-b. 행사가(세일) ──────────────────────────────────────────
// 가격 조정 판단에 쓴다 — "내가 산 단가 > 지금 행사가" 를 가리려면 오늘 유효한 행사가가
// 필요하다. 원천은 TB_retail_price_history 다.
// (한국은 환불 정책을 활용하는 방식이라 기간 기준은 품목별 환불 가능 기간이다. 코드에 박지 않는다.)
//
// ⚠️ 정본 로직은 merrycoco 의 `FN_retail_price_now` 다. **거기 박힌 가드를 그대로 옮긴다** —
//    전부 실제 사고에서 나온 것이라 하나라도 빠지면 같은 사고가 재현된다:
//      ① current_price = 0 제외 — 수집이 절대가를 못 읽어 0 을 넣은 행사 행이 있다.
//         그 행이 뽑히면 0 원으로 노출되고 주문 금액이 0 으로 굳는다(실발생: 79,984원이 공짜로 합산).
//         빼면 "행사 없음"으로 떨어져 정가가 보인다 — 0 원보다 안전하다.
//      ② ended_early_date IS NOT NULL 제외 — 기간이 남았는데 할인을 내린 경우.
//      ③ 오늘이 sale_start_date ~ sale_end_date 안에 드는 행만.
//      ④ 같은 상품에 행사 행이 여러 건이면 sale_start_date DESC, seq DESC 로 하나만.
//      ⑤ 단가 상품(TB_retail_unit_price 에 행이 있는 것) 제외 — 정상가·할인판매가 구조가
//         아니고 그 금액에 단가와 박스값이 섞여 있다.
//
// 증분이 아니라 **매번 전체를 다시 계산한다.** 행사는 날짜가 지나면 저절로 끝나야 하는데
// 증분으로는 "오늘부터 행사 아님"을 감지할 수 없다(원천 행이 바뀌지 않는다).
{
  const rows = await mssql.request().query(
    `SELECT pr.retailer, pr.product_code, pr.channel,
            h.current_price, h.discount_price, h.sale_start_date, h.sale_end_date
       FROM dbo.TB_retail_price pr
       OUTER APPLY (
         SELECT TOP 1 hh.current_price, hh.discount_price, hh.sale_start_date, hh.sale_end_date
           FROM dbo.TB_retail_price_history hh
          WHERE hh.retailer = pr.retailer
            AND hh.product_code = pr.product_code
            AND hh.channel = pr.channel
            AND CAST(GETDATE() AS DATE) BETWEEN hh.sale_start_date AND hh.sale_end_date  -- ③
            AND hh.ended_early_date IS NULL                                              -- ②
            AND (hh.current_price IS NULL OR hh.current_price > 0)                        -- ①
          ORDER BY hh.sale_start_date DESC, hh.seq DESC                                   -- ④
       ) h
      WHERE pr.original_price > 0
        AND h.current_price IS NOT NULL
        AND NOT EXISTS (                                                                  -- ⑤
          SELECT 1 FROM dbo.TB_retail_unit_price u
           WHERE u.retailer = pr.retailer AND u.product_code = pr.product_code
        )`
  );
  const known = await knownIds(rows.recordset);
  const mapped = rows.recordset
    .filter((r) => known.has(id(r)))
    .map((r) => ({
      master_id: id(r),
      price_channel: r.channel,
      sale_price: r.current_price,
      discount_amount: r.discount_price,
      sale_start_date: r.sale_start_date,
      sale_end_date: r.sale_end_date,
    }));

  // 끝난 행사를 먼저 비운다 — 안 비우면 지난 행사가 영원히 "할인 중"으로 남는다.
  const cleared = await db.query(
    `update master_price set sale_price = null, discount_amount = null,
            sale_start_date = null, sale_end_date = null, sale_synced_at = now()
      where sale_price is not null
        and (sale_end_date is null or sale_end_date < current_date)`
  );

  // ⚠️ **upsert 가 아니라 UPDATE 전용이다.** 행사가는 기존 정상가 행에 붙는 값이고, 행이 없는
  //    상품에 INSERT 하려 하면 `original_price` (not null) 가 비어 터진다. 정상가 행은 위 2번
  //    블록이 만든다 — 아직 없는 상품의 행사는 다음 회차에 따라온다(이미지·가격과 같은 방식).
  const SALE_COLS = ["master_id","price_channel","sale_price","discount_amount","sale_start_date","sale_end_date"];
  let n = 0;
  for (let i = 0; i < mapped.length; i += 500) {
    const chunk = mapped.slice(i, i + 500);
    const values = chunk
      .map((_, r) => `($${r * 6 + 1},$${r * 6 + 2},$${r * 6 + 3}::numeric,$${r * 6 + 4}::numeric,$${r * 6 + 5}::date,$${r * 6 + 6}::date)`)
      .join(",");
    const res = await db.query(
      `update master_price mp
          set sale_price = v.sale_price, discount_amount = v.discount_amount,
              sale_start_date = v.sale_start_date, sale_end_date = v.sale_end_date,
              sale_synced_at = now()
         from (values ${values}) as v(master_id, price_channel, sale_price, discount_amount, sale_start_date, sale_end_date)
        where mp.master_id = v.master_id and mp.price_channel = v.price_channel`,
      chunk.flatMap((row) => SALE_COLS.map((c) => row[c]))
    );
    n += res.rowCount;
  }
  await setCursor("TB_retail_price_history", new Date(), n);
  console.log(`행사가 ${n}건 반영 · 종료분 ${cleared.rowCount}건 해제 `
    + `(행사 ${rows.recordset.length}건 중 가격행 없음 ${mapped.length - n}건 · 상품 미존재 ${rows.recordset.length - mapped.length}건 보류)`);
  total += n;
}

// ── 3. 이미지 ──────────────────────────────────────────────────
// 원천에 URL 이 없고 filename 만 있다. 실제 URL 은 앱에서 MASTER_IMAGE_BASE_URL + filename.
// is_public=1 만 가져온다 — 비공개 이미지를 마켓에 올리면 안 된다.
// 주의: 여기서 받는 filename 은 메리코코 R2 의 original 키를 가리킨다. 마켓에 나가는 건
// 배경제거 후 SellerHub 버킷에 올라간 public_url 이다 (워터마크본이 아니다).
{
  const src = "TB_retail_image_product";
  const cursor = await getCursor(src);
  const rows = await query(
    `SELECT retailer, product_code, filename, content_type, is_representative,
            captured_at, UpdateDate
       FROM dbo.TB_retail_image_product
      WHERE UpdateDate > @cursor AND is_public = 1
      ORDER BY UpdateDate`,
    cursor
  );
  const known = await knownIds(rows);
  const mapped = rows
    .filter((r) => known.has(id(r)))
    .map((r) => ({
      master_id: id(r),
      filename: r.filename,
      content_type: r.content_type,
      is_representative: r.is_representative,
      captured_at: r.captured_at,
      synced_at: new Date(),
    }));
  // public_url / bg_removed_at 은 이미지 푸시가 채운다. 여기서 덮어쓰지 않는다.
  const n = await upsert(db, "master_image",
    ["master_id","filename","content_type","is_representative","captured_at","synced_at"],
    ["master_id","filename"], mapped);
  if (rows.length) await setCursor(src, rows.at(-1).UpdateDate, n);
  console.log(`이미지 ${n}건 upsert (상품 미존재 ${rows.length - mapped.length}건 보류)`);
  total += n;
}

// 자식 행을 넣기 전에 부모 상품이 있는지 확인 — 없으면 FK 위반으로 배치 전체가 죽는다.
async function knownIds(rows) {
  if (!rows.length) return new Set();
  const ids = [...new Set(rows.map(id))];
  const r = await db.query("select id from master_product where id = any($1)", [ids]);
  return new Set(r.rows.map((x) => x.id));
}

await mssql.close();
await db.end();
console.log(`완료 — 총 ${total}건`);
