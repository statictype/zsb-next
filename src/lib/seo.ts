import type { Metadata } from 'next'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/constants'
import { editionHref } from '@/lib/edition-href'
import { OG_IMAGE_SIZE } from '@/sanity/lib/image'
import { type DynamicFetchOptions, getDynamicFetchOptions } from '@/sanity/lib/live'
import type {
  CalendarEvent,
  Edition,
  EditionJsonLd,
  PressAppearance,
  ShareImage,
} from '@/types/edition'

// Undefined lets Next fall back to the root opengraph-image route.
function shareImages(image: ShareImage | undefined): NonNullable<Metadata['openGraph']>['images'] {
  if (!image) return undefined
  return [
    { url: image.url, width: OG_IMAGE_SIZE.width, height: OG_IMAGE_SIZE.height, alt: image.alt },
  ]
}

export function pageMetadata(args: {
  title?: string
  description: string
  path: string
  shareImage?: ShareImage | undefined
}): Metadata {
  const images = shareImages(args.shareImage)
  const description = args.description
  return {
    ...(args.title !== undefined && { title: args.title }),
    description,
    alternates: { canonical: args.path },
    // A page-level openGraph replaces the inherited one wholesale, so the
    // global fields have to be restated whenever the image is overridden.
    ...(images && {
      openGraph: {
        siteName: SITE_NAME,
        locale: 'en_US',
        type: 'website',
        url: args.path,
        images,
      },
    }),
  }
}

interface PageMetaFields {
  metaDescription?: string | null
  ogImage?: ShareImage | undefined
}

interface MakePageMetadataConfig {
  title: string
  path: string
  description?: string
  robots?: Metadata['robots']
}

// Caches nothing and hides no render `'use cache'` boundary — keep it that way
// (ADR 0012).
export function makePageMetadata(
  fetcher: (options: DynamicFetchOptions) => Promise<PageMetaFields | null>,
  { title, path, description = SITE_DESCRIPTION, robots }: MakePageMetadataConfig,
): () => Promise<Metadata> {
  return async () => {
    const { perspective } = await getDynamicFetchOptions()
    const page = await fetcher({ perspective })
    const meta = pageMetadata({
      title,
      description: page?.metaDescription ?? description,
      path,
      shareImage: page?.ogImage,
    })
    return robots ? { ...meta, robots } : meta
  }
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return `${text.slice(0, text.lastIndexOf(' ', max))}…`
}

export function editionMetadata(edition: Edition): Metadata {
  const theme = edition.theme
  const description = edition.metaDescription || truncate(edition.manifesto.body, 155)
  const title = `${edition.year} — ${theme}`
  const path = editionHref(edition.year)

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: path,
      // No images: editions/[year]/opengraph-image supplies them.
    },
    alternates: { canonical: path },
  }
}

// No images: the event route's opengraph-image supplies them.
export function eventMetadata(year: number, event: CalendarEvent): Metadata {
  const title = event.name
  const description = truncate(event.description, 155)
  const path = `/editions/${year}/events/${event.slug}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: path,
    },
    alternates: { canonical: path },
  }
}

export function editionEventJsonLd(edition: EditionJsonLd) {
  const theme = edition.theme
  const start = edition.dateStart
  const end = edition.dateEnd

  // ZSB is multi-site. `rollUp` is the shared venue key: the program filters
  // group by it too, so the two can't disagree.
  const eventPlaces = edition.events.map((e) => e.venue.rollUp.name)
  const venueNames = [...new Set(eventPlaces.filter(Boolean))]
  const placeNames = venueNames.length > 0 ? venueNames : [edition.venueLine || 'Bucharest']
  const places = placeNames.map((name) => ({
    '@type': 'Place',
    name,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bucharest',
      addressCountry: 'RO',
    },
  }))

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `${SITE_NAME} ${edition.year} — ${theme}`,
    description: edition.manifesto.body,
    // Effectively required for Google Event rich results.
    ...(start && { startDate: start }),
    ...(end && { endDate: end }),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    ...(edition.heroImage.src && { image: [edition.heroImage.src] }),
    url: `${SITE_URL}${editionHref(edition.year)}`,
    location: places.length === 1 ? places[0] : places,
    organizer: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    performer: edition.artists.map((artist) => ({
      '@type': 'Person',
      name: artist.name,
    })),
  }
}

export function eventJsonLd(year: number, event: CalendarEvent) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.description,
    startDate: event.startTime ? `${event.startDate}T${event.startTime}` : event.startDate,
    ...(event.endDate && { endDate: event.endDate }),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    ...(event.image && { image: [event.image.src] }),
    url: `${SITE_URL}/editions/${year}/events/${event.slug}`,
    location: {
      '@type': 'Place',
      name: event.venue.name,
      address: {
        '@type': 'PostalAddress',
        ...(event.venue.address && { streetAddress: event.venue.address }),
        addressLocality: 'Bucharest',
        addressCountry: 'RO',
      },
    },
    organizer: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    ...(event.ticketUrl && { offers: { '@type': 'Offer', url: event.ticketUrl } }),
    superEvent: {
      '@type': 'Event',
      name: `${SITE_NAME} ${year}`,
      url: `${SITE_URL}${editionHref(year)}`,
    },
  }
}

export function eventBreadcrumbJsonLd(year: number, theme: string, event: CalendarEvent) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      {
        '@type': 'ListItem',
        position: 2,
        name: `${year} — ${theme}`,
        item: `${SITE_URL}${editionHref(year)}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: event.name,
        item: `${SITE_URL}/editions/${year}/events/${event.slug}`,
      },
    ],
  }
}

export interface FaqEntry {
  question: string
  answer: string
}

// Google requires every Q&A here to be visible on the page, so callers must
// pass the same list the visible FAQ renders from — never a separate copy.
export function visitFaqJsonLd(entries: FaqEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: entry.answer,
      },
    })),
  }
}

export function organizationJsonLd(args: { sameAs?: Array<string | null | undefined> }) {
  const sameAs =
    args.sameAs?.filter((s): s is string => typeof s === 'string' && s.length > 0) ?? []
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    alternateName: ['ZSB', 'Zilele Sculpturii București'],
    url: SITE_URL,
    ...(sameAs.length > 0 && { sameAs }),
  }
}

type PressAppearanceForJsonLd = Pick<
  PressAppearance,
  'medium' | 'title' | 'year' | 'url' | 'excerpt'
>

export function pressAppearancesJsonLd(appearances: PressAppearanceForJsonLd[]) {
  const items = appearances
    .filter((a) => a.url)
    .map((a, i) => {
      const type =
        a.medium === 'video' ? 'VideoObject' : a.medium === 'audio' ? 'AudioObject' : 'Article'
      const item: Record<string, unknown> = {
        '@type': type,
        name: a.title,
        url: a.url,
        datePublished: `${a.year}`,
        about: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      }
      if (a.excerpt) item.description = a.excerpt
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
  const theme = edition.theme
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
        item: `${SITE_URL}${editionHref(edition.year)}`,
      },
    ],
  }
}
