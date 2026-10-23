import { describe, expect, it } from 'vitest'
import { askZsbHref } from '@/lib/ask-zsb'

describe('askZsbHref', () => {
  it('names the artist in the subject', () => {
    expect(askZsbHref('hello@sculpturedays.com', 'Călin Dan')).toBe(
      'mailto:hello@sculpturedays.com?subject=About%20C%C4%83lin%20Dan',
    )
  })

  it('names the work when one is given', () => {
    expect(askZsbHref('hello@sculpturedays.com', 'Bogdan Rața', 'Soul')).toBe(
      'mailto:hello@sculpturedays.com?subject=About%20%E2%80%9CSoul%E2%80%9D%20by%20Bogdan%20Ra%C8%9Ba',
    )
  })
})
