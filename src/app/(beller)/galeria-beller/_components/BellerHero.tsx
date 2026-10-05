import { bellerHero } from '@beller/_components/BellerHero.recipe'
import Image from 'next/image'
import type { CSSProperties } from 'react'
import { Text } from 'styled-system/jsx'
import type { GaleriaBeller } from '@/types/galeria-beller'

const s = bellerHero()

export function BellerHero({
  page,
}: {
  page: Pick<GaleriaBeller, 'title' | 'heroColor' | 'wordmark' | 'keyVisual' | 'facts'>
}) {
  const { title, heroColor, wordmark, keyVisual, facts } = page

  return (
    <header className={s.hero} style={{ '--beller-hero-bg': heroColor } as CSSProperties}>
      <div className={s.inner}>
        <div className={s.copy}>
          <h1 className={s.mast}>
            {wordmark ? (
              <Image
                src={wordmark.src}
                alt={title}
                width={wordmark.width}
                height={wordmark.height}
                sizes="(min-width: 768px) 40vw, 75vw"
                className={s.wordmark}
                priority
              />
            ) : (
              <Text as="span" variant="display" color="currentColor">
                {title}
              </Text>
            )}
          </h1>

          {facts.length > 0 && (
            <dl className={s.ledger}>
              {facts.map((fact) => (
                <div key={fact.label} className={s.row}>
                  <Text as="dt" variant="label" color="currentColor" className={s.rowLabel}>
                    {fact.label}
                  </Text>
                  <Text as="dd" variant="body" color="currentColor" className={s.rowValue}>
                    {fact.value}
                  </Text>
                </div>
              ))}
            </dl>
          )}
        </div>

        {keyVisual && (
          <div
            className={s.visual}
            style={
              {
                '--beller-visual-ratio': `${keyVisual.width} / ${keyVisual.height}`,
              } as CSSProperties
            }
          >
            <Image
              src={keyVisual.src}
              alt={keyVisual.alt}
              fill
              sizes="(min-width: 768px) 55vw, 100vw"
              className={s.visualImg}
              priority
              {...(keyVisual.blurDataURL && {
                placeholder: 'blur' as const,
                blurDataURL: keyVisual.blurDataURL,
              })}
            />
          </div>
        )}
      </div>
    </header>
  )
}
