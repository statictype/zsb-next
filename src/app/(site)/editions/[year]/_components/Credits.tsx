import { credits as creditsRecipe } from '@edition-components/Credits.recipe'
import Image from 'next/image'
import { Container, Text } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import type { CreditEntry, CreditPartner, PartnerMark } from '@/types/edition'

interface CreditsProps {
  credits: CreditEntry[]
}

const POOL_LABEL = 'Partners'

const s = creditsRecipe()
const teamRun = creditsRecipe({ wrap: true }).run

type MarkedPartner = CreditPartner & { mark: PartnerMark }

// `type` is the block a row belongs to: `partner` is credited by logo, falling
// back to the name list; `primary` adds a team credit line and so is never
// listed by name twice; `secondary` is the team block alone, which is what
// keeps the aegis row's logo out of the wall.
function wallOrgs(credits: CreditEntry[]): CreditPartner[] {
  const out: CreditPartner[] = []
  for (const row of credits) {
    if (row.type === 'secondary') continue
    if (row.kind === 'org') out.push(row)
    else if (row.kind === 'partners') out.push(...row.partners)
  }
  return out
}

function namedOrgs(credits: CreditEntry[]): CreditPartner[] {
  const out: CreditPartner[] = []
  for (const row of credits) {
    if (row.type !== 'partner' || row.kind !== 'partners') continue
    out.push(...row.partners)
  }
  return out
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
    wallOrgs(credits).filter((org): org is MarkedPartner => Boolean(org.mark) && !org.gallery),
    (org) => org.mark.src,
  )
  const named = uniqueBy(
    namedOrgs(credits).filter((org) => !org.mark || org.gallery),
    (org) => org.name,
  )
  const team = credits.filter((row) => row.type !== 'partner')

  return (
    <section className={section({ ground: 'light' })}>
      <Container>
        <div className={s.ledger}>
          {marks.length > 0 && (
            <ul className={s.wall}>
              {marks.map((org) => (
                <li className={s.tile} data-shape={org.mark.shape} key={org.mark.src}>
                  <Mark org={org} />
                </li>
              ))}
            </ul>
          )}

          {named.length > 0 && (
            <div className={s.row}>
              <Text variant="label" className={s.accent}>
                {POOL_LABEL}
              </Text>
              <div className={s.run}>
                {named.map((org) => (
                  <Text variant="caption" key={org.name}>
                    {org.name}
                  </Text>
                ))}
              </div>
            </div>
          )}

          <div className={s.band}>
            {team.map((row) => (
              <div className={s.cell} key={row.label}>
                <Text variant="label">{row.label}</Text>
                <TeamValue row={row} />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
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
    <div className={teamRun}>
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
      data-shape={mark.shape}
      className={s.mark}
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
