import { stegaClean } from '@sanity/client/stega'
import type { SanityImageSource } from '@sanity/image-url'
import type { Metadata } from 'next'
import { SITE_NAME, SITE_URL } from '@/lib/constants'
import { urlFor } from '@/sanity/lib/image'
import type { AnyEdition, Edition } from '@/types/edition'

// Strings sourced from Sanity carry invisible Visual Editing characters
// (stega) so the Presentation tool can map rendered text back to fields.
// Those characters MUST be stripped before anything is written to <head>
// or to JSON-LD — search engines and social scrapers don't see invisible
// glyphs as part of the visible string, and the result looks broken or
// kills click-through rates.
function clean<T extends string | undefined>(value: T): T {
  return (typeof value === 'string' ? stegaClean(value) : value) as T
}

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
      alt: clean(source.alt ?? undefined) || SITE_NAME,
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
  const description = clean(args.description)
  return {
    ...(args.title !== undefined && { title: clean(args.title) }),
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

function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return `${text.slice(0, text.lastIndexOf(' ', max))}…`
}

export function editionMetadata(edition: AnyEdition): Metadata {
  const theme = clean(edition.theme)
  const description = clean(edition.metaDescription) || clean(truncate(edition.manifesto.body, 155))
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

export function editionEventJsonLd(edition: Edition) {
  const theme = clean(edition.theme)
  const start = clean(edition.dateStart)
  const end = clean(edition.dateEnd)

  // ZSB is multi-site. The venues[] array nests spaces under top-level location
  // labels (`group`, e.g. "Combinatul Fondului Plastic", "Partner Venues"),
  // which is exactly what the edition page's "Locations" accordion renders as
  // headers. Emit one schema.org Place per distinct group — keeping the JSON-LD
  // in step with the visible content and reflecting the real footprint instead
  // of the single venueLine. Fall back to venueLine, then "Bucharest", when no
  // venues are authored yet (the field is optional until the list is finalized).
  const groups = [...new Set(edition.venues.map((v) => clean(v.group)).filter(Boolean))]
  const placeNames = groups.length > 0 ? groups : [clean(edition.venueLine) || 'Bucharest']
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
    description: clean(edition.manifesto.body),
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
    performer: edition.artists.map((name) => ({
      '@type': 'Person',
      name: clean(name),
    })),
  }
}

export interface FaqEntry {
  question: string
  answer: string
}

// FAQPage structured data for the Visit page. Google requires every Q&A here
// to be visibly present on the page, so this is built from the SAME merged
// list the visible FAQ renders from — never a separate copy. Strings are
// stega-stripped because this goes straight into a <script> tag.
export function visitFaqJsonLd(entries: FaqEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map((entry) => ({
      '@type': 'Question',
      name: clean(entry.question),
      acceptedAnswer: {
        '@type': 'Answer',
        text: clean(entry.answer),
      },
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
