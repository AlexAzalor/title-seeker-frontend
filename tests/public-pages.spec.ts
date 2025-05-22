import { test, expect } from "@playwright/test";

// PAGE - https://playwright.dev/docs/api/class-page

test("Should be visible main info and buttons on the Home page", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("Title Seeker");
  await expect(page.getByRole("main")).toContainText(
    "Гнучкість, швидкість і простота дозволить в любий момент і місці мати можливість знайти бажаний тайтл!",
  );

  // Header
  await expect(
    page.getByRole("link", { name: "Logo Title Seeker" }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation").getByRole("link", { name: "Фільми" }),
  ).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Шукати" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Супер пошук" })).toBeVisible();

  // Managing buttons
  await expect(page.getByRole("banner").getByRole("combobox")).toBeVisible();
  await expect(
    page.getByRole("banner").getByRole("button", { name: "select-theme" }),
  ).toBeVisible();
  await expect(
    page.getByRole("banner").getByRole("button", { name: "Google" }),
  ).toBeVisible();
});

test("Should switch language", async ({ page }) => {
  await page.goto("/");

  await page
    .getByRole("heading", {
      name: "Ця платформа створена для того щоб вирішити цю проблему!",
    })
    .click();
  await page.getByRole("banner").getByRole("combobox").click();
  await page.getByRole("option", { name: "English" }).click();
  await page
    .getByRole("heading", { name: "This platform was created to" })
    .click();
});

test("Should switch dark/light theme", async ({ page }) => {
  await page.goto("/");
  // check default theme
  await expect(page.locator("html")).toHaveClass(/light/);

  await page
    .getByRole("banner")
    .getByRole("button", { name: "select-theme" })
    .click();
  await page.getByRole("menuitem", { name: "Dark" }).click();

  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("Should open Google login", async ({ page }) => {
  await page.goto("/");
  // accounts.google.com
  await page
    .getByRole("banner")
    .getByRole("button", { name: "Google" })
    .click();
  await page.waitForURL("**/api/auth/signin**");
  const regex = /\/api\/auth\/signin(\?.*)?$/;
  await expect(page).toHaveURL(regex);
});

test("Should go to the Movie page", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("banner").getByRole("combobox").click();
  await page.getByRole("option", { name: "English" }).click();

  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Фільми" })
    .click();
  await page.waitForURL("/movies");
  await page.getByRole("link", { name: "Movie poster" }).first().click();
  await page.waitForURL("/movies/**");
  await expect(page.getByText("Acting")).toBeVisible();
});

test("Should find movie by Super Search: Втеча з Шоушенка", async ({
  page,
}) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Супер пошук" }).click();
  await expect(page.locator("h1")).toContainText("Розширений пошук тайтлів");

  await page.getByText("Жанри", { exact: true }).click();
  await page.getByRole("option", { name: "Драма" }).click();
  await expect(page.locator("#main-layout")).toContainText("Драма(10-100)");
  await page.getByRole("option", { name: "Кримінал" }).click();
  await expect(page.locator("#main-layout")).toContainText("Кримінал(10-100)");

  await page.getByText("Актори").click();
  await page.getByRole("option", { name: "Морган Фрімен" }).click();
  await page.getByText("Актори").click();
  await expect(page.locator("#main-layout")).toContainText("Морган Фрімен");
  await page.getByText("Актори").click();
  await page.getByRole("option", { name: "Тім Робінс" }).click();
  await page.getByText("Актори").click();
  await expect(page.locator("#main-layout")).toContainText("Тім Робінс");

  await page.getByText("Режисер").click();
  await page.getByRole("option", { name: "Френк Дарабонт" }).click();
  await expect(page.locator("#main-layout")).toContainText("Френк Дарабонт");
  await page.getByRole("link", { name: "Movie poster" }).click();

  await expect(page.locator("h1")).toContainText("Втеча з Шоушенка");
});

test("Should find movie by Search: The Dark Knight", async ({ page }) => {
  const movieTitle = "The Dark Knight";
  await page.goto("/");
  // Switch to language
  await page.getByRole("banner").getByRole("combobox").click();
  await page.getByRole("option", { name: "English" }).click();

  await page.getByRole("textbox", { name: "Search..." }).click();
  await page.getByPlaceholder("Type to search...").click();
  await page.getByPlaceholder("Type to search...").fill(movieTitle);
  await page
    .getByRole("link", { name: "Movie poster The Dark Knight" })
    .click();
  await expect(page.locator("h1")).toContainText(movieTitle);
});
