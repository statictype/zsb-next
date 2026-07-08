import Link from 'next/link'
import type { CSSProperties } from 'react'
import { cx } from 'styled-system/css'
import { EditionTheme } from '@/components/EditionTheme/EditionTheme'
import { Badge } from '@/components/ui/Badge/Badge'
import { Card } from '@/components/ui/Card/Card'
import type { EditionListItem } from '@/sanity/lib/editions'
import { editionRailCard } from './EditionRailCard.recipe'

/**
 * Where a rail plate stands relative to the visitor. A union rather than
 * independent `status`/`href` props: upcoming editions have no reachable route
 * (it's gated `status != "upcoming"`), so "upcoming but linked" is a compile
 * error here instead of a runtime guard.
 */
export type RailPlacement =
  | { status: 'live' | 'current'; href: string }
  | { status: 'upcoming'; href?: never }

const STATUS_BADGE = {
  live: null,
  current: 'Viewing',
  upcoming: 'Soon',
} as const satisfies Record<RailPlacement['status'], string | null>

type EditionRailCardProps = RailPlacement & {
  edition: Pick<EditionListItem, 'year' | 'theme' | 'themeHighlight'>
  className?: string | undefined
  style?: CSSProperties | undefined
}

/**
 * One plate in the editions rail: a borderless Card wrapping the shared
 * EditionTheme tape, with the year/status badges stamped inside the band via
 * the tape's `lead` slot — one solid object, no satellite elements. Live
 * plates link and take the theme substring hover; the edition being viewed is
 * an inert link with a "Viewing" badge; upcoming editions are muted "Soon"
 * plates with no link and no highlight.
 */
export function EditionRailCard({ edition, status, href, className, style }: EditionRailCardProps) {
  const styles = editionRailCard({ status })
  const interactive = status === 'live'
  const isUpcoming = status === 'upcoming'
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
        muted={isUpcoming}
        theme={edition.theme}
        themeHighlight={isUpcoming ? undefined : edition.themeHighlight}
        className={styles.tape}
        lead={
          <>
            <Badge className={isUpcoming ? styles.badgeMuted : undefined}>{edition.year}</Badge>
            {statusBadge ? (
              <>
                {' '}
                <Badge
                  tone={isUpcoming ? undefined : 'outline'}
                  className={isUpcoming ? styles.badgeMuted : undefined}
                >
                  {statusBadge}
                </Badge>
              </>
            ) : null}
          </>
        }
      />
    </Card>
  )
}
