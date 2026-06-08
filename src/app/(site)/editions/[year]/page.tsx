import { notFound } from 'next/navigation'
import { Calendar } from '@/components/Calendar/Calendar'
import { ComingSoon, type SocialLink } from '@/components/Calendar/ComingSoon'
import { Credits } from '@/components/Credits/Credits'
import { Hero } from '@/components/Hero/Hero'
import { JsonLd } from '@/components/JsonLd/JsonLd'
import { Manifesto } from '@/components/Manifesto/Manifesto'
import { ThemeArtists } from '@/components/ThemeArtists/ThemeArtists'
import { Venues } from '@/components/Venues/Venues'
import { getAllEditionYears, getEdition } from '@/data/editions'
import { editionBreadcrumbJsonLd, editionEventJsonLd, editionMetadata } from '@/lib/seo'
import { type DynamicFetchOptions, getDynamicFetchOptions } from '@/sanity/lib/live'
import { getSiteSettings } from '@/sanity/lib/settings'
import { isOnlineEdition } from '@/types/edition'
import { OnlineEditionLayout } from './online-edition-layout'
import styles from './page.module.css'

export async function generateStaticParams() {
  const years = await getAllEditionYears()
  return years.map((year) => ({ year: String(year) }))
}

export async function generateMetadata(props: PageProps<'/editions/[year]'>) {
  const [{ year }, { perspective }] = await Promise.all([props.params, getDynamicFetchOptions()])
  // Metadata never carries stega — stripping is built into the editions
  // helper via the perspective + stega args.
  const edition = await getEdition(Number(year), { perspective, stega: false })
  return edition ? editionMetadata(edition) : {}
}

// Sibling loading.tsx provides the Suspense fallback — see Next 16
// Cache Components docs ("Routes with loading.tsx" pattern).
export default async function EditionPage(props: PageProps<'/editions/[year]'>) {
  const [{ year }, options] = await Promise.all([props.params, getDynamicFetchOptions()])
  return <CachedEdition year={Number(year)} options={options} />
}

async function CachedEdition({ year, options }: { year: number; options: DynamicFetchOptions }) {
  'use cache'
  const edition = await getEdition(year, options)

  if (!edition) {
    notFound()
  }

  if (isOnlineEdition(edition)) {
    return <OnlineEditionLayout edition={edition} />
  }

  // A live edition with no events yet is — in practice — the forthcoming one,
  // its programme not announced. Stand in for the calendar with a "coming soon"
  // block (ZSB-34); only then do we need the socials for its follow CTA.
  const events = edition.events ?? []
  const hasProgram = events.length > 0
  const socials = hasProgram ? [] : await socialLinks(options)

  return (
    <main className={styles.page}>
      <JsonLd data={editionEventJsonLd(edition)} />
      <JsonLd data={editionBreadcrumbJsonLd(edition)} />

      <Hero edition={edition} />

      <Manifesto manifesto={edition.manifesto} />

      <ThemeArtists edition={edition} />

      <Venues venues={edition.venues} />

      {hasProgram ? (
        <Calendar year={edition.year} events={events} />
      ) : (
        <ComingSoon year={edition.year} socials={socials} />
      )}

      <Credits credits={edition.credits} />
    </main>
  )
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
