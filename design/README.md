# SophiTrack design mockups

Two sets of mockups live here.

| Set | What it covers | Canvas (editable) | PNGs | Source |
|---|---|---|---|---|
| **v3 · MVP** (drawn 11/9/2026) | The Phase 1 phone screens: formula only, tab bar Today / + / Timeline | https://claude.ai/artifact/Quq7EQN82YrJwi82f6pMG4 | `mockups-v3/` | `source-v3/` |
| **v2** | Style reference, plus the screens v3 does not redraw: logo and avatar sheets, Phase 2 (Sleep, Day Summary, Trends, Care, lock screen), iPad, desktop | https://claude.ai/artifact/6R9uhNHeXC4UUxqqmoBiu8 | `mockups/` | `source/` |

Use v3 when building a Phase 1 screen. `SophiTrack-UI-Brief.md` is still the build reference; where it and any mockup differ, the brief wins. The v3 frames are a first pass drawn from `Mockup-Redesign-Brief.md` and have not been through a review round yet.

## Folders
- `mockups-v3/` PNG of every v3 frame, named by frame code (`A1-Today-light.png` ... `G4-Something-went-wrong.png`). 393 x 852 pt at 2x. Rendered from `source-v3/` in WebKit, not exported from the canvas.
- `source-v3/` v3 canvas source: one `.dc.html` per frame (`Main.dc.html` is A1), `canvas.json` (frame titles and layout) and `sophi.css` (the v3 stylesheet, phone frames only). Like `source/`, these need the canvas runtime and its uploaded images, so they do not render standalone.
- `mockups/` v2 PNG export of every frame, numbered in canvas order (00 logo sheet ... 25 desktop trends, 26-31 iPad portrait & landscape)
- `source/` v2 canvas source and stylesheet. Its `sophi.css` also holds the iPad and desktop styles, which v3 does not have.
- `brand/` assets lifted from the app icon (not redrawn): elephant & wordmark on transparent (light + dark line color), home-screen icon (180 & 1024, square corners), splash, Sophie avatar options A/B/C (light & dark). The mockups use avatar A.
- `Mockup-Redesign-Brief.md` the brief the v3 frames were drawn from: frame list, sample data, word list and checks.

## v3 frames
32 phone frames, light mode unless noted. Sample data is Day 4 (Mon, Nov 2, "now" = 5:30 PM).

| Group | Frames |
|---|---|
| A · Today | A1 light, A2 dark, A3 time for a feed, A3b time for a feed (dark), A4 watch, A5 saved on this phone, A6 tap to reconnect |
| B · + menu | B1 |
| C · Log Feed | C1 light, C2 dark, C3 left in bottle open, C4 time options open, C5 editing (over the Timeline), C6 undo toast |
| D · Log Diaper | D1 nothing chosen, D2 Wet chosen, D3 Dirty chosen, D4 less common color, D5 dark |
| E · Weight and Note | E1 Log Weight, E2 Note |
| F · Timeline | F1 light, F2 dark and scrolled down, F3 clock-change night, F4 finished day below minimum, F5 empty |
| G · Settings, sign-in and rare screens | G1 Settings, G1b sign out question, G2 sign-in, G2b sign-in error, G3 clock-change question, G4 something went wrong |

### v3 changes from v2
- A content and simplification pass, not a restyle: same palette, type, card shapes, button shapes and icons.
- Gone: pump screens and rows, the breast-milk split and % entry, the five-tab bar, tip and partner banners, progress bars, swipe actions, settings rows.
- Today: a feed card ("Last feed ...", "Next feed about ...", Log feed), "Today so far" with three status rows, and one card with Formula today, Last diaper and Weight.
- Sheets: grabber, title with a 44 pt close button, the time chip on its own row, primary button pinned at the bottom. Every sheet fits one screen; the tallest is D4 at 742 of 852 pt.
- Sizes: every tap target is 44 pt or more (chips were 40), no text is under 13 pt (tab and swatch labels were 11), row detail text is 16 pt.

### Beyond the brief (not yet reviewed)
- Status pill tints are lighter than v2 and carry a hairline outline, so pills reach 4.5:1 with the palette's status colors. The v2 tints gave about 4.2:1.
- Heidi's initial badge in the Timeline is teal (was coral tint) and the "25-hr day" badge is neutral (was Watch tint), to keep coral and the Watch color to their stated uses.
- F2, F3 and F4 include invented ordinary rows for Day 3 and Day 2 to fill the scrolled lists. They add up to the day totals in the brief.
- G2b shows a typed email (heidi@example.com) and password dots.
- G1b: Cancel is the filled button, Sign out is outlined. G3: both buttons carry equal weight.
- E1 labels the steppers "Pounds" and "Ounces" rather than putting units beside the numbers.
- E2 draws a plain keyboard stand-in to show where Save sits.
- Frames link to each other (tabs, Log feed, + menu tiles, close buttons) so the canvas can be played as a rough click-through.

### Not done
The brief's step 3: tidying the v2 canvas and adding a "Later (Phase 2)" section. The v3 frames are on their own canvas and the v2 canvas is unchanged.

## Working palette (not final)
| Role | Light | Dark |
|---|---|---|
| Ground | #FBF5E7 cream | #1A1A19 |
| Card | #FFFFFF | #262624 |
| Text / secondary | #2B2A28 / #63605B | #F3EEE4 / #C4BDB1 |
| Primary button | #3A7489 (white text, 5.2:1) | #5D94A6 (dark text) |
| Accent teal | #5D94A6 | #7FB8CB |
| Coral (logo and avatar only) | #D97757 | #E8906F |
| On track | #3E7D5A + check icon | #7FC89A |
| Watch | #9A6A12 + eye icon | #E3B35C |
| Below minimum | #A8532F + alert icon | #F0997A |
| Breast milk / formula (v2 charts only; retired) | #3F7F94 / #C9A071 | #7FB8CB / #D9B27E |

Font in mocks: DM Sans (stand-in; iOS system font is the fallback).

Notes on the v3 stylesheet (`source-v3/sophi.css`):
- Status pill tints, in the order On track / Watch / Below minimum. Light: #F3F9F5 / #FFFBF0 / #FBEDE6, each with a hairline outline in its status color. Dark: the status color at 20% over the card, #38463C / #4C422F / #4E3D35. The pills that appear in the frames measure 4.57 to 5.04:1; dark Watch and Below minimum pills do not appear in any frame.
- Selected chip and secondary button tint is #E8F2F5 (v2 used #E3EEF2), so teal text on it reaches 4.5:1.
- The dark primary button is #5D94A6 with #10211F text, as in the table. The v2 stylesheet used #7FB8CB.
- `--muted` (#8A857D) is for icons only in light mode; it does not reach 4.5:1 as text on white.

## v2 changes
- Declutter pass: removed the quick-log row on phone Today (the + Log tab covers it), minimums sub-labels, breast-milk detail in the next-feed line, and secondary captions on Feed sheet, Timeline, Trends & Care; loosened card spacing.
- iPad frames (820 x 1180 portrait, 1180 x 820 landscape) for the nursery display, light & night mode: countdown to the next window is the hero, 64 pt+ tap targets, clock in the header, rail nav in landscape.

## v2: out of date since 11/9/2026
On 11/9/2026 feeding became formula only and the app was simplified. v3 replaces the v2 phone screens for the first release. The other v2 frames (Sleep, Day Summary, Trends, Care, lock screen, iPad, desktop) were not redrawn: do not build from them without applying the same changes. In v2, these no longer apply:
- **Pump screens** (frame 13) and the pumping card, pump rows and Pump filter chip wherever they appear.
- **Breast-milk split** on Today and on the Feed sheet (mL / % toggle, split bar, formula line), and the % entry frame (`10-FeedPct`). A feed is now one amount in mL; Today shows "Formula today · 330 mL".
- **Five-tab bar.** The tab bar is Today, +, Timeline. The + menu has two large tiles (Feed, Diaper) and a small row with Weight and Note.
- **Tip banner and partner-activity banner** on Today.
- **Swipe actions** on Timeline rows. Tap a row to edit; Delete is a labelled button in the edit sheet.
- **Breast milk / formula chart colors** in the palette above, and the pump and % breast milk charts in Trends.
- Smaller wording changes ("On pace", "window", "Offline · will sync", the 5-second toast) are listed in the UI brief's states table and word list.
