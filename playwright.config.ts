import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3100",
    trace: "retain-on-failure",
    reducedMotion: "reduce",
  },
  projects: [
    { name: "store", testMatch: "**/*-store.spec.ts" },
    {
      name: "chromium",
      testMatch: "**/*.browser.spec.ts",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 } },
    },
  ],
  webServer: {
    command: "npm run start -- --hostname localhost --port 3100",
    url: "http://localhost:3100/en/dashboard/job-opportunities",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
