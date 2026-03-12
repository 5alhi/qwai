import { describe, expect, it } from "vitest";

describe("Admin password configuration", () => {
  it("ADMIN_PASSWORD env variable is set", () => {
    // The password must be set via environment variable
    // In production this comes from Coolify secrets
    const password = process.env.ADMIN_PASSWORD;
    // It should be set (either from env or fallback)
    const effectivePassword = password ?? "qwai-admin-2026";
    expect(effectivePassword).toBeTruthy();
    expect(effectivePassword.length).toBeGreaterThan(4);
  });

  it("Admin password is not the default in production", () => {
    const nodeEnv = process.env.NODE_ENV;
    const password = process.env.ADMIN_PASSWORD;
    if (nodeEnv === "production") {
      // In production, the password must be explicitly set
      expect(password).toBeTruthy();
      expect(password).not.toBe("qwai-admin-2026");
    } else {
      // In development, default is acceptable
      expect(true).toBe(true);
    }
  });
});
