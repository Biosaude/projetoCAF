import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/authentication/services/auth.actions", () => ({
  loginWithGoogle: vi.fn(),
}));
import { LoginCard } from "@/features/authentication/components/login-card";

describe("LoginCard", () => {
  it("oferece somente autenticação pelo Google", () => {
    render(<LoginCard />);
    expect(
      screen.getByRole("heading", { name: "Bem-vindo" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Entrar com Google/i }),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText(/senha/i)).not.toBeInTheDocument();
  });
});
