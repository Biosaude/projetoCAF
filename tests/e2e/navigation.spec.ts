import { expect, test } from "@playwright/test";

test("redireciona visitante para o login", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Bem-vindo" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Entrar com Google/i }),
  ).toBeVisible();
});
