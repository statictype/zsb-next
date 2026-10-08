import { draftMode } from 'next/headers'
import { type ReactNode, Suspense } from 'react'
import { type DynamicFetchOptions, getDynamicFetchOptions, PUBLISHED } from '@/sanity/lib/live'

interface DraftAwareProps {
  // Keep the `'use cache'` directive inside the page's leaf component, not in DraftAware.
  cached: (options: DynamicFetchOptions) => ReactNode
  fallback: ReactNode
}

/**
 * The page → dynamic → cached triplet, minus the cached leaf. In production
 * (no draft mode) it renders the leaf with published options directly, so the
 * page stays statically cacheable. In draft mode it resolves the request-scoped
 * perspective *outside* the cache boundary and streams the leaf in under
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
