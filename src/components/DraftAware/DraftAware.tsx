import { draftMode } from 'next/headers'
import { type ReactNode, Suspense } from 'react'
import { type DynamicFetchOptions, getDynamicFetchOptions } from '@/sanity/lib/live'

const PUBLISHED: DynamicFetchOptions = { perspective: 'published', stega: false }

interface DraftAwareProps {
  /**
   * Renders the page's cached leaf for the given fetch options. Keep the
   * `'use cache'` directive inside this leaf component, lexically in the page —
   * don't lift it here, so it's never closed over by the harness.
   */
  cached: (options: DynamicFetchOptions) => ReactNode
  /** Shown while the draft-mode fetch streams in (the cached leaf rendered empty). */
  fallback: ReactNode
}

/**
 * The page → dynamic → cached triplet, minus the cached leaf. In production
 * (no draft mode) it renders the leaf with published options directly, so the
 * page stays statically cacheable. In draft mode it resolves the request-scoped
 * perspective + stega *outside* the cache boundary and streams the leaf in under
 * `fallback`.
 *
 * Each page supplies only what's unique — its cached leaf and its fallback — so
 * the draft-mode / Suspense / published-fallback strategy lives in one place.
 */
export async function DraftAware({ cached, fallback }: DraftAwareProps): Promise<ReactNode> {
  const { isEnabled } = await draftMode()
  if (!isEnabled) return cached(PUBLISHED)
  return (
    <Suspense fallback={fallback}>
      <DraftResolved cached={cached} />
    </Suspense>
  )
}

async function DraftResolved({ cached }: Pick<DraftAwareProps, 'cached'>): Promise<ReactNode> {
  return cached(await getDynamicFetchOptions())
}
