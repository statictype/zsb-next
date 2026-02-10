import styles from './loading.module.css'

export default function EditionLoading() {
  return (
    <main className={styles.page}>
      {/* Hero skeleton */}
      <div className={styles.hero}>
        <div className={`${styles.bone} ${styles.heroEyebrow}`} />
        <div className={`${styles.bone} ${styles.heroYear}`} />
        <div className={`${styles.bone} ${styles.heroTheme}`} />
      </div>

      {/* Manifesto skeleton */}
      <div className={styles.section}>
        <div className={`${styles.bone} ${styles.sectionTitle}`} />
        <div className={styles.manifesto}>
          <div className={`${styles.bone} ${styles.manifestoLine}`} />
          <div className={`${styles.bone} ${styles.manifestoLine}`} />
          <div className={`${styles.bone} ${styles.manifestoLine}`} />
          <div className={`${styles.bone} ${styles.manifestoLine}`} />
          <div className={`${styles.bone} ${styles.manifestoLine}`} />
        </div>
      </div>

      {/* Artists skeleton */}
      <div className={styles.section}>
        <div className={`${styles.bone} ${styles.sectionTitle}`} />
        <div className={styles.artistGrid}>
          <div className={`${styles.bone} ${styles.artistCard}`} />
          <div className={`${styles.bone} ${styles.artistCard}`} />
          <div className={`${styles.bone} ${styles.artistCard}`} />
          <div className={`${styles.bone} ${styles.artistCard}`} />
          <div className={`${styles.bone} ${styles.artistCard}`} />
          <div className={`${styles.bone} ${styles.artistCard}`} />
          <div className={`${styles.bone} ${styles.artistCard}`} />
          <div className={`${styles.bone} ${styles.artistCard}`} />
        </div>
      </div>

      {/* Venues skeleton */}
      <div className={styles.section}>
        <div className={`${styles.bone} ${styles.sectionTitle}`} />
        <div className={styles.venueRow}>
          <div className={`${styles.bone} ${styles.venueItem}`} />
          <div className={`${styles.bone} ${styles.venueItem}`} />
          <div className={`${styles.bone} ${styles.venueItem}`} />
        </div>
      </div>

      {/* Carousel skeleton */}
      <div className={styles.section}>
        <div className={`${styles.bone} ${styles.carousel}`} />
      </div>
    </main>
  )
}
