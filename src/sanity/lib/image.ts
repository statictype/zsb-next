import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'
import { SITE_NAME } from '@/lib/constants'
import { dataset, projectId } from '@/sanity/env'
import type { ImageData, ShareImage } from '@/types/edition'

const builder = createImageUrlBuilder({ projectId, dataset })

const MAX_SOURCE_WIDTH = 2560

export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto('format').fit('max')
}

// `toImageData` returns `undefined` for a missing asset; `requireImageData` throws.
// Mappers never substitute the <Figure> placeholder, so metadata and share cards see
// the real absence.

export interface SanityImageField {
  asset?: unknown
  alt?: string | null
  lqip?: string | null
}

export function toImageData(field: SanityImageField | null | undefined): ImageData | undefined {
  if (!field?.asset) return undefined
  return {
    src: urlFor(field as SanityImageSource)
      .width(MAX_SOURCE_WIDTH)
      .url(),
    alt: field.alt ?? '',
    ...(field.lqip ? { blurDataURL: field.lqip } : {}),
  }
}

export function imageSize(
  field: SanityImageField | null | undefined,
): { width: number; height: number } | undefined {
  const ref = (field?.asset as { _ref?: string } | undefined)?._ref
  const size = ref?.match(/-(\d+)x(\d+)-\w+$/)
  return size ? { width: Number(size[1]), height: Number(size[2]) } : undefined
}

export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const

/** 1200×630 OG crop, or `undefined` when the asset is absent (the page then uses the opengraph-image card). */
export function toShareImage(field: SanityImageField | null | undefined): ShareImage | undefined {
  if (!field?.asset) return undefined
  return {
    url: urlFor(field as SanityImageSource)
      .width(OG_IMAGE_SIZE.width)
      .height(OG_IMAGE_SIZE.height)
      .fit('crop')
      .url(),
    alt: (field.alt ?? undefined) || SITE_NAME,
  }
}

export function requireImageData(
  field: SanityImageField | null | undefined,
  label: string,
): ImageData {
  const data = toImageData(field)
  if (!data) throw new Error(`Missing asset on ${label}`)
  return data
}
