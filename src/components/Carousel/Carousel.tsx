'use client'

import { Carousel as ArkCarousel } from '@ark-ui/react/carousel'
import { RiArrowLeftLine, RiArrowRightLine, RiPauseLine, RiPlayLine } from '@remixicon/react'
import { type ReactNode, useId, useRef, useState, useSyncExternalStore } from 'react'
import { cx } from 'styled-system/css'
import { Stack } from 'styled-system/jsx'
import { carousel } from 'styled-system/recipes'
import { token } from 'styled-system/tokens'
import { POINTER_DRAG_TOLERANCE_PX } from '@/components/pointer-gesture'
import { Eyebrow } from '@/components/ui/Eyebrow/Eyebrow'

export interface CarouselSlide {
  id: string
  content: ReactNode
}

interface CarouselProps {
  id?: string | undefined
  slides: CarouselSlide[]
  label: string
  mode: 'stage' | 'rail'
  autoplay?: false | number
  loop: boolean
  eyebrow?: ReactNode
  className?: string | undefined
}

const safeId = (value: string) => value.replace(/[^a-zA-Z0-9_-]+/g, '-')
const reducedMotionQuery = '(prefers-reduced-motion: reduce)'

function subscribeToReducedMotion(callback: () => void) {
  const media = window.matchMedia(reducedMotionQuery)
  media.addEventListener('change', callback)
  return () => media.removeEventListener('change', callback)
}

function getReducedMotion() {
  return window.matchMedia(reducedMotionQuery).matches
}

function getServerReducedMotion() {
  return true
}

export function Carousel({
  id,
  slides,
  label,
  mode,
  autoplay = false,
  loop,
  eyebrow,
  className,
}: CarouselProps) {
  const generatedId = useId()
  const rootId = safeId(id ?? `carousel-${generatedId}`)
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotion,
    getServerReducedMotion,
  )
  const [playbackChoice, setPlaybackChoice] = useState<'auto' | 'paused' | 'playing'>('auto')
  const [hovered, setHovered] = useState(false)
  const [focusWithin, setFocusWithin] = useState(false)
  const dragOrigin = useRef<{ x: number; y: number } | null>(null)
  const styles = carousel({ mode })
  const explicitlyPaused =
    playbackChoice === 'paused' || (playbackChoice === 'auto' && reducedMotion)
  const temporarilyPaused = hovered || focusWithin
  const autoplayEnabled =
    autoplay !== false && !explicitlyPaused && !temporarilyPaused && slides.length > 1

  if (slides.length === 0) return null

  return (
    <ArkCarousel.Root
      id={rootId}
      ids={{ item: (index) => `${rootId}-slide-${safeId(slides[index]?.id ?? String(index))}` }}
      className={cx(styles.root, className)}
      aria-label={label}
      slideCount={slides.length}
      slidesPerPage={1}
      slidesPerMove={1}
      autoSize={mode === 'rail'}
      allowMouseDrag
      loop={loop}
      autoplay={autoplayEnabled ? { delay: autoplay } : false}
      spacing={mode === 'rail' ? token('spacing.md') : undefined}
      padding={mode === 'rail' ? token('spacing.gutter') : undefined}
      translations={{
        nextTrigger: `Next ${label.toLowerCase()} slide`,
        prevTrigger: `Previous ${label.toLowerCase()} slide`,
        indicator: (index) => `Go to slide ${index + 1} of ${slides.length}`,
        item: (index, count) => `${index + 1} of ${count}`,
        autoplayStart: `Play ${label.toLowerCase()}`,
        autoplayStop: `Pause ${label.toLowerCase()}`,
      }}
      // A mouse drag on the strip ends with a native click on whatever sits
      // under the pointer (Zag flags every mousedown as a potential drag, and
      // the click fires regardless), which would activate slide content —
      // open the gallery lightbox, follow a card link. Timing-based
      // suppression around Zag's drag-status events is racy (timers may run
      // between pointerup and click), so suppress by measured pointer travel
      // instead: a real click doesn't move, a drag does.
      onPointerDownCapture={(event) => {
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
      <ArkCarousel.Context>
        {(api) => {
          const resume = () => {
            if (autoplay !== false && !explicitlyPaused && !temporarilyPaused) {
              api.play()
            }
          }
          const resetAutoplay = () => {
            if (autoplay === false || explicitlyPaused || temporarilyPaused) return
            window.setTimeout(() => {
              api.pause()
              api.play()
            }, 0)
          }
          const controls = (
            <ArkCarousel.Control className={styles.control}>
              {mode === 'rail' && eyebrow !== undefined && <Eyebrow>{eyebrow}</Eyebrow>}
              {mode === 'stage' && slides.length > 1 && (
                <ArkCarousel.IndicatorGroup className={styles.indicatorGroup}>
                  {slides.map((slide, index) => (
                    <ArkCarousel.Indicator
                      key={slide.id}
                      index={index}
                      className={styles.indicator}
                      onClick={resetAutoplay}
                    />
                  ))}
                </ArkCarousel.IndicatorGroup>
              )}
              <span data-carousel-arrows>
                <ArkCarousel.PrevTrigger className={styles.trigger} onClick={resetAutoplay}>
                  <RiArrowLeftLine size={20} />
                </ArkCarousel.PrevTrigger>
                {mode === 'stage' && autoplay !== false && slides.length > 1 && (
                  <ArkCarousel.AutoplayTrigger
                    className={styles.trigger}
                    aria-label={
                      explicitlyPaused
                        ? `Play ${label.toLowerCase()}`
                        : `Pause ${label.toLowerCase()}`
                    }
                    onClickCapture={(event) => {
                      event.preventDefault()
                      const paused = !explicitlyPaused
                      setPlaybackChoice(paused ? 'paused' : 'playing')
                      if (paused) api.pause()
                      else resume()
                    }}
                  >
                    {explicitlyPaused ? <RiPlayLine size={20} /> : <RiPauseLine size={20} />}
                  </ArkCarousel.AutoplayTrigger>
                )}
                <ArkCarousel.NextTrigger className={styles.trigger} onClick={resetAutoplay}>
                  <RiArrowRightLine size={20} />
                </ArkCarousel.NextTrigger>
              </span>
            </ArkCarousel.Control>
          )

          return (
            <Stack
              gap={mode === 'rail' ? 'lg' : '0'}
              onPointerEnter={(event) => {
                if (event.pointerType === 'touch') return
                setHovered(true)
                api.pause()
              }}
              onPointerLeave={(event) => {
                if (event.pointerType === 'touch') return
                setHovered(false)
                resume()
              }}
              onFocusCapture={() => {
                setFocusWithin(true)
                api.pause()
              }}
              onBlurCapture={(event) => {
                if (event.currentTarget.contains(event.relatedTarget)) return
                setFocusWithin(false)
                resume()
              }}
            >
              {mode === 'rail' && controls}
              <ArkCarousel.ItemGroup className={styles.itemGroup}>
                {slides.map((slide, index) => (
                  <ArkCarousel.Item
                    key={slide.id}
                    index={index}
                    className={styles.item}
                    // Zag stamps an inline `maxWidth: 100%` on items even with
                    // `autoSize`, clamping the slide box while wider-than-track
                    // content (the editions plates) paints past it onto the
                    // next slide. Ark merges this style prop over its own, so
                    // rail items truly size to their content.
                    style={mode === 'rail' ? { maxWidth: 'none' } : undefined}
                  >
                    <div data-carousel-slide-content>{slide.content}</div>
                  </ArkCarousel.Item>
                ))}
              </ArkCarousel.ItemGroup>
              {mode === 'stage' && controls}
            </Stack>
          )
        }}
      </ArkCarousel.Context>
    </ArkCarousel.Root>
  )
}
