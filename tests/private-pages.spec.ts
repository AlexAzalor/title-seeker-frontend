import { convertToSlug } from "@/lib/server-utils";
import { RatingCriterion } from "@/orval_api/model";
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

// Need to split test when private pages are filled with UI and data.
test("Should open user profile and navigate to other private links", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "CN" })).toBeVisible();

  await page.getByRole("button", { name: "CN" }).click();
  await page.getByRole("menuitem", { name: "Обліковий запис" }).click();
  await page.waitForURL("/user/profile");
  await expect(page.locator("#main-layout")).toContainText(
    "Top 8 most popular movie genres",
  );

  await page.getByRole("link", { name: "Dashboard" }).click();
  await expect(page.locator("h1")).toContainText("Dashboard");

  await page.getByRole("link", { name: "My lists" }).click();
  await page.waitForURL("/user/my-lists**");

  await expect(
    page.locator("#main-layout").getByRole("button").filter({ hasText: /^$/ }),
  ).toBeVisible();

  await page.getByRole("link", { name: "New Movies to add" }).click();
  await expect(
    page
      .getByRole("heading", { name: "No quick movies to add" })
      .or(page.getByRole("heading", { name: "New Movies to add" })),
  ).toBeVisible();

  await page.getByRole("link", { name: "Users list" }).click();
  await expect(page.locator("h1")).toContainText("All Users");
  await page.getByRole("link", { name: "Settings" }).click();
  await expect(page.locator("h1")).toContainText("Settings");

  await page.getByRole("button", { name: "CN" }).click();
  await page.getByRole("menuitem", { name: "Вийти" }).click();
  await page.waitForURL("/");
  await expect(page.getByRole("button", { name: "CN" })).not.toBeVisible();
});

test("Test movie basic Form: add new Movie with basic fields (The Shawshank Redemption)", async ({
  page,
}) => {
  const movieTitleEn = "The Shawshank Redemption";
  const movieTitleUk = "Втеча з Шоушенка";
  const movieTitleKey = convertToSlug(movieTitleEn);
  await page.goto("/");
  await page.getByRole("button", { name: "Add Movie", exact: true }).click();

  // Title/Rate
  await page.locator('input[name="title_en"]').click();
  await page.locator('input[name="title_en"]').fill(movieTitleEn);
  // Movie key
  await expect(page.locator('input[name="key"]')).toHaveValue(movieTitleKey);

  await page.locator('input[name="title_uk"]').click();
  await page.locator('input[name="title_uk"]').fill(movieTitleUk);
  await page.getByRole("button", { name: "Choose File" }).click();
  await page
    .getByRole("button", { name: "Choose File" })
    .setInputFiles("public/logo.jpg");
  await page
    .locator("div:nth-child(3) > div:nth-child(2) > span > .bg-custom-gradient")
    .click();
  await page
    .locator("div:nth-child(4) > div:nth-child(2) > span > .bg-custom-gradient")
    .click();
  await page
    .locator("div:nth-child(5) > div:nth-child(2) > span > .bg-custom-gradient")
    .click();
  await page
    .locator("div:nth-child(6) > div:nth-child(2) > span > .bg-custom-gradient")
    .click();
  await page
    .locator("div:nth-child(7) > div:nth-child(2) > span > .bg-custom-gradient")
    .click();
  await page.getByRole("button", { name: "Save rating" }).click();
  await page.getByRole("button", { name: "Next step" }).click();

  // Shared Universe
  await page.getByRole("button", { name: "Skip" }).click();
  // Related Movie
  await page.getByRole("button", { name: "Skip" }).click();

  // Info
  await page.locator('textarea[name="description_en"]').click();
  await page
    .locator('textarea[name="description_en"]')
    .fill("Some description in English");
  await page.locator('textarea[name="description_uk"]').click();
  await page
    .locator('textarea[name="description_uk"]')
    .fill("Some description in Ukrainian");
  await page.locator('input[name="release_date"]').fill("1994-10-14");
  await page.locator('input[name="location_en"]').click();
  await page.locator('input[name="location_en"]').fill("US");
  await page.locator('input[name="location_uk"]').click();
  await page.locator('input[name="location_uk"]').fill("США");
  await page.locator('input[name="duration"]').click();
  await page.locator('input[name="duration"]').fill("142");
  await page.locator('input[name="budget"]').click();
  await page.locator('input[name="budget"]').fill("25000000");
  await page.locator('input[name="domestic_gross"]').click();
  await page.locator('input[name="domestic_gross"]').fill("28767189");
  await page.locator('input[name="worldwide_gross"]').click();
  await page.locator('input[name="worldwide_gross"]').fill("29332133");
  await page.getByRole("button", { name: "Next step" }).click();

  // People
  await page.getByText("Select Actor").click();
  await page.getByRole("option", { name: "Морган Фрімен" }).click();
  await page.getByText("Characters").click();
  await page.getByRole("option", { name: "Елліс Бойд «Ред» Реддінг" }).click();
  await page.getByText("Select Actor").click();
  await page.getByRole("option", { name: "Тім Робінс" }).click();
  await page.getByText("Characters").click();
  await page.getByRole("option", { name: "Енді Дюфрейн" }).click();
  await page.getByText("Select Director").click();
  await page.getByRole("option", { name: "Френк Дарабонт" }).click();
  await page.getByRole("button", { name: "Next step" }).click();

  // Genres
  await page
    .getByRole("combobox")
    .filter({ hasText: /^Genres$/ })
    .click();
  await page.getByRole("option", { name: "Комедія" }).click();
  await page.getByRole("option", { name: "Драма" }).click();
  await page
    .getByRole("combobox")
    .filter({ hasText: /^Genres$/ })
    .click();
  await page.locator("div").filter({ hasText: /^X$/ }).first().click();
  await page.locator("div").filter({ hasText: /^X$/ }).nth(1).click();
  await page.getByRole("button", { name: "Next step" }).click();

  // Filters
  await page.getByText("Add new Specification").click();
  await page.getByRole("option", { name: "В'язниця" }).click();
  await page.getByRole("option", { name: "Розмовне" }).click();
  await page.getByText("Add new Specification").click();
  await page.getByText("Add new Keyword").click();
  await page
    .getByRole("option", { name: "Дружба/Хімія між персонажами" })
    .click();
  await page.getByText("Add new Keyword").click();
  await page.getByText("Add new Action Time").click();
  await page.getByRole("option", { name: "20 століття" }).click();
  await page.getByText("Add new Action Time").click();
  await page.locator("div").filter({ hasText: /^X$/ }).first().click();
  await page.locator("div").filter({ hasText: /^X$/ }).nth(1).click();
  await page.locator("div").filter({ hasText: /^X$/ }).nth(2).click();
  await page.locator("div").filter({ hasText: /^X$/ }).nth(3).click();
  await page.getByRole("button", { name: "Next step" }).click();

  // Summary
  await expect(page.locator("#main-layout")).toContainText("Summary");
  await expect(page.locator("#main-layout")).toContainText(movieTitleEn);
  await expect(page.locator("#main-layout")).toContainText(movieTitleUk);
  await expect(page.locator("#main-layout")).toContainText(movieTitleKey);
  await expect(page.locator("#main-layout")).toContainText("Submit");
});

test("Test movie full Form: add new Movie with all fields (The lord of the ring - two towers)", async ({
  page,
}) => {
  const movieTitleEn = "The Lord of the Rings: The Two Towers";
  const movieTitleUk = "Володар перснів: Дві вежі";
  const movieTitleKey = convertToSlug(movieTitleEn);

  await page.goto("/");
  await page.getByRole("banner").getByRole("combobox").click();
  await page.getByRole("option", { name: "English" }).click();
  await page.getByRole("button", { name: "Add Movie", exact: true }).click();

  // Title/Rate
  await page.locator('input[name="title_en"]').click();
  await page.locator('input[name="title_en"]').fill(movieTitleEn);
  // Movie key
  await expect(page.locator('input[name="key"]')).toHaveValue(movieTitleKey);

  await page.locator('input[name="title_uk"]').click();
  await page.locator('input[name="title_uk"]').fill(movieTitleUk);
  await page.getByRole("button", { name: "Choose File" }).click();
  await page
    .getByRole("button", { name: "Choose File" })
    .setInputFiles("public/logo.jpg");
  await page.getByRole("combobox", { name: "Rating Type" }).click();
  await page.getByRole("option", { name: "Visual Effects" }).click();
  await page.locator(".bg-custom-gradient").first().click();
  await page
    .locator("div:nth-child(3) > div:nth-child(2) > span > .bg-custom-gradient")
    .click();
  await page
    .locator("div:nth-child(4) > div:nth-child(2) > span > .bg-custom-gradient")
    .click();
  await page
    .locator("div:nth-child(5) > div:nth-child(2) > span > .bg-custom-gradient")
    .click();
  await page
    .locator("div:nth-child(6) > div:nth-child(2) > span > .bg-custom-gradient")
    .click();
  await page
    .locator("div:nth-child(7) > div:nth-child(2) > span > .bg-custom-gradient")
    .click();
  await page
    .locator("div:nth-child(8) > div:nth-child(2) > span > .bg-custom-gradient")
    .click();
  await page.getByRole("button", { name: "Save rating" }).click();
  await page.getByRole("button", { name: "Next step" }).click();

  // Shared Universe
  await page
    .getByRole("combobox")
    .filter({ hasText: "Shared Universe" })
    .click();
  await page.getByRole("option", { name: "Middle-earth" }).click();
  await page.getByPlaceholder(" ", { exact: true }).click();
  await page.getByPlaceholder(" ", { exact: true }).fill("5");
  await page.getByRole("button", { name: "Next step" }).click();

  // Related Movie
  await page.getByText("Base movie").click();
  await page.getByPlaceholder("Search items...").click();
  await page.getByPlaceholder("Search items...").fill("the lord");
  await page
    .getByRole("option", {
      name: "The Lord of the Rings: The Fellowship of the Ring",
    })
    .click();
  await page.getByPlaceholder(" ", { exact: true }).click();
  await page.getByPlaceholder(" ", { exact: true }).fill("2");
  await page.getByRole("combobox", { name: "Rating Type" }).click();
  await page.getByRole("option", { name: "Sequel" }).click();
  await page.getByRole("button", { name: "Next step" }).click();

  // Info
  await page.locator('textarea[name="description_en"]').click();
  await page
    .locator('textarea[name="description_en"]')
    .fill("gfdg fd gfd gfd gd gd fg");
  await page.locator('textarea[name="description_uk"]').click();
  await page
    .locator('textarea[name="description_uk"]')
    .fill("gfd g gfd g dg dgfd gfgfd");
  await page.locator('input[name="release_date"]').fill("2002-12-18");
  await page.locator('input[name="location_en"]').click();
  await page.locator('input[name="location_en"]').fill("gfdgdfgfg");
  await page.locator('input[name="location_uk"]').click();
  await page.locator('input[name="location_uk"]').fill("gdfgdfgfd");
  await page.locator('input[name="duration"]').click();
  await page.locator('input[name="duration"]').fill("545");
  await page.locator('input[name="budget"]').click();
  await page.locator('input[name="budget"]').fill("6546546");
  await page.locator('input[name="domestic_gross"]').click();
  await page.locator('input[name="domestic_gross"]').fill("05465");
  await page.locator('input[name="worldwide_gross"]').click();
  await page.locator('input[name="worldwide_gross"]').fill("0546546");
  await page.getByRole("button", { name: "Next step" }).click();

  // People
  await page.getByText("Select Actor").click();
  await page.getByRole("option", { name: "Elijah Wood" }).click();
  await page.getByText("Characters").click();
  await page.getByRole("option", { name: "Frodo" }).click();
  await page.getByText("Select Actor").click();
  await page.getByRole("option", { name: "Ian McKellen" }).click();
  await page.getByText("Characters").click();
  await page.getByRole("option", { name: "Gandalf" }).click();
  await page.getByText("Select Actor").click();
  await page.getByRole("option", { name: "Hugo Weaving" }).click();
  await page.getByText("Characters").click();
  await page.getByRole("option", { name: "Elrond" }).click();
  await page.getByText("Select Director").click();
  await page.getByRole("option", { name: "Peter Jackson" }).click();
  await page.getByRole("button", { name: "Next step" }).click();

  // Genres
  await page
    .getByRole("combobox")
    .filter({ hasText: /^Genres$/ })
    .click();
  await page.getByRole("option", { name: "Fantasy" }).click();
  await page.getByRole("option", { name: "Adventure" }).click();
  await page
    .getByRole("combobox")
    .filter({ hasText: /^Genres$/ })
    .click();
  await page.getByRole("combobox").filter({ hasText: "Subgenres" }).click();
  await page.getByRole("option", { name: "Sword & Sorcery" }).click();
  await page.getByRole("option", { name: "Quest" }).click();
  await page.getByRole("combobox").filter({ hasText: "Subgenres" }).click();
  await page.locator("div").filter({ hasText: /^X$/ }).first().click();
  await page.locator("div").filter({ hasText: /^X$/ }).nth(1).click();
  await page.locator("div").filter({ hasText: /^X$/ }).nth(2).click();
  await page.locator("div").filter({ hasText: /^X$/ }).nth(3).click();
  await page.getByRole("button", { name: "Next step" }).click();

  // Filters
  await page.getByText("Add new Specification").click();
  await page.getByRole("option", { name: "Powerful villain" }).click();
  await page.getByRole("option", { name: "Epic" }).click();
  await page.getByText("Add new Specification").click();
  await page.getByText("Add new Keyword").click();
  await page.getByRole("option", { name: "Breathtaking music" }).click();
  await page.getByRole("option", { name: "Powerful music" }).click();
  await page
    .getByRole("option", { name: "Friendship/Character Chemistry" })
    .click();
  await page.getByText("Add new Keyword").click();
  await page.getByText("Add new Action Time").click();
  await page.getByRole("option", { name: "Fantasy Middle Ages" }).click();
  await page.getByText("Add new Action Time").click();
  await page.locator("div:nth-child(3) > div:nth-child(2)").first().click();
  await page.locator("div:nth-child(4) > div:nth-child(2)").first().click();
  await page
    .locator("div:nth-child(2) > div:nth-child(3) > div:nth-child(2)")
    .click();
  await page
    .locator("div:nth-child(2) > div:nth-child(4) > div:nth-child(2)")
    .click();
  await page.locator("div:nth-child(5) > div:nth-child(2)").click();
  await page.locator("div:nth-child(3) > .grid > div:nth-child(2)").click();
  await page.getByRole("button", { name: "Next step" }).click();

  // Summary
  await expect(page.locator("#main-layout")).toContainText("Summary");
  await expect(page.locator("#main-layout")).toContainText(movieTitleEn);
  await expect(page.locator("#main-layout")).toContainText(movieTitleUk);
  await expect(page.locator("#main-layout")).toContainText(movieTitleKey);
  await expect(page.locator("#main-layout")).toContainText(
    RatingCriterion.visual_effects,
  );
  await expect(page.locator("#main-layout")).toContainText("Submit");
});

test("Test Quick add new Movie", async ({ page }) => {
  const newMovieTitle = "New Movie";
  const newMovieKey = convertToSlug(newMovieTitle);
  await page.goto("/");
  await page.getByRole("button", { name: "Quickly add Movie" }).click();
  await page.locator('input[name="title_en"]').click();
  await page.locator('input[name="title_en"]').fill(newMovieTitle);
  await expect(page.locator('input[name="key"]')).toHaveValue(newMovieKey);
  await page.getByRole("combobox", { name: "Rating Type" }).click();
  await page.getByRole("option", { name: "Scary Factor" }).click();

  await page.locator(".bg-custom-gradient").first().click();
  await page
    .locator("div:nth-child(3) > div:nth-child(2) > span > .bg-custom-gradient")
    .click();
  await page
    .locator("div:nth-child(4) > div:nth-child(2) > span > .bg-custom-gradient")
    .click();
  await page
    .locator("div:nth-child(5) > div:nth-child(2) > span > .bg-custom-gradient")
    .click();
  await page
    .locator("div:nth-child(6) > div:nth-child(2) > span > .bg-custom-gradient")
    .click();
  await page
    .locator("div:nth-child(7) > div:nth-child(2) > span > .bg-custom-gradient")
    .click();
  await page
    .locator("div:nth-child(8) > div:nth-child(2) > span > .bg-custom-gradient")
    .click();
  await page.getByRole("button", { name: "Save rating" }).click();
  await expect(page.locator("form")).toContainText("Submit");
});

test("Should logout", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "CN" })).toBeVisible();

  await page.getByRole("button", { name: "CN" }).click();
  await page.getByRole("menuitem", { name: "Обліковий запис" }).click();
  await page.waitForURL("/user/profile");

  await page.getByRole("button", { name: "CN" }).click();
  await page.getByRole("menuitem", { name: "Вийти" }).click();
  await page.waitForURL("/");
  await expect(page.getByRole("button", { name: "CN" })).not.toBeVisible();
});
