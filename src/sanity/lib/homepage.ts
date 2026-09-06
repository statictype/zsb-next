import 'server-only'

import type { HOMEPAGE_QUERY_RESULT } from '@/../sanity.types'
import { definedFields } from '@/lib/defined-fields'
import { toShareImage, urlFor } from '@/sanity/lib/image'
import { type DynamicFetchOptions, queryData } from '@/sanity/lib/live'
import { HOMEPAGE_QUERY, HOMEPAGE_QUERY_TAGS } from '@/sanity/lib/queries'
import type { HeroImage, PartnerLogo, ShareImage } from '@/types/edition'

type RawHomepage = NonNullable<HOMEPAGE_QUERY_RESULT>

/** The homepage as a total view-model (see `AboutView`): hero text coalesced to
 *  `''`, the slideshow always an array, only the CTA year + SEO left optional. */
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

// Drop slides with no asset, resolve the rest to `{ src, alt, position }`
// (+ LQIP blur when the projection fetched it).
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

const LOGO_SOURCE_HEIGHT = 128

function mapPartners(partners: RawHomepage['partnerStrip']): PartnerLogo[] {
  const out: PartnerLogo[] = []
  for (const partner of partners ?? []) {
    if (!partner.logo?.asset) continue
    const aspectRatio = partner.logo.aspectRatio ?? 1
    out.push({
      id: partner._id,
      name: partner.name,
      src: urlFor(partner.logo).height(LOGO_SOURCE_HEIGHT).url(),
      alt: partner.logo.alt ?? partner.name,
      width: Math.round(LOGO_SOURCE_HEIGHT * aspectRatio),
      height: LOGO_SOURCE_HEIGHT,
      ...definedFields({ url: partner.url }),
    })
  }
  return out
}

/**
 * Cached fetch of the homepage singleton, normalized to a total view-model.
 * `null` only when the doc is absent — the route turns that into `notFound()`.
 */
export async function getHomepage(options: DynamicFetchOptions): Promise<HomeView | null> {
  'use cache'
  const raw = await queryData(HOMEPAGE_QUERY, options, { tags: HOMEPAGE_QUERY_TAGS })
  return raw ? normalizeHomepage(raw) : null
}

function normalizeHomepage(raw: RawHomepage): HomeView {
  return {
    heroTitle: raw.heroTitle ?? '',
    heroLead: raw.heroLead ?? '',
    heroCtaLabel: raw.heroCtaLabel ?? '',
    editionsIntro: raw.editionsIntro ?? '',
    slideshow: mapSlideshow(raw.slideshow),
    partners: mapPartners(raw.partnerStrip),
    ...definedFields({
      heroCtaEditionYear: raw.heroCtaEditionYear,
      ogImage: toShareImage(raw.ogImage),
      metaDescription: raw.metaDescription,
    }),
  }
}
