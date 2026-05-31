import 'server-only'

import type { HOMEPAGE_QUERY_RESULT } from '@/../sanity.types'
import { type DynamicFetchOptions, sanityFetch } from './live'
import { HOMEPAGE_QUERY } from './queries'

export type Homepage = NonNullable<HOMEPAGE_QUERY_RESULT>

/**
 * Cached fetch of the homepage singleton. Returns `null` when the doc
 * hasn't been published yet — page renderer falls back to defaults.
 */
export async function getHomepage(options: DynamicFetchOptions): Promise<Homepage | null> {
  'use cache'
  const { data } = await sanityFetch({
    query: HOMEPAGE_QUERY,
    perspective: options.perspective,
    stega: options.stega,
  })
  return data ?? null
}
