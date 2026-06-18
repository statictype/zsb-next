'use client'

import { RiArrowLeftLine, RiArrowRightLine, RiPauseLine, RiPlayLine } from '@remixicon/react'
import { useState } from 'react'
import { cx } from 'styled-system/css'
import { Figure } from '@/components/Figure/Figure'
import { useLightbox } from '@/components/Lightbox/Lightbox'
import { Button } from '@/components/ui/Button/Button'
import { useSlideshow } from '@/lib/use-slideshow'
import type { HeroImage } from '@/types/edition'
import { heroSlideshow } from './HeroSlideshow.recipe'

interface HeroSlideshowProps {
  images: HeroImage[]
  interval?: number
}

export function HeroSlideshow({ images, interval = 5000 }: HeroSlideshowProps) {
  const [playing, setPlaying] = useState(true)
  const count = images.length
  const multi = count > 1

  const {
    index: active,
    next,
    prev,
    goTo,
  } = useSlideshow({
    count,
    wrap: true,
    autoplay: playing ? interval : false,
  })
  const lightbox = useLightbox(images.map((img) => ({ src: img.src, caption: '' })))
  const s = heroSlideshow()

  return (
    <div className={s.slideshow}>
      <div
        className={s.stage}
        role="button"
        tabIndex={0}
        aria-label="Open image in lightbox"
        onClick={() => lightbox.open(active)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            lightbox.open(active)
          }
        }}
      >
        {images.map((img, i) => (
          <div key={img.src} className={s.slide} data-active={i === active}>
            <Figure
              image={img}
              sizes="(min-width: 1792px) 1024px, (min-width: 1280px) 60vw, 100vw"
              priority={i === 0}
              style={img.position ? { objectPosition: img.position } : undefined}
            />
          </div>
        ))}
        <div className={s.vignette} />

        {/* Progress — only while auto-advancing; restarts per slide so it stays
            in lock-step with the hook's timer. Hidden when paused, where there
            is no "next advance" to count down to. */}
        {multi && playing && (
          <div className={s.progressTrack} aria-hidden="true">
            <div
              key={active}
              className={s.progressFill}
              style={{ animationDuration: `${interval}ms` }}
            />
          </div>
        )}
      </div>

      {multi && (
        <div className={s.controlBar}>
          <div className={s.dots} aria-label="Choose slide">
            {images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                className={s.dot}
                aria-label={`Go to slide ${i + 1} of ${count}`}
                aria-current={i === active ? true : undefined}
                onClick={() => goTo(i)}
              />
            ))}
          </div>

          <div className={s.nav}>
            <Button
              variant="icon"
              className={cx(s.control, s.controlPrev)}
              onClick={prev}
              aria-label="Previous slide"
            >
              <RiArrowLeftLine size={20} />
            </Button>
            <Button
              variant="icon"
              className={cx(s.control, s.controlToggle)}
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? 'Pause slideshow' : 'Play slideshow'}
              aria-pressed={!playing}
            >
              {playing ? <RiPauseLine size={20} /> : <RiPlayLine size={20} />}
            </Button>
            <Button
              variant="icon"
              className={cx(s.control, s.controlNext)}
              onClick={next}
              aria-label="Next slide"
            >
              <RiArrowRightLine size={20} />
            </Button>
          </div>
        </div>
      )}

      {lightbox.element}
    </div>
  )
}
