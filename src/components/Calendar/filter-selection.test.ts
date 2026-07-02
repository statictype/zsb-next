import { describe, expect, it } from 'vitest'
import { isSelected, toggleSelection } from './filter-selection'

describe('filter selection helpers', () => {
  it('treats null as all-selected', () => {
    expect(isSelected(null, 'cfp')).toBe(true)
    expect(isSelected(['cfp'], 'cfp')).toBe(true)
    expect(isSelected(['cfp'], 'simeza')).toBe(false)
    expect(isSelected([], 'cfp')).toBe(false)
  })

  it('toggles off from the all-selected default by expanding then removing', () => {
    expect(toggleSelection(null, 'a', ['a', 'b', 'c'])).toEqual(['b', 'c'])
  })

  it('collapses back to null once everything is reselected', () => {
    expect(toggleSelection(['b', 'c'], 'a', ['a', 'b', 'c'])).toBeNull()
  })

  it('reaches the none state by toggling off the last selected option', () => {
    expect(toggleSelection(['a'], 'a', ['a', 'b'])).toEqual([])
  })
})
