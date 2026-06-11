import 'server-only'

import type {
  ABOUT_PAGE_QUERY_RESULT,
  PARTNERS_PAGE_QUERY_RESULT,
  PRIVACY_PAGE_QUERY_RESULT,
  VISIT_PAGE_QUERY_RESULT,
} from '@/../sanity.types'
import { SITE_NAME } from '@/lib/constants'
import type { FaqEntry } from '@/lib/seo'
import type { Amenity, CarouselSlide, ImageData, TransportRoute, VisitData } from '@/types/edition'
import { mapCarousel } from './carousel'
import { toImageData } from './image'
import { type DynamicFetchOptions, queryData } from './live'
import {
  ABOUT_PAGE_QUERY,
  PARTNERS_PAGE_QUERY,
  PRIVACY_PAGE_QUERY,
  VISIT_PAGE_QUERY,
} from './queries'

type AboutPageRaw = NonNullable<ABOUT_PAGE_QUERY_RESULT>
/** The about page with its carousel and images already reshaped to the runtime
 *  shapes (ADR 0013 — raw GROQ shapes don't cross into pages). */
export type AboutPage = Omit<AboutPageRaw, 'carousel' | 'placeImage' | 'curatorPortrait'> & {
  carousel: CarouselSlide[] | undefined
  placeImage: ImageData | undefined
  curatorPortrait: ImageData | undefined
}
type PartnersPageRaw = NonNullable<PARTNERS_PAGE_QUERY_RESULT>
/** The partners page with its images reshaped to the runtime shape. */
export type PartnersPage = Omit<PartnersPageRaw, 'eventImage' | 'whyImage'> & {
  eventImage: ImageData | undefined
  whyImage: ImageData | undefined
}
export type VisitPage = NonNullable<VISIT_PAGE_QUERY_RESULT>
export type PrivacyPage = NonNullable<PRIVACY_PAGE_QUERY_RESULT>

/**
 * Each fetcher follows the standard 3-layer pattern: caller resolves
 * perspective + stega outside the cache boundary, fetcher caches the
 * mapped result. Returns null when the singleton hasn't been
 * published yet so pages can fall back to defaults.
 */

export async function getAboutPage(options: DynamicFetchOptions): Promise<AboutPage | null> {
  'use cache'
  const raw = await queryData(ABOUT_PAGE_QUERY, options)
  if (!raw) return null
  return {
    ...raw,
    carousel: mapCarousel(raw.carousel),
    placeImage: toImageData(raw.placeImage),
    curatorPortrait: toImageData(raw.curatorPortrait),
  }
}

export async function getPartnersPage(options: DynamicFetchOptions): Promise<PartnersPage | null> {
  'use cache'
  const raw = await queryData(PARTNERS_PAGE_QUERY, options)
  if (!raw) return null
  return {
    ...raw,
    eventImage: toImageData(raw.eventImage),
    whyImage: toImageData(raw.whyImage),
  }
}

export async function getVisitPage(options: DynamicFetchOptions): Promise<VisitPage | null> {
  'use cache'
  return (await queryData(VISIT_PAGE_QUERY, options)) ?? null
}

export async function getPrivacyPage(options: DynamicFetchOptions): Promise<PrivacyPage | null> {
  'use cache'
  return (await queryData(PRIVACY_PAGE_QUERY, options)) ?? null
}

// ---- Visit page projections ----
// getVisitPage returns the raw page (metadata + the FAQ below still read its
// other fields); these two derive the shapes the view renders from it.

/** Project a VisitPage into the runtime shape VisitSection renders. */
export function mapVisit(page: VisitPage | null): VisitData {
  if (!page) return {}
  const image = toImageData(page.image) ?? null
  return {
    venueName: page.venueName ?? null,
    street: page.street ?? null,
    city: page.city ?? null,
    mapsUrl: page.mapsUrl ?? null,
    image,
    hoursLines: page.hoursLines ?? null,
    amenities: (page.amenities ?? null) as Amenity[] | null,
    transport: (page.transport ?? null) as TransportRoute[] | null,
  }
}

/**
 * Merge the Visit FAQ from two sources. The opening-hours and location entries
 * are DERIVED from the structured fields (so they can't drift from what the page
 * displays) and scoped to "during the event" so the answers aren't mistaken for
 * the venue's year-round schedule. Editorial entries — tickets, accessibility,
 * the year-round venue — come from the optional `faq` array. One call feeds both
 * the visible FAQ and the JSON-LD, so the two stay in step.
 */
export function buildFaq(page: VisitPage | null): FaqEntry[] {
  if (!page) return []
  const entries: FaqEntry[] = []

  const hours = (page.hoursLines ?? []).filter(Boolean)
  if (hours.length > 0) {
    entries.push({
      question: `What are the opening hours during ${SITE_NAME}?`,
      answer: `${hours.join('. ')}. These hours apply during the event.`,
    })
  }
  if (page.street && page.city) {
    entries.push({
      question: `Where is ${SITE_NAME} held?`,
      answer: `The main venue is at ${page.street}, ${page.city}. The program also extends to partner venues and public locations across Bucharest.`,
    })
  }

  for (const item of page.faq ?? []) {
    if (item.question && item.answer) {
      entries.push({ question: item.question, answer: item.answer })
    }
  }

  return entries
}
