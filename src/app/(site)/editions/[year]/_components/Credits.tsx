import { credits as creditsRecipe } from '@edition-components/Credits.recipe'
import Image from 'next/image'
import type { CSSProperties } from 'react'
import { cx } from 'styled-system/css'
import { Container, Text } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { Marquee } from '@/components/Marquee/Marquee'
import type { EditionCredits, MarkedPartner, TeamCredit } from '@/types/edition'

interface CreditsProps {
  credits: EditionCredits
  title: string
  wall?: 'marquee' | 'static'
  markSize?: 'standard' | 'large'
  density?: 'standard' | 'compact'
}

const s = creditsRecipe()

export function Credits({
  credits,
  title,
  wall = 'marquee',
  markSize = 'standard',
  density = 'standard',
}: CreditsProps) {
  const { marks, named, media, teamOrgs, teamNames } = credits
  if (marks.length + named.length + media.length + teamOrgs.length + teamNames.length === 0) {
    return null
  }
  const d = creditsRecipe({ density })

  return (
    <section data-ground="light" className={cx(section(), d.root)}>
      <Container>
        <div className={s.ledger}>
          {(marks.length > 0 || named.length > 0 || media.length > 0) && (
            <Text as="h2" variant="title" className={s.title}>
              {title}
            </Text>
          )}

          {marks.length > 0 && (
            <div
              className={d.wall}
              style={markSize === 'large' ? ({ '--mark-boost': 1.1 } as CSSProperties) : undefined}
            >
              <MarkWall marks={marks} wall={wall} />
            </div>
          )}

          {(named.length > 0 || teamOrgs.length > 0) && (
            <div className={d.row}>
              {named.length > 0 && (
                <div className={s.pool}>
                  <div className={s.run}>
                    {named.map((name) => (
                      <Text variant="caption" key={name}>
                        {name}
                      </Text>
                    ))}
                  </div>
                </div>
              )}
              <TeamBand className={s.orgBand} rows={teamOrgs} />
            </div>
          )}

          {media.length > 0 ? (
            <div className={d.tail}>
              {media.map((group) => (
                <div className={d.group} key={group.label}>
                  <Text variant="label">{group.label}</Text>
                  <div className={s.groupMarks}>
                    <MarkWall marks={group.marks} wall="marquee" />
                  </div>
                </div>
              ))}
              <TeamBand className={d.tailBand} rows={teamNames} />
            </div>
          ) : (
            <TeamBand className={d.band} rows={teamNames} />
          )}
        </div>
      </Container>
    </section>
  )
}

function MarkWall({ marks, wall }: { marks: MarkedPartner[]; wall: 'marquee' | 'static' }) {
  if (wall === 'marquee') {
    return (
      <Marquee count={marks.length} gap="xl">
        <MarkTiles marks={marks} />
      </Marquee>
    )
  }
  return (
    <ul className={s.grid}>
      <MarkTiles marks={marks} />
    </ul>
  )
}

function MarkTiles({ marks }: { marks: MarkedPartner[] }) {
  return marks.map((org) => (
    <li className={s.tile} key={org.mark.src}>
      <Mark org={org} />
    </li>
  ))
}

function TeamBand({ className, rows }: { className: string | undefined; rows: TeamCredit[] }) {
  if (rows.length === 0) return null
  return (
    <div className={className}>
      {rows.map((row) =>
        row.marks.length > 0 ? (
          <div className={cx(s.cell, s.cellSplit)} key={row.label}>
            <div className={s.cellText}>
              <Text variant="label">{row.label}</Text>
              <TeamValue row={row} />
            </div>
            <ul className={s.cellMarks}>
              <MarkTiles marks={row.marks} />
            </ul>
          </div>
        ) : (
          <div className={s.cell} key={row.label}>
            <Text variant="label">{row.label}</Text>
            <TeamValue row={row} />
          </div>
        ),
      )}
    </div>
  )
}

function TeamValue({ row }: { row: TeamCredit }) {
  if (row.kind === 'org') {
    return (
      <div className={s.value}>
        <Text variant="caption">{row.name}</Text>
        {row.detail && (
          <Text variant="caption" className={s.detail}>
            {row.detail}
          </Text>
        )}
      </div>
    )
  }

  return (
    <div className={s.run}>
      {row.names.map((name) => (
        <Text variant="caption" key={name}>
          {name}
        </Text>
      ))}
    </div>
  )
}

function Mark({ org }: { org: MarkedPartner }) {
  const { mark, name, url } = org
  const image = (
    <Image
      src={mark.src}
      alt={mark.alt || name}
      width={mark.width}
      height={mark.height}
      className={s.mark}
      style={{ '--mark-scale': mark.scale } as CSSProperties}
      unoptimized
    />
  )
  if (!url) return image
  return (
    <a
      href={url}
      className={s.link}
      target="_blank"
      rel="noreferrer"
      data-umami-event="partner_click"
      data-umami-event-partner={name}
    >
      {image}
    </a>
  )
}
