import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'
import { PLACEHOLDER_IMAGE } from '@/lib/placeholder'
import type { ImageData } from '@/types/edition'
import { dataset, projectId } from '../env'

const builder = createImageUrlBuilder({ projectId, dataset })

export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto('format').fit('max')
}

/**
 * A raw Sanity image field as it lands in a GROQ result. `lqip` is present
 * only on projections that fetch it (hero, edition cards, carousel); the raw
 * asset ref is left untouched so `urlFor()` is unaffected.
 */
export interface SanityImageField {
  asset?: unknown
  alt?: string | null
  lqip?: string | null
}

/**
 * Convert a raw Sanity image field to the runtime `{ src, alt }` shape,
 * carrying the LQIP blur through when the projection fetched it. Returns
 * `undefined` when the field has no asset — callers decide the fallback.
 */
export function toImageData(field: SanityImageField | null | undefined): ImageData | undefined {
  if (!field?.asset) return undefined
  return {
    src: urlFor(field as SanityImageSource).url(),
    alt: field.alt ?? '',
    ...(field.lqip ? { blurDataURL: field.lqip } : {}),
  }
}

/** Like {@link toImageData} but throws when the asset is missing. */
export function requireImageData(
  field: SanityImageField | null | undefined,
  label: string,
): ImageData {
  const data = toImageData(field)
  if (!data) throw new Error(`Missing asset on ${label}`)
  return data
}

/** Like {@link toImageData} but falls back to the neutral local placeholder. */
export function imageDataOrPlaceholder(field: SanityImageField | null | undefined): ImageData {
  return toImageData(field) ?? PLACEHOLDER_IMAGE
}
