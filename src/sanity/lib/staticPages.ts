import 'server-only'

import type { FaqEntry } from '@/lib/seo'
import { type DynamicFetchOptions, queryData } from '@/sanity/lib/live'
import {
  ABOUT_PAGE_QUERY,
  PARTNERS_PAGE_QUERY,
  PRIVACY_PAGE_QUERY,
  VISIT_PAGE_QUERY,
} from '@/sanity/lib/queries'
import {
  type AboutView,
  buildFaq,
  mapVisit,
  normalizeAbout,
  normalizePartners,
  normalizePrivacy,
  type PartnersView,
  type PrivacyView,
  type VisitPage,
} from '@/sanity/lib/staticPages-mappers'
import type { VisitData } from '@/types/edition'

export type { AboutView, PartnersView, PrivacyView } from '@/sanity/lib/staticPages-mappers'

/** The visit page reshaped to what the route renders (ADR 0013): the venue
 *  section + merged FAQ derived here, with the metadata fields kept top-level so
 *  the singleton can still back `generateMetadata` (ZSB-66). */
export interface VisitPageData {
  metaDescription: VisitPage['metaDescription']
  ogImage: VisitPage['ogImage']
  section: VisitData
  faq: FaqEntry[]
}

/**
 * Each fetcher follows the standard 3-layer pattern: caller resolves
 * perspective outside the cache boundary, fetcher caches the mapped
 * result. A fetcher returns null when its singleton is absent — the route turns
 * that into `notFound()` (a missing page singleton is a 404, not an empty
 * render). A present singleton is normalized into a *total* view-model by the
 * mappers in `staticPages-mappers.ts` (which stay dependency-free of the live
 * data layer, so their tests need no mocking) so the page is a pure renderer.
 * `getVisitPage` keeps its own venue/FAQ projection (those fields are
 * genuinely optional — the renderer branches on them — so it stays
 * null-based, not a total view-model).
 */

export async function getAboutPage(options: DynamicFetchOptions): Promise<AboutView | null> {
  'use cache'
  const raw = await queryData(ABOUT_PAGE_QUERY, options)
  return raw ? normalizeAbout(raw) : null
}

export async function getPartnersPage(options: DynamicFetchOptions): Promise<PartnersView | null> {
  'use cache'
  const raw = await queryData(PARTNERS_PAGE_QUERY, options)
  return raw ? normalizePartners(raw) : null
}

export async function getVisitPage(options: DynamicFetchOptions): Promise<VisitPageData | null> {
  'use cache'
  const raw = await queryData(VISIT_PAGE_QUERY, options)
  if (!raw) return null
  return {
    metaDescription: raw.metaDescription,
    ogImage: raw.ogImage,
    section: mapVisit(raw),
    faq: buildFaq(raw),
  }
}

export async function getPrivacyPage(options: DynamicFetchOptions): Promise<PrivacyView | null> {
  'use cache'
  const raw = await queryData(PRIVACY_PAGE_QUERY, options)
  return raw ? normalizePrivacy(raw) : null
}
