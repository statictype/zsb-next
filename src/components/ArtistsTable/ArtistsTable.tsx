import { cx } from 'styled-system/css'
import { Grid, HStack, Text, Wrap } from 'styled-system/jsx'
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
      <HStack className={styles.colHeader} justify="space-between">
        <Text variant="label" className={styles.headerLabel}>
          {headerLabel}
        </Text>
        <Text variant="label">001&mdash;{padNum(artists.length, 3)}</Text>
      </HStack>

      <Grid className={styles.body} columns={{ base: 1, md: 2 }} gap="0">
        <div className={styles.column}>
          {firstHalf.map((artist, i) => (
            <HStack key={artist._id} className={styles.entry}>
              <Text variant="caption" className={styles.num}>
                {padNum(i + 1, 3)}
              </Text>
              <Text variant="label" className={styles.name}>
                {artist.name}
              </Text>
            </HStack>
          ))}
        </div>
        <div className={styles.column}>
          {secondHalf.map((artist, i) => (
            <HStack key={artist._id} className={styles.entry}>
              <Text variant="caption" className={styles.num}>
                {padNum(mid + i + 1, 3)}
              </Text>
              <Text variant="label" className={styles.name}>
                {artist.name}
              </Text>
            </HStack>
          ))}
        </div>
      </Grid>

      {meta.length > 0 && (
        <HStack className={styles.footer} justify="space-between">
          <Wrap gap="md" justify="flex-start">
            {meta.map(({ label, value }) => (
              <Text as="div" variant="label" key={label} className={styles.metaItem}>
                {label}
                <Text variant="label">{value}</Text>
              </Text>
            ))}
          </Wrap>
          <div className={styles.barcode} />
        </HStack>
      )}
    </div>
  )
}
