// 상품 1건 등록 시도 (P1). 여섯 개 장벽이 실제로 통과되는지 판정하는 것이 목적이다.
//
//   --dry            요청 본문만 출력하고 호출하지 않는다 (기본)
//   --go             실제로 등록한다
//   --image <경로>   대표이미지로 올릴 로컬 파일
//   --url <URL>      대표이미지를 URL 에서 받아온다 (merrycoco-admin 프록시 등)
//   --label <경로>   품목보고정보 사진 (추가이미지 + 상세설명에 삽입)
//   --code <코드>    마스터 product_code (기본 697786)
//   --courier <코드> 발송 택배사 코드 (기본 LOTTE)
//
// 판매 상태는 SUSPENSION(판매중지)로 등록한다. 노출 없이 API 검증만 하기 위함이다.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import pg from "pg";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { loadEnv } from "./pgx.mjs";

loadEnv();
/** Blob 은 ArrayBuffer 기반 뷰만 받는다. R2·fetch 가 주는 뷰를 복사해 맞춘다. */
function blobPart(b: Uint8Array): ArrayBuffer {
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer;
}

const { callApi, resolveDefaultAccount } = await import("../src/lib/naver/auth.ts");
await resolveDefaultAccount();
const { quote } = await import("../src/lib/pricing.ts");
type Quote = Awaited<ReturnType<typeof quote>>;

const arg = (k: string, d?: string) => {
  const i = process.argv.indexOf(k);
  return i === -1 ? d : process.argv[i + 1];
};
const GO = process.argv.includes("--go");
const CODE = arg("--code", "697786")!;

// ── 판매자 설정 중 아직 DB 로 안 옮긴 것 ─────────────────────────────────────
// 주소록·A/S 연락처는 channel_account 설정으로 옮겨야 한다. 판매가와 비용은 아래에서
// price_policy / channel_fee / cost_item 을 읽어 계산한다.
const SELLER = {
  csPhone: "070-7709-5513",
  shippingAddressId: 106887802,   // 상품출고지 (주소록에서 확인)
  returnAddressId: 106887803,     // 반품교환지
  returnFee: 3000,
  exchangeFee: 6000,
  stock: 10,
  // 발송 택배사 코드. 문서의 코드 목록이 추출되지 않아 실호출로 확인한다.
  // 롯데택배는 과거 현대택배라 LOTTE / HYUNDAI 중 하나일 수 있다.
  // 롯데택배 = 구 현대택배. 네이버 코드는 HYUNDAI (실호출로 확인)
  courier: arg("--courier", "HYUNDAI")!,
};


const db = new pg.Client({ connectionString: process.env.DATABASE_URL });
await db.connect();
const { rows: [tenant] } = await db.query<{ id: string; mode: string }>(
  `select t.id, coalesce(d.mode::text, 'SELF') as mode
     from tenant t left join fulfillment_delegation d on d.tenant_id = t.id
    where t.name = '이지오피스'`);
if (!tenant) { console.error("이지오피스 테넌트가 없습니다."); process.exit(1); }

const { rows } = await db.query(
  `select p.id, p.retailer, p.product_code, p.name, p.category,
          pr.original_price::float as normal_price,
          p.unit_qty::float as unit_qty, p.unit_type, p.pack_count,
          p.total_qty::float as total_qty,
          (select json_agg(json_build_object('filename', i.filename, 'rep', i.is_representative))
             from master_image i where i.master_id = p.id) as images
     from master_product p
     left join master_price pr on pr.master_id = p.id and pr.price_channel = 'store'
    where p.product_code = $1`,
  [CODE],
);
const m = rows[0];
if (!m) { console.error(`마스터에 ${CODE} 가 없습니다.`); process.exit(1); }

// ── 판매가: price_policy + channel_fee + cost_item 으로 계산 ────────────────
const CATEGORY_CODE = "50002256";   // 식품>음료>청량/탄산음료>이온음료
const q = await quote({
  tenantId: tenant.id,
  channel: "NAVER",
  normalPrice: m.normal_price,
  channelCategoryCode: CATEGORY_CODE,
  mode: tenant.mode as "SELF" | "MERRYCOCO",
});
const salePrice = q.salePrice;
const deliveryFee = q.costs.find((c: Quote["costs"][number]) => c.code === "SHIPPING")?.amount ?? 0;

// ── 이미지: 로컬 파일 우선, 없으면 마스터 이미지를 R2 에서 ────────────────────
// 네이버는 JPEG/JPG/GIF/PNG/BMP 만 받는다. 코스트코 원본은 WebP 라 변환이 필요하다.
// 최소 변환만 한다 — Pillow 로 JPEG 로 바꾸고, 640px 미만이면 경고한다 (네이버 권장 640x640).
const OK_TYPES = /image\/(jpeg|jpg|gif|png|bmp)/i;
function toJpeg(bytes: Uint8Array, type: string, label: string): { bytes: Uint8Array; type: string } {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "sh-img-"));
  const src = path.join(dir, "in.bin");
  const out = path.join(dir, "out.jpg");
  fs.writeFileSync(src, bytes);
  const py = path.join(process.cwd(), ".venv/bin/python");
  const code = `from PIL import Image
im = Image.open(r"${src}")
print(f"{im.width}x{im.height} {im.format}")
im.convert("RGB").save(r"${out}", "JPEG", quality=92)`;
  const info = execFileSync(py, ["-c", code], { encoding: "utf8" }).trim();
  const dim = info.split(" ")[0] ?? "0x0";
  const [w = 0, h = 0] = dim.split("x").map(Number);
  console.log(`  ${label} 변환 ${info} → JPEG` + (Math.min(w, h) < 640
    ? `  ⚠ 짧은 변이 ${Math.min(w, h)}px — 네이버 권장 640px 미만` : ""));
  const got = new Uint8Array(fs.readFileSync(out));
  fs.rmSync(dir, { recursive: true, force: true });
  return { bytes: got, type: "image/jpeg" };
}

async function upload(bytes: Uint8Array, type: string, name: string): Promise<string> {
  if (!OK_TYPES.test(type)) ({ bytes, type } = toJpeg(bytes, type, name));
  const fd = new FormData();
  fd.append("imageFiles", new Blob([blobPart(bytes)], { type }), name);
  const res = await callApi("/v1/product-images/upload", { method: "POST", body: fd });
  const text = await res.text();
  if (!res.ok) throw new Error(`이미지 업로드 실패 ${res.status}: ${text.slice(0, 300)}`);
  const url = (JSON.parse(text) as { images?: { url: string }[] }).images?.[0]?.url;
  if (!url) throw new Error(`업로드 응답에 url 이 없습니다: ${text.slice(0, 200)}`);
  return url;
}

async function fromR2(filename: string): Promise<{ bytes: Uint8Array; type: string }> {
  const r2 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
  const o = await r2.send(new GetObjectCommand({
    Bucket: process.env.R2_SOURCE_BUCKET,
    Key: `${m.retailer}/products/original/${filename}`,
  }));
  return { bytes: await o.Body!.transformToByteArray(), type: o.ContentType ?? "image/jpeg" };
}

async function fromUrl(url: string) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`이미지 받기 실패 ${r.status}: ${url}`);
  return {
    bytes: new Uint8Array(await r.arrayBuffer()),
    type: r.headers.get("content-type") ?? "image/jpeg",
    src: url,
  };
}

async function resolveImage(local: string | undefined, role: string) {
  if (local) {
    if (!fs.existsSync(local)) throw new Error(`${role} 파일이 없습니다: ${local}`);
    return { bytes: new Uint8Array(fs.readFileSync(local)), type: "image/jpeg", src: local };
  }
  const rep = (m.images ?? []).find((i: { rep: boolean }) => i.rep) ?? (m.images ?? [])[0];
  if (!rep) return null;
  const got = await fromR2(rep.filename);
  return { ...got, src: `R2:${rep.filename}` };
}

const front = arg("--url")
  ? await fromUrl(arg("--url")!)
  : await resolveImage(arg("--image"), "대표이미지");
const label = arg("--label") ? await resolveImage(arg("--label"), "품목보고정보") : null;
if (!front) {
  console.error(`\n대표이미지가 없습니다. 네이버는 필수입니다.`);
  console.error(`--url <이미지 URL> 또는 --image <파일 경로> 로 지정하세요.`);
  process.exit(1);
}

let frontUrl = "(dry — 업로드 안 함)";
let labelUrl: string | null = label ? "(dry)" : null;
if (GO) {
  frontUrl = await upload(front.bytes, front.type, "front.jpg");
  if (label) labelUrl = await upload(label.bytes, label.type, "label.jpg");
}

// ── 단위가격 ───────────────────────────────────────────────────────────────
// 가격표시제 대상 카테고리는 unitCapacity 가 필수다.
// 원천(TB_retail_products)의 규격 컬럼이 판매가능 3,133건 중 1,756건(56%)에 채워져 있으므로
// 그것을 먼저 쓰고, 없을 때만 상품명에서 읽는다. 파서는 오인식 위험이 있어 보조 수단이다.
//
// 표시 기준(per): 네이버는 1~999 범위. 소량 단위는 100 기준이 관례다 (100ml당 X원).
const UNIT_MAP: Record<string, string> = { g: "g", kg: "kg", ml: "ml", l: "L", m: "m", cm: "cm", ea: "개" };

interface Unit { total: number; per: number; unit: string; src: string }

function unitFromDb(): Unit | null {
  const u = m.unit_type ? UNIT_MAP[String(m.unit_type).toLowerCase()] : null;
  if (!u) return null;
  // total_qty = unit_qty × pack_count 가 원천에서 계산돼 있다. 없으면 직접 곱한다.
  const total = m.total_qty ?? (m.unit_qty != null ? m.unit_qty * (m.pack_count ?? 1) : null);
  if (!total || total <= 0) return null;
  return { total, per: u === "ml" || u === "g" ? 100 : 1, unit: u, src: "DB 규격" };
}

function unitFromName(name: string): Unit {
  const m2 = name.match(/(\d+(?:\.\d+)?)\s*(ML|L|G|KG)\s*[X*×]\s*(\d+)/i);
  if (m2) {
    const unit = UNIT_MAP[m2[2]!.toLowerCase()]!;
    return { total: Number(m2[1]) * Number(m2[3]), per: unit === "ml" || unit === "g" ? 100 : 1, unit,
             src: "상품명 파싱" };
  }
  const m1 = name.match(/(\d+(?:\.\d+)?)\s*(ML|L|G|KG)\b/i);
  if (m1) {
    const unit = UNIT_MAP[m1[2]!.toLowerCase()]!;
    return { total: Number(m1[1]), per: unit === "ml" || unit === "g" ? 100 : 1, unit, src: "상품명 파싱" };
  }
  const m3 = name.match(/[X*×]\s*(\d+)\s*(CAN|EA|개|입)?/i);
  if (m3) return { total: Number(m3[1]), per: 1, unit: "개", src: "상품명 파싱" };
  return { total: 1, per: 1, unit: "개", src: "기본값" };
}

const unit = unitFromDb() ?? unitFromName(m.name);

// ── 상세설명: 대표이미지 + 품목보고정보 사진 + 규격표 ────────────────────────
// 고시정보를 "상품상세참조" 로 채우는 방식이라 실제 정보는 여기서 제공해야 한다.
const detail = `<div>
  <p><img src="${frontUrl}" alt="${m.name}" style="max-width:100%"></p>
  ${labelUrl ? `<h3>제품 표시사항</h3>\n  <p><img src="${labelUrl}" alt="품목보고정보" style="max-width:100%"></p>` : ""}
  <h3>상품 정보</h3>
  <table>
    <tr><th>상품명</th><td>${m.name}</td></tr>
    <tr><th>원산지</th><td>제품 표시사항 이미지 참조</td></tr>
    <tr><th>제조사 · 유통기한 · 원재료</th><td>제품 표시사항 이미지 참조</td></tr>
  </table>
  <p>제품의 상세 표시사항은 위 표시사항 이미지를 확인해 주세요.</p>
</div>`;

const payload = {
  originProduct: {
    statusType: "SUSPENSION",          // 판매중지로 등록 — 노출되지 않는다
    saleType: "NEW",
    leafCategoryId: "50002256",        // 식품>음료>청량/탄산음료>이온음료
    name: m.name,
    detailContent: detail,
    images: {
      representativeImage: { url: frontUrl },
      ...(labelUrl ? { optionalImages: [{ url: labelUrl }] } : {}),
    },
    salePrice,
    stockQuantity: SELLER.stock,
    deliveryInfo: {
      deliveryType: "DELIVERY",
      deliveryAttributeType: "NORMAL",
      deliveryCompany: SELLER.courier,
      deliveryFee: {
        deliveryFeeType: "PAID",
        baseFee: deliveryFee,
        deliveryFeePayType: "PREPAID",   // COLLECT(착불) | PREPAID(선결제) | COLLECT_OR_PREPAID
      },
      claimDeliveryInfo: {
        returnDeliveryFee: SELLER.returnFee,
        exchangeDeliveryFee: SELLER.exchangeFee,
        shippingAddressId: SELLER.shippingAddressId,
        returnAddressId: SELLER.returnAddressId,
      },
    },
    detailAttribute: {
      afterServiceInfo: {
        afterServiceTelephoneNumber: SELLER.csPhone,
        afterServiceGuideContent: "상품 문의는 스마트스토어 문의하기를 이용해 주세요.",
      },
      originAreaInfo: { originAreaCode: "03" },   // 03 = 상세설명에 표시
      taxType: "TAX",
      certificationTargetExcludeContent: { kcCertifiedProductExclusionYn: "TRUE" },
      productInfoProvidedNotice: {
        productInfoProvidedNoticeType: "ETC",
        etc: {
          itemName: "상품상세참조",
          modelName: "상품상세참조",
          manufacturer: "상품상세참조",
          customerServicePhoneNumber: SELLER.csPhone.replace(/-/g, ""),
          returnCostReason: "1",
          noRefundReason: "1",
          qualityAssuranceStandard: "1",
          compensationProcedure: "1",
          troubleShootingContents: "1",
        },
      },
      // 가격표시제 대상 카테고리(식품·생활용품 다수)는 단위가격이 필수다.
      // 마스터의 unit_qty/pack_count 가 비어 있으면 상품명에서 읽어 넣는다.
      unitCapacity: {
        unitPriceYn: true,
        totalCapacityValue: unit.total,   // 총 용량
        unitCapacity: unit.per,           // 표시 기준 (1~999)
        indicationUnit: unit.unit,        // g kg ml L cm m 개 개입 매 ...
      },
      minorPurchasable: true,
      sellerCommentUsable: false,
    },
  },
  smartstoreChannelProduct: {
    naverShoppingRegistration: true,
    channelProductDisplayStatusType: "ON",
  },
};

console.log(`\n대상        ${m.id}  ${m.name}`);
console.log(`카테고리    ${m.category} → 50002256 식품>음료>청량/탄산음료>이온음료`);
console.log(`판매가      ${salePrice.toLocaleString()}원   순이익 ${q.profit.toLocaleString()}원`);
console.log(`수수료      ${(q.feeRate * 100).toFixed(3)}%  ${q.fees.map((f: Quote["fees"][number]) => `${f.kind} ${(f.rate * 100).toFixed(3)}%(${f.source})`).join(" + ")}`);
console.log(`고정비      ${q.costFixed.toLocaleString()}원  ${q.costs.map((c: Quote["costs"][number]) => `${c.name} ${c.amount.toLocaleString()}(${c.scope})`).join(" + ")}`);
console.log(`검산        ${salePrice.toLocaleString()} - 수수료 ${q.feeAmount.toLocaleString()} - 정상가 ${m.normal_price.toLocaleString()} - 고정비 ${q.costFixed.toLocaleString()} = ${q.profit.toLocaleString()}원`);
console.log(`이미지      정면 ${front.src}${label ? `  라벨 ${label.src}` : "  (라벨 없음)"}`);
console.log(`택배사      ${SELLER.courier}  (배송비 선결제)`);
console.log(`단위가격    총 ${unit.total}${unit.unit} · ${unit.per}${unit.unit} 기준  (${unit.src})`);
console.log(`판매상태    SUSPENSION (판매중지 — 노출되지 않음)\n`);

if (!GO) {
  console.log("=== 요청 본문 (POST /v2/products) ===");
  console.log(JSON.stringify(payload, null, 2));
  console.log("\n(dry run — 실제로 등록하려면 --go)");
  await db.end();
  process.exit(0);
}

// --try-couriers 를 주면 택배사 코드 후보를 순회한다. 이미지는 이미 올렸으므로 재사용된다.
const candidates = process.argv.includes("--try-couriers")
  ? ["HYUNDAI", "LOTTE", "LOTTEGLOBAL", "LOTTEGLS", "CJGLS", "HANJIN", "EPOST", "LOGEN"]
  : [SELLER.courier];

for (const c of candidates) {
  payload.originProduct.deliveryInfo.deliveryCompany = c;
  const res = await callApi("/v2/products", { method: "POST", body: JSON.stringify(payload) });
  const text = await res.text();
  let brief = text.slice(0, 200);
  try {
    const j = JSON.parse(text) as { invalidInputs?: { name: string; message: string }[] };
    if (j.invalidInputs?.length) {
      brief = j.invalidInputs.map((i) => `${i.name.replace("originProduct.", "")}: ${i.message}`).join(" | ");
    }
  } catch { /* 원문 그대로 */ }
  console.log(`${c.padEnd(12)} ${res.status}  ${brief.slice(0, 180)}`);

  if (res.ok) {
    console.log(`\n=== 등록 성공 ===`);
    try { console.log(JSON.stringify(JSON.parse(text), null, 2).slice(0, 1500)); } catch { console.log(text); }
    break;
  }
  // 택배사 외의 항목이 문제라면 코드를 더 바꿔봐도 의미가 없다
  if (!brief.includes("deliveryCompany") && !brief.includes("택배사")) {
    console.log("\n택배사 외의 항목이 걸렸습니다. 순회를 멈춥니다.");
    break;
  }
  await new Promise((r) => setTimeout(r, 600));
}
await db.end();
