// 마스터 이미지 배경제거 → SellerHub 공개 버킷 푸시
//
//   마켓 상품등록 API 는 이미지 URL 을 직접 가져간다. 그런데 메리코코 R2 는 비공개이고,
//   공개되는 건 워터마크본뿐이라 판매용으로 쓸 수 없다. 그래서 원본(original)을 받아
//   배경을 제거한 뒤 SellerHub 자체 공개 버킷에 올리고, 그 URL 을 마켓에 넘긴다.
//
//   배경제거는 **마스터 단계에서 1회**다. 판매자가 몇 명이든 같은 상품이면 한 번만 처리한다.
//   판매자별 가공(배경교체·마켓별 리사이즈)은 이 PNG 에서 출발한다.
//
//   R2 는 인터넷 API 라 이지오피스 밖에서도 읽힌다. 즉 이 스크립트는 SellerHub 독립 머신에서
//   돌고, 이지오피스는 아무 일도 하지 않는다.
//
//   큐는 따로 없다. master_image.bg_removed_at 이 null 인 것이 대기열이다.
//
//   실행: node scripts/push-images.mjs [--limit 200] [--dry-run]
//
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import pg from "pg";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { ROOT, loadEnv } from "./pgx.mjs";

loadEnv();

const arg = (name, dflt) => {
  const i = process.argv.indexOf(name);
  return i === -1 ? dflt : process.argv[i + 1];
};
const LIMIT = Number(arg("--limit", 200));
const DRY = process.argv.includes("--dry-run");
const REMBG = process.env.REMBG ?? path.join(ROOT, ".venv/bin/rembg");
// 모델을 반드시 못박는다. rembg 의 기본 모델(bria-rmbg)은 **비상업용 라이선스**라
// 판매 플랫폼에 쓸 수 없다. u2net 은 Apache-2.0 이다.
const REMBG_MODEL = process.env.REMBG_MODEL ?? "u2net";
const BASE_URL = (process.env.IMAGE_BASE_URL ?? "").replace(/\/$/, "");
if (!BASE_URL) throw new Error("IMAGE_BASE_URL 미설정 — 공개 URL 을 만들 수 없습니다.");

// 두 버킷이 같은 메리코코 Cloudflare 계정에 있어 클라이언트는 하나로 충분하다.
const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});
const SRC_BUCKET = process.env.R2_SOURCE_BUCKET;   // 기존, 비공개
const DST_BUCKET = process.env.R2_BUCKET;          // 신규, 공개

const db = new pg.Client({ connectionString: process.env.DATABASE_URL });
await db.connect();

// 대표 이미지를 먼저 — 대표만 있으면 그 상품은 팔 수 있다.
const { rows: pending } = await db.query(
  `select i.master_id, i.filename, p.retailer
     from master_image i
     join master_product p on p.id = i.master_id
    where i.bg_removed_at is null and i.bg_attempts < 3
    order by i.is_representative desc, i.synced_at
    limit $1`,
  [LIMIT]
);
console.log(`대기 ${pending.length}건`);
if (!pending.length) { await db.end(); process.exit(0); }
if (DRY) {
  for (const r of pending.slice(0, 10)) console.log(`  ${r.retailer}/products/original/${r.filename}`);
  await db.end();
  process.exit(0);
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "sh-img-"));
const inDir = path.join(tmp, "in"), outDir = path.join(tmp, "out");
fs.mkdirSync(inDir); fs.mkdirSync(outDir);

// ── 1. 원본 다운로드 ───────────────────────────────────────────
// filename 에 '/' 가 들어있어(= '{code}/{ts}.ext') 로컬에는 순번으로 평탄화해 저장한다.
const staged = [];
for (const [i, row] of pending.entries()) {
  const key = `${row.retailer}/products/original/${row.filename}`;
  try {
    const obj = await r2.send(new GetObjectCommand({ Bucket: SRC_BUCKET, Key: key }));
    const ext = path.extname(row.filename) || ".jpg";
    const local = path.join(inDir, `${i}${ext}`);
    fs.writeFileSync(local, Buffer.from(await obj.Body.transformToByteArray()));
    staged.push({ ...row, stem: String(i) });
  } catch (e) {
    console.warn(`  다운로드 실패 ${key}: ${e.name}`);
    await bump(row, `download: ${e.name}`);
  }
}
console.log(`다운로드 ${staged.length}건`);

// ── 2. 배경제거 ────────────────────────────────────────────────
// 폴더 단위로 한 번에 돌린다 — 장당 CLI 를 부르면 모델 로딩(수 초)이 매번 반복된다.
if (staged.length) {
  execFileSync(REMBG, ["p", "-m", REMBG_MODEL, inDir, outDir], { stdio: "inherit" });
}

// ── 3. 업로드 + 기록 ───────────────────────────────────────────
let ok = 0;
for (const row of staged) {
  const produced = path.join(outDir, `${row.stem}.png`);
  if (!fs.existsSync(produced)) {
    console.warn(`  배경제거 결과 없음: ${row.filename}`);
    await bump(row, "rembg: no output");
    continue;
  }
  // '{code}/{ts}.jpg' → 'master/{retailer}/{code}/{ts}.png'
  const key = `master/${row.retailer}/${row.filename.replace(/\.[^.]+$/, "")}.png`;
  try {
    await r2.send(new PutObjectCommand({
      Bucket: DST_BUCKET, Key: key,
      Body: fs.readFileSync(produced), ContentType: "image/png",
    }));
    await db.query(
      `update master_image set public_url = $1, bg_removed_at = now()
        where master_id = $2 and filename = $3`,
      [`${BASE_URL}/${key}`, row.master_id, row.filename]
    );
    ok++;
  } catch (e) {
    console.warn(`  업로드 실패 ${key}: ${e.name}`);
    await bump(row, `upload: ${e.name}`);
  }
}

fs.rmSync(tmp, { recursive: true, force: true });
await db.end();
console.log(`완료 — ${ok}건 푸시, ${pending.length - ok}건 보류`);

// 실패는 건너뛴다. bg_attempts 가 3이 되면 큐에서 빠지고, 그 이미지만 판매 불가가 된다.
async function bump(row, why) {
  await db.query(
    `update master_image set bg_attempts = bg_attempts + 1
      where master_id = $1 and filename = $2`,
    [row.master_id, row.filename]
  );
  console.warn(`    → ${row.master_id} ${why}`);
}
