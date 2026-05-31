import 'server-only'

import type {
  ABOUT_PAGE_QUERY_RESULT,
  PARTNERS_PAGE_QUERY_RESULT,
  PRIVACY_PAGE_QUERY_RESULT,
  VISIT_PAGE_QUERY_RESULT,
} from '@/../sanity.types'
import { type DynamicFetchOptions, sanityFetch } from './live'
import {
  ABOUT_PAGE_QUERY,
  PARTNERS_PAGE_QUERY,
  PRIVACY_PAGE_QUERY,
  VISIT_PAGE_QUERY,
} from './queries'

export type AboutPage = NonNullable<ABOUT_PAGE_QUERY_RESULT>
export type PartnersPage = NonNullable<PARTNERS_PAGE_QUERY_RESULT>
export type VisitPage = NonNullable<VISIT_PAGE_QUERY_RESULT>
export type PrivacyPage = NonNullable<PRIVACY_PAGE_QUERY_RESULT>

/**
 * Each fetcher follows the standard 3-layer pattern: caller resolves
 * perspective + stega outside the cache boundary, fetcher caches the
 * mapped result. Returns null when the singleton hasn't been
 * published yet so pages can fall back to defaults.
 */

export async function getAboutPage(options: DynamicFetchOptions): Promise<AboutPage | null> {
  'use cache'
  const { data } = await sanityFetch({
    query: ABOUT_PAGE_QUERY,
    perspective: options.perspective,
    stega: options.stega,
  })
  return data ?? null
}

export async function getPartnersPage(
  options: DynamicFetchOptions,
): Promise<PartnersPage | null> {
  'use cache'
  const { data } = await sanityFetch({
    query: PARTNERS_PAGE_QUERY,
    perspective: options.perspective,
    stega: options.stega,
  })
  return data ?? null
}

export async function getVisitPage(options: DynamicFetchOptions): Promise<VisitPage | null> {
  'use cache'
  const { data } = await sanityFetch({
    query: VISIT_PAGE_QUERY,
    perspective: options.perspective,
    stega: options.stega,
  })
  return data ?? null
}

export async function getPrivacyPage(
  options: DynamicFetchOptions,
): Promise<PrivacyPage | null> {
  'use cache'
  const { data } = await sanityFetch({
    query: PRIVACY_PAGE_QUERY,
    perspective: options.perspective,
    stega: options.stega,
  })
  return data ?? null
}
