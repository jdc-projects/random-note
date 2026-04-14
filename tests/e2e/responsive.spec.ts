import { test, expect } from "@playwright/test";

test.describe("Responsive", () => {
  test("responsive at mobile viewport", async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 375, height: 667 } });
    const page = await context.newPage();

    await page.goto("/");
    await expect(page.getByText("Random Note Generator")).toBeVisible();

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(400);

    await context.close();
  });
});
