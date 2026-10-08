import 'server-only'

import type { PRESS_APPEARANCES_QUERY_RESULT, PRESS_RELEASES_QUERY_RESULT } from '@/../sanity.types'
import { type DynamicFetchOptions, queryData } from '@/sanity/lib/live'
import { flattenKit, normalizePressPage, type PressPageView } from '@/sanity/lib/press-mappers'
import {
  EDITIONS_PRESS_KIT,
  PRESS_APPEARANCES,
  PRESS_PAGE,
  PRESS_RELEASES,
} from '@/sanity/lib/queries'
import type { MediaKitStripItem, PressAppearance } from '@/types/edition'

export type { PressPageView } from '@/sanity/lib/press-mappers'
export type { PressAppearance } from '@/types/edition'
export type PressRelease = PRESS_RELEASES_QUERY_RESULT[number]

function mapPressAppearance(raw: PRESS_APPEARANCES_QUERY_RESULT[number]): PressAppearance {
  return { ...raw, excerpt: raw.excerpt ?? '' }
}

export async function getPressPage(options: DynamicFetchOptions): Promise<PressPageView | null> {
  'use cache'
  const raw = await queryData(PRESS_PAGE, options)
  return raw ? normalizePressPage(raw) : null
}

export async function getPressAppearances(
  options: DynamicFetchOptions,
): Promise<PressAppearance[]> {
  'use cache'
  const rows = await queryData(PRESS_APPEARANCES, options)
  return rows.map(mapPressAppearance)
}

export async function getPressReleases(options: DynamicFetchOptions): Promise<PressRelease[]> {
  'use cache'
  return await queryData(PRESS_RELEASES, options)
}

export async function getEditionsPressKit(
  options: DynamicFetchOptions,
): Promise<MediaKitStripItem[]> {
  'use cache'
  const editions = await queryData(EDITIONS_PRESS_KIT, options)
  return flattenKit(editions)
}
