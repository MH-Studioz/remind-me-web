# Remind me — web

The web version of Remind me, rebuilt to match the Base44 design: warm paper,
Instrument Serif headlines, four tabs (Today, Tasks, Focus, Stats), explicit
P1–P4 priorities, focus sprints, quiet hours and a guest-first welcome screen.

This is the browser port of the iOS app in `MH-Studioz/remind-me-ios`, and
it is a separate repository so it can be released on its own.

## Run it locally

No build step, no dependencies. Serve the folder and open it:

```bash
python -m http.server 4173
# then open http://127.0.0.1:4173
```

A local server is required: service workers and the installed-app manifest do
not work from `file://`.

## Release

Every push to `main` deploys to GitHub Pages through
`.github/workflows/pages.yml`. The site is published at:

```
https://MH-Studioz.github.io/remind-me-web/
```

All URLs are relative, so the app works from a subpath.

## Accounts

Two ways to use it, both working today:

- **Guest** — no account at all, plain local storage.
- **Email account** — its own page (`#/signup`) where you pick a name, email and
  password (8+ characters). The app derives a key with PBKDF2-SHA256 (210k
  rounds) and stores your tasks as AES-GCM ciphertext under that account. One
  account per email per browser, separate from guest data, and it asks for the
  password again after a reload. There is no reset: a forgotten password means
  a new account.

Google sign-in was removed: it cannot work without an OAuth client ID, so email
and password is the only account type.

## What works where

| Capability | Status |
|---|---|
| Tasks, P1–P4 priorities, sub-steps, repeats, quiet hours | ✅ local, per device |
| Guest mode (no account needed) | ✅ data stays in this browser |
| Focus sprints with countdown | ✅ tabs lock while a sprint runs; YouTube and Classroom still open in a new browser tab |
| Planner | ✅ import a weekly timetable (CSV, `.ics` or plain lines) and plan the next 7 days of classes |
| Account recovery | ✅ a one-time recovery code resets the password and keeps your tasks |
| Focus peek | ✅ a 3-minute tab unlock while the sprint keeps running |
| Installable app + offline | ✅ service worker caches the shell |
| Share text into the app | ✅ Android Chrome (Web Share Target) |
| Notifications | ⚠️ while the page or installed app is running — waking a closed browser needs a push server |
| Import / export | ✅ JSON backup, CSV import, share-to-app |
| Sync between devices | ⚠️ not yet — data lives in `localStorage` |

## Icons

`python tools/make_icons.py` redraws the hourglass mark into `icons/`.

## Privacy

No analytics, no advertising, no server of ours. Everything stays in the browser's
storage on the device. See the policy in the native repo (`docs/privacy.md`).
