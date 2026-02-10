import Image from 'next/image'
import type { CreditEntry } from '@/types/edition'
import styles from './Credits.module.css'

interface CreditsProps {
  credits: CreditEntry[]
}

export function Credits({ credits }: CreditsProps) {
  const primary = credits.filter((c) => c.type === 'primary')
  const partners = credits.filter((c) => c.type === 'partner')
  const secondary = credits.filter((c) => c.type === 'secondary')

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Primary Credits */}
        <div className={styles.primary}>
          {primary.map((credit, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static list
            <div key={i} className={styles.block}>
              <span className={styles.label}>{credit.label}</span>
              <span className={styles.name}>{credit.value}</span>
              {credit.detail && (
                <span className={styles.detail}>
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
                    alt={credit.logoAlt || ''}
                    className={styles.logo}
                    width={120}
                    height={40}
                    unoptimized
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Partners */}
        {partners.length > 0 && (
          <div className={styles.partners}>
            {partners.map((credit, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static list
              <div key={i} className={styles.partnersBlock}>
                <span className={styles.partnersLabel}>{credit.label}</span>
                <div className={styles.partnersList}>
                  {credit.value.split('\n').map((name, j) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: static list
                    <span key={j}>{name}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Secondary Credits */}
        {secondary.length > 0 && (
          <div className={styles.secondary}>
            {secondary.map((credit, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static list
              <div key={i} className={styles.inline}>
                <span className={styles.inlineLabel}>{credit.label}</span>
                <span className={styles.inlineNames}>
                  {credit.value.split('\n').map((name, j) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: static list
                    <span key={j}>
                      {name}
                      {j < credit.value.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
