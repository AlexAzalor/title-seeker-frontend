import { test, expect } from "@playwright/test";

test.describe("Test Mobile view (385x851)", () => {
  test.use({ viewport: { width: 385, height: 851 } });

  test("Should open home page on mobile view", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("button", { name: "Toggle Sidebar" }),
    ).toBeVisible();
  });

  test("Should open Sidebar", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Toggle Sidebar" }).click();
    await expect(page.getByRole("link", { name: "Фільми" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Серіали" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Аніме" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Ігри" })).toBeVisible();

    await expect(page.getByRole("button", { name: "Google" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "select-theme" }),
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
    await page.getByRole("button", { name: "Покращення пошуку" }).click();
    await expect(
      page.getByRole("heading", { name: "Покращення пошуку" }),
    ).toBeVisible();
  });

  test("Should open Movie page", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("button", { name: "Toggle Sidebar" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Toggle Sidebar" }).click();
    await page.getByRole("link", { name: "Фільми" }).click();
    await page.waitForURL("/movies");
    await page.getByRole("link", { name: "movie-link-0" }).click();
    await page.waitForURL("/movies/*");
    await expect(page.getByText("Жанри", { exact: true })).toBeVisible();
  });
});
