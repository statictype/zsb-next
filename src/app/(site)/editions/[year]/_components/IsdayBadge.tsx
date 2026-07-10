import { cx } from 'styled-system/css'
import { Center, Stack, Text } from 'styled-system/jsx'
import { Badge } from '@/components/ui/Badge/Badge'
import { Card } from '@/components/ui/Card/Card'
import { isdayBadge } from './IsdayBadge.recipe'

export function IsdayBadge({ className }: { className?: string | undefined }) {
  const s = isdayBadge()
  return (
    <Card ground="onLight" className={cx(s.card, className)}>
      <Center className={s.inner} flexDirection="column" gap="md">
        <Stack gap="xs" alignItems="center">
          <Text as="div" variant="lead" className={s.title}>
            #ISDAY
          </Text>
          <Text as="div" variant="label">
            International Sculpture Day
          </Text>
        </Stack>
        <Badge tone="outline" className={cx(s.pill)}>
          <span className={s.pillDot} />
          <span>Official Participant</span>
        </Badge>
      </Center>
    </Card>
  )
}
