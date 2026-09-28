import { bellerHero } from '@beller/_components/BellerHero.recipe'
import Image from 'next/image'
import Link from 'next/link'
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
          <Link href="/" className={s.zsb}>
            <Image
              src="/img/logo_ZSB.svg"
              alt="Zilele Sculpturii București"
              width={72}
              height={100}
              className={s.zsbLogo}
              unoptimized
              priority
            />
          </Link>
          <h1 className={s.mast}>
            {wordmark ? (
              <Image
                src={wordmark.src}
                alt={title}
                width={2000}
                height={1330}
                sizes="(min-width: 1024px) 40vw, 90vw"
                className={s.wordmark}
                priority
              />
            ) : (
              <Text as="span" variant="display" color="[currentColor]">
                {title}
              </Text>
            )}
          </h1>

          {facts.length > 0 && (
            <dl className={s.ledger}>
              {facts.map((fact) => (
                <div key={fact.label} className={s.row}>
                  <Text as="dt" variant="label" color="[currentColor]" className={s.rowLabel}>
                    {fact.label}
                  </Text>
                  <Text as="dd" variant="body" color="[currentColor]" className={s.rowValue}>
                    {fact.value}
                  </Text>
                </div>
              ))}
            </dl>
          )}
        </div>

        {keyVisual && (
          <div className={s.visual}>
            <Image
              src={keyVisual.src}
              alt={keyVisual.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
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
