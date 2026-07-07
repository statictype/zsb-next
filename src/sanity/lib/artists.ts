import 'server-only'

import type { ArtistListItem } from '@/types/edition'
import { PUBLISHED, queryData } from './live'
import { ARTIST_INDEX_QUERY } from './queries'

/**
 * All artists as `{ _id, name }`, surname-ordered (by `sortName`, falling back
 * to `name`); `_id` is only a stable render key. Published-only: the artists
 * index and the homepage banner aren't draft-previewed (no Presentation
 * location), so this stays statically cacheable. Freshness comes from
 * `<SanityLive />` + the revalidate webhook.
 */
export async function getArtistIndex(): Promise<ArtistListItem[]> {
  'use cache'
  return (await queryData(ARTIST_INDEX_QUERY, PUBLISHED)) ?? []
}
