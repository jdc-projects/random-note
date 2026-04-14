import { test, expect } from "@playwright/test";
import { selectOption } from "./helpers";

test.describe("Transposition", () => {
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
});
