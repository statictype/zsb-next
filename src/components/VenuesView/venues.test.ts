import { describe, expect, it } from 'vitest'
import type { CalendarEvent, EventVenue } from '@/types/edition'
import { groupVenuesByType } from './venues'

const CFP = { name: 'Combinatul Fondului Plastic', type: 'Partner venue' }

function ev(
  key: string,
  venue: EventVenue,
  opts: Partial<Pick<CalendarEvent, 'name' | 'startDate' | 'startTime' | 'endDate' | 'types'>> = {},
): CalendarEvent {
  return {
    key,
    name: opts.name ?? key,
    startDate: opts.startDate ?? '2026-05-16',
    ...(opts.startTime ? { startTime: opts.startTime } : {}),
    ...(opts.endDate ? { endDate: opts.endDate } : {}),
    types: opts.types ?? [{ title: 'Exhibition', slug: 'exhibition' }],
    venue,
    description: '',
    featured: false,
  }
}

describe('groupVenuesByType', () => {
  it('returns nothing for an empty edition', () => {
    expect(groupVenuesByType([])).toEqual([])
  })

  it('rolls sub-venues up under their parent and groups top-level venues by type', () => {
    const sections = groupVenuesByType([
      ev('cfp', { name: CFP.name, type: 'Partner venue' }),
      ev('una', { name: 'UNAgaleria', type: 'Partner gallery', partOf: CFP }),
      ev('studio', { name: 'Ana Zoe Pop Studio', type: 'Artist studio', partOf: CFP }),
      ev('g76', { name: 'Gallery Studio 76', type: 'Partner gallery' }),
    ])

    // "Partner venue" leads — CFP's subtree (3 events) outweighs the lone gallery.
    expect(sections.map((s) => s.type)).toEqual(['Partner venue', 'Partner gallery'])

    const cfp = sections[0]!.venues[0]!
    expect(cfp.name).toBe(CFP.name)
    expect(cfp.totalEvents).toBe(3)
    // Children sorted by name, each keeping its own type label.
    expect(cfp.children.map((c) => [c.name, c.type])).toEqual([
      ['Ana Zoe Pop Studio', 'Artist studio'],
      ['UNAgaleria', 'Partner gallery'],
    ])

    expect(sections[1]!.venues.map((v) => v.name)).toEqual(['Gallery Studio 76'])
  })

  it('shows a parent that only hosts events through its sub-venues', () => {
    const sections = groupVenuesByType([
      ev('una', { name: 'UNAgaleria', type: 'Partner gallery', partOf: CFP }),
      ev('studio', { name: 'Studio X', type: 'Artist studio', partOf: CFP }),
    ])

    expect(sections).toHaveLength(1)
    const cfp = sections[0]!.venues[0]!
    expect([cfp.name, cfp.type]).toEqual([CFP.name, 'Partner venue'])
    expect(cfp.events).toEqual([]) // no direct events of its own
    expect(cfp.totalEvents).toBe(2)
    expect(cfp.children.map((c) => c.name)).toEqual(['Studio X', 'UNAgaleria'])
  })

  it('orders events within a venue by date, then time, then name', () => {
    const venue = { name: CFP.name, type: 'Partner venue' }
    const sections = groupVenuesByType([
      ev('late', venue, { startDate: '2026-05-18' }),
      ev('opening', venue, { startDate: '2026-05-16', startTime: '18:00' }),
      ev('allday', venue, { startDate: '2026-05-16' }),
    ])
    expect(sections[0]!.venues[0]!.events.map((e) => e.key)).toEqual(['allday', 'opening', 'late'])
  })

  it('carries a venue address and map link through', () => {
    const sections = groupVenuesByType([
      ev('g76', {
        name: 'Gallery Studio 76',
        type: 'Partner gallery',
        address: '12 Example St',
        mapUrl: 'https://maps.example/g76',
      }),
    ])
    const venue = sections[0]!.venues[0]!
    expect(venue.address).toBe('12 Example St')
    expect(venue.mapUrl).toBe('https://maps.example/g76')
  })

  it('formats a multi-day run as a range and a timed event with its time', () => {
    const venue = { name: CFP.name, type: 'Partner venue' }
    const sections = groupVenuesByType([
      ev('run', venue, { startDate: '2026-05-16', endDate: '2026-05-18' }),
      ev('talk', venue, { startDate: '2026-05-20', startTime: '18:00' }),
    ])
    const [run, talk] = sections[0]!.venues[0]!.events
    expect(run!.when).toContain('–') // an en-dash range
    expect(talk!.when).toContain('18:00')
  })
})
