import 'server-only'

import type { HOMEPAGE_QUERY_RESULT } from '@/../sanity.types'
import { type DynamicFetchOptions, queryData } from './live'
import { HOMEPAGE_QUERY } from './queries'

export type Homepage = NonNullable<HOMEPAGE_QUERY_RESULT>

/**
 * Cached fetch of the homepage singleton. Returns `null` when the doc
 * hasn't been published yet — page renderer falls back to defaults.
 */
export async function getHomepage(options: DynamicFetchOptions): Promise<Homepage | null> {
  'use cache'
  return (await queryData(HOMEPAGE_QUERY, options)) ?? null
}
