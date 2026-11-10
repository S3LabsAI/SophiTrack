import { endOfDay, startOfDay } from './time'
import type { DateKey, EpochMs } from './types'

export type Status = 'on_track' | 'watch' | 'below_minimum'

export const STATUS_LABEL: Record<Status, string> = {
  on_track: 'On track',
  watch: 'Watch',
  below_minimum: 'Below minimum',
}

/**
 * Pace rule (one-behind grace).
 * During the day: Watch only when count < minimum x fraction of the Central day elapsed - 1.
 * After the day ends: On track if count >= minimum, otherwise Below minimum.
 * The fraction uses the day's real length (23, 24 or 25 hours).
 */
export function metricStatus(count: number, minimum: number, date: DateKey, now: EpochMs): Status {
  const start = startOfDay(date)
  const end = endOfDay(date)
  if (now >= end) return count >= minimum ? 'on_track' : 'below_minimum'
  if (now <= start) return 'on_track'
  // count < minimum * elapsed / length - 1, kept in whole milliseconds so it is exact.
  return (count + 1) * (end - start) < minimum * (now - start) ? 'watch' : 'on_track'
}

/**
 * How many more are needed right now to be back On track ("Watch · 1 more wet diaper").
 * Zero unless the status is Watch or Below minimum.
 */
export function moreNeeded(count: number, minimum: number, date: DateKey, now: EpochMs): number {
  const start = startOfDay(date)
  const end = endOfDay(date)
  if (now >= end) return Math.max(0, minimum - count)
  if (now <= start) return 0
  const length = end - start
  // Smallest whole count with (count + 1) * length >= minimum * elapsed.
  const target = Math.ceil((minimum * (now - start)) / length) - 1
  return Math.max(0, target - count)
}

export type Metric = 'feeds' | 'wets' | 'dirties'

/** One row of the reference_metrics table. */
export interface ReferenceMetric {
  metric: string
  day_from: number
  /** Null means "this day onward". */
  day_to: number | null
  min: number | null
}

/** The daily minimums for a day of life. A metric with no matching row is left out. */
export function minimumsForDay(
  rows: readonly ReferenceMetric[],
  day: number,
): Partial<Record<Metric, number>> {
  const out: Partial<Record<Metric, number>> = {}
  for (const metric of ['feeds', 'wets', 'dirties'] as const) {
    const match = rows
      .filter(
        (r) =>
          r.metric === metric &&
          r.min != null &&
          r.day_from <= day &&
          (r.day_to == null || day <= r.day_to),
      )
      // If ranges overlap, the one that starts latest is the most specific.
      .sort((a, b) => b.day_from - a.day_from)[0]
    if (match?.min != null) out[metric] = match.min
  }
  return out
}
