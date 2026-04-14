import { test, expect } from "@playwright/test";
import { selectOption, setTimerSlider } from "./helpers";

test.describe("Core flows", () => {
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
