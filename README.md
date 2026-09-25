# Chingus — web app

The website (`chingus-website.jsx`, W1.1) and the app (`chingus.jsx`, v1.8) rebuilt as one responsive
React web app. The two original files stay in this folder for reference.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production files in dist/
npm run preview    # serve dist/ locally
```

## Live

Published as a Claude Artifact (free, no account setup needed):
**https://claude.ai/artifact/CqgeHeqFrfx2nfCey7nkav**

It is private until you open the page and use its **Share** menu; anyone with the link can then open it.
This copy has no icebreaker server (built-in lines are used) and no offline/install support, since it is
served from a shared path. Republish it after changes with:

```bash
VITE_ARTIFACT=1 npx vite build --outDir dist-artifact
```

For a public site on your own domain, push this repo to GitHub and turn on
Settings → Pages → Source: **GitHub Actions** — `.github/workflows/deploy-pages.yml` builds, tests and
deploys on every push to `main`. Netlify and Vercel also work: build `npm run build`, publish `dist`
(Vercel additionally runs `api/icebreaker.js`, which is the only host option that enables AI icebreakers).

## Tests

```bash
npm test           # unit tests (Vitest): scoring, data validation, storage, router, icebreaker server
npm run test:e2e   # end-to-end (Playwright) against the production build
```

The end-to-end suite runs every flow in 7 setups: desktop Chrome, Firefox and Safari (WebKit), an Android Pixel 7,
an iPhone 14, an iPad, and a 320px-wide phone. The first run needs `npx playwright install` to download the browsers.
It covers the website, login and onboarding, Discover, chats, rooms, lessons, events, profile, accounts, the back
button, broken saved data, horizontal overflow, accessible button names and offline mode.

## How it behaves

**Website (`#/`)**
- "Launch Chingus" and "Open the app" go to login, or straight to Discover if you're already signed in.
- On tablet and desktop, the header links scroll to "How it works" and the FAQ.
- The back button from the app returns to the same scroll position on the website. Unknown URLs go back to the website.

**App (`#/app/…`)**
- Every screen has its own URL: `discover`, `rooms/:id`, `learn/:chapter`, `events`, `chats/:id`, `profile/edit`.
  So the browser or Android back button closes a chat, room, lesson or edit screen instead of leaving the app,
  screens survive a reload, and back/forward restores scroll position.
- **Accounts:** OTP login in demo mode (the code is shown on screen, no SMS is sent). Each mobile number is its own
  account on the device. "Log out" keeps the data; "Delete my data" (with confirmation) wipes it.
  Deep links while signed out go to the app's landing page; opening the app directly shows the landing page first.
- **Chats:** replies arrive after a short "typing…" indicator and cycle through all four lines. The chat list is sorted by latest message.
  Unsent drafts are kept per person. Enter doesn't send half-typed words on Korean, Hindi or Tamil keyboards.
- **Rooms:** your posts are saved and stay after switching tabs or reloading.
- **Learn:** quitting mid-lesson asks for confirmation, and audio stops when you leave. Locked chapters can't be opened by URL.
- **Editing your card** has Cancel and Save. Custom tags reuse an existing spelling ("bts" selects BTS).
- **Broken or tampered saved data** is ignored instead of crashing. If anything does crash, you get a recovery
  screen (Reload / Reset app data) instead of a blank page.
- **Installable** on phones and desktops (manifest + PNG icons), and works offline after the first visit (service worker, production builds only).

## Responsive layout

- **Phones (< 768px):** the original single-column design with the bottom tab bar. It handles notches and home
  indicators, keeps content clear of mobile browser toolbars, resizes around the on-screen keyboard (Chrome),
  and avoids iPhone zooming into text boxes.
- **Tablets (768–1023px):** cards, rooms, events and lessons show in two columns; the bottom tab bar stays.
- **Desktop (≥ 1024px):** a left sidebar replaces the bottom tab bar; buttons show hover states.
- Chat and room threads keep the header pinned to the top and the message box above the tab bar.
- JavaScript is compiled for Safari 13+, Chrome/Edge 79+ and Firefox 72+; CSS gets vendor prefixes.

## Data

Everything is saved in the browser's `localStorage`: the session in `kc:session`, each account under
`kc:acct:<number>:*`, and feedback in `kc:feedback`. If storage is blocked (private mode, full quota), the app keeps
working in memory. There's no backend database yet, so accounts exist only on the device where they were created.

## AI icebreaker (optional)

"Write an icebreaker for me" calls `POST /api/icebreaker`, which runs on the server with Claude (`server/icebreaker.js`),
so the API key never reaches the browser. If the endpoint isn't set up or fails, the app uses the built-in icebreakers.

- **Local:** put `ANTHROPIC_API_KEY=...` in a `.env` file (see `.env.example`), then run `npm run dev`.
- **Vercel:** `api/icebreaker.js` is picked up automatically. Add `ANTHROPIC_API_KEY` in the project's environment variables.
- **Static-only hosts** (Netlify drop, GitHub Pages, S3): deploy `dist/`. Icebreakers use the built-in set.

The endpoint only accepts same-origin browser requests and allows 8 requests per IP per minute. That limit is kept
in memory per server instance, so put a shared rate limiter in front of it for real traffic.

## Project layout

```
index.html                 fonts, meta tags, manifest and icons
src/Root.jsx               website ⇄ app routing, page titles, scroll restoration, "Back to website" bar
src/site/Website.jsx       marketing site
src/app/App.jsx            app shell: routes, accounts, persistence, sidebar/bottom tabs
src/app/*.jsx              AuthScreen, Landing, Onboarding, Discover, Rooms, Learn, Events, Chats, Profile
src/components/            UI pieces, confirmation dialog, error boundary
src/lib/router.js          hash router with real history entries
src/lib/store.js           localStorage wrapper with in-memory fallback, per-account namespaces
src/lib/helpers.js         match scoring, data validation, IME-safe Enter, photo resize, Korean speech
src/data.js, theme.js      mock data, lesson decks, colour tokens
server/icebreaker.js       Claude icebreaker handler (dev server and Vercel)
public/                    icons, manifest, service worker
scripts/generate-icons.mjs regenerates the PNG icons (npm run icons)
tests/unit, tests/e2e      Vitest and Playwright suites
```
