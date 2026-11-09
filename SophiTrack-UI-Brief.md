# SophiTrack: UI Brief for Mockups

> **Updated 11/9/2026.** This brief now doubles as the build reference for each screen.
> The PNG mockups in `design/mockups/` predate the 11/9 formula-only and simplification decisions.
> Where the mockups and this brief differ, this brief wins.

The full product plan is in `SophiTrack-High-Level-Plan.md`. This brief covers what each screen shows and how it behaves.

---

## 1. What You're Designing

SophiTrack is a private newborn tracker for two parents, Heidi (Mom) & Tom (Dad), to track their daughter Sophie. It runs as a web app saved to the iPhone home screen. Both parents log feeds and diapers, often at 3am with Sophie in one arm. The app answers one question at a glance: **"Is Sophie on track today?"**

**Feeding setup (as of 11/9/2026):** formula only, by bottle. A feed is a time, an amount in mL, an optional "left in bottle" amount and an optional note. Nothing in the app tracks pumping, breast milk or breastfeeding.

**Who it is for:** Heidi is the everyday user and is not technical. Her whole app is **two actions (Feed, Diaper) and two screens (Today, Timeline)**. Tom does all setup (install, sign-in, passwords, minimums, backfill) in person or in Supabase, never in her app.

---

## 2. Format & Constraints

| Item | Spec |
|---|---|
| Device | iPhone, portrait only. Frame: 393 x 852 pt (iPhone 15/16) |
| Mode | Home-screen web app, full screen (no Safari bars). Respect the notch/Dynamic Island & home indicator safe areas |
| Light & dark | Every MVP screen works in light & dark mode. Dark mode is the main night-time mode |
| Style | Clean & simple, using the app icon's colors as accents (see 2.1). The full palette & fonts are finalized later |
| Units | mL only. Weight is entered in pounds & ounces |
| Time | Central Time, 12-hour clock (e.g. 3:45 PM) |
| Type & targets | Main values 16-17 pt, secondary text 13 pt minimum, sized in rem. Pinch-zoom & iOS text scaling stay on. Every control & close button has a 44 pt hit area (pad it if the drawing is smaller). Status pills meet 4.5:1 contrast in both themes |

### Design priorities
1. **One thumb, 2 taps to log.** A feed is 2 taps from Today (Log feed, Save) and 3 via +. The main actions sit in the bottom half of the screen. Tap targets at least 44 pt.
2. **Glanceable status.** The day's progress vs. minimums is readable in under 3 seconds.
3. **Minimal typing.** Steppers, presets & chips instead of keyboards. Only a note needs the keyboard.
4. **A default may save a tap but must never record something nobody looked at.** The feed amount defaults to the last value used. Diaper type & poop color have no default.
5. **Status never relies on color alone.** Pair each status with an icon & a word (On track / Watch / Below minimum).
6. **Calm, not alarming.** Warnings are clear but never scary; they suggest "check with your pediatrician." No red fills on Today.
7. **Saving never fails and never asks a technical question.** Entries are written to the phone first. The only messages Heidi can ever see are the save toast with Undo, "Saved on this phone", "Tap to reconnect" and a crash screen saying her entries are safe.
8. **Fewer things.** Nothing appears on screen until it works. One word per idea (see the word list in 6.1).

### 2.1 App Icon & Logo (provided asset)
**File:** `assets/sophitrack-app-icon.png` (2000 x 2000 px PNG, transparent outside a rounded cream square). **This is the app icon. Keep the elephant mark & wordmark as designed; don't redraw them.**

**What it shows:** a single-line drawing of a baby elephant with a curled trunk & a coral dot for an eye, above the wordmark "SophiTrack." "Sophi" is in teal, "Track" is in warm gray, and the dot over the "i" is coral to match the eye.

**Colors in the icon (reference):**
| Role | Hex |
|---|---|
| Cream background | #FBF5E7 |
| Warm gray (elephant line, "Track") | #63605B |
| Teal ("Sophi") | #5D94A6 |
| Coral (eye, dot on the "i") | #D97757 |

**Please create from this icon:**
1. **Logo lockups:**
   - Horizontal: elephant on the left, wordmark on the right
   - Stacked: elephant above the wordmark (as in the icon)
   - Elephant mark on its own
   - Wordmark on its own
   - A light version (on cream/white) & a dark version (on a dark background, for night mode). Swap the warm gray for an off-white in the dark version; keep teal & coral
2. **Home-screen icon:** elephant mark only on a full-bleed cream square with square corners (iOS rounds the corners itself). At home-screen size (about 60 pt) the wordmark would be too small to read, so leave it out. Show it at 180 x 180 px & in a mock iPhone home screen row
3. **Splash screen:** the stacked logo centered on cream, shown while the app opens

**Where the logo appears in the mockups:**
- Splash screen (new frame)
- Lock-screen notification: the elephant mark as the app icon
- Settings & Profile: small horizontal logo at the bottom with the app version
- Not in the Today header; that space stays for Sophie's name, day of life & her avatar

**UI colors:** the icon's 4 colors are the starting point for the app's palette. Use them in the mockups as accents (e.g. teal for the main buttons, coral sparingly for highlights). The full UI palette, including status colors & dark mode, gets finalized later.

---

## 3. Navigation

**Bottom tab bar (3 slots):**

| Today | **+** (center, raised) | Timeline |
|---|---|---|

- **+** opens the quick-log menu from either tab.
- Trends & Care tabs come back when those screens are built (Phase 2). No placeholder tabs.
- **Settings** opens from Sophie's avatar in the top-right of the Today header (see 3.1).
- Logging forms open as **bottom sheets** (slide up, swipe down to dismiss).
- After saving or deleting, the sheet closes and a toast appears for **8 seconds**: "Feed logged · 60 mL" with an **Undo** button. The toast is the same with or without a signal.

### 3.1 Sophie's Avatar (please create)
**Create a new avatar for Sophie based on the elephant from the app icon** (`assets/sophitrack-app-icon.png`, see 2.1).

- **Style:** same single-line drawing style, line weight & colors as the icon's elephant (warm gray line, coral eye). It should read as the same character
- **Shape:** circle. Use a background that sets it apart from the cream app icon, e.g. a soft teal tint or a light teal ring around a cream circle
- **Legibility:** must read clearly at 40 pt. The full elephant may be too detailed at that size, so consider cropping to the head & curled trunk
- **Personal touch (optional):** a small detail that makes it "Sophie's" version, e.g. a tiny bow or a heart in the curl of the trunk. Keep it subtle
- **Versions:** light & dark mode
- **Show 2-3 options** side by side so we can pick one

**Where it appears:**
- **Today header:** 40 pt circle, top-right, on the same line as "Sophie · Day 4 · Mon, Nov 2." Tap opens Settings
- **Settings screen:** larger version (80-96 pt) at the top, above Sophie's name & birth details
- **Timeline:** not used; parent initials (H, T) mark who logged each entry

### 3.2 Time field (same on every sheet)
- A single **"Now"** chip. Tapping it reveals **5 min ago · 15 min ago · 30 min ago · 1 hr ago · Other time**. "Other time" opens the iPhone's built-in time picker. No custom time wheel.
- **No date field when logging.** A time that would be in the future is taken as yesterday and shown in words ("Yesterday, 11:50 PM"). Future times are never saved.
- **Editing from the Timeline allows any date**, back to Day 1.
- Editing an entry without changing its time never moves the stored time.
- **Clock-change nights** get a plain two-button question, never a silent guess:
  - Repeated hour (1:00-1:59 AM on fall-back night): "Clocks went back an hour that night. Was this before or after?"
  - Skipped hour (2:00-2:59 AM on spring-forward night): "2:30 AM didn't happen that night. Use 3:30 AM?"

---

## 4. Screens (priority order)

MVP screens: 4.1 to 4.5, 4.7, 4.12 and 4.13. Screens marked **Phase 2** are not built yet and have no tab, tile or link in the MVP.

### 4.1 Today (home)
**Header:** "Sophie · Day 4 · Mon, Nov 2", with Sophie's avatar (40 pt) on the right. Never "Day of life."

**Feed card (top, most prominent):**
- Headline: "Last feed 1 hr 45 min ago"
- Second line, plain text: "Next feed about 5:45 to 6:45 PM"
- Big **Log feed** button
- No status pill, no "NEXT FEED" label, no "window"

**Today so far** (heading; the minimums for the day are the "of" number):

| Row | Display | Status |
|---|---|---|
| Feeds | 6 of 8 | On track |
| Wet diapers | 3 of 4 | On track |
| Dirty diapers | 2 of 2 | On track |

- Status is **On track / Watch / Below minimum** only, each with an icon & the word. "On pace" is not used.
- **Pace rule (one-behind grace).** During the day, a row shows **Watch** only when its count is less than (minimum x fraction of the Central day elapsed) minus 1; otherwise **On track**. After the day ends, a row is **On track** if the count reached the minimum, else **Below minimum**.
- A Watch pill says the next step: "Watch · 1 more wet diaper."
- A "Both" diaper counts as one wet & one dirty.

**Formula today:** "Formula today · 330 mL". A total only; no split bar & no legend.

**Last diaper:** "Last diaper 3:45 PM · wet and dirty · Tom". Names in full on Today; initials in the Timeline.

**Weight line (shown once a weight has been logged):** "6 lb 4 oz on Nov 6 · 5 oz under birth weight (5%)", then "Back to birth weight" once regained. "Goal: back to birth weight by Day 14 (Nov 12)" shows only until then. Birth weight is 6 lb 9 oz (2,977 g).

**Not on Today:** tip banner, partner-activity banner (Today updates live on its own), quick-log row, spinner, pull-to-refresh, "last updated". Today always draws from the copy on the phone and never waits on the network.

### 4.2 Quick-log menu (+)
- **Two large tiles: Feed & Diaper**, each showing its last value ("Last: 3:45 PM · 60 mL", "Last: 3:45 PM · wet and dirty").
- **One small row below: Weight · Note.**
- No Sleep or Question options, and no caption about defaults.

### 4.3 Log Feed (bottom sheet), most important form
Top to bottom:
1. **Time:** "Now" chip (see 3.2)
2. **"How much was in the bottle?"** Large mL number with -/+ stepper (5 mL steps). Preset chips: 30 · 45 · 60 · 75 · 90 mL. Defaults to the last feed (60 mL)
3. **Left in bottle (optional):** collapsed row, expands to a mL stepper that cannot exceed the bottle amount. When used, shows "She drank 50 mL"
4. **Add a note:** collapsed row
5. **Save** button, full width, pinned at the bottom: "Save · 60 mL"

- Every new feed is a bottle of formula. There is no method picker, no flag chips and no second amount.
- The sheet fits one screen with no scrolling.
- **Editing:** the same sheet opens in edit mode from the Timeline (see 4.7). It keeps any stored detail it does not show. An entry imported from the paper sheets may have no amount (see 6); its edit sheet shows the amount as blank and can be saved that way. A new feed always needs an amount.

### 4.4 Log Diaper (bottom sheet)
1. **Time:** "Now" chip (see 3.2)
2. **Type:** 3 big buttons: **Wet · Dirty · Both**. Nothing is preselected and Save is disabled until one is tapped. Wet shows nothing else
3. If Dirty or Both, show:
   - **Poop color (optional):** one row of swatches (circles in the actual colors with labels), nothing preselected: Mustard yellow, Brown, Greenish yellow, Green-brown, Dark green, Black/tarry. Set apart under a grey **"Less common"** heading: Red, White/chalky. All eight are visible without expanding anything
   - **Add texture (optional):** one closed row. Opens chips: Sticky/tarry, Seedy, Pasty, Loose, Watery, Formed, Hard
4. **Add a note:** collapsed row
5. **Save**, full width, pinned at the bottom

- No pee color field (a note covers it).
- The sheet fits one screen with no scrolling.
- **Less common color state:** selecting Red or White/chalky shows a calm inline note, text only: "This color is worth mentioning to your pediatrician." No button.

### 4.5 Log Weight & Note (bottom sheets)
(This slot was Log Pump. Pump logging was removed on 11/9/2026.)

**Weight** (small link in the + menu):
- **Date** (default today), **pounds** & **ounces** steppers (ounces allow a decimal). Grams are stored; there is no grams input & no source picker
- Save shows the toast "Weight logged · 6 lb 4 oz" with Undo
- Units may change after the Day 14 visit

**Note** (small link in the + menu):
- **Time:** "Now" chip, a text box, Save. Shows as its own row in the Timeline

### 4.6 Sleep timer (Phase 2)
Full-screen or sheet with a large running timer ("Asleep 1:12:40"), Stop button, and "Enter manually" link.

### 4.7 Timeline
- Grouped by day with headers: "Day 4 · Mon, Nov 2" showing that day's totals in one line ("6 feeds · 330 mL · 3 wet · 2 dirty")
- Each row: icon by type, time, key detail, who logged it (initials: H = Heidi, T = Tom)
  - "3:45 PM · Feed · 60 mL · T"
  - "3:45 PM · Diaper · Wet and dirty, greenish yellow · T"
  - A feed with a leftover shows what she drank: "Feed · 50 mL (10 left)"
  - A note on an entry shows as a second line in smaller text
- Filter chips at top: **All · Feeds · Diapers**. Weights & notes show under All
- **Tap a row** to open its sheet in edit mode, with a labelled **"Delete this entry"** button at the bottom. No swipe gestures
- Delete acts at once and shows the Undo toast. No confirmation dialog
- A finished day that missed a minimum shows Below minimum in its day header (see 5)
- No "Newest first" label & no clock-change explainer card

**Time-change label:** on Day 3 (Sun, Nov 1) show a small "25-hr day" badge on the day header. Only entries from 1:00 to 1:59 AM that night carry a zone: "1:30 AM CDT" and "1:30 AM CST."

**Entries imported from the paper sheets (Days 1-10)** look like any other entry and carry no "from paper" label. Each is a plain feed with its total mL, with the original detail kept as note text (e.g. "1 mL colostrum", "breastfed 25 min"). A session with no mL shows as "Feed" with its note & no amount, and still counts as a feed for that day.

### 4.8 Day Summary (Phase 2)
A digital version of the hospital sheet for one day:
- Header: "Day 3 · Sun, Nov 1" with prev/next arrows & a "25-hr day" badge
- Summary tiles: Feeds 8 · Total 260 mL · Wets 3 · Dirty 2 (Day 3 minimums: 8 feeds, 3 wet, 2 dirty, all met)
- Min. vs. actual for each, with status
- Hour-by-hour list of the day's entries
- One button, "Summary for the pediatrician" (top right), with no technical columns

### 4.9 Trends (Phase 2)
- Range toggle: **24 hrs · 7 days · 30 days**
- Chart cards (stacked, scrollable):
  1. Daily total (mL), one bar per day
  2. Feeds per day vs. minimum (bars with a minimum line)
  3. Wet & dirty diapers per day vs. minimum
- Sample 7-day data (Days 1-7): daily total 60, 150, 260, 440, 480, 520, 560 mL

### 4.10 Care (Phase 2)
Sections as cards:
- **Growth:** latest weight from the pediatrician, "5% under birth weight," "Goal: back to birth weight by Day 14 (Nov 12)." Mini chart of visit weights. (Weight entry & the Today weight line are already in the MVP; see 4.1 & 4.5)
- **Appointments:** next visit date & time, past visits with measurements
- **Questions for pediatrician:** checklist ("Is this poop color normal?", "How much formula per feed now?"), add button
- **Bath:** "Last bath: Oct 31 · Next due: Nov 3"
- **Health log:** temperature, medications, cord care notes

### 4.11 Lock-screen notification (Phase 2, 1 frame)
"SophiTrack · Time for a feed soon (5:45 PM). Last feed 60 mL at 3:45 PM." Note in the frame: "Sent to both parents."

Tom turns reminders on in person on each phone, via one "Turn on feed reminders" card on Today.

### 4.12 Settings (1 frame)
Read-only in the MVP:
- Sophie's avatar, name & birth details (born Oct 29, 2026, 10:59 PM; 6 lb 9 oz; 19 in)
- "Signed in as Heidi"
- Version with the count of unsent entries beside it: "v0.1 · 3 waiting to send"
- Small horizontal logo at the bottom
- **Sign out**, small, at the very bottom. It asks first and names any unsent entries ("3 entries on this phone haven't been sent yet"). Signing out never deletes what is saved on the phone

Not in Settings: minimums editor, Day 1 date, export, units, night display, reminder interval, notifications, partner access, reference library. Tom changes minimums & the Day 1 date in Supabase.

### 4.13 Sign-in (1 frame)
- Email & password, one **Sign in** button, a plain-words error ("That email or password didn't work. Try again.")
- The email is remembered on the device. Fields use `autocomplete` username / current-password so the iPhone offers the saved password
- No "Forgot password" & no "Create account". Tom creates both accounts and signs in on both phones in person
- Only when the page is not opened from the home screen, show: "Already set up? Open SophiTrack from the elephant icon on your home screen."
- Once a phone has signed in, the app always opens to Today from what is saved on the phone and allows logging. It never shows this screen in place of Today

---

## 5. States to Show

| State | Where | What it looks like |
|---|---|---|
| Normal | Today | Sample data in 6 |
| Time for a feed | Today | Feed card stays white with an amber outline & icon. Headline "Time for a feed", sub-line "Last feed 3 hr 15 min ago · 3:45 PM". No coral fill, no extra pill. Starts when the next-feed range has passed |
| Watch | Today | Row pill with the eye icon & the next step: "Watch · 1 more wet diaper". Only when more than one behind for the time of day (see 4.1) |
| Below minimum | A finished day only, never Today (Timeline day header; Day Summary in Phase 2) | "Wet diapers: 3 of 4 · Below minimum" with its icon, plus "Check with your pediatrician if this continues" in normal text color |
| Empty | Timeline (first launch) | One line: "Nothing logged yet. Tap + to log a feed." |
| Saved on this phone | Any | One small pill, "Saved on this phone", shown only while entries are waiting to send. No count, no red. Nothing shows when all is sent. Logging works the same |
| Tap to reconnect | Any | Calm banner, shown only when the server has turned away the sign-in. Logging still works; entries stay on the phone until she taps it |
| Clock-change question | Any sheet | The two-button questions in 3.2 |
| Something went wrong | Any | Full screen: "Something went wrong. Your entries are safe. Tap to reopen." Never raw error text |

The app never signs out because of a bad signal, never clears what is saved on the phone, and never shows an update prompt. Updates apply only when the app is in the background or at the next launch.

---

## 6. Sample Data Reference (Day 4, Mon 11/2, "now" = 5:30 PM)

**Feeds** (all formula, by bottle)

| Time | Amount | By |
|---|---|---|
| 12:40 AM | 45 mL | Tom |
| 3:30 AM | 50 mL | Heidi |
| 6:45 AM | 55 mL | Tom |
| 9:50 AM | 60 mL | Heidi |
| 12:00 PM | 60 mL | Heidi |
| 3:45 PM | 60 mL | Tom |
| **Total** | **330 mL** | |

**Diapers:** 3 wet, 2 dirty (last: 3:45 PM, wet and dirty, greenish yellow, loose, Tom)

**Day 4 minimums:** 8 feeds, 4 wet, 2 dirty

**Status at 5:30 PM** (73% of the day elapsed, one-behind grace rule in 4.1):

| Row | Count | Watch only below | Status |
|---|---|---|---|
| Feeds | 6 of 8 | 8 x 0.73 - 1 = 4.8 | On track |
| Wet diapers | 3 of 4 | 4 x 0.73 - 1 = 1.9 | On track |
| Dirty diapers | 2 of 2 | 2 x 0.73 - 1 = 0.5 | On track |

**Imported entries (Days 1-10).** The paper sheets include colostrum, breast milk & direct breastfeeding. Each feed is imported as a plain feed with its total mL, and the original detail is kept as note text. A breastfeeding-only session with no mL is imported as a feed with no amount, so it still counts toward that day's feed minimum. Amount is optional only for imported entries. Pump sessions are not imported.

### 6.1 Word list
Use these words on every screen, and no others for the same thing.

1. **Wet** for a pee diaper. Never "pee diaper" or "urine."
2. **Dirty** for a poop diaper. Never "soiled", "stool" or "BM."
3. **"Wet and dirty"** in lists & on Today; the button on the sheet says **"Both."**
4. **"Poop"** only for color or texture ("Poop color", "Add texture"). Never "stool" or "consistency."
5. **"Formula today"** for the daily total. Never "intake."
6. **"Feed"** for the event ("Log feed", "Last feed", "Time for a feed"). "Bottle" only in "How much was in the bottle?" & "Left in bottle."
7. **On track / Watch / Below minimum** for status. Never "On pace."
8. **"Day 4"**, never "Day of life". The progress heading is **"Today so far."**
9. **"Next feed about 5:45 to 6:45 PM"** and **"Time for a feed."** Never "window" or "overdue."
10. **"Saved on this phone"** and **"Tap to reconnect."** Never "sync", "offline" or "queue."

---

## 7. Out of Scope

- Pump logging, breast milk amounts or %, breastfeeding sessions, and "breast milk on hand" (removed 11/9/2026; do not bring back)
- Final UI palette (incl. status colors) & fonts
- In-app icon set (feed, diaper & other icons can be placeholders)
- Onboarding, account creation & password reset screens (Tom does these by hand)
- Reference library detail pages
- Sleep, Day Summary, Trends, Care & reminders until Phase 2

---

## 8. Deliverables

**MVP screens to build:**
1. Today (light & dark)
2. Quick-log menu
3. Log Feed (light & dark), new & edit
4. Log Diaper: default + less common color state, new & edit
5. Log Weight, Note
6. Timeline (with filter chips) + time-change day example
7. Settings
8. Sign-in
9. States: time for a feed, watch, below minimum, empty, saved on this phone, tap to reconnect, clock-change question, something went wrong

**Phase 2 (mockups exist; not built yet):** Sleep timer, Day Summary, Trends, Care, lock-screen notification.

**Already delivered:** logo & icon sheet (logo lockups light & dark, home-screen icon, splash screen, Sophie's avatar options). See `design/brand/`.
