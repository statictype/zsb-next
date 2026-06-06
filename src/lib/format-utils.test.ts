import { describe, expect, it } from 'vitest'
import { bySurname, padNum, splitInHalf, surnameSortKey } from './format-utils'

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

describe('splitInHalf', () => {
  it('puts the extra item in the first half for odd lengths', () => {
    expect(splitInHalf([1, 2, 3])).toEqual([[1, 2], [3]])
  })

  it('splits even lengths evenly', () => {
    expect(splitInHalf([1, 2, 3, 4])).toEqual([
      [1, 2],
      [3, 4],
    ])
  })

  it('handles an empty array', () => {
    expect(splitInHalf([])).toEqual([[], []])
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

describe('bySurname', () => {
  it('orders names by their surname key', () => {
    const sorted = ['Mircea Roman', 'Andreea Eftene', 'Ana Rus'].sort(bySurname)
    expect(sorted).toEqual(['Andreea Eftene', 'Mircea Roman', 'Ana Rus'])
  })

  it('uses Romanian collation for diacritics', () => {
    // Romanian alphabet orders the surname keys Codre < Sava < Șuteu — 'ș' is a
    // distinct letter sorting after 's', and 'C' precedes both.
    const sorted = ['Ana Șuteu', 'Ion Sava', 'Tudor Codre'].sort(bySurname)
    expect(sorted).toEqual(['Tudor Codre', 'Ion Sava', 'Ana Șuteu'])
  })

  it('returns 0 for equal surname keys', () => {
    expect(bySurname('Ana Rus', 'Ana Rus')).toBe(0)
  })
})
