import { BellerHero } from '@beller/_components/BellerHero'
import { BellerPressKit } from '@beller/_components/BellerPressKit'
import { Credits } from '@edition-components/Credits'
import { Program } from '@program/Program'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Container } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { ArtistRoster } from '@/components/ArtistRoster/ArtistRoster'
import { JsonLd } from '@/components/JsonLd/JsonLd'
import { Manifesto } from '@/components/Manifesto/Manifesto'
import { BELLER_SECTION_IDS, bellerProgramScope } from '@/lib/galeria-beller-href'
import { bellerEventJsonLd } from '@/lib/seo'
import { getGaleriaBeller } from '@/sanity/lib/galeria-beller'
import type { DynamicFetchOptions } from '@/sanity/lib/live'

export async function CachedBeller({ options }: { options: DynamicFetchOptions }) {
  'use cache'
  const page = await getGaleriaBeller(options)
  if (!page) notFound()

  return (
    <main id="top">
      <JsonLd data={bellerEventJsonLd(page)} />
      <BellerHero page={page} />

      <div id={BELLER_SECTION_IDS.info} />
      <Manifesto title={page.info.title} body={page.info.body} ground="dark" />

      {page.events.length > 0 && (
        <Suspense fallback={null}>
          <Program scope={bellerProgramScope} events={page.events} intro={page.programIntro} />
        </Suspense>
      )}

      {page.artists.length > 0 && (
        <section className={section({ ground: 'dark' })}>
          <Container>
            <div id={BELLER_SECTION_IDS.artists} />
            <ArtistRoster
              artists={page.artists}
              title="Artiști"
              designation={`${page.artists.length} artiști`}
            />
          </Container>
        </section>
      )}

      {page.pressKit && <BellerPressKit pressKit={page.pressKit} />}

      <Credits credits={page.credits} title="Parteneri" wall="static" markSize="large" />
    </main>
  )
}
