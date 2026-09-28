import { CachedBeller } from '@beller/content'
import { galeriaBellerMetadata } from '@/lib/seo'
import { getGaleriaBeller } from '@/sanity/lib/galeria-beller'
import { getDynamicFetchOptions } from '@/sanity/lib/live'

export async function generateMetadata() {
  const { perspective } = await getDynamicFetchOptions()
  const page = await getGaleriaBeller({ perspective })
  return page ? galeriaBellerMetadata(page) : {}
}

export default async function GaleriaBellerPage() {
  const options = await getDynamicFetchOptions()
  return <CachedBeller options={options} />
}
