import Image from 'next/image'
import { section } from 'styled-system/recipes'
import { IsdayBadge } from '@/components/IsdayBadge/IsdayBadge'
import type { CreditEntry } from '@/types/edition'
import { credits as creditsRecipe } from './Credits.recipe'

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
      <div className={s.container}>
        {/* Primary Credits */}
        <div className={s.primary}>
          {primary.map((credit, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static list
            <div key={i} className={s.block}>
              <span className={s.label}>{credit.label}</span>
              <span className={s.name}>{credit.value}</span>
              {credit.detail && (
                <span className={s.detail}>
                  {credit.detail.split('\n').map((line, j, arr) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: static list
                    <span key={j}>
                      {line}
                      {j < arr.length - 1 && <br />}
                    </span>
                  ))}
                </span>
              )}
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
            </div>
          ))}
          <IsdayBadge className={s.badge} />
        </div>

        {/* Partners */}
        {partners.length > 0 && (
          <div className={s.partners}>
            {partners.map((credit, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static list
              <div key={i} className={s.partnersBlock}>
                <span className={s.partnersLabel}>{credit.label}</span>
                <div className={s.partnersList}>
                  {credit.value.split('\n').map((name, j) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: static list
                    <span key={j}>{name}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Secondary Credits + ISDay seal in the 4th column */}
        <div className={s.secondary}>
          {secondary.map((credit, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static list
            <div key={i} className={s.inline}>
              <span className={s.inlineLabel}>{credit.label}</span>
              <span className={s.inlineNames}>
                {(() => {
                  const names = credit.value.split('\n')
                  return names.map((name, j) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: static list
                    <span key={j}>
                      {name}
                      {j < names.length - 1 && <br />}
                    </span>
                  ))
                })()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
