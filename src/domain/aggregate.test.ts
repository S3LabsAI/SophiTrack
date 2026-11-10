import { describe, expect, it } from 'vitest'
import { dayTotals, feedTiming, lastDiaper, lastFeed, lastWeight, rollingTotals } from './aggregate'
import { SOPHIE_DAY1 } from './dayOfLife'
import { DAY4, DAY4_ENTRIES, DAY4_NOW, at, diaper, feed } from './fixtures'
import { formatAgo, formatTime, formatTimeRange, resolveLocal, toIso } from './time'
import type { Entry } from './types'

describe("the UI brief's Day 4 sample (Mon 11/2, now = 5:30 PM)", () => {
  it('totals 6 feeds, 330 mL, 3 wet and 2 dirty', () => {
    expect(dayTotals(DAY4_ENTRIES, DAY4, SOPHIE_DAY1)).toEqual({
      feeds: 6,
      formulaMl: 330,
      wets: 3,
      dirties: 2,
    })
  })

  it('says "Last feed 1 hr 45 min ago" and "Next feed about 5:45 to 6:45 PM"', () => {
    const t = feedTiming(DAY4_ENTRIES, DAY4_NOW)
    if (!t) throw new Error('expected a feed')
    expect(formatAgo(t.sinceMs)).toBe('1 hr 45 min ago')
    expect(formatTimeRange(t.nextFrom, t.nextTo)).toBe('5:45 to 6:45 PM')
    expect(t.due).toBe(false)
  })

  it('turns to "Time for a feed" once the range has passed', () => {
    expect(feedTiming(DAY4_ENTRIES, at(DAY4, '18:45'))?.due).toBe(false)
    const t = feedTiming(DAY4_ENTRIES, at(DAY4, '19:00'))
    expect(t?.due).toBe(true)
    expect(formatAgo(t?.sinceMs ?? 0)).toBe('3 hr 15 min ago')
    expect(formatTime(t?.lastFeedAt ?? 0)).toBe('3:45 PM')
  })

  it('finds the last diaper: 3:45 PM, wet and dirty', () => {
    const d = lastDiaper(DAY4_ENTRIES)
    expect(d && formatTime(Date.parse(d.occurred_at))).toBe('3:45 PM')
    expect(d?.data).toMatchObject({ wet: true, dirty: true })
  })
})

describe('day totals', () => {
  it('a "Both" diaper adds one wet and one dirty', () => {
    expect(dayTotals([diaper(DAY4, '10:00', true, true)], DAY4, SOPHIE_DAY1)).toMatchObject({
      wets: 1,
      dirties: 1,
    })
  })

  it('a paper feed with no amount counts as a feed and adds 0 mL', () => {
    const entries = [feed(DAY4, '02:40', 35), feed(DAY4, '04:10')]
    expect(dayTotals(entries, DAY4, SOPHIE_DAY1)).toMatchObject({ feeds: 2, formulaMl: 35 })
  })

  it('leaves out deleted entries, and Undo brings them back', () => {
    const deleted: Entry = { ...feed(DAY4, '08:00', 60), deleted_at: '2026-11-02T15:00:00Z' }
    expect(dayTotals([deleted], DAY4, SOPHIE_DAY1).feeds).toBe(0)
    expect(dayTotals([{ ...deleted, deleted_at: null }], DAY4, SOPHIE_DAY1).feeds).toBe(1)
    expect(lastFeed([deleted])).toBeNull()
  })

  it('splits days at midnight Central', () => {
    const entries = [feed('2026-11-02', '23:59', 60), feed('2026-11-03', '00:00', 50)]
    expect(dayTotals(entries, '2026-11-02', SOPHIE_DAY1).formulaMl).toBe(60)
    expect(dayTotals(entries, '2026-11-03', SOPHIE_DAY1).formulaMl).toBe(50)
  })

  it('counts birth-hour entries under Day 1 (10/30)', () => {
    const entries = [feed('2026-10-29', '23:30', 1), feed('2026-10-30', '02:00', 2)]
    expect(dayTotals(entries, '2026-10-30', SOPHIE_DAY1)).toMatchObject({ feeds: 2, formulaMl: 3 })
    expect(dayTotals(entries, '2026-10-29', SOPHIE_DAY1).feeds).toBe(0)
  })

  it('adds tenths of a mL without drift', () => {
    const entries = [feed(DAY4, '01:00', 0.1), feed(DAY4, '02:00', 0.2)]
    expect(dayTotals(entries, DAY4, SOPHIE_DAY1).formulaMl).toBe(0.3)
  })

  it('keeps both 1:30 AM entries of fall-back night in the 25-hour day', () => {
    const r = resolveLocal('2026-11-01', '01:30')
    if (r.kind !== 'ambiguous') throw new Error('expected ambiguous')
    const entries: Entry[] = [
      { id: 'a', kind: 'feed', occurred_at: toIso(r.earlier), data: { amount_ml: 40 } },
      { id: 'b', kind: 'diaper', occurred_at: toIso(r.later), data: { wet: true, dirty: false } },
    ]
    expect(dayTotals(entries, '2026-11-01', SOPHIE_DAY1)).toEqual({
      feeds: 1,
      formulaMl: 40,
      wets: 1,
      dirties: 0,
    })
  })
})

describe('rolling 24 hours', () => {
  it('is a true 24 hours, across midnight', () => {
    const entries = [
      feed('2026-11-01', '17:30', 40),
      feed('2026-11-01', '17:31', 50),
      ...DAY4_ENTRIES,
    ]
    expect(rollingTotals(entries, DAY4_NOW)).toMatchObject({ feeds: 7, formulaMl: 380 })
  })

  it('is 24 real hours on the 25-hour day', () => {
    const now = at('2026-11-01', '12:00')
    const entries = [feed('2026-10-31', '12:30', 40), feed('2026-10-31', '13:30', 50)]
    expect(rollingTotals(entries, now)).toMatchObject({ feeds: 1, formulaMl: 50 })
  })

  it('ignores entries dated after now', () => {
    expect(rollingTotals([feed(DAY4, '18:00', 60)], DAY4_NOW).feeds).toBe(0)
  })
})

describe('last feed and weight', () => {
  it('has no timing until a feed is logged', () => {
    expect(feedTiming([], DAY4_NOW)).toBeNull()
    expect(feedTiming([diaper(DAY4, '10:00', true, false)], DAY4_NOW)).toBeNull()
  })

  it('never shows a negative time since the last feed', () => {
    const t = feedTiming([feed(DAY4, '17:31', 60)], DAY4_NOW)
    expect(t?.sinceMs).toBe(0)
    expect(formatAgo(t?.sinceMs ?? -1)).toBe('just now')
  })

  it('measures across fall-back night in real time', () => {
    const t = feedTiming([feed('2026-11-01', '00:30', 40)], at('2026-11-01', '03:30'))
    expect(formatAgo(t?.sinceMs ?? 0)).toBe('4 hr ago')
  })

  it('uses the settings for the next-feed range', () => {
    const t = feedTiming(DAY4_ENTRIES, DAY4_NOW, { feed_interval_min: 180, feed_window_min: 30 })
    expect(t && formatTimeRange(t.nextFrom, t.nextTo)).toBe('6:45 to 7:15 PM')
  })

  it('finds the latest weight and skips measurements without one', () => {
    const entries: Entry[] = [
      {
        id: 'w1',
        kind: 'measurement',
        occurred_at: '2026-11-01T16:00:00Z',
        data: { weight_g: 2835 },
      },
      {
        id: 'w2',
        kind: 'measurement',
        occurred_at: '2026-11-02T16:00:00Z',
        data: { length_cm: 49 },
      },
    ]
    expect(lastWeight(entries)?.id).toBe('w1')
    expect(lastWeight([])).toBeNull()
  })
})
