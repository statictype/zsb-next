import { editionLoading } from '@edition/loading.recipe'
import { cx } from 'styled-system/css'
import { Grid, Stack } from 'styled-system/jsx'

const styles = editionLoading()

const LEDGER_ROWS = ['dates', 'venue', 'artists', 'events']

export default function EditionLoading() {
  return (
    <main className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroHead}>
            <div className={cx(styles.bone, styles.heroMast)} />
            <div className={cx(styles.bone, styles.heroTheme)} />
          </div>

          <div className={cx(styles.bone, styles.heroPlate)} />

          <div className={styles.heroLedger}>
            {LEDGER_ROWS.map((row) => (
              <div key={row} className={styles.heroRow}>
                <div className={cx(styles.bone, styles.heroRowLabel)} />
                <div className={cx(styles.bone, styles.heroRowValue)} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Stack className={styles.section} gap="xl">
        <div className={cx(styles.bone, styles.sectionTitle)} />
        <Stack>
          <div className={cx(styles.bone, styles.manifestoLine)} />
          <div className={cx(styles.bone, styles.manifestoLine)} />
          <div className={cx(styles.bone, styles.manifestoLine)} />
          <div className={cx(styles.bone, styles.manifestoLine)} />
          <div className={cx(styles.bone, styles.manifestoLine)} />
        </Stack>
      </Stack>

      <Stack className={styles.section} gap="xl">
        <div className={cx(styles.bone, styles.sectionTitle)} />
        <Grid columns={{ base: 2, md: 3, lg: 4 }} gap="md">
          <div className={cx(styles.bone, styles.artistCard)} />
          <div className={cx(styles.bone, styles.artistCard)} />
          <div className={cx(styles.bone, styles.artistCard)} />
          <div className={cx(styles.bone, styles.artistCard)} />
          <div className={cx(styles.bone, styles.artistCard)} />
          <div className={cx(styles.bone, styles.artistCard)} />
          <div className={cx(styles.bone, styles.artistCard)} />
          <div className={cx(styles.bone, styles.artistCard)} />
        </Grid>
      </Stack>

      <Stack className={styles.section} gap="xl">
        <div className={cx(styles.bone, styles.sectionTitle)} />
        <Stack>
          <div className={cx(styles.bone, styles.venueItem)} />
          <div className={cx(styles.bone, styles.venueItem)} />
          <div className={cx(styles.bone, styles.venueItem)} />
        </Stack>
      </Stack>

      <div className={styles.section}>
        <div className={cx(styles.bone, styles.carousel)} />
      </div>
    </main>
  )
}
