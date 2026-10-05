import { describe, it, expect, beforeEach } from "vitest";
import { randomBytes } from "node:crypto";
import { sealCredential, openCredential } from "./crypto";

const KEY = randomBytes(32).toString("base64");

describe("마켓 인증정보 봉인", () => {
  beforeEach(() => { process.env.CREDENTIAL_KEY = KEY; });

  it("넣은 그대로 꺼낸다", () => {
    const cred = { accessKey: "AK-123", secretKey: "s3cr3t", vendorId: "A00123456" };
    expect(openCredential(sealCredential(cred))).toEqual(cred);
  });

  it("매번 다른 암호문이 나온다 (같은 키를 넣어도)", () => {
    const cred = { accessKey: "AK-123" };
    expect(sealCredential(cred).equals(sealCredential(cred))).toBe(false);
  });

  it("한 바이트만 바꿔도 복호화가 실패한다", () => {
    const blob = sealCredential({ accessKey: "AK-123" });
    blob[blob.length - 1] = blob.at(-1)! ^ 0xff;
    expect(() => openCredential(blob)).toThrow();
  });

  it("다른 키로는 열리지 않는다", () => {
    const blob = sealCredential({ accessKey: "AK-123" });
    process.env.CREDENTIAL_KEY = randomBytes(32).toString("base64");
    expect(() => openCredential(blob)).toThrow();
  });

  it("키 길이가 틀리면 거부한다", () => {
    process.env.CREDENTIAL_KEY = randomBytes(16).toString("base64");
    expect(() => sealCredential({ a: 1 })).toThrow(/32바이트/);
  });
});
