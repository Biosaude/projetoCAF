import { describe, expect, it } from "vitest";
import { authorizeRequest } from "@/features/authentication/config/auth.config";

describe("proteção de rotas", () => {
  it("bloqueia uma rota do portal sem autenticação", () => {
    expect(authorizeRequest(new URL("https://caf.test/dashboard"), false)).toBe(
      false,
    );
  });

  it("libera endpoints internos do Auth.js", () => {
    expect(
      authorizeRequest(
        new URL("https://caf.test/api/auth/callback/google"),
        false,
      ),
    ).toBe(true);
  });

  it("redireciona usuário autenticado para fora do login", () => {
    const response = authorizeRequest(new URL("https://caf.test/login"), true);
    expect(response).toBeInstanceOf(Response);
    expect((response as Response).headers.get("location")).toBe(
      "https://caf.test/dashboard",
    );
  });
});
