import { beforeEach, describe, expect, it, vi } from 'vitest'

const table = new Map<string, (params?: Record<string, unknown>) => unknown>()

vi.mock('server-only', () => ({}))
vi.mock('@/sanity/lib/live', () => ({
  PUBLISHED: { perspective: 'published' },
  queryData: async ({ query }: { query: string }, _o: unknown, params?: Record<string, unknown>) =>
    table.get(query)?.(params) ?? null,
}))

import { getHomeData } from '@/sanity/lib/homepage'
import { EDITION_BY_YEAR, EDITION_SUMMARIES, HERO_EDITION, HOMEPAGE } from '@/sanity/lib/queries'

const OPTIONS = { perspective: 'published' as const }

const summary = (fields: Record<string, unknown>) => ({
  theme: 'Theme',
  dateStart: '2026-05-10',
  dateEnd: '2026-05-20',
  venueLine: 'CFP',
  ...fields,
})

describe('getHomeData', () => {
  beforeEach(() => {
    table.clear()
    table.set(HOMEPAGE.query, () => ({ heroTitle: 'Hello' }))
    table.set(EDITION_SUMMARIES.query, () => [
      summary({ year: 2027, status: 'announced', dateStart: '2027-05-10', dateEnd: '2027-05-20' }),
      summary({ year: 2026, status: 'live' }),
    ])
    table.set(EDITION_BY_YEAR.query, () => null)
    vi.stubEnv('NEXT_PUBLIC_ZSB_TODAY', '2026-06-01')
  })

  it('is absent when the homepage singleton is', async () => {
    table.set(HOMEPAGE.query, () => null)
    expect(await getHomeData(OPTIONS)).toBeNull()
  })

  it('leads the hero with the upcoming edition only when the switch says so', async () => {
    table.set(HERO_EDITION.query, () => 'upcoming')
    const data = await getHomeData(OPTIONS)
    expect(data?.view.heroTitle).toBe('Hello')
    expect(data?.editions.map((e) => e.year)).toEqual([2027, 2026])
    expect(data?.upcoming?.dateLine).toBe('10–20 May 2027 · CFP')

    table.set(HERO_EDITION.query, () => null)
    expect((await getHomeData(OPTIONS))?.upcoming).toBeNull()
  })

  it('leads with Latest when the switch is on but no edition is ahead', async () => {
    table.set(HERO_EDITION.query, () => 'upcoming')
    vi.stubEnv('NEXT_PUBLIC_ZSB_TODAY', '2027-06-01')
    expect((await getHomeData(OPTIONS))?.upcoming).toBeNull()
  })

  it('reads the edition list once for the list, the lead and the spotlight', async () => {
    let reads = 0
    const rows = table.get(EDITION_SUMMARIES.query)
    table.set(EDITION_SUMMARIES.query, () => {
      reads += 1
      return rows?.()
    })
    await getHomeData(OPTIONS)
    expect(reads).toBe(1)
  })
})
