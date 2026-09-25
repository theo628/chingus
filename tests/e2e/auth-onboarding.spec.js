import { test, expect, PHONE, loginWithOtp, completeOnboarding, goTab, expectNoHorizontalScroll } from "./fixtures";

test.describe("Login & onboarding", () => {
  test("opening the app directly shows the app landing page", async ({ page }) => {
    await page.goto("/#/app");
    await expect(page.getByText("Find my K-people")).toBeVisible();
    await page.getByRole("button", { name: "Find my K-people" }).click();
    await expect(page).toHaveURL(/#\/app\/login$/);
    await page.getByRole("button", { name: "Back", exact: true }).click();
    await expect(page).toHaveURL(/#\/app$/);
  });

  test("signed-out deep links go to the app landing page", async ({ page }) => {
    await page.goto("/#/app/chats/u1");
    await expect(page).toHaveURL(/#\/app$/);
  });

  test("validates the phone number and OTP", async ({ page }) => {
    await page.goto("/#/app/login");
    const send = page.getByRole("button", { name: "Send OTP" });
    const phone = page.getByLabel("Mobile number");
    await phone.fill("12345");
    await expect(send).toBeDisabled();
    await phone.fill("5876543210"); // Indian mobiles start with 6–9
    await expect(send).toBeDisabled();
    await phone.fill("98765abc43210");
    await expect(phone).toHaveValue("9876543210");
    await expect(send).toBeEnabled();
    await send.click();

    const code = (await page.getByTestId("demo-otp").textContent()).trim();
    const wrong = code === "111111" ? "222222" : "111111";
    await expect(page.getByLabel("6-digit code")).toBeFocused();
    await page.getByLabel("6-digit code").fill(wrong);
    await page.getByRole("button", { name: "Verify & continue" }).click();
    await expect(page.getByText("That code doesn't match")).toBeVisible();
    await expect(page.getByRole("button", { name: /Resend in \d+s/ })).toBeDisabled();

    await page.getByLabel("6-digit code").fill(code);
    await page.getByRole("button", { name: "Verify & continue" }).click();
    await expect(page).toHaveURL(/#\/app\/welcome$/);
  });

  test("onboarding requires each step and de-duplicates custom tags", async ({ page }) => {
    await page.goto("/#/app/login");
    await loginWithOtp(page);
    await expectNoHorizontalScroll(page);

    const next = page.getByRole("button", { name: "Continue" });
    await expect(next).toBeDisabled();
    await page.getByLabel("Your name").fill("Theo");
    await expect(next).toBeDisabled();
    // Custom city via "+ Other"
    await page.getByRole("button", { name: "＋ Other" }).first().click();
    await page.getByLabel("Type your city").fill("Madurai");
    await page.getByRole("button", { name: "Add", exact: true }).click();
    await expect(page.getByRole("button", { name: "Madurai", exact: true })).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "English", exact: true }).click();
    await expect(next).toBeEnabled();
    await next.click();

    await expect(next).toBeDisabled();
    // Typing "bts" selects the existing BTS chip instead of adding a duplicate
    await page.getByRole("button", { name: "＋ Other" }).first().click();
    await page.getByLabel("Add a group / artist").fill("bts");
    await page.getByLabel("Add a group / artist").press("Enter");
    await expect(page.getByRole("button", { name: "BTS", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("button", { name: "bts", exact: true })).toHaveCount(0);
    await next.click();

    const finish = page.getByRole("button", { name: "Show my matches" });
    await expect(finish).toBeDisabled();
    await page.getByRole("button", { name: "Fan art", exact: true }).click();
    await finish.click();
    await expect(page).toHaveURL(/#\/app\/discover$/);
    await expect(page.getByText("Annyeong, Theo")).toBeVisible();
  });

  test("full journey from the website, with sane back-button history", async ({ page }) => {
    await page.goto("/#/");
    await page.getByRole("button", { name: "Open the app" }).click();
    await loginWithOtp(page);
    await completeOnboarding(page);
    await expect(page).toHaveTitle("Discover · Chingus");

    // Back from the app's first screen returns to the website, not to login/onboarding.
    await page.goBack();
    await expect(page).toHaveURL(/#\/$/);
    // Opening the app again while signed in goes straight to Discover.
    await page.getByRole("button", { name: "Open the app" }).click();
    await expect(page).toHaveURL(/#\/app\/discover$/);
  });

  test("log out, log back in, switch accounts, delete data", async ({ page }) => {
    await page.goto("/#/app/login");
    await loginWithOtp(page);
    await completeOnboarding(page);
    await page.getByRole("button", { name: /Wave annyeong/ }).first().click();

    await goTab(page, "You");
    await expect(page.getByText("1 waves")).toBeVisible();
    await expect(page.getByText(/Signed in as \+91 98••• ••210/)).toBeVisible();
    await page.getByRole("button", { name: "Log out" }).click();
    await expect(page).toHaveURL(/#\/app$/);

    // Same number → data comes back, no onboarding.
    await page.getByRole("button", { name: "Find my K-people" }).click();
    await loginWithOtp(page, PHONE);
    await expect(page).toHaveURL(/#\/app\/discover$/);
    await expect(page.getByRole("button", { name: /Waved — open chat/ })).toHaveCount(1);

    // Different number → a fresh account.
    await goTab(page, "You");
    await page.getByRole("button", { name: "Log out" }).click();
    await page.getByRole("button", { name: "Find my K-people" }).click();
    await loginWithOtp(page, "9123456789");
    await expect(page).toHaveURL(/#\/app\/welcome$/);
    await page.getByRole("button", { name: "Not your number? Log in with another" }).click();
    await expect(page).toHaveURL(/#\/app$/);

    // Delete data for the first account.
    await page.getByRole("button", { name: "Find my K-people" }).click();
    await loginWithOtp(page, PHONE);
    await goTab(page, "You");
    await page.getByRole("button", { name: "Delete my data" }).click();
    const dialog = page.getByRole("dialog", { name: "Delete everything?" });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Cancel" }).click();
    await expect(dialog).toBeHidden();
    await page.getByRole("button", { name: "Delete my data" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Delete" }).click();
    await expect(page).toHaveURL(/#\/app$/);
    const left = await page.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith("kc:acct:9876543210:")));
    expect(left).toEqual([]);

    await page.getByRole("button", { name: "Find my K-people" }).click();
    await loginWithOtp(page, PHONE);
    await expect(page).toHaveURL(/#\/app\/welcome$/);
  });
});
