import Image from 'next/image'
import { imageSrc } from '@/lib/image-utils'
import type { HeroVariant } from '@/types/edition'
import styles from './Hero.module.css'

interface HeroProps {
  year: number
  theme: string
  themeHighlight?: string | undefined
  heroImage?: { basePath: string; alt: string; ext?: 'jpg' | 'png' | undefined } | undefined
  dateTape?: string | undefined
  variant?: HeroVariant | undefined
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
  themeHighlight: string | undefined
}) {
  const [firstPart, secondPart] = splitOnFirst(theme, themeHighlight) ?? [theme, '']
  return (
    <h1 className={styles.theme}>
      {themeHighlight ? (
        <>
          <span>{firstPart}</span><span className={styles.themeHighlight}>{themeHighlight}</span><span>{secondPart}</span>
        </>
      ) : (
        theme
      )}
    </h1>
  )
}

export function Hero({ year, theme, themeHighlight, heroImage, dateTape, variant }: HeroProps) {
  const heroClassName = `${styles.hero} ${variant ? styles[`variant${variant}`] : ''}`.trim()

  return (
    <header className={heroClassName}>
      {/* Background layers */}
      {/* <div className={styles.bgImage} /> */}
      <div className={styles.colorLayer} />
      <div className={styles.overlay} />
      <div className={styles.noise} />
      <div className={styles.vignette} />

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.eyebrow}>Bucharest Sculpture Days</div>
        <div className={styles.year} data-year={year}>
          {year}
        </div>
        <HeroThemeDisplay theme={theme} themeHighlight={themeHighlight} />

        {dateTape && <div className={styles.dateTape}>{dateTape}</div>}
      </div>

      {/* Sculpture image (with-sculpture variant only) */}
      {/* {heroImage && variant === 'with-sculpture' && (
        // <div className={styles.sculpture}>
        //   <Image src={imageSrc(heroImage)} alt={heroImage.alt} width={600} height={800} preload />
        // </div>
      )} */}

      {/* Scroll indicator — hidden mobile, visible desktop */}
      <div className={styles.scroll}>
        <span className={styles.scrollText}>Scroll</span>
        <div className={styles.scrollLine} />
      </div>
    </header>
  )
}
