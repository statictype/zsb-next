import type { Stat } from '@/data/stats'
import styles from './AnimatedStats.module.css'

interface AnimatedStatsProps {
  stats: readonly Stat[]
}

export function AnimatedStats({ stats }: AnimatedStatsProps) {
  return (
    <div className={styles.stats}>
      {stats.map((stat) => (
        <div key={stat.label} className={styles.stat}>
          <div className={styles.statNumber}>{stat.value}</div>
          <div className={styles.statLabel}>{stat.label}</div>
        </div>
      ))}
    </div>
  )
}
