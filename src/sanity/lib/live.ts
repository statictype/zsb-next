import { cookies, draftMode } from 'next/headers'
import type { QueryParams } from 'next-sanity'
import { defineLive, type LivePerspective, resolvePerspectiveFromCookies } from 'next-sanity/live'
import { client } from '@/sanity/lib/client'
import { readToken } from '@/sanity/lib/token'

export type { LivePerspective }

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
}

/** The published-perspective default: build time, and every request outside
 *  draft mode. The one place this literal is declared — everything else
 *  that needs an explicit "give me the public content" fetch imports it. */
export const PUBLISHED: DynamicFetchOptions = { perspective: 'published' }

/**
 * Resolve the perspective for a request. Must be called OUTSIDE any
 * `'use cache'` boundary (it reads draftMode + cookies, which are request
 * data). The resolved options are passed into cached helpers as
 * serializable props so the cache can key on them.
 */
export async function getDynamicFetchOptions(): Promise<DynamicFetchOptions> {
  const { isEnabled: isDraftMode } = await draftMode()
  if (!isDraftMode) {
    return PUBLISHED
  }
  const jar = await cookies()
  const perspective = await resolvePerspectiveFromCookies({ cookies: jar })
  return { perspective: perspective ?? 'drafts' }
}

/**
 * Bridge from resolved {@link DynamicFetchOptions} to `sanityFetch`: the single
 * place perspective is threaded onto a query. Call from inside a fetcher's
 * `'use cache'` body — this helper is intentionally NOT cached itself, so the
 * cache boundary (and its tags) stays on the named fetcher.
 *
 * Mirrors `sanityFetch`'s `<const QueryString>` generic so the literal query
 * string keeps resolving to its generated result type instead of collapsing to
 * `unknown`. `stega` is always `false` — there is no click-to-edit visual
 * editing in this app, so stega-encoded output is never wanted; `strict: true`
 * on `defineLive()` still requires the field on the underlying `sanityFetch`
 * call, so it's hardcoded here rather than threaded through our own options.
 */
export async function queryData<const QueryString extends string>(
  query: QueryString,
  options: DynamicFetchOptions,
  params?: QueryParams,
) {
  const { data } = await sanityFetch({
    query,
    ...(params ? { params } : {}),
    perspective: options.perspective,
    stega: false,
  })
  return data
}
