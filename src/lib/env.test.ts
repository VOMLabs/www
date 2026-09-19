// @vitest-environment node
import { describe, expect, it } from "vitest";

import { createValidatedEnv, shouldSkipEnvValidation } from "./env.js";

const VALID_VARS = {
  DATABASE_URL: "postgresql://user:pass@localhost:5432/app",
  BETTER_AUTH_URL: "http://localhost:3000",
  BETTER_AUTH_SECRET: "supersecret123",
} as const;

describe("shouldSkipEnvValidation", () => {
  it("returns true when SKIP_ENV_VALIDATION is true", () => {
    expect(
      shouldSkipEnvValidation(undefined, { SKIP_ENV_VALIDATION: "true" }),
    ).toBe(true);
  });

  it("returns true when running in CI", () => {
    expect(shouldSkipEnvValidation(undefined, { CI: "true" })).toBe(true);
  });

  it("returns true for known tooling lifecycle events", () => {
    for (const event of [
      "build",
      "fmt",
      "fmt:check",
      "lint",
      "test",
      "typecheck",
    ]) {
      expect(shouldSkipEnvValidation(event, {})).toBe(true);
    }
  });

  it("returns false for runtime lifecycle events", () => {
    for (const event of ["dev", "start", "preview", "db:push"]) {
      expect(shouldSkipEnvValidation(event, {})).toBe(false);
    }
  });

  it("returns false when nothing indicates tooling context", () => {
    expect(shouldSkipEnvValidation(undefined, {})).toBe(false);
  });
});

describe("createValidatedEnv", () => {
  it("exposes validated values for a complete environment", () => {
    const env = createValidatedEnv(VALID_VARS, undefined);

    expect(env.DATABASE_URL).toBe(VALID_VARS.DATABASE_URL);
    expect(env.BETTER_AUTH_URL).toBe(VALID_VARS.BETTER_AUTH_URL);
    expect(env.BETTER_AUTH_SECRET).toBe(VALID_VARS.BETTER_AUTH_SECRET);
  });

  it("treats optional vars as undefined when omitted", () => {
    const env = createValidatedEnv(
      { DATABASE_URL: VALID_VARS.DATABASE_URL },
      undefined,
    );

    expect(env.DATABASE_URL).toBe(VALID_VARS.DATABASE_URL);
    expect(env.BETTER_AUTH_URL).toBeUndefined();
    expect(env.BETTER_AUTH_SECRET).toBeUndefined();
  });

  it("throws when DATABASE_URL is missing", () => {
    expect(() =>
      createValidatedEnv(
        { BETTER_AUTH_URL: VALID_VARS.BETTER_AUTH_URL },
        undefined,
      ),
    ).toThrow("Invalid environment variables");
  });

  it("throws when DATABASE_URL is not a valid URL", () => {
    expect(() =>
      createValidatedEnv({ DATABASE_URL: "not-a-url" }, undefined),
    ).toThrow("Invalid environment variables");
  });

  it("throws when BETTER_AUTH_URL is not a valid URL", () => {
    expect(() =>
      createValidatedEnv(
        { DATABASE_URL: VALID_VARS.DATABASE_URL, BETTER_AUTH_URL: "nope" },
        undefined,
      ),
    ).toThrow("Invalid environment variables");
  });

  it("throws when BETTER_AUTH_SECRET is too short", () => {
    expect(() =>
      createValidatedEnv(
        {
          DATABASE_URL: VALID_VARS.DATABASE_URL,
          BETTER_AUTH_SECRET: "short",
        },
        undefined,
      ),
    ).toThrow("Invalid environment variables");
  });

  it("does not throw when validation is skipped", () => {
    expect(() => createValidatedEnv({}, "test")).not.toThrow();
  });

  it("does not throw on empty optional vars (emptyStringAsUndefined)", () => {
    expect(() =>
      createValidatedEnv(
        {
          DATABASE_URL: VALID_VARS.DATABASE_URL,
          BETTER_AUTH_URL: "",
          BETTER_AUTH_SECRET: "",
        },
        undefined,
      ),
    ).not.toThrow();
  });
});
