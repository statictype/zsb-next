import Link from 'next/link'
import type { CSSProperties } from 'react'
import { cx } from 'styled-system/css'
import { EditionTheme } from '@/components/EditionTheme/EditionTheme'
import { Figure } from '@/components/Figure/Figure'
import { Badge } from '@/components/ui/Badge/Badge'
import { Card } from '@/components/ui/Card/Card'
import type { Edition } from '@/types/edition'
import { editionCard } from './EditionCard.recipe'

interface EditionCardProps {
  year: number
  theme: string
  themeHighlight?: string | undefined
  status?: 'live' | 'current' | 'upcoming'
  media?: 'image' | 'none'
  size?: 'lg' | 'md' | 'sm'
  image?: Edition['thumbImage'] | Edition['heroImage'] | undefined
  /** Source for the image card's meta row (date/artists/venue) — only read on
   *  the `media="image"` branch; imageless rail cards omit it. */
  edition?: Pick<Edition, 'dateTape' | 'artists' | 'venueLine'> | undefined
  href?: string | undefined
  className?: string | undefined
  style?: CSSProperties | undefined
  draggable?: boolean | undefined
  themeDelay?: string | undefined
}

export function EditionCard({
  year,
  theme,
  themeHighlight,
  status = 'live',
  media = 'image',
  size = 'md',
  image,
  edition,
  href,
  className,
  style,
  draggable,
  themeDelay,
}: EditionCardProps) {
  const styles = editionCard({ media, size })
  const canLink = status !== 'upcoming' && href != null
  const interactive = status === 'live' && canLink
  const activeThemeHighlight = status === 'upcoming' ? undefined : themeHighlight
  const date = edition?.dateTape.split(' · ')[0]
  const artistLabel = edition
    ? `${edition.artists.length} ${edition.artists.length === 1 ? 'artist' : 'artists'}`
    : undefined
  const location = edition?.venueLine
  const meta = [date, artistLabel, location].filter((item): item is string => Boolean(item))
  const yearBadge = <Badge className={styles.year}>{year}</Badge>
  const statusBadge =
    status !== 'live' ? (
      <Badge tone="outline" className={styles.status}>
        {status === 'current' ? 'Viewing' : 'Soon'}
      </Badge>
    ) : null
  const badges = (
    <div className={styles.badgeRow}>
      {yearBadge}
      {statusBadge}
    </div>
  )
  const cardProps = {
    ground: 'onDark' as const,
    interactive,
    className: cx(styles.root, className),
    style,
    'data-current': status === 'current' || undefined,
    'data-upcoming': status === 'upcoming' || undefined,
  }
  const themeTape = (
    <EditionTheme
      as="h2"
      size={size === 'lg' ? 'large' : 'normal'}
      interactive={interactive}
      theme={theme}
      themeHighlight={activeThemeHighlight}
      delay={themeDelay}
      className={media === 'none' ? styles.themeTape : undefined}
    />
  )
  const content = (
    <>
      {media === 'image' && image ? (
        <div className={styles.media}>
          <Figure
            image={image}
            sizes={
              size === 'lg'
                ? '(min-width: 1440px) 1400px, 100vw'
                : '(min-width: 1024px) 50vw, 100vw'
            }
            className={styles.image}
          />
          {badges}
        </div>
      ) : null}
      <div className={styles.content}>
        {media === 'none' ? (
          <div className={styles.themeRow} data-status={status !== 'live' || undefined}>
            {themeTape}
            <div className={styles.badgeStack}>
              {yearBadge}
              {statusBadge}
            </div>
          </div>
        ) : (
          themeTape
        )}
        {media === 'image' && meta.length > 0 ? (
          <dl className={styles.meta} aria-label={`${year} edition details`}>
            {meta.map((item) => (
              <div key={item} className={styles.metaItem}>
                <dt>{item === date ? 'Date' : item === artistLabel ? 'Artists' : 'Location'}</dt>
                <dd>{item}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </>
  )

  return canLink ? (
    <Card
      as={Link}
      href={href}
      draggable={draggable}
      aria-current={status === 'current' ? 'page' : undefined}
      {...cardProps}
    >
      {content}
    </Card>
  ) : (
    <Card as="div" {...cardProps}>
      {content}
    </Card>
  )
}
