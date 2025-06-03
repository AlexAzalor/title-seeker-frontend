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
  await page.getByRole("menuitem", { name: "Profile", exact: true }).click();
  await page.waitForURL("/user/profile");

  await expect(page.getByLabel("genre-radar-chart")).toContainText(
    "Top 8 most popular movie genres",
  );
  await page.getByRole("link", { name: "Dashboard" }).nth(1).click();
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  await page.getByRole("link", { name: "My lists" }).nth(1).click();
  await expect(page.locator("h1")).toContainText("All my rated movies");
  await page
    .getByLabel("admin-sidebar-nav")
    .getByRole("link", { name: "New Movies to add" })
    .click();
  await expect(
    page
      .getByRole("heading", { name: "No movies to add" })
      .or(page.getByRole("heading", { name: "New Movies to add" })),
  ).toBeVisible();
  await page
    .getByLabel("admin-sidebar-nav")
    .getByRole("link", { name: "All users" })
    .click();
  await expect(page.locator("h1")).toContainText("All Users");
  await page
    .getByLabel("admin-sidebar-nav")
    .getByRole("link", { name: "Title Visual Profile" })
    .click();
  await expect(page.locator("h1")).toContainText("Visual Profile");
  await page.getByRole("link", { name: "Settings" }).nth(1).click();
  await expect(page.getByLabel("settings")).toContainText("Settings");
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

  await expect(page.getByText("Value is required")).not.toBeVisible();

  // Visual Profile
  await expect(page.getByRole("heading")).toContainText("Visual Profile");
  await page.locator("#rating-criteria").click();
  await page.getByRole("option", { name: "Simple action" }).click();
  await page.locator(".mb-5 > div > div:nth-child(2)").first().click();
  await page.locator(".mb-5 > div:nth-child(2) > div:nth-child(2)").click();
  await page.locator("div:nth-child(3) > div:nth-child(2)").click();
  await page
    .locator("div:nth-child(4) > div:nth-child(4) > div:nth-child(2)")
    .click();
  await page.locator("div:nth-child(5) > div:nth-child(2)").click();
  await page.locator("div:nth-child(6) > div:nth-child(2)").click();
  await page.getByRole("button", { name: "Next step" }).click();

  await expect(page.getByText("Value is required")).not.toBeVisible();

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

  await expect(page.getByText("Value is required")).not.toBeVisible();

  // People
  await page.getByText("Select the actors").click();
  await page.getByRole("option", { name: "Morgan Freeman" }).click();
  await page.getByText("Characters").click();
  await page.getByRole("option", { name: 'Ellis Boyd "Red" Redding' }).click();
  await page.getByText("Select the actors").click();
  await page.getByRole("option", { name: "Tim Robbins" }).click();
  await page.getByText("Characters").click();
  await page.getByRole("option", { name: "Andy Dufresne" }).click();
  await page.getByText("Select the directors").click();
  await page.getByRole("option", { name: "Frank Darabont" }).click();
  await page.getByRole("button", { name: "Next step" }).click();

  await expect(page.getByText("Value is required")).not.toBeVisible();

  // Genres
  await page.getByText("Select Genres").click();
  await page.getByRole("option", { name: "Crime" }).click();
  await page.getByRole("option", { name: "Drama" }).click();
  await page.getByText("Select Genres").click();
  await page.locator(".mb-5 > div > div:nth-child(2)").first().click();
  await page.locator("div:nth-child(4) > div:nth-child(2)").click();
  await page.getByRole("button", { name: "Next step" }).click();

  await expect(page.getByText("Value is required")).not.toBeVisible();

  // Filters
  expect(page.getByRole("heading", { name: "Specifications" })).toBeVisible();
  await page.getByText("Select Specifications").click();
  await page.getByRole("option", { name: "Prison" }).click();
  await page.getByRole("option", { name: "Conversational" }).click();
  await page.getByText("Select Specifications").click();
  await page.getByText("Select Keywords").click();
  await page
    .getByRole("option", { name: "Friendship/Character Chemistry" })
    .click();
  await page.getByText("Select Keywords").click();
  await page.getByText("Select Action Times").click();
  await page.getByRole("option", { name: "20th century" }).click();
  await page.getByText("Select Action Times").click();
  await page.locator("div:nth-child(3) > div:nth-child(2)").first().click();
  await page.locator("div:nth-child(4) > div:nth-child(2)").click();
  await page.locator("div:nth-child(2) > .grid > div:nth-child(2)").click();
  await page.locator("div:nth-child(3) > .grid > div:nth-child(2)").click();
  await page.getByRole("button", { name: "Next step" }).click();

  // Check
  await expect(page.getByText("Value is required")).not.toBeVisible();

  // Summary
  await expect(page.getByRole("heading", { name: "Summary" })).toBeVisible();
  await expect(page.getByText(movieTitleEn)).toBeVisible();
  await expect(page.getByText(movieTitleUk)).toBeVisible();
  await expect(page.getByText(movieTitleKey)).toBeVisible();
  await expect(page.getByRole("button", { name: "Submit" })).toBeVisible();
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

  await expect(page.getByText("Value is required")).not.toBeVisible();

  // Visual Profile
  await expect(page.getByRole("heading")).toContainText("Visual Profile");
  await page.locator("#rating-criteria").click();
  await page.getByRole("option", { name: "Simple action" }).click();
  await page.locator(".mb-5 > div > div:nth-child(2)").first().click();
  await page.locator(".mb-5 > div:nth-child(2) > div:nth-child(2)").click();
  await page.locator("div:nth-child(3) > div:nth-child(2)").click();
  await page
    .locator("div:nth-child(4) > div:nth-child(4) > div:nth-child(2)")
    .click();
  await page.locator("div:nth-child(5) > div:nth-child(2)").click();
  await page.locator("div:nth-child(6) > div:nth-child(2)").click();
  await page.getByRole("button", { name: "Next step" }).click();

  await expect(page.getByText("Value is required")).not.toBeVisible();

  // Shared Universe
  await page.getByLabel("movie-form-wizard").getByRole("combobox").click();
  await page.getByRole("option", { name: "Middle-earth" }).click();
  await page.getByLabel("movie-form-wizard").getByText("Middle-earth").click();
  await page.getByPlaceholder(" ").click();
  await page.getByPlaceholder(" ").fill("5");
  await page.getByRole("button", { name: "Next step" }).click();

  await expect(page.getByText("Value is required")).not.toBeVisible();

  // Related Movie
  await page.getByText("Base movie").click();
  await page.getByLabel("", { exact: true }).click();
  await page.getByLabel("", { exact: true }).fill("the lord");
  await page
    .getByRole("option", {
      name: "The Lord of the Rings: The Fellowship of the Ring",
    })
    .click();
  await page.getByText("The Lord of the Ring", { exact: true }).click();
  await page.getByPlaceholder(" ").click();
  await page.getByPlaceholder(" ").fill("2");
  await page.getByRole("combobox", { name: "Relation type" }).click();
  await page.getByRole("option", { name: "Sequel" }).click();
  await page.getByRole("button", { name: "Next step" }).click();

  await expect(page.getByText("Value is required")).not.toBeVisible();

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

  await expect(page.getByText("Value is required")).not.toBeVisible();

  // People
  await page.getByText("Select the actors").click();
  await page.getByRole("option", { name: "Elijah Wood" }).click();
  await page.getByText("Characters").click();
  await page.getByRole("option", { name: "Frodo" }).click();
  await page.getByText("Select the actors").click();
  await page.getByRole("option", { name: "Ian McKellen" }).click();
  await page.getByText("Characters").click();
  await page.getByRole("option", { name: "Gandalf" }).click();
  await page.getByText("Select the actors").click();
  await page.getByRole("option", { name: "Hugo Weaving" }).click();
  await page.getByText("Characters").click();
  await page.getByRole("option", { name: "Elrond" }).click();
  await page.getByText("Select the directors").click();
  await page.getByRole("option", { name: "Peter Jackson" }).click();
  await page.getByRole("button", { name: "Next step" }).click();

  await expect(page.getByText("Value is required")).not.toBeVisible();

  // Genres
  await page.getByText("Select Genres").click();
  await page.getByRole("option", { name: "Adventure" }).click();
  await page.getByRole("option", { name: "Fantasy" }).click();
  await page.getByText("Select Genres").click();
  await page.getByText("Select Subgenres").click();
  await page.getByRole("option", { name: "Quest" }).click();
  await page.getByRole("option", { name: "Sword & Sorcery" }).click();
  await page.getByText("Select Subgenres").click();
  await page.locator(".mb-5 > div > div:nth-child(2)").first().click();
  await page.locator("div:nth-child(4) > div:nth-child(2)").first().click();
  await page
    .locator("form > div:nth-child(2) > div > div:nth-child(2)")
    .first()
    .click();
  await page
    .locator("div:nth-child(2) > div:nth-child(4) > div:nth-child(2)")
    .click();
  await page.getByRole("button", { name: "Next step" }).click();

  await expect(page.getByText("Value is required")).not.toBeVisible();

  // Filters
  await expect(
    page.getByRole("heading", { name: "Specifications" }),
  ).toBeVisible();
  await page.getByText("Select Specifications").click();
  await page.getByRole("option", { name: "Powerful villain" }).click();
  await page.getByRole("option", { name: "Epic" }).click();
  await page.getByText("Select Specifications").click();
  await page.getByText("Select Keywords").click();
  await page.getByRole("option", { name: "Breathtaking music" }).click();
  await page
    .getByRole("option", { name: "Friendship/Character Chemistry" })
    .click();
  await page.getByRole("option", { name: "Powerful music" }).click();
  await page.getByText("Select Keywords").click();
  await page.getByText("Select Action Times").click();
  await page.getByRole("option", { name: "Fantasy Middle Ages" }).click();
  await page.getByText("Select Action Times").click();
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

  await expect(page.getByText("Value is required")).not.toBeVisible();

  // Summary
  await expect(page.getByRole("heading", { name: "Summary" })).toBeVisible();
  await expect(page.getByText(movieTitleEn)).toBeVisible();
  await expect(page.getByText(movieTitleUk)).toBeVisible();
  await expect(page.getByText(movieTitleKey)).toBeVisible();
  await expect(page.getByText(RatingCriterion.visual_effects)).toBeVisible();
  await expect(page.getByRole("button", { name: "Submit" })).toBeVisible();
});

test("Test Quick add new Movie", async ({ page }) => {
  const newMovieTitle = "New Movie";
  const newMovieKey = convertToSlug(newMovieTitle);
  await page.goto("/");
  await page.getByRole("button", { name: "Quickly add Movie" }).click();
  await expect(
    page.getByRole("heading", { name: "Quickly add new Movie" }),
  ).toBeVisible();
  await page.locator('input[name="title_en"]').click();
  await page.locator('input[name="title_en"]').fill(newMovieTitle);
  await expect(page.locator('input[name="key"]')).toHaveValue(newMovieKey);
  await page.getByRole("combobox", { name: "Rating type" }).click();
  await page.getByRole("option", { name: "Scare Factor" }).click();
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
  await expect(page.getByRole("button", { name: "Submit" })).toBeVisible();
});

test("Should logout", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "CN" })).toBeVisible();

  await page.getByRole("button", { name: "CN" }).click();
  await page.getByRole("menuitem", { name: "Profile", exact: true }).click();
  await page.waitForURL("/user/profile");

  await page.getByRole("button", { name: "CN" }).click();
  await page.getByRole("menuitem", { name: "Log out" }).click();
  await page.waitForURL("/");
  await expect(page.getByRole("button", { name: "CN" })).not.toBeVisible();
});
