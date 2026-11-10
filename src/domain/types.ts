/** A moment in time as milliseconds since the Unix epoch (UTC). */
export type EpochMs = number

/** A Central calendar date, 'YYYY-MM-DD'. */
export type DateKey = string

export type EntryKind = 'feed' | 'diaper' | 'sleep' | 'care' | 'note' | 'measurement'

export interface FeedData {
  /** mL of formula in the bottle. Missing only on entries copied from the paper sheets. */
  amount_ml?: number
  /** mL left in the bottle. */
  left_ml?: number
}

export interface DiaperData {
  wet: boolean
  dirty: boolean
  stool_color?: string
  consistency?: string
  pee_color?: string
}

export interface MeasurementData {
  weight_g?: number
  length_cm?: number
  head_cm?: number
  place?: 'hospital' | 'pediatrician' | 'home'
}

interface EntryBase {
  id: string
  /** UTC timestamp, ISO 8601. */
  occurred_at: string
  deleted_at?: string | null
}

export type Entry =
  | (EntryBase & { kind: 'feed'; data: FeedData })
  | (EntryBase & { kind: 'diaper'; data: DiaperData })
  | (EntryBase & { kind: 'measurement'; data: MeasurementData })
  | (EntryBase & { kind: 'sleep' | 'care' | 'note'; data?: unknown })

export type FeedEntry = Extract<Entry, { kind: 'feed' }>
export type DiaperEntry = Extract<Entry, { kind: 'diaper' }>
export type MeasurementEntry = Extract<Entry, { kind: 'measurement' }>
