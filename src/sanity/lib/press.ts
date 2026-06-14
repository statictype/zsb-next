import 'server-only'

import type {
  EDITIONS_PRESS_KIT_QUERY_RESULT,
  PRESS_APPEARANCES_QUERY_RESULT,
  PRESS_PAGE_QUERY_RESULT,
  PRESS_RELEASES_QUERY_RESULT,
} from '@/../sanity.types'
import { definedFields } from '@/lib/defined-fields'
import type { MediaKitStripItem } from '@/types/edition'
import { type DynamicFetchOptions, queryData } from './live'
import {
  EDITIONS_PRESS_KIT_QUERY,
  PRESS_APPEARANCES_QUERY,
  PRESS_PAGE_QUERY,
  PRESS_RELEASES_QUERY,
} from './queries'

type PressPageRaw = NonNullable<PRESS_PAGE_QUERY_RESULT>
/** The Press page hero as a total view-model (see `AboutView`). The appearances,
 *  releases and media kit are separate collections, fetched alongside. */
export interface PressPageView {
  hero: { title: string; titleAccent: string; lead: string }
  ogImage?: NonNullable<PressPageRaw['ogImage']>
  metaDescription?: string
}
export type PressAppearance = PRESS_APPEARANCES_QUERY_RESULT[number]
export type PressRelease = PRESS_RELEASES_QUERY_RESULT[number]
type EditionPressKit = EDITIONS_PRESS_KIT_QUERY_RESULT[number]

export async function getPressPage(options: DynamicFetchOptions): Promise<PressPageView | null> {
  'use cache'
  const raw = await queryData(PRESS_PAGE_QUERY, options)
  return raw ? normalizePressPage(raw) : null
}

/** Reshape a raw Press singleton into its total view-model. */
export function normalizePressPage(raw: PressPageRaw): PressPageView {
  return {
    hero: {
      title: raw.hero?.title ?? '',
      titleAccent: raw.hero?.titleAccent ?? '',
      lead: raw.hero?.lead ?? '',
    },
    ...definedFields({ ogImage: raw.ogImage, metaDescription: raw.metaDescription }),
  }
}

export async function getPressAppearances(
  options: DynamicFetchOptions,
): Promise<PressAppearance[]> {
  'use cache'
  return (await queryData(PRESS_APPEARANCES_QUERY, options)) ?? []
}

export async function getPressReleases(options: DynamicFetchOptions): Promise<PressRelease[]> {
  'use cache'
  return (await queryData(PRESS_RELEASES_QUERY, options)) ?? []
}

/**
 * The press page's media-kit strip: each edition's cover photo + poster
 * flattened into year-tagged strip items, reshaped here (ADR 0013) so the page
 * renders them directly. Skips editions with no year or no assets.
 */
export async function getEditionsPressKit(
  options: DynamicFetchOptions,
): Promise<MediaKitStripItem[]> {
  'use cache'
  const editions = (await queryData(EDITIONS_PRESS_KIT_QUERY, options)) ?? []
  return flattenKit(editions)
}

// Exported for the co-located unit test (an internal seam); the page goes
// through the cached fetcher above.
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
