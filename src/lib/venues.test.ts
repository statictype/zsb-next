import { describe, expect, it } from 'vitest'
import { rollUpVenue } from '@/lib/venues'

const CFP = { name: 'Combinatul Fondului Plastic' }

describe('rollUpVenue', () => {
  it('rolls a sub-venue up to its parent (name, slug)', () => {
    expect(rollUpVenue({ name: 'UNAgaleria', partOf: CFP })).toEqual({
      name: CFP.name,
      slug: 'combinatul-fondului-plastic',
    })
  })

  it('uses the venue itself when it has no parent', () => {
    expect(rollUpVenue({ name: 'Galeria Simeza' })).toEqual({
      name: 'Galeria Simeza',
      slug: 'galeria-simeza',
    })
  })
})
