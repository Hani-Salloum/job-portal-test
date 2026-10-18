import { readFile } from "node:fs/promises";
import { expect, test, type Locator, type Page, type TestInfo } from "@playwright/test";
import { applicants } from "../src/lib/mock-data/applicants";

const applicantName = "Amara Okafor";
const profilePath = "/applicants/applicant-001";
const applicationQuery = "?application_id=application-001";
const route = `/en${profilePath}${applicationQuery}`;
const copy = {
  en: {
    direction: "ltr",
    skills: "Skills",
    work: "Work history",
    certificates: "Certificates",
    about: "About",
    salary: "Expected salary",
    missing: "Not provided",
    download: "Download CV",
  },
  ar: {
    direction: "rtl",
    skills: "المهارات",
    work: "الخبرات العملية",
    certificates: "الشهادات",
    about: "نبذة",
    salary: "الراتب المتوقع",
    missing: "غير متوفر",
    download: "تحميل السيرة الذاتية",
  },
} as const;

function summary(page: Page) {
  return page.getByRole("complementary", { name: applicantName, exact: true });
}

function salary(container: Locator, label: string) {
  return container.getByRole("term").filter({ hasText: label }).locator("xpath=following-sibling::dd[1]");
}

async function box(locator: Locator) {
  await expect(locator).toBeVisible();
  const bounds = await locator.boundingBox();
  expect(bounds).not.toBeNull();
  return bounds!;
}

async function expectNoHorizontalOverflow(page: Page) {
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
}

async function expectPhotoLoaded(page: Page) {
  const photo = summary(page).locator("img");
  await expect(photo).toBeVisible();
  await expect(photo).toHaveAttribute("src", /applicant-001\.jpg/);
  await expect.poll(() => photo.evaluate((element) => {
    const image = element as HTMLImageElement;
    return image.complete && image.naturalWidth > 0 && image.naturalHeight > 0;
  })).toBe(true);
  return photo;
}

async function attachScreenshot(page: Page, testInfo: TestInfo, name: string) {
  await expectPhotoLoaded(page);
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  await testInfo.attach(name, {
    body: await page.screenshot({ fullPage: true, animations: "disabled" }),
    contentType: "image/png",
  });
}

test.use({ colorScheme: "light", reducedMotion: "reduce" });

test("opens the applicant from an applications card and preserves its salary context", async ({ page }) => {
  await page.goto("/en/job-opportunities/job-001/applications");
  const card = page.getByRole("article", { name: applicantName, exact: true });
  await expect(salary(card, copy.en.salary)).toHaveText(/\$3,500\s*\/ month/);
  const link = page.getByRole("link", { name: applicantName, exact: true });
  await expect(link).toHaveAttribute("href", route);
  await link.click();
  await expect(page).toHaveURL(route);
  await expect(summary(page).getByRole("heading", { name: applicantName, level: 2, exact: true })).toBeVisible();
  await expect(salary(summary(page), copy.en.salary)).toHaveText(/\$3,500\s*\/ month/);
  await page.reload();
  await expect(salary(summary(page), copy.en.salary)).toHaveText(/\$3,500\s*\/ month/);
});

test("renders the accessible summary, about text, skills, work history, and certificates", async ({ page }) => {
  await page.goto(route);
  const profile = summary(page);
  await expect(profile).toHaveAttribute("aria-labelledby", "applicant-name");
  await expect(profile.getByRole("heading", { name: applicantName, level: 2, exact: true })).toHaveAttribute("id", "applicant-name");
  await expect(page.getByText(copy.en.about, { exact: true })).toBeVisible();
  await expect(page.getByText("I turn complex workflows into accessible interfaces with React and TypeScript. My recent work focused on shared component libraries and reducing page load times for customer dashboards.", { exact: true })).toBeVisible();

  const skills = page.getByRole("region", { name: copy.en.skills, exact: true });
  await expect(skills.getByRole("heading", { name: copy.en.skills, exact: true })).toBeVisible();
  for (const skill of ["React", "TypeScript", "Next.js", "Accessibility", "Design Systems", "Playwright"]) {
    await expect(skills.getByText(skill, { exact: true })).toBeVisible();
  }

  const work = page.getByRole("region", { name: copy.en.work, exact: true });
  await expect(work.getByRole("heading", { name: copy.en.work, exact: true })).toBeVisible();
  for (const text of ["Cedarwave Software", "Frontend Software Engineer", "Lumenfield Labs", "Senior Frontend Software Engineer"]) {
    await expect(work.getByText(text, { exact: true })).toBeVisible();
  }
  const applicant = applicants.find((candidate) => candidate.id === "applicant-001");
  expect(applicant).toBeDefined();
  for (const entry of applicant!.work_history) {
    await expect(work.getByText(entry.description, { exact: true })).toBeVisible();
  }

  const certificates = page.getByRole("region", { name: copy.en.certificates, exact: true });
  await expect(certificates.getByRole("heading", { name: copy.en.certificates, exact: true })).toBeVisible();
  for (const text of ["Web Accessibility", "W3C on edX", "Meta Front-End Developer Professional Certificate", "Coursera"]) {
    await expect(certificates.getByText(text, { exact: true })).toBeVisible();
  }
  await expectPhotoLoaded(page);
});

const rejectedContexts = [
  { name: "missing", query: "" },
  { name: "empty", query: "?application_id=" },
  { name: "unknown", query: "?application_id=application-does-not-exist" },
  { name: "mismatched applicant", query: "?application_id=application-002" },
  { name: "duplicate identical values", query: "?application_id=application-001&application_id=application-001" },
  { name: "valid then mismatched values", query: "?application_id=application-001&application_id=application-002" },
  { name: "mismatched then valid values", query: "?application_id=application-002&application_id=application-001" },
];

for (const locale of ["en", "ar"] as const) {
  const labels = copy[locale];

  for (const context of rejectedContexts) {
    test(`${locale}: does not select a salary for ${context.name} application context`, async ({ page }) => {
      await page.goto(`/${locale}${profilePath}${context.query}`);
      const profile = summary(page);
      await expect(profile.getByRole("heading", { name: applicantName, level: 2, exact: true })).toBeVisible();
      await expect(salary(profile, labels.salary)).toHaveText(labels.missing);
      await expect(profile.getByText(/3,500|4,000|٣٬٥٠٠|٤٬٠٠٠/)).toHaveCount(0);
    });
  }

  test(`${locale}: places the desktop summary and avatar on the correct physical sides`, async ({ page }, testInfo) => {
    await page.goto(`/${locale}${profilePath}${applicationQuery}`);
    await expect(page.locator("html")).toHaveAttribute("dir", labels.direction);
    const profile = summary(page);
    const profileBox = await box(profile);
    for (const name of [labels.skills, labels.work, labels.certificates]) {
      const region = page.getByRole("region", { name, exact: true });
      await expect(region.getByRole("heading", { name, exact: true })).toBeVisible();
      const regionBox = await box(region);
      if (locale === "en") {
        expect(profileBox.x).toBeGreaterThanOrEqual(regionBox.x + regionBox.width);
      } else {
        expect(profileBox.x + profileBox.width).toBeLessThanOrEqual(regionBox.x);
      }
    }

    const photoBox = await box(await expectPhotoLoaded(page));
    const emailBox = await box(profile.locator('a[href="mailto:amara.okafor@example.com"]'));
    const photoCenter = photoBox.x + photoBox.width / 2;
    const emailCenter = emailBox.x + emailBox.width / 2;
    if (locale === "en") {
      expect(photoCenter).toBeLessThan(emailCenter);
    } else {
      expect(photoCenter).toBeGreaterThan(emailCenter);
    }
    await expectNoHorizontalOverflow(page);
    await attachScreenshot(page, testInfo, locale === "en" ? "desktop-light" : "desktop-arabic");
  });

  test(`${locale}: keeps the desktop summary sticky with bounded internal scrolling`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 600 });
    await page.goto(`/${locale}${profilePath}${applicationQuery}`);
    const profile = summary(page);
    await expect(profile).toHaveCSS("position", "sticky");
    await expect(profile).toHaveCSS("top", "120px");
    await expect(profile).toHaveCSS("overflow-y", "auto");
    const maxHeight = await profile.evaluate((element) => Number.parseFloat(getComputedStyle(element).maxHeight));
    expect(Number.isFinite(maxHeight)).toBe(true);
    expect(maxHeight).toBeGreaterThan(0);
    expect(maxHeight).toBeLessThanOrEqual(480);
    const profileBox = await box(profile);
    expect(profileBox.height).toBeLessThanOrEqual(481);
    const scroll = await profile.evaluate((element) => {
      element.scrollTop = element.scrollHeight;
      return { top: element.scrollTop, available: element.scrollHeight - element.clientHeight };
    });
    if (scroll.available > 0) expect(scroll.top).toBeGreaterThan(0);
    await expectNoHorizontalOverflow(page);
  });

  for (const width of [375, 320]) {
    test(`${locale}: stacks the static profile and sections without overflow at ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 812 });
      await page.goto(`/${locale}${profilePath}${applicationQuery}`);
      const profile = summary(page);
      await expect(profile).toHaveCSS("position", "static");
      const sections = [
        profile,
        page.getByRole("region", { name: labels.skills, exact: true }),
        page.getByRole("region", { name: labels.work, exact: true }),
        page.getByRole("region", { name: labels.certificates, exact: true }),
      ];
      const bounds = await Promise.all(sections.map(box));
      for (let index = 1; index < bounds.length; index++) {
        expect(bounds[index].y).toBeGreaterThanOrEqual(bounds[index - 1].y + bounds[index - 1].height - 1);
      }
      for (const sectionBox of bounds) {
        expect(sectionBox.x).toBeGreaterThanOrEqual(0);
        expect(sectionBox.x + sectionBox.width).toBeLessThanOrEqual(width);
      }
      await expectNoHorizontalOverflow(page);
      const initialTop = (await box(profile)).y;
      await sections[3].getByRole("heading", { name: labels.certificates, exact: true }).scrollIntoViewIfNeeded();
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
      expect((await box(profile)).y).toBeLessThan(initialTop);
      await expectNoHorizontalOverflow(page);
      await page.evaluate(() => window.scrollTo(0, 0));
      await attachScreenshot(page, testInfo, `mobile-${locale}-${width}`);
    });
  }

  test(`${locale}: downloads the supplied CV as a real PDF`, async ({ page }) => {
    await page.goto(`/${locale}${profilePath}${applicationQuery}`);
    const link = summary(page).getByRole("link", { name: labels.download, exact: true });
    await expect(link).toHaveAttribute("href", "/cvs/applicant-001.pdf");
    await expect(link).toHaveAttribute("download", /.*/);
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      link.click(),
    ]);
    expect(await download.failure()).toBeNull();
    expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
    const downloadedPath = await download.path();
    expect(downloadedPath).not.toBeNull();
    const bytes = await readFile(downloadedPath!);
    expect(bytes.length).toBeGreaterThan(5);
    expect(bytes.subarray(0, 5).toString("ascii")).toBe("%PDF-");
    await expect(page).toHaveURL(`/${locale}${profilePath}${applicationQuery}`);
  });
}

test("provides usable contact links and safe, accessible social links", async ({ page }) => {
  await page.goto(route);
  const profile = summary(page);
  await expect(profile.locator('a[href="mailto:amara.okafor@example.com"]')).toHaveAttribute("href", "mailto:amara.okafor@example.com");
  await expect(profile.getByRole("link").filter({ hasText: "+1 202-555-0101" })).toHaveAttribute("href", "tel:+12025550101");
  for (const [platform, path] of [
    ["LinkedIn", "linkedin"],
    ["GitHub", "github"],
    ["Instagram", "instagram"],
    ["X", "x"],
  ]) {
    const link = profile.getByRole("link", { name: `Visit ${platform} profile (opens in a new tab)`, exact: true });
    await expect(link).toHaveAttribute("href", `https://example.com/${path}/amara-okafor`);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /(?:^|\s)noopener(?:\s|$)/);
    await expect(link).toHaveAttribute("rel", /(?:^|\s)noreferrer(?:\s|$)/);
  }
});

test("translates both themes without client errors or missing translations", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.goto(route);
  const profile = summary(page);
  await expect(profile).toBeVisible();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  const lightBackground = await profile.evaluate((element) => getComputedStyle(element).backgroundColor);
  await page.getByRole("button", { name: "Switch to dark theme", exact: true }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(profile).not.toHaveCSS("background-color", lightBackground);
  await expect(salary(profile, copy.en.salary)).toHaveText(/\$3,500\s*\/ month/);
  await attachScreenshot(page, testInfo, "desktop-dark");

  await page.goto(`/ar${profilePath}${applicationQuery}`);
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(page.getByText(copy.ar.about, { exact: true })).toBeVisible();
  await expect(summary(page).getByRole("link", { name: copy.ar.download, exact: true })).toBeVisible();
  for (const name of [copy.ar.skills, copy.ar.work, copy.ar.certificates]) {
    await expect(page.getByRole("region", { name, exact: true }).getByRole("heading", { name, exact: true })).toBeVisible();
  }
  await expect(salary(summary(page), copy.ar.salary)).not.toContainText(copy.ar.missing);
  await attachScreenshot(page, testInfo, "desktop-arabic-dark");
  await page.getByRole("button", { name: "التبديل إلى المظهر الفاتح", exact: true }).click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await expectNoHorizontalOverflow(page);
  await attachScreenshot(page, testInfo, "desktop-arabic-light");
  expect(errors).toEqual([]);
});

for (const locale of ["en", "ar"] as const) {
  test(`${locale}: returns HTTP 404 for an unknown applicant`, async ({ page }) => {
    const response = await page.goto(`/${locale}/applicants/applicant-does-not-exist${applicationQuery}`);
    expect(response).not.toBeNull();
    expect(response!.status()).toBe(404);
    await expect(summary(page)).toHaveCount(0);
    await expect(page.getByRole("link", { name: copy[locale].download, exact: true })).toHaveCount(0);
  });
}
