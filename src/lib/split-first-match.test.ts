import { describe, expect, it } from 'vitest'
import { splitFirstMatch } from '@/lib/split-first-match'

describe('splitFirstMatch', () => {
  it('splits around only the first exact match', () => {
    expect(splitFirstMatch('light after light', 'light')).toEqual({
      before: '',
      match: 'light',
      after: ' after light',
    })
  })

  it('preserves text on both sides of the match', () => {
    expect(splitFirstMatch('the weight of light today', 'weight of light')).toEqual({
      before: 'the ',
      match: 'weight of light',
      after: ' today',
    })
  })

  it('returns null when the match is empty or absent', () => {
    expect(splitFirstMatch('sculpture', '')).toBeNull()
    expect(splitFirstMatch('sculpture', 'painting')).toBeNull()
  })
})
