import { credits as creditsRecipe } from '@edition-components/Credits.recipe'
import Image from 'next/image'
import type { CSSProperties } from 'react'
import { Container, Text } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { Marquee } from '@/components/Marquee/Marquee'
import type { EditionCredits, MarkedPartner, TeamCredit } from '@/types/edition'

interface CreditsProps {
  credits: EditionCredits
  title: string
  wall?: 'marquee' | 'static'
  markSize?: 'standard' | 'large'
  titleInk?: 'action' | 'heading'
}

const s = creditsRecipe()

export function Credits({
  credits,
  title,
  wall = 'marquee',
  markSize = 'standard',
  titleInk = 'action',
}: CreditsProps) {
  const { marks, named, teamOrgs, teamNames } = credits
  if (marks.length + named.length + teamOrgs.length + teamNames.length === 0) return null

  return (
    <section className={section({ ground: 'light' })}>
      <Container>
        <div className={s.ledger}>
          {(marks.length > 0 || named.length > 0) && (
            <Text as="h2" variant="title" className={creditsRecipe({ titleInk }).title}>
              {title}
            </Text>
          )}

          {marks.length > 0 && (
            <div
              className={s.wall}
              style={markSize === 'large' ? ({ '--mark-boost': 1.1 } as CSSProperties) : undefined}
            >
              {wall === 'marquee' ? (
                <Marquee count={marks.length} gap="xl">
                  <MarkTiles marks={marks} />
                </Marquee>
              ) : (
                <ul className={s.grid}>
                  <MarkTiles marks={marks} />
                </ul>
              )}
            </div>
          )}

          {(named.length > 0 || teamOrgs.length > 0) && (
            <div className={s.row}>
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

          <TeamBand className={s.band} rows={teamNames} />
        </div>
      </Container>
    </section>
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
      {rows.map((row) => (
        <div className={s.cell} key={row.label}>
          <Text variant="label">{row.label}</Text>
          <TeamValue row={row} />
        </div>
      ))}
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
