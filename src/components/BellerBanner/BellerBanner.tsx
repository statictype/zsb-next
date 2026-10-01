import { RiArrowRightLine } from '@remixicon/react'
import { bellerBanner } from '@/components/BellerBanner/BellerBanner.recipe'
import { GALERIA_BELLER_PATH } from '@/lib/galeria-beller-href'

const s = bellerBanner()

export function BellerBanner() {
  return (
    <div role="region" aria-label="Announcement" className={s.banner}>
      <a
        href={GALERIA_BELLER_PATH}
        hrefLang="ro"
        className={s.link}
        data-umami-event="beller_banner_click"
      >
        <span>3–4 Oct</span>
        <span className={s.dot} aria-hidden />
        <span>Galeria Beller</span>
        <span className={s.dot} aria-hidden />
        <span>Sculpture takes over the street</span>
        {/* <span className={s.dot} aria-hidden /> */}
        <span className={s.accent} data-part="cta">
          See the program <RiArrowRightLine size={14} aria-hidden />
        </span>
      </a>
    </div>
  )
}
