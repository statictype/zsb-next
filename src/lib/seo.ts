import type { SanityImageSource } from '@sanity/image-url'
import type { Metadata } from 'next'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/constants'
import { urlFor } from '@/sanity/lib/image'
import { type DynamicFetchOptions, getDynamicFetchOptions } from '@/sanity/lib/live'
import type { CalendarEvent, Edition } from '@/types/edition'

// An editor-set image field from Sanity (image object with optional alt).
type ShareImageSource = { asset?: unknown; alt?: string | null } | null | undefined

// Resolve a Sanity share-image override to a 1200×630 OpenGraph image entry,
// or undefined when the editor left it empty (so the page falls back to the
// default branded card via the root opengraph-image route).
function shareImages(source: ShareImageSource): NonNullable<Metadata['openGraph']>['images'] {
  if (!source?.asset) return undefined
  return [
    {
      url: urlFor(source as SanityImageSource)
        .width(1200)
        .height(630)
        .fit('crop')
        .url(),
      width: 1200,
      height: 630,
      alt: (source.alt ?? undefined) || SITE_NAME,
    },
  ]
}

export function pageMetadata(args: {
  title?: string
  /**
   * The final meta description. Page singletons resolve this from Sanity
   * (`page.metaDescription`, required) before calling; the two doc-less static
   * pages (/artists, /editions) pass their own string.
   */
  description: string
  path: string
  /** Optional editor-set custom share image (Sanity image field). */
  shareImage?: ShareImageSource
}): Metadata {
  const images = shareImages(args.shareImage)
  const description = args.description
  return {
    ...(args.title !== undefined && { title: args.title }),
    description,
    alternates: { canonical: args.path },
    // Only emit openGraph when overriding the image — re-declaring the global
    // fields here because a page-level openGraph replaces the inherited one
    // wholesale. With no override, the root opengraph-image card applies.
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

// The metadata fields every page singleton projects. A fetcher whose result
// carries at least these can back a generateMetadata.
interface PageMetaFields {
  metaDescription?: string | null
  ogImage?: ShareImageSource
}

interface MakePageMetadataConfig {
  title: string
  path: string
  /** Fallback when the document has no metaDescription. Defaults to SITE_DESCRIPTION. */
  description?: string
  /** Optional override merged onto the result — e.g. the privacy page's robots. */
  robots?: Metadata['robots']
}

/**
 * Bind a page singleton's fetcher + its fixed title/path into a
 * `generateMetadata`, collapsing the resolve-perspective → fetch → map-meta
 * orchestration that was copy-pasted across the static pages into one seam.
 *
 * Safe under ADR 0012 (docs/adr/0012-cache-components-three-layer-fetch.md):
 * this caches nothing and hides no render `'use cache'` boundary — metadata
 * fetchers are already cached behind their own directive.
 */
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
  const path = `/editions/${edition.year}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: path,
      // The share image is supplied by editions/[year]/opengraph-image (editor
      // override or branded hero overlay); setting it here would duplicate it.
    },
    alternates: { canonical: path },
  }
}

// A shared event link (ADR 0015) gets its own title + description so the
// preview reads as the event, not the edition. The share image is supplied by
// the event route's opengraph-image (override → poster → generated card,
// ZSB-41); setting it here would duplicate it.
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

export function editionEventJsonLd(edition: Edition) {
  const theme = edition.theme
  const start = edition.dateStart
  const end = edition.dateEnd

  // ZSB is multi-site. Emit one schema.org Place per distinct top-level location
  // across the edition's events — each venue's stamped rolled-up identity, the
  // same key the calendar filters and the Visit venues view group by (ZSB-65),
  // so a studio inside CFP counts as CFP. Fall back to venueLine, then
  // "Bucharest", when no events are authored yet (the forthcoming edition).
  const eventPlaces = (edition.events ?? []).map((e) => e.venue.rollUp.name)
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
    // startDate is effectively required for Google Event rich results; both
    // are stored as YYYY-MM-DD, which schema.org accepts as-is.
    ...(start && { startDate: start }),
    ...(end && { endDate: end }),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    ...(edition.heroImage.src && { image: [edition.heroImage.src] }),
    url: `${SITE_URL}/editions/${edition.year}`,
    // Single Place when there's one location, an array for the multi-site case;
    // both are valid schema.org and degrade gracefully for consumers that read
    // only the first.
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

export interface FaqEntry {
  question: string
  answer: string
}

// FAQPage structured data for the Visit page. Google requires every Q&A here
// to be visibly present on the page, so this is built from the SAME merged
// list the visible FAQ renders from — never a separate copy.
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
        name: a.title,
        url: a.url,
        about: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      }
      if (a.excerpt) item.description = a.excerpt
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
        item: `${SITE_URL}/editions/${edition.year}`,
      },
    ],
  }
}
