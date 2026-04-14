import { test, expect } from "@playwright/test";

function selectOption(page: import("@playwright/test").Page, label: string, option: string) {
  return page.getByRole("combobox", { name: label, exact: true }).click()
    .then(() => page.getByRole("option", { name: option, exact: true }).click());
}

async function setTimerSlider(page: import("@playwright/test").Page, seconds: number) {
  const TIMER_VALUES = [0, 1, 2, 3, 4, 5, 10, 20, 30, 60];
  const targetIndex = TIMER_VALUES.indexOf(seconds);
  if (targetIndex === -1) throw new Error(`Invalid timer value: ${seconds}`);

  const slider = page.getByRole("slider");
  await slider.click();
  await page.keyboard.press("Home");
  for (let i = 0; i < targetIndex; i++) {
    await page.keyboard.press("ArrowRight");
  }
}

test.describe("Random Note Generator", () => {
  test("happy path: configure, start, reveal, next", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("Random Note Generator")).toBeVisible();

    await selectOption(page, "Clef", "Bass");
    await selectOption(page, "Key Signature", "F major (1b)");

    const accSwitch = page.getByRole("switch", { name: "Single Accidentals" });
    await accSwitch.click();

    await setTimerSlider(page, 5);

    await page.getByRole("button", { name: /start/i }).click();

    await expect(page.getByRole("img", { name: /musical stave/i })).toBeVisible();

    await page.getByRole("button", { name: /reveal note/i }).first().click();
    await expect(page.getByText("Written:")).toBeVisible();

    await page.getByRole("button", { name: /next/i }).first().click();
    await expect(page.getByRole("img", { name: /musical stave/i })).toBeVisible();
  });

  test("settings persistence", async ({ page }) => {
    await page.goto("/");

    await selectOption(page, "Clef", "Alto");
    await selectOption(page, "Key Signature", "G major (1#)");

    await page.getByRole("button", { name: /start/i }).click();
    await expect(page.getByRole("img", { name: /musical stave/i })).toBeVisible();

    await page.getByRole("button", { name: /change settings/i }).first().click();

    await expect(page.getByText("Random Note Generator")).toBeVisible();
  });

  test("timer auto-advances note", async ({ page }) => {
    const randomValues: number[] = [];
    let callIndex = 0;
    await page.addInitScript(() => {
      const original = Math.random;
      let i = 0;
      Math.random = () => {
        i++;
        return (i * 0.618033988749895) % 1;
      };
    });

    await page.goto("/");

    await setTimerSlider(page, 5);

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

  test("responsive at mobile viewport", async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 375, height: 667 } });
    const page = await context.newPage();

    await page.goto("/");
    await expect(page.getByText("Random Note Generator")).toBeVisible();

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(400);

    await context.close();
  });

  test("clef rendering: each clef renders without error", async ({ page }) => {
    const clefs = ["Bass", "Alto", "Tenor", "Treble"];

    for (const clef of clefs) {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      await selectOption(page, "Clef", clef);

      await page.getByRole("button", { name: /start/i }).first().click();
      await expect(
        page.getByRole("img", { name: /musical stave/i }),
      ).toBeVisible({ timeout: 10000 });
    }
  });

  test("concert pitch shown for non-C transposition", async ({ page }) => {
    await page.goto("/");

    await selectOption(page, "Pitch (Transposition)", "Bb");

    await page.getByRole("button", { name: /start/i }).click();
    await page.getByRole("button", { name: /reveal note/i }).first().click();

    await expect(page.getByText("Concert:")).toBeVisible();
  });

  test("no concert pitch for C transposition", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: /start/i }).click();
    await page.getByRole("button", { name: /reveal note/i }).first().click();

    await expect(page.getByText("Written:")).toBeVisible();
    await expect(page.getByText("Concert:")).not.toBeVisible();
  });

  test("keyboard navigation", async ({ page }) => {
    await page.goto("/");

    const startButton = page.getByRole("button", { name: /start/i }).first();
    await startButton.focus();
    await expect(startButton).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(page.getByRole("img", { name: /musical stave/i })).toBeVisible();

    const nextButton = page.getByRole("button", { name: /next/i }).first();
    await nextButton.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("img", { name: /musical stave/i })).toBeVisible();
  });
});
