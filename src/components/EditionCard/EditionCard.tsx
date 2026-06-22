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
  href,
  className,
  style,
  draggable,
  themeDelay,
}: EditionCardProps) {
  const styles = editionCard({ media, size })
  const interactive = status === 'live' && href != null
  const cardProps = {
    ground: 'onDark' as const,
    interactive,
    className: cx(styles.root, className),
    style,
    'data-current': status === 'current' || undefined,
    'data-upcoming': status === 'upcoming' || undefined,
  }
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
          <Badge className={styles.year}>{year}</Badge>
        </div>
      ) : null}
      <div className={styles.content}>
        {media === 'none' ? <Badge className={styles.year}>{year}</Badge> : null}
        <EditionTheme
          as="h2"
          size={size === 'lg' ? 'large' : 'normal'}
          interactive={interactive}
          theme={theme}
          themeHighlight={themeHighlight}
          delay={themeDelay}
        />
        {status !== 'live' ? (
          <Badge tone="outline" className={styles.status}>
            {status === 'current' ? 'Viewing' : 'Soon'}
          </Badge>
        ) : null}
      </div>
    </>
  )

  return href && status !== 'upcoming' ? (
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
