import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "@/components/ui/button";
describe("Button", () => {
  it("renderiza e processa interação", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Novo registro</Button>);
    await userEvent.click(
      screen.getByRole("button", { name: "Novo registro" }),
    );
    expect(onClick).toHaveBeenCalledOnce();
  });
});
