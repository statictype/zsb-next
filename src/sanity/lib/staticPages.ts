import 'server-only'

import type {
  ABOUT_PAGE_QUERY_RESULT,
  PARTNERS_PAGE_QUERY_RESULT,
  PRIVACY_PAGE_QUERY_RESULT,
  VISIT_PAGE_QUERY_RESULT,
} from '@/../sanity.types'
import { SITE_NAME } from '@/lib/constants'
import { definedFields } from '@/lib/defined-fields'
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
/**
 * The About page as the route renders it (ADR 0013): a *total* view-model. The
 * data layer normalizes here so the Shell is a pure renderer — text coalesced to
 * `''`, lists to `[]`, and only the genuinely-optional members (images, the
 * carousel section, SEO) left absent. A missing singleton is a 404, not an empty
 * render, so this never represents "no page".
 */
export interface AboutView {
  hero: { title: string; titleAccent: string; lead: string }
  notFestivalTitle: string
  notFestivalBody: string[]
  pillars: Array<{ label: string; body: string }>
  carouselEyebrow: string
  curatorEyebrow: string
  curatorHeadline: string
  curatorName: string
  curatorRole: string
  curatorLetter: string[]
  placeImage?: ImageData
  curatorPortrait?: ImageData
  carousel?: CarouselSlide[]
  ogImage?: NonNullable<AboutPageRaw['ogImage']>
  metaDescription?: string
}
type PartnersPageRaw = NonNullable<PARTNERS_PAGE_QUERY_RESULT>
/** The Partners page as a total view-model (see `AboutView`). */
export interface PartnersView {
  hero: { title: string; titleAccent: string; lead: string }
  eventTitle: string
  eventBody: string[]
  whyEyebrow: string
  whyTitle: string
  whyPoints: Array<{ title: string; text: string }>
  ctaHeading: string
  ctaHeadingAccent: string
  ctaBody: string
  ctaLabel: string
  eventImage?: ImageData
  whyImage?: ImageData
  ogImage?: NonNullable<PartnersPageRaw['ogImage']>
  metaDescription?: string
}
export type VisitPage = NonNullable<VISIT_PAGE_QUERY_RESULT>
/** The visit page reshaped to what the route renders (ADR 0013): the venue
 *  section + merged FAQ derived here, with the metadata fields kept top-level so
 *  the singleton can still back `generateMetadata` (ZSB-66). */
export interface VisitPageData {
  metaDescription: VisitPage['metaDescription']
  ogImage: VisitPage['ogImage']
  section: VisitData
  faq: FaqEntry[]
}
type PrivacyPageRaw = NonNullable<PRIVACY_PAGE_QUERY_RESULT>
/** The Privacy page as a total view-model (see `AboutView`). `body` is Portable
 *  Text; an empty doc renders the static "change your mind" block alone. */
export interface PrivacyView {
  hero: { title: string; titleAccent: string; lead: string }
  body: NonNullable<PrivacyPageRaw['body']>
  updatedAt: string
  ogImage?: NonNullable<PrivacyPageRaw['ogImage']>
  metaDescription?: string
}

/**
 * Each fetcher follows the standard 3-layer pattern: caller resolves
 * perspective + stega outside the cache boundary, fetcher caches the mapped
 * result. A fetcher returns null when its singleton is absent — the route turns
 * that into `notFound()` (a missing page singleton is a 404, not an empty
 * render). A present singleton is normalized into a *total* view-model here
 * (text → '', lists → [], only genuine optionals left absent) so the page is a
 * pure renderer; see `getAboutPage` / `normalizeAbout` (ADR 0013). Partners,
 * Privacy (here), Home and Press follow the same shape; `getVisitPage` keeps its
 * own venue/FAQ projection (those fields are genuinely optional — the renderer
 * branches on them — so it stays null-based, not a total view-model).
 */

export async function getAboutPage(options: DynamicFetchOptions): Promise<AboutView | null> {
  'use cache'
  const raw = await queryData(ABOUT_PAGE_QUERY, options)
  return raw ? normalizeAbout(raw) : null
}

/** Reshape a raw About singleton into the total view-model the page renders.
 *  Exported for the co-located unit test (an internal seam). */
export function normalizeAbout(raw: AboutPageRaw): AboutView {
  return {
    hero: {
      title: raw.hero?.title ?? '',
      titleAccent: raw.hero?.titleAccent ?? '',
      lead: raw.hero?.lead ?? '',
    },
    notFestivalTitle: raw.notFestivalTitle ?? '',
    // Drafts bypass required-field validation, so nested strings can be missing
    // even where TypeGen marks them non-null — coalesce/filter defensively.
    notFestivalBody: (raw.notFestivalBody ?? []).filter(Boolean),
    pillars: (raw.pillars ?? []).map((p) => ({ label: p.label ?? '', body: p.body ?? '' })),
    carouselEyebrow: raw.carouselEyebrow ?? 'Gallery',
    curatorEyebrow: raw.curatorEyebrow ?? '',
    curatorHeadline: raw.curatorHeadline ?? '',
    curatorName: raw.curatorName ?? '',
    curatorRole: raw.curatorRole ?? '',
    curatorLetter: (raw.curatorLetter ?? []).filter(Boolean),
    // Genuinely-optional members stay absent (definedFields drops the nullish):
    // images, the whole carousel section, and the SEO fields (which have their
    // own computed fallbacks in makePageMetadata).
    ...definedFields({
      placeImage: toImageData(raw.placeImage),
      curatorPortrait: toImageData(raw.curatorPortrait),
      carousel: mapCarousel(raw.carousel),
      ogImage: raw.ogImage,
      metaDescription: raw.metaDescription,
    }),
  }
}

export async function getPartnersPage(options: DynamicFetchOptions): Promise<PartnersView | null> {
  'use cache'
  const raw = await queryData(PARTNERS_PAGE_QUERY, options)
  return raw ? normalizePartners(raw) : null
}

/** Reshape a raw Partners singleton into its total view-model. Exported for the
 *  co-located unit test (an internal seam). */
export function normalizePartners(raw: PartnersPageRaw): PartnersView {
  return {
    hero: {
      title: raw.hero?.title ?? '',
      titleAccent: raw.hero?.titleAccent ?? '',
      lead: raw.hero?.lead ?? '',
    },
    eventTitle: raw.eventTitle ?? '',
    eventBody: (raw.eventBody ?? []).filter(Boolean),
    whyEyebrow: raw.whyEyebrow ?? '',
    whyTitle: raw.whyTitle ?? '',
    whyPoints: (raw.whyPoints ?? []).map((p) => ({ title: p.title ?? '', text: p.text ?? '' })),
    ctaHeading: raw.ctaHeading ?? '',
    ctaHeadingAccent: raw.ctaHeadingAccent ?? '',
    ctaBody: raw.ctaBody ?? '',
    ctaLabel: raw.ctaLabel ?? '',
    ...definedFields({
      eventImage: toImageData(raw.eventImage),
      whyImage: toImageData(raw.whyImage),
      ogImage: raw.ogImage,
      metaDescription: raw.metaDescription,
    }),
  }
}

export async function getVisitPage(options: DynamicFetchOptions): Promise<VisitPageData | null> {
  'use cache'
  const raw = await queryData(VISIT_PAGE_QUERY, options)
  if (!raw) return null
  return {
    metaDescription: raw.metaDescription,
    ogImage: raw.ogImage,
    section: mapVisit(raw),
    faq: buildFaq(raw),
  }
}

export async function getPrivacyPage(options: DynamicFetchOptions): Promise<PrivacyView | null> {
  'use cache'
  const raw = await queryData(PRIVACY_PAGE_QUERY, options)
  return raw ? normalizePrivacy(raw) : null
}

/** Reshape a raw Privacy singleton into its total view-model. Exported for the
 *  co-located unit test (an internal seam). */
export function normalizePrivacy(raw: PrivacyPageRaw): PrivacyView {
  return {
    hero: {
      title: raw.hero?.title ?? '',
      titleAccent: raw.hero?.titleAccent ?? '',
      lead: raw.hero?.lead ?? '',
    },
    body: raw.body ?? [],
    updatedAt: raw.updatedAt ?? '',
    ...definedFields({
      ogImage: raw.ogImage,
      metaDescription: raw.metaDescription,
    }),
  }
}

// ---- Visit page projections ----
// Exported for the co-located unit tests (an internal seam); getVisitPage above
// calls both inside its cache boundary so the page renders the result directly.

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
