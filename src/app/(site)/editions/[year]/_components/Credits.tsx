import { credits as creditsRecipe } from '@edition-components/Credits.recipe'
import Image from 'next/image'
import type { CSSProperties } from 'react'
import { Container, Text } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { Marquee } from '@/components/Marquee/Marquee'
import type { EditionCredits, MarkedPartner, TeamCredit } from '@/types/edition'

interface CreditsProps {
  credits: EditionCredits
}

const s = creditsRecipe()

export function Credits({ credits }: CreditsProps) {
  const { marks, named, teamOrgs, teamNames } = credits
  if (marks.length + named.length + teamOrgs.length + teamNames.length === 0) return null

  return (
    <section className={section({ ground: 'light' })}>
      <Container>
        <div className={s.ledger}>
          {(marks.length > 0 || named.length > 0) && (
            <Text as="h2" variant="title" className={s.title}>
              Partners
            </Text>
          )}

          {marks.length > 0 && (
            <div className={s.wall}>
              <Marquee count={marks.length} gap="xl">
                {marks.map((org) => (
                  <li className={s.tile} key={org.mark.src}>
                    <Mark org={org} />
                  </li>
                ))}
              </Marquee>
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
    <a href={url} className={s.link} target="_blank" rel="noreferrer">
      {image}
    </a>
  )
}
