import 'server-only'

import type { HOMEPAGE_QUERY_RESULT } from '@/../sanity.types'
import { definedFields } from '@/lib/defined-fields'
import { urlFor } from '@/sanity/lib/image'
import { type DynamicFetchOptions, queryData } from '@/sanity/lib/live'
import { HOMEPAGE_QUERY, HOMEPAGE_QUERY_TAGS } from '@/sanity/lib/queries'
import type { HeroImage } from '@/types/edition'

type RawHomepage = NonNullable<HOMEPAGE_QUERY_RESULT>

/** The homepage as a total view-model (see `AboutView`): hero text coalesced to
 *  `''`, the slideshow always an array, only the CTA year + SEO left optional. */
export interface HomeView {
  heroTitle: string
  heroTitleAccent: string
  heroLead: string
  heroCtaLabel: string
  heroCtaEditionYear?: number
  editionsIntro: string
  slideshow: HeroImage[]
  ogImage?: NonNullable<RawHomepage['ogImage']>
  metaDescription?: string
}

// Drop slides with no asset, resolve the rest to `{ src, alt, position }`
// (+ LQIP blur when the projection fetched it).
function mapSlideshow(slides: RawHomepage['slideshow']): HeroImage[] {
  const out: HeroImage[] = []
  for (const slide of slides ?? []) {
    if (!slide.image?.asset) continue
    out.push({
      src: urlFor(slide.image).url(),
      alt: slide.image.alt ?? '',
      position: slide.position ?? 'center',
      ...(slide.image.lqip ? { blurDataURL: slide.image.lqip } : {}),
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
    heroTitleAccent: raw.heroTitleAccent ?? '',
    heroLead: raw.heroLead ?? '',
    heroCtaLabel: raw.heroCtaLabel ?? '',
    editionsIntro: raw.editionsIntro ?? '',
    slideshow: mapSlideshow(raw.slideshow),
    ...definedFields({
      heroCtaEditionYear: raw.heroCtaEditionYear,
      ogImage: raw.ogImage,
      metaDescription: raw.metaDescription,
    }),
  }
}
