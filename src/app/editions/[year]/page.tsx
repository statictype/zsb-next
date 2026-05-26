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
import { isOnlineEdition } from '@/types/edition'
import { OnlineEditionLayout } from './online-edition-layout'
import styles from './page.module.css'

export async function generateStaticParams() {
  const years = await getAllEditionYears()
  return years.map((year) => ({ year: String(year) }))
}

export async function generateMetadata(props: PageProps<'/editions/[year]'>) {
  const { year } = await props.params
  const edition = await getEdition(Number(year))
  return edition ? editionMetadata(edition) : {}
}

export default async function EditionPage(props: PageProps<'/editions/[year]'>) {
  const { year } = await props.params
  const edition = await getEdition(Number(year))

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
