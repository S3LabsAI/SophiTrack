import { Temporal } from 'temporal-polyfill'
import type { DateKey, EpochMs } from './types'

/** Every day boundary, report and label uses this zone, whatever the phone is set to. */
export const ZONE = 'America/Chicago'

const MINUTE_MS = 60_000
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function toEpochMs(iso: string): EpochMs {
  return Temporal.Instant.from(iso).epochMilliseconds
}

export function toIso(at: EpochMs): string {
  return Temporal.Instant.fromEpochMilliseconds(at).toString()
}

function central(at: EpochMs): Temporal.ZonedDateTime {
  return Temporal.Instant.fromEpochMilliseconds(at).toZonedDateTimeISO(ZONE)
}

/** The Central calendar date of a moment. */
export function centralDate(at: EpochMs): DateKey {
  return central(at).toPlainDate().toString()
}

/** Minutes Central time was ahead of UTC at that moment: -300 in summer, -360 in winter. */
export function utcOffsetMin(at: EpochMs): number {
  return Math.round(central(at).offsetNanoseconds / 60e9)
}

/** 'CDT' or 'CST' at that moment. */
export function zoneAbbrev(at: EpochMs): 'CDT' | 'CST' {
  const jan = Temporal.PlainDate.from({ year: central(at).year, month: 1, day: 1 })
  const standard = jan.toZonedDateTime(ZONE).offsetNanoseconds
  return central(at).offsetNanoseconds === standard ? 'CST' : 'CDT'
}

/** First moment of a Central calendar day. Midnight happens exactly once every day. */
export function startOfDay(date: DateKey): EpochMs {
  return Temporal.PlainDate.from(date).toZonedDateTime(ZONE).epochMilliseconds
}

/** First moment of the next Central calendar day. */
export function endOfDay(date: DateKey): EpochMs {
  return startOfDay(addDays(date, 1))
}

export function addDays(date: DateKey, days: number): DateKey {
  return Temporal.PlainDate.from(date).add({ days }).toString()
}

/** Whole days from `from` to `to` (negative if `to` is earlier). */
export function daysBetween(from: DateKey, to: DateKey): number {
  return Temporal.PlainDate.from(from).until(Temporal.PlainDate.from(to), { largestUnit: 'day' })
    .days
}

/** 24, or 23 / 25 on the two clock-change days. */
export function dayLengthHours(date: DateKey): 23 | 24 | 25 {
  const hours = Math.round((endOfDay(date) - startOfDay(date)) / 3_600_000)
  if (hours !== 23 && hours !== 24 && hours !== 25) {
    throw new Error(`Unexpected day length for ${date}: ${hours} hours`)
  }
  return hours
}

export type LocalResolution =
  /** The wall time happened once. */
  | { kind: 'ok'; at: EpochMs }
  /** Fall-back night: the wall time happened twice. Ask "before or after the clocks changed?". */
  | { kind: 'ambiguous'; earlier: EpochMs; later: EpochMs }
  /** Spring-forward night: the wall time never happened. `suggestedTime` is the same minutes one hour on. */
  | { kind: 'gap'; suggestedTime: string; suggestedAt: EpochMs }

/** Turn a Central date ('YYYY-MM-DD') and wall time ('HH:MM', 24-hour) into a moment. */
export function resolveLocal(date: DateKey, time: string): LocalResolution {
  const wall = Temporal.PlainDate.from(date).toPlainDateTime(Temporal.PlainTime.from(time))
  const earlier = wall.toZonedDateTime(ZONE, { disambiguation: 'earlier' })
  const later = wall.toZonedDateTime(ZONE, { disambiguation: 'later' })
  if (earlier.epochMilliseconds === later.epochMilliseconds) {
    return { kind: 'ok', at: earlier.epochMilliseconds }
  }
  if (earlier.toPlainDateTime().equals(wall)) {
    return {
      kind: 'ambiguous',
      earlier: earlier.epochMilliseconds,
      later: later.epochMilliseconds,
    }
  }
  return {
    kind: 'gap',
    suggestedTime: later.toPlainTime().toString({ smallestUnit: 'minute' }),
    suggestedAt: later.epochMilliseconds,
  }
}

/** True for a moment whose Central wall time happened twice that night. */
export function isInRepeatedHour(at: EpochMs): boolean {
  const wall = central(at).toPlainDateTime()
  const earlier = wall.toZonedDateTime(ZONE, { disambiguation: 'earlier' })
  const later = wall.toZonedDateTime(ZONE, { disambiguation: 'later' })
  return earlier.epochMilliseconds !== later.epochMilliseconds
}

function clock(at: EpochMs): { text: string; meridiem: 'AM' | 'PM' } {
  const z = central(at)
  const hour12 = z.hour % 12 === 0 ? 12 : z.hour % 12
  return {
    text: `${hour12}:${String(z.minute).padStart(2, '0')}`,
    meridiem: z.hour < 12 ? 'AM' : 'PM',
  }
}

/** "3:45 PM". Adds CDT or CST only inside the repeated hour: "1:30 AM CDT". */
export function formatTime(at: EpochMs): string {
  const c = clock(at)
  const zone = isInRepeatedHour(at) ? ` ${zoneAbbrev(at)}` : ''
  return `${c.text} ${c.meridiem}${zone}`
}

/** "5:45 to 6:45 PM", or "11:45 AM to 12:45 PM" when the two halves differ. */
export function formatTimeRange(from: EpochMs, to: EpochMs): string {
  if (isInRepeatedHour(from) || isInRepeatedHour(to)) {
    return `${formatTime(from)} to ${formatTime(to)}`
  }
  const a = clock(from)
  const b = clock(to)
  const first = a.meridiem === b.meridiem ? a.text : `${a.text} ${a.meridiem}`
  return `${first} to ${b.text} ${b.meridiem}`
}

/** "Mon, Nov 2" */
export function formatDate(date: DateKey): string {
  const d = Temporal.PlainDate.from(date)
  return `${WEEKDAYS[d.dayOfWeek - 1]}, ${MONTHS[d.month - 1]} ${d.day}`
}

/** "Nov 2" */
export function formatShortDate(date: DateKey): string {
  const d = Temporal.PlainDate.from(date)
  return `${MONTHS[d.month - 1]} ${d.day}`
}

/** "1 hr 45 min", "45 min", "2 hr". Under a minute is "just now". Negative counts as zero. */
export function formatDuration(ms: number): string {
  const minutes = Math.floor(Math.max(0, ms) / MINUTE_MS)
  if (minutes < 1) return 'just now'
  const hr = Math.floor(minutes / 60)
  const min = minutes % 60
  if (hr === 0) return `${min} min`
  if (min === 0) return `${hr} hr`
  return `${hr} hr ${min} min`
}

/** "1 hr 45 min ago", or "just now". */
export function formatAgo(ms: number): string {
  const text = formatDuration(ms)
  return text === 'just now' ? text : `${text} ago`
}
