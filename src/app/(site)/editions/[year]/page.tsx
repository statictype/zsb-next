import { notFound } from 'next/navigation'
import { Credits } from '@/components/Credits/Credits'
import { Hero } from '@/components/Hero/Hero'
import { JsonLd } from '@/components/JsonLd/JsonLd'
import { Manifesto } from '@/components/Manifesto/Manifesto'
import { Program } from '@/components/Program/Program'
import { ThemeArtists } from '@/components/ThemeArtists/ThemeArtists'
import { Venues } from '@/components/Venues/Venues'
import { getAllEditionYears, getEdition } from '@/data/editions'
import { editionBreadcrumbJsonLd, editionEventJsonLd, editionMetadata } from '@/lib/seo'
import { type DynamicFetchOptions, getDynamicFetchOptions } from '@/sanity/lib/live'
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

  return (
    <main className={styles.page}>
      <JsonLd data={editionEventJsonLd(edition)} />
      <JsonLd data={editionBreadcrumbJsonLd(edition)} />

      <Hero edition={edition} />

      <Manifesto manifesto={edition.manifesto} />

      <ThemeArtists edition={edition} />

      <Venues venues={edition.venues} />

      {edition.program && <Program year={edition.year} program={edition.program} />}

      <Credits credits={edition.credits} />
    </main>
  )
}
