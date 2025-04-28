import { test as base, expect } from "@playwright/test";

// Fixture
// https://playwright.dev/docs/test-fixtures
const test = base.extend({
  page: async ({ page }, handlePage) => {
    await page.goto("/");
    await page
      .getByRole("banner")
      .getByRole("button", { name: "Google" })
      .click();
    await page.fill('input[name="username"]', process.env.TEST_USER ?? "");
    await page.fill('input[name="password"]', process.env.TEST_PASSWORD ?? "");
    await page.click("text=Sign in");
    await handlePage(page);
  },
});

test("Should open Add Movie form", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("banner")
    .getByRole("button", { name: "Add Movie", exact: true })
    .click();
  await expect(page).toHaveURL("/add-movie");
  await expect(page.getByText("Title/Rate")).toBeVisible();
});

test("Should open Quickly add new Movie form", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("banner")
    .getByRole("button", { name: "Quickly add Movie", exact: true })
    .click();
  await expect(page).toHaveURL("/quick-add-movie");
  await expect(
    page.getByRole("heading", { name: "Quickly add new Movie" }),
  ).toBeVisible();
});

test("Should open Profile page", async ({ page }) => {
  await page.goto("/user/profile");
  await expect(page.getByText("Top 8 most popular movie")).toBeVisible();
  await expect(page.getByText("My Top 3 Movies")).toBeVisible();
  await expect(page.getByText("Latest movie ratings")).toBeVisible();
});

test("Should open Dashboard", async ({ page }) => {
  await page.goto("/user/dashboard");
  await expect(page.locator("h1")).toContainText("Dashboard");
});

test("Should open My list page", async ({ page }) => {
  await page.goto(
    "/user/my-lists?sort_by=rated_at&sort_order=desc&page=1&size=10",
  );
  await expect(
    page.getByRole("link", { name: "Movie poster" }).first(),
  ).toBeVisible();
});

test("Should open New Movies to add", async ({ page }) => {
  await page.goto("/user/new-movies-to-add");
  await expect(
    page
      .getByRole("heading", { name: "No quick movies to add" })
      .or(page.getByRole("heading", { name: "New Movies to add" })),
  ).toBeVisible();
});

test("Should open All user", async ({ page }) => {
  await page.goto("/user/all-users");
  await expect(page.getByRole("heading", { name: "All Users" })).toBeVisible();
});

test("Should open Settings", async ({ page }) => {
  await page.goto("/user/settings");
  await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
});
