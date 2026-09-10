import { describe, expect, it } from 'vitest'
import { surnameSortKey } from '@/lib/format-utils'

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
