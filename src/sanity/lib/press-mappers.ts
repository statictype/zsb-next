import type { EDITIONS_PRESS_KIT_QUERY_RESULT, PRESS_PAGE_QUERY_RESULT } from '@/../sanity.types'
import { definedFields } from '@/lib/defined-fields'
import { toShareImage } from '@/sanity/lib/image'
import type { MediaKitStripItem, ShareImage } from '@/types/edition'

type PressPageRaw = NonNullable<PRESS_PAGE_QUERY_RESULT>
/** The Press page hero as a total view-model (see `AboutView`). The appearances,
 *  releases and media kit are separate collections, fetched alongside. */
export interface PressPageView {
  hero: { title: string; titleAccent: string; lead: string }
  ogImage?: ShareImage
  metaDescription?: string
}

export type EditionPressKit = EDITIONS_PRESS_KIT_QUERY_RESULT[number]

/** Reshape a raw Press singleton into its total view-model. */
export function normalizePressPage(raw: PressPageRaw): PressPageView {
  return {
    hero: {
      title: raw.hero?.title ?? '',
      titleAccent: raw.hero?.titleAccent ?? '',
      lead: raw.hero?.lead ?? '',
    },
    ...definedFields({ ogImage: toShareImage(raw.ogImage), metaDescription: raw.metaDescription }),
  }
}

/**
 * The press page's media-kit strip: each edition's cover photo + poster
 * flattened into year-tagged strip items, reshaped here (ADR 0013) so the page
 * renders them directly. Skips editions with no year or no assets.
 */
export function flattenKit(editions: EditionPressKit[]): MediaKitStripItem[] {
  const out: MediaKitStripItem[] = []
  for (const ed of editions) {
    if (!ed.year) continue
    if (ed.coverPhoto?.asset?.url) {
      out.push({
        year: ed.year,
        label: 'Photography',
        name: 'Exhibition Cover',
        image: definedFields({
          src: ed.coverPhoto.asset.url,
          alt: ed.coverPhoto.alt ?? `ZSB ${ed.year} cover`,
          blurDataURL: ed.coverPhoto.asset.metadata?.lqip,
        }),
      })
    }
    if (ed.poster?.asset?.url) {
      out.push({
        year: ed.year,
        label: 'Key Visual',
        name: 'Official Poster',
        image: definedFields({
          src: ed.poster.asset.url,
          alt: ed.poster.alt ?? `ZSB ${ed.year} poster`,
          blurDataURL: ed.poster.asset.metadata?.lqip,
        }),
      })
    }
  }
  return out
}
