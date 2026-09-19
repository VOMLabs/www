import { createEnv } from "@t3-oss/env-core";
import * as v from "valibot";

export const envSchema = {
  DATABASE_URL: v.pipe(v.string(), v.url()),
  BETTER_AUTH_URL: v.optional(v.pipe(v.string(), v.url())),
  BETTER_AUTH_SECRET: v.optional(v.pipe(v.string(), v.minLength(8))),
  S3_ENDPOINT: v.optional(v.pipe(v.string(), v.url())),
  S3_ACCESS_KEY_ID: v.optional(v.string()),
  S3_SECRET_ACCESS_KEY: v.optional(v.string()),
  S3_BUCKET: v.optional(v.string()),
  S3_PUBLIC_URL: v.optional(v.pipe(v.string(), v.url())),
} as const;

/**
 * Whether to skip strict env validation for tooling/CI runs that don't have
 * a full runtime environment (build, format, lint, tests, typecheck).
 */
export function shouldSkipEnvValidation(
  lifecycleEvent: string | undefined,
  vars: Record<string, string | undefined>,
): boolean {
  return (
    vars.SKIP_ENV_VALIDATION === "true" ||
    vars.CI === "true" ||
    lifecycleEvent === "build" ||
    lifecycleEvent === "fmt" ||
    lifecycleEvent === "fmt:check" ||
    lifecycleEvent === "lint" ||
    lifecycleEvent === "test" ||
    lifecycleEvent === "typecheck"
  );
}

/**
 * Build the validated env object. Exposed as a factory so tests can exercise
 * the validation logic with isolated variable sets.
 */
export function createValidatedEnv(
  vars: Record<string, string | undefined>,
  lifecycleEvent: string | undefined,
) {
  return createEnv({
    server: envSchema,
    runtimeEnv: vars,
    emptyStringAsUndefined: true,
    skipValidation: shouldSkipEnvValidation(lifecycleEvent, vars),
  });
}

export const env = createValidatedEnv(
  process.env,
  process.env.npm_lifecycle_event,
);
