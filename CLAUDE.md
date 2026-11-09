# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

SophiTrack is a private newborn tracker PWA (iPhone-first, plus iPad nursery display and desktop) for two parents, Tom & Heidi, tracking their daughter Sophie. Built milestone by milestone per `SophiTrack-Build-Plan.md`; M0 (setup) is done, so the app is currently a placeholder shell.

As of 11/9/2026 feeding is **formula only**: there is no pumping, breast milk or breastfeeding tracking anywhere in the app. The MVP is two actions (Feed, Diaper) and two screens (Today, Timeline), with Weight and Note as small extras in the + menu. The tab bar is Today, +, Timeline.

## Commands

```bash
npm run dev            # Vite dev server
npm run build          # typecheck (tsc -b) + production build to dist/
npm run check          # typecheck + oxlint + prettier --check + unit tests: run before committing
npm test               # Vitest, once (src/**/*.test.ts[x])
npx vitest run src/domain/time.test.ts      # one test file
npx vitest run -t "fall back"               # tests whose name matches
npm run e2e            # Playwright smoke tests (WebKit, iPhone 15 viewport); builds and serves on :4173
npm run format         # Prettier write
```

Linting is **oxlint** (the Vite scaffold default), not ESLint. Prettier ignores `*.md` and the design/asset folders. TypeScript is strict.

## Infrastructure

- **GitHub:** public repo `S3LabsAI/SophiTrack` (the gh account formerly named TomsTools11), branch `main`.
- **Vercel:** team "S3 Projects" (`team_S3B9QxHnMuFU2aNBw3Me9BMs`), project `sophitrack`, imported from the GitHub repo so every push to `main` deploys to production at **https://sophitrack.vercel.app**. Env vars are set for Production and Preview; Vite inlines them at build time, so changing them needs a redeploy. The Vercel MCP connection cannot create projects in this team (403); project-level changes may need the dashboard. `vercel.json` rewrites extensionless paths to `index.html` (SPA routing) and sets `noindex`.
- **Supabase:** org TomsTools, project `sophitrack`, ref `khcbelbmngvctesbsuzf`, region us-east-2. Client env vars `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` live in `.env.local` (git-ignored; template in `.env.example`) and in Vercel project env. Use the `sb_publishable_…` key, not the legacy anon JWT.
- **Migrations:** SQL files in `supabase/migrations/`, applied to the hosted project with the Supabase MCP `apply_migration` tool (the Supabase CLI is installed as a dev dependency, `npx supabase`, but not logged in or linked). Never edit an applied migration; add a new one.

## Source-of-truth documents

- `SophiTrack-High-Level-Plan.md`: product spec. Tracked fields per entity (§2), reference minimums for Days 1-6 (§3), app structure (§4), data model (§5), technical basics and the DST rules (§6, §6.1), phased roadmap (§7), decisions already made (§8). Read the relevant section before building a feature.
- `SophiTrack-UI-Brief.md`: the build reference for each screen: per-screen behavior, the word list (§6.1), sample data (Day 4, Mon 11/2, "now" = 5:30 PM, formula only), and UI states (time for a feed, watch, below minimum, empty, saved on this phone, tap to reconnect). It was revised on 11/9/2026; where it and the PNG mockups differ, the brief wins. The sample data is good fixture data for tests and seed scripts.
- `SophiTrack-Build-Plan.md`: stack, architecture, schema, repo layout, MVP milestones with done-when checks, cut order, Phase 2 order, open questions. Follow it when building; update it when a decision changes.
- `design/README.md`: working palette (light/dark tokens, status colors), v2 design changes, and a list of what in the mockups is out of date since 11/9/2026. Live editable canvas: https://claude.ai/artifact/6R9uhNHeXC4UUxqqmoBiu8
- `tracking-items/`: the original tracking list (its pumping and milk-type sections are historical), plus photos of the paper hospital sheets the app replaces (photos are local only).

**The GitHub repo is public.** Never commit personal data: sheet photos, backfill CSVs, account emails, or exported logs. They live in git-ignored paths (`private/`, `tracking-items/*.jpeg|png|heic|csv`, `backfill/`). Seed SQL that needs real emails must read them from `private/`, not hard-code them.

## Design assets

- `design/mockups/NN-Name.png`: PNG of every frame, numbered in canvas order. Look at these when building a screen, but they predate the 11/9/2026 formula-only and simplification decisions (pump screens, breast-milk split, five-tab bar, banners, swipe actions); the UI brief wins.
- `design/source/*.dc.html` + `sophi.css`: canvas source exported from the design artifact. They depend on a `support.js` runtime and `/_blob/...` image URLs that are not in the repo, so they don't render standalone. `sophi.css` is still the best reference for design tokens (CSS custom properties on `.phone/.pad/.desk`, `.dark` overrides) and component styling.
- `design/brand/`: production-ready logo, wordmark, home-screen icons (180, 1024), splash, and Sophie avatar options. `assets/sophitrack-app-icon.png` is the master icon. Don't redraw the elephant mark or wordmark.
- Font in mocks is DM Sans as a stand-in; iOS system font is the fallback. Palette and fonts are not final.

## Planned architecture (from the spec)

- PWA: manifest, standalone display, iPhone safe areas, splash. Web push reminders (iOS home-screen web apps) are Phase 2; every reminder goes to **both** parents, and logging a feed clears it for both.
- Shared backend with auth and real-time sync (Supabase): one baby profile, two parent accounts, every entry records `logged_by`. Sign-in is email + password; sign-ups are turned off (the first step of M2) and Tom creates both accounts by hand.
- Offline-first: logging must work with no signal and sync later. Entries are written to the phone first, and Today draws from the local copy without waiting on the network.
- Hosting: Vercel. `sophitrack.vercel.app` is the permanent address.
- Reference metrics (minimum wets/dirty diapers/feeds by day of life, etc.) are stored **as data with a source citation**, not hard-coded. Tom edits them in Supabase, not in the app.
- Units: store everything in mL. oz may come later as a display setting only. Weight is entered in pounds and ounces and stored in grams.

## Domain rules that span many features

**Time handling (spec §6.1). Get this right everywhere:**
- Store every event as a UTC `timestamptz` plus the UTC offset at that moment. Never store local time alone; never hard-code `-6`.
- All day bucketing, reporting, and display use the IANA zone `America/Chicago`, regardless of the phone's time zone. Use Temporal via `temporal-polyfill`, per the build plan.
- Day of life = Central calendar date minus 2026-10-29. So 10/30/2026 = Day 1. Events in the birth hour (10/29 10:59 PM to midnight) count toward Day 1. Days roll over at midnight Central.
- Durations ("time since last feed", sleep stretches) come from UTC math, never wall-clock subtraction.
- Fall-back night (1:00-1:59 AM repeats): label times with CDT/CST; backdated entries in that hour must ask "first or second 1:30?". Spring-forward (2:00-2:59 AM doesn't exist): the time picker blocks it and suggests 3:xx.
- Daily totals stay per calendar day, with a "25-hr day" / "23-hr day" badge on transition days. "Last 24 hrs" metrics use a true rolling 24 hours.
- Required unit tests for 2026-11-01 (fall back), 2027-03-14 (spring forward), and 2027-11-07 (fall back).
- Export rows include local date, local time, zone, UTC offset, UTC timestamp, and day of life.

**Feed math (spec §2.1):** a feed is `amount_ml` of formula, by bottle, with an optional `left_ml` (left in bottle). What she drank = amount minus leftover, derived and never stored. `amount_ml` is required for new feeds and optional only for entries imported from the paper sheets (`source = 'paper'`), which still count as a feed. Entry kinds: `feed`, `diaper`, `sleep`, `care`, `note`, `measurement` (build plan §3).

**Status language:** every metric shows On track / Watch / Below minimum with an icon and a word, never color alone; "On pace" is not used. Pace rule (one-behind grace): during the day a metric is Watch only when count < minimum × fraction of the Central day elapsed − 1, otherwise On track; after the day ends it is On track if count ≥ minimum, else Below minimum (so Below minimum shows on a finished day in the Timeline, never on Today). Copy is calm and always points to "check with your pediatrician", never a diagnosis.

**Logging UX:** 2 taps, one-handed, at 3am. Tap targets ≥ 44 pt (64 pt+ on iPad). Steppers, presets, and chips instead of keyboards. The feed amount defaults to the last value used; diaper type and poop color have no default. Forms are bottom sheets; saving or deleting shows an 8-second toast with Undo. Entries must be easy to backdate, edit, and delete.

**Simplicity first:** Heidi is the daily user and is not technical. Prefer fewer fields, fewer settings, and fewer words; use the UI brief's word list. Put admin tasks (accounts, install, minimums, backfill, export) on Tom's side, in person or in Supabase, not in the app. Do not reintroduce pumping or breast-milk tracking.

## Roadmap

Phase 1 (MVP) is the current target: profile, two-parent login and sync, feed and diaper logging (formula only), weight logging with a "% from birth weight" line, Today dashboard vs. the daily minimums with a "Formula today" total, Timeline with edit/delete, backfill from paper sheets (photos to CSV to import script), PWA install. Sleep, Trends, Day Summary, Care, and reminders are Phase 2. Pumping, breast-milk amounts, and breast-milk-on-hand are removed, not deferred. See spec §7 before pulling Phase 2 or 3 work forward.
