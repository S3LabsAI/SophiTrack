# SophiTrack design mockups (v2)

Live canvas (editable): https://claude.ai/artifact/6R9uhNHeXC4UUxqqmoBiu8

## Folders
- `mockups/` PNG export of every frame, numbered in canvas order (00 logo sheet ... 25 desktop trends, 26-30 iPad portrait & landscape)

## v2 changes
- Declutter pass: removed the quick-log row on phone Today (the + Log tab covers it), minimums sub-labels, breast-milk detail in the next-feed line, and secondary captions on Feed sheet, Timeline, Trends & Care; loosened card spacing.
- iPad frames (820 x 1180 portrait, 1180 x 820 landscape) for the nursery display, light & night mode: countdown to the next window is the hero, 64 pt+ tap targets, clock in the header, rail nav in landscape.
- `brand/` assets lifted from the app icon (not redrawn): elephant & wordmark on transparent (light + dark line color), home-screen icon (180 & 1024, square corners), splash, Sophie avatar options A/B/C (light & dark)

## Working palette (not final)
| Role | Light | Dark |
|---|---|---|
| Ground | #FBF5E7 cream | #1A1A19 |
| Card | #FFFFFF | #262624 |
| Text / secondary | #2B2A28 / #63605B | #F3EEE4 / #C4BDB1 |
| Primary button | #3A7489 (white text, 5.2:1) | #5D94A6 (dark text) |
| Accent teal | #5D94A6 | #7FB8CB |
| Coral (highlights only) | #D97757 | #E8906F |
| On track | #3E7D5A + check icon | #7FC89A |
| Watch | #9A6A12 + eye icon | #E3B35C |
| Below minimum | #A8532F + alert icon | #F0997A |
| Breast milk / formula (charts; out of date, see below) | #3F7F94 / #C9A071 | #7FB8CB / #D9B27E |

Font in mocks: DM Sans (stand-in; iOS system font is the fallback).

## Out of date since 11/9/2026
On 11/9/2026 feeding became formula only and the app was simplified. The mockups and canvas were not redrawn. `SophiTrack-UI-Brief.md` is the build reference; where it and a mockup differ, the brief wins. No longer applies:
- **Pump screens** (frame 13) and the pumping card, pump rows and Pump filter chip wherever they appear.
- **Breast-milk split** on Today and on the Feed sheet (mL / % toggle, split bar, formula line), and the % entry frame (`10-FeedPct`). A feed is now one amount in mL; Today shows "Formula today · 330 mL".
- **Five-tab bar.** The tab bar is Today, +, Timeline. The + menu has two large tiles (Feed, Diaper) and a small row with Weight and Note.
- **Tip banner and partner-activity banner** on Today.
- **Swipe actions** on Timeline rows. Tap a row to edit; Delete is a labelled button in the edit sheet.
- **Breast milk / formula chart colors** in the palette above, and the pump and % breast milk charts in Trends.
- Smaller wording changes ("On pace", "window", "Offline · will sync", the 5-second toast) are listed in the brief's states table and word list.
