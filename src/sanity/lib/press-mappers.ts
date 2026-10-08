import type { EDITIONS_PRESS_KIT_QUERY_RESULT, PRESS_PAGE_QUERY_RESULT } from '@/../sanity.types'
import { definedFields } from '@/lib/defined-fields'
import { toShareImage } from '@/sanity/lib/image'
import type { MediaKitStripItem, ShareImage } from '@/types/edition'

type PressPageRaw = NonNullable<PRESS_PAGE_QUERY_RESULT>
export interface PressPageView {
  hero: { title: string; lead: string }
  ogImage?: ShareImage
  metaDescription?: string
}

export type EditionPressKit = EDITIONS_PRESS_KIT_QUERY_RESULT[number]

export function normalizePressPage(raw: PressPageRaw): PressPageView {
  return {
    hero: {
      title: raw.hero?.title ?? '',
      lead: raw.hero?.lead ?? '',
    },
    ...definedFields({ ogImage: toShareImage(raw.ogImage), metaDescription: raw.metaDescription }),
  }
}

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
