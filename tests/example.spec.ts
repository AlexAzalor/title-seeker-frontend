import { PageMoviePreviewOut } from "@/orval_api/model";
import { test, expect } from "@playwright/test";
// import dotenv from "dotenv";

// dotenv.config({ path: ".env.test" });

// PAGE - https://playwright.dev/docs/api/class-page

test("should open home page", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await expect(page).toHaveTitle(/Title Seeker/);
});

// test("should find text", async ({ page }) => {
//   await page.goto("http://localhost:3000/");
//   await expect(
//     page.getByText(
//       "Гнучкість, швидкість і простота дозволить в любий момент і місці мати можливість знайти бажаний тайтл!",
//     ),
//   ).toBeVisible();
// });

// test("should navigate to the about page", async ({ page }) => {
//   // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
//   await page.goto("http://localhost:3000/");
//   // Find an element with the text 'About' and click on it
//   // await page.click("text=Серіали");
//   // Click the get started link.
//   // await page.getByRole("link", { name: "Серіали" }).click();
//   await page.getByText("Супер пошук").click();
//   // The new URL should be "/about" (baseURL is used there)
//   await expect(page).toHaveURL("http://localhost:3000/super-search");
//   // The new page should contain an h1 with "About"
//   await expect(page.locator("h1")).toContainText("Advanced title search");
// });

// test.describe("specific viewport block", () => {
//   test.use({ viewport: { width: 2200, height: 1200 } });
//   test("authenticated view", async ({ page }) => {
//     const isTest = process.env.NEXTAUTH_ENV === "test";
//     console.log("Using test env:", isTest);

//     // await page.click("text=Sign in");
//     await page.goto("http://localhost:3000/");
//     await page
//       .getByRole("banner")
//       .getByRole("button", { name: "Google" })
//       .click();
//     await page.fill('input[name="username"]', "testuser");
//     await page.fill('input[name="password"]', "testpass");
//     await page.click("text=Sign in");

//     await page.goto("http://localhost:3000/user/dashboard");
//     await expect(page.locator("h1")).toContainText("Dashboard");
//   });

//   test("should use viewport", async ({ page }) => {
//     // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
//     // await page.setViewportSize({ width: 2200, height: 1200 });
//     await page.goto("http://localhost:3000/");
//     // Find an element with the text 'About' and click on it
//     // await page.click("text=Серіали");
//     // Click the get started link.
//     // await page.getByRole("link", { name: "Серіали" }).click();
//     page.getByRole("navigation").getByRole("link", { name: "Серіали" }).click();
//     // await page.getByText("Серіали").click();
//     // The new URL should be "/about" (baseURL is used there)
//     await expect(page).toHaveURL("http://localhost:3000/tvseries");
//     // The new page should contain an h1 with "About"
//     // await expect(page.locator("h1")).toContainText("Серіали");
//     await expect(page.getByRole("heading", { name: "Серіали" })).toBeVisible();
//   });
// });

// test("get all movies", async ({ request }) => {
//   expect(process.env.NEXT_PUBLIC_API_URL).toBeDefined();
//   const response = await request.get(
//     `${process.env.NEXT_PUBLIC_API_URL}/api/movies/?sort_by=id&sort_order=desc&lang=uk&page=1&size=50`,
//   );
//   // const response = await request.get("http://localhost:3000/api/movies");
//   expect(response.ok()).toBeTruthy();
//   const data: PageMoviePreviewOut = await response.json();
//   expect(data).toBeDefined();
//   expect(data).toHaveProperty("items");
//   expect(data.items.length).toBeGreaterThan(0);
//   // expect(data.movies[0]).toHaveProperty("title");
//   // expect(data.movies[0]).toHaveProperty("uuid");
// });
