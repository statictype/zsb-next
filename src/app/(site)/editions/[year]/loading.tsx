import { cx } from 'styled-system/css'
import { Center, Stack } from 'styled-system/jsx'
import { editionLoading } from './loading.recipe'

const styles = editionLoading()

export default function EditionLoading() {
  return (
    <main className={styles.page}>
      <Center className={styles.hero} flexDirection="column" gap="lg">
        <div className={cx(styles.bone, styles.heroEyebrow)} />
        <div className={cx(styles.bone, styles.heroYear)} />
        <div className={cx(styles.bone, styles.heroTheme)} />
      </Center>

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

      <div className={styles.section}>
        <div className={cx(styles.bone, styles.sectionTitle)} />
        <Stack>
          <div className={cx(styles.bone, styles.venueItem)} />
          <div className={cx(styles.bone, styles.venueItem)} />
          <div className={cx(styles.bone, styles.venueItem)} />
        </Stack>
      </div>

      <div className={styles.section}>
        <div className={cx(styles.bone, styles.carousel)} />
      </div>
    </main>
  )
}
