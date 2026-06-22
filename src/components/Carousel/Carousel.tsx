'use client'

import { Carousel as ArkCarousel } from '@ark-ui/react/carousel'
import { RiArrowLeftLine, RiArrowRightLine, RiPauseLine, RiPlayLine } from '@remixicon/react'
import { type ReactNode, useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import { cx } from 'styled-system/css'
import { carousel } from 'styled-system/recipes'
import { token } from 'styled-system/tokens'
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
  const suppressClick = useRef(false)
  const suppressTimer = useRef<number | undefined>(undefined)
  const styles = carousel({ mode })
  const explicitlyPaused =
    playbackChoice === 'paused' || (playbackChoice === 'auto' && reducedMotion)
  const temporarilyPaused = hovered || focusWithin
  const autoplayEnabled =
    autoplay !== false && !explicitlyPaused && !temporarilyPaused && slides.length > 1

  useEffect(() => () => window.clearTimeout(suppressTimer.current), [])

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
      spacing={mode === 'rail' ? token('spacing.md') : '0px'}
      padding={mode === 'rail' ? token('spacing.gutter') : '0px'}
      translations={{
        nextTrigger: `Next ${label.toLowerCase()} slide`,
        prevTrigger: `Previous ${label.toLowerCase()} slide`,
        indicator: (index) => `Go to slide ${index + 1} of ${slides.length}`,
        item: (index, count) => `${index + 1} of ${count}`,
        autoplayStart: `Play ${label.toLowerCase()}`,
        autoplayStop: `Pause ${label.toLowerCase()}`,
        progressText: ({ page, totalPages }) => `${page} / ${totalPages}`,
      }}
      onDragStatusChange={(details) => {
        if (details.type !== 'dragging.end') return
        suppressClick.current = true
        window.clearTimeout(suppressTimer.current)
        suppressTimer.current = window.setTimeout(() => {
          suppressClick.current = false
        }, 0)
      }}
      onClickCapture={(event) => {
        if (!suppressClick.current) return
        event.preventDefault()
        event.stopPropagation()
        suppressClick.current = false
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
              {mode === 'rail' && <ArkCarousel.ProgressText className={styles.progressText} />}
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
                <ArkCarousel.PrevTrigger className={styles.prevTrigger} onClick={resetAutoplay}>
                  <RiArrowLeftLine size={20} />
                </ArkCarousel.PrevTrigger>
                {mode === 'stage' && autoplay !== false && slides.length > 1 && (
                  <ArkCarousel.AutoplayTrigger
                    className={styles.autoplayTrigger}
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
                <ArkCarousel.NextTrigger className={styles.nextTrigger} onClick={resetAutoplay}>
                  <RiArrowRightLine size={20} />
                </ArkCarousel.NextTrigger>
              </span>
            </ArkCarousel.Control>
          )

          return (
            <div
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
                  <ArkCarousel.Item key={slide.id} index={index} className={styles.item}>
                    <div data-carousel-slide-content>{slide.content}</div>
                  </ArkCarousel.Item>
                ))}
              </ArkCarousel.ItemGroup>
              {mode === 'stage' && controls}
            </div>
          )
        }}
      </ArkCarousel.Context>
    </ArkCarousel.Root>
  )
}
