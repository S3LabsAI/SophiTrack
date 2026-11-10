import { describe, expect, it } from 'vitest'
import { dayTotals } from './aggregate'
import { SOPHIE_DAY1 } from './dayOfLife'
import { DAY4, DAY4_ENTRIES, DAY4_MINIMUMS, DAY4_NOW, at } from './fixtures'
import { STATUS_LABEL, metricStatus, minimumsForDay, moreNeeded } from './status'
import type { ReferenceMetric } from './status'

describe('pace rule (one-behind grace)', () => {
  it('zero entries at 12:05 AM and at 3:00 AM are On track for every metric', () => {
    for (const time of ['00:00', '00:05', '03:00']) {
      for (const minimum of [8, 4, 2]) {
        expect(metricStatus(0, minimum, DAY4, at(DAY4, time))).toBe('on_track')
      }
    }
  })

  it('zero feeds against a minimum of 8 is Watch at 6:00 AM', () => {
    // 8 x 6/24 - 1 = 1, and 0 < 1.
    expect(metricStatus(0, 8, DAY4, at(DAY4, '06:00'))).toBe('watch')
    expect(metricStatus(1, 8, DAY4, at(DAY4, '06:00'))).toBe('on_track')
  })

  it('zero feeds turns Watch just after 3:00 AM (the decided formula)', () => {
    expect(metricStatus(0, 8, DAY4, at(DAY4, '03:01'))).toBe('watch')
  })

  it('6 of 8 feeds at 6 PM is On track', () => {
    expect(metricStatus(6, 8, DAY4, at(DAY4, '18:00'))).toBe('on_track')
  })

  it('3 of 4 wets at 5:30 PM is On track', () => {
    expect(metricStatus(3, 4, DAY4, DAY4_NOW)).toBe('on_track')
  })

  it('is On track at exactly the line and Watch one below it', () => {
    // At 6 PM the line for feeds is 8 x 18/24 - 1 = 5.
    expect(metricStatus(5, 8, DAY4, at(DAY4, '18:00'))).toBe('on_track')
    expect(metricStatus(4, 8, DAY4, at(DAY4, '18:00'))).toBe('watch')
  })

  it('never shows Below minimum during the day', () => {
    expect(metricStatus(0, 8, DAY4, at(DAY4, '23:59'))).toBe('watch')
  })

  it('after the day ends: 7 of 8 is Below minimum, 8 of 8 is On track', () => {
    const midnight = at('2026-11-03', '00:00')
    expect(metricStatus(7, 8, DAY4, midnight)).toBe('below_minimum')
    expect(metricStatus(8, 8, DAY4, midnight)).toBe('on_track')
    expect(metricStatus(9, 8, DAY4, at('2026-11-09', '12:00'))).toBe('on_track')
  })

  it('a day that has not started is On track', () => {
    expect(metricStatus(0, 8, '2026-11-03', DAY4_NOW)).toBe('on_track')
  })

  it('uses the real length of a 25-hour and a 23-hour day', () => {
    // 11/1/2026 is 25 hours. 6:00 AM CST is 7 real hours in: 8 x 7/25 - 1 = 1.24.
    expect(metricStatus(1, 8, '2026-11-01', at('2026-11-01', '06:00'))).toBe('watch')
    expect(metricStatus(2, 8, '2026-11-01', at('2026-11-01', '06:00'))).toBe('on_track')
    // 3/14/2027 is 23 hours. 6:00 AM CDT is 5 real hours in: 8 x 5/23 - 1 = 0.74.
    expect(metricStatus(0, 8, '2027-03-14', at('2027-03-14', '06:00'))).toBe('watch')
    expect(metricStatus(1, 8, '2027-03-14', at('2027-03-14', '06:00'))).toBe('on_track')
    // On an ordinary day, 5 hours in: 8 x 5/24 - 1 = 0.67, so 0 is Watch as well.
    expect(metricStatus(0, 8, '2027-03-15', at('2027-03-15', '05:00'))).toBe('watch')
  })

  it('gives a different answer than a 24-hour day would on clock-change days', () => {
    // 11/1/2026, 11:30 PM CST is 24.5 of 25 hours in: 8 x 24.5/25 - 1 = 6.84 (24 hours would give 7.17).
    const lateFallBack = at('2026-11-01', '23:30')
    expect(metricStatus(7, 8, '2026-11-01', lateFallBack)).toBe('on_track')
    expect(moreNeeded(7, 8, '2026-11-01', lateFallBack)).toBe(0)
    // The 25-hour day ends at midnight, not 24 hours after it began.
    expect(metricStatus(7, 8, '2026-11-01', at('2026-11-02', '00:00'))).toBe('below_minimum')
    expect(moreNeeded(7, 8, '2026-11-01', at('2026-11-02', '00:00'))).toBe(1)
    // 3/14/2027, 9:30 PM CDT is 20.5 of 23 hours in: 8 x 20.5/23 - 1 = 6.13 (24 hours would give 5.83).
    const lateSpringForward = at('2027-03-14', '21:30')
    expect(metricStatus(6, 8, '2027-03-14', lateSpringForward)).toBe('watch')
    expect(moreNeeded(6, 8, '2027-03-14', lateSpringForward)).toBe(1)
    // The 23-hour day ends at midnight, an hour sooner than 24 hours after it began.
    expect(metricStatus(0, 8, '2027-03-14', at('2027-03-14', '23:59'))).toBe('watch')
    expect(metricStatus(7, 8, '2027-03-14', at('2027-03-15', '00:00'))).toBe('below_minimum')
  })

  it('uses the words from the brief', () => {
    expect(STATUS_LABEL).toEqual({
      on_track: 'On track',
      watch: 'Watch',
      below_minimum: 'Below minimum',
    })
  })
})

describe("the UI brief's Day 4 sample at 5:30 PM", () => {
  it('shows all three rows On track', () => {
    const totals = dayTotals(DAY4_ENTRIES, DAY4, SOPHIE_DAY1)
    expect(metricStatus(totals.feeds, DAY4_MINIMUMS.feeds, DAY4, DAY4_NOW)).toBe('on_track')
    expect(metricStatus(totals.wets, DAY4_MINIMUMS.wets, DAY4, DAY4_NOW)).toBe('on_track')
    expect(metricStatus(totals.dirties, DAY4_MINIMUMS.dirties, DAY4, DAY4_NOW)).toBe('on_track')
  })
})

describe('how many more are needed', () => {
  it('is zero when On track', () => {
    expect(moreNeeded(3, 4, DAY4, DAY4_NOW)).toBe(0)
    expect(moreNeeded(0, 8, DAY4, at(DAY4, '03:00'))).toBe(0)
  })

  it('is the number that clears Watch', () => {
    // 1 wet at 5:30 PM: the line is 4 x 17.5/24 - 1 = 1.92, so 1 more.
    expect(metricStatus(1, 4, DAY4, DAY4_NOW)).toBe('watch')
    expect(moreNeeded(1, 4, DAY4, DAY4_NOW)).toBe(1)
    expect(metricStatus(2, 4, DAY4, DAY4_NOW)).toBe('on_track')
    // 2 feeds at 6 PM: the line is 5, so 3 more.
    expect(moreNeeded(2, 8, DAY4, at(DAY4, '18:00'))).toBe(3)
    expect(metricStatus(5, 8, DAY4, at(DAY4, '18:00'))).toBe('on_track')
  })

  it('is the shortfall once the day has ended', () => {
    expect(moreNeeded(7, 8, DAY4, at('2026-11-03', '00:00'))).toBe(1)
    expect(moreNeeded(8, 8, DAY4, at('2026-11-03', '00:00'))).toBe(0)
  })
})

describe('minimums for a day of life', () => {
  const rows: ReferenceMetric[] = [
    { metric: 'feeds', day_from: 1, day_to: null, min: 8 },
    { metric: 'wets', day_from: 4, day_to: 4, min: 4 },
    { metric: 'wets', day_from: 6, day_to: null, min: 6 },
    { metric: 'dirties', day_from: 4, day_to: 4, min: 2 },
    { metric: 'weight', day_from: 1, day_to: null, min: null },
  ]

  it('picks the rows for Day 4', () => {
    expect(minimumsForDay(rows, 4)).toEqual(DAY4_MINIMUMS)
  })

  it('applies an open-ended row to later days', () => {
    expect(minimumsForDay(rows, 11)).toEqual({ feeds: 8, wets: 6 })
  })

  it('leaves out a metric with no row for that day', () => {
    expect(minimumsForDay(rows, 5)).toEqual({ feeds: 8 })
  })
})
