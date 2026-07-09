import Link from 'next/link'
import { css } from 'styled-system/css'
import { HStack, Stack } from 'styled-system/jsx'
import { Badge } from '@/components/ui/Badge/Badge'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import { getAllEditionYears } from '@/data/editions'
import { getArtistIndex } from '@/sanity/lib/artists'
import { artistsBanner } from './ArtistsBanner.recipe'

export async function ArtistsBanner() {
  const [artists, editionYears] = await Promise.all([getArtistIndex(), getAllEditionYears()])
  const artistCount = artists.length
  const editionCount = editionYears.length

  const s = artistsBanner()

  return (
    <Link href="/artists" className={s.root}>
      <HStack
        className={s.inner}
        flexDirection={{ base: 'column', md: 'row' }}
        alignItems={{ base: 'stretch', md: 'center' }}
        justify={{ md: 'space-between' }}
        gap="lg"
      >
        <Stack gap="sm">
          <Badge className={css({ marginBottom: 'md' })}>Index</Badge>
          <SectionHeading as="h2" flush>
            Artists
          </SectionHeading>
          <p className={s.subtext}>
            {artistCount} artists. {editionCount} editions. One sustained question: what sculpture
            makes visible that nothing else can.
          </p>
        </Stack>
        <span>Explore</span>
      </HStack>
      <div className={s.accent} data-part="accent" />
    </Link>
  )
}
