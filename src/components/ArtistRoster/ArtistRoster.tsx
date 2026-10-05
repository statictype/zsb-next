import { Text } from 'styled-system/jsx'
import type { RecipeVariantProps } from 'styled-system/types'
import { artistRoster } from '@/components/ArtistRoster/ArtistRoster.recipe'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import type { ArtistListItem } from '@/types/edition'

const HEADING_ID = 'edition-artists'

type RosterAccent = NonNullable<NonNullable<RecipeVariantProps<typeof artistRoster>>['accent']>

interface ArtistRosterProps {
  artists: ArtistListItem[]
  title: string
  designation?: string
  accent?: RosterAccent
  className?: string | undefined
}

export function ArtistRoster({
  artists,
  title,
  designation,
  accent = 'highlight',
  className,
}: ArtistRosterProps) {
  const styles = artistRoster({ accent })
  return (
    <section aria-labelledby={HEADING_ID} className={className}>
      <div className={styles.head}>
        <SectionHeading as="h2" id={HEADING_ID} flush>
          {title}
        </SectionHeading>
        {designation && (
          <Text variant="label" color="currentColor">
            {designation}
          </Text>
        )}
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
