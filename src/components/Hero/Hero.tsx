import Image from 'next/image'
import type { Edition } from '@/types/edition'
import styles from './Hero.module.css'

interface HeroProps {
  edition: Pick<Edition, 'year' | 'theme' | 'themeHighlight' | 'heroImage' | 'dateTape'>
}

function splitOnFirst(a: string, b: string) {
  const [before, ...rest] = a.split(b)
  if (!rest.length || !before) return null
  return [before, rest.join(b)] as [string, string]
}

function HeroThemeDisplay({
  theme,
  themeHighlight = '',
}: {
  theme: string
  themeHighlight: string
}) {
  const [firstPart, secondPart] = splitOnFirst(theme, themeHighlight) ?? [theme, '']
  return (
    <h1 className={styles.theme}>
      {themeHighlight ? (
        <>
          <span>{firstPart}</span>
          <span className={styles.themeHighlight}>{themeHighlight}</span>
          <span>{secondPart}</span>
        </>
      ) : (
        theme
      )}
    </h1>
  )
}

export function Hero({ edition }: HeroProps) {
  const { year, theme, themeHighlight, heroImage, dateTape } = edition

  return (
    <header className={styles.hero}>
      {/* Background image */}
      <Image
        src={heroImage.src}
        alt={heroImage.alt}
        fill
        sizes="100vw"
        priority
        className={styles.bgImage}
      />

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.eyebrow}>Bucharest Sculpture Days</div>
        <div className={styles.year} data-year={year}>
          ZSB{year}
        </div>
        <HeroThemeDisplay theme={theme} themeHighlight={themeHighlight} />

        <div className={styles.dateTape}>{dateTape}</div>
      </div>

      {/* Scroll indicator — hidden mobile, visible desktop */}
      <div className={styles.scroll}>
        <span className={styles.scrollText}>Scroll</span>
        <div className={styles.scrollLine} />
      </div>
    </header>
  )
}
