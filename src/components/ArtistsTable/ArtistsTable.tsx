import { cx } from 'styled-system/css'
import { padNum, splitInHalf } from '@/lib/format-utils'
import type { ArtistListItem } from '@/types/edition'
import { artistsTable } from './ArtistsTable.recipe'

const styles = artistsTable()

interface MetaItem {
  label: string
  value: string | number
}

interface ArtistsTableProps {
  artists: ArtistListItem[]
  meta?: MetaItem[]
  className?: string | undefined
  headerLabel?: string
}

export function ArtistsTable({
  artists,
  meta = [],
  className,
  headerLabel = 'Artists',
}: ArtistsTableProps) {
  const [firstHalf, secondHalf] = splitInHalf(artists)
  const mid = firstHalf.length

  return (
    <div className={cx(styles.root, className)}>
      <div className={styles.colHeader}>
        <span className={styles.headerLabel}>{headerLabel}</span>
        <span>001&mdash;{padNum(artists.length, 3)}</span>
      </div>

      <div className={styles.body}>
        <div className={styles.column}>
          {firstHalf.map((artist, i) => (
            <div key={artist._id} className={styles.entry}>
              <span className={styles.num}>{padNum(i + 1, 3)}</span>
              <span className={styles.name}>{artist.name}</span>
            </div>
          ))}
        </div>
        <div className={styles.column}>
          {secondHalf.map((artist, i) => (
            <div key={artist._id} className={styles.entry}>
              <span className={styles.num}>{padNum(mid + i + 1, 3)}</span>
              <span className={styles.name}>{artist.name}</span>
            </div>
          ))}
        </div>
      </div>

      {meta.length > 0 && (
        <div className={styles.footer}>
          <div className={styles.meta}>
            {meta.map(({ label, value }) => (
              <div key={label} className={styles.metaItem}>
                {label}
                <span>{value}</span>
              </div>
            ))}
          </div>
          <div className={styles.barcode} />
        </div>
      )}
    </div>
  )
}
