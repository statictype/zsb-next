import { Stack } from 'styled-system/jsx'
import { pillarGrid } from './PillarGrid.recipe'

export interface PillarGridItem {
  title: string
  body: string
}

interface PillarGridProps {
  items: readonly PillarGridItem[]
  numbered?: boolean | undefined
  titleLevel?: 'h2' | 'h3' | undefined
  rhythm?: 'bookend' | 'pair' | undefined
  titleTone?: 'heading' | 'highlight' | undefined
  titleScale?: 'standard' | 'responsive' | undefined
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

export function PillarGrid({
  items,
  numbered = false,
  titleLevel: Title = 'h2',
  rhythm = 'bookend',
  titleTone = 'heading',
  titleScale = 'standard',
}: PillarGridProps) {
  const styles = pillarGrid({ rhythm, titleTone, titleScale })

  return (
    <div className={styles.grid}>
      {items.map((item, index) => (
        <Stack as="article" key={item.title} className={styles.item}>
          {numbered ? (
            <div className={styles.head}>
              <span className={styles.number}>{pad(index + 1)}</span>
              <Title className={styles.title}>{item.title}</Title>
            </div>
          ) : (
            <Title className={styles.title}>{item.title}</Title>
          )}
          <p className={styles.body}>{item.body}</p>
        </Stack>
      ))}
    </div>
  )
}
