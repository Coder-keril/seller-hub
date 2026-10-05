// 판매자 마켓 인증정보 암호화.
//
// 쿠팡·네이버·11번가 … 마켓마다 필요한 키가 달라(access key, secret, vendor id, refresh token)
// 컬럼으로 못 나눈다. JSON 한 덩어리로 묶어 AES-256-GCM 으로 봉해 channel_account.credential_enc
// (bytea) 에 넣는다. GCM 이라 위조도 복호화 단계에서 잡힌다.
//
// 키는 CREDENTIAL_KEY (32바이트 base64) 하나다. 만드는 법:
//   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
//
// ponytail: 키 1개로 전부 암호화한다. 키 교체(rotation)가 필요해지면 저장 형식 맨 앞에
// 키 버전 1바이트를 붙이고 복호화에서 분기한다.
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const IV_LEN = 12; // GCM 권장
const TAG_LEN = 16;

function key(): Buffer {
  const raw = process.env.CREDENTIAL_KEY;
  if (!raw) throw new Error("CREDENTIAL_KEY 가 없습니다.");
  const k = Buffer.from(raw, "base64");
  if (k.length !== 32) throw new Error(`CREDENTIAL_KEY 는 32바이트여야 합니다 (현재 ${k.length}).`);
  return k;
}

/** 저장 형식: iv(12) ‖ tag(16) ‖ ciphertext */
export function sealCredential(cred: Record<string, unknown>): Buffer {
  const iv = randomBytes(IV_LEN);
  const c = createCipheriv("aes-256-gcm", key(), iv);
  const body = Buffer.concat([c.update(JSON.stringify(cred), "utf8"), c.final()]);
  return Buffer.concat([iv, c.getAuthTag(), body]);
}

export function openCredential(blob: Buffer): Record<string, unknown> {
  if (blob.length < IV_LEN + TAG_LEN) throw new Error("인증정보가 손상되었습니다.");
  const d = createDecipheriv("aes-256-gcm", key(), blob.subarray(0, IV_LEN));
  d.setAuthTag(blob.subarray(IV_LEN, IV_LEN + TAG_LEN));
  const json = Buffer.concat([d.update(blob.subarray(IV_LEN + TAG_LEN)), d.final()]).toString("utf8");
  return JSON.parse(json) as Record<string, unknown>;
}
