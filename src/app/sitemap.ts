import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants'
import { editionHref, eventHref } from '@/lib/edition-href'
import { bellerEventHref, GALERIA_BELLER_PATH } from '@/lib/galeria-beller-href'
import { getAllEventParams, getSitemapMetadata } from '@/sanity/lib/editions'
import { getGaleriaBeller } from '@/sanity/lib/galeria-beller'
import { PUBLISHED } from '@/sanity/lib/live'

function lastMod(iso: string | null | undefined): Date | undefined {
  return iso ? new Date(iso) : undefined
}

function newest(isos: Array<string | null | undefined>): Date | undefined {
  const dates = isos.filter((v): v is string => Boolean(v)).map((v) => new Date(v))
  if (dates.length === 0) return undefined
  return dates.reduce((a, b) => (a > b ? a : b))
}

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
  const [meta, eventParams, beller] = await Promise.all([
    getSitemapMetadata(),
    getAllEventParams(),
    getGaleriaBeller(PUBLISHED),
  ])

  // SITEMAP_QUERY.editions is filtered to `== "live"`, the same gate as the edition page.
  const editions = meta.editions
  const editionUpdatedByYear = new Map(editions.map((e) => [String(e.year), e._updatedAt]))
  const pageUpdatedById = new Map(meta.pages.map((p) => [p._id, p._updatedAt]))
  const updatedAt = (id: string) => lastMod(pageUpdatedById.get(id))

  const editionEntries = editions.map((e) =>
    entry(editionHref(e.year), lastMod(e._updatedAt), 'yearly', 0.8),
  )

  // Events have no timestamp of their own; they use the parent edition's.
  const eventEntries = eventParams.map(({ year, slug }) =>
    entry(eventHref(Number(year), slug), lastMod(editionUpdatedByYear.get(year)), 'yearly', 0.5),
  )

  const editionsListLastMod = newest(editions.map((e) => e._updatedAt))

  const bellerEntries = beller
    ? [
        entry(GALERIA_BELLER_PATH, updatedAt('galeriaBeller'), 'weekly', 0.8),
        ...beller.events.map((event) =>
          entry(bellerEventHref(event.slug), updatedAt('galeriaBeller'), 'weekly', 0.5),
        ),
      ]
    : []

  return [
    entry('/', updatedAt('homepage'), 'monthly', 1),
    entry('/editions', editionsListLastMod, 'yearly', 0.8),
    ...editionEntries,
    ...eventEntries,
    entry('/visit', updatedAt('visitPage'), 'yearly', 0.7),
    entry('/partners', updatedAt('partnersPage'), 'yearly', 0.5),
    entry('/press', updatedAt('pressPage'), 'monthly', 0.6),
    entry('/privacy', updatedAt('privacyPage'), 'yearly', 0.3),
    ...bellerEntries,
  ]
}
