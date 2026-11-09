# SophiTrack mockups v3: redesign brief

**For:** Claude Design, working in the existing SophiTrack canvas (https://claude.ai/artifact/6R9uhNHeXC4UUxqqmoBiu8).
**Written:** 11/9/2026. This brief stands on its own. Where it differs from what is on the canvas, this brief wins.

---

## 1. Why a redesign

Two decisions made on 11/9/2026 changed the app after the v2 mockups were drawn:

1. **Formula only.** Sophie is fed formula by bottle. Nothing in the app tracks pumping, breast milk or breastfeeding any more.
2. **As minimal and easy as possible.** Heidi (Mom) is the everyday user and is not technical. She often logs one-handed at 3am. Her whole app is **two actions (Feed, Diaper) and two screens (Today, Timeline)**. Tom (Dad) does all setup outside the app.

The v2 mockups still show a pump screen, a breast milk / formula split, a five-tab bar, banners and swipe actions. This pass redraws the phone screens for the first release so the pictures match what is being built.

**Keep the look.** Same visual style, palette, type, card shapes, button shapes and icons as v2. This is a content and simplification pass, not a restyle. When in doubt, remove rather than add.

---

## 2. How to work

1. **Create a new canvas section "v3 · MVP".** Do not edit, move or delete any v2 frame yet; they are the style reference.
2. **First batch only:** draw A1, A2, A3, B1, C1, C4, D3 and D4. Run the section 7 checks on them, list anything that did not fit on one screen, then **stop and wait for my reply.**
3. **After I approve:** draw the remaining frames, then tidy the v2 frames as in the table below.

| v2 frame | What happens to it (step 3 only) |
|---|---|
| 00 Main (logo & icon sheet), 01 Avatars | **Keep as is.** Do not redraw the elephant, wordmark or avatars |
| 02 Today (light), 03 Today (dark) | Replaced by A1, A2 |
| 04 Quick-log menu | Replaced by B1 |
| 05 Today, feed overdue | Replaced by A3 "Time for a feed" |
| 06 Today, below minimum | Replaced by A4 (Watch). Below minimum moves to the Timeline (F4) |
| 07 Today, partner activity + offline | Replaced by A5 and A6. The partner banner is gone |
| 08 Feed (mL), 09 Feed (mL, dark) | Replaced by C1, C2 |
| 10 Feed (% entry), 13 Pump | **Delete** |
| 11 Diaper default, 12 Diaper unusual | Replaced by D1 to D5 |
| 15 Timeline, 16 Timeline time change, 17 Timeline empty | Replaced by F1 and F2, F3, F5 |
| 21 Settings | Replaced by G1 |
| 14 Sleep, 18 Day Summary, 19 Trends, 20 Care, 22 Lock screen | Move to a section **"Later (Phase 2)"**. Do not redraw |
| 23 to 25 Desktop, 26 to 31 iPad | Move to the same "Later" section. Do not redraw |

New frames with no v2 source: A3b, C3 to C6, E1, E2, F4, G1b, G2 to G4.

Label the "Later" section: "Not updated for formula-only. Do not build from these."

---

## 3. Rules for every frame

**Device:** iPhone, portrait, 393 x 852 pt, home-screen web app (no Safari bars). Respect the Dynamic Island and home indicator.

**Palette (unchanged from v2):**

| Role | Light | Dark |
|---|---|---|
| Ground | #FBF5E7 | #1A1A19 |
| Card | #FFFFFF | #262624 |
| Text / secondary | #2B2A28 / #63605B | #F3EEE4 / #C4BDB1 |
| Primary button | #3A7489, white text | #5D94A6, dark text |
| Accent teal | #5D94A6 | #7FB8CB |
| Coral | #D97757 | #E8906F |
| On track | #3E7D5A + check icon | #7FC89A |
| Watch | #9A6A12 + eye icon | #E3B35C |
| Below minimum | #A8532F + alert icon | #F0997A |

- **Status pills:** text and icon in the status color on a tint of that color, as in v2 (in dark mode, the status color at about 20% over the card).
- **Warning sentences** use normal text color. Only pills and their icons use status colors.
- **Coral** appears only in the logo and avatar. Do not add coral elsewhere.
- The breast milk / formula chart colors are retired. Font: DM Sans, as in v2.

**Simplicity rules:**
1. Nothing appears on a screen unless it is listed for that frame below. No extra captions, helper text, badges, progress bars or decoration.
2. Every bottom sheet fits on one screen with no scrolling.
3. Every tappable thing, including close buttons, chips and swatches, has at least a 44 pt hit area.
4. Main values are 16 to 17 pt or larger. No text smaller than 13 pt. Text may wrap to a second line rather than shrink.
5. Status is always an icon plus a word. Never color alone.
6. Calm, not alarming. No red or coral fills on Today.
7. Status pills meet 4.5:1 contrast in both light and dark. Check the Watch pill in particular.

**Words to use (and never the alternative):**

| Use | Never |
|---|---|
| Wet, Dirty; "Wet and dirty" in lists; "Both" on the diaper button | pee diaper, soiled, stool, BM |
| "Poop color", "Add texture" | stool, consistency |
| "Formula today" | intake |
| "Log feed", "Last feed", "Time for a feed" | overdue |
| "Next feed about 5:45 to 6:45 PM" | window |
| On track / Watch / Below minimum | On pace |
| "Day 4" | Day of life |
| "Today so far" | Today vs. Day 4 minimums |
| "Saved on this phone", "Tap to reconnect" | sync, offline, queue |

**Tab bar:** on Today and Timeline frames only. Three slots: **Today**, **+** (center, raised, no text label), **Timeline**. No Trends, Care or More. No tab bar on Settings, Sign-in or "Something went wrong".

**Sheet layout (all bottom sheets, C to E):** grabber at the top. Row 1: title on the left, a 44 pt close (X) button on the right. Row 2: the time chip, left aligned. The primary button is full width and pinned at the bottom.

---

## 4. Sample data (use in every frame)

"Now" is **Mon, Nov 2 at 5:30 PM**. Sophie is on **Day 4**.

**Feeds today** (all formula, by bottle):

| Time | In the bottle | She drank | By |
|---|---|---|---|
| 12:40 AM | 45 mL | 45 mL | Tom |
| 3:30 AM | 60 mL, 10 left | 50 mL | Heidi |
| 6:45 AM | 55 mL | 55 mL | Tom |
| 9:50 AM | 60 mL | 60 mL | Heidi |
| 12:00 PM | 60 mL (note: "Spit up a little") | 60 mL | Heidi |
| 3:45 PM | 60 mL | 60 mL | Tom |
| **Total** | | **330 mL** | |

**Diapers today:**

| Time | Type | Color | By |
|---|---|---|---|
| 3:35 AM | Wet | | Heidi |
| 6:50 AM | Dirty | Green-brown | Tom |
| 12:10 PM | Wet | | Heidi |
| 3:45 PM | Wet and dirty | Greenish yellow | Tom |

A "wet and dirty" diaper counts once as wet and once as dirty, so today is **3 wet, 2 dirty**.

- **Day 4 minimums:** 8 feeds, 4 wet, 2 dirty. At 5:30 PM all three rows are **On track**.
- **Weight:** born 6 lb 9 oz. Latest: 6 lb 4 oz on Nov 1, which is 5 oz under birth weight (5%).
- **Who logged:** full names on Today ("Tom"), initials in the Timeline (T, H).
- **Day 3 (Sun, Nov 1):** 8 feeds · 260 mL · 3 wet · 2 dirty. Clocks went back that night, so it was a 25-hour day.
- **Day 2 (Sat, Oct 31):** 8 feeds · 150 mL · 1 wet · 2 dirty. Its minimums were 8 feeds, 2 wet, 2 dirty, so wet diapers fell short.

---

## 5. Frames to produce

### A. Today

**A1. Today (light).** Top to bottom:
1. Header as in v2: "Sophie" large, "Day 4 · Mon, Nov 2" below it. Sophie's avatar (40 pt circle) top right; it opens Settings.
2. **Feed card**, the most prominent thing on the screen:
   - Headline: "Last feed 1 hr 45 min ago"
   - Plain second line: "Next feed about 5:45 to 6:45 PM"
   - Big primary button: **Log feed**
   - No status pill, no "NEXT FEED" label.
3. **Today so far** (heading). Three rows, each with a label, a count and a status pill. No progress bars.
   - Feeds · 6 of 8 · On track
   - Wet diapers · 3 of 4 · On track
   - Dirty diapers · 2 of 2 · On track
4. One card with three rows, label on the left and value on the right:
   - Formula today · 330 mL
   - Last diaper · 3:45 PM · wet and dirty · Tom
   - Weight · 6 lb 4 oz · Nov 1, with a 13 pt line under it: "5 oz under birth weight (5%) · Goal: back by Day 14 (Nov 12)"
5. Tab bar, Today active.

"Formula today" is a total only: no split bar, no legend, no percentages. Not on Today: pumping card, tip banner, partner banner, quick-log row, "last updated", refresh control.

**A2. Today (dark).** Same content as A1 in dark mode. This is the main night-time view; it must be comfortable in a dark room.

**A3. Today, time for a feed (light).** Same as A1, but "now" is 7:00 PM. The feed card keeps its normal card color and gains a 2 pt outline in the Watch color (#9A6A12) and a small clock icon in the same color. Headline "Time for a feed". The second line becomes "Last feed 3 hr 15 min ago · 3:45 PM" (it replaces the "Next feed" line). Same Log feed button. No fill, no extra pill. "Today so far" is unchanged.

**A3b. Today, time for a feed (dark).** A3 in dark mode, outline and icon in #E3B35C. This is the state most likely to be seen at 3am.

**A4. Today, watch.** Same as A1, but only 1 wet diaper has been logged. The Wet diapers row reads "1 of 4" with the pill "Watch · 1 more wet diaper" (eye icon, Watch color). If the pill does not fit beside the count, it drops to its own line under the label. The other two rows stay On track. Nothing else changes.

**A5. Today, saved on this phone.** Meaning: the phone has no signal; entries are kept on the phone and sent later. Same as A1 with one small neutral pill on the header's second line, right of the date: "Saved on this phone", with a small phone icon. Not tappable. No count, no red, nothing that looks like an error.

**A6. Today, tap to reconnect.** Meaning: the phone needs to sign in again, but logging still works. Same as A1 with one full-width, 44 pt tappable row between the header and the feed card: "Tap to reconnect", neutral colors, small refresh icon. The Log feed button looks exactly as usual. If Today no longer fits, tighten card spacing; do not remove anything.

### B. Quick-log menu

**B1. + menu.** A bottom sheet over a dimmed Today, with the grabber, no title and no Cancel button; tapping outside closes it.
- **Two large tiles side by side:** Feed, with "Last 3:45 PM · 60 mL"; Diaper, with "Last 3:45 PM" and "wet and dirty" on a second line.
- **Below, two smaller buttons side by side, 44 pt high:** Weight, Note.
- Nothing else. No Pump, Sleep or Question, and no caption about defaults.

### C. Log Feed (bottom sheet)

**C1. Log Feed (light), new feed, over Today.** Top to bottom:
1. Title "Feed", close button.
2. Time chip: **"Now"**.
3. Label: **"How much was in the bottle?"** Large number "60 mL" with − and + buttons (5 mL steps). Preset chips: 30 · 45 · 60 · 75 · 90, with 60 selected.
4. Collapsed row: "Left in bottle (optional)".
5. Collapsed row: "Add a note".
6. Primary button: **"Save · 60 mL"**.

No breast milk controls, no mL/% toggle, no split bar, no method picker, no flag chips, no "More options".

**C2. Log Feed (dark).** Same as C1.

**C3. Log Feed, left in bottle open.** The "Left in bottle" row is expanded to a stepper showing "10 mL". Below it, plain text: "She drank 50 mL". Button reads "Save · 50 mL".

**C4. Log Feed, time options open.** The "Now" chip has been tapped. It stays, selected. Under it, a small label "How long ago?" and chips: 5 min · 15 min · 30 min · 1 hr · Other time. The chips may wrap to two rows; no sideways scrolling. "Other time" opens the iPhone's own time picker; do not draw a custom wheel. The rest of the sheet is unchanged and still fits one screen.

(Not drawn: if she picks a time later than now, the chip reads "Yesterday, 11:50 PM".)

**C5. Log Feed, editing, over the Timeline.** Opened by tapping the 3:45 PM feed row. Title "Edit feed". The time row shows two chips, "Mon, Nov 2" and "3:45 PM"; each opens the iPhone's own picker (do not draw it). Amount 60 mL. Above the primary button, a quiet text button **"Delete this entry"**. Primary button reads "Save".

Delete has no confirmation dialog: it closes the sheet and shows the same toast as C6, reading "Feed deleted" with Undo (no separate frame). Editing a diaper works the same way (no separate frame).

**C6. Undo toast.** Today just after saving a 60 mL feed at 5:30 PM. A toast sits above the tab bar without covering it: "Feed logged · 60 mL" and an **Undo** button. Today behind it has updated: "Last feed just now", "Next feed about 7:30 to 8:30 PM", Feeds 7 of 8, Formula today 390 mL.

### D. Log Diaper (bottom sheet over Today)

**D1. Log Diaper, nothing chosen.**
1. Title "Diaper", close button.
2. Time chip: "Now".
3. Three big buttons in a row: **Wet · Dirty · Both**. None selected.
4. Collapsed row: "Add a note".
5. Primary button **Save**, shown disabled.

**D2. Log Diaper, Wet chosen.** Wet is selected. Nothing new appears. Save is enabled.

**D3. Log Diaper, Dirty chosen.** Dirty is selected. Below the buttons:
- Label "Poop color (optional)", then a grid of color swatches **four across, two rows**: 44 pt circles in the actual colors, with 13 pt labels that may run to two lines. None selected.
  - Row 1: Mustard yellow, Brown, Greenish yellow, Green-brown
  - Row 2: Dark green, Black/tarry, then a thin divider and a small grey heading **"Less common"** over Red and White/chalky
  - No third row. All eight are visible without scrolling or expanding.
- Collapsed row: "Add texture (optional)".
- Collapsed row: "Add a note".
- Save enabled.

Choosing **Both** shows exactly the same sheet as Dirty (no separate frame).

**D4. Log Diaper, less common color.** As D3 with White/chalky selected. A calm inline note in normal text color, no button: "This color is worth mentioning to your pediatrician." The same note appears for Red. The sheet still fits one screen.

**D5. Log Diaper (dark).** D3 in dark mode. Check the swatches still read as their real colors.

### E. Weight and Note (bottom sheets over Today)

**E1. Log Weight.** Title "Weight". Date chip "Today". Two steppers side by side: pounds (6) and ounces (4). Primary button "Save". No grams, no "source" choice.

**E2. Note.** Title "Note". Time chip "Now", a text box with the keyboard up, and Save sitting directly above the keyboard.

### F. Timeline

**F1. Timeline (light), top of the list.**
- Page title "Timeline".
- Filter chips: **All · Feeds · Diapers**, with All selected.
- Day header: "Day 4 · Mon, Nov 2" and one line of totals: "6 feeds · 330 mL · 3 wet · 2 dirty".
- Rows, newest first, at the v2 row height; show as many as fit (about seven) and let the tab bar cut the list off. Each row has a type icon, time, detail and initial:
  - 3:45 PM · Feed · 60 mL · T
  - 3:45 PM · Diaper · Wet and dirty, greenish yellow · T
  - 12:10 PM · Diaper · Wet · H
  - 12:00 PM · Feed · 60 mL · H, with a smaller second line: "Spit up a little"
  - 9:50 AM · Feed · 60 mL · H
  - 6:50 AM · Diaper · Dirty, green-brown · T
  - 6:45 AM · Feed · 55 mL · T
- Tab bar, Timeline active.
- No swipe actions, no "Newest first" label, no pump rows, no percentages.

**F2. Timeline (dark), scrolled down.** The same list in dark mode, scrolled so the end of Day 4 and the start of Day 3 show:
- 3:35 AM · Diaper · Wet · H
- 3:30 AM · Feed · 50 mL (10 left) · H
- 12:40 AM · Feed · 45 mL · T
- Day header "Day 3 · Sun, Nov 1" with a small **"25-hr day"** badge and totals "8 feeds · 260 mL · 3 wet · 2 dirty", followed by two or three ordinary Day 3 rows.

**F3. Timeline, clock-change night.** The list scrolled to the end of Day 3, so the repeated hour is visible. Newest first:
- 4:10 AM · Feed · H, with a smaller second line: "breastfed 25 min" (an entry copied from the old paper sheets: no amount, the original detail kept as a note)
- 2:40 AM · Feed · 35 mL · T
- **1:30 AM CST** · Diaper · Wet · T
- **1:30 AM CDT** · Feed · 40 mL · H
- 12:20 AM · Diaper · Dirty · T

Only the two 1:30 AM rows show a zone. There is no explainer card.

**F4. Timeline, a finished day below minimum.** Day header "Day 2 · Sat, Oct 31" with totals "8 feeds · 150 mL · 1 wet · 2 dirty". Under it, one line with the alert icon, "Wet diapers: 1 of 2 · Below minimum", and in normal text color, "Check with your pediatrician if this continues". Then three or four ordinary rows. This is the only place Below minimum appears.

**F5. Timeline, empty.** Title and tab bar as F1, no filter chips, and one centered line: "Nothing logged yet. Tap + to log a feed."

### G. Settings, sign-in and rare screens

**G1. Settings.** Read-only. Top left: a "‹ Today" back link (44 pt). No tab bar. Sophie's avatar (large), "Sophie", "Born Oct 29, 2026, 10:59 PM · 6 lb 9 oz · 19 in". "Signed in as Heidi". "v0.1 · 3 waiting to send". Small horizontal logo. A small **Sign out** link at the very bottom. Nothing else: no toggles, no units, no reminders, no export.

**G1b. Sign out question.** Over Settings, a small dialog: "3 entries on this phone haven't been sent yet." Two buttons: **Cancel** · **Sign out**.

**G2. Sign-in.** Stacked logo, Email field, Password field, one **Sign in** button. No "Forgot password", no "Create account".

**G2b. Sign-in, error.** A second full-size frame with one line under the Password field: "That email or password didn't work. Try again."

**G3. Clock-change question.** Over the Edit feed sheet (as C5) with the chips reading "Sun, Nov 1" and "1:30 AM". A small dialog: "Clocks went back an hour that night. Was this before or after?" Two large stacked buttons: **Before the clocks changed** · **After the clocks changed**.

**G4. Something went wrong.** Full screen, elephant mark, "Something went wrong. Your entries are safe." and one button **"Tap to reopen"**. No error codes, no tab bar.

---

## 6. What not to add

Pump or pumping, breast milk amounts or percentages, breastfeeding controls, a split bar, a method picker, flag chips, tips, a partner banner, swipe actions, progress bars, extra tabs, settings toggles, onboarding, "forgot password", an update prompt, or any explanatory caption this brief does not list.

## 7. Checks before handing back

Go through every new frame and confirm:

- [ ] No pump, breast milk or breastfeeding controls, labels or totals anywhere. The only exception is the note text "breastfed 25 min" on the copied paper entry in F3.
- [ ] The only % anywhere is in the weight line.
- [ ] The tab bar has exactly three slots and appears only on Today and Timeline frames.
- [ ] Every word matches the table in section 3.
- [ ] Each sheet (B, C, D, E) fits 393 x 852 with no scrolling, including C3, C4 and D4.
- [ ] No tappable element is smaller than 44 pt, including close buttons, chips and swatches.
- [ ] No text under 13 pt.
- [ ] Every status has an icon and a word; Today has no red or coral fills.
- [ ] Numbers add up: the feeds total 330 mL; Today shows 6 of 8, 3 of 4, 2 of 2, except A4 (wet 1 of 4) and C6 (7 of 8, 390 mL).
- [ ] Dark frames (A2, A3b, C2, D5, F2) meet 4.5:1 contrast for text and pills.
- [ ] Nothing was added that this brief does not list.

## 8. Handing back

- Name the canvas sections "v3 · MVP" and "Later (Phase 2)".
- Title each frame with its code and name, e.g. "A1 · Today (light)".
- If you can export, give me each v3 frame as a PNG named by code (e.g. `A1-Today-light.png`) and the canvas stylesheet. If you cannot, say so; correct frame titles are enough.
- List anything you changed that this brief did not ask for, and anything that did not fit on one screen.
