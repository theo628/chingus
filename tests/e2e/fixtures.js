import { test as base, expect } from "@playwright/test";

export const PHONE = "9876543210";

/* Every page gets a fake speech engine: no real audio in CI, and the Learn tests can
 * read which Korean phrase a "listen" exercise played. */
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(() => {
      window.__spoken = [];
      class FakeUtterance { constructor(text) { this.text = text; } }
      try {
        Object.defineProperty(window, "SpeechSynthesisUtterance", { value: FakeUtterance, configurable: true, writable: true });
        Object.defineProperty(window, "speechSynthesis", {
          configurable: true,
          value: { speak: (u) => window.__spoken.push(u.text), cancel() {}, getVoices: () => [] },
        });
      } catch { /* ignore */ }
    });
    // Icebreaker API defaults to "unavailable" so tests never hit the real Claude API.
    await page.route("**/api/icebreaker", (route) => route.fulfill({ status: 503, body: "{}" }));
    await use(page);
  },
});

export { expect };

export const isDesktop = (page) => (page.viewportSize()?.width || 0) >= 1024;

export function appNav(page) {
  return page.getByRole("navigation", { name: "App sections" });
}

export async function goTab(page, label) {
  await appNav(page).getByRole("button", { name: label, exact: true }).click();
}

export async function loginWithOtp(page, phone = PHONE) {
  await expect(page.getByRole("heading", { name: "Log in with your mobile" })).toBeVisible();
  await page.getByLabel("Mobile number").fill(phone);
  await page.getByRole("button", { name: "Send OTP" }).click();
  const code = (await page.getByTestId("demo-otp").textContent()).trim();
  await page.getByLabel("6-digit code").fill(code);
  await page.getByRole("button", { name: "Verify & continue" }).click();
}

export async function completeOnboarding(page, name = "Theo") {
  await expect(page).toHaveURL(/#\/app\/welcome$/);
  await page.getByLabel("Your name").fill(name);
  await page.getByRole("button", { name: "Chennai", exact: true }).click();
  await page.getByRole("button", { name: "Tamil", exact: true }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "BTS", exact: true }).click();
  await page.getByRole("button", { name: "Queen of Tears", exact: true }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Learning Korean", exact: true }).click();
  await page.getByRole("button", { name: "Show my matches" }).click();
  await expect(page).toHaveURL(/#\/app\/discover$/);
}

/* Seeds a signed-in account straight into localStorage (fast path for feature tests). */
export async function seedAccount(page, { phone = PHONE, profile, connections = [], chats = {}, learn } = {}) {
  await page.goto("/#/");
  await page.evaluate(({ phone, profile, connections, chats, learn }) => {
    const ns = "kc:acct:" + phone + ":";
    localStorage.setItem("kc:session", JSON.stringify({ phone: "+91 " + phone, verifiedAt: new Date().toISOString() }));
    localStorage.setItem(ns + "profile", JSON.stringify(profile || {
      name: "Theo", city: "Chennai", langs: ["Tamil", "English"], fandoms: ["BTS"],
      dramas: ["Queen of Tears"], vibes: ["Learning Korean"], emoji: "💜", photo: null,
    }));
    localStorage.setItem(ns + "connections", JSON.stringify(connections));
    localStorage.setItem(ns + "chats", JSON.stringify(chats));
    if (learn) localStorage.setItem(ns + "learn", JSON.stringify(learn));
  }, { phone, profile, connections, chats, learn });
}

export async function expectNoHorizontalScroll(page) {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(scrollWidth, "page should not scroll sideways").toBeLessThanOrEqual(clientWidth);
}
