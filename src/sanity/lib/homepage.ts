import 'server-only'

import type { HOMEPAGE_QUERY_RESULT } from '@/../sanity.types'
import type { HeroImage } from '@/types/edition'
import { urlFor } from './image'
import { type DynamicFetchOptions, queryData } from './live'
import { HOMEPAGE_QUERY } from './queries'

type RawHomepage = NonNullable<HOMEPAGE_QUERY_RESULT>

// Homepage with its slideshow already mapped to the runtime `HeroImage[]` the
// HeroSlideshow consumes; every other field passes through from the query.
export type Homepage = Omit<RawHomepage, 'slideshow'> & { slideshow: HeroImage[] }

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
 * Cached fetch of the homepage singleton. Returns `null` when the doc
 * hasn't been published yet — page renderer falls back to defaults.
 */
export async function getHomepage(options: DynamicFetchOptions): Promise<Homepage | null> {
  'use cache'
  const raw = await queryData(HOMEPAGE_QUERY, options)
  if (!raw) return null
  return { ...raw, slideshow: mapSlideshow(raw.slideshow) }
}
