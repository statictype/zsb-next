import Image from 'next/image'
import { Container, Stack } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import type { CreditEntry } from '@/types/edition'
import { credits as creditsRecipe } from './Credits.recipe'
import { IsdayBadge } from './IsdayBadge'

interface CreditsProps {
  credits: CreditEntry[]
}

export function Credits({ credits }: CreditsProps) {
  const primary = credits.filter((c) => c.type === 'primary')
  const partners = credits.filter((c) => c.type === 'partner')
  const secondary = credits.filter((c) => c.type === 'secondary')
  const s = creditsRecipe()

  return (
    <section className={section({ ground: 'light' })}>
      <Container>
        <Stack className={s.primary} gap="lg">
          {primary.map((credit) => (
            <Stack key={credit.label} gap="sm">
              <span className={s.label}>{credit.label}</span>
              <span className={s.name}>{credit.value}</span>
              {credit.detail && <span className={s.detail}>{credit.detail}</span>}
              {credit.logo && (
                <div>
                  <Image
                    src={credit.logo}
                    alt={credit.logoAlt}
                    className={s.logo}
                    width={120}
                    height={40}
                    unoptimized
                  />
                </div>
              )}
            </Stack>
          ))}
          <IsdayBadge className={s.badge} />
        </Stack>

        {partners.length > 0 && (
          <Stack className={s.partners} gap="lg">
            {partners.map((credit) => (
              <Stack key={credit.label} className={s.partnersBlock} gap="sm">
                <span className={s.partnersLabel}>{credit.label}</span>
                <div className={s.partnersList}>
                  {credit.value.split('\n').map((name) => (
                    <span key={name}>{name}</span>
                  ))}
                </div>
              </Stack>
            ))}
          </Stack>
        )}

        <Stack className={s.secondary} gap="lg">
          {secondary.map((credit) => (
            <Stack key={credit.label} className={s.inline} gap="sm">
              <span className={s.inlineLabel}>{credit.label}</span>
              <span className={s.inlineNames}>{credit.value}</span>
            </Stack>
          ))}
        </Stack>
      </Container>
    </section>
  )
}
