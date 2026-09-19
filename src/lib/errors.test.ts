import { describe, expect, it } from "vitest";

import { getErrorMessage, isDatabaseError } from "./errors.js";

describe("isDatabaseError", () => {
  it("returns true for connection refused messages", () => {
    expect(isDatabaseError(new Error("ECONNREFUSED"))).toBe(true);
    expect(isDatabaseError(new Error("Connection refused"))).toBe(true);
  });

  it("returns true for authentication failures", () => {
    expect(
      isDatabaseError(new Error("password authentication failed for user")),
    ).toBe(true);
  });

  it("returns true for missing database/role errors", () => {
    expect(isDatabaseError(new Error('database "prod" does not exist'))).toBe(
      true,
    );
    expect(isDatabaseError(new Error('role "app" does not exist'))).toBe(true);
  });

  it("returns true for startup/timeout errors", () => {
    expect(
      isDatabaseError(new Error("the database system is starting up")),
    ).toBe(true);
    expect(isDatabaseError(new Error("connection timed out"))).toBe(true);
  });

  it("returns false for unrelated errors", () => {
    expect(isDatabaseError(new Error("Something went wrong"))).toBe(false);
    expect(isDatabaseError(new Error("TypeError: x is not a function"))).toBe(
      false,
    );
  });

  it("returns false for non-Error values", () => {
    expect(isDatabaseError("ECONNREFUSED")).toBe(false);
    expect(isDatabaseError(undefined)).toBe(false);
    expect(isDatabaseError(null)).toBe(false);
    expect(isDatabaseError({ message: "connection refused" })).toBe(false);
  });
});

describe("getErrorMessage", () => {
  it("returns the message from an Error", () => {
    expect(getErrorMessage(new Error("boom"))).toBe("boom");
  });

  it("returns the string as-is", () => {
    expect(getErrorMessage("plain string")).toBe("plain string");
  });

  it("returns a fallback for unknown values", () => {
    expect(getErrorMessage(undefined)).toBe("An unknown error occurred.");
    expect(getErrorMessage(null)).toBe("An unknown error occurred.");
    expect(getErrorMessage(42)).toBe("An unknown error occurred.");
    expect(getErrorMessage({ code: 500 })).toBe("An unknown error occurred.");
  });
});
