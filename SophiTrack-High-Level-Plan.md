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

1. **Log in 2 taps, one-handed, at 3am.** Quick-log buttons are the heart of the app. Every extra field is optional & defaults to the last value used.
2. **"Is she on track?" answered on the home screen.** Today's counts vs. the minimums for her day of life, in plain language.
3. **Days are Central Time calendar days.** Day of life = the Central date, counted from 10/30 = Day 1. One clock for everyone, so app totals match exported reports and what the pediatrician sees.
4. **Shared & live.** Either parent (Tom or Heidi) logs, the other sees it instantly. Each entry records who logged it.
5. **Easy to edit after the fact.** Backdate times, fix amounts, delete mistakes. Real life logging happens late.

---

## 2. What Gets Tracked

### 2.1 Feeds (one entry = one feeding session)
**Feeding plan:** bottle feeding, made up of formula plus pumped breast milk (including colostrum). The Feed form is built bottle-first. The paper log already shows mixed feeds like "60 mL + 1 mL colostrum."

| Field | Details |
|---|---|
| Start time | Defaults to now; editable |
| Total amount | mL (stepper with quick presets, e.g. 30 / 45 / 60 / 75 / 90 mL; defaults to last feed's amount) |
| Breast milk portion | Enter **either** mL of breast milk **or** % breast milk; the app calculates the other |
| Formula portion | Auto-calculated (total minus breast milk). Shown, not typed |
| Amount left in bottle (optional) | mL not finished; intake = amount prepared minus leftover |
| Method | Bottle (default), syringe/finger. Direct breastfeeding stays available as a secondary option (side, minutes per side) |
| Who fed | Auto-filled from logged-in parent |
| Notes / flags | Spit-up, fussiness, feeding difficulty |

**Example:** 60 mL total, 15 mL breast milk = 25% breast milk, 45 mL formula. Or enter 25% and the app fills in 15 mL.

If a bottle is only partly finished, the breast milk & formula amounts are reduced by the same proportion (assumes the bottle was mixed).

**Calculated:**
- Per feed: mL & % breast milk vs. formula
- Per day: feeds count, total intake, breast milk mL, formula mL, **% breast milk for the day**
- Trends: % breast milk over time
- Time since last feed, next feed window (last feed + 2-3 hrs, configurable)

### 2.2 Diapers
| Field | Details |
|---|---|
| Time | Defaults to now |
| Type | Wet, dirty, or both |
| Poop color | Picker: black/tarry (meconium), dark green, green/brown, greenish yellow, mustard yellow, brown, plus "unusual" (red, white/chalky) |
| Poop consistency | Sticky/tarry, seedy, pasty, loose, runny/watery, formed, hard |
| Pee color (optional) | Pale yellow, dark yellow, orange/pink crystals |
| Who changed | Auto-filled |
| Notes | Free text |

**Calculated:** wets & BMs per day of life vs. minimum, stool color progression over the first week.

### 2.3 Pumping (core feature)
All of Sophie's breast milk comes from pumping, so this is a core feature, not an optional extra.

| Field | Details |
|---|---|
| Start time | Defaults to now |
| Duration | Minutes (timer or manual) |
| Volume | Per side (L/R) or total, mL |
| Notes | Optional |

**Calculated:** sessions per 24 hrs, total mL pumped per 24 hrs, trend over time, time since last pump.

**Pumped vs. fed (Phase 2):** a simple "breast milk on hand" balance: mL pumped minus breast milk mL fed. This shows what's available for the next bottle, using data both parents are already logging.

### 2.4 Sleep
On the paper feeding log. Start & end time, or a running timer. Calculated: total sleep per 24 hrs, longest stretch.

### 2.5 Growth
| Field | Details |
|---|---|
| Weight | Date, weight (lb/oz or g), source (hospital or pediatrician visit) |
| Length & head circumference | From appointments |

Measurements are logged **from pediatrician visits only** for now (no home scale). They're entered as part of an Appointment, so each one is tied to the visit it came from. A source field keeps the door open for a home scale later.

**Calculated:** % change from birth weight, whether she's regained birth weight (target: by Day 14, 11/12), growth curve vs. reference charts.

### 2.6 Care & Health
- **Bath:** date logged; next bath due (default every 3 days, per the note on the hospital sheet)
- **Temperature:** reading, method, time
- **Medications / vitamins:** name, dose, time (e.g. vitamin drops if the pediatrician recommends them)
- **Umbilical cord, jaundice, skin:** quick notes with optional photo

### 2.7 Appointments & Questions
- **Questions list:** jot questions anytime (e.g. "Ask for nipple shields"), check them off at the visit
- **Appointments:** date, provider, weight/measurements taken, notes from the visit
- **Contacts:** pediatrician, Breastfeeding Helpline (414-585-1440 from the hospital sheet), one-tap call

### 2.8 Notes & Milestones
Free-form timeline notes (fussiness, cluster feeding, first smile). Photos optional, later phase.

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

- **Minimum feeds:** taken from the sheet's shaded boxes (8+ per day from Day 2; confirm the Day 1 number against the original sheet).
- **Weight:** some loss is normal in the first days; back to birth weight by Day 14 (Day 14 = **11/12**).
- **Expected patterns to surface as tips:** cluster feeding (3-4 feeds in 3-4 hrs, around Day 5, 11/3), growth spurts at 10-14 days (**~11/8 to 11/12**) & 5-6 weeks (**~11/27 to 12/10**).
- **Escalation rule from the sheet:** not meeting minimum feeds, wets & soiled diapers means call the pediatrician & Breastfeeding Helpline.

### 3.2 Beyond week 1 (to source in a later step)
Feeds per day, intake per feed & per day by age/weight, diaper counts, sleep totals, and weight/length/head percentiles. Pull from credible sources (AAP, CDC/WHO growth charts, the pediatrician) with a citation on every metric.

### 3.3 How status is shown
- **On track / Watch / Below minimum** for each metric on the home screen
- Flag unusual entries immediately (red/white/chalky stool, fewer wets than minimum by end of day)
- Always framed as "compare & ask your pediatrician," never as a diagnosis

---

## 4. App Structure

### 4.1 Navigation (bottom tab bar)
| Tab | Purpose |
|---|---|
| **Today** | Home dashboard: status vs. minimums, last feed/diaper, next feed window, quick-log buttons |
| **Timeline** | Chronological feed of all entries, filterable by type; edit/delete |
| **Trends** | Charts: intake, feeds, diapers, sleep, pumping, weight over time |
| **Care** | Growth, bath, health, appointments, questions list |
| **More** | Baby profile, reference metrics, settings, export, partner access |

Plus a persistent **"+" quick-log button** reachable from every tab.

### 4.2 Key screens (for mockups)
1. **Today dashboard:** "Day 5 of life" header (plus age in days/weeks once past week 1), time since last feed, next feed window, today's wets/BMs/feeds vs. minimums with status, today's total intake (mL) with % breast milk, today's mL pumped, last diaper, quick-log row (Feed, Diaper, Pump, Sleep)
2. **Quick-log sheet: Feed:** total mL stepper with presets, breast milk input with **mL / % toggle**, auto-calculated formula mL, a split bar showing breast milk vs. formula, optional "left in bottle," save. Direct breastfeeding tucked under "More options"
3. **Quick-log sheet: Diaper:** Wet / Dirty / Both buttons, color swatch picker, consistency chips, save
4. **Quick-log sheet: Pump:** timer or manual minutes, L/R mL steppers, today's pumped total
5. **Sleep timer:** start/stop with running clock, or manual entry
6. **Timeline:** grouped by day of life, icons per entry type, who logged it, swipe to edit/delete
7. **Day summary:** a digital version of the hospital sheet for any single day (feeds, wets, BMs, totals vs. minimums)
8. **Trends:** charts by metric with 24-hr / 7-day / 30-day ranges
9. **Growth:** measurements from pediatrician visits, % from birth weight, growth chart
10. **Care:** bath (last/next due), temperature, meds, notes
11. **Questions & appointments:** checklist plus visit notes
12. **Reference library:** day-by-day guidance & targets with sources
13. **Settings:** units, feed interval, Day 1 date, notifications, partner invite, export

### 4.3 Onboarding (first launch, one time)
Create baby profile: name (Sophie), birth date & time (pre-filled: 10/29/2026, 10:59 PM), Day 1 date (pre-filled: 10/30/2026; editable in Settings), reporting time zone (fixed: Central, America/Chicago), birth weight & length, feeding approach (pre-set: bottle, formula + pumped breast milk), units (pre-set: mL). Invite partner. Add to Home Screen prompt.

**Backfill:** since she's already several days old, onboarding should allow fast entry of past feeds & diapers from the paper sheets so the Day 1-6 history is complete.

---

## 5. Data Model (high level)

| Entity | Key fields |
|---|---|
| **Baby** | name, birth datetime (2026-10-29 22:59), day-1 date (2026-10-30), time zone (America/Chicago), birth weight, birth length, birth head circ. |
| **User** | name (Tom, Heidi), email, role (parent) |
| **FeedSession** | start time, end time, method (bottle/syringe/breast), total_ml, breast_milk_ml, formula_ml (derived), left_in_bottle_ml, entry_mode (ml or percent), logged_by, notes, flags |
| **BreastfeedDetail** (optional) | session_id, side, minutes. Only used for direct breastfeeding |
| **Diaper** | time, wet, dirty, poop color, consistency, pee color, logged_by, notes |
| **PumpSession** | start time, duration, volume L, volume R, notes |
| **Sleep** | start, end, logged_by |
| **Measurement** | date, weight, length, head circ., source (hospital/pediatrician), appointment_id |
| **CareEvent** | type (bath/temp/med/cord/other), time, value, notes, photo |
| **Question** | text, created, answered (y/n), answer notes, appointment_id |
| **Appointment** | date, provider, notes |
| **ReferenceMetric** | metric, age range (day/week), min, max, typical, source, source URL |
| **Settings** | units, feed interval, reporting time zone (America/Chicago), notification prefs |

Every timestamped entity also stores `utc_offset` at the moment of the event (-05:00 CDT or -06:00 CST). "Day of life" = (Central date of the event) minus 10/29, so 10/30 = Day 1. Full rules in Section 6.1.

---

## 6. Foundational Technical Basics

- **PWA setup:** web app manifest, home screen icon, standalone (no Safari bars), iPhone safe areas (notch & home bar), splash screen
- **Shared backend with auth:** two parent accounts on one baby profile; real-time sync (a hosted database like Supabase fits well)
- **Offline-first:** logging works with no signal and syncs when back online
- **Notifications:** feed window reminders, bath due, missed-minimum warnings. **Every reminder goes to both parents' phones.** iOS supports web push for home-screen web apps; each parent allows notifications once on their own phone. Logging a feed clears the reminder for both
- **Night-friendly:** large tap targets, minimal typing, low-brightness mode (styling comes later)
- **Units:** **mL everywhere** (matches the hospital sheets). oz can be added later as a display setting; all data is stored in mL
- **Export:** CSV and a printable day/week summary to bring to pediatrician visits
- **Privacy:** private login only, no public pages; data owned by the two of you
- **Hosting:** static web hosting with a custom domain or subdomain (e.g. Vercel)

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
6. **Durations come from UTC, not wall clock.** A feed from 1:45 AM CDT to 1:10 AM CST shows as 25 min, not negative. Same for sleep stretches & "time since last feed."

**How the 23/25-hour days show up:**
- **Daily totals** (feeds, wets, BMs, intake) stay per calendar day, which is how pediatricians & the hospital sheet count.
- Those 2 days get a small "25-hr day" / "23-hr day" badge in the app & reports, so a slightly high or low count makes sense.
- **"Last 24 hrs" metrics** on the Today screen use a true rolling 24 hours (UTC math), so they're never skewed.
- Trends can optionally normalize transition days to a 24-hour rate.

**Report/export format:** each row includes local date, local time, zone (CST/CDT), UTC offset, UTC timestamp, & day of life. Example: `2026-11-01 | 1:30 AM | CST | -06:00 | 2026-11-01T07:30:00Z | Day 3`.

**Implementation:** use a time-zone-aware library (Luxon, date-fns-tz, or the JS Temporal API) with the IANA zone `America/Chicago` for all conversions. Include unit tests for 11/1/2026, 3/14/2027 & 11/7/2027.

---

## 7. Phased Roadmap

| Phase | Scope |
|---|---|
| **1. MVP (use this week)** | Baby profile, 2-parent login & sync, Feed logging with breast milk mL/% split, Pump logging, Diaper logging, Today dashboard with day-of-life minimums (Days 1-6) & daily % breast milk, Timeline with edit/delete, backfill from paper sheets, PWA install. Target live before Day 14 (11/12) to track the return to birth weight |
| **2. On-track layer** | Sleep, appointments with measurements, Trends charts (incl. % breast milk), Day summary view, bath & care log, questions list, feed-window reminders to both phones, breast milk on hand (pumped minus fed) |
| **3. Reference & polish** | Expanded reference metrics database with sources (beyond week 1), growth chart percentiles, export for pediatrician, photos & milestones |

---

## 8. Decisions Made

| Topic | Decision |
|---|---|
| Day boundary | Midnight to midnight, Central Time; Day 1 = 10/30/2026 |
| Feeding plan | Bottle feeding: formula plus pumped breast milk. Each feed records the breast milk portion in mL or % |
| Units | mL |
| Weight & growth | Pediatrician visits only (for now) |
| Reminders | All reminders go to both parents |
