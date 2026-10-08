import { Credits } from '@edition-components/Credits'
import { ExternalGallery } from '@edition-components/ExternalGallery'
import { Hero } from '@edition-components/Hero'
import { ThemeArtists } from '@edition-components/ThemeArtists'
import { ComingSoon, type SocialLink } from '@program/ComingSoon'
import { Program } from '@program/Program'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { css } from 'styled-system/css'
import { JsonLd } from '@/components/JsonLd/JsonLd'
import { Manifesto } from '@/components/Manifesto/Manifesto'
import { editionProgramScope } from '@/lib/edition-href'
import { editionBreadcrumbJsonLd, editionEventJsonLd } from '@/lib/seo'
import { getEdition } from '@/sanity/lib/editions'
import type { DynamicFetchOptions } from '@/sanity/lib/live'
import { getSiteSettings } from '@/sanity/lib/settings'
import type { ExternalGalleryData } from '@/types/edition'

const EXTERNAL_GALLERY_BY_YEAR: Record<number, ExternalGalleryData> = {
  2021: {
    tag: 'Online Archive',
    title: 'Walk the Digital Field',
    highlight: 'Digital Field',
    description:
      'The 2021 exhibition lives where it was born, entirely online. Browse the full archive: ninety sculptors, presented without hierarchy.',
    linkLabel: 'Open the Archive',
    href: 'https://filialadesculptura.work/artists',
  },
}

// Shared by the edition route and the per-event route.
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

  const events = edition.events
  const hasEvents = events.length > 0
  const externalGallery = EXTERNAL_GALLERY_BY_YEAR[edition.year]
  const socials = edition.hasProgram && !hasEvents ? await socialLinks(options) : []

  return (
    <main className={css({ minHeight: 'svh' })}>
      <JsonLd data={editionEventJsonLd(edition)} />
      <JsonLd data={editionBreadcrumbJsonLd(edition)} />

      <Hero edition={edition} />

      <Manifesto
        title={edition.manifesto.title}
        body={edition.manifesto.body}
        accent={edition.manifesto.highlight}
      />

      <ThemeArtists edition={edition} />

      {edition.hasProgram &&
        (hasEvents ? (
          // Keeps `useSearchParams` in the program from making the route fully
          // dynamic.
          <Suspense fallback={null}>
            <Program scope={editionProgramScope(edition.year)} events={events} />
          </Suspense>
        ) : (
          <ComingSoon socials={socials} />
        ))}

      {externalGallery && <ExternalGallery gallery={externalGallery} />}

      <Credits credits={edition.credits} title="Partners" />
    </main>
  )
}

async function socialLinks(options: DynamicFetchOptions): Promise<SocialLink[]> {
  const settings = await getSiteSettings(options)
  const links: SocialLink[] = []
  if (settings?.instagramUrl) links.push({ label: 'Instagram', href: settings.instagramUrl })
  if (settings?.facebookUrl) links.push({ label: 'Facebook', href: settings.facebookUrl })
  return links
}
