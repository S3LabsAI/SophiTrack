import { addDays, centralDate, dayLengthHours, daysBetween } from './time'
import type { DateKey, EpochMs } from './types'

/** Sophie's Day 1. The app reads this from the baby record; tests and scripts can use the constant. */
export const SOPHIE_DAY1: DateKey = '2026-10-30'

/**
 * The Central date an entry is counted under. The same as its calendar date, except that
 * anything before Day 1 (the birth hour, 10/29 10:59 PM to midnight) counts under Day 1.
 */
export function logDate(at: EpochMs, day1: DateKey): DateKey {
  const date = centralDate(at)
  return date < day1 ? day1 : date
}

/** Day 1 is `day1`; the birth hour the evening before is also Day 1. */
export function dayOfLifeForDate(date: DateKey, day1: DateKey): number {
  return Math.max(1, daysBetween(day1, date) + 1)
}

export function dayOfLife(at: EpochMs, day1: DateKey): number {
  return dayOfLifeForDate(centralDate(at), day1)
}

/** The Central date of a given day of life: Day 14 is 2026-11-12. */
export function dateForDayOfLife(day: number, day1: DateKey): DateKey {
  return addDays(day1, day - 1)
}

/** "25-hr day" or "23-hr day" on the two clock-change days, otherwise nothing. */
export function dayLengthBadge(date: DateKey): '23-hr day' | '25-hr day' | null {
  const hours = dayLengthHours(date)
  return hours === 24 ? null : `${hours}-hr day`
}
