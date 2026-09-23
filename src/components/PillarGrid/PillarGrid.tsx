import { Divider, Stack, Text } from 'styled-system/jsx'
import { pillarGrid } from '@/components/PillarGrid/PillarGrid.recipe'

export interface PillarGridItem {
  title: string
  body: string
}

interface PillarGridProps {
  items: readonly PillarGridItem[]
  titleLevel?: 'h2' | 'h3'
  rhythm?: 'bookend' | 'pair'
  titleTone?: 'heading' | 'highlight'
}

export function PillarGrid({
  items,
  titleLevel: Title = 'h2',
  rhythm = 'bookend',
  titleTone = 'heading',
}: PillarGridProps) {
  const styles = pillarGrid({ rhythm, titleTone })

  return (
    <Stack gap="0">
      <div className={styles.grid}>
        {items.map((item) => (
          <Stack as="article" key={item.title} className={styles.item}>
            <Text as={Title} variant="heading" className={styles.title}>
              {item.title}
            </Text>
            <Text as="p" variant="body" className={styles.body}>
              {item.body}
            </Text>
          </Stack>
        ))}
      </div>
      {rhythm === 'bookend' && <Divider />}
    </Stack>
  )
}
