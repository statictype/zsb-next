import 'server-only'

import { mapArtistCloud, mapArtistPage } from '@/sanity/lib/artists-mappers'
import { type DynamicFetchOptions, PUBLISHED, queryData } from '@/sanity/lib/live'
import { ARTIST_CLOUD, ARTIST_INDEX, ARTIST_PAGE, ARTIST_PAGE_SLUGS } from '@/sanity/lib/queries'
import type { ArtistCloud, ArtistListItem, ArtistPage } from '@/types/edition'

/** Published perspective only, so the result stays statically cacheable. */
export async function getArtistIndex(): Promise<ArtistListItem[]> {
  'use cache'
  return await queryData(ARTIST_INDEX, PUBLISHED)
}

export async function getArtistCloud(): Promise<ArtistCloud> {
  'use cache'
  const raw = await queryData(ARTIST_CLOUD, PUBLISHED)
  return mapArtistCloud(raw)
}

export async function getArtistPage(
  slug: string,
  options: DynamicFetchOptions,
): Promise<ArtistPage | null> {
  'use cache'
  return mapArtistPage(await queryData(ARTIST_PAGE, options, { slug }))
}

export async function getArtistPageSlugs(): Promise<string[]> {
  'use cache'
  return await queryData(ARTIST_PAGE_SLUGS, PUBLISHED)
}
