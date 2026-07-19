import { CachedEdition } from '@/app/(site)/editions/[year]/edition-content'
import { getDynamicFetchOptions } from '@/sanity/lib/live'

// Fallback for the implicit `children` slot when the `@modal` slot is active and
// Next can't recover children's state (parallel routes — without this the
// intercepted event modal 404s). Renders the same cached edition as page.tsx.
export default async function EditionDefault({ params }: { params: Promise<{ year: string }> }) {
  const [{ year }, options] = await Promise.all([params, getDynamicFetchOptions()])
  return <CachedEdition year={Number(year)} options={options} />
}
