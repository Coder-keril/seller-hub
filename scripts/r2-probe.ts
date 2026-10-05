// 메리코코 R2 원본 이미지 읽기 확인. 읽기 전용.
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { loadEnv } from "./pgx.mjs";
import pg from "pg";
loadEnv();

const db = new pg.Client({ connectionString: process.env.DATABASE_URL });
await db.connect();
const { rows } = await db.query(`
  select i.master_id, i.filename, p.retailer, p.name
    from master_image i join master_product p on p.id = i.master_id
   where i.is_representative and p.is_exposed
   order by p.retailer, i.synced_at limit 3`);
await db.end();

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});
for (const r of rows) {
  const key = `${r.retailer}/products/original/${r.filename}`;
  try {
    const o = await r2.send(new GetObjectCommand({ Bucket: process.env.R2_SOURCE_BUCKET, Key: key }));
    const b = await o.Body!.transformToByteArray();
    console.log(`OK   ${(b.length / 1024).toFixed(0).padStart(5)}KB  ${o.ContentType}  ${key}`);
  } catch (e) {
    console.log(`실패  ${(e as Error).name}  ${key}`);
  }
}
