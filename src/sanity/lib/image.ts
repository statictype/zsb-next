import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'
import type { ImageData } from '@/types/edition'
import { dataset, projectId } from '../env'

const builder = createImageUrlBuilder({ projectId, dataset })

export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto('format').fit('max')
}

// ---- The image fallback contract (ADR 0011) ----
//
// Every authored image resolves by what a missing asset MEANS:
//
// - `requireImageData` — the schema requires the image (edition hero, carousel
//   slides). A missing asset is corrupt data: fail at fetch time, loudly.
// - `toImageData` — everything else. Absence flows to the consumer as
//   `undefined`: when it's meaningful, the consumer branches (an event without
//   a poster renders its date watermark; a missing OG image falls down the
//   share-card chain); when the layout always renders an image, the missing
//   value flows into <Figure>, which paints the neutral local placeholder.
//   Mappers never substitute the placeholder — metadata and share cards must
//   see the real absence.

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
