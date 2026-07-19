import { describe, expect, it } from 'vitest'
import {
  type DerivableEdition,
  type DerivedEditions,
  deriveEditions,
  resolveLeadEdition,
} from '@/lib/derive-editions'

// A few editions around a known "today" of 2026-03-01:
//   2024 / 2025 — past;  2026 — future (run-up);  2021 — online, no dateStart.
const e2021: DerivableEdition = { year: 2021 } // online-only, dateless
const e2024: DerivableEdition = { year: 2024, dateStart: '2024-09-12' }
const e2025: DerivableEdition = { year: 2025, dateStart: '2025-09-11' }
const e2026: DerivableEdition = { year: 2026, dateStart: '2026-09-10' }

describe('deriveEditions', () => {
  it('is empty for no editions', () => {
    expect(deriveEditions([], '2026-03-01')).toEqual({ latest: null, upcoming: null })
  })

  it('during the run-up, latest is the last past edition and upcoming is the next', () => {
    const { latest, upcoming } = deriveEditions([e2024, e2025, e2026, e2021], '2026-03-01')
    expect(latest).toBe(e2025)
    expect(upcoming).toBe(e2026)
  })

  it('treats an edition starting today as taking place, not upcoming', () => {
    const { latest, upcoming } = deriveEditions([e2025, e2026], '2026-09-10')
    expect(latest).toBe(e2026)
    expect(upcoming).toBeNull()
  })

  it('has no upcoming once every edition is in the past', () => {
    const { latest, upcoming } = deriveEditions([e2024, e2025, e2026], '2027-01-01')
    expect(latest).toBe(e2026)
    expect(upcoming).toBeNull()
  })

  it('picks the soonest future as upcoming when several are ahead', () => {
    const e2027: DerivableEdition = { year: 2027, dateStart: '2027-09-09' }
    const { upcoming } = deriveEditions([e2026, e2027], '2026-03-01')
    expect(upcoming).toBe(e2026)
  })

  it('falls back to the year for a date-less edition (always past)', () => {
    const { latest, upcoming } = deriveEditions([e2021], '2026-03-01')
    expect(latest).toBe(e2021)
    expect(upcoming).toBeNull()
  })

  it('on the null (pre-hydration) snapshot, latest is the newest and upcoming is null', () => {
    const { latest, upcoming } = deriveEditions([e2024, e2025, e2026], null)
    expect(latest).toBe(e2026)
    expect(upcoming).toBeNull()
  })
})

describe('resolveLeadEdition', () => {
  const both: DerivedEditions<DerivableEdition> = { latest: e2025, upcoming: e2026 }

  it('leads with latest', () => {
    expect(resolveLeadEdition('latest', both)).toBe(e2025)
  })

  it('leads with upcoming when one exists', () => {
    expect(resolveLeadEdition('upcoming', both)).toBe(e2026)
  })

  it('falls back to latest when leading with upcoming but none is ahead', () => {
    expect(resolveLeadEdition('upcoming', { latest: e2025, upcoming: null })).toBe(e2025)
  })

  it('is null when there are no editions at all', () => {
    expect(resolveLeadEdition('latest', { latest: null, upcoming: null })).toBeNull()
  })
})
