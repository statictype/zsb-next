import type {
  ABOUT_PAGE_QUERY_RESULT,
  PARTNERS_PAGE_QUERY_RESULT,
  PRIVACY_PAGE_QUERY_RESULT,
  VISIT_PAGE_QUERY_RESULT,
} from '@/../sanity.types'
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
 * `''`, lists to `[]`, and only the genuinely-optional members (images, SEO)
 * left absent. A missing singleton is a 404, not an empty render, so this never
 * represents "no page".
 */
export interface AboutView {
  hero: { title: string; lead: string }
  manifestoTitle: string
  manifestoBody: string
  pillars: Array<{ label: string; body: string }>
  carouselEyebrow: string
  carousel: CarouselSlide[]
  curatorHeadline: string
  curatorName: string
  curatorRole: string
  curatorLetter: string[]
  placeImage?: ImageData
  curatorPortrait?: ImageData
  ogImage?: ShareImage
  metaDescription?: string
}
type PartnersPageRaw = NonNullable<PARTNERS_PAGE_QUERY_RESULT>
/** The Partners page as a total view-model (see `AboutView`). */
export interface PartnersView {
  hero: { title: string; lead: string }
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
  hero: { title: string; lead: string }
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
      lead: raw.hero?.lead ?? '',
    },
    manifestoTitle: raw.manifestoTitle ?? '',
    manifestoBody: raw.manifestoBody ?? '',
    pillars: (raw.pillars ?? []).map((p) => ({ label: p.label, body: p.body })),
    carouselEyebrow: raw.carouselEyebrow ?? 'From the archive',
    curatorHeadline: raw.curatorHeadline ?? '',
    curatorName: raw.curatorName ?? '',
    curatorRole: raw.curatorRole ?? '',
    curatorLetter: (raw.curatorLetter ?? []).filter(Boolean),
    carousel: mapCarousel(raw.carousel),
    ...definedFields({
      placeImage: toImageData(raw.placeImage),
      curatorPortrait: toImageData(raw.curatorPortrait),
      ogImage: toShareImage(raw.ogImage),
      metaDescription: raw.metaDescription,
    }),
  }
}

export function normalizePartners(raw: PartnersPageRaw): PartnersView {
  return {
    hero: {
      title: raw.hero?.title ?? '',
      lead: raw.hero?.lead ?? '',
    },
    eventTitle: raw.eventTitle ?? '',
    eventBody: (raw.eventBody ?? []).filter(Boolean),
    whyEyebrow: raw.whyEyebrow ?? '',
    whyTitle: raw.whyTitle ?? '',
    whyPoints: (raw.whyPoints ?? []).map((p) => ({ title: p.title, text: p.text })),
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

export function normalizePrivacy(raw: PrivacyPageRaw): PrivacyView {
  return {
    hero: {
      title: raw.hero?.title ?? '',
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

const ICON_KEYS: readonly IconKey[] = ['wheelchair', 'parking', 'cafe', 'paint']

function asIconKey(value: string | null | undefined): IconKey | undefined {
  return value && (ICON_KEYS as readonly string[]).includes(value) ? (value as IconKey) : undefined
}

function mapAmenities(raw: VisitPage['amenities']): Amenity[] {
  if (!raw) return []
  const out: Amenity[] = []
  for (const item of raw) {
    const icon = asIconKey(item.icon)
    if (item.label && icon) out.push({ label: item.label, icon })
  }
  return out
}

function mapTransport(raw: VisitPage['transport']): TransportRoute[] {
  if (!raw) return []
  const out: TransportRoute[] = []
  for (const item of raw) {
    if (item.stop && item.lines && item.walk) {
      out.push({ stop: item.stop, lines: item.lines, walk: item.walk })
    }
  }
  return out
}

/** Project a VisitPage into the runtime shape VisitSection renders. */
export function mapVisit(page: VisitPage): VisitData {
  return {
    venueName: page.venueName ?? [],
    street: page.street ?? '',
    city: page.city ?? '',
    hoursLines: page.hoursLines ?? [],
    amenities: mapAmenities(page.amenities),
    transport: mapTransport(page.transport),
    ...definedFields({
      mapsUrl: page.mapsUrl,
      image: toImageData(page.image),
    }),
  }
}

export function buildFaq(page: VisitPage | null): FaqEntry[] {
  if (!page) return []
  const entries: FaqEntry[] = []

  for (const item of page.faq ?? []) {
    if (item.question && item.answer) {
      entries.push({ question: item.question, answer: item.answer })
    }
  }

  return entries
}
