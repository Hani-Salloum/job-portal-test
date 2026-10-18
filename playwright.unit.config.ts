import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*-store.spec.ts",
  reporter: "list",
});
