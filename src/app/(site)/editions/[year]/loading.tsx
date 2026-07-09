import { cx } from 'styled-system/css'
import { Stack } from 'styled-system/jsx'
import { editionLoading } from './loading.recipe'

const styles = editionLoading()

export default function EditionLoading() {
  return (
    <main className={styles.page}>
      {/* Hero skeleton */}
      <div className={styles.hero}>
        <div className={cx(styles.bone, styles.heroEyebrow)} />
        <div className={cx(styles.bone, styles.heroYear)} />
        <div className={cx(styles.bone, styles.heroTheme)} />
      </div>

      {/* Manifesto skeleton */}
      <div className={styles.section}>
        <div className={cx(styles.bone, styles.sectionTitle)} />
        <Stack>
          <div className={cx(styles.bone, styles.manifestoLine)} />
          <div className={cx(styles.bone, styles.manifestoLine)} />
          <div className={cx(styles.bone, styles.manifestoLine)} />
          <div className={cx(styles.bone, styles.manifestoLine)} />
          <div className={cx(styles.bone, styles.manifestoLine)} />
        </Stack>
      </div>

      {/* Artists skeleton */}
      <div className={styles.section}>
        <div className={cx(styles.bone, styles.sectionTitle)} />
        <div className={styles.artistGrid}>
          <div className={cx(styles.bone, styles.artistCard)} />
          <div className={cx(styles.bone, styles.artistCard)} />
          <div className={cx(styles.bone, styles.artistCard)} />
          <div className={cx(styles.bone, styles.artistCard)} />
          <div className={cx(styles.bone, styles.artistCard)} />
          <div className={cx(styles.bone, styles.artistCard)} />
          <div className={cx(styles.bone, styles.artistCard)} />
          <div className={cx(styles.bone, styles.artistCard)} />
        </div>
      </div>

      {/* Venues skeleton */}
      <div className={styles.section}>
        <div className={cx(styles.bone, styles.sectionTitle)} />
        <Stack>
          <div className={cx(styles.bone, styles.venueItem)} />
          <div className={cx(styles.bone, styles.venueItem)} />
          <div className={cx(styles.bone, styles.venueItem)} />
        </Stack>
      </div>

      {/* Carousel skeleton */}
      <div className={styles.section}>
        <div className={cx(styles.bone, styles.carousel)} />
      </div>
    </main>
  )
}
