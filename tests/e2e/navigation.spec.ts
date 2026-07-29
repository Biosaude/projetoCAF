import { expect, test } from "@playwright/test";
test("abre o dashboard e navega para materiais", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  await page.getByRole("link", { name: "Materiais" }).click();
  await expect(page.getByRole("heading", { name: "Materiais" })).toBeVisible();
});
