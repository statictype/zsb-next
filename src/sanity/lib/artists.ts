import 'server-only'

import { mapArtistCloud, mapArtistProfile } from '@/sanity/lib/artists-mappers'
import { type DynamicFetchOptions, PUBLISHED, queryData } from '@/sanity/lib/live'
import {
  ARTIST_CLOUD,
  ARTIST_INDEX,
  ARTIST_PROFILE,
  ARTIST_PROFILE_PARAMS,
} from '@/sanity/lib/queries'
import type { ARTIST_PROFILE_PARAMS_QUERY_RESULT } from '@/sanity/types'
import type { ArtistCloud, ArtistListItem, ArtistProfile } from '@/types/edition'

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

export async function getArtistProfile(
  slug: string,
  options: DynamicFetchOptions,
): Promise<ArtistProfile | null> {
  'use cache'
  return mapArtistProfile(await queryData(ARTIST_PROFILE, options, { slug }))
}

export async function getArtistProfileParams(): Promise<ARTIST_PROFILE_PARAMS_QUERY_RESULT> {
  'use cache'
  return await queryData(ARTIST_PROFILE_PARAMS, PUBLISHED)
}
