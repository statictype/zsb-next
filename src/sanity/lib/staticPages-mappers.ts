import type {
  ABOUT_PAGE_QUERY_RESULT,
  PARTNERS_PAGE_QUERY_RESULT,
  PRIVACY_PAGE_QUERY_RESULT,
  VISIT_PAGE_QUERY_RESULT,
} from '@/../sanity.types'
import { SITE_NAME } from '@/lib/constants'
import { definedFields } from '@/lib/defined-fields'
import type { FaqEntry } from '@/lib/seo'
import { mapCarousel } from '@/sanity/lib/carousel'
import { toImageData, toShareImage } from '@/sanity/lib/image'
import type {
  Amenity,
  CarouselSlide,
  IconKey,
  ImageData,
  ShareImage,
  TransportRoute,
  VisitData,
} from '@/types/edition'

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
  manifestoTitle: string
  manifestoBody: string
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
  ogImage?: ShareImage
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
  ogImage?: ShareImage
  metaDescription?: string
}
export type VisitPage = NonNullable<VISIT_PAGE_QUERY_RESULT>
type PrivacyPageRaw = NonNullable<PRIVACY_PAGE_QUERY_RESULT>
/** The Privacy page as a total view-model (see `AboutView`). `body` is Portable
 *  Text; an empty doc renders the static "change your mind" block alone. */
export interface PrivacyView {
  hero: { title: string; titleAccent: string; lead: string }
  body: NonNullable<PrivacyPageRaw['body']>
  updatedAt: string
  ogImage?: ShareImage
  metaDescription?: string
}

/** Reshape a raw About singleton into the total view-model the page renders
 *  (ADR 0013). */
export function normalizeAbout(raw: AboutPageRaw): AboutView {
  return {
    hero: {
      title: raw.hero?.title ?? '',
      titleAccent: raw.hero?.titleAccent ?? '',
      lead: raw.hero?.lead ?? '',
    },
    manifestoTitle: raw.manifestoTitle ?? '',
    // Drafts bypass required-field validation, so strings can be missing even
    // where TypeGen marks them non-null — coalesce defensively.
    manifestoBody: raw.manifestoBody ?? '',
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
      ogImage: toShareImage(raw.ogImage),
      metaDescription: raw.metaDescription,
    }),
  }
}

/** Reshape a raw Partners singleton into its total view-model (ADR 0013). */
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
      ogImage: toShareImage(raw.ogImage),
      metaDescription: raw.metaDescription,
    }),
  }
}

/** Reshape a raw Privacy singleton into its total view-model (ADR 0013). */
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
      ogImage: toShareImage(raw.ogImage),
      metaDescription: raw.metaDescription,
    }),
  }
}

// ---- Visit page projections ----

const ICON_KEYS: readonly IconKey[] = ['wheelchair', 'parking', 'cafe', 'paint', 'restroom', 'wifi']

function asIconKey(value: string | null | undefined): IconKey | undefined {
  return value && (ICON_KEYS as readonly string[]).includes(value) ? (value as IconKey) : undefined
}

/** Validate raw amenities at the typegen boundary (like `asLayout` in
 *  carousel.ts): drafts bypass schema validation and a schema edit can widen
 *  the icon union, so entries without a label or a renderer-known icon are
 *  dropped instead of cast through. */
function mapAmenities(raw: VisitPage['amenities']): Amenity[] | null {
  if (!raw) return null
  const out: Amenity[] = []
  for (const item of raw) {
    const icon = asIconKey(item.icon)
    if (item.label && icon) out.push({ label: item.label, icon })
  }
  return out
}

/** Same boundary treatment for transport rows: all three fields or the row
 *  is dropped. */
function mapTransport(raw: VisitPage['transport']): TransportRoute[] | null {
  if (!raw) return null
  const out: TransportRoute[] = []
  for (const item of raw) {
    if (item.from && item.lines && item.walk) {
      out.push({ from: item.from, lines: item.lines, walk: item.walk })
    }
  }
  return out
}

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
    amenities: mapAmenities(page.amenities),
    transport: mapTransport(page.transport),
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
