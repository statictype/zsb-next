import { describe, expect, it } from 'vitest'
import { type CalendarEvent, type Edition, findEvent } from '@/types/edition'

const event = { key: 'a', slug: 'opening' } as CalendarEvent
const edition = { events: [event] } as Edition

describe('findEvent', () => {
  it('finds an event by its stamped slug', () => {
    expect(findEvent(edition, 'opening')).toBe(event)
  })

  it('returns null for an unknown slug', () => {
    expect(findEvent(edition, 'nope')).toBeNull()
  })

  it('returns null when the edition is undefined or has no events', () => {
    expect(findEvent(undefined, 'opening')).toBeNull()
    expect(findEvent({} as Edition, 'opening')).toBeNull()
  })
})
