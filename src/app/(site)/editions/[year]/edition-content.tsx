import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Calendar } from '@/components/Calendar/Calendar'
import { ComingSoon, type SocialLink } from '@/components/Calendar/ComingSoon'
import { Credits } from '@/components/Credits/Credits'
import { Hero } from '@/components/Hero/Hero'
import { JsonLd } from '@/components/JsonLd/JsonLd'
import { Manifesto } from '@/components/Manifesto/Manifesto'
import { ThemeArtists } from '@/components/ThemeArtists/ThemeArtists'
import { getEdition } from '@/data/editions'
import { editionBreadcrumbJsonLd, editionEventJsonLd } from '@/lib/seo'
import type { DynamicFetchOptions } from '@/sanity/lib/live'
import { getSiteSettings } from '@/sanity/lib/settings'
import { type AnyEdition, isOnlineEdition } from '@/types/edition'
import { OnlineEditionLayout } from './online-edition-layout'
import styles from './page.module.css'

// The edition page body, shared by the edition route (`[year]/page.tsx`) and the
// per-event route (`events/[key]/page.tsx`), which renders this plus the modal
// (ADR 0015). It's a single `'use cache'` function imported by both, so the one
// cache entry — keyed on (year, options) — is reused across the edition page and
// every prerendered event page. The directive stays lexical here and closes over
// nothing but its serializable props, so it's free of the closure-as-cache-key
// hazard ADR 0012 warns about; extracting it to this module (rather than inlining
// per page) is what lets the two routes share the entry.
export async function CachedEdition({
  year,
  options,
}: {
  year: number
  options: DynamicFetchOptions
}) {
  'use cache'
  const edition = await getEdition(year, options)

  if (!edition) {
    notFound()
  }

  if (isOnlineEdition(edition)) {
    return <OnlineEditionLayout edition={edition} />
  }

  // A live edition with no events yet is — in practice — the forthcoming one, its
  // programme not announced; it stands in with a "coming soon" block (ZSB-34).
  // Socials feed both that block's follow CTA and a finished edition's recap
  // (ZSB-45), so resolve them either way — `ended` is judged client-side.
  const events = edition.events ?? []
  const hasProgram = events.length > 0
  const socials = await socialLinks(options)

  return (
    <main className={styles.page}>
      <JsonLd data={editionEventJsonLd(edition)} />
      <JsonLd data={editionBreadcrumbJsonLd(edition)} />

      <Hero edition={edition} />

      <Manifesto manifesto={edition.manifesto} />

      <ThemeArtists edition={edition} />

      {hasProgram ? (
        // The calendar reads `useSearchParams` (filters) on the client; a
        // Suspense boundary lets the rest of the cached page prerender while
        // only this subtree client-renders, keeping the route partial-prerender
        // rather than fully dynamic (ADR 0015).
        <Suspense fallback={null}>
          <Calendar year={edition.year} events={events} theme={edition.theme} socials={socials} />
        </Suspense>
      ) : (
        <ComingSoon year={edition.year} socials={socials} />
      )}

      <Credits credits={edition.credits} />
    </main>
  )
}

/**
 * The edition data behind the per-event modal route. A separate `'use cache'`
 * leaf from {@link CachedEdition} (which caches the rendered body): this returns
 * the plain edition so the route can pick one event out of `events` by `_key`.
 * Keyed on (year, options) — not the event key — so all of a year's event pages
 * share the single entry.
 */
export async function loadEdition(
  year: number,
  options: DynamicFetchOptions,
): Promise<AnyEdition | undefined> {
  'use cache'
  return getEdition(year, options)
}

// Site-wide socials (Instagram, then Facebook — same order as the footer),
// for the "coming soon" follow CTA. Empty when the settings singleton is unset.
async function socialLinks(options: DynamicFetchOptions): Promise<SocialLink[]> {
  const settings = await getSiteSettings(options)
  const links: SocialLink[] = []
  if (settings?.instagramUrl) links.push({ label: 'Instagram', href: settings.instagramUrl })
  if (settings?.facebookUrl) links.push({ label: 'Facebook', href: settings.facebookUrl })
  return links
}
