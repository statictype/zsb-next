import { credits as creditsRecipe } from '@edition-components/Credits.recipe'
import Image from 'next/image'
import type { CSSProperties } from 'react'
import { Container, Text } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { Marquee } from '@/components/Marquee/Marquee'
import type { CreditEntry, CreditPartner, PartnerMark } from '@/types/edition'

interface CreditsProps {
  credits: CreditEntry[]
}

const s = creditsRecipe()

type MarkedPartner = CreditPartner & { mark: PartnerMark }

// `type` is the block a row belongs to: `partner` is credited by logo, falling
// back to the name list; `primary` adds a team credit line and so is never
// listed by name twice; `secondary` is the team block alone, which is what
// keeps the aegis row's logo out of the wall.
function orgsOf(rows: CreditEntry[]): CreditPartner[] {
  return rows.flatMap((row) =>
    row.kind === 'org' ? [row] : row.kind === 'partners' ? row.partners : [],
  )
}

function uniqueBy<T>(items: T[], key: (item: T) => string): T[] {
  const seen = new Set<string>()
  return items.filter((item) => {
    const id = key(item)
    if (seen.has(id)) return false
    seen.add(id)
    return true
  })
}

export function Credits({ credits }: CreditsProps) {
  if (credits.length === 0) return null

  const marks = uniqueBy(
    orgsOf(credits.filter((row) => row.type !== 'secondary')).filter(
      (org): org is MarkedPartner => Boolean(org.mark) && !org.gallery,
    ),
    (org) => org.mark.src,
  )
  const named = uniqueBy(
    orgsOf(credits.filter((row) => row.type === 'partner')).filter(
      (org) => !org.mark || org.gallery,
    ),
    (org) => org.name,
  )
  const team = credits.filter((row) => row.type !== 'partner')
  const teamOrgs = team.filter((row) => row.kind !== 'names')
  const teamNames = team.filter((row) => row.kind === 'names')

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
                    {named.map((org) => (
                      <Text variant="caption" key={org.name}>
                        {org.name}
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

function TeamBand({ className, rows }: { className: string | undefined; rows: CreditEntry[] }) {
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

function TeamValue({ row }: { row: CreditEntry }) {
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

  const names = row.kind === 'names' ? row.names : row.partners.map((partner) => partner.name)
  return (
    <div className={s.run}>
      {names.map((name) => (
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
