import 'server-only'

import { definedFields } from '@/lib/defined-fields'
import type { FaqEntry } from '@/lib/seo'
import { toShareImage } from '@/sanity/lib/image'
import { type DynamicFetchOptions, queryData } from '@/sanity/lib/live'
import { ABOUT_PAGE, PARTNERS_PAGE, PRIVACY_PAGE, VISIT_PAGE } from '@/sanity/lib/queries'
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
import type { ShareImage, VisitData } from '@/types/edition'

export type { AboutView, PartnersView, PrivacyView } from '@/sanity/lib/staticPages-mappers'

export interface VisitPageData {
  metaDescription: VisitPage['metaDescription']
  ogImage?: ShareImage
  section: VisitData
  faq: FaqEntry[]
}

/** Mappers in `staticPages-mappers.ts` must not import the live data layer, so their tests need no mocks. */

export async function getAboutPage(options: DynamicFetchOptions): Promise<AboutView | null> {
  'use cache'
  const raw = await queryData(ABOUT_PAGE, options)
  return raw ? normalizeAbout(raw) : null
}

export async function getPartnersPage(options: DynamicFetchOptions): Promise<PartnersView | null> {
  'use cache'
  const raw = await queryData(PARTNERS_PAGE, options)
  return raw ? normalizePartners(raw) : null
}

export async function getVisitPage(options: DynamicFetchOptions): Promise<VisitPageData | null> {
  'use cache'
  const raw = await queryData(VISIT_PAGE, options)
  if (!raw) return null
  return {
    metaDescription: raw.metaDescription,
    section: mapVisit(raw),
    faq: buildFaq(raw),
    ...definedFields({ ogImage: toShareImage(raw.ogImage) }),
  }
}

export async function getPrivacyPage(options: DynamicFetchOptions): Promise<PrivacyView | null> {
  'use cache'
  const raw = await queryData(PRIVACY_PAGE, options)
  return raw ? normalizePrivacy(raw) : null
}
