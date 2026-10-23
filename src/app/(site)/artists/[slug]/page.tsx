import { ArtistProfile } from '@artists-components/ArtistProfile'
import { notFound } from 'next/navigation'
import { DraftAware } from '@/components/DraftAware/DraftAware'
import { JsonLd } from '@/components/JsonLd/JsonLd'
import { artistJsonLd, artistMetadata } from '@/lib/seo'
import { getArtistProfile, getArtistProfileParams } from '@/sanity/lib/artists'
import { type DynamicFetchOptions, getDynamicFetchOptions } from '@/sanity/lib/live'
import { getSiteSettings } from '@/sanity/lib/settings'

export async function generateStaticParams() {
  return (await getArtistProfileParams()).map(({ slug }) => ({ slug }))
}

// No og:image here — the sibling opengraph-image route supplies it.
export async function generateMetadata(props: PageProps<'/artists/[slug]'>) {
  const [{ slug }, options] = await Promise.all([props.params, getDynamicFetchOptions()])
  const artist = await getArtistProfile(slug, options)
  return artist ? artistMetadata(artist) : {}
}

export default async function ArtistPage(props: PageProps<'/artists/[slug]'>) {
  const { slug } = await props.params
  return (
    <DraftAware
      cached={(options) => <ArtistBody slug={slug} options={options} />}
      fallback={null}
    />
  )
}

async function ArtistBody({ slug, options }: { slug: string; options: DynamicFetchOptions }) {
  const [artist, settings] = await Promise.all([
    getArtistProfile(slug, options),
    getSiteSettings(options),
  ])
  if (!artist) notFound()

  return (
    <main>
      <JsonLd data={artistJsonLd(artist)} />
      <ArtistProfile artist={artist} contactEmail={settings?.contactEmail ?? undefined} />
    </main>
  )
}
