import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Carousel } from '@/components/Carousel/Carousel'
import { Credits } from '@/components/Credits/Credits'
import { Hero } from '@/components/Hero/Hero'
import { JsonLd } from '@/components/JsonLd/JsonLd'
import { Manifesto } from '@/components/Manifesto/Manifesto'
import { MediaKit } from '@/components/MediaKit/MediaKit'
import { Program } from '@/components/Program/Program'
import { ThemeArtists } from '@/components/ThemeArtists/ThemeArtists'
import { Venues } from '@/components/Venues/Venues'
import { getAllEditionYears, getEdition } from '@/data/editions'
import { SITE_NAME, SITE_URL } from '@/lib/constants'
import styles from './page.module.css'

export async function generateStaticParams() {
  return getAllEditionYears().map((year) => ({
    year: String(year),
  }))
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return `${text.slice(0, text.lastIndexOf(' ', max))}…`
}

export async function generateMetadata(props: PageProps<'/editions/[year]'>): Promise<Metadata> {
  const { year } = await props.params
  const edition = getEdition(Number(year))
  if (!edition) return {}

  const firstParagraph = edition.manifesto.paragraphs[0] ?? ''
  const description = truncate(firstParagraph, 155)
  const artistKeywords = edition.artists.slice(0, 5)

  return {
    title: `${edition.year} — ${edition.theme}`,
    description,
    keywords: [
      `${edition.year}`,
      edition.theme,
      'contemporary sculpture',
      'Bucharest art',
      ...artistKeywords,
    ],
    openGraph: {
      title: `${edition.year} — ${edition.theme}`,
      description,
      type: 'article',
      url: `/editions/${edition.year}`,
      ...(edition.heroImage && {
        images: [
          {
            url: `${edition.heroImage.basePath}-1920.${edition.heroImage.ext ?? 'webp'}`,
            width: 1920,
            alt: edition.heroImage.alt,
          },
        ],
      }),
    },
    alternates: { canonical: `/editions/${edition.year}` },
  }
}

export default async function EditionPage(props: PageProps<'/editions/[year]'>) {
  const { year } = await props.params
  const edition = getEdition(Number(year))

  if (!edition) {
    notFound()
  }

  const eventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `${SITE_NAME} ${edition.year} — ${edition.theme}`,
    description: edition.manifesto.paragraphs[0] ?? '',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Bucharest',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Bucharest',
        addressCountry: 'RO',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    performer: edition.artists.map((name) => ({
      '@type': 'Person',
      name,
    })),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: `${edition.year} — ${edition.theme}`,
        item: `${SITE_URL}/editions/${edition.year}`,
      },
    ],
  }

  return (
    <main className={styles.page}>
      <JsonLd data={eventJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <Hero edition={edition} />

      <Manifesto manifesto={edition.manifesto} />

      <ThemeArtists edition={edition} />

      <Venues venues={edition.venues} />

      <Program year={edition.year} program={edition.program} />

      <Carousel slides={edition.carousel} theme={edition.theme} />

      <Credits credits={edition.credits} />

      {<MediaKit items={edition.mediaKit} />}
    </main>
  )
}
