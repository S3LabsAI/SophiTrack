import { resolveLocal } from './time'
import type { DateKey, Entry, EpochMs } from './types'

/** A Central wall time as a moment. Throws on a repeated or missing hour, so tests must be explicit there. */
export function at(date: DateKey, time: string): EpochMs {
  const r = resolveLocal(date, time)
  if (r.kind !== 'ok') throw new Error(`${date} ${time} is ${r.kind}`)
  return r.at
}

function iso(date: DateKey, time: string): string {
  return new Date(at(date, time)).toISOString()
}

let n = 0
function id(): string {
  n += 1
  return `fixture-${n}`
}

export function feed(date: DateKey, time: string, amount_ml?: number, left_ml?: number): Entry {
  return { id: id(), kind: 'feed', occurred_at: iso(date, time), data: { amount_ml, left_ml } }
}

export function diaper(date: DateKey, time: string, wet: boolean, dirty: boolean): Entry {
  return { id: id(), kind: 'diaper', occurred_at: iso(date, time), data: { wet, dirty } }
}

/** The UI brief's sample day: Day 4, Mon 11/2/2026, "now" = 5:30 PM Central. */
export const DAY4: DateKey = '2026-11-02'
export const DAY4_NOW: EpochMs = at(DAY4, '17:30')
export const DAY4_MINIMUMS = { feeds: 8, wets: 4, dirties: 2 }

export const DAY4_ENTRIES: Entry[] = [
  feed(DAY4, '00:40', 45),
  feed(DAY4, '03:30', 60, 10),
  feed(DAY4, '06:45', 55),
  feed(DAY4, '09:50', 60),
  feed(DAY4, '12:00', 60),
  feed(DAY4, '15:45', 60),
  diaper(DAY4, '03:35', true, false),
  diaper(DAY4, '06:50', false, true),
  diaper(DAY4, '12:10', true, false),
  diaper(DAY4, '15:45', true, true),
]
