import { nameCloud } from '@artists-components/NameCloud.recipe'
import { NameCloudSheet } from '@artists-components/NameCloudSheet'
import { formatEditionYears } from '@/sanity/lib/artists-mappers'
import type { ArtistCloudItem } from '@/types/edition'

const shell = nameCloud()

interface NameCloudProps {
  artists: ArtistCloudItem[]
}

export function NameCloud({ artists }: NameCloudProps) {
  return (
    <NameCloudSheet>
      <ul className={shell.list}>
        {artists.map(({ _id, name, years, tier }) => {
          const styles = nameCloud({ size: tier })
          const label = formatEditionYears(years)
          return (
            <li
              key={_id}
              className={styles.item}
              data-artist-id={_id}
              data-artist={name}
              data-years={label}
            >
              <span className={styles.name}>{name}</span>
              <span className={styles.years}>{label}</span>
            </li>
          )
        })}
      </ul>
    </NameCloudSheet>
  )
}
