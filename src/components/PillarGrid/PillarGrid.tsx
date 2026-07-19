import { Divider, Grid, Stack, Text } from 'styled-system/jsx'
import { pillarGrid } from './PillarGrid.recipe'

export interface PillarGridItem {
  title: string
  body: string
}

interface PillarGridProps {
  items: readonly PillarGridItem[]
  titleLevel?: 'h2' | 'h3' | undefined
  rhythm?: 'bookend' | 'pair' | undefined
  titleTone?: 'heading' | 'highlight' | undefined
  titleScale?: 'standard' | 'responsive' | undefined
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
      <Divider />
      <Grid columns={{ base: 1, md: 2 }} gap="0">
        {items.map((item) => (
          <Stack as="article" key={item.title} className={styles.item}>
            {
              <Text as={Title} variant={'heading'} className={styles.title}>
                {item.title}
              </Text>
            }
            <Text as="p" variant="body" className={styles.body}>
              {item.body}
            </Text>
          </Stack>
        ))}
      </Grid>
      {rhythm === 'bookend' && <Divider />}
    </Stack>
  )
}
