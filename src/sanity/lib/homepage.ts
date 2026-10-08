import 'server-only'

import type { HOMEPAGE_QUERY_RESULT } from '@/../sanity.types'
import { definedFields } from '@/lib/defined-fields'
import { deriveEditions } from '@/lib/derive-editions'
import { todayInBucharest } from '@/lib/today'
import { getArtistIndex } from '@/sanity/lib/artists'
import {
  type FeaturedEvents,
  getEditionSummaries,
  getFeaturedEvents,
  getHeroEditionLead,
} from '@/sanity/lib/editions'
import { toShareImage, urlFor } from '@/sanity/lib/image'
import { type DynamicFetchOptions, queryData } from '@/sanity/lib/live'
import { mapPartnerLogos } from '@/sanity/lib/partner-logos'
import { HOMEPAGE } from '@/sanity/lib/queries'
import type { EditionSummary, HeroImage, PartnerLogo, ShareImage } from '@/types/edition'

type RawHomepage = NonNullable<HOMEPAGE_QUERY_RESULT>

export interface HomeView {
  heroTitle: string
  heroLead: string
  heroCtaLabel: string
  heroCtaEditionYear?: number
  editionsIntro: string
  slideshow: HeroImage[]
  partners: PartnerLogo[]
  ogImage?: ShareImage
  metaDescription?: string
}

function mapSlideshow(slides: RawHomepage['slideshow']): HeroImage[] {
  const out: HeroImage[] = []
  for (const slide of slides ?? []) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- a draft slide can omit its image; TypeGen types the field non-null
    if (!slide.image?.asset) continue
    out.push({
      src: urlFor(slide.image).url(),
      alt: slide.image.alt ?? '',
      position: slide.position,
      ...(slide.image.lqip ? { blurDataURL: slide.image.lqip } : {}),
    })
  }
  return out
}

/** `null` only when the document is absent. */
export async function getHomepage(options: DynamicFetchOptions): Promise<HomeView | null> {
  'use cache'
  const raw = await queryData(HOMEPAGE, options)
  return raw ? normalizeHomepage(raw) : null
}

export interface HomeData {
  view: HomeView
  editions: EditionSummary[]
  upcoming: EditionSummary | null
  featured: FeaturedEvents | undefined
  artistCount: number
}

export async function getHomeData(options: DynamicFetchOptions): Promise<HomeData | null> {
  const [view, editions, lead, artists] = await Promise.all([
    getHomepage(options),
    getEditionSummaries(options),
    getHeroEditionLead(options),
    getArtistIndex(),
  ])
  if (!view) return null
  const { upcoming } = deriveEditions(editions, todayInBucharest())
  return {
    view,
    editions,
    upcoming: lead === 'upcoming' ? upcoming : null,
    featured: await getFeaturedEvents(editions, options),
    artistCount: artists.length,
  }
}

function normalizeHomepage(raw: RawHomepage): HomeView {
  return {
    heroTitle: raw.heroTitle ?? '',
    heroLead: raw.heroLead ?? '',
    heroCtaLabel: raw.heroCtaLabel ?? '',
    editionsIntro: raw.editionsIntro ?? '',
    slideshow: mapSlideshow(raw.slideshow),
    partners: mapPartnerLogos(raw.partnerStrip),
    ...definedFields({
      heroCtaEditionYear: raw.heroCtaEditionYear,
      ogImage: toShareImage(raw.ogImage),
      metaDescription: raw.metaDescription,
    }),
  }
}
