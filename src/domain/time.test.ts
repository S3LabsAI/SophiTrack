import { describe, expect, it } from 'vitest'
import { at } from './fixtures'
import {
  centralDate,
  dayLengthHours,
  endOfDay,
  formatAgo,
  formatDate,
  formatDuration,
  formatShortDate,
  formatTime,
  formatTimeRange,
  resolveLocal,
  startOfDay,
  toEpochMs,
  toIso,
  utcOffsetMin,
  zoneAbbrev,
} from './time'

const utc = (iso: string) => toEpochMs(iso)

describe('Central time basics', () => {
  it('buckets by the Central date, not the UTC date', () => {
    expect(centralDate(utc('2026-11-03T05:59:59Z'))).toBe('2026-11-02')
    expect(centralDate(utc('2026-11-03T06:00:00Z'))).toBe('2026-11-03')
  })

  it('reads the UTC offset from the zone, summer and winter', () => {
    expect(utcOffsetMin(utc('2026-07-04T12:00:00Z'))).toBe(-300)
    expect(utcOffsetMin(utc('2026-12-25T12:00:00Z'))).toBe(-360)
    expect(zoneAbbrev(utc('2026-07-04T12:00:00Z'))).toBe('CDT')
    expect(zoneAbbrev(utc('2026-12-25T12:00:00Z'))).toBe('CST')
  })

  it('resolves an ordinary wall time to one moment', () => {
    expect(resolveLocal('2026-11-02', '17:30')).toEqual({
      kind: 'ok',
      at: utc('2026-11-02T23:30:00Z'),
    })
    expect(toIso(at('2026-11-02', '15:45'))).toBe('2026-11-02T21:45:00Z')
  })

  it('formats times, dates and durations', () => {
    expect(formatTime(at('2026-11-02', '15:45'))).toBe('3:45 PM')
    expect(formatTime(at('2026-11-02', '00:40'))).toBe('12:40 AM')
    expect(formatTime(at('2026-11-02', '12:00'))).toBe('12:00 PM')
    expect(formatDate('2026-11-02')).toBe('Mon, Nov 2')
    expect(formatDate('2026-11-01')).toBe('Sun, Nov 1')
    expect(formatShortDate('2026-11-12')).toBe('Nov 12')
    expect(formatDuration(105 * 60_000)).toBe('1 hr 45 min')
    expect(formatDuration(45 * 60_000)).toBe('45 min')
    expect(formatDuration(120 * 60_000)).toBe('2 hr')
    expect(formatAgo(195 * 60_000)).toBe('3 hr 15 min ago')
    expect(formatAgo(20_000)).toBe('just now')
    expect(formatAgo(-5_000)).toBe('just now')
  })

  it('formats a time range, repeating AM/PM only when the halves differ', () => {
    expect(formatTimeRange(at('2026-11-02', '17:45'), at('2026-11-02', '18:45'))).toBe(
      '5:45 to 6:45 PM',
    )
    expect(formatTimeRange(at('2026-11-02', '11:45'), at('2026-11-02', '12:45'))).toBe(
      '11:45 AM to 12:45 PM',
    )
    expect(formatTimeRange(at('2026-11-02', '23:30'), at('2026-11-03', '00:30'))).toBe(
      '11:30 PM to 12:30 AM',
    )
  })
})

describe.each([
  { date: '2026-11-01', prev: '2026-10-31' },
  { date: '2027-11-07', prev: '2027-11-06' },
])('fall back on $date', ({ date, prev }) => {
  it('is a 25-hour day', () => {
    expect(dayLengthHours(date)).toBe(25)
    expect(endOfDay(date) - startOfDay(date)).toBe(25 * 3_600_000)
    expect(dayLengthHours(prev)).toBe(24)
  })

  it('finds two moments for 1:30 AM, an hour apart', () => {
    const r = resolveLocal(date, '01:30')
    expect(r.kind).toBe('ambiguous')
    if (r.kind !== 'ambiguous') return
    expect(toIso(r.earlier)).toBe(`${date}T06:30:00Z`)
    expect(toIso(r.later)).toBe(`${date}T07:30:00Z`)
    expect(utcOffsetMin(r.earlier)).toBe(-300)
    expect(utcOffsetMin(r.later)).toBe(-360)
  })

  it('labels only the repeated hour with CDT / CST', () => {
    const r = resolveLocal(date, '01:30')
    if (r.kind !== 'ambiguous') throw new Error('expected ambiguous')
    expect(formatTime(r.earlier)).toBe('1:30 AM CDT')
    expect(formatTime(r.later)).toBe('1:30 AM CST')
    expect(formatTime(at(date, '00:59'))).toBe('12:59 AM')
    expect(formatTime(at(date, '02:00'))).toBe('2:00 AM')
    expect(formatTime(at(date, '14:00'))).toBe('2:00 PM')
  })

  it('treats 1:00 and 1:59 as repeated, 12:59 and 2:00 as not', () => {
    expect(resolveLocal(date, '01:00').kind).toBe('ambiguous')
    expect(resolveLocal(date, '01:59').kind).toBe('ambiguous')
    expect(resolveLocal(date, '00:59').kind).toBe('ok')
    expect(resolveLocal(date, '02:00').kind).toBe('ok')
  })

  it('keeps both halves of the repeated hour in the same Central day', () => {
    const r = resolveLocal(date, '01:30')
    if (r.kind !== 'ambiguous') throw new Error('expected ambiguous')
    expect(centralDate(r.earlier)).toBe(date)
    expect(centralDate(r.later)).toBe(date)
  })
})

describe('fall back 11/1/2026: durations come from UTC', () => {
  it('a 1:45 AM CDT feed and a 1:10 AM CST feed are 25 minutes apart', () => {
    const first = resolveLocal('2026-11-01', '01:45')
    const second = resolveLocal('2026-11-01', '01:10')
    if (first.kind !== 'ambiguous' || second.kind !== 'ambiguous') throw new Error('expected both')
    expect(formatTime(first.earlier)).toBe('1:45 AM CDT')
    expect(formatTime(second.later)).toBe('1:10 AM CST')
    expect(second.later - first.earlier).toBe(25 * 60_000)
    expect(formatDuration(second.later - first.earlier)).toBe('25 min')
  })
})

describe('spring forward on 2027-03-14', () => {
  const date = '2027-03-14'

  it('is a 23-hour day', () => {
    expect(dayLengthHours(date)).toBe(23)
    expect(dayLengthHours('2027-03-13')).toBe(24)
    expect(dayLengthHours('2027-03-15')).toBe(24)
  })

  it('blocks 2:00 to 2:59 AM and suggests 3:xx', () => {
    const r = resolveLocal(date, '02:30')
    expect(r).toEqual({
      kind: 'gap',
      suggestedTime: '03:30',
      suggestedAt: utc('2027-03-14T08:30:00Z'),
    })
    expect(resolveLocal(date, '02:00').kind).toBe('gap')
    expect(resolveLocal(date, '02:59').kind).toBe('gap')
    expect(resolveLocal(date, '01:59').kind).toBe('ok')
    expect(resolveLocal(date, '03:00').kind).toBe('ok')
  })

  it('never adds a zone label that day', () => {
    expect(formatTime(at(date, '01:30'))).toBe('1:30 AM')
    expect(formatTime(at(date, '03:30'))).toBe('3:30 AM')
  })

  it('1:59 AM to 3:00 AM is one minute', () => {
    expect(at(date, '03:00') - at(date, '01:59')).toBe(60_000)
  })
})
