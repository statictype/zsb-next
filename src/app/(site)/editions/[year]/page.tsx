import { CachedEdition } from '@edition/edition-content'
import { DraftAware } from '@/components/DraftAware/DraftAware'
import { EditionsNav } from '@/components/EditionsNav/EditionsNav'
import { editionMetadata } from '@/lib/seo'
import { getAllEditionYearParams, getEdition } from '@/sanity/lib/editions'
import { getDynamicFetchOptions } from '@/sanity/lib/live'

export async function generateStaticParams() {
  return getAllEditionYearParams()
}

export async function generateMetadata(props: PageProps<'/editions/[year]'>) {
  const [{ year }, { perspective }] = await Promise.all([props.params, getDynamicFetchOptions()])
  const edition = await getEdition(Number(year), { perspective })
  return edition ? editionMetadata(edition) : {}
}

export default async function EditionPage(props: PageProps<'/editions/[year]'>) {
  const { year } = await props.params
  return (
    <>
      <DraftAware
        cached={(options) => <CachedEdition year={Number(year)} options={options} />}
        fallback={null}
      />
      <EditionsNav />
    </>
  )
}
