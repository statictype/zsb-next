import Link from 'next/link'
import type { CSSProperties } from 'react'
import { cx } from 'styled-system/css'
import { editionRailCard } from '@/components/EditionsNav/EditionRailCard.recipe'
import { EditionTheme } from '@/components/EditionTheme/EditionTheme'
import { Badge } from '@/components/ui/Badge/Badge'
import { Card } from '@/components/ui/Card/Card'
import type { EditionListItem } from '@/sanity/lib/editions'

type RailPlacement =
  | { status: 'live' | 'current'; href: string }
  | { status: 'announced'; href?: never }

const STATUS_BADGE = {
  live: null,
  current: 'Viewing',
  announced: 'Soon',
} as const satisfies Record<RailPlacement['status'], string | null>

type EditionRailCardProps = RailPlacement & {
  edition: Pick<EditionListItem, 'year' | 'theme' | 'themeHighlight'>
  className?: string | undefined
  style?: CSSProperties | undefined
}

export function EditionRailCard({ edition, status, href, className, style }: EditionRailCardProps) {
  const styles = editionRailCard({ status })
  const interactive = status === 'live'
  const isAnnounced = status === 'announced'
  const statusBadge = STATUS_BADGE[status]
  const link =
    href != null
      ? ({
          as: Link,
          href,
          draggable: false,
          'aria-current': status === 'current' ? ('page' as const) : undefined,
        } as const)
      : ({ as: 'div' } as const)

  return (
    <Card
      ground="onDark"
      interactive={interactive}
      className={cx(styles.root, className)}
      style={style}
      {...link}
    >
      <EditionTheme
        as="h2"
        size="rail"
        interactive={interactive}
        muted={isAnnounced}
        theme={edition.theme}
        themeHighlight={isAnnounced ? undefined : edition.themeHighlight}
        className={styles.tape}
        lead={
          <>
            <Badge tone={isAnnounced ? 'muted' : undefined}>{edition.year}</Badge>
            {statusBadge ? (
              <>
                {' '}
                <Badge tone={isAnnounced ? 'muted' : 'outline'}>{statusBadge}</Badge>
              </>
            ) : null}
          </>
        }
      />
    </Card>
  )
}
