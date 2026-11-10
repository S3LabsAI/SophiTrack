import { describe, expect, it } from 'vitest'
import { birthWeightCheck, formatLbOz, gramsToLbOz, lbOzToGrams, weightChange } from './growth'

const BIRTH_G = lbOzToGrams(6, 9)

describe('pounds and ounces', () => {
  it('6 lb 9 oz is 2,977 g, and back', () => {
    expect(BIRTH_G).toBe(2977)
    expect(gramsToLbOz(2977)).toEqual({ lb: 6, oz: 9 })
    expect(formatLbOz(2977)).toBe('6 lb 9 oz')
  })

  it('round-trips every weight a newborn form can enter', () => {
    for (let lb = 3; lb <= 15; lb++) {
      for (let oz = 0; oz < 16; oz++) {
        expect(gramsToLbOz(lbOzToGrams(lb, oz))).toEqual({ lb, oz })
      }
    }
  })
})

describe('change from birth weight', () => {
  it('6 lb 4 oz is 5 oz under birth weight (5%)', () => {
    expect(weightChange(lbOzToGrams(6, 4), BIRTH_G)).toEqual({
      diffOz: -5,
      pct: 5,
      direction: 'under',
    })
  })

  it('reports at and over birth weight', () => {
    expect(weightChange(BIRTH_G, BIRTH_G)).toEqual({ diffOz: 0, pct: 0, direction: 'at' })
    expect(weightChange(lbOzToGrams(7, 0), BIRTH_G)).toMatchObject({
      diffOz: 7,
      direction: 'over',
    })
  })
})

describe('back to birth weight by Day 14', () => {
  it('shows the goal while she is under and Day 14 has not passed', () => {
    expect(birthWeightCheck(lbOzToGrams(6, 4), BIRTH_G, 3)).toEqual({
      back: false,
      showGoal: true,
      pastGoal: false,
    })
    expect(birthWeightCheck(lbOzToGrams(6, 8), BIRTH_G, 14).showGoal).toBe(true)
  })

  it('is back once she reaches birth weight, and the goal goes away', () => {
    expect(birthWeightCheck(lbOzToGrams(6, 9), BIRTH_G, 12)).toEqual({
      back: true,
      showGoal: false,
      pastGoal: false,
    })
    expect(birthWeightCheck(lbOzToGrams(6, 10), BIRTH_G, 20).back).toBe(true)
  })

  it('flags a weight still under birth weight after Day 14', () => {
    expect(birthWeightCheck(lbOzToGrams(6, 8), BIRTH_G, 15)).toEqual({
      back: false,
      showGoal: false,
      pastGoal: true,
    })
  })
})
