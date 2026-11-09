# SophiTrack: UI Brief for Mockups

Use this brief to create iPhone mockups of SophiTrack. The full product plan is in `SophiTrack-High-Level-Plan.md`. This brief covers what each screen shows and how it behaves.

---

## 1. What You're Designing

SophiTrack is a private newborn tracker for two parents, Heidi (Mom) & Tom (Dad), to track their daughter Sophie. It runs as a web app saved to the iPhone home screen. Both parents log feeds, diapers and pumping sessions, often at 3am with Sophie in one arm. The app answers one question at a glance: **"Is Sophie on track for her day of life?"**

**Feeding setup:** bottle feeding with formula plus pumped breast milk. Each feed records how much of the bottle was breast milk (mL or %).

---

## 2. Format & Constraints

| Item | Spec |
|---|---|
| Device | iPhone, portrait only. Frame: 393 x 852 pt (iPhone 15/16) |
| Mode | Home-screen web app, full screen (no Safari bars). Respect the notch/Dynamic Island & home indicator safe areas |
| Light & dark | Show the **Today** screen and **Log Feed** sheet in both light & dark mode. Dark mode is the main night-time mode |
| Style | Clean & simple, using the app icon's colors as accents (see 2.1). The full palette & fonts are finalized later |
| Units | mL only |
| Time | Central Time, 12-hour clock (e.g. 3:45 PM) |

### Design priorities
1. **One thumb, 2 taps to log.** The main actions sit in the bottom half of the screen. Tap targets at least 44 pt.
2. **Glanceable status.** The day's progress vs. minimums is readable in under 3 seconds.
3. **Minimal typing.** Steppers, presets & chips instead of keyboards. Every field defaults to the last value used.
4. **Status never relies on color alone.** Pair each status with an icon & a word (On track / Watch / Below minimum).
5. **Calm, not alarming.** Warnings are clear but never scary; they suggest "check with your pediatrician."

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

**Bottom tab bar (5 slots):**

| Today | Timeline | **+ Log** (center, raised) | Trends | Care |
|---|---|---|---|---|

- **+ Log** opens the quick-log menu from any tab.
- **Profile & Settings** open from Sophie's avatar in the top-right of the Today header (see 3.1).

### 3.1 Sophie's Avatar (please create)
**Create a new avatar for Sophie based on the elephant from the app icon** (`assets/sophitrack-app-icon.png`, see 2.1).

- **Style:** same single-line drawing style, line weight & colors as the icon's elephant (warm gray line, coral eye). It should read as the same character
- **Shape:** circle. Use a background that sets it apart from the cream app icon, e.g. a soft teal tint or a light teal ring around a cream circle
- **Legibility:** must read clearly at 40 pt. The full elephant may be too detailed at that size, so consider cropping to the head & curled trunk
- **Personal touch (optional):** a small detail that makes it "Sophie's" version, e.g. a tiny bow or a heart in the curl of the trunk. Keep it subtle
- **Versions:** light & dark mode
- **Show 2-3 options** side by side so we can pick one

**Where it appears:**
- **Today header:** 40 pt circle, top-right, on the same line as "Sophie · Day 4 of life." Tap opens Profile & Settings
- **Settings & Profile screen:** larger version (80-96 pt) at the top, above Sophie's name & birth details
- **Timeline & banners:** not used; parent initials (H, T) mark who logged each entry
- Logging forms open as **bottom sheets** (slide up, swipe down to dismiss).
- After saving, the sheet closes and a toast appears for 5 seconds: "Feed logged · 60 mL" with an **Undo** button.

---

## 4. Screens to Mock (priority order)

### 4.1 Today (home)
**Header:** "Sophie," "Day 4 of life," date "Mon, Nov 2," with Sophie's avatar (40 pt) on the right.

**Next feed card (top, most prominent):**
- "Last feed: 1 hr 45 min ago (3:45 PM, 60 mL)"
- "Next feed window: 5:45 to 6:45 PM"
- Big "Log feed" button

**Today's progress (vs. Day 4 minimums):**

| Metric | Display | Status |
|---|---|---|
| Feeds | 6 of 8 | On pace |
| Wet diapers | 3 of 4 | Watch: 1 more to reach minimum |
| Dirty diapers | 2 of 2 | On track |

**Today's intake card:**
- Total: 330 mL
- Split bar: breast milk 85 mL (26%) / formula 245 mL (74%)

**Pumping card:** 4 sessions · 70 mL today · last pumped 2:30 PM

**Last diaper:** 3:45 PM · Wet + dirty · Greenish yellow, loose · Tom

**Quick-log row (bottom, above tab bar):** Feed · Diaper · Pump · Sleep

**Tip banner (dismissible):** "Day 4: stools should be changing to greenish yellow or yellowish brown."

### 4.2 Quick-log menu (+)
Large buttons in a 2x2 or 3x2 grid: **Feed, Diaper, Pump, Sleep**, plus smaller **Note** & **Question** options.

### 4.3 Log Feed (bottom sheet), most important form
Top to bottom:
1. **Time:** "Now" chip, tap to change (time wheel)
2. **Total amount:** large mL number with -/+ stepper (5 mL steps). Preset chips: 30 · 45 · 60 · 75 · 90 mL. Defaults to last feed (60 mL)
3. **Breast milk:** segmented toggle **mL | %**, then a stepper for that value
   - Example state: 60 mL total, 15 mL breast milk → shows "25%" & "Formula: 45 mL" automatically
4. **Split bar:** visual bar showing breast milk vs. formula, updates live
5. **Left in bottle (optional):** collapsed row, expands to a mL stepper. When used, shows "She drank 50 mL"
6. **More options (collapsed):** method (Bottle / Syringe / Breast), notes, flags (spit-up, fussy, feeding difficulty)
7. **Save** button, full width, pinned at the bottom

Also mock a **% entry state:** toggle on %, value 25% → shows "15 mL breast milk · 45 mL formula."

### 4.4 Log Diaper (bottom sheet)
1. **Time:** "Now" chip
2. **Type:** 3 big buttons: **Wet · Dirty · Both**
3. If Dirty or Both, show:
   - **Color swatches** (circles in the actual stool colors with labels): Black/tarry, Dark green, Green-brown, Greenish yellow, Mustard yellow, Brown. Plus an "Unusual" group: Red, White/chalky
   - **Consistency chips:** Sticky/tarry, Seedy, Pasty, Loose, Watery, Formed, Hard
4. **Pee color (optional, collapsed):** Pale yellow, Dark yellow, Orange/pink crystals
5. Notes, Save

Also mock the **unusual color state:** selecting "White/chalky" shows a calm inline note: "This color is worth mentioning to your pediatrician. Add to questions?" with a one-tap button.

### 4.5 Log Pump (bottom sheet)
- **Timer:** big start/stop with running clock (or manual minutes)
- **Volume:** Left & Right mL steppers, auto total ("Total: 25 mL")
- Today's pumped total shown under the Save button: "Today: 70 mL → 95 mL"

### 4.6 Sleep timer
Full-screen or sheet with a large running timer ("Asleep 1:12:40"), Stop button, and "Enter manually" link.

### 4.7 Timeline
- Grouped by day with headers: "Day 4 · Mon, Nov 2" showing that day's totals in one line
- Each row: icon by type, time, key detail, who logged it (initials: H = Heidi, T = Tom)
  - "3:45 PM · Feed · 60 mL (20 mL breast milk, 33%) · T"
  - "3:45 PM · Diaper · Wet + dirty, greenish yellow · T"
  - "2:30 PM · Pump · 20 mL (L 10 / R 10) · 15 min · H"
- Filter chips at top: All · Feeds · Diapers · Pump · Sleep
- Swipe left on a row for Edit / Delete; tap a row to open its edit sheet

Also mock the **time-change label:** on Day 3 (Sun, Nov 1) show a small "25-hr day" badge on the day header, and two rows at "1:30 AM CDT" and "1:30 AM CST."

### 4.8 Day Summary
A digital version of the hospital sheet for one day:
- Header: "Day 3 · Sun, Nov 1" with prev/next arrows & a "25-hr day" badge
- Summary tiles: Feeds 8 · Intake 260 mL · Breast milk 22% · Wets 3 · Dirty 2 · Pumped 45 mL (Day 3 minimums: 8 feeds, 3 wet, 2 dirty, all met)
- Min. vs. actual for each, with status
- Hour-by-hour list of the day's entries
- "Share / Export" button (top right)

### 4.9 Trends
- Range toggle: **24 hrs · 7 days · 30 days**
- Chart cards (stacked, scrollable):
  1. Daily intake (mL), bars split into breast milk vs. formula
  2. % breast milk per day (line)
  3. Feeds per day vs. minimum (bars with a minimum line)
  4. Wet & dirty diapers per day vs. minimum
  5. mL pumped per day
- Sample 7-day data (Days 1-7): intake 60, 150, 260, 440, 480, 520, 560 mL; % breast milk 100, 20, 22, 27, 28, 30, 31

### 4.10 Care
Sections as cards:
- **Growth:** latest weight from the pediatrician, "-6% from birth weight," "Goal: back to birth weight by Day 14 (Nov 12)." Mini chart of visit weights
- **Appointments:** next visit date & time, past visits with measurements
- **Questions for pediatrician:** checklist ("Ask about nipple shields," "Is this stool color normal?"), add button
- **Bath:** "Last bath: Oct 31 · Next due: Nov 3"
- **Health log:** temperature, medications, cord care notes

### 4.11 Lock-screen notification (1 frame)
"SophiTrack · Feed window opens now (5:45 PM). Last feed 60 mL at 3:45 PM." Note in the frame: "Sent to both parents."

### 4.12 Settings & Profile (low priority, 1 frame)
Baby profile (Sophie, birth: Oct 29, 2026, 10:59 PM, birth weight), Day 1 date (Oct 30), feed reminder interval (2-3 hrs), notifications, partner access (Heidi & Tom), export data, reference library link.

---

## 5. States to Show

| State | Where | What it looks like |
|---|---|---|
| Normal | Today | Sample data above |
| Feed overdue | Today | Next feed card shows "Feed window passed 15 min ago" in a stronger style |
| Below minimum (end of day) | Today or Day Summary | "Wet diapers: 3 of 4 · Below minimum" + "Check with your pediatrician if this continues" |
| Empty | Timeline (first launch) | Friendly empty state with "Log the first feed" button |
| Offline | Any | Small "Offline · will sync" pill; logging still works |
| Partner activity | Today | Brief banner: "Heidi logged a feed · 60 mL · just now" |

---

## 6. Sample Data Reference (Day 4, Mon 11/2, "now" = 5:30 PM)

**Feeds**

| Time | Total | Breast milk | % | Formula | By |
|---|---|---|---|---|---|
| 12:40 AM | 45 mL | 10 mL | 22% | 35 mL | Tom |
| 3:30 AM | 50 mL | 10 mL | 20% | 40 mL | Heidi |
| 6:45 AM | 55 mL | 15 mL | 27% | 40 mL | Tom |
| 9:50 AM | 60 mL | 15 mL | 25% | 45 mL | Heidi |
| 12:00 PM | 60 mL | 15 mL | 25% | 45 mL | Heidi |
| 3:45 PM | 60 mL | 20 mL | 33% | 40 mL | Tom |
| **Total** | **330 mL** | **85 mL** | **26%** | **245 mL** | |

**Diapers:** 3 wet, 2 dirty (last: 3:45 PM, wet + dirty, greenish yellow, loose)

**Pumping:** 4 sessions, 70 mL total, last at 2:30 PM

**Day 4 minimums:** 8 feeds, 4 wet, 2 dirty

---

## 7. Out of Scope for These Mockups

- Final UI palette (incl. status colors) & fonts
- In-app icon set (feed, diaper, pump & other icons can be placeholders)
- Onboarding & login screens
- Reference library detail pages
- Breast milk on-hand inventory (Phase 2)

---

## 8. Deliverables

Please produce these frames:
0. **Logo & icon sheet:** logo lockups (light & dark), home-screen icon (180 x 180 & in a home screen row), splash screen, Sophie's avatar options (2-3, light & dark, at 40 pt & 96 pt)
1. Today (light) & Today (dark)
2. Quick-log menu
3. Log Feed: mL entry state (light & dark) + % entry state
4. Log Diaper: default + unusual color state
5. Log Pump
6. Sleep timer
7. Timeline (with filter chips) + time-change day example
8. Day Summary
9. Trends
10. Care
11. Lock-screen notification
12. Settings & Profile
13. States: feed overdue, below minimum, empty, offline
