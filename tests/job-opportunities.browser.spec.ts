import { expect, test, type Page } from "@playwright/test";

const route = "/en/dashboard/job-opportunities";

async function expectNoHorizontalOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
}

test.beforeEach(async ({ page }) => {
  await page.goto(route);
  await expect(page.getByRole("article")).toHaveCount(8);
});

test("renders eight cards, skill overflow, and placeholder applications links", async ({ page }, testInfo) => {
  const frontend = page.getByRole("article", { name: "Senior Frontend Engineer", exact: true });
  await expect(page.getByRole("heading", { name: "Job opportunities", level: 2 })).toHaveCount(0);
  await expect(page.getByText("Manage your openings, keep hiring on track, and find your next teammate.")).toHaveCount(0);
  await expect(page.getByText(/Showing \d+ of \d+ opportunities/)).toHaveCount(0);
  await expect(frontend.getByRole("link", { name: "Show applications" })).toHaveAttribute("href", "/");
  await expect(frontend.getByText("Web Performance", { exact: true })).toHaveCount(0);
  const more = frontend.getByRole("button", { name: "Show 2 more skills" });
  const overflowBox = await more.boundingBox();
  const skillBox = await frontend.getByText("TypeScript", { exact: true }).locator("..").boundingBox();
  expect(overflowBox!.height).toBe(skillBox!.height);
  await expect(frontend.locator("footer").getByText("Posted", { exact: true })).toHaveClass("sr-only");
  await expect(frontend.locator("footer").getByText("Applications", { exact: true })).toHaveClass("sr-only");
  await more.focus();
  await expect(page.getByRole("tooltip")).toContainText("Web Performance");
  await expect(page.getByRole("tooltip")).toContainText("Design Systems");
  await page.keyboard.press("Escape");
  await expectNoHorizontalOverflow(page);
  await page.screenshot({ path: testInfo.outputPath("desktop-light.png"), fullPage: true, animations: "disabled" });
});

test("keeps filter chips inside controls and balances card spacing", async ({ page }, testInfo) => {
  const trigger = page.getByRole("button", { name: "Work location", exact: true });
  await trigger.click();
  await page.getByRole("menuitemcheckbox", { name: "Remote", exact: true }).click();
  await page.getByRole("menuitemcheckbox", { name: "Hybrid", exact: true }).click();
  await page.keyboard.press("Escape");
  const control = trigger.locator("..");
  const chip = control.getByRole("button", { name: "Remove Work location: Remote", exact: true });
  await expect(chip).toHaveText("Remote");
  await expect(control.getByText("Work location", { exact: true })).toHaveCount(0);
  await expect(control.getByText("2", { exact: true })).toHaveCount(0);
  await expect(page.locator("button button")).toHaveCount(0);
  const controlBox = await control.boundingBox();
  const chipBox = await chip.boundingBox();
  expect(chipBox!.y).toBeGreaterThan(controlBox!.y);
  expect(chipBox!.y + chipBox!.height).toBeLessThan(controlBox!.y + controlBox!.height);
  await trigger.press("ArrowDown");
  await expect(page.getByRole("menuitemcheckbox", { name: "Remote", exact: true })).toBeChecked();
  await page.keyboard.press("Escape");
  await chip.click();
  await expect(trigger).toBeFocused();
  await expect(control.getByRole("button", { name: "Remove Work location: Hybrid", exact: true })).toHaveText("Hybrid");
  const frontend = page.getByRole("article", { name: "Senior Frontend Engineer", exact: true });
  await page.getByRole("button", { name: "Clear filters", exact: true }).click();
  const titleBox = await frontend.getByRole("heading").boundingBox();
  const metadataBox = await frontend.locator("header > div").last().boundingBox();
  const skillsBox = await frontend.locator('[aria-label="Required skills"]').boundingBox();
  const footerBox = await frontend.locator("footer").boundingBox();
  expect(metadataBox!.x).toBe(titleBox!.x);
  expect(metadataBox!.y - (titleBox!.y + titleBox!.height)).toBeLessThanOrEqual(8);
  const beforeSkills = skillsBox!.y - (metadataBox!.y + metadataBox!.height);
  const afterSkills = footerBox!.y - (skillsBox!.y + skillsBox!.height);
  expect(Math.abs(beforeSkills - afterSkills)).toBeLessThanOrEqual(1);
  await page.setViewportSize({ width: 375, height: 812 });
  await trigger.click();
  await page.getByRole("menuitemcheckbox", { name: "Remote", exact: true }).click();
  await page.getByRole("menuitemcheckbox", { name: "Hybrid", exact: true }).click();
  await page.getByRole("menuitemcheckbox", { name: "On-site", exact: true }).click();
  await page.keyboard.press("Escape");
  await expectNoHorizontalOverflow(page);
  await page.screenshot({ path: testInfo.outputPath("mobile-selected-filters.png"), fullPage: true, animations: "disabled" });
});

test("searches roles and skills and offers an empty-results recovery", async ({ page }) => {
  const search = page.getByRole("searchbox", { name: "Search job opportunities" });
  await search.fill("  KUBERNETES  ");
  await expect(page.getByRole("article")).toHaveCount(1);
  await expect(page.getByRole("article", { name: "Platform Engineer", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Clear search", exact: true }).click();
  await expect(search).toBeFocused();
  await search.fill("Backend");
  await expect(page.getByRole("article")).toHaveCount(1);
  await search.fill("no-such-role-or-skill");
  await expect(page.getByRole("heading", { name: "No matching opportunities" })).toBeVisible();
  await page.getByRole("region", { name: "No matching opportunities" }).getByRole("button", { name: "Clear filters" }).click();
  await expect(page.getByRole("article")).toHaveCount(8);
});

test("supports multiple filter values, combines groups, and removes individual chips", async ({ page }) => {
  await page.getByRole("button", { name: "Work location", exact: true }).click();
  await page.getByRole("menuitemcheckbox", { name: "Remote", exact: true }).click();
  await expect(page.getByRole("menu")).toBeVisible();
  await page.getByRole("menuitemcheckbox", { name: "Hybrid", exact: true }).click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("article")).toHaveCount(6);
  await page.getByRole("button", { name: "Status", exact: true }).click();
  await page.getByRole("menuitemcheckbox", { name: "Active", exact: true }).click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("article")).toHaveCount(3);
  await page.getByRole("button", { name: "Remove Work location: Remote", exact: true }).click();
  await expect(page.getByRole("article")).toHaveCount(2);
  await expect(page.getByRole("button", { name: "Remove Work location: Hybrid", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Clear filters", exact: true }).click();
  await expect(page.getByRole("article")).toHaveCount(8);
});

test("requires confirmation, restores focus, enables paused jobs, and publishes drafts", async ({ page }) => {
  const frontend = page.getByRole("article", { name: "Senior Frontend Engineer", exact: true });
  const disable = frontend.getByRole("button", { name: "Disable opportunity", exact: true });
  await disable.click();
  let dialog = page.getByRole("alertdialog");
  await expect(dialog.getByRole("heading", { name: "Disable this opportunity?" })).toBeVisible();
  await expect(page.locator("article").filter({ hasText: "Senior Frontend Engineer" }).getByText("Active", { exact: true })).toBeVisible();
  await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(disable).toBeFocused();
  await disable.click();
  await dialog.getByRole("button", { name: "Disable opportunity", exact: true }).click();
  await expect(frontend.getByText("Paused", { exact: true })).toBeVisible();
  const enable = frontend.getByRole("button", { name: "Enable opportunity", exact: true });
  await expect(enable).toBeFocused();
  await enable.click();
  await dialog.getByRole("button", { name: "Enable opportunity", exact: true }).click();
  await expect(frontend.getByText("Active", { exact: true })).toBeVisible();
  const platform = page.getByRole("article", { name: "Platform Engineer", exact: true });
  await platform.getByRole("button", { name: "Publish opportunity", exact: true }).click();
  dialog = page.getByRole("alertdialog");
  await expect(dialog.getByRole("heading", { name: "Publish this opportunity?" })).toBeVisible();
  await dialog.getByRole("button", { name: "Publish opportunity", exact: true }).click();
  await expect(platform.getByText("Active", { exact: true })).toBeVisible();
  await page.reload();
  await expect(platform.getByText("Draft", { exact: true })).toBeVisible();
});

test("restores focus to results when a status update removes the filtered card", async ({ page }) => {
  await page.getByRole("button", { name: "Status", exact: true }).click();
  await page.getByRole("menuitemcheckbox", { name: "Active", exact: true }).click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("article")).toHaveCount(4);
  const frontend = page.getByRole("article", { name: "Senior Frontend Engineer", exact: true });
  await frontend.getByRole("button", { name: "Disable opportunity", exact: true }).click();
  await page.getByRole("alertdialog").getByRole("button", { name: "Disable opportunity", exact: true }).click();
  await expect(page.getByRole("article")).toHaveCount(3);
  await expect(page.getByRole("region", { name: "Job opportunities", exact: true })).toBeFocused();
});

test("renders translated Arabic, mirrors footer alignment, and supports RTL filters", async ({ page }, testInfo) => {
  await page.goto("/ar/dashboard/job-opportunities");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { name: "فرص العمل", level: 2 })).toHaveCount(0);
  const frontend = page.getByRole("article", { name: "Senior Frontend Engineer", exact: true });
  await expect(frontend.getByText("دوام كامل", { exact: true })).toBeVisible();
  await expect(frontend.getByText("عن بُعد", { exact: true })).toBeVisible();
  const date = await frontend.locator("footer time").boundingBox();
  const applications = await frontend.locator('footer [aria-label="طلبات التوظيف"]').boundingBox();
  expect(date!.x).toBeGreaterThan(applications!.x);
  await page.getByRole("button", { name: "مكان العمل", exact: true }).click();
  await page.getByRole("menuitemcheckbox", { name: "عن بُعد", exact: true }).click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("article")).toHaveCount(3);
  await expect(page.getByRole("button", { name: "مسح الفلاتر", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "إزالة مكان العمل: عن بُعد", exact: true }).click();
  await expect(page.getByRole("article")).toHaveCount(8);
  await expectNoHorizontalOverflow(page);
  await page.screenshot({ path: testInfo.outputPath("desktop-arabic.png"), fullPage: true, animations: "disabled" });
});

test("fits small mobile screens in both languages and opens mobile navigation", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await expectNoHorizontalOverflow(page);
  await page.getByRole("button", { name: "Open navigation", exact: true }).click();
  await expect(page.getByRole("link", { name: "Job opportunities", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Close navigation", exact: true }).last().click();
  await expect(page.getByRole("link", { name: "Job opportunities", exact: true })).not.toBeInViewport();
  await page.screenshot({ path: testInfo.outputPath("mobile-light.png"), fullPage: true, animations: "disabled" });
  await page.goto("/ar/dashboard/job-opportunities");
  await expect(page.getByRole("article")).toHaveCount(8);
  await expectNoHorizontalOverflow(page);
  const card = page.getByRole("article").first();
  await card.getByRole("button", { name: "تعطيل فرصة العمل", exact: true }).click();
  const dialog = page.getByRole("alertdialog");
  const box = await dialog.boundingBox();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(375);
  await dialog.getByRole("button", { name: "إلغاء", exact: true }).click();
  await page.screenshot({ path: testInfo.outputPath("mobile-arabic.png"), fullPage: true, animations: "disabled" });
});

test("supports dark mode and has no client exceptions or missing translations", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && message.text().includes("Missing")) errors.push(message.text());
  });
  await page.reload();
  const paused = page.getByRole("article", { name: "Mobile Application Engineer", exact: true }).getByText("Paused", { exact: true });
  const lightStatusColor = await paused.evaluate((element) => getComputedStyle(element).color);
  await page.getByRole("button", { name: "Switch to dark theme", exact: true }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(paused).not.toHaveCSS("color", lightStatusColor);
  await expect(page.getByRole("article").first()).toHaveCSS("background-color", "rgb(16, 37, 34)");
  await page.screenshot({ path: testInfo.outputPath("desktop-dark.png"), fullPage: true, animations: "disabled" });
  await page.goto("/ar/dashboard/job-opportunities");
  await page.getByRole("article").first().getByRole("button", { name: "تعطيل فرصة العمل", exact: true }).click();
  await expect(page.getByRole("alertdialog")).toContainText("هل تريد تعطيل فرصة العمل؟");
  await page.getByRole("alertdialog").getByRole("button", { name: "إلغاء", exact: true }).click();
  expect(errors).toEqual([]);
});
