// 네이버 이미지 업로드 API 확인. R2 원본 → 네이버 CDN.
// 필드명이 문서에 없어 후보를 순서대로 시험한다.
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { loadEnv } from "./pgx.mjs";
import pg from "pg";
loadEnv();
/** Blob 은 ArrayBuffer 기반 뷰만 받는다. R2·fetch 가 주는 뷰를 복사해 맞춘다. */
function blobPart(b: Uint8Array): ArrayBuffer {
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer;
}

const { callApi, resolveDefaultAccount } = await import("../src/lib/naver/auth.ts");
await resolveDefaultAccount();

const db = new pg.Client({ connectionString: process.env.DATABASE_URL });
await db.connect();
const { rows } = await db.query(`
  select i.master_id, i.filename, p.retailer, p.name
    from master_image i join master_product p on p.id = i.master_id
   where i.is_representative and p.is_exposed limit 1`);
await db.end();
const r = rows[0];
if (!r) { console.log("이미지가 있는 상품이 없습니다."); process.exit(1); }
console.log(`대상: ${r.name}\n키: ${r.retailer}/products/original/${r.filename}\n`);

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});
const obj = await r2.send(new GetObjectCommand({
  Bucket: process.env.R2_SOURCE_BUCKET, Key: `${r.retailer}/products/original/${r.filename}`,
}));
const bytes = await obj.Body!.transformToByteArray();
console.log(`원본 ${(bytes.length / 1024).toFixed(0)}KB ${obj.ContentType}\n`);

for (const field of ["imageFiles", "imageFile", "files", "file", "image"]) {
  const fd = new FormData();
  fd.append(field, new Blob([blobPart(bytes)], { type: obj.ContentType ?? "image/jpeg" }), "front.jpg");
  const res = await callApi("/v1/product-images/upload", { method: "POST", body: fd });
  const text = await res.text();
  console.log(`${field.padEnd(11)} ${res.status}  ${text.slice(0, 220)}`);
  if (res.ok) break;
  await new Promise((s) => setTimeout(s, 600));
}
