# SophiTrack: High-Level App Plan

**Purpose:** A shared newborn tracker for Tom & Heidi to track their daughter Sophie. It replaces the paper hospital sheets and shows at a glance whether Sophie is on track for her day of life.

**Format:** Mobile web app (PWA), optimized for iPhone, added to both home screens. One shared baby profile, two parent logins, real-time sync between phones.

**Baby: Sophie**
| | Date & time (America/Chicago) | Used for |
|---|---|---|
| **Birth time** | Thursday, 10/29/2026, 10:59 PM | Profile & records only |
| **Day 1** | Friday, 10/30/2026 (midnight to midnight) | Every day-of-life calculation in the app |

- Days roll over at **midnight Central Time**. Day 1 = the calendar date 10/30, matching the hospital sheet (10/30 = Day 1, 11/2 = Day 4).
- **Birth hour:** anything logged between birth (10/29 10:59 PM) and midnight counts toward Day 1.
- Midnight is always safe: US clock changes happen at 2:00 AM, so midnight occurs exactly once every day. See **Section 6.1 Time Handling** for how time changes are handled.

**Source material reviewed:**
- `SophiTrack App - Tracking List.md` (diapers, bottle feeding, pumping, extras)
- `brestfeeding-diaper-record.jpeg` (hospital Breastfeeding & Diaper Record: day-of-life minimums, R/L breast timing, combo feeds)
- `feeding-log.jpeg` (hourly Baby Feeding Log: feed oz/mL, pee/poo, sleep, "next feed" window, notes)
- `week-one-info.jpeg` (Day 1-6 guidance: stool color changes, wet diaper minimums, weight, cluster feeding, growth spurts)

---

## 1. Core Principles

1. **As simple as possible for Heidi.** She is not technical, so her whole app is two actions (Feed, Diaper) and two screens (Today, Timeline). Nothing appears on screen until it works. Tom does all setup (install, sign-in, minimums, backfill) in person or in the database, never in her app.
2. **Log in 2 taps, one-handed, at 3am.** The big Log feed button on Today is the heart of the app. Every extra field is optional. Amounts default to the last value used; a default never records something nobody looked at, so diaper type & poop color are never preselected.
3. **"Is she on track?" answered on the home screen.** Today's counts vs. the minimums for her day of life, in plain, calm language.
4. **Days are Central Time calendar days.** Day of life = the Central date, counted from 10/30 = Day 1. One clock for everyone, so app totals match exported reports and what the pediatrician sees.
5. **Shared & live.** Either parent (Tom or Heidi) logs, the other sees it instantly. Each entry records who logged it.
6. **Saving never fails and never asks a technical question.** Entries are written to the phone first and sent when there is signal. Every save & delete shows an 8-second toast with Undo.
7. **Easy to edit after the fact.** Backdate times, fix amounts, delete mistakes. Real life logging happens late.

---

## 2. What Gets Tracked

### 2.1 Feeds (one entry = one bottle of formula)
**Feeding plan:** formula only, by bottle, as of 11/9/2026. Every new feed is a bottle of formula, so the form has no feeding-method field.

| Field | Details |
|---|---|
| Time | Defaults to now; editable |
| Amount | mL (stepper with quick presets, e.g. 30 / 45 / 60 / 75 / 90 mL; defaults to last feed's amount) |
| Amount left in bottle (optional) | mL not finished; she drank = amount minus leftover. Shown as "She drank 50 mL" |
| Who fed | Auto-filled from logged-in parent |
| Note (optional) | Free text: spit-up, fussiness, feeding difficulty |

**Example:** 60 mL bottle, 10 mL left = she drank 50 mL.

**Calculated:**
- Per day: feeds count, total formula (mL)
- Time since last feed, next feed time (last feed + 2-3 hrs, configurable)

**Feeds from the paper sheets (Days 1-10):** the early sheets include colostrum, breast milk & direct breastfeeding. Each is imported as a plain feed with its total mL, and the original detail is kept as note text (e.g. "1 mL colostrum", "breastfed 25 min"). A breastfeeding-only session with no mL is imported as a feed with no amount, so it still counts toward that day's feed minimum. Amount is optional **only** for imported entries.

### 2.2 Diapers
| Field | Details |
|---|---|
| Time | Defaults to now |
| Type | Wet, dirty, or both. Nothing preselected; Save stays off until one is tapped |
| Poop color (optional, dirty/both only) | Picker, nothing preselected: black/tarry (meconium), dark green, green/brown, greenish yellow, mustard yellow, brown, plus a separate "Less common" group (red, white/chalky) |
| Poop texture (optional) | Behind one closed row: sticky/tarry, seedy, pasty, loose, runny/watery, formed, hard |
| Pee color | Pale yellow, dark yellow, orange/pink crystals. Kept in the data for the paper sheets; not on the MVP form (a note covers it) |
| Who changed | Auto-filled |
| Notes | Free text |

**Calculated:** wets & BMs per day of life vs. minimum, stool color progression over the first week.

### 2.3 Sleep
On the paper feeding log. Start & end time, or a running timer. Calculated: total sleep per 24 hrs, longest stretch. Phase 2.

### 2.4 Growth
| Field | Details |
|---|---|
| Weight | Date (defaults to today), pounds & ounces (ounces allow a decimal). Stored in grams |
| Length & head circumference | From appointments (Phase 2) |

Measurements are logged **from pediatrician visits only** for now (no home scale), so the place is recorded as "pediatrician" without asking. Weight entry is in the MVP as a small Weight link in the + menu. Pounds & ounces is the default; revisit after the Day 14 visit if the pediatrician reports grams. In Phase 2 measurements are tied to the Appointment they came from.

**Birth measurements:** 6 lb 9 oz (2,977 g), 19 in.

**Calculated:** % change from birth weight (shown on Today, e.g. "6 lb 4 oz on Nov 6 · 5 oz under birth weight (5%)"), whether she's regained birth weight (target: by Day 14, 11/12), growth curve vs. reference charts (Phase 3).

### 2.5 Care & Health
- **Bath:** date logged; next bath due (default every 3 days, per the note on the hospital sheet)
- **Temperature:** reading, method, time
- **Medications / vitamins:** name, dose, time (e.g. vitamin drops if the pediatrician recommends them)
- **Umbilical cord, jaundice, skin:** quick notes with optional photo

### 2.6 Appointments & Questions
- **Questions list:** jot questions anytime (e.g. "Ask about vitamin drops"), check them off at the visit
- **Appointments:** date, provider, weight/measurements taken, notes from the visit
- **Contacts:** pediatrician, one-tap call

### 2.7 Notes & Milestones
Free-form timeline notes (fussiness, cluster feeding, first smile). A plain Note is in the MVP (small link in the + menu). Photos optional, later phase.

---

## 3. Reference Metrics ("Is she on track?")

Store reference targets as data (not hard-coded), each with its source, so they can be updated & expanded.

### 3.1 First 6 days (from the hospital Breastfeeding & Diaper Record)
Each day of life is one Central Time calendar date (midnight to midnight).

| Day of life | Date | Min. wets | Min. BMs | Expected stool |
|---|---|---|---|---|
| Day 1 | 10/30 (+ birth hour on 10/29) | 1 | 1 | Tarry black/green (meconium) |
| Day 2 | 10/31 | 2 | 2 | Dark green, less sticky |
| Day 3 | 11/1 (25 hrs, clocks fell back) | 3 | 2 | Meconium to dark green to green/brown, at least "quarter size" |
| Day 4 | 11/2 | 4 | 2+ | Greenish yellow to yellowish brown, loose not watery |
| Day 5 | 11/3 | 5 | 2+ (2-5 typical) | Yellow, seedy, loose. Wets pale yellow |
| Day 6+ | 11/4 onward | 6+ | 2+ | Yellow, seedy |

- **Minimum feeds:** 8 per day from Day 1 onward. Days 2-6 come from the sheet's shaded boxes. The sheet shades only 4 boxes for Day 1; 8 on Day 1 is the parents' decision and is recorded with that source.
- **Weight:** some loss is normal in the first days; back to birth weight by Day 14 (Day 14 = **11/12**).
- **Expected patterns to surface as tips:** cluster feeding (3-4 feeds in 3-4 hrs, around Day 5, 11/3), growth spurts at 10-14 days (**~11/8 to 11/12**) & 5-6 weeks (**~11/27 to 12/10**).
- **Escalation rule from the sheet:** not meeting minimum feeds, wets & soiled diapers means call the pediatrician.

### 3.2 Beyond week 1 (to source in a later step)
Feeds per day, formula per feed & per day by age/weight, diaper counts, sleep totals, and weight/length/head percentiles. Pull from credible sources (AAP, CDC/WHO growth charts, the pediatrician) with a citation on every metric.

### 3.3 How status is shown
- **On track / Watch / Below minimum** for each metric, always with an icon and the word, never color alone. No other status words. Today shows On track or Watch; Below minimum applies only to a finished day, so in the MVP it shows on that day's header in the Timeline.
- **During the day (one-behind grace):** Watch only when count < minimum × fraction of the Central day elapsed − 1; otherwise On track. Example: with a minimum of 8 feeds, 6 feeds at 6:00 PM is On track (8 × 0.75 − 1 = 5), and nothing logged at 3:00 AM is still On track.
- **After the day ends:** On track if count ≥ minimum, otherwise Below minimum.
- The Watch label says the next step, e.g. "Watch · 1 more wet diaper."
- Flag unusual entries with a calm text note (red or white/chalky stool: "This color is worth mentioning to your pediatrician.")
- Always framed as "compare & ask your pediatrician," never as a diagnosis. Calm wording, no red fills on Today.

---

## 4. App Structure

### 4.1 Navigation (bottom tab bar)
| Tab | Purpose |
|---|---|
| **Today** | Home dashboard: last feed, next feed time, Log feed button, status vs. minimums, formula today, last diaper, latest weight |
| **+** | Quick-log menu, reachable from every screen: two large tiles (**Feed**, **Diaper**, each showing its last value) and a small row with **Weight** and **Note** |
| **Timeline** | Chronological list of all entries, filterable by type; tap a row to edit or delete |

- **Trends** and **Care** tabs return when they are built (Phase 2). No tab is shown before it works.
- **Settings** sits behind Sophie's avatar. There is no "More" tab.

### 4.2 Key screens (for mockups)
**MVP**
1. **Today dashboard:** header "Sophie · Day 11 · Mon, Nov 9"; feed card ("Last feed 1 hr 45 min ago", "Next feed about 5:45 to 6:45 PM", Log feed button; when late, a calm "Time for a feed"); "Today so far" with feeds/wets/BMs as "6 of 8" plus status; "Formula today · 330 mL" (a total, no split); last diaper; latest weight with % from birth weight
2. **Quick-log sheet: Feed:** time chip (Now), amount stepper with presets, optional "Left in bottle" (shows "She drank 50 mL"), "Add a note", Save. 2 taps from Today (Log feed, Save)
3. **Quick-log sheet: Diaper:** Wet / Dirty / Both buttons (nothing preselected), optional color swatch row for dirty/both, "Add texture (optional)", Save. Fits one screen with no scrolling
4. **Weight & Note sheets:** date plus pounds & ounces; free-text note
5. **Timeline:** grouped by day of life with day totals, icons per entry type, who logged it, filter chips (All, Feeds, Diapers). Tap a row to open it in edit mode, with a labelled "Delete this entry" button; delete acts immediately and shows the Undo toast
6. **Settings (read-only):** Sophie's photo, name & birth details, who is signed in, app version, Sign out (with a confirmation)

**Later phases**
7. **Sleep timer:** start/stop with running clock, or manual entry
8. **Day summary:** a digital version of the hospital sheet for any single day (feeds, wets, BMs, totals vs. minimums)
9. **Trends:** charts by metric (formula, feeds, diapers, sleep, weight) with 24-hr / 7-day / 30-day ranges
10. **Growth:** measurements from pediatrician visits, % from birth weight, growth chart
11. **Care:** bath (last/next due), temperature, meds, notes
12. **Questions & appointments:** checklist plus visit notes
13. **Reference library:** day-by-day guidance & targets with sources
14. **Full Settings:** feed interval, notifications, export

### 4.3 Setup (no in-app onboarding in the MVP)
Tom sets up both phones in person: opens sophitrack.vercel.app, adds it to the Home Screen, signs in, saves the password to the phone's keychain, then logs & undoes one test diaper. Heidi never sees a setup step.

The baby profile is created as data, not through a screen: name (Sophie), birth date & time (10/29/2026, 10:59 PM), Day 1 date (10/30/2026), reporting time zone (fixed: Central, America/Chicago), birth weight & length (6 lb 9 oz, 19 in), feeding approach (formula), units (mL). Tom changes minimums or the Day 1 date in the database, recording the pediatrician as the source.

**Backfill:** the paper sheets for Days 1-10 are photographed, transcribed to a CSV, checked by both parents, then loaded with an import script, so the history is complete without a backfill screen. Feeds are imported as described in Section 2.1; pump sessions are not imported. Photos & CSVs stay off the public repo.

---

## 5. Data Model (high level)

Every timestamped log event is one **entry** with a kind: feed, diaper, sleep, care, note, or measurement. That gives one Timeline, one sync path & one way to edit, delete & undo.

| Entity | Key fields |
|---|---|
| **Baby** | name, birth datetime (2026-10-29 22:59), day-1 date (2026-10-30), time zone (America/Chicago), birth weight, birth length, birth head circ. |
| **User** | name (Tom, Heidi), email, role (parent) |
| **Entry** (all kinds) | kind, time (UTC), utc_offset, end time (optional), logged_by, source (app or paper), notes, deleted (soft delete, so Undo works) |
| **FeedSession** (kind: feed) | time, amount_ml (formula; required, except on imported paper entries), left_ml (optional, left in bottle), logged_by, notes |
| **Diaper** (kind: diaper) | time, wet, dirty, poop color, consistency, pee color, logged_by, notes |
| **Sleep** (kind: sleep) | start, end, logged_by |
| **Measurement** (kind: measurement) | date, weight (g), length, head circ., place (hospital/pediatrician/home), appointment_id (Phase 2) |
| **CareEvent** (kind: care) | type (bath/temp/med/cord/other), time, value, notes, photo |
| **Note** (kind: note) | time, text, logged_by |
| **Question** | text, created, answered (y/n), answer notes, appointment_id |
| **Appointment** | date, provider, notes |
| **ReferenceMetric** | metric, age range (day/week), min, max, typical, source, source URL |
| **Settings** | units, feed interval, reporting time zone (America/Chicago), notification prefs |

Entries imported from the paper sheets are marked in the data (source = paper) & show no label in the app.

Every entry also stores `utc_offset` at the moment of the event (-05:00 CDT or -06:00 CST). "Day of life" = (Central date of the event) minus 10/29, so 10/30 = Day 1. Full rules in Section 6.1.

---

## 6. Foundational Technical Basics

- **PWA setup:** web app manifest, home screen icon, standalone (no Safari bars), iPhone safe areas (notch & home bar), splash screen
- **Shared backend with auth:** two parent accounts on one baby profile; real-time sync (a hosted database like Supabase fits well)
- **Sign-in:** email + password. Tom creates both accounts by hand and signs in on both phones in person; public sign-ups are turned off. No "Create account" or "Forgot password" screens. Once a phone has signed in, the app always opens to Today and allows logging; a calm "Tap to reconnect" banner appears only if the session has ended
- **Offline-first:** logging works with no signal and syncs when back online. Today always draws from the copy on the phone and never waits on the network. The only sign is a "Saved on this phone" pill while entries are waiting to send
- **Updates:** fetched in the background & applied only when the app is closed or reopened, never over a half-filled form
- **Notifications (Phase 2):** feed-time reminders, bath due, missed-minimum warnings. **Every reminder goes to both parents' phones.** iOS supports web push for home-screen web apps; each parent allows notifications once on their own phone. Logging a feed clears the reminder for both
- **Night-friendly:** large tap targets, minimal typing, low-brightness mode (styling comes later)
- **Units:** **mL everywhere** (matches the hospital sheets). oz can be added later as a display setting; all data is stored in mL
- **Export:** CSV and a printable day/week summary to bring to pediatrician visits. For now Tom downloads from the database; a single "Summary for the pediatrician" button comes in a later phase
- **Privacy:** private login only, no public pages; data owned by the two of you
- **Hosting:** static web hosting on Vercel. **https://sophitrack.vercel.app** is the permanent address, so nobody has to reinstall

### 6.1 Time Handling (Central Time, DST-safe)

**The problem:** twice a year Central Time changes clocks at 2:00 AM.
- **Fall back** (11/1/2026, 11/7/2027): 1:00-1:59 AM happens twice, first in CDT (UTC-5), then CST (UTC-6). That day is 25 hours.
- **Spring forward** (3/14/2027): clocks jump from 2:00 AM to 3:00 AM. 2:00-2:59 AM doesn't exist. That day is 23 hours.

**The workaround, in 6 rules:**
1. **Store every event as a UTC timestamp** (Postgres `timestamptz`) plus its UTC offset at that moment. UTC never repeats or skips, so ordering & durations are always exact. Never store local time alone, and never hard-code "-6".
2. **All reporting & day bucketing use `America/Chicago`,** not the phone's time zone. If a phone is set to another zone (travel), entries still land on the correct Central date & time.
3. **Day boundaries = midnight Central.** Midnight occurs once every day, so no special rule is needed for the boundary itself.
4. **Repeated hour (fall back): label it.** Entries between 1:00 & 1:59 AM on fall-back night show the zone: "1:30 AM CDT" vs. "1:30 AM CST." Live logging gets this right automatically from the device clock. Backdated/manual entries in that hour prompt: "First 1:30 (before clocks changed) or second 1:30 (after)?"
5. **Skipped hour (spring forward): block it.** The time picker won't accept 2:00-2:59 AM on 3/14/2027 & suggests 3:xx AM instead.
6. **Durations come from UTC, not wall clock.** A formula feed at 1:45 AM CDT, viewed at 1:10 AM CST, shows "last feed 25 min ago," not a negative time. Same for sleep stretches.

**How the 23/25-hour days show up:**
- **Daily totals** (feeds, wets, BMs, formula mL) stay per calendar day, which is how pediatricians & the hospital sheet count.
- Those 2 days get a small "25-hr day" / "23-hr day" badge in the app & reports, so a slightly high or low count makes sense.
- **"Last 24 hrs" metrics** on the Today screen use a true rolling 24 hours (UTC math), so they're never skewed.
- Trends can optionally normalize transition days to a 24-hour rate.

**Report/export format:** each row includes local date, local time, zone (CST/CDT), UTC offset, UTC timestamp, & day of life. Example: `2026-11-01 | 1:30 AM | CST | -06:00 | 2026-11-01T07:30:00Z | Day 3`.

**Implementation:** use the JS Temporal API via `temporal-polyfill` (chosen in the Build Plan) with the IANA zone `America/Chicago` for all conversions. Include unit tests for 11/1/2026, 3/14/2027 & 11/7/2027.

---

## 7. Phased Roadmap

| Phase | Scope |
|---|---|
| **1. MVP (use this week)** | Baby profile, 2-parent login & sync, Feed logging (formula mL, left in bottle), Diaper logging, Weight entry with % from birth weight, Notes, Today dashboard with day-of-life minimums (Days 1-6+) & formula total, Timeline with edit/delete & Undo, offline logging, backfill from paper sheets, PWA install. Target live by Day 14 (Thu 11/12) to track the return to birth weight |
| **2. On-track layer** | Sleep, appointments with measurements, Trends charts, Day summary view, bath & care log, questions list, feed-time reminders to both phones, "Summary for the pediatrician" export button |
| **3. Reference & polish** | Expanded reference metrics database with sources (beyond week 1), growth chart percentiles, photos & milestones, oz as a display option |

---

## 8. Decisions Made

| Topic | Decision |
|---|---|
| Day boundary | Midnight to midnight, Central Time; Day 1 = 10/30/2026 |
| Feeding plan | Formula only as of 11/9/2026. No pumping or breastfeeding features or tracked values. A feed is time, amount (mL), optional left in bottle, optional note |
| Paper-sheet history | Days 1-10 are imported as plain feeds with total mL; the original detail (colostrum, breast milk, breastfeeding minutes) is kept as note text. Pump sessions are not imported |
| Simplicity first | The app is as minimal as possible for Heidi: two actions (Feed, Diaper), two screens (Today, Timeline), tab bar of Today, +, Timeline. Tom does all setup |
| Units | mL |
| Day 1 minimum feeds | 8 (parents' choice; the hospital sheet shades 4 boxes for Day 1) |
| Pace rule | One-behind grace. During the day: Watch only when count < minimum × fraction of the Central day elapsed − 1, otherwise On track. After the day ends: On track if count ≥ minimum, else Below minimum. The label "On pace" is not used |
| Undo | Toast with Undo lasts 8 seconds, after every save & delete |
| Weight & growth | Pediatrician visits only (for now). Weight entry is in the MVP, in pounds & ounces (revisit after the Day 14 visit), with a "% from birth weight" line |
| Sign-in | Email + password. Tom creates both accounts by hand and installs & signs in on both phones in person. Public sign-ups are turned off first, before the backend is built |
| Web address | https://sophitrack.vercel.app is permanent |
| Reminders | All reminders go to both parents |

**Still open:** whether to make the GitHub repo private again (currently public; private is recommended).
