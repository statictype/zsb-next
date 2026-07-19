import type { MetadataRoute } from 'next'
import { getAllEventParams } from '@/data/editions'
import { SITE_URL } from '@/lib/constants'
import { getSitemapMetadataFromSanity } from '@/sanity/lib/editions'

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
  const [meta, eventParams] = await Promise.all([
    getSitemapMetadataFromSanity(),
    getAllEventParams(),
  ])

  // SITEMAP_QUERY.editions is already status-filtered (`== "live"`), the
  // same gate as the edition page — the sitemap never advertises a year that
  // would 404 while an announced edition exists between editions.
  const editions = meta?.editions ?? []
  const editionUpdatedByYear = new Map(editions.map((e) => [String(e.year), e._updatedAt]))
  const pageUpdatedById = new Map(meta?.pages.map((p) => [p._id, p._updatedAt]) ?? [])
  const updatedAt = (id: string) => lastMod(pageUpdatedById.get(id))

  const editionEntries = editions.map((e) =>
    entry(`/editions/${e.year}`, lastMod(e._updatedAt), 'yearly', 0.8),
  )

  // Event pages are canonical, prerendered URLs (ADR 0015). Events have no
  // timestamp of their own — they live inside the edition doc — so the parent
  // edition's update time is the honest `lastModified`.
  const eventEntries = eventParams.map(({ year, slug }) =>
    entry(
      `/editions/${year}/events/${slug}`,
      lastMod(editionUpdatedByYear.get(year)),
      'yearly',
      0.5,
    ),
  )

  // The two index pages date themselves by their freshest member.
  const editionsListLastMod = newest(editions.map((e) => e._updatedAt))
  const artistsLastMod = lastMod(meta?.lastArtistUpdate)

  return [
    entry('/', updatedAt('homepage'), 'monthly', 1),
    entry('/editions', editionsListLastMod, 'yearly', 0.8),
    ...editionEntries,
    ...eventEntries,
    entry('/artists', artistsLastMod, 'yearly', 0.7),
    entry('/visit', updatedAt('visitPage'), 'yearly', 0.7),
    entry('/partners', updatedAt('partnersPage'), 'yearly', 0.5),
    entry('/press', updatedAt('pressPage'), 'monthly', 0.6),
    entry('/privacy', updatedAt('privacyPage'), 'yearly', 0.3),
  ]
}
