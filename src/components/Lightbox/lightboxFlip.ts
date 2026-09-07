import type { Rect } from '@/components/Lightbox/imageRect'
import type { MotionRuntime } from '@/components/Lightbox/motionRuntime'

export const FLIGHT_DURATION = 0.55
export const CHROME_DURATION = 0.3
const SETTLE_DURATION = 0.18

export interface Flight {
  source: string
  from: Rect
  to: Rect
  objectPosition: string
  filter: string
  zIndex: string
  onSettle: () => void
}

function applyRect(style: CSSStyleDeclaration, rect: Rect): void {
  style.left = `${rect.left}px`
  style.top = `${rect.top}px`
  style.width = `${rect.width}px`
  style.height = `${rect.height}px`
}

export function fly({ gsap, Flip }: MotionRuntime, flight: Flight): void {
  const clone = document.createElement('img')
  clone.src = flight.source
  clone.alt = ''
  const style = clone.style
  style.position = 'fixed'
  style.margin = '0'
  style.objectFit = 'cover'
  style.objectPosition = flight.objectPosition
  style.filter = flight.filter
  style.zIndex = flight.zIndex
  style.pointerEvents = 'none'
  applyRect(style, flight.from)
  document.body.append(clone)

  const state = Flip.getState(clone)
  applyRect(style, flight.to)

  Flip.from(state, {
    duration: FLIGHT_DURATION,
    ease: 'power3.inOut',
    onComplete: () => {
      flight.onSettle()
      gsap.to(clone, {
        opacity: 0,
        duration: SETTLE_DURATION,
        onComplete: () => clone.remove(),
      })
    },
  })
}
