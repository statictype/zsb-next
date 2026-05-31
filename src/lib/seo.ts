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
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `${SITE_NAME} ${edition.year} — ${theme}`,
    description: clean(edition.manifesto.body),
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Bucharest',
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
