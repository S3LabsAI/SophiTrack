const GRAMS_PER_OZ = 28.349523125

/** Pounds and ounces to whole grams: 6 lb 9 oz is 2,977 g. */
export function lbOzToGrams(lb: number, oz: number): number {
  return Math.round((lb * 16 + oz) * GRAMS_PER_OZ)
}

function toWholeOz(grams: number): number {
  return Math.round(grams / GRAMS_PER_OZ)
}

/** Grams to pounds and whole ounces: 2,977 g is 6 lb 9 oz. */
export function gramsToLbOz(grams: number): { lb: number; oz: number } {
  const total = toWholeOz(grams)
  return { lb: Math.floor(total / 16), oz: total % 16 }
}

/** "6 lb 4 oz" */
export function formatLbOz(grams: number): string {
  const { lb, oz } = gramsToLbOz(grams)
  return `${lb} lb ${oz} oz`
}

export interface WeightChange {
  /** Whole ounces from birth weight; negative is under. Matches what the screen shows. */
  diffOz: number
  /** Whole percent of birth weight, always positive. */
  pct: number
  direction: 'under' | 'at' | 'over'
}

/** 6 lb 4 oz against a birth weight of 6 lb 9 oz is 5 oz under (5%). */
export function weightChange(weightG: number, birthG: number): WeightChange {
  const diffOz = toWholeOz(weightG) - toWholeOz(birthG)
  const pct = Math.round((Math.abs(weightG - birthG) / birthG) * 100)
  return { diffOz, pct, direction: diffOz < 0 ? 'under' : diffOz > 0 ? 'over' : 'at' }
}

/** The day of life by which newborns are expected to regain birth weight. */
export const BIRTH_WEIGHT_GOAL_DAY = 14

export interface BirthWeightCheck {
  /** She weighs at least her birth weight (to the ounce). */
  back: boolean
  /** Show "Goal: back to birth weight by Day 14": not back yet and Day 14 has not passed. */
  showGoal: boolean
  /** Day 14 has passed and she is not back to birth weight: one to raise with the pediatrician. */
  pastGoal: boolean
}

export function birthWeightCheck(weightG: number, birthG: number, day: number): BirthWeightCheck {
  const back = toWholeOz(weightG) >= toWholeOz(birthG)
  return {
    back,
    showGoal: !back && day <= BIRTH_WEIGHT_GOAL_DAY,
    pastGoal: !back && day > BIRTH_WEIGHT_GOAL_DAY,
  }
}
