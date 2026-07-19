import { editionLoading } from '@edition/loading.recipe'
import { cx } from 'styled-system/css'
import { Center, Grid, Stack } from 'styled-system/jsx'

const styles = editionLoading()

export default function EditionLoading() {
  return (
    <main className={styles.page}>
      <Center className={styles.hero} flexDirection="column" gap="lg">
        <div className={cx(styles.bone, styles.heroEyebrow)} />
        <div className={cx(styles.bone, styles.heroYear)} />
        <div className={cx(styles.bone, styles.heroTheme)} />
      </Center>

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
