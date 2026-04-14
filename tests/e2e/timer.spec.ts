import { test, expect } from "@playwright/test";
import { selectOption } from "./helpers";

test.describe("Timer", () => {
  test("timer auto-advances note", async ({ page }) => {
    await page.addInitScript(() => {
      let i = 0;
      Math.random = () => {
        i++;
        return (i * 0.618033988749895) % 1;
      };
    });

    await page.goto("/");

    const TIMER_VALUES = [0, 1, 2, 3, 4, 5, 10, 20, 30, 60];
    const targetIndex = TIMER_VALUES.indexOf(5);
    const slider = page.getByRole("slider");
    await slider.click();
    await page.keyboard.press("Home");
    for (let i = 0; i < targetIndex; i++) {
      await page.keyboard.press("ArrowRight");
    }

    await page.getByRole("button", { name: /start/i }).click();

    const firstLabel = await page
      .getByRole("img", { name: /musical stave/i })
      .getAttribute("aria-label");

    await page.waitForTimeout(5500);

    const secondLabel = await page
      .getByRole("img", { name: /musical stave/i })
      .getAttribute("aria-label");

    expect(firstLabel).not.toBe(secondLabel);
  });
});
