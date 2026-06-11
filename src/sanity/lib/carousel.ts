import type { CarouselImage, CarouselLayout, CarouselSlide } from '@/types/edition'
import { requireImageData, type SanityImageField } from './image'

const LAYOUT_VALUES: readonly CarouselLayout[] = [
  'full',
  'duo',
  'featured-portrait',
  'trio',
  'featured-stack',
]

function asLayout(value: string | null | undefined): CarouselLayout | undefined {
  return value && (LAYOUT_VALUES as readonly string[]).includes(value)
    ? (value as CarouselLayout)
    : undefined
}

/** A raw carousel image as projected by GROQ (`{ caption, image }`). */
interface RawCarouselImage {
  caption?: string | null
  image: SanityImageField
}

/** A raw `carouselSlide`, loosely typed so any query projecting
 *  `{ layout, images[]{ caption, image } }` can feed the mapper. */
interface RawCarouselSlide {
  layout?: string | null
  images?: RawCarouselImage[] | null
}

function mapCarouselImage(item: RawCarouselImage): CarouselImage {
  return { image: requireImageData(item.image, 'carousel image'), caption: item.caption ?? '' }
}

/**
 * Map raw `carouselSlide` documents into the runtime `CarouselSlide[]` the
 * <Carousel> renders. Drops slides whose layout is unknown or whose image
 * count doesn't match the layout (ADR 0010), and returns undefined when the
 * result is empty so callers can render conditionally. Shared by the editions
 * and the about page.
 */
export function mapCarousel(
  slides: readonly RawCarouselSlide[] | null | undefined,
): CarouselSlide[] | undefined {
  if (!slides?.length) return undefined
  const out: CarouselSlide[] = []
  for (const slide of slides) {
    const layout = asLayout(slide.layout)
    if (!layout) continue
    const images = (slide.images ?? []).map(mapCarouselImage)
    if (layout === 'full' && images.length === 1) {
      out.push({ layout, images: [images[0]!] })
    } else if ((layout === 'duo' || layout === 'featured-portrait') && images.length === 2) {
      out.push({ layout, images: [images[0]!, images[1]!] })
    } else if ((layout === 'trio' || layout === 'featured-stack') && images.length === 3) {
      out.push({ layout, images: [images[0]!, images[1]!, images[2]!] })
    }
  }
  return out.length ? out : undefined
}
