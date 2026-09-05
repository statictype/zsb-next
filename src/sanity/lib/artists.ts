import 'server-only'

import { mapArtistCloud } from '@/sanity/lib/artists-mappers'
import { PUBLISHED, queryData } from '@/sanity/lib/live'
import {
  ARTIST_CLOUD_QUERY,
  ARTIST_CLOUD_QUERY_TAGS,
  ARTIST_INDEX_QUERY,
  ARTIST_INDEX_QUERY_TAGS,
} from '@/sanity/lib/queries'
import type { ArtistCloudItem, ArtistListItem } from '@/types/edition'

/**
 * All artists as `{ _id, name }`, surname-ordered (by `sortName`, falling back
 * to `name`); `_id` is only a stable render key. Published-only: the artists
 * index and the homepage banner aren't draft-previewed (no Presentation
 * location), so this stays statically cacheable. Freshness comes from
 * `<SanityLive />` + the revalidate webhook.
 */
export async function getArtistIndex(): Promise<ArtistListItem[]> {
  'use cache'
  return await queryData(ARTIST_INDEX_QUERY, PUBLISHED, { tags: ARTIST_INDEX_QUERY_TAGS })
}

// The homepage banner stays on getArtistIndex: its cache entry must not carry
// the per-artist years it never reads.
export async function getArtistCloud(): Promise<ArtistCloudItem[]> {
  'use cache'
  const raw = await queryData(ARTIST_CLOUD_QUERY, PUBLISHED, { tags: ARTIST_CLOUD_QUERY_TAGS })
  return mapArtistCloud(raw)
}
