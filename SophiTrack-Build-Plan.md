# SophiTrack: Build Plan

**Written:** Mon 11/9/2026 (Sophie's Day 11). **MVP target:** Thu 11/12/2026 (Day 14), per the High-Level Plan §7.
Companion to `SophiTrack-High-Level-Plan.md` (what to build) and `SophiTrack-UI-Brief.md` + `design/mockups/` (how it looks). This doc covers **how and in what order** to build it.

**Guiding rules**

1. **Heidi's whole app is two actions and two screens.** Feed and Diaper; Today and Timeline. Nothing appears on screen until it works.
2. **Tom does the setup; Heidi never does.** Install, sign-in, passwords, minimums, the Day 1 date, export and backfill happen in person or in Supabase, not in her app.
3. **Saving never fails and never asks a technical question.** Entries write to the phone first. She can only ever see four messages: the save toast with Undo, "Saved on this phone", "Tap to reconnect", and a crash screen saying her entries are safe.
4. **A default may save a tap but must never record something nobody looked at.** The feed amount defaults to the last value; diaper type and color do not.
5. **One word per idea, and calm.** Status is On track / Watch / Below minimum with an icon. No "sync", "window", "stool", "intake" or "On pace" on screen, and no red fills on Today.

---

## 0. Starting point

- M0 is done: the Vite + React + TypeScript shell, tooling, the Supabase project and the Vercel deploy at https://sophitrack.vercel.app all exist. No feature code yet. M1 has not started.
- That leaves three working days (Tue 11/10 to Thu 11/12). The plan is ordered so each day ends with something usable, and §5.8 lists what to cut if it slips.
- **Formula only** (Tom, 11/9). Heidi no longer pumps or breastfeeds, so the app has no pump logging, no breast milk portion, no feeding method and no breast-milk-on-hand. A feed is a time, an amount of formula in mL, an optional "left in bottle" and an optional note.
- **As simple as possible for Heidi** (Tom, 11/9). Two daily actions (Feed, Diaper) and two screens (Today, Timeline). The tab bar is Today, +, Timeline. The + menu has two large tiles (Feed, Diaper) and a small row with Weight and Note. Settings sits behind Sophie's avatar.
- Sophie is past Day 6, so **Today compares against the Day 6+ row** (8 feeds, 6 wet diapers, 2 dirty diapers). The Day 1-5 thresholds matter for backfilled history and the Timeline.
- **Day 1 minimum feeds = 8** (parents' decision, 11/9). The hospital sheet shades only 4 boxes for Day 1, so record this metric's source as the parents' choice, not the sheet.
- **The paper sheets for Days 1-10 include colostrum, breast milk, direct breastfeeding and pumping.** The import keeps each feed as a plain feed and puts the original detail in the note (§5.7). The schema carries nothing for it.
- **The mockups predate both decisions.** They still show five tabs, the pump sheet, the breast milk split and the % toggle. Use them for layout, spacing and tokens. Where they differ from this plan, the plan wins.

---

## 1. Stack

| Layer | Choice | Why |
|---|---|---|
| App | **Vite + React + TypeScript**, single-page app | Static hosting, no server rendering needed, simplest path to an offline-first PWA |
| Styling | Plain CSS with tokens ported from `design/source/sophi.css` | The light/dark tokens and component styles already exist; no framework needed |
| Routing | React Router | Two screens (Today, Timeline), Settings, sign-in, plus sheets; nothing fancier needed |
| Local data | **Dexie** (IndexedDB) + `useLiveQuery` | The UI reads only from the local database, so it works offline and updates instantly |
| Backend | **Supabase**: Postgres, Auth, Realtime, row-level security | Named in the spec; covers auth, sync and push (Edge Functions + pg_cron) in one service |
| Auth | Supabase Auth, **email + password**, public sign-ups off | No trip to Mail at 3am, and less to build than a code-entry screen |
| Time | **Temporal** via `temporal-polyfill`, zone `America/Chicago` | `getPossibleInstantsFor()` returns 0, 1 or 2 instants for a local time, which maps directly to the spring-forward gap, a normal time, and the fall-back repeated hour (§6.1 rules 4-5). Luxon resolves those silently |
| Validation | **zod**, one schema per entry kind | Shared by forms, sync and the backfill importer |
| PWA | `vite-plugin-pwa` (Workbox) | Manifest, service worker and app-shell precache |
| Tests | **Vitest** (domain), **Playwright** with WebKit at iPhone size (smoke) | The domain rules carry most of the risk, so unit tests come first |
| Lint/format | **oxlint** + Prettier | oxlint is the current Vite scaffold default and much faster than ESLint |
| Hosting | **Vercel** at `sophitrack.vercel.app`, the permanent address | Named in the spec. Each web address has its own storage on the phone, so changing it later would mean re-installing and signing in again on both phones |

**Auth gotcha:** on iPhone, a magic link opens in Safari, not in the home-screen app, which has its own separate storage, so the session lands in the wrong place. An emailed code avoids that but sends a parent to Mail in the middle of the night. So sign-in is **email + password**. Tom creates both accounts by hand in Supabase with long random passwords, signs in on each phone in person and saves the password to Keychain. There is no "Forgot password" and no "Create account"; Tom resets a password in Supabase if needed. The repo is public and the publishable key ships in the app, so **turning off public sign-ups is the first step of M2**.

---

## 2. Architecture

```
React screens ──read──▶ Dexie (IndexedDB) ◀──write── sync ◀──▶ Supabase
      │                       ▲                        │  push: outbox of actions → upsert
      └──write (entry + outbox action)                 │  pull: refetch all entries on open,
                                                       │        on foreground, on a Realtime event
domain/ (pure TypeScript, no React): time · day of life · feed · aggregates · status · growth
```

Design decisions:
- **Today always renders from local data and never waits on the network.** No spinner, no pull-to-refresh, no "last updated".
- **Pull is a full refetch.** On app open, on return to the foreground and on any Realtime event for this baby, fetch every entry and replace the local copy, then re-apply the outbox on top so unsent work never disappears. Volume is tiny (about 20 entries a day, about 7k a year), so there is no cursor or "changed since" bookkeeping to get wrong.
- **The outbox stores actions, not row snapshots:** create, update (only the changed fields) or delete, each with the entry id. Sync sends them in order and removes each one when the server accepts it.
- **Client-generated UUIDs.** Entries can be created offline, and retrying an upload never makes duplicates.
- **Soft delete** (`deleted_at`). Deletes sync like any other change, and **Undo** just clears the field.
- **Last write wins**, using a server-set `updated_at` (trigger). With two people, editing the same entry at once is rare.
- **Totals are computed on the phone** from local data. No SQL views or server aggregation.
- **A dead session never blocks logging.** Once a phone has signed in, it opens to Today from local data. Sync never signs anyone out on a network error and never clears local data or the outbox.
- **One `entries` table** for every timestamped log event, with `kind` plus a `data` JSON column validated by zod. That gives one sync path, one Timeline query and one Realtime channel. Things that aren't timeline events (baby, appointments, questions, reference metrics) get their own tables.

---

## 3. Data model (Postgres)

**MVP tables**

| Table | Columns |
|---|---|
| `babies` | id, name, birth_at `timestamptz`, day1_date `date`, tz (default `America/Chicago`), birth_weight_g, birth_length_cm, birth_head_cm |
| `members` | baby_id, user_id, display_name, initial (H/T). This is what row-level security checks against |
| `entries` | id `uuid`, baby_id, kind (enum), occurred_at `timestamptz`, utc_offset_min `smallint`, ended_at `timestamptz` null, logged_by, source (`app`/`paper`, default `app`), data `jsonb`, notes, created_at, updated_at, deleted_at |
| `settings` | baby_id, feed_interval_min (120), feed_window_min (60) |
| `reference_metrics` | metric, day_from, day_to, min, typical, max, note, source, source_url |

**Entry kinds (enum):** `feed`, `diaper`, `sleep`, `care`, `note`, `measurement`. The MVP writes feed, diaper, note and measurement; sleep and care are in the enum for Phase 2.

**`data` per kind (zod)**
- `feed`: amount_ml, left_ml?. Every feed is formula. What she drank (amount minus leftover) is **derived, not stored**. `amount_ml` is required when `source` is `app` and optional only when `source` is `paper`, for a breastfeeding-only session copied from the sheets. Store mL with one decimal, since a Day 1 feed on paper can be 1 mL.
- `diaper`: wet, dirty, stool_color?, consistency?, pee_color?. The form shows color and texture only; pee color stays in the schema with no input.
- `sleep`: uses `ended_at` (Phase 2)
- `care`: Phase 2
- `note`: text only, in `notes`
- `measurement`: weight_g, length_cm?, head_cm?, place (`hospital`/`pediatrician`/`home`). The weight form saves `pediatrician` without asking. (`place` is the spec's measurement "source", renamed so it does not clash with the entry-level `source` column.) Stored as an entry in the MVP so it syncs like everything else; Phase 2 links it to an appointment

`source` on the entry says where the row came from. Imported rows are `paper` and show no label anywhere in the app.

**Row-level security:** every table allows access only when `baby_id in (select baby_id from members where user_id = auth.uid())`.

**Seed data:**
- Sophie: born 2026-10-29 22:59 Central, day1_date 2026-10-30, weight 6 lb 9 oz (2,977 g), length 19 in (48.3 cm), head circumference blank until known
- Members: Tom (T) and Heidi (H). Emails are in `private/accounts.md` (git-ignored; the repo is public). Tom creates both auth users by hand; sign-ups stay off
- Reference metrics for Days 1-6 from §3.1 of the spec. Cite *Ascension Columbia St. Mary's Hospital, Breastfeeding and Diaper Record, 03-3210-20 Rev. 7/18*, except Day 1 feeds = 8, cited as a parent decision. Tom edits these rows in Supabase if the pediatrician gives new numbers, and records the pediatrician as the source

**Phase 2 tables:** `appointments`, `questions`, `push_subscriptions`.

---

## 4. Repo layout

```
src/
  domain/      time.ts · dayOfLife.ts · feed.ts · aggregate.ts · status.ts · growth.ts (+ *.test.ts)
  data/        db.ts (Dexie) · schemas.ts (zod) · sync.ts · supabase.ts
  ui/          Sheet · Stepper · Segmented · Swatches · StatusPill · TimeField · Toast · ErrorScreen
  screens/     Today · Timeline · QuickLog · LogFeed · LogDiaper · LogWeight · LogNote · Settings · SignIn
  styles/      tokens.css (from sophi.css) · base.css
supabase/      migrations/*.sql · seed.sql
scripts/       import-backfill.ts
e2e/           Playwright smoke tests
public/        icons and splash from design/brand/
```

`feed.ts` is one rule: what she drank = amount minus leftover. `growth.ts` holds the weight maths.

---

## 5. MVP milestones

### 5.1 M0 · Setup (Mon 11/9) ✅ done
- `git init`; Vite React TypeScript scaffold; oxlint + Prettier; Vitest; Playwright
- Hosted Supabase project; Vercel project; environment variables
- Add the dev, test, build and deploy commands to `CLAUDE.md`

**Done when** an empty app deploys to the Vercel URL and `npm test` runs. Both are true.

### 5.2 M1 · Domain core, test-first (Tue 11/10, morning)
- `time.ts`: convert an instant to Central time; format as "3:45 PM", adding CDT/CST only inside the repeated hour; `resolveLocal(date, time)` returns `ok` / `ambiguous` (2 instants) / `gap` (0 instants); UTC offset at an instant
- `dayOfLife.ts`: Central date minus `day1_date` + 1, with the birth hour on 10/29 counted as Day 1; `dayLength(date)` returns 23, 24 or 25 hours
- `feed.ts`: what she drank = amount minus leftover, never below zero. A paper feed with no amount adds 0 mL
- `aggregate.ts`: per-day feed count, formula mL, wet count and dirty count ("Both" adds one to each); rolling 24 hours; time since last feed; next feed time range. A feed with no amount still counts as a feed
- `status.ts`: On track / Watch / Below minimum per metric. **Pace rule (decided, one-behind grace):** during the day, Watch only when count < minimum × fraction of the Central day elapsed − 1 (using the real 23/24/25-hour length), otherwise On track. Once the day has ended, On track if count ≥ minimum, otherwise Below minimum. There is no "On pace" label
- `growth.ts`: pounds and ounces to grams and back; % change from birth weight; back-to-birth-weight check against Day 14

**Tests:**
- Fall back 11/1/2026 and 11/7/2027, spring forward 3/14/2027 (§6.1); the birth hour counts as Day 1
- A 1:45 AM CDT feed followed by a 1:10 AM CST feed on 11/1 are 25 min apart
- Pace: zero entries at 12:05 AM and at 3:00 AM are On track for every metric; zero feeds against a minimum of 8 is Watch at 6:00 AM; 6 of 8 feeds at 6 PM is On track; 3 of 4 wets at 5:30 PM is On track; 7 of 8 after the day ends is Below minimum
- The UI brief's Day 4 sample data (Mon 11/2, now = 5:30 PM) totals 330 mL
- 60 mL with 10 mL left in the bottle is 50 mL drunk; a paper feed with no amount counts toward the feed minimum and adds 0 mL
- 6 lb 9 oz is 2,977 g; 6 lb 4 oz is 5 oz under birth weight (5%)

**Done when** all of these pass, and pass again with the test run's `TZ` set to a zone other than Central (§8).

### 5.3 M2 · Backend (Tue 11/10)
- **First: turn off public sign-ups** in Supabase. Leave the session time-box and inactivity timeout off, so nobody is signed out for being idle
- Migrations: tables, kind enum, `source` column, `updated_at` trigger, row-level security. No `theme` column
- Seed Sophie, both members and the reference metrics. Tom creates the two auth users by hand with long random passwords
- Sign-in screen: email and password, one button, a plain-words error. The email is remembered on the device after the first sign-in and never hard-coded. Fields use `autocomplete` username / current-password so Keychain fills them. No "Forgot password", no "Create account"
- On the sign-in screen only, when the page was not opened from the home screen, show "Already set up? Open SophiTrack from the elephant icon on your home screen." Browser tabs are not blocked

**Done when** both parents can sign in, a third hand-made test account sees zero rows, and a sign-up attempt with the publishable key is refused.

### 5.4 M3 · Local store and sync (Tue 11/10 to Wed 11/11)
- Dexie table mirroring `entries`, plus an outbox of actions (create, update, delete)
- Push: send the outbox in order; retry when the phone comes back online, when the app returns to the foreground, and with backoff
- Pull: refetch all entries on open, on return to the foreground and on any Realtime event for this baby; replace the local copy, then re-apply the outbox
- Today always draws from the local copy and never waits on the network
- One pill, "Saved on this phone", shown only while the outbox is not empty. Nothing when everything is sent, no count, no red. The save toast is identical online and offline
- Once a phone has signed in, it always opens to Today and allows logging. A calm "Tap to reconnect" banner shows only when the server has rejected the session. A network error never signs anyone out, and a dead session never clears local data or the outbox

**Done when** an entry logged on phone A in airplane mode shows up on phone B within seconds of reconnecting, edits and deletes sync too, and a phone with a rejected session in airplane mode can still log a feed that uploads after reconnecting.

### 5.5 M4 · Logging (Wed 11/11)
- Port tokens; light/dark from the system setting; check status-pill contrast (4.5:1) in both themes. Every control and close button gets a 44 pt hit area. Main values 16-17 pt, secondary text 13 pt minimum, sized in rem, with pinch-zoom and iOS text scaling left on
- Shared components: bottom sheet (swipe down to close), stepper, **8-second toast with Undo**
- **Time field:** a single "Now" chip. Tapping it shows 5 / 15 / 30 min ago, 1 hr ago and "Other time", which opens the iPhone's built-in time picker. No date field when logging; a time that would be in the future is taken as yesterday and shown in words ("Yesterday, 11:50 PM"). A future time is never saved
- **Clock-change questions** stay, as plain two-button prompts: "Clocks went back an hour that night. Was this before or after?" and "2:30 AM didn't happen that night. Use 3:30 AM?". Never guess silently
- **+ menu:** two large tiles, Feed and Diaper, each showing its last value. One small row with Weight and Note. No Pump, Sleep or Question, and no "Defaults to your last values" caption
- **Log Feed:** time; "How much was in the bottle?" with a mL stepper that defaults to the last amount; "Left in bottle (optional)" collapsed, showing "She drank 50 mL" once filled; "Add a note"; Save button reading "Save · 60 mL". No method, no breast milk fields, no flags
- **Log Diaper:** Wet / Dirty / Both with nothing preselected; Save is disabled until one is tapped. Wet shows nothing else. Dirty and Both show one optional color row with nothing preselected, all eight swatches, yellow and brown first, with Red and White/chalky apart under a grey "Less common" heading. Picking either shows text only: "This color is worth mentioning to your pediatrician." Texture sits behind one closed row, "Add texture (optional)". The sheet fits one screen with no scrolling
- **Log Weight:** date (default today), pounds and ounces (ounces allow a decimal). Stored in grams. No grams input and no source picker
- **Log Note:** time and text
- **Editing:** tapping a Timeline row opens the same sheet in edit mode, with any date allowed and a labelled "Delete this entry" button at the bottom. Delete acts at once and shows the Undo toast; no confirmation dialog. Saving an edit that did not change the time never re-resolves the time. A paper feed with no amount can be saved with the amount still empty

**Done when** a feed can be logged in 2 taps from Today (Log feed, Save) and 3 via + (+, Feed, Save) using defaults; a diaper cannot be saved until its type is tapped; Undo restores a deleted entry within 8 seconds; and the sheets follow mockups 04, 08, 09, 11 and 12 for layout, minus everything this section removes.

### 5.6 M5 · Today and Timeline (Wed 11/11 to Thu 11/12)
- **Today header:** "Sophie · Day 11 · Mon, Nov 9", avatar on the right opening Settings
- **Feed card:** headline "Last feed 1 hr 45 min ago", a second plain line "Next feed about 5:45 to 6:45 PM", then the Log feed button. When the time range has passed, the card keeps its white fill and gains an amber outline and icon, headline "Time for a feed", sub-line "Last feed 3 hr 15 min ago · 3:45 PM"
- **"Today so far":** rows for feeds, wet diapers and dirty diapers as "6 of 8", each with a status icon and word. The Watch pill names the next step, e.g. "Watch · 1 more wet diaper". Under the pace rule a day in progress is only ever On track or Watch, so Below minimum never shows here
- **"Formula today · 330 mL":** a total, no split
- **Last diaper:** "Last diaper 3:45 PM · wet and dirty · Tom". Names in full on Today, initials in the Timeline
- **Weight line**, shown once a weight is logged: "6 lb 4 oz on Nov 6 · 5 oz under birth weight (5%)", with "goal: back to birth weight by Day 14" until she regains it, then "Back to birth weight"
- No tip banner and no partner-activity banner. Today updates live when the other parent logs something
- **Timeline:** grouped by day ("Day 4 · Mon, Nov 2") with one line of totals ("6 feeds · 330 mL · 3 wet · 2 dirty"); a finished day that missed a minimum shows "Below minimum" in its header with its icon and the sentence "Check with your pediatrician if this continues" in normal text color; filter chips All, Feeds, Diapers; "25-hr day" / "23-hr day" badges; CDT/CST labels only on 1:00-1:59 AM entries on fall-back night; tap a row to edit; no swipe gestures; empty state "Nothing logged yet. Tap + to log a feed."
- **Settings (read-only):** Sophie's photo, name and birth details; "Signed in as Heidi"; the version with the unsent count beside it ("v0.1 · 3 waiting to send"); a small Sign out at the bottom whose confirmation names any unsent entries. Signing out never deletes local data
- **Crash screen** (one error boundary): "Something went wrong. Your entries are safe. Tap to reopen." Raw error text is never shown

**Done when** Today shows the right counts, statuses and formula total for the Day 4 fixture, the Timeline's Day 3 (11/1) shows the 25-hr badge, a finished day that missed a minimum shows Below minimum in its Timeline header, and layout follows mockups 02, 03, 05, 06 and 15-17 minus the pump card, split bar, banners and extra tabs.

### 5.7 M6 · Install, backfill, launch (Thu 11/12)
- Manifest, home-screen icons and splash from `design/brand/`; standalone mode; safe areas; `theme-color` for light and dark
- Service worker precaches the app, so it opens with no signal. No update prompt: fetch a new version in the background and apply it only when the app goes to the background or at the next cold launch. An update keeps the outbox
- **Backfill:** the full paper set exists. Tom adds photos of every sheet for Days 1 to today to `tracking-items/` (git-ignored, local only) by Wed 11/11, so transcription runs alongside M5. Claude transcribes them into a CSV (local date, local time, zone if 1:xx AM on 11/1, kind, fields, who). Tom and Heidi check it, then `scripts/import-backfill.ts` validates with the same zod schemas and imports with `source = 'paper'`. Fix anything after that with in-app editing. This avoids building a backfill screen
- **Backfill rules for the old feeding detail:**
  - Each feed is imported as a plain feed with its total mL
  - The original detail goes in the note as written on the sheet, e.g. "1 mL colostrum" or "breastfed 25 min"
  - A breastfeeding-only session with no mL is imported as a feed with no amount, so it still counts toward that day's feed minimum
  - Pump sessions are not imported
  - Tom keeps the sheets and photos for at least a week after import
- Tom installs on both iPhones in person, signs in, saves the password to Keychain, and logs then undoes one test diaper on each
- Real-device checks: Keychain autofill works in the installed app; airplane mode plus a rejected session still logs a feed; live sync works between the two phones
- From here on, Tom tests on a Vercel preview link before merging and avoids evening deploys, since every push to `main` goes live

**Done when** the app is installed on both phones, the full history is in, and live sync works between them.

### 5.8 If behind schedule, cut in this order
Swipe gestures, the tip and partner banners, and everything to do with pumping are already out. What is left to cut:
1. Timeline filter chips
2. The "Add texture (optional)" row on the diaper sheet
3. Settings beyond "Signed in as", the version line and Sign out
4. The home-screen hint on the sign-in screen

**Never cut:** the time rules (UTC storage, Central days, the clock-change questions), live sync, offline logging, edit/delete and Undo. These are what make the data trustworthy.

---

## 6. Phase 2 (after 11/12), in order of value

1. **Feed reminders to both phones:** `push_subscriptions` table; VAPID keys; a `send-reminders` Edge Function run every minute by pg_cron; logging a feed clears the reminder for both. iPhone needs the app installed to the home screen (iOS 16.4+) and the permission prompt shown after a tap. Tom turns reminders on in person, from one "Turn on feed reminders" card on Today.
2. **Appointments and Growth card:** link weight entries to visits, add length and head circumference, mini chart of visit weights (basic weight logging ships in the MVP).
3. **Sleep timer** and sleep totals.
4. **Summary for the pediatrician:** one button that produces a printable day or week summary in plain words, with no technical columns. Until then Tom downloads data from Supabase. The full CSV with the §6.1 columns (local date, local time, zone, offset, UTC, day of life) stays a Tom-only export.
5. **Trends** charts (24 hrs / 7 days / 30 days): feeds, formula mL, diapers, weight. The Trends tab returns to the tab bar when this ships.
6. **Care:** bath (due every 3 days), temperature, medications, cord notes, questions list. The Care tab returns when this ships.
7. **iPad nursery display and desktop layouts** (mockups 23-31). They are designed but not assigned to a phase in the spec, and need the same formula-only changes as the phone screens.

## 7. Phase 3

Reference metrics beyond week 1 with sources (AAP, CDC/WHO, or the pediatrician); growth percentiles; photos and milestones; oz as a display option.

---

## 8. Testing approach

- **Domain unit tests** carry the weight. Run them on every change, with a fixed "now" (the brief's Day 4 at 5:30 PM) so tests don't depend on the real clock.
- **Run the unit tests a second time under a different `TZ`** (for example `TZ=Asia/Tokyo`, alongside the default run). Both runs must pass, which proves nothing depends on the device's zone.
- **Playwright smoke tests** (WebKit, 393 × 852): log a feed and see it on Today and the Timeline; log while offline and see it sync; Undo.
- **Row-level security check** with a third account, plus a refused sign-up.
- **Real-device pass** on both iPhones before calling any milestone shipped: installing, password sign-in with Keychain, offline launch, logging with a rejected session, and (in Phase 2) push.

---

## 9. Decisions and open questions

**Decided**

| Topic | Decision |
|---|---|
| Formula only (11/9) | Heidi no longer pumps or breastfeeds. No pump logging, breast milk portion, % breast milk, feeding method, breastfeeding detail or breast-milk-on-hand, in the app or the schema. A feed is time, formula mL, optional left in bottle, optional note. Today shows "Formula today · 330 mL" |
| Simplicity rule (11/9) | As minimal and easy as possible for Heidi. Two actions (Feed, Diaper), two screens (Today, Timeline). Tab bar: Today, +, Timeline. + menu: two large tiles, plus a small row with Weight and Note. See the guiding rules at the top |
| Pace rule (11/9) | One-behind grace. During the day, Watch only when count < minimum × fraction of the Central day elapsed − 1; otherwise On track. After the day ends, On track if count ≥ minimum, else Below minimum. "On pace" is dropped (§5.2) |
| Undo toast (11/9) | 8 seconds |
| Web address (11/9) | `sophitrack.vercel.app` is permanent |
| Sign-in (11/9) | Email + password. Tom creates both accounts by hand and installs and signs in on both phones in person. Sign-ups off is the first step of M2 |
| Weight units (11/9) | Pounds and ounces in the form, grams stored. Revisit after the Day 14 visit |
| Weight in the MVP | Yes: Log Weight form plus a "% from birth weight" line on Today |
| Day 1 minimum feeds | 8 (parents' choice; the hospital sheet shades 4) |
| Backfill | Full paper set exists; photos to `tracking-items/`, transcribed to CSV, imported by script. Old breast milk and breastfeeding detail becomes note text; a breastfeeding-only session becomes a feed with no amount; pump sessions are skipped. Photos and CSVs are git-ignored |
| Accounts | Tom and Heidi; emails in `private/accounts.md` (git-ignored) |
| Minimums | Stored as data with a source. Tom edits them in Supabase; there is no editor in the app |
| Birth weight | 6 lb 9 oz (2,977 g) |
| Birth length | 19 in (48.3 cm) |
| GitHub repo (11/9) | Stays public (Tom's decision). Nothing personal is ever committed: no sheet photos, backfill CSVs, emails or exports, and account passwords stay long and random |

**Still open**

| # | Question | Why it matters |
|---|---|---|
| 1 | Birth head circumference | Optional; blank until known (likely on the discharge papers) |
| 2 | Ask the pediatrician at the Day 14 visit whether the Day 6+ minimums are still right at this age | Today's status is measured against them. The hospital sheet was written for breastfed newborns in week one |
| 3 | Pace rule: when does zero feeds turn Watch? | The decided formula gives Watch just after 3:00 AM for a minimum of 8. Rounding the pace down to whole feeds gives 6:00 AM, which is what the review described. The §5.2 tests pass either way. `status.ts` is built to the decided formula unless Tom says otherwise before M1 |
