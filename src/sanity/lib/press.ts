import 'server-only'

import type {
  EDITIONS_PRESS_KIT_QUERY_RESULT,
  PRESS_APPEARANCES_QUERY_RESULT,
  PRESS_PAGE_QUERY_RESULT,
  PRESS_RELEASES_QUERY_RESULT,
} from '@/../sanity.types'
import { type DynamicFetchOptions, sanityFetch } from './live'
import {
  EDITIONS_PRESS_KIT_QUERY,
  PRESS_APPEARANCES_QUERY,
  PRESS_PAGE_QUERY,
  PRESS_RELEASES_QUERY,
} from './queries'

export type PressPage = NonNullable<PRESS_PAGE_QUERY_RESULT>
export type PressAppearance = PRESS_APPEARANCES_QUERY_RESULT[number]
export type PressRelease = PRESS_RELEASES_QUERY_RESULT[number]
export type EditionPressKit = EDITIONS_PRESS_KIT_QUERY_RESULT[number]

export async function getPressPage(options: DynamicFetchOptions): Promise<PressPage | null> {
  'use cache'
  const { data } = await sanityFetch({
    query: PRESS_PAGE_QUERY,
    perspective: options.perspective,
    stega: options.stega,
  })
  return data ?? null
}

export async function getPressAppearances(
  options: DynamicFetchOptions,
): Promise<PressAppearance[]> {
  'use cache'
  const { data } = await sanityFetch({
    query: PRESS_APPEARANCES_QUERY,
    perspective: options.perspective,
    stega: options.stega,
  })
  return data ?? []
}

export async function getPressReleases(
  options: DynamicFetchOptions,
): Promise<PressRelease[]> {
  'use cache'
  const { data } = await sanityFetch({
    query: PRESS_RELEASES_QUERY,
    perspective: options.perspective,
    stega: options.stega,
  })
  return data ?? []
}

export async function getEditionsPressKit(
  options: DynamicFetchOptions,
): Promise<EditionPressKit[]> {
  'use cache'
  const { data } = await sanityFetch({
    query: EDITIONS_PRESS_KIT_QUERY,
    perspective: options.perspective,
    stega: options.stega,
  })
  return data ?? []
}
