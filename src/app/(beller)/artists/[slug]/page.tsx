import { ArtistProfile } from '@artists-components/ArtistProfile'
import { notFound } from 'next/navigation'
import { pageMetadata } from '@/lib/seo'
import { getArtistPage, getArtistPageSlugs } from '@/sanity/lib/artists'
import { getDynamicFetchOptions } from '@/sanity/lib/live'

export async function generateStaticParams() {
  return (await getArtistPageSlugs()).map((slug) => ({ slug }))
}

export async function generateMetadata(props: PageProps<'/artists/[slug]'>) {
  const [{ slug }, options] = await Promise.all([props.params, getDynamicFetchOptions()])
  const artist = await getArtistPage(slug, options)
  if (!artist) return {}
  return pageMetadata({
    title: artist.name,
    description: `Biography and works of ${artist.name}.`,
    path: `/artists/${artist.slug}`,
  })
}

export default async function ArtistRoute(props: PageProps<'/artists/[slug]'>) {
  const [{ slug }, options] = await Promise.all([props.params, getDynamicFetchOptions()])
  const artist = await getArtistPage(slug, options)
  if (!artist) notFound()

  return (
    <main>
      <ArtistProfile artist={artist} />
    </main>
  )
}
