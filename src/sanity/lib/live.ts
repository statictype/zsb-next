import { cookies, draftMode } from 'next/headers'
import type { QueryParams } from 'next-sanity'
import { defineLive, type LivePerspective, resolvePerspectiveFromCookies } from 'next-sanity/live'
import { client } from '@/sanity/lib/client'
import { readToken } from '@/sanity/lib/token'

export type { LivePerspective }

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: readToken,
  // Exposed to the client in draft mode; must be a read-only viewer token.
  browserToken: readToken,
  strict: true,
})

export interface DynamicFetchOptions {
  perspective: LivePerspective
}

export const PUBLISHED: DynamicFetchOptions = { perspective: 'published' }

/** Call outside any `'use cache'` boundary: it reads draftMode and cookies. */
export async function getDynamicFetchOptions(): Promise<DynamicFetchOptions> {
  const { isEnabled: isDraftMode } = await draftMode()
  if (!isDraftMode) {
    return PUBLISHED
  }
  const jar = await cookies()
  const perspective = await resolvePerspectiveFromCookies({ cookies: jar })
  return { perspective }
}

/**
 * Call inside a fetcher's `'use cache'` body; this helper is not cached itself.
 * `stega` is false because the app has no visual editing.
 * `tags` are appended to `cacheTag()`; without them the revalidation webhook's
 * type-level tags never match the cache entry.
 */
export interface TaggedQuery<QueryString extends string> {
  query: QueryString
  tags: string[]
}

export async function queryData<const QueryString extends string>(
  { query, tags }: TaggedQuery<QueryString>,
  options: DynamicFetchOptions,
  params?: QueryParams,
) {
  const { data } = await sanityFetch({
    query,
    ...(params ? { params } : {}),
    tags,
    perspective: options.perspective,
    stega: false,
  })
  return data
}
