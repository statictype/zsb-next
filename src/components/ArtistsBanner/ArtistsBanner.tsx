import Link from 'next/link'
import { css } from 'styled-system/css'
import { Badge } from '@/components/ui/Badge/Badge'
import { Button } from '@/components/ui/Button/Button'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import { getAllEditionYears } from '@/data/editions'
import { getArtistNames } from '@/sanity/lib/artists'
import { artistsBanner } from './ArtistsBanner.recipe'

export async function ArtistsBanner() {
  const [artists, editionYears] = await Promise.all([getArtistNames(), getAllEditionYears()])
  const artistCount = artists.length
  const editionCount = editionYears.length

  const s = artistsBanner()

  return (
    <Link href="/artists" className={s.root}>
      <div className={s.inner}>
        <div className={s.left}>
          <Badge className={css({ marginBottom: 'md' })}>Index</Badge>
          <SectionHeading as="h2" flush>
            Artists
          </SectionHeading>
          <p className={s.subtext}>
            {artistCount} artists. {editionCount} editions. One sustained question: what sculpture
            makes visible that nothing else can.
          </p>
        </div>
        <Button asChild variant="secondary">
          <span>Explore</span>
        </Button>
      </div>
      <div className={s.accent} data-part="accent" />
    </Link>
  )
}
