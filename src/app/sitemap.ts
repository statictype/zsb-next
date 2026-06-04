import type { MetadataRoute } from 'next'
import { getAllEditionYears } from '@/data/editions'
import { SITE_URL } from '@/lib/constants'
import { getSitemapMetadataFromSanity } from '@/sanity/lib/editions'

// 2021 is the static, frozen edition — it has no Sanity `_updatedAt`. This
// is the last time its source file was edited; bump it if that content ever
// changes. (`git log -1 -- src/data/editions/2021.ts`)
const STATIC_EDITION_LASTMOD = new Date('2026-05-26')

function lastMod(iso: string | null | undefined): Date | undefined {
  return iso ? new Date(iso) : undefined
}

// Newest of a set of ISO timestamps, or undefined if none are present.
function newest(isos: Array<string | null | undefined>): Date | undefined {
  const dates = isos.filter((v): v is string => Boolean(v)).map((v) => new Date(v))
  if (dates.length === 0) return undefined
  return dates.reduce((a, b) => (a > b ? a : b))
}

// Build one entry, omitting `lastModified` entirely when we don't have an
// honest date rather than faking "now".
function entry(
  path: string,
  lastModified: Date | undefined,
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'],
  priority: number,
): MetadataRoute.Sitemap[number] {
  return {
    url: path === '/' ? SITE_URL : `${SITE_URL}${path}`,
    ...(lastModified && { lastModified }),
    changeFrequency,
    priority,
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [years, meta] = await Promise.all([getAllEditionYears(), getSitemapMetadataFromSanity()])

  const editionUpdatedByYear = new Map(meta?.editions.map((e) => [e.year, e._updatedAt]) ?? [])
  const pageUpdatedById = new Map(meta?.pages.map((p) => [p._id, p._updatedAt]) ?? [])
  const updatedAt = (id: string) => lastMod(pageUpdatedById.get(id))

  const editionEntries = years.map((year) =>
    entry(
      `/editions/${year}`,
      lastMod(editionUpdatedByYear.get(year)) ?? STATIC_EDITION_LASTMOD,
      'yearly',
      0.8,
    ),
  )

  // The two index pages date themselves by their freshest member.
  const editionsListLastMod =
    newest(meta?.editions.map((e) => e._updatedAt) ?? []) ?? STATIC_EDITION_LASTMOD
  const artistsLastMod = lastMod(meta?.lastArtistUpdate)

  return [
    entry('/', updatedAt('homepage'), 'monthly', 1),
    entry('/editions', editionsListLastMod, 'yearly', 0.8),
    ...editionEntries,
    entry('/artists', artistsLastMod, 'yearly', 0.7),
    entry('/visit', updatedAt('visitPage'), 'yearly', 0.7),
    entry('/partners', updatedAt('partnersPage'), 'yearly', 0.5),
    entry('/press', updatedAt('pressPage'), 'monthly', 0.6),
    entry('/privacy', updatedAt('privacyPage'), 'yearly', 0.3),
  ]
}
