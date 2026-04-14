import { Page } from "@playwright/test";

export function selectOption(page: Page, label: string, option: string) {
  return page.getByRole("combobox", { name: label, exact: true }).click()
    .then(() => page.getByRole("option", { name: option, exact: true }).click());
}

export async function setTimerSlider(page: Page, seconds: number) {
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
