import { cx } from 'styled-system/css'
import { Text } from 'styled-system/jsx'
import { artistRoster } from '@/components/ArtistRoster/ArtistRoster.recipe'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import type { ArtistListItem } from '@/types/edition'

const styles = artistRoster()

const HEADING_ID = 'edition-artists'

interface ArtistRosterProps {
  artists: ArtistListItem[]
  designation: string
  className?: string | undefined
}

export function ArtistRoster({ artists, designation, className }: ArtistRosterProps) {
  return (
    <section aria-labelledby={HEADING_ID} className={cx(styles.root, className)}>
      <div className={styles.head}>
        <SectionHeading as="h2" id={HEADING_ID} flush>
          Artists
        </SectionHeading>
        <Text variant="label">{designation}</Text>
      </div>

      <ul className={styles.wall}>
        {artists.map((artist) => (
          <li key={artist._id} className={styles.entry}>
            {artist.name}
          </li>
        ))}
      </ul>
    </section>
  )
}
