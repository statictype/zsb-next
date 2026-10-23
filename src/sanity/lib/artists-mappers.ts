import type { PortableTextBlock } from '@portabletext/react'
import { artistHref } from '@/lib/artist-href'
import { ONLINE_EDITION_YEARS } from '@/lib/constants'
import { definedFields } from '@/lib/defined-fields'
import { type SanityImageField, toImageData } from '@/sanity/lib/image'
import type { ARTIST_CLOUD_QUERY_RESULT, ARTIST_PROFILE_QUERY_RESULT } from '@/sanity/types'
import type {
  ArtistCloud,
  ArtistProfile,
  ArtistTier,
  CreditedImage,
  ProfileWork,
} from '@/types/edition'

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

function text(value: string | null | undefined): string | undefined {
  return value?.trim() ? value : undefined
}

type PortableTextValue = NonNullable<ARTIST_PROFILE_QUERY_RESULT>['bio']

function blocks(value: PortableTextValue): PortableTextBlock[] {
  return (value ?? []).map((block) => ({ ...block, children: block.children ?? [] }))
}

type CreditedField = SanityImageField & {
  credit?: string | null
  hotspot?: { x?: number; y?: number } | null
}

function focus(hotspot: CreditedField['hotspot']): string | undefined {
  if (hotspot?.x === undefined || hotspot.y === undefined) return undefined
  return `${Math.round(hotspot.x * 100)}% ${Math.round(hotspot.y * 100)}%`
}

function creditedImage(field: CreditedField | null | undefined): CreditedImage | undefined {
  const data = toImageData(field)
  if (!data) return undefined
  return definedFields({ ...data, credit: text(field?.credit), focus: focus(field?.hotspot) })
}

export function mapArtistProfile(raw: ARTIST_PROFILE_QUERY_RESULT): ArtistProfile | null {
  if (!raw) return null
  const works = raw.works.flatMap((work): ProfileWork[] => {
    if (work.edition === null) return []
    return [
      definedFields({
        id: work._id,
        edition: work.edition,
        title: text(work.title) ?? 'Untitled',
        material: text(work.material),
        dimensions: text(work.dimensions),
        year: text(work.year),
        description: blocks(work.description),
        with: work.creators.flatMap((creator) =>
          creator._id !== raw._id && creator.slug
            ? [{ name: creator.name, href: artistHref(creator.slug) }]
            : [],
        ),
        images: (work.images ?? []).flatMap((image) => {
          const data = creditedImage(image)
          return data ? [data] : []
        }),
      }),
    ]
  })
  const profile = definedFields({
    name: raw.name,
    slug: raw.slug,
    discipline: text(raw.discipline),
    portrait: creditedImage(raw.portrait),
    bio: blocks(raw.bio),
    links: (raw.externalLinks ?? []).map(({ label, url }) => ({ label, url })),
    editions: raw.editions,
    works,
  })
  return hasProfileContent(profile) ? profile : null
}

export function hasProfileContent(
  profile: Pick<ArtistProfile, 'portrait' | 'bio' | 'works'>,
): boolean {
  return profile.portrait !== undefined || profile.bio.length > 0 || profile.works.length > 0
}
