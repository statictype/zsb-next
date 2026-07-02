import { describe, expect, it } from 'vitest'
import { DEFAULT_FILTERS } from './calendar-filters'
import { parseFilters, serializeFilters } from './url'

describe('parseFilters / serializeFilters', () => {
  it('reads an absent param as all-selected (null) and a present one as a selection', () => {
    expect(parseFilters('?venue=cfp,galeria&type=talk&past=1')).toEqual({
      venues: ['cfp', 'galeria'],
      types: ['talk'],
      showPast: true,
    })
    expect(parseFilters('')).toEqual(DEFAULT_FILTERS)
  })

  it('reads an empty param as the none selection', () => {
    expect(parseFilters('?venue=')).toEqual({ venues: [], types: null, showPast: null })
  })

  it('round-trips through serialize → parse, including the none state', () => {
    const filters = { venues: ['cfp', 'galeria'], types: [], showPast: false }
    expect(parseFilters(serializeFilters(filters))).toEqual(filters)
  })

  it('emits an empty string at the default', () => {
    expect(serializeFilters(DEFAULT_FILTERS)).toBe('')
  })

  it('preserves unrelated params already on the URL', () => {
    const query = serializeFilters({ ...DEFAULT_FILTERS, venues: ['cfp'] }, 'utm=fb')
    const params = new URLSearchParams(query)
    expect(params.get('utm')).toBe('fb')
    expect(params.get('venue')).toBe('cfp')
  })
})
