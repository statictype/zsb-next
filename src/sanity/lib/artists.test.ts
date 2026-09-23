import { describe, expect, it } from 'vitest'
import { artistTier, formatEditionYears, mapArtistCloud } from '@/sanity/lib/artists-mappers'

type Raw = Parameters<typeof mapArtistCloud>[0]

interface Fixture {
  artists: string[]
  editions: Record<number, string[]>
}

function raw({ artists, editions }: Fixture): Raw {
  return {
    artists: artists.map((name) => ({ _id: `id-${name}`, name })),
    editions: Object.entries(editions).map(([year, refs]) => ({
      year: Number(year),
      refs: refs.map((name) => `id-${name}`),
    })),
  }
}

describe('artistTier', () => {
  it('floors at 1 when no artist has an in-person edition', () => {
    expect(artistTier(0, 0)).toBe(1)
  })

  it('floors at 1 for an artist whose only editions were online', () => {
    expect(artistTier(0, 4)).toBe(1)
  })

  it('normalises against the highest in-person count in the roster', () => {
    expect([1, 2, 3, 4].map((count) => artistTier(count, 4))).toEqual([2, 3, 4, 5])
  })

  it('rescales when the highest count changes', () => {
    expect([1, 2].map((count) => artistTier(count, 2))).toEqual([3, 5])
  })

  it('caps at 5 above the observed maximum', () => {
    expect(artistTier(9, 4)).toBe(5)
  })
})

describe('formatEditionYears', () => {
  it('orders ascending', () => {
    expect(formatEditionYears([2023, 2021])).toBe('2021, 2023')
  })

  it('returns an empty string for no years', () => {
    expect(formatEditionYears([])).toBe('')
  })
})

describe('mapArtistCloud', () => {
  it('inverts edition refs onto each artist, years ascending', () => {
    const [ana] = mapArtistCloud(
      raw({ artists: ['Ana'], editions: { 2024: ['Ana'], 2021: ['Ana'] } }),
    ).cloud
    expect(ana).toEqual({ _id: 'id-Ana', name: 'Ana', years: [2021, 2024], tier: 5 })
  })

  it('drops artists no live edition lists', () => {
    const { cloud, onlineOnly } = mapArtistCloud(
      raw({ artists: ['Ana', 'Bogdan'], editions: { 2024: ['Ana'] } }),
    )
    expect(cloud.map((a) => a.name)).toEqual(['Ana'])
    expect(onlineOnly).toEqual([])
  })

  it('preserves the order the query returned', () => {
    const { cloud } = mapArtistCloud(
      raw({
        artists: ['Ana', 'Bogdan', 'Corina'],
        editions: { 2024: ['Corina', 'Ana', 'Bogdan'] },
      }),
    )
    expect(cloud.map((a) => a.name)).toEqual(['Ana', 'Bogdan', 'Corina'])
  })

  it('counts an artist once when one edition lists them twice', () => {
    const [ana] = mapArtistCloud(
      raw({ artists: ['Ana', 'Bogdan'], editions: { 2024: ['Ana', 'Ana'], 2025: ['Bogdan'] } }),
    ).cloud
    expect(ana?.years).toEqual([2024])
    expect(ana?.tier).toBe(5)
  })

  it('moves artists shown only online out of the cloud, in query order', () => {
    const { cloud, onlineOnly } = mapArtistCloud(
      raw({
        artists: ['Ana', 'Bogdan', 'Corina'],
        editions: { 2021: ['Corina', 'Ana', 'Bogdan'], 2024: ['Bogdan'] },
      }),
    )
    expect(cloud.map((a) => a.name)).toEqual(['Bogdan'])
    expect(onlineOnly).toEqual([
      { _id: 'id-Ana', name: 'Ana' },
      { _id: 'id-Corina', name: 'Corina' },
    ])
  })

  it('excludes online editions from the tier but keeps them in the years', () => {
    const [ana, bogdan] = mapArtistCloud(
      raw({
        artists: ['Ana', 'Bogdan'],
        editions: { 2021: ['Ana'], 2022: ['Ana'], 2024: ['Bogdan', 'Ana'] },
      }),
    ).cloud
    expect(ana).toEqual({ _id: 'id-Ana', name: 'Ana', years: [2021, 2022, 2024], tier: 5 })
    expect(bogdan?.tier).toBe(3)
  })
})
