import { stegaClean } from '@sanity/client/stega'
import type { Metadata } from 'next'
import { SITE_NAME, SITE_URL } from '@/lib/constants'
import { type AnyEdition, type Edition, isOnlineEdition } from '@/types/edition'

// Strings sourced from Sanity carry invisible Visual Editing characters
// (stega) so the Presentation tool can map rendered text back to fields.
// Those characters MUST be stripped before anything is written to <head>
// or to JSON-LD — search engines and social scrapers don't see invisible
// glyphs as part of the visible string, and the result looks broken or
// kills click-through rates.
function clean<T extends string | undefined>(value: T): T {
  return (typeof value === 'string' ? stegaClean(value) : value) as T
}

export function pageMetadata(args: {
  title?: string
  description: string
  path: string
}): Metadata {
  return {
    ...(args.title !== undefined && { title: clean(args.title) }),
    description: clean(args.description),
    alternates: { canonical: args.path },
  }
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return `${text.slice(0, text.lastIndexOf(' ', max))}…`
}

export function editionMetadata(edition: AnyEdition): Metadata {
  const theme = clean(edition.theme)
  const description = clean(truncate(edition.manifesto.body, 155))
  const title = `${edition.year} — ${theme}`
  const path = `/editions/${edition.year}`

  return {
    title,
    description,
    keywords: [
      `${edition.year}`,
      theme,
      'contemporary sculpture',
      'Bucharest art',
      ...edition.artists.slice(0, 5).map(clean),
    ],
    openGraph: {
      title,
      description,
      type: 'article',
      url: path,
      ...(!isOnlineEdition(edition) && {
        images: [{ url: edition.heroImage.src, alt: clean(edition.heroImage.alt) }],
      }),
    },
    alternates: { canonical: path },
  }
}

export function editionEventJsonLd(edition: Edition) {
  const theme = clean(edition.theme)
  const venue = clean(edition.venueLine)
  const start = clean(edition.dateStart)
  const end = clean(edition.dateEnd)
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `${SITE_NAME} ${edition.year} — ${theme}`,
    description: clean(edition.manifesto.body),
    // startDate is effectively required for Google Event rich results; both
    // are stored as YYYY-MM-DD, which schema.org accepts as-is.
    ...(start && { startDate: start }),
    ...(end && { endDate: end }),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    ...(edition.heroImage.src && { image: [edition.heroImage.src] }),
    url: `${SITE_URL}/editions/${edition.year}`,
    location: {
      '@type': 'Place',
      name: venue || 'Bucharest',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Bucharest',
        addressCountry: 'RO',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    performer: edition.artists.map((name) => ({
      '@type': 'Person',
      name: clean(name),
    })),
  }
}

export function organizationJsonLd(args: { sameAs?: Array<string | null | undefined> }) {
  const sameAs =
    args.sameAs
      ?.filter((s): s is string => typeof s === 'string' && s.length > 0)
      .map((s) => clean(s)) ?? []
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    alternateName: 'ZSB',
    url: SITE_URL,
    ...(sameAs.length > 0 && { sameAs }),
  }
}

interface PressAppearanceForJsonLd {
  medium: 'article' | 'video' | 'audio' | null
  title: string | null
  year: number | null
  url: string | null
  excerpt?: string | null
}

export function pressAppearancesJsonLd(appearances: PressAppearanceForJsonLd[]) {
  const items = appearances
    .filter((a) => a.url && a.title && a.medium)
    .map((a, i) => {
      const type =
        a.medium === 'video' ? 'VideoObject' : a.medium === 'audio' ? 'AudioObject' : 'Article'
      const item: Record<string, unknown> = {
        '@type': type,
        name: clean(a.title!),
        url: clean(a.url!),
        about: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      }
      if (a.excerpt) item.description = clean(a.excerpt)
      if (a.year) item.datePublished = `${a.year}`
      return { '@type': 'ListItem', position: i + 1, item }
    })
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Press appearances — ${SITE_NAME}`,
    itemListElement: items,
  }
}

export function editionBreadcrumbJsonLd(edition: Edition) {
  const theme = clean(edition.theme)
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: `${edition.year} — ${theme}`,
        item: `${SITE_URL}/editions/${edition.year}`,
      },
    ],
  }
}
