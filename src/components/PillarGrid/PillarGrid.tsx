import { Divider, Grid, HStack, Stack, Text } from 'styled-system/jsx'
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
  const titleVariant = titleScale === 'responsive' ? 'title' : 'heading'

  return (
    <>
      <Divider />
      <Grid columns={{ base: 1, md: 2 }} gap="0">
        {items.map((item, index) => (
          <Stack as="article" key={item.title} className={styles.item}>
            {numbered ? (
              <HStack alignItems="baseline" gap="md">
                <Text variant="heading" className={styles.number}>
                  {pad(index + 1)}
                </Text>
                <Text as={Title} variant={titleVariant} className={styles.title}>
                  {item.title}
                </Text>
              </HStack>
            ) : (
              <Text as={Title} variant={titleVariant} className={styles.title}>
                {item.title}
              </Text>
            )}
            <Text as="p" variant="body" className={styles.body}>
              {item.body}
            </Text>
          </Stack>
        ))}
      </Grid>
      {rhythm === 'bookend' && <Divider />}
    </>
  )
}
