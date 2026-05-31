import type { QueryParams } from 'next-sanity'
import { defineLive, type LivePerspective, resolvePerspectiveFromCookies } from 'next-sanity/live'
import { cookies, draftMode } from 'next/headers'
import { client } from './client'
import { readToken } from './token'

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: readToken,
  // Browser token is exposed to the client in draft / live-preview mode.
  // Must be read-only and scoped to viewer access.
  browserToken: readToken,
  // Forces every sanityFetch call to pass perspective + stega so we never
  // silently render drafts in production or strip stega in draft mode.
  strict: true,
})

export interface DynamicFetchOptions {
  perspective: LivePerspective
  stega: boolean
}

/**
 * Resolve the perspective + stega for a request. Must be called OUTSIDE
 * any `'use cache'` boundary (it reads draftMode + cookies, which are
 * request data). The resolved options are passed into cached helpers as
 * serializable props so the cache can key on them.
 */
export async function getDynamicFetchOptions(): Promise<DynamicFetchOptions> {
  const { isEnabled: isDraftMode } = await draftMode()
  if (!isDraftMode) {
    return { perspective: 'published', stega: false }
  }
  const jar = await cookies()
  const perspective = await resolvePerspectiveFromCookies({ cookies: jar })
  return { perspective: perspective ?? 'drafts', stega: true }
}

/**
 * For use inside generateStaticParams. Build-time only — no draft mode,
 * no stega, no cookie access.
 */
export async function sanityFetchStaticParams<const QueryString extends string>({
  query,
  params = {},
}: {
  query: QueryString
  params?: QueryParams
}) {
  'use cache'
  const { data } = await sanityFetch({ query, params, perspective: 'published', stega: false })
  return { data }
}

/**
 * For use inside generateMetadata / generateViewport / sitemap.ts /
 * opengraph-image.tsx. Resolves perspective so Presentation Tool can
 * preview metadata for drafts, but always strips stega — metadata in
 * <head> with invisible characters breaks search ranking.
 */
export async function sanityFetchMetadata<const QueryString extends string>({
  query,
  params = {},
  perspective,
}: {
  query: QueryString
  params?: QueryParams
  perspective: LivePerspective
}) {
  'use cache'
  const { data } = await sanityFetch({ query, params, perspective, stega: false })
  return { data }
}
