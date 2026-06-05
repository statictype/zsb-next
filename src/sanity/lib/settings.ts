import 'server-only'

import type { SITE_SETTINGS_QUERY_RESULT } from '@/../sanity.types'
import { type DynamicFetchOptions, queryData } from './live'
import { SITE_SETTINGS_QUERY } from './queries'

export type SiteSettings = NonNullable<SITE_SETTINGS_QUERY_RESULT>

/**
 * Cached fetch of the site-wide settings singleton. Caller supplies
 * perspective + stega (resolved via `getDynamicFetchOptions` outside
 * the cache boundary) so the Presentation tool can preview drafts.
 *
 * Returns `null` if the singleton hasn't been published yet — the
 * Footer falls back to safe defaults so the page doesn't crash on a
 * fresh dataset.
 */
export async function getSiteSettings(options: DynamicFetchOptions): Promise<SiteSettings | null> {
  'use cache'
  return (await queryData(SITE_SETTINGS_QUERY, options)) ?? null
}
