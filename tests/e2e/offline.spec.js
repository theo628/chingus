import { test, expect } from "./fixtures";

test.use({ serviceWorkers: "allow" });

test("works offline after the first visit (service worker)", async ({ page, context, browserName }) => {
  test.skip(browserName !== "chromium", "offline emulation with service workers is most reliable in Chromium");
  await page.goto("/#/");
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload(); // let the worker take control and cache the assets
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Your bias has fans");
  await context.setOffline(false);
});

test("web app manifest and icons are served", async ({ request }) => {
  const manifest = await (await request.get("/manifest.webmanifest")).json();
  expect(manifest.start_url).toBe("./#/app");
  for (const icon of manifest.icons) {
    const res = await request.get(icon.src);
    expect(res.ok(), icon.src).toBe(true);
  }
  expect((await request.get("/apple-touch-icon.png")).ok()).toBe(true);
});
