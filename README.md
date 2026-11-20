# Remind me — web

The browser version of Remind me. It is a small installable web app (no build
step, no dependencies): warm paper surfaces, Instrument Serif headlines, four
tabs (Today, Tasks, Focus, Stats), explicit P1–P4 priorities, focus sprints,
quiet hours, a weekly timetable planner and a guest-first welcome screen.

This is the browser port of the iOS app in `MH-Studioz/remind-me-ios`, and it is
a separate repository so it can be released on its own.

Current release: **v1.1.5**.

## Run it locally

Serve the folder and open it:

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

All URLs are relative, so the app also works from a subpath. The history is kept
as one squashed commit per release, with a matching `vX.Y.Z` tag and GitHub
release; the service worker cache name in `sw.js` is bumped with each release so
installed copies pick the update up.

## Accounts

Two ways to use it, both working today:

- **Guest** — no account at all; tasks sit in plain local storage.
- **Email account** — its own page (`#/signup`) where you pick a name, email and
  password (8+ characters, with a show/hide button). The app derives a key with
  PBKDF2-SHA256 (210,000 rounds, per-account salt) and stores tasks as AES-GCM
  ciphertext under that account. One account per email per browser, separate from
  guest data.

A **recovery code** is shown once when the account is created; it wraps the key,
so `#/recover` can reset a forgotten password and keep the tasks. The account's
email and salt also travel inside its encrypted record, so an account is still
found if the browser loses its account list — log in, unlock and password reset
all rebuild the entry from that record.

You stay signed in on the device after closing the app. `Settings → Lock now`
drops the stored key and asks for the password again; `Sign out` removes the
session entirely. Anything that clears this browser's site data still takes the
account with it, so a backup is the only safety net there.

## Sync across devices

Sync is opt-in and stays end-to-end encrypted. It needs one thing from you: a
Supabase project to hold the sealed rows.

1. Create a free project at supabase.com.
2. Run `supabase/schema.sql` in its SQL editor once.
3. In the app: `Settings → Sync across devices → Add sync server`, and paste the
   project URL and the **anon public** key (Project settings → API). They are
   stored in this browser only, never in the repo.
4. Press `Turn on sync`. A **sync code** appears; keep it, it is shown whenever
   you need it.
5. On the other device: sign in to an account there (or create one), then
   `Settings → Sync across devices → Use a sync code` and enter the code. The
   saved tasks replace whatever is on that device.

What syncs: tasks, sub-steps, priorities, repeats, the weekly timetable, planner
and goal settings, focus history and the theme. What does not: guest data, the
account's own password and its local record.

How it stays private: `remindme_sync` holds one row per sync code. The row id is
the SHA-256 of the code, and the payload is AES-GCM ciphertext under a
PBKDF2-SHA256 key derived from the same code in the browser. The project only
ever sees ciphertext, and the anon key alone cannot open a row. The trade-off is
that the sync code *is* the credential: anyone who has it can read that row, and
the schema deliberately has no delete policy so a browser cannot wipe your
backup.

Edits upload a moment after you stop tapping. If two devices change things
between syncs, the app refuses to overwrite silently: `Settings` shows both
revisions and you choose `Use the newer copy` or `Keep this device`.
`Turn off` stops syncing on that device and leaves the server copy in place, so
the same code can reconnect later.

## What works where

| Capability | Status |
|---|---|
| Tasks, P1–P4 priorities, sub-steps, repeats, quiet hours | ✅ per device |
| Guest mode (no account needed) | ✅ data stays in this browser |
| Email account, encrypted with your password | ✅ PBKDF2 + AES-GCM, per account |
| Show/hide password on signup, log in, unlock and reset | ✅ |
| Stays signed in until lock or sign out | ✅ |
| Account recovery | ✅ one-time recovery code resets the password and keeps tasks |
| Focus sprints with countdown | ✅ tabs lock while a sprint runs; YouTube and Classroom still open in a new browser tab |
| Focus peek | ✅ a 3-minute tab unlock while the sprint keeps running |
| Planner | ✅ import a weekly timetable (CSV, `.ics` or plain lines) and plan the next 7 days of classes |
| Installable app + offline | ✅ service worker caches the shell |
| Share text into the app | ✅ Android Chrome (Web Share Target) |
| Import / export | ✅ JSON backup, CSV import, share-to-app |
| Sync between devices | ✅ your own Supabase project, end-to-end encrypted, revision-guarded |
| Notifications | ⚠️ while the page or installed app is running — waking a closed browser needs a push server |

## Timetable import

The planner accepts a calendar `.ics` file, a CSV, or plain lines. On a line, a
time needs a colon or an am/pm suffix (`9:00`, `9am`); bare numbers are read as
part of the class name, so `Biology 101` keeps its number and `Physics 2 Lab` is
not mistaken for a 2 o'clock start.

## Icons

`python tools/make_icons.py` redraws the hourglass mark into `icons/`.

## Privacy

No analytics, no advertising, no server of ours. Everything stays in the
browser's storage on the device; with sync on, only sealed ciphertext goes to the
database you chose yourself. See the policy in the native repo
(`docs/privacy.md`).
