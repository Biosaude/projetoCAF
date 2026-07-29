import { describe, expect, it } from "vitest";
import {
  hasRole,
  isAdministrator,
  canUserSignIn,
} from "@/features/authentication/services/rbac.service";

describe("RBAC", () => {
  it("restringe administração ao perfil Administrador", () => {
    expect(isAdministrator(["ADMIN"])).toBe(true);
    expect(isAdministrator(["MANAGER", "ANALYST"])).toBe(false);
    expect(isAdministrator(["VIEWER"])).toBe(false);
  });

  it("respeita a hierarquia básica de perfis", () => {
    expect(hasRole(["MANAGER"], "ANALYST")).toBe(true);
    expect(hasRole(["VIEWER"], "ANALYST")).toBe(false);
  });

  it.each([
    ["ACTIVE", true],
    ["INACTIVE", false],
    ["BLOCKED", false],
    ["PENDING", false],
  ] as const)("valida status %s para login", (status, expected) => {
    expect(canUserSignIn(status)).toBe(expected);
  });

  it("permite o perfil ainda ausente somente durante criação OAuth", () => {
    expect(canUserSignIn(undefined)).toBe(true);
  });
});
