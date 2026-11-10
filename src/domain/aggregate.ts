import { logDate } from './dayOfLife'
import { drankMl } from './feed'
import { toEpochMs } from './time'
import type { DateKey, DiaperEntry, Entry, EpochMs, FeedEntry, MeasurementEntry } from './types'

export interface Totals {
  feeds: number
  /** mL she drank, to one decimal. */
  formulaMl: number
  wets: number
  dirties: number
}

const HOUR_MS = 3_600_000

function live(entries: readonly Entry[]): Entry[] {
  return entries.filter((e) => !e.deleted_at)
}

function total(entries: readonly Entry[]): Totals {
  let feeds = 0
  let tenths = 0
  let wets = 0
  let dirties = 0
  for (const e of entries) {
    if (e.kind === 'feed') {
      feeds += 1
      tenths += Math.round(drankMl(e.data) * 10)
    } else if (e.kind === 'diaper') {
      if (e.data.wet) wets += 1
      if (e.data.dirty) dirties += 1
    }
  }
  return { feeds, formulaMl: tenths / 10, wets, dirties }
}

/** Totals for one Central calendar day. Birth-hour entries count under Day 1. */
export function dayTotals(entries: readonly Entry[], date: DateKey, day1: DateKey): Totals {
  return total(live(entries).filter((e) => logDate(toEpochMs(e.occurred_at), day1) === date))
}

/** Totals for a true rolling window ending now (24 hours unless told otherwise). */
export function rollingTotals(entries: readonly Entry[], now: EpochMs, hours = 24): Totals {
  const from = now - hours * HOUR_MS
  return total(
    live(entries).filter((e) => {
      const at = toEpochMs(e.occurred_at)
      return at > from && at <= now
    }),
  )
}

function latest<T extends Entry>(entries: readonly T[]): T | null {
  let best: T | null = null
  let bestAt = -Infinity
  for (const e of entries) {
    const at = toEpochMs(e.occurred_at)
    if (at >= bestAt) {
      best = e
      bestAt = at
    }
  }
  return best
}

export function lastFeed(entries: readonly Entry[]): FeedEntry | null {
  return latest(live(entries).filter((e): e is FeedEntry => e.kind === 'feed'))
}

export function lastDiaper(entries: readonly Entry[]): DiaperEntry | null {
  return latest(live(entries).filter((e): e is DiaperEntry => e.kind === 'diaper'))
}

/** The most recent measurement that has a weight. */
export function lastWeight(entries: readonly Entry[]): MeasurementEntry | null {
  return latest(
    live(entries).filter(
      (e): e is MeasurementEntry => e.kind === 'measurement' && e.data.weight_g != null,
    ),
  )
}

export interface FeedSettings {
  /** Minutes from a feed to the start of the next-feed range (120). */
  feed_interval_min: number
  /** Length of the next-feed range in minutes (60). */
  feed_window_min: number
}

export const DEFAULT_FEED_SETTINGS: FeedSettings = { feed_interval_min: 120, feed_window_min: 60 }

export interface FeedTiming {
  lastFeedAt: EpochMs
  /** Real elapsed time since the last feed, from UTC. Never negative. */
  sinceMs: number
  nextFrom: EpochMs
  nextTo: EpochMs
  /** "Time for a feed": the next-feed range has passed. */
  due: boolean
}

/** Time since the last feed and the next-feed range. Null until a feed is logged. */
export function feedTiming(
  entries: readonly Entry[],
  now: EpochMs,
  settings: FeedSettings = DEFAULT_FEED_SETTINGS,
): FeedTiming | null {
  const feed = lastFeed(entries)
  if (!feed) return null
  const lastFeedAt = toEpochMs(feed.occurred_at)
  const nextFrom = lastFeedAt + settings.feed_interval_min * 60_000
  const nextTo = nextFrom + settings.feed_window_min * 60_000
  return { lastFeedAt, sinceMs: Math.max(0, now - lastFeedAt), nextFrom, nextTo, due: now > nextTo }
}
