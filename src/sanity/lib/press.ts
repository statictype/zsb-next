import 'server-only'

import type { PRESS_APPEARANCES_QUERY_RESULT, PRESS_RELEASES_QUERY_RESULT } from '@/../sanity.types'
import { type DynamicFetchOptions, queryData } from '@/sanity/lib/live'
import { flattenKit, normalizePressPage, type PressPageView } from '@/sanity/lib/press-mappers'
import {
  EDITIONS_PRESS_KIT_QUERY,
  PRESS_APPEARANCES_QUERY,
  PRESS_PAGE_QUERY,
  PRESS_RELEASES_QUERY,
} from '@/sanity/lib/queries'
import type { MediaKitStripItem } from '@/types/edition'

export type { PressPageView } from '@/sanity/lib/press-mappers'
export type PressAppearance = PRESS_APPEARANCES_QUERY_RESULT[number]
export type PressRelease = PRESS_RELEASES_QUERY_RESULT[number]

export async function getPressPage(options: DynamicFetchOptions): Promise<PressPageView | null> {
  'use cache'
  const raw = await queryData(PRESS_PAGE_QUERY, options)
  return raw ? normalizePressPage(raw) : null
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
