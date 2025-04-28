import { test, expect } from "@playwright/test";

test.describe("Test Mobile view", () => {
  test.use({ viewport: { width: 385, height: 851 } });

  test("Should open home page on mobile view", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Title Seeker/);
  });

  test("Should open Sidebar", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Toggle Sidebar" }).click();
    await expect(page.getByRole("link", { name: "Фільми" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Серіали" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Аніме" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Ігри" })).toBeVisible();
  });

  test("Should be Google button", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Toggle Sidebar" }).click();
    await expect(page.getByRole("button", { name: "Google" })).toBeVisible();
  });

  test("Should be Theme and Language selectors", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Toggle Sidebar" }).click();
    await expect(
      page.getByRole("button", { name: "Select theme" }),
    ).toBeVisible();
    // Language selector
    await expect(page.getByRole("combobox")).toBeVisible();
  });

  test("Should be Filters sidebar in the Super Search", async ({ page }) => {
    await page.goto("/super-search");
    await page.getByRole("button", { name: "Filters" }).click();
    await expect(page.getByRole("heading", { name: "Filters" })).toBeVisible();
  });

  test("Should be Enhance Search sidebar in the Super Search", async ({
    page,
  }) => {
    await page.goto("/super-search");
    await page.getByRole("button", { name: "Enhance Search" }).click();
    await expect(
      page.getByRole("heading", { name: "Enhance Search" }),
    ).toBeVisible();
  });
});
