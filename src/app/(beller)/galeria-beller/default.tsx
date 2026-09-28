import { CachedBeller } from '@beller/content'
import { getDynamicFetchOptions } from '@/sanity/lib/live'

export default async function GaleriaBellerDefault() {
  const options = await getDynamicFetchOptions()
  return <CachedBeller options={options} />
}
