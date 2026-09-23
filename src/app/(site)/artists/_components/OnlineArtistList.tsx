import { onlineArtistList } from '@artists-components/OnlineArtistList.recipe'
import type { ArtistListItem } from '@/types/edition'

interface OnlineArtistListProps {
  artists: ArtistListItem[]
}

export function OnlineArtistList({ artists }: OnlineArtistListProps) {
  const styles = onlineArtistList()
  return (
    <div className={styles.root}>
      <h2 id="online-artists-heading" className={styles.heading}>
        2021 online edition
      </h2>
      <ul className={styles.list} aria-labelledby="online-artists-heading">
        {artists.map(({ _id, name }) => (
          <li key={_id} className={styles.item}>
            {name}
          </li>
        ))}
      </ul>
    </div>
  )
}
