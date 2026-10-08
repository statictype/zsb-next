import 'server-only'

import type { SITE_SETTINGS_QUERY_RESULT } from '@/../sanity.types'
import { type DynamicFetchOptions, queryData } from '@/sanity/lib/live'
import { SITE_SETTINGS } from '@/sanity/lib/queries'

export type SiteSettings = NonNullable<SITE_SETTINGS_QUERY_RESULT>

/** Returns `null` if the singleton is unpublished; the Footer falls back to defaults. */
export async function getSiteSettings(options: DynamicFetchOptions): Promise<SiteSettings | null> {
  'use cache'
  return (await queryData(SITE_SETTINGS, options)) ?? null
}
