# SophiTrack: Build Plan

**Written:** Mon 11/9/2026 (Sophie's Day 11). **MVP target:** Thu 11/12/2026 (Day 14), per the High-Level Plan §7.
Companion to `SophiTrack-High-Level-Plan.md` (what to build) and `SophiTrack-UI-Brief.md` + `design/mockups/` (how it looks). This doc covers **how and in what order** to build it.

---

## 0. Starting point

- No code yet. Spec, UI brief, mockups and brand assets are done.
- That leaves ~3 working days to the MVP. The plan is ordered so each day ends with something usable, and §5.7 lists what to cut if it slips.
- Sophie is past Day 6, so **Today compares against the Day 6+ row** (6 wets, 2+ BMs, 8 feeds). The Day 1-5 thresholds matter for backfilled history and the Timeline.
- **Day 1 minimum feeds = 8** (parents' decision, 11/9). The hospital sheet shades only 4 boxes for Day 1, so record this metric's source as the parents' choice, not the sheet.
- **Backfill data includes direct breastfeeding** on Day 1 ("5 min each breast", "25 min breastfed"), so the schema needs `method: breast` with per-side minutes from the start, even though the UI tucks it under "More options."

---

## 1. Stack

| Layer | Choice | Why |
|---|---|---|
| App | **Vite + React + TypeScript**, single-page app | Static hosting, no server rendering needed, simplest path to an offline-first PWA |
| Styling | Plain CSS with tokens ported from `design/source/sophi.css` | The light/dark tokens and component styles already exist; no framework needed |
| Routing | React Router | Five tabs plus sheets; nothing fancier needed |
| Local data | **Dexie** (IndexedDB) + `useLiveQuery` | The UI reads only from the local database, so it works offline and updates instantly |
| Backend | **Supabase**: Postgres, Auth, Realtime, row-level security | Named in the spec; covers auth, sync and push (Edge Functions + pg_cron) in one service |
| Time | **Temporal** via `temporal-polyfill`, zone `America/Chicago` | `getPossibleInstantsFor()` returns 0, 1 or 2 instants for a local time, which maps directly to the spring-forward gap, a normal time, and the fall-back repeated hour (§6.1 rules 4-5). Luxon resolves those silently |
| Validation | **zod**, one schema per entry kind | Shared by forms, sync and the backfill importer |
| PWA | `vite-plugin-pwa` (Workbox) | Manifest, service worker and app-shell precache |
| Tests | **Vitest** (domain), **Playwright** with WebKit at iPhone size (smoke) | The domain rules carry most of the risk, so unit tests come first |
| Lint/format | **oxlint** + Prettier | oxlint is the current Vite scaffold default and much faster than ESLint |
| Hosting | **Vercel**, custom subdomain | Named in the spec |

**Auth gotcha:** on iPhone, a magic link opens in Safari, not in the home-screen app, which has its own separate storage, so the session lands in the wrong place. Use **6-digit email codes (OTP)** typed into the app. Turn off public sign-ups in Supabase and create the two parent accounts by hand.

---

## 2. Architecture

```
React screens ──read──▶ Dexie (IndexedDB) ◀──write── sync engine ◀──▶ Supabase
      │                       ▲                         │  push: outbox → upsert
      └──write (entry + outbox row)                     │  pull: rows with updated_at > last seen
                                                        │  live: Realtime on entries
domain/ (pure TypeScript, no React): time · day of life · feed math · aggregates · status
```

Design decisions:
- **Client-generated UUIDs.** Entries can be created offline, and retrying an upload never makes duplicates.
- **Soft delete** (`deleted_at`). Deletes sync like any other change, and **Undo** just clears the field.
- **Last write wins**, using a server-set `updated_at` (trigger). With two people, editing the same entry at once is rare.
- **Totals are computed on the phone** from local data. Volume is tiny (about 30 entries a day, about 11k a year), so there's no need for SQL views or server aggregation.
- **One `entries` table** for every timestamped log event (feed, diaper, pump, sleep, care, note), with `kind` plus a `data` JSON column validated by zod. That gives one sync path, one Timeline query and one Realtime channel. Things that aren't timeline events (baby, appointments, questions, reference metrics) get their own tables.

---

## 3. Data model (Postgres)

**MVP tables**

| Table | Columns |
|---|---|
| `babies` | id, name, birth_at `timestamptz`, day1_date `date`, tz (default `America/Chicago`), birth_weight_g, birth_length_cm, birth_head_cm |
| `members` | baby_id, user_id, display_name, initial (H/T). This is what row-level security checks against |
| `entries` | id `uuid`, baby_id, kind (enum), occurred_at `timestamptz`, utc_offset_min `smallint`, ended_at `timestamptz` null, logged_by, data `jsonb`, notes, created_at, updated_at, deleted_at |
| `settings` | baby_id, feed_interval_min (120), feed_window_min (60), theme |
| `reference_metrics` | metric, day_from, day_to, min, typical, max, note, source, source_url |

**`data` per kind (zod)**
- `feed`: total_ml, bm_ml, entry_mode (`ml`/`pct`), bm_pct (when typed as %), left_ml?, method (`bottle`/`syringe`/`breast`), sides? `[{side, minutes}]`, flags[]. Formula and intake are **derived, not stored**. Store mL with one decimal, since colostrum can be 1 mL.
- `diaper`: wet, dirty, stool_color?, consistency?, pee_color?
- `pump`: duration_min, left_ml?, right_ml?, total_ml
- `sleep`: uses `ended_at`
- `note`: text only
- `measurement` (MVP): weight_g, length_cm?, head_cm?, source (`hospital`/`pediatrician`/`home`). Stored as an entry in the MVP so it syncs like everything else; Phase 2 links it to an appointment

**Row-level security:** every table allows access only when `baby_id in (select baby_id from members where user_id = auth.uid())`.

**Seed data:**
- Sophie: born 2026-10-29 22:59 Central, day1_date 2026-10-30, weight 6 lb 9 oz (2,977 g), length 19 in (48.3 cm), head circumference blank until known
- Members: Tom (T) and Heidi (H). Emails are in `private/accounts.md` (git-ignored; the repo is public). Create both auth users by hand; sign-ups stay off
- Reference metrics for Days 1-6 from §3.1 of the spec. Cite *Ascension Columbia St. Mary's Hospital, Breastfeeding and Diaper Record, 03-3210-20 Rev. 7/18*, except Day 1 feeds = 8, cited as a parent decision

**Phase 2 tables:** `appointments`, `questions`, `push_subscriptions`.

---

## 4. Repo layout

```
src/
  domain/      time.ts · dayOfLife.ts · feed.ts · aggregate.ts · status.ts (+ *.test.ts)
  data/        db.ts (Dexie) · schemas.ts (zod) · sync.ts · supabase.ts
  ui/          Sheet · Stepper · PresetChips · Segmented · SplitBar · StatusPill · TimeField · Toast
  screens/     Today · Timeline · QuickLog · LogFeed · LogDiaper · LogPump · Settings · SignIn
  styles/      tokens.css (from sophi.css) · base.css
supabase/      migrations/*.sql · seed.sql
scripts/       import-backfill.ts
e2e/           Playwright smoke tests
public/        icons and splash from design/brand/
```

---

## 5. MVP milestones

### 5.1 M0 · Setup (Mon 11/9) ✅ done
- `git init`; Vite React TypeScript scaffold; oxlint + Prettier; Vitest; Playwright
- Hosted Supabase project, linked with the Supabase CLI; Vercel project; environment variables
- Add the dev, test, build and deploy commands to `CLAUDE.md`

**Done when** an empty app deploys to the Vercel URL and `npm test` runs.

### 5.2 M1 · Domain core, test-first (Mon 11/9)
- `time.ts`: convert an instant to Central time; format as "3:45 PM", adding CDT/CST only inside the repeated hour; `resolveLocal(date, time)` returns `ok` / `ambiguous` (2 instants) / `gap` (0 instants); UTC offset at an instant
- `dayOfLife.ts`: Central date minus `day1_date` + 1, with the birth hour on 10/29 counted as Day 1; `dayLength(date)` returns 23, 24 or 25 hours
- `feed.ts`: from mL, from %, proportional reduction for what's left in the bottle, formula = total minus breast milk
- `aggregate.ts`: per-day totals, rolling 24 hours, time since last feed, next feed window
- `status.ts`: On track / Watch / Below minimum per metric. **Pace rule (decided):** during the day, On pace if count ≥ minimum × fraction of the Central day elapsed (using the real 23/24/25-hour length), otherwise Watch; once the day has ended, On track if count ≥ minimum, otherwise Below minimum
- `growth.ts`: % change from birth weight; back-to-birth-weight check against Day 14

**Tests:** fall back 11/1/2026 and 11/7/2027, spring forward 3/14/2027 (§6.1); birth hour counts as Day 1; pace at 6 PM with 6 of 8 feeds is On pace; the brief's Day 4 sample data gives 330 mL / 85 mL / 26%; a feed spanning 1:45 AM CDT to 1:10 AM CST lasts 25 min; leftover reduces breast milk and formula proportionally.

**Done when** all of these pass.

### 5.3 M2 · Backend (Mon 11/9 to Tue 11/10)
- Migrations: tables, kind enum, `updated_at` trigger, row-level security, sign-ups off
- Seed Sophie, both members, and the reference metrics
- Sign-in screen with an email code

**Done when** both parents can sign in and a third test account sees zero rows.

### 5.4 M3 · Local store and sync (Tue 11/10)
- Dexie tables mirroring `entries`, plus an outbox
- Push: upload pending rows; retry when the phone comes back online, when the app returns to the foreground, and with backoff
- Pull: fetch changes since the last seen `updated_at`; subscribe to Realtime on `entries` for this baby
- "Offline · will sync" pill

**Done when** an entry logged on phone A in airplane mode shows up on phone B within seconds of reconnecting, and edits and deletes sync too.

### 5.5 M4 · Logging (Tue 11/10 to Wed 11/11)
- Port tokens; light/dark from the system setting
- Shared components: bottom sheet (swipe down to close), stepper, preset chips, mL/% toggle, live split bar, time field ("Now" chip, then a picker that blocks the skipped hour and asks "first or second 1:30?" in the repeated one), 5-second toast with Undo
- Quick-log menu (the + tab, with a small **Weight** option next to Note); Log Weight (date, lb/oz or g input, source; stored in grams); Log Feed; Log Diaper (including the calm note for unusual colors; "Add to questions" saves a note until Phase 2 adds Questions); Log Pump (timer start time kept in local storage so it survives switching apps)
- Every field defaults to the last entry of the same kind

**Done when** a feed can be logged in 2 taps (+, Feed, Save) using defaults, and the screens match mockups 04 and 08-13.

### 5.6 M5 · Today and Timeline (Wed 11/11)
- **Today:** header "Sophie · Day N of life"; next-feed card with an overdue state; progress against minimums with status; intake split bar; pumping card; last diaper; **weight line** (format: "[weight] at [date] visit · [±x]% from birth · goal: back to birth weight by Day 14"), shown once a weight is logged; tip banner from the reference data; banner when the other parent logs something (via Realtime)
- **Timeline:** grouped by day of life with one line of totals; filter chips; 23-hr / 25-hr badges; CDT/CST labels; tap to edit; swipe to edit or delete; empty state
- **Settings (minimal):** profile, sign out, app version

**Done when** the screens match mockups 02, 03, 05-07 and 15-17, and Day 3 (11/1) shows the 25-hr badge.

### 5.7 M6 · Install, backfill, launch (Thu 11/12)
- Manifest, home-screen icons and splash from `design/brand/`; standalone mode; safe areas; `theme-color` for light and dark
- Service worker precaches the app, so it opens with no signal
- **Backfill:** the full paper set exists. Tom adds photos of every sheet for Days 1 to today to `tracking-items/` (git-ignored, local only) (ideally by Wed 11/11 so transcription runs in parallel with M5). Claude transcribes them into a CSV (local date, local time, zone if 1:xx AM on 11/1, kind, fields, who). Tom and Heidi check it, then `scripts/import-backfill.ts` validates with the same zod schemas and imports. Fix anything after that with in-app editing. This avoids building a backfill screen.
- Install on both iPhones, sign in, and run a smoke test on the real devices

**Done when** the app is installed on both phones, the full history is in, and live sync works between them.

### 5.8 If behind schedule, cut in this order
1. Swipe gestures on the Timeline (tap to edit stays)
2. Tip banner and partner-activity banner
3. Pump timer (keep manual minutes)
4. Settings screen beyond sign-out

**Never cut:** the time rules, sync, offline logging, edit/delete and Undo. These are what make the data trustworthy.

---

## 6. Phase 2 (after 11/12), in order of value

1. **Feed-window reminders to both phones:** `push_subscriptions` table; VAPID keys; a `send-reminders` Edge Function run every minute by pg_cron; logging a feed clears the reminder for both. iPhone needs the app installed to the home screen (iOS 16.4+) and the permission prompt shown after a tap.
2. **Appointments and Growth card:** link weight entries to visits, add length and head circumference, mini chart of visit weights (basic weight logging ships in the MVP).
3. **Sleep timer** and sleep totals.
4. **Day Summary and Export:** CSV with the §6.1 columns (local date, local time, zone, offset, UTC, day of life); printable day/week summary.
5. **Trends** charts (24 hrs / 7 days / 30 days).
6. **Care:** bath (due every 3 days), temperature, medications, cord notes, questions list.
7. **Breast milk on hand** (pumped minus fed).
8. **iPad nursery display and desktop layouts** (mockups 23-31). They are designed but not assigned to a phase in the spec.

## 7. Phase 3

Reference metrics beyond week 1 with sources (AAP, CDC/WHO); growth percentiles; photos and milestones; oz as a display option.

---

## 8. Testing approach

- **Domain unit tests** carry the weight. Run them on every change, with a fixed "now" (the brief's Day 4 at 5:30 PM) so tests don't depend on the real clock.
- **Playwright smoke tests** (WebKit, 393 × 852): log a feed and see it on Today and the Timeline; log while offline and see it sync; Undo.
- **Row-level security check** with a third account.
- **Real-device pass** on both iPhones before calling any milestone shipped: installing, OTP sign-in, offline launch, and (in Phase 2) push.

---

## 9. Decisions (11/9) and open questions

**Decided**

| Topic | Decision |
|---|---|
| Weight in the MVP | Yes: Log Weight form plus a "% from birth weight" line on Today |
| Day 1 minimum feeds | 8 (parents' choice; the hospital sheet shades 4) |
| Pace rule | Pro-rated by share of the Central day elapsed (§5.2) |
| Backfill | Full paper set exists; photos to `tracking-items/`, transcribed to CSV, imported by script. Photos and CSVs are git-ignored |
| Accounts | Tom and Heidi; emails in `private/accounts.md` (git-ignored) |
| Hosting | Default `*.vercel.app` URL for now. Switching to a custom domain later means re-installing on both phones and signing in again, since each web address has its own storage |
| Birth weight | 6 lb 9 oz (2,977 g) |
| Birth length | 19 in (48.3 cm) |

**Still open**

| # | Question | Why it matters |
|---|---|---|
| 1 | Birth head circumference | Optional; blank until known (likely on the discharge papers) |
