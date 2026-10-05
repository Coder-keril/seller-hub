import { describe, it, expect } from "vitest";
import { assertTenantScoped } from "./db";

describe("테넌트 격리 가드", () => {
  it("tenant_id 조건이 있으면 통과", () => {
    expect(() => assertTenantScoped(
      "select * from orders where tenant_id = $1 and status = $2")).not.toThrow();
  });

  it("tenant_id 를 빼먹으면 막는다", () => {
    expect(() => assertTenantScoped(
      "select * from orders where status = $1")).toThrow(/tenant_id/);
  });

  it("$1 이 없으면 막는다 — tenantId 가 안 쓰인 것", () => {
    expect(() => assertTenantScoped(
      "select * from orders where tenant_id = 'abc'")).toThrow(/\$1/);
  });

  it("join 이 섞여도 tenant_id 를 보면 통과", () => {
    expect(() => assertTenantScoped(`
      select o.*, i.product_name from orders o
        join order_item i on i.order_id = o.id
       where o.tenant_id = $1`)).not.toThrow();
  });
});

describe("운영자 조회 가드", () => {
  it("$1 이 없으면 막는다 — 위임 목록이 안 들어간 것", async () => {
    const { dquery } = await import("./db");
    await expect(dquery("select * from orders where tenant_id = 'abc'")).rejects.toThrow(/\$1/);
  });

  it("tenant_id 조건이 없으면 막는다", async () => {
    const { dquery } = await import("./db");
    await expect(dquery("select * from orders where status = $1")).rejects.toThrow(/tenant_id/);
  });
});
