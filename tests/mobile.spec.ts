import { test, expect } from "@playwright/test";

test.describe("Test Mobile view (385x851)", () => {
  test.use({ viewport: { width: 385, height: 851 } });

  test("Should open home page on mobile view", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("button", { name: "Toggle Sidebar" }),
    ).toBeVisible();
  });

  test.describe("Movie tournament on mobile", () => {
    test("keeps availability at the bottom until the end of settings", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 375, height: 700 });
      await page.goto("/movie-tournament");
      const panel = page.getByTestId("tournament-availability-panel");
      const end = page.getByTestId("tournament-availability-end");
      await expect(panel).toBeVisible();
      await page.evaluate(() => window.scrollTo(0, 0));
      await expect
        .poll(async () =>
          panel.evaluate((element) => {
            const bounds = element.getBoundingClientRect();
            return Math.abs(bounds.bottom - window.innerHeight);
          }),
        )
        .toBeLessThan(8);
      await expect(panel).toHaveClass(/shadow-lg/);

      await end.evaluate((element) =>
        element.scrollIntoView({ block: "center" }),
      );
      await expect(panel).not.toHaveClass(/shadow-lg/);
      await expect
        .poll(async () => {
          const [panelBox, endBox] = await Promise.all([
            panel.boundingBox(),
            end.boundingBox(),
          ]);
          return Math.abs(
            (panelBox?.y ?? 0) + (panelBox?.height ?? 0) - (endBox?.y ?? 0),
          );
        })
        .toBeLessThan(2);
      await expect(
        panel.getByRole("button", { name: /start tournament|почати турнір/i }),
      ).toBeVisible();
      await expect(
        panel.getByRole("button", {
          name: /reset settings|скинути налаштування/i,
        }),
      ).toBeVisible();
    });

    for (const width of [320, 375, 414]) {
      test(`fits and navigates at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        await page.addInitScript(() => localStorage.setItem("theme", "dark"));
        await page.goto("/");

        const tournamentLink = page.locator(
          'header a[href="/movie-tournament"]',
        );
        await expect(tournamentLink).toBeVisible();
        await tournamentLink.click();
        await expect(page).toHaveURL(/\/movie-tournament$/);

        const main = page.locator("main");
        await expect(main.getByRole("heading", { level: 1 })).toBeVisible();
        const size32 = main.getByRole("button", { name: /32/ });
        await size32.click();
        await expect(size32).toHaveAttribute("aria-pressed", "true");
        await expect(
          main.getByRole("button", { name: /start tournament|почати турнір/i }),
        ).toBeVisible();

        for (const selector of [
          "header[aria-label='project-header']",
          "main",
        ]) {
          const dimensions = await page
            .locator(selector)
            .evaluate((element) => {
              const rect = element.getBoundingClientRect();
              return {
                left: rect.left,
                right: rect.right,
                scrollWidth: element.scrollWidth,
                clientWidth: element.clientWidth,
              };
            });
          expect(dimensions.left).toBeGreaterThanOrEqual(0);
          expect(dimensions.right).toBeLessThanOrEqual(width);
          expect(dimensions.scrollWidth).toBeLessThanOrEqual(
            dimensions.clientWidth,
          );
        }
      });
    }
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
    await page.getByRole("button", { name: "Фільтри" }).click();
    await expect(page.getByRole("heading", { name: "Фільтри" })).toBeVisible();
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
