import { test, expect } from "@playwright/test";

test.describe("Persistence", () => {
  test("localStorage backward compatibility: partial config loads defaults", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        "random-note-config",
        JSON.stringify({ clef: "bass", keySignature: "G major" }),
      );
    });

    await page.goto("/");

    const clefSelect = page.getByRole("combobox", { name: "Clef", exact: true });
    await expect(clefSelect).toHaveValue("Bass");

    await page.getByRole("button", { name: /start/i }).first().click();
    await expect(page.getByRole("img", { name: /musical stave/i })).toBeVisible();
  });
});
