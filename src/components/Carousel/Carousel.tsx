'use client'

import { RiArrowLeftLine, RiArrowRightLine } from '@remixicon/react'
import { type ReactNode, useId, useRef } from 'react'
import { cx } from 'styled-system/css'
import { carousel } from 'styled-system/recipes'
import { CURRENT_ATTR, SLIDE_CONTENT_ATTR } from '@/components/Carousel/carousel-contract'
import { useCarouselEngine } from '@/components/Carousel/useCarouselEngine'
import { type SlideLoading, useSlideLoading } from '@/components/Carousel/useSlideLoading'
import { useMediaQuery } from '@/components/media-query'
import { POINTER_DRAG_TOLERANCE_PX } from '@/components/pointer-gesture'
import { useReducedMotion } from '@/components/reduced-motion'
import { Button } from '@/components/ui/Button/Button'
import { Eyebrow } from '@/components/ui/Eyebrow/Eyebrow'
import { breakpoints, portraitPhoneQuery } from '@/design-system/tokens'

export interface CarouselSlide {
  id: string
  content: (loading: SlideLoading) => ReactNode
}

interface CarouselProps {
  id?: string
  slides: CarouselSlide[]
  label: string
  mode: 'stage' | 'rail'
  eyebrow?: ReactNode
  className?: string | undefined
}

const safeId = (value: string) => value.replace(/[^a-zA-Z0-9_-]+/g, '-')

// The stage recipe masks the leading slide from `2xl` up, and the rail recipe
// lays a slide's images out as separate pages on portrait phones.
const stageMaskQuery = `(min-width: ${breakpoints['2xl']})`

export function Carousel({ id, slides, label, mode, eyebrow, className }: CarouselProps) {
  const generatedId = useId()
  const rootId = safeId(id ?? `carousel-${generatedId}`)
  const reducedMotion = useReducedMotion()
  const stageMasked = useMediaQuery(stageMaskQuery, false)
  const portraitPhone = useMediaQuery(portraitPhoneQuery, false)
  const frameRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const dragOrigin = useRef<{ x: number; y: number } | null>(null)
  const styles = carousel({ mode })

  const { page, pageCount, next, previous, toIndex } = useCarouselEngine({
    trackRef,
    slideCount: slides.length,
    animated: !reducedMotion,
    focusOffset: mode === 'stage' && stageMasked ? 1 : 0,
    snap: mode === 'rail' && portraitPhone ? 'image' : 'slide',
  })
  const { loadingFor, engage } = useSlideLoading({ frameRef, trackRef, page })

  if (slides.length === 0) return null

  const controls = mode === 'rail' && (
    <div className={styles.control}>
      {eyebrow !== undefined && <Eyebrow>{eyebrow}</Eyebrow>}
      <span className={styles.arrows}>
        <Button
          variant="icon"
          aria-label={`Previous ${label.toLowerCase()} slide`}
          onClick={previous}
        >
          <RiArrowLeftLine size={20} />
        </Button>
        <Button variant="icon" aria-label={`Next ${label.toLowerCase()} slide`} onClick={next}>
          <RiArrowRightLine size={20} />
        </Button>
      </span>
    </div>
  )

  return (
    <div
      id={rootId}
      className={cx(styles.root, className)}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      // A mouse drag on the strip ends with a native click on whatever sits
      // under the pointer, which would activate slide content — open the
      // gallery lightbox, follow a card link. Timing-based suppression around
      // the drag lifecycle is racy (timers may run between pointerup and
      // click), so suppress by measured pointer travel instead: a real click
      // doesn't move, a drag does.
      onPointerEnter={engage}
      onFocusCapture={engage}
      onPointerDownCapture={(event) => {
        engage()
        dragOrigin.current = { x: event.clientX, y: event.clientY }
      }}
      onClickCapture={(event) => {
        const origin = dragOrigin.current
        dragOrigin.current = null
        // detail === 0 → keyboard-activated click; never suppress those.
        if (!origin || event.detail === 0) return
        const travel = Math.hypot(event.clientX - origin.x, event.clientY - origin.y)
        if (travel < POINTER_DRAG_TOLERANCE_PX) return
        event.preventDefault()
        event.stopPropagation()
      }}
    >
      <div ref={frameRef} className={styles.frame}>
        <div
          ref={trackRef}
          className={styles.track}
          role="group"
          aria-label={`${label} slides`}
          tabIndex={0}
          onKeyDown={(event) => {
            switch (event.key) {
              case 'ArrowLeft':
                previous()
                break
              case 'ArrowRight':
                next()
                break
              case 'Home':
                toIndex(0)
                break
              case 'End':
                toIndex(pageCount - 1)
                break
              default:
                return
            }
            event.preventDefault()
          }}
        >
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={styles.item}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slides.length}`}
              {...{ [CURRENT_ATTR]: index === page ? '' : undefined }}
              onFocus={(event) => {
                if (event.target.matches(':focus-visible')) toIndex(index)
              }}
            >
              <div {...{ [SLIDE_CONTENT_ATTR]: '' }}>{slide.content(loadingFor(index))}</div>
            </div>
          ))}
        </div>
      </div>
      {controls}
    </div>
  )
}
