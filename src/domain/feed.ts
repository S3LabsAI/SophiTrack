import type { FeedData } from './types'

/**
 * What she drank: the amount in the bottle minus what was left, never below zero.
 * A feed copied from the paper sheets with no amount adds 0 mL (it still counts as a feed).
 * Rounded to one decimal, because an early paper feed can be 1 mL or less.
 */
export function drankMl(feed: FeedData): number {
  const drank = (feed.amount_ml ?? 0) - (feed.left_ml ?? 0)
  return Math.max(0, Math.round(drank * 10) / 10)
}
