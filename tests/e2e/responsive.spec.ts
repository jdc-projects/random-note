import { test, expect } from "@playwright/test";

test.describe("Responsive", () => {
  test("responsive at mobile viewport", async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 375, height: 667 } });
    const page = await context.newPage();

    await page.goto("/");
    await expect(page.getByText("Random Note Generator")).toBeVisible();
    const noTimerMark = page.getByText("No timer", { exact: true });
    await expect(noTimerMark).toBeVisible();

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(400);

    const noTimerBox = await noTimerMark.boundingBox();
    expect(noTimerBox).not.toBeNull();
    expect(noTimerBox!.x).toBeGreaterThanOrEqual(0);

    await context.close();
  });
});
