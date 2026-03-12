import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
      cookies: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
      cookie: () => {},
    } as unknown as TrpcContext["res"],
  };
}

describe("articles router", () => {
  it("articles.list returns an array", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.articles.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("articles.bySlug throws NOT_FOUND for unknown slug", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.articles.bySlug({ slug: "this-slug-does-not-exist-xyz" })
    ).rejects.toThrow();
  });

  it("admin.check returns authenticated: false without token", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.admin.check();
    expect(result.authenticated).toBe(false);
  });
});
