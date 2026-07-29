import { beforeEach, describe, expect, it, vi } from "vitest";

const auth = vi.hoisted(() => ({ signIn: vi.fn(), signOut: vi.fn() }));
vi.mock("@/auth", () => auth);

import {
  loginWithGoogle,
  logout,
} from "@/features/authentication/services/auth.actions";

describe("ações de autenticação", () => {
  beforeEach(() => vi.clearAllMocks());

  it("inicia login exclusivamente pelo Google", async () => {
    await loginWithGoogle();
    expect(auth.signIn).toHaveBeenCalledWith("google", {
      redirectTo: "/dashboard",
    });
  });

  it("encerra a sessão e retorna ao login", async () => {
    await logout();
    expect(auth.signOut).toHaveBeenCalledWith({ redirectTo: "/login" });
  });
});
