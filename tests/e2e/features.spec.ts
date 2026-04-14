import { test, expect } from "@playwright/test";
import { selectOption } from "./helpers";

test.describe("Features", () => {
  test("sound toggle shows instrument dropdown", async ({ page }) => {
    await page.goto("/");

    const soundSwitch = page.getByRole("switch", { name: "Sound" });
    await soundSwitch.click();

    await expect(page.getByRole("combobox", { name: "Instrument" })).toBeVisible();

    await selectOption(page, "Instrument", "Trumpet / Cornet");

    await page.getByRole("button", { name: /start/i }).first().click();
    await expect(page.getByRole("img", { name: /musical stave/i })).toBeVisible();
  });

  test("8vb toggle renders and applies", async ({ page }) => {
    await page.goto("/");

    const octaveSwitch = page.getByRole("switch", { name: /8vb/i });
    await octaveSwitch.click();

    await page.getByRole("button", { name: /start/i }).first().click();
    await expect(page.getByRole("img", { name: /musical stave/i })).toBeVisible();

    await page.getByRole("button", { name: /reveal note/i }).first().click();
    await expect(page.getByText("Written:")).toBeVisible();
  });

  test("advanced settings expand and show chance inputs", async ({ page }) => {
    await page.goto("/");

    const accSwitch = page.getByRole("switch", { name: "Single Accidentals" });
    await accSwitch.click();

    await page.getByRole("button", { name: /advanced settings/i }).click();

    await expect(page.getByText("Single Accidental Chance (%)")).toBeVisible();
    await expect(page.getByText("Double Accidental Chance (%)")).toBeVisible();

    await page.getByRole("button", { name: /start/i }).first().click();
    await expect(page.getByRole("img", { name: /musical stave/i })).toBeVisible();
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
});
