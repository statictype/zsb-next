'use client'

import { RiArrowLeftLine, RiArrowRightLine } from '@remixicon/react'
import { cx } from 'styled-system/css'
import { Button } from '@/components/ui/Button/Button'
import { Eyebrow } from '@/components/ui/Eyebrow/Eyebrow'
import { stripControls } from './StripControls.recipe'

interface StripControlsProps {
  /** Left-aligned label (e.g. the edition theme, or "Media"). */
  eyebrow: string
  /** Current snap index — drives the boundary-disable on the arrows. */
  activeIndex: number
  /** Total snap items, so the next arrow disables at the end. */
  count: number
  onPrev: () => void
  onNext: () => void
  /** Per-strip aria-labels (e.g. "Previous slide" vs "Previous poster"). */
  labels: { prev: string; next: string }
  /** Placement-only override (top margin) merged onto the controls row. */
  className?: string | undefined
}

/**
 * The header row shared by every scroll-snap strip: an eyebrow plus prev/next
 * arrows that disable at each end. The strip's own layout (the track + its
 * items) stays with the component; only this chrome is shared.
 */
export function StripControls({
  eyebrow,
  activeIndex,
  count,
  onPrev,
  onNext,
  labels,
  className,
}: StripControlsProps) {
  const s = stripControls()
  return (
    <div className={cx(s.controls, className)}>
      <Eyebrow tone="muted" size="md">
        {eyebrow}
      </Eyebrow>
      <div className={s.arrows}>
        <Button
          variant="icon"
          onClick={onPrev}
          disabled={activeIndex === 0}
          aria-label={labels.prev}
        >
          <RiArrowLeftLine size={20} />
        </Button>
        <Button
          variant="icon"
          onClick={onNext}
          disabled={activeIndex === count - 1}
          aria-label={labels.next}
        >
          <RiArrowRightLine size={20} />
        </Button>
      </div>
    </div>
  )
}
