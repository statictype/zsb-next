import styles from './IsdayBadge.module.css'

export function IsdayBadge() {
  return (
    <div className={styles.card}>
      <div className={styles.inner}>
        <div className={styles.title}>#ISDAY</div>
        <div className={styles.subtitle}>International Sculpture Day</div>
        <div className={styles.pill}>
          <span className={styles.pillIcon} />
          <span>Official Participant</span>
        </div>
      </div>
    </div>
  )
}
