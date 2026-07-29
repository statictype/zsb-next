import { RiArrowRightUpLine } from '@remixicon/react'
import { artistsBanner } from '@site-components/ArtistsBanner.recipe'
import Link from 'next/link'
import { Text } from 'styled-system/jsx'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import { getAllEditionYears } from '@/data/editions'
import { getArtistIndex } from '@/sanity/lib/artists'

export async function ArtistsBanner() {
  const [artists, editionYears] = await Promise.all([getArtistIndex(), getAllEditionYears()])
  const artistCount = artists.length
  const editionCount = editionYears.length

  const s = artistsBanner()

  return (
    <Link href="/artists" className={s.root}>
      <div className={s.inner}>
        <SectionHeading as="h2" flush>
          Artists
        </SectionHeading>
        <div className={s.body}>
          <Text as="p" variant="caption" className={s.subtext}>
            {artistCount} artists. {editionCount} editions. One sustained question: what sculpture
            makes visible that nothing else can.
          </Text>
          <span className={s.action} data-part="action">
            Explore
            <span className={s.arrow} data-part="arrow" aria-hidden>
              <RiArrowRightUpLine size={14} />
            </span>
          </span>
        </div>
      </div>
      <div className={s.accent} data-part="accent" />
    </Link>
  )
}
