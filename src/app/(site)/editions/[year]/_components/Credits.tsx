import { credits as creditsRecipe } from '@edition-components/Credits.recipe'
import Image from 'next/image'
import { cx } from 'styled-system/css'
import { Container, Text } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import type { CreditEntry } from '@/types/edition'

interface CreditsProps {
  credits: CreditEntry[]
}

export function Credits({ credits }: CreditsProps) {
  if (credits.length === 0) return null

  const primary = credits.filter((c) => c.type === 'primary')
  const partners = credits.filter((c) => c.type === 'partner')
  const secondary = credits.filter((c) => c.type === 'secondary')
  const s = creditsRecipe()

  return (
    <section className={section({ ground: 'light' })}>
      <Container>
        <div className={s.ledger}>
          {primary.map((credit) => (
            <div className={s.row} key={credit.label}>
              <Text variant="label">{credit.label}</Text>
              <div className={s.value}>
                <Text variant="lead">{credit.value}</Text>
                {credit.detail && (
                  <Text variant="caption" className={s.detail}>
                    {credit.detail}
                  </Text>
                )}
                {credit.logo && (
                  <Image
                    src={credit.logo}
                    alt={credit.logoAlt}
                    className={s.logo}
                    width={240}
                    height={48}
                    unoptimized
                  />
                )}
              </div>
            </div>
          ))}

          <div className={s.row}>
            <Text variant="label">Under the aegis of</Text>
            <div className={s.value}>
              <Text variant="lead" className={s.accent}>
                #ISDAY
              </Text>
              <Text variant="caption" className={s.detail}>
                International Sculpture Day
              </Text>
            </div>
          </div>

          {partners.map((credit) => (
            <div className={s.row} key={credit.label}>
              <Text variant="label" className={s.accent}>
                {credit.label}
              </Text>
              <div className={cx(s.value, s.run)}>
                {credit.value.split('\n').map((name) => (
                  <Text variant="caption" key={name}>
                    {name}
                  </Text>
                ))}
              </div>
            </div>
          ))}

          {secondary.map((credit) => (
            <div className={s.row} key={credit.label}>
              <Text variant="label">{credit.label}</Text>
              <div className={cx(s.value, s.run)}>
                {credit.value.split('\n').map((name) => (
                  <Text variant="caption" key={name}>
                    {name}
                  </Text>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
