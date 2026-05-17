import type { Metadata } from 'next'
import { SITE_NAME, SITE_URL } from '@/lib/constants'
import { type AnyEdition, type Edition, isOnlineEdition } from '@/types/edition'

export function pageMetadata(args: {
  title?: string
  description: string
  path: string
}): Metadata {
  return {
    ...(args.title !== undefined && { title: args.title }),
    description: args.description,
    alternates: { canonical: args.path },
  }
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return `${text.slice(0, text.lastIndexOf(' ', max))}…`
}

export function editionMetadata(edition: AnyEdition): Metadata {
  const description = truncate(edition.manifesto.paragraphs[0] ?? '', 155)
  const title = `${edition.year} — ${edition.theme}`
  const path = `/editions/${edition.year}`

  return {
    title,
    description,
    keywords: [
      `${edition.year}`,
      edition.theme,
      'contemporary sculpture',
      'Bucharest art',
      ...edition.artists.slice(0, 5),
    ],
    openGraph: {
      title,
      description,
      type: 'article',
      url: path,
      ...(!isOnlineEdition(edition) && {
        images: [{ url: edition.heroImage.src, alt: edition.heroImage.alt }],
      }),
    },
    alternates: { canonical: path },
  }
}

export function editionEventJsonLd(edition: Edition) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `${SITE_NAME} ${edition.year} — ${edition.theme}`,
    description: edition.manifesto.paragraphs[0] ?? '',
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
      name,
    })),
  }
}

export function editionBreadcrumbJsonLd(edition: Edition) {
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
        name: `${edition.year} — ${edition.theme}`,
        item: `${SITE_URL}/editions/${edition.year}`,
      },
    ],
  }
}
