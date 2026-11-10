import { describe, expect, it } from 'vitest'
import {
  SOPHIE_DAY1,
  dateForDayOfLife,
  dayLengthBadge,
  dayOfLife,
  dayOfLifeForDate,
  logDate,
} from './dayOfLife'
import { DAY4, DAY4_NOW, at } from './fixtures'
import { toEpochMs } from './time'

describe('day of life', () => {
  it('10/30/2026 is Day 1 and the sample day is Day 4', () => {
    expect(dayOfLifeForDate('2026-10-30', SOPHIE_DAY1)).toBe(1)
    expect(dayOfLifeForDate(DAY4, SOPHIE_DAY1)).toBe(4)
    expect(dayOfLife(DAY4_NOW, SOPHIE_DAY1)).toBe(4)
    expect(dayOfLifeForDate('2026-11-09', SOPHIE_DAY1)).toBe(11)
  })

  it('counts the birth hour (10/29 10:59 PM to midnight) as Day 1', () => {
    const birth = at('2026-10-29', '22:59')
    expect(birth).toBe(toEpochMs('2026-10-30T03:59:00Z'))
    expect(dayOfLife(birth, SOPHIE_DAY1)).toBe(1)
    expect(dayOfLife(at('2026-10-29', '23:59'), SOPHIE_DAY1)).toBe(1)
    expect(logDate(birth, SOPHIE_DAY1)).toBe('2026-10-30')
    expect(logDate(DAY4_NOW, SOPHIE_DAY1)).toBe(DAY4)
  })

  it('rolls over at midnight Central', () => {
    expect(dayOfLife(at('2026-11-02', '23:59'), SOPHIE_DAY1)).toBe(4)
    expect(dayOfLife(at('2026-11-03', '00:00'), SOPHIE_DAY1)).toBe(5)
  })

  it('counts calendar days across the 25-hour day, not 24-hour blocks', () => {
    expect(dayOfLife(at('2026-10-31', '23:59'), SOPHIE_DAY1)).toBe(2)
    expect(dayOfLife(at('2026-11-01', '00:00'), SOPHIE_DAY1)).toBe(3)
    expect(dayOfLife(at('2026-11-01', '23:59'), SOPHIE_DAY1)).toBe(3)
    expect(dayOfLife(at('2026-11-02', '00:00'), SOPHIE_DAY1)).toBe(4)
  })

  it('Day 14 is Nov 12', () => {
    expect(dateForDayOfLife(14, SOPHIE_DAY1)).toBe('2026-11-12')
    expect(dateForDayOfLife(1, SOPHIE_DAY1)).toBe('2026-10-30')
  })

  it('badges only the clock-change days', () => {
    expect(dayLengthBadge('2026-11-01')).toBe('25-hr day')
    expect(dayLengthBadge('2027-03-14')).toBe('23-hr day')
    expect(dayLengthBadge('2027-11-07')).toBe('25-hr day')
    expect(dayLengthBadge(DAY4)).toBeNull()
  })
})
