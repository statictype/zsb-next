import { Text } from 'styled-system/jsx'
import { artistRoster } from '@/components/ArtistRoster/ArtistRoster.recipe'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import type { ArtistListItem } from '@/types/edition'

const styles = artistRoster()

const HEADING_ID = 'edition-artists'

interface ArtistRosterProps {
  artists: ArtistListItem[]
  title: string
  designation: string
  className?: string | undefined
}

export function ArtistRoster({ artists, title, designation, className }: ArtistRosterProps) {
  return (
    <section aria-labelledby={HEADING_ID} className={className}>
      <div className={styles.head}>
        <SectionHeading as="h2" id={HEADING_ID} flush>
          {title}
        </SectionHeading>
        <Text variant="label">{designation}</Text>
      </div>

      <ul className={styles.wall}>
        {artists.map((artist) => (
          <li key={artist._id} className={styles.entry}>
            {artist.href ? (
              <a href={artist.href} className={styles.link}>
                {artist.name}
              </a>
            ) : (
              artist.name
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
