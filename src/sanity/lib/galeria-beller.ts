import 'server-only'

import { mapGaleriaBeller } from '@/sanity/lib/galeria-beller-mappers'
import { type DynamicFetchOptions, queryData } from '@/sanity/lib/live'
import { GALERIA_BELLER } from '@/sanity/lib/queries'
import type { GaleriaBeller } from '@/types/galeria-beller'

export async function getGaleriaBeller(
  options: DynamicFetchOptions,
): Promise<GaleriaBeller | undefined> {
  'use cache'
  const raw = await queryData(GALERIA_BELLER, options)
  return raw ? mapGaleriaBeller(raw) : undefined
}
