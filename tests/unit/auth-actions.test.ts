import { beforeEach, describe, expect, it, vi } from "vitest";

const auth = vi.hoisted(() => ({ signIn: vi.fn(), signOut: vi.fn() }));
const environment = vi.hoisted(() => ({ assertRuntimeEnvironment: vi.fn() }));
vi.mock("@/auth", () => auth);
vi.mock("@/config/env", () => environment);

import {
  loginWithGoogle,
  logout,
} from "@/features/authentication/services/auth.actions";

describe("ações de autenticação", () => {
  beforeEach(() => vi.clearAllMocks());

  it("inicia login exclusivamente pelo Google", async () => {
    await loginWithGoogle();
    expect(environment.assertRuntimeEnvironment).toHaveBeenCalledOnce();
    expect(auth.signIn).toHaveBeenCalledWith("google", {
      redirectTo: "/dashboard",
    });
  });

  it("encerra a sessão e retorna ao login", async () => {
    await logout();
    expect(environment.assertRuntimeEnvironment).toHaveBeenCalledOnce();
    expect(auth.signOut).toHaveBeenCalledWith({ redirectTo: "/login" });
  });
});
