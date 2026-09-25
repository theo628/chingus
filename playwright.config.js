import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;

/* End-to-end tests run against the production build (`vite build` + `vite preview`)
 * in Chromium, Firefox and WebKit (Safari's engine), at phone, tablet and desktop sizes. */
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  expect: { timeout: 7_000 },
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    serviceWorkers: "block",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop-chrome", use: { ...devices["Desktop Chrome"] } },
    { name: "desktop-firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "desktop-safari", use: { ...devices["Desktop Safari"] } },
    { name: "android-pixel7", use: { ...devices["Pixel 7"] } },
    { name: "iphone-14", use: { ...devices["iPhone 14"] } },
    { name: "ipad", use: { ...devices["iPad (gen 7)"] } },
    { name: "small-phone-320", use: { ...devices["Galaxy S5"], viewport: { width: 320, height: 640 } } },
  ],
  webServer: {
    command: `npm run build && npx vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
