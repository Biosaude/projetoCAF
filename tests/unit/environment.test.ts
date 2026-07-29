import { describe, expect, it } from "vitest";
import { parseEnvironment } from "@/config/env";

const validEnvironment = {
  NODE_ENV: "production",
  DATABASE_URL: "postgresql://user:password@database.example.com:5432/caf",
  AUTH_SECRET: "a-secure-secret-with-at-least-32-characters",
  AUTH_URL: "https://caf.example.com",
  GOOGLE_CLIENT_ID: "google-client-id",
  GOOGLE_CLIENT_SECRET: "google-client-secret",
  LOG_LEVEL: "error",
} as NodeJS.ProcessEnv;

describe("environment validation", () => {
  it("accepts the complete runtime configuration", () => {
    expect(parseEnvironment(validEnvironment)).toMatchObject({
      NODE_ENV: "production",
      LOG_LEVEL: "error",
    });
  });

  it("continues to reject absent production secrets", () => {
    expect(() => parseEnvironment({ NODE_ENV: "production" })).toThrow();
  });

  it("requires a strong Auth.js secret", () => {
    expect(() =>
      parseEnvironment({ ...validEnvironment, AUTH_SECRET: "short" }),
    ).toThrow();
  });
});
