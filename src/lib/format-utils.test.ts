import { describe, expect, it } from 'vitest'
import { padNum, surnameSortKey } from '@/lib/format-utils'

describe('padNum', () => {
  it('left-pads to the default width of 2', () => {
    expect(padNum(1)).toBe('01')
    expect(padNum(42)).toBe('42')
  })

  it('does not truncate numbers wider than the pad width', () => {
    expect(padNum(123)).toBe('123')
  })

  it('honours a custom length', () => {
    expect(padNum(7, 3)).toBe('007')
  })
})

describe('surnameSortKey', () => {
  it('moves the last token to the front', () => {
    expect(surnameSortKey('Andreea Eftene')).toBe('Eftene Andreea')
  })

  it('keeps the remaining given names in order', () => {
    expect(surnameSortKey('Reka Csapo Dup')).toBe('Dup Reka Csapo')
  })

  it('leaves single-token names (mononyms / collectives) unchanged', () => {
    expect(surnameSortKey('Madonna')).toBe('Madonna')
  })

  it('trims and collapses surrounding / inner whitespace', () => {
    expect(surnameSortKey('  Mircea   Roman  ')).toBe('Roman Mircea')
  })
})
