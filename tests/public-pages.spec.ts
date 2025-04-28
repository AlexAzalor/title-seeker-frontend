import { test, expect } from "@playwright/test";

// PAGE - https://playwright.dev/docs/api/class-page

test("Should open Home page", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Title Seeker/);
  await expect(
    page.getByText(
      "Гнучкість, швидкість і простота дозволить в любий момент і місці мати можливість знайти бажаний тайтл!",
    ),
  ).toBeVisible();
});

test("Should navigate to the Super Search page", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("banner")
    .getByRole("button", { name: "Супер пошук", exact: true })
    .click();
  await expect(page).toHaveURL(/super-search/);
  await expect(page.locator("h1")).toContainText("Advanced title search");
  await expect(
    page.getByRole("heading", {
      name: "Please select at least one filter to search for movies",
    }),
  ).toBeVisible();
});

test("Should open search modal", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("textbox", { name: "Шукати..." })).toBeVisible();
});

test("Should be Theme and Language selectors 2", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("banner").getByRole("button", { name: "Select theme" }),
  ).toBeVisible();
  // Language selector
  await expect(page.getByRole("banner").getByRole("combobox")).toBeVisible();
});

test("Should be Google login", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("banner").getByRole("button", { name: "Google" }),
  ).toBeVisible();
});

test("Should go to the Movie page", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Фільми" })
    .click();
  await expect(page).toHaveURL("/movies");
  await page.getByRole("link", { name: "Movie poster" }).first().click();
  await expect(page).toHaveURL(/movies/);
  expect(
    await page
      .getByRole("img", { name: "Movie poster" })
      .first()
      .getAttribute("alt"),
  ).toBe("Movie poster");
});
