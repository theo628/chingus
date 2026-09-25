import { test, expect, expectNoHorizontalScroll } from "./fixtures";

test.describe("Website", () => {
  test("renders the landing page without layout overflow", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("Chingus — find your K-people");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Your bias has fans");
    await expect(page.getByText("Fandom-first matching")).toBeVisible();
    await expect(page.getByRole("heading", { name: "How it works" })).toBeVisible();
    await expectNoHorizontalScroll(page);
  });

  test("FAQ items expand and collapse", async ({ page }) => {
    await page.goto("/#/");
    const q = page.getByRole("button", { name: "Is it free?" });
    await q.scrollIntoViewIfNeeded();
    await expect(q).toHaveAttribute("aria-expanded", "false");
    await q.click();
    await expect(q).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText("The prototype is completely free")).toBeVisible();
    await q.click();
    await expect(page.getByText("The prototype is completely free")).toBeHidden();
  });

  test("header section links scroll to the section (tablet & desktop)", async ({ page }) => {
    await page.goto("/#/");
    const faqLink = page.getByRole("navigation", { name: "Website" }).getByRole("button", { name: "FAQ" });
    test.skip(!(await faqLink.isVisible()), "section links are hidden on phones");
    await faqLink.click();
    await expect(page.getByRole("heading", { name: "Questions, answered" })).toBeInViewport();
    await expect(page).toHaveURL(/#\/$/);
  });

  test("unknown pages fall back to the website", async ({ page }) => {
    await page.goto("/#/definitely-not-a-page");
    await expect(page).toHaveURL(/#\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("Launch Chingus opens login, and browser back returns to the website", async ({ page }) => {
    await page.goto("/#/");
    await page.getByRole("button", { name: "Launch Chingus" }).click();
    await expect(page).toHaveURL(/#\/app\/login$/);
    await expect(page.getByRole("heading", { name: "Log in with your mobile" })).toBeVisible();
    await page.goBack();
    await expect(page).toHaveURL(/#\/$/);
    await expect(page.getByRole("button", { name: "Launch Chingus" })).toBeVisible();
  });

  test("returning to the website restores the scroll position", async ({ page }) => {
    await page.goto("/#/");
    const cta = page.getByRole("button", { name: "Open Chingus" });
    await cta.scrollIntoViewIfNeeded();
    const before = await page.evaluate(() => window.scrollY);
    expect(before).toBeGreaterThan(200);
    await cta.click();
    await expect(page).toHaveURL(/#\/app\/login$/);
    await page.goBack();
    await expect(cta).toBeInViewport();
  });
});
