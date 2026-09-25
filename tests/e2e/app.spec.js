import { test, expect, seedAccount, goTab, appNav, isDesktop, expectNoHorizontalScroll } from "./fixtures";
import { LEARN_DECKS, CANNED_ICEBREAKERS } from "../../src/data.js";

test.describe("Discover", () => {
  test("lists fans by match score and waving unlocks chat", async ({ page }) => {
    await seedAccount(page);
    await page.goto("/#/app");
    await expect(page).toHaveURL(/#\/app\/discover$/);

    const badges = page.getByText(/^\d+% match$/);
    await expect(badges).toHaveCount(8);
    const scores = (await badges.allTextContents()).map((t) => parseInt(t, 10));
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
    await expect(page.getByText("Priya, 23")).toBeVisible();

    await page.getByRole("button", { name: /Wave annyeong/ }).first().click();
    const openChat = page.getByRole("button", { name: /Waved — open chat/ });
    await expect(openChat).toHaveCount(1);
    await openChat.click();
    await expect(page).toHaveURL(/#\/app\/chats\/u1$/);
    await expect(page.getByRole("heading", { name: "Priya" })).toBeVisible();
    await expectNoHorizontalScroll(page);
  });
});

test.describe("Chats", () => {
  test("send, typing indicator, varied replies, persistence and back button", async ({ page }) => {
    await seedAccount(page, { connections: ["u1"] });
    await page.goto("/#/app/discover");
    await goTab(page, "Chats");
    await expect(page).toHaveURL(/#\/app\/chats$/);
    await page.getByRole("button", { name: /Priya/ }).click();
    await expect(page).toHaveURL(/#\/app\/chats\/u1$/);

    const input = page.getByLabel("Message Priya");
    const send = page.getByRole("button", { name: "Send" });
    await expect(send).toBeDisabled();

    await input.fill("Annyeong!");
    await input.press("Enter");
    await expect(page.locator('[data-from="me"]')).toHaveText(["Annyeong!"]);
    await expect(input).toHaveValue("");
    await expect(page.getByText("Priya is typing…")).toBeVisible();
    await expect(page.locator('[data-from="them"]')).toHaveCount(1);
    await expect(page.getByText("Priya is typing…")).toBeHidden();

    await input.fill("Reply 1988 forever");
    await send.click();
    await expect(page.locator('[data-from="them"]')).toHaveCount(2);
    const replies = await page.locator('[data-from="them"]').allTextContents();
    expect(new Set(replies).size, "replies should not repeat back-to-back").toBe(2);

    // Composer stays above the tab bar and inside the screen.
    const composer = await input.boundingBox();
    const viewport = page.viewportSize();
    expect(composer.y + composer.height).toBeLessThanOrEqual(viewport.height);
    if (!isDesktop(page)) {
      const nav = await appNav(page).boundingBox();
      expect(composer.y + composer.height).toBeLessThanOrEqual(nav.y + 1);
    }

    // Reload keeps the conversation.
    await page.reload();
    await expect(page.locator('[data-from="me"]')).toHaveCount(2);

    // The back arrow closes the thread; the list previews the latest message.
    await page.getByRole("button", { name: "Back to chats" }).click();
    await expect(page).toHaveURL(/#\/app\/chats$/);
    await expect(page.getByText("Wait, you too?? Okay we're going to be friends.")).toBeVisible();
  });

  test("browser back closes an open chat", async ({ page }) => {
    await seedAccount(page, { connections: ["u1"] });
    await page.goto("/#/app/chats");
    await page.getByRole("button", { name: /Priya/ }).click();
    await expect(page).toHaveURL(/#\/app\/chats\/u1$/);
    await page.goBack();
    await expect(page).toHaveURL(/#\/app\/chats$/);
    await expect(page.getByRole("heading", { name: "Your chats" })).toBeVisible();
    // The in-app arrow does the same.
    await page.getByRole("button", { name: /Priya/ }).click();
    await page.getByRole("button", { name: "Back to chats" }).click();
    await expect(page).toHaveURL(/#\/app\/chats$/);
  });

  test("chat with someone you haven't waved at redirects to the list", async ({ page }) => {
    await seedAccount(page, { connections: [] });
    await page.goto("/#/app/chats/u5");
    await expect(page).toHaveURL(/#\/app\/chats$/);
    await expect(page.getByText("No waves yet")).toBeVisible();
    await page.getByRole("button", { name: "Go to Discover" }).click();
    await expect(page).toHaveURL(/#\/app\/discover$/);
  });

  test("icebreaker uses the AI endpoint and falls back to built-in lines", async ({ page }) => {
    await seedAccount(page, { connections: ["u1"] });
    await page.goto("/#/app/chats/u1");
    const input = page.getByLabel("Message Priya");

    // Endpoint unavailable (fixture default) → canned icebreaker.
    await page.getByRole("button", { name: "Write an icebreaker for me" }).click();
    await expect(input).not.toHaveValue("");
    const canned = await input.inputValue();
    const patterns = CANNED_ICEBREAKERS.map((t) => t.split("{")[0].slice(0, 20));
    expect(patterns.some((p) => canned.startsWith(p))).toBe(true);

    // Endpoint available → AI text.
    await page.unroute("**/api/icebreaker");
    await page.route("**/api/icebreaker", async (route) => {
      const body = route.request().postDataJSON();
      expect(body).toMatchObject({ from: "Theo", to: "Priya", city: "Chennai" });
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ text: "AI says annyeong 🌸" }) });
    });
    await page.getByRole("button", { name: "Write an icebreaker for me" }).click();
    await expect(input).toHaveValue("AI says annyeong 🌸");
  });
});

test.describe("Rooms", () => {
  test("posts persist across tabs and reloads; back closes the room", async ({ page }) => {
    await seedAccount(page);
    await page.goto("/#/app/rooms");
    await expect(page.getByText("BTS India")).toBeVisible();
    await page.getByRole("button", { name: /Chennai K-fans/ }).click();
    await expect(page).toHaveURL(/#\/app\/rooms\/r-city$/);
    const input = page.getByLabel("Message Chennai K-fans");
    await input.fill("Cup-sleeve café this Sunday?");
    await input.press("Enter");
    await expect(page.locator('[data-mine="true"]')).toContainText("Cup-sleeve café this Sunday?");

    await page.goBack();
    await expect(page).toHaveURL(/#\/app\/rooms$/);
    await goTab(page, "Events");
    await goTab(page, "Rooms");
    await expect(page.getByText(/1 post from you/)).toBeVisible();
    await page.reload();
    await page.getByRole("button", { name: /Chennai K-fans/ }).click();
    await expect(page.locator('[data-mine="true"]')).toContainText("Theo (you)");
  });

  test("room names with spaces work as links", async ({ page }) => {
    await seedAccount(page, { profile: {
      name: "Theo", city: "Chennai", langs: ["English"], fandoms: ["Stray Kids"], dramas: [], vibes: ["Fan art"], emoji: "💜", photo: null,
    } });
    await page.goto("/#/app/rooms");
    await page.getByRole("button", { name: /Stray Kids India/ }).click();
    await expect(page.getByRole("heading", { name: "Stray Kids India" })).toBeVisible();
    await page.reload();
    await expect(page.getByRole("heading", { name: "Stray Kids India" })).toBeVisible();
  });
});

async function answerLesson(page, deck, { wrong = false } = {}) {
  for (let guard = 0; guard < 60; guard++) {
    if (await page.getByText(/Lesson complete!|Out of hearts!/).isVisible()) return;
    const gotIt = page.getByRole("button", { name: "Got it" });
    if (await gotIt.isVisible()) { await gotIt.click(); continue; }

    const prompt = (await page.getByText(/How do you say…|What does this mean\?|What do you hear\?/).textContent()).trim();
    let item;
    if (prompt.startsWith("How do you say")) {
      const en = (await page.locator(".kc-display.text-3xl").first().textContent()).replace(/^"|"$/g, "");
      item = deck.items.find((x) => x.en === en);
    } else if (prompt.startsWith("What does")) {
      const kr = (await page.locator(".kc-display.text-3xl").first().textContent()).trim();
      item = deck.items.find((x) => x.kr === kr);
    } else {
      await expect.poll(() => page.evaluate(() => window.__spoken.length)).toBeGreaterThan(0);
      const spoken = await page.evaluate(() => window.__spoken[window.__spoken.length - 1]);
      item = deck.items.find((x) => x.kr === spoken);
    }
    expect(item, "could not identify the correct answer").toBeTruthy();

    const isKr2En = prompt.startsWith("What does");
    const target = isKr2En ? item.en : item.kr;
    const all = page.locator("div.space-y-2\\.5 > button");
    const count = await all.count();
    let clicked = false;
    for (let i = 0; i < count; i++) {
      const text = (await all.nth(i).textContent()).trim();
      const matches = isKr2En ? text === target : text.startsWith(target + " ");
      if (matches !== wrong) { await all.nth(i).click(); clicked = true; break; }
    }
    expect(clicked, "no option clicked").toBe(true);
    await page.evaluate(() => { window.__spoken = []; });
    await page.getByRole("button", { name: "Continue" }).click();
  }
  throw new Error("lesson did not finish");
}

test.describe("Learn", () => {
  test("completing chapter 1 awards XP and unlocks chapter 2", async ({ page }) => {
    await seedAccount(page);
    await page.goto("/#/app/learn");
    await expect(page.getByText("Level 1")).toBeVisible();
    await expect(page.getByRole("button", { name: "Chapter 2 locked" })).toBeDisabled();

    await page.getByRole("button", { name: "Start chapter 1: Greetings" }).click();
    await expect(page).toHaveURL(/#\/app\/learn\/greet$/);
    await answerLesson(page, LEARN_DECKS[0]);
    await expect(page.getByText("Lesson complete!")).toBeVisible();
    await expect(page.getByText('You earned 120 XP in "Greetings".')).toBeVisible();

    await page.getByRole("button", { name: "All lessons" }).click();
    await expect(page).toHaveURL(/#\/app\/learn$/);
    await expect(page.getByText("Level 2")).toBeVisible();
    await expect(page.getByText("120 XP", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Start chapter 2: Politeness" })).toBeEnabled();

    await page.reload();
    await expect(page.getByText("120 XP", { exact: true })).toBeVisible();
  });

  test("three wrong answers ends the lesson", async ({ page }) => {
    await seedAccount(page);
    await page.goto("/#/app/learn/greet");
    await answerLesson(page, LEARN_DECKS[0], { wrong: true });
    await expect(page.getByText("Out of hearts!")).toBeVisible();
    await expect(page.getByRole("button", { name: "Retry" })).toBeVisible();
  });

  test("quitting asks for confirmation; browser back leaves the lesson", async ({ page }) => {
    await seedAccount(page);
    await page.goto("/#/app/learn");
    await page.getByRole("button", { name: "Start chapter 1: Greetings" }).click();
    await page.getByRole("button", { name: "Got it" }).click();

    await page.getByRole("button", { name: "Quit lesson" }).click();
    const dialog = page.getByRole("dialog", { name: "Quit this lesson?" });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(page).toHaveURL(/#\/app\/learn\/greet$/);

    await page.getByRole("button", { name: "Quit lesson" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Quit" }).click();
    await expect(page).toHaveURL(/#\/app\/learn$/);

    await page.getByRole("button", { name: "Start chapter 1: Greetings" }).click();
    await expect(page.getByText("New phrase")).toBeVisible();
    await page.goBack();
    await expect(page).toHaveURL(/#\/app\/learn$/);
    await expect(page.getByText("Learn Korean")).toBeVisible();
  });

  test("locked chapters can't be opened by URL", async ({ page }) => {
    await seedAccount(page);
    await page.goto("/#/app/learn/food");
    await expect(page).toHaveURL(/#\/app\/learn$/);
  });
});

test.describe("Events & profile", () => {
  test("events list", async ({ page }) => {
    await seedAccount(page);
    await page.goto("/#/app/events");
    await expect(page.getByRole("heading", { name: "Events near you" })).toBeVisible();
    await expect(page.getByText("Cup-sleeve Café Meetup")).toBeVisible();
    await expect(page.getByText(/^(Meetup|Contest|Language|Watch party)$/)).toHaveCount(4);
  });

  test("edit profile: cancel keeps data, save updates it", async ({ page }) => {
    await seedAccount(page);
    await page.goto("/#/app/profile");
    await page.getByRole("button", { name: "Edit my interests" }).click();
    await expect(page).toHaveURL(/#\/app\/profile\/edit$/);
    await page.getByLabel("Your name").fill("Changed");
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page).toHaveURL(/#\/app\/profile$/);
    await expect(page.getByText("Theo", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "Edit my interests" }).click();
    await page.getByLabel("Your name").fill("Theo K");
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page).toHaveURL(/#\/app\/profile$/);
    await expect(page.getByText("Theo K", { exact: true })).toBeVisible();
  });

  test("feedback form", async ({ page }) => {
    await seedAccount(page);
    await page.goto("/#/app/profile");
    const send = page.getByRole("button", { name: "Send feedback" });
    await expect(send).toBeDisabled();
    await page.getByLabel("Feedback").fill("Please add ZEROBASEONE!");
    await expect(page.getByText("23 characters")).toBeVisible();
    await send.click();
    await expect(page.getByText("Sent — thank you! 💌")).toBeVisible();
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("kc:feedback")));
    expect(saved.at(-1).text).toBe("Please add ZEROBASEONE!");
  });
});

test.describe("Layout & resilience", () => {
  test("every tab fits the screen and uses the right navigation", async ({ page }) => {
    await seedAccount(page, { connections: ["u1", "u2"] });
    await page.goto("/#/app/discover");
    const desktop = isDesktop(page);
    await expect(page.locator("aside")).toBeVisible({ visible: desktop });
    for (const tab of ["Discover", "Rooms", "Learn", "Events", "Chats", "You"]) {
      await goTab(page, tab);
      await expect(appNav(page).getByRole("button", { name: tab, exact: true })).toHaveAttribute("aria-current", "page");
      await expectNoHorizontalScroll(page);
    }
  });

  test("corrupted saved data doesn't crash the app", async ({ page }) => {
    await page.goto("/#/");
    await page.evaluate(() => {
      localStorage.setItem("kc:session", JSON.stringify({ phone: "+91 9876543210" }));
      localStorage.setItem("kc:acct:9876543210:profile", '"garbage"');
      localStorage.setItem("kc:acct:9876543210:chats", "{broken json");
      localStorage.setItem("kc:acct:9876543210:connections", JSON.stringify({ not: "an array" }));
    });
    await page.goto("/#/app/chats/u1");
    await page.reload(); // hash-only navigation doesn't reload the document
    await expect(page).toHaveURL(/#\/app\/welcome$/);
    await expect(page.getByLabel("Your name")).toBeVisible();

    await page.evaluate(() => localStorage.setItem("kc:session", "not json"));
    await page.goto("/#/app/discover");
    await page.reload();
    await expect(page).toHaveURL(/#\/app$/);
    await expect(page.getByRole("button", { name: "Find my K-people" })).toBeVisible();
  });

  test("the back-to-website bar works from inside the app", async ({ page }) => {
    await seedAccount(page);
    await page.goto("/#/app/events");
    await page.getByRole("button", { name: "Back to website" }).click();
    await expect(page).toHaveURL(/#\/$/);
    await expect(page.getByRole("button", { name: "Launch Chingus" })).toBeVisible();
  });

  test("buttons all have accessible names", async ({ page }) => {
    await seedAccount(page, { connections: ["u1"] });
    for (const path of ["/#/", "/#/app/discover", "/#/app/chats/u1", "/#/app/learn", "/#/app/profile"]) {
      await page.goto(path);
      await page.waitForTimeout(150);
      const unnamed = await page.evaluate(() =>
        [...document.querySelectorAll("button")]
          .filter((b) => b.offsetParent !== null)
          .filter((b) => !(b.getAttribute("aria-label") || b.textContent.trim()))
          .map((b) => b.outerHTML.slice(0, 80))
      );
      expect(unnamed, `unnamed buttons on ${path}`).toEqual([]);
    }
  });
});
