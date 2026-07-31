import { RiArrowRightUpLine } from '@remixicon/react'
import { artistsBanner } from '@site-components/ArtistsBanner.recipe'
import Link from 'next/link'
import { cx } from 'styled-system/css'
import { Text } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { Button } from '@/components/ui/Button/Button'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import { EDITIONS_HELD } from '@/lib/constants'
import { getArtistIndex } from '@/sanity/lib/artists'

export async function ArtistsBanner() {
  const artists = await getArtistIndex()
  const counts =
    artists.length > 0
      ? `${artists.length} artists. ${EDITIONS_HELD} editions.`
      : `${EDITIONS_HELD} editions.`

  const s = artistsBanner()

  return (
    <section id="artists" className={cx(section({ ground: 'light' }), s.root)}>
      <div className={s.inner}>
        <SectionHeading as="h2" flush>
          Artists
        </SectionHeading>
        <div className={s.body}>
          <Text as="p" variant="lead" className={s.subtext}>
            {counts} One sustained question: what sculpture makes visible that nothing else can.
          </Text>
          <Button asChild variant="secondary" size="md">
            <Link href="/artists">
              Explore <RiArrowRightUpLine size={14} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
