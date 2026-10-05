import { describe, expect, it } from "vitest";
import { viewTenantId } from "./session";

/**
 * 시스템관리자 테넌트 전환의 **권한 판단**. 여기가 격리의 경계다 —
 * 느슨해지면 일반 판매자가 쿠키 하나로 남의 데이터를 본다.
 */
const MINE = "9a785cd8-3cdf-4b30-ba00-5a1b7f3c0e51";
const OTHER = "ec7f831a-570a-4330-b633-ecd41a53f41c";

describe("viewTenantId", () => {
  it("관리자는 다른 테넌트로 전환할 수 있다", () => {
    expect(viewTenantId("PLATFORM", MINE, OTHER)).toBe(OTHER);
  });

  it("관리자가 아니면 쿠키를 무시한다", () => {
    for (const role of ["OWNER", "STAFF", "platform", ""]) {
      expect(viewTenantId(role, MINE, OTHER)).toBeNull();
    }
  });

  it("쿠키가 없거나 uuid 가 아니면 무시한다", () => {
    for (const c of [undefined, "", "x", `${OTHER}'--`, "9a785cd8"]) {
      expect(viewTenantId("PLATFORM", MINE, c)).toBeNull();
    }
  });

  it("내 테넌트를 가리키면 전환이 아니다", () => {
    expect(viewTenantId("PLATFORM", MINE, MINE)).toBeNull();
  });
});
