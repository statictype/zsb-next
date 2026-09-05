import { nameCloud } from '@artists-components/NameCloud.recipe'
import { formatEditionYears } from '@/sanity/lib/artists-mappers'
import type { ArtistCloudItem } from '@/types/edition'

const shell = nameCloud()

interface NameCloudProps {
  artists: ArtistCloudItem[]
}

export function NameCloud({ artists }: NameCloudProps) {
  return (
    <ul className={shell.list}>
      {artists.map(({ _id, name, years, tier }) => {
        const styles = nameCloud({ size: tier })
        return (
          <li key={_id} className={styles.item}>
            <span className={styles.name}>{name}</span>
            <span className={styles.years}>{formatEditionYears(years)}</span>
          </li>
        )
      })}
    </ul>
  )
}
