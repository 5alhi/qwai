import { describe, expect, it, vi, beforeEach } from "vitest";
import { parseUserAgent, extractReferrerDomain, extractIp } from "./analytics";

// ─── parseUserAgent ───────────────────────────────────────────────────────────

describe("parseUserAgent", () => {
  it("returns Unknown for empty string", () => {
    const result = parseUserAgent("");
    expect(result.browser).toBe("Unknown");
    expect(result.os).toBe("Unknown");
    expect(result.device).toBe("desktop");
  });

  it("detects Chrome on Windows", () => {
    const ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
    const result = parseUserAgent(ua);
    expect(result.browser).toBe("Chrome");
    expect(result.os).toBe("Windows");
    expect(result.osVersion).toBe("10/11");
    expect(result.device).toBe("desktop");
  });

  it("detects Safari on macOS", () => {
    const ua = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";
    const result = parseUserAgent(ua);
    expect(result.browser).toBe("Safari");
    expect(result.os).toBe("macOS");
    expect(result.device).toBe("desktop");
  });

  it("detects Firefox on Linux", () => {
    const ua = "Mozilla/5.0 (X11; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0";
    const result = parseUserAgent(ua);
    expect(result.browser).toBe("Firefox");
    expect(result.os).toBe("Linux");
    expect(result.device).toBe("desktop");
  });

  it("detects mobile device on Android", () => {
    const ua = "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";
    const result = parseUserAgent(ua);
    expect(result.device).toBe("mobile");
    expect(result.os).toBe("Android");
  });

  it("detects iOS device", () => {
    const ua = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
    const result = parseUserAgent(ua);
    expect(result.device).toBe("mobile");
    expect(result.os).toBe("iOS");
  });

  it("detects Edge browser", () => {
    const ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0";
    const result = parseUserAgent(ua);
    expect(result.browser).toBe("Edge");
  });
});

// ─── extractReferrerDomain ────────────────────────────────────────────────────

describe("extractReferrerDomain", () => {
  it("returns empty string for null/undefined", () => {
    expect(extractReferrerDomain(null)).toBe("");
    expect(extractReferrerDomain(undefined)).toBe("");
    expect(extractReferrerDomain("")).toBe("");
  });

  it("strips www prefix", () => {
    expect(extractReferrerDomain("https://www.google.com/search?q=qwai")).toBe("google.com");
  });

  it("returns bare hostname", () => {
    expect(extractReferrerDomain("https://linkedin.com/pulse/article")).toBe("linkedin.com");
  });

  it("handles invalid URLs gracefully", () => {
    expect(extractReferrerDomain("not-a-url")).toBe("");
  });
});

// ─── extractIp ───────────────────────────────────────────────────────────────

describe("extractIp", () => {
  it("extracts first IP from x-forwarded-for header", () => {
    const req = { headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" } };
    expect(extractIp(req)).toBe("1.2.3.4");
  });

  it("handles array x-forwarded-for", () => {
    const req = { headers: { "x-forwarded-for": ["9.8.7.6", "1.2.3.4"] } };
    expect(extractIp(req)).toBe("9.8.7.6");
  });

  it("falls back to socket remoteAddress", () => {
    const req = { headers: {}, socket: { remoteAddress: "10.0.0.1" } };
    expect(extractIp(req)).toBe("10.0.0.1");
  });

  it("returns empty string when no IP available", () => {
    const req = { headers: {} };
    expect(extractIp(req)).toBe("");
  });
});

// ─── analytics.track tRPC procedure ──────────────────────────────────────────

describe("analytics.track (tRPC procedure)", () => {
  it("returns success and id when database is unavailable (graceful degradation)", async () => {
    // Mock the db module so no real DB connection is needed
    vi.mock("./db", async (importOriginal) => {
      const actual = await importOriginal<typeof import("./db")>();
      return {
        ...actual,
        trackPageView: vi.fn().mockResolvedValue(null),
        updatePageViewEngagement: vi.fn().mockResolvedValue(undefined),
        trackVisitorEvent: vi.fn().mockResolvedValue(undefined),
      };
    });

    const { appRouter } = await import("./routers");
    const { trackPageView } = await import("./db");

    const ctx = {
      user: null,
      req: {
        protocol: "https",
        headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0" },
        socket: { remoteAddress: "127.0.0.1" },
      },
      res: {} as unknown,
    } as Parameters<typeof appRouter.createCaller>[0];

    const caller = appRouter.createCaller(ctx);
    const result = await caller.analytics.track({
      path: "/test",
      sessionId: "test-session-123",
      isNewVisitor: true,
    });

    expect(result.success).toBe(true);
    expect(trackPageView).toHaveBeenCalledWith(
      expect.objectContaining({
        path: "/test",
        sessionId: "test-session-123",
        isNewVisitor: true,
      })
    );
  });
});
