import type { PortableTextBlock } from '@portabletext/react'
import type {
  ARTIST_CLOUD_QUERY_RESULT,
  ARTIST_PAGE_QUERY_RESULT,
  LocaleBlock,
  LocaleString,
} from '@/../sanity.types'
import { ONLINE_EDITION_YEARS } from '@/lib/constants'
import { definedFields } from '@/lib/defined-fields'
import { toImageData } from '@/sanity/lib/image'
import type { ArtistCloud, ArtistPage, ArtistTier, Bilingual, ImageData } from '@/types/edition'

const TIERS = [1, 2, 3, 4, 5] as const satisfies readonly ArtistTier[]

export function artistTier(inPerson: number, maxObserved: number): ArtistTier {
  if (maxObserved <= 0) return TIERS[0]
  const step = Math.ceil((inPerson / maxObserved) * TIERS.length)
  return TIERS[Math.min(Math.max(step, 1), TIERS.length) - 1] ?? TIERS[0]
}

export const EDITION_YEAR_SEPARATOR = ', '

export function formatEditionYears(years: readonly number[]): string {
  return [...years].sort((a, b) => a - b).join(EDITION_YEAR_SEPARATOR)
}

export function mapArtistCloud(raw: ARTIST_CLOUD_QUERY_RESULT): ArtistCloud {
  const yearsById = new Map<string, number[]>()
  for (const edition of raw.editions) {
    for (const ref of edition.refs ?? []) {
      const seen = yearsById.get(ref)
      if (seen === undefined) yearsById.set(ref, [edition.year])
      else if (!seen.includes(edition.year)) seen.push(edition.year)
    }
  }

  const shown = raw.artists.flatMap(({ _id, name }) => {
    const years = yearsById.get(_id)
    if (years === undefined) return []
    const inPerson = years.filter((year) => !ONLINE_EDITION_YEARS.includes(year)).length
    return [{ _id, name, years: [...years].sort((a, b) => a - b), inPerson }]
  })

  const maxObserved = shown.reduce((max, entry) => Math.max(max, entry.inPerson), 0)

  return {
    cloud: shown
      .filter(({ inPerson }) => inPerson > 0)
      .map(({ _id, name, years, inPerson }) => ({
        _id,
        name,
        years,
        tier: artistTier(inPerson, maxObserved),
      })),
    onlineOnly: shown
      .filter(({ inPerson }) => inPerson === 0)
      .map(({ _id, name }) => ({ _id, name })),
  }
}

function bilingual<T>(ro: T | undefined, en: T | undefined, empty: T): Bilingual<T> {
  return {
    ro: ro !== undefined ? { lang: 'ro', value: ro } : { lang: 'en', value: en ?? empty },
    en: en !== undefined ? { lang: 'en', value: en } : { lang: 'ro', value: ro ?? empty },
  }
}

function text(value: string | undefined): string | undefined {
  return value?.trim() ? value : undefined
}

function localeString(value: LocaleString | null): Bilingual<string> | undefined {
  const ro = text(value?.ro)
  const en = text(value?.en)
  return ro === undefined && en === undefined ? undefined : bilingual(ro, en, '')
}

function blocks(value: LocaleBlock['ro']): PortableTextBlock[] | undefined {
  if (!value?.length) return undefined
  return value.map((block) => ({ ...block, children: block.children ?? [] }))
}

function localeBlock(value: LocaleBlock | null): Bilingual<PortableTextBlock[]> {
  return bilingual(blocks(value?.ro), blocks(value?.en), [])
}

export function mapArtistPage(raw: ARTIST_PAGE_QUERY_RESULT): ArtistPage | null {
  if (!raw) return null
  return definedFields({
    name: raw.name,
    slug: raw.slug,
    portrait: toImageData(raw.portrait),
    bio: localeBlock(raw.bio),
    works: raw.works.map((work) =>
      definedFields({
        key: work.key,
        title: localeString(work.title) ?? bilingual<string>(undefined, undefined, `${work.key}`),
        material: localeString(work.material),
        dimensions: text(work.dimensions ?? undefined),
        year: text(work.year ?? undefined),
        description: localeBlock(work.description),
        images: (work.images ?? []).flatMap((image): ImageData[] => {
          const data = toImageData(image)
          return data ? [data] : []
        }),
      }),
    ),
  })
}
