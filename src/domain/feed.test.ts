import { describe, expect, it } from 'vitest'
import { drankMl } from './feed'

describe('what she drank', () => {
  it('is the amount minus what was left', () => {
    expect(drankMl({ amount_ml: 60, left_ml: 10 })).toBe(50)
    expect(drankMl({ amount_ml: 60 })).toBe(60)
  })

  it('is never below zero', () => {
    expect(drankMl({ amount_ml: 30, left_ml: 45 })).toBe(0)
  })

  it('is 0 mL for a paper feed with no amount', () => {
    expect(drankMl({})).toBe(0)
  })

  it('keeps one decimal for tiny early feeds', () => {
    expect(drankMl({ amount_ml: 1 })).toBe(1)
    expect(drankMl({ amount_ml: 2.5, left_ml: 0.2 })).toBe(2.3)
  })
})
