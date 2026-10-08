import { CachedEdition } from '@edition/edition-content'
import { getDynamicFetchOptions } from '@/sanity/lib/live'

// Fallback for the implicit `children` slot while `@modal` is active; without
// it the intercepted event modal 404s.
export default async function EditionDefault({ params }: { params: Promise<{ year: string }> }) {
  const [{ year }, options] = await Promise.all([params, getDynamicFetchOptions()])
  return <CachedEdition year={Number(year)} options={options} />
}
