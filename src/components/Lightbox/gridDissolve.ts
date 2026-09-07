import { containRect } from '@/components/Lightbox/imageRect'
import type { MotionRuntime } from '@/components/Lightbox/motionRuntime'

const COLUMNS_NARROW = 6
const COLUMNS_WIDE = 14
const NARROW_MAX_WIDTH = 768
const TILE_DURATION = 0.35
const TILE_SPREAD = 0.45
const SEAM_OVERLAP_PX = 1

export function clearDissolve({ gsap }: MotionRuntime, overlay: HTMLElement): void {
  const tiles = Array.from(overlay.children)
  if (tiles.length > 0) gsap.killTweensOf(tiles)
  overlay.replaceChildren()
}

export function dissolveFrom(
  runtime: MotionRuntime,
  image: HTMLImageElement,
  overlay: HTMLElement,
  onDone: () => void,
): boolean {
  const source = image.currentSrc || image.src
  if (!source || image.naturalWidth === 0) return false

  const box = overlay.getBoundingClientRect()
  if (box.width === 0 || box.height === 0) return false

  const content = containRect(
    { width: image.naturalWidth, height: image.naturalHeight },
    { left: 0, top: 0, width: box.width, height: box.height },
  )
  if (content.width === 0 || content.height === 0) return false

  clearDissolve(runtime, overlay)

  const columns = window.innerWidth < NARROW_MAX_WIDTH ? COLUMNS_NARROW : COLUMNS_WIDE
  const rows = Math.max(1, Math.round((columns * box.height) / box.width))
  const tileWidth = box.width / columns
  const tileHeight = box.height / rows
  const tiles: HTMLElement[] = []

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const left = column * tileWidth
      const top = row * tileHeight
      const covered =
        left < content.left + content.width &&
        left + tileWidth > content.left &&
        top < content.top + content.height &&
        top + tileHeight > content.top
      if (!covered) continue

      const tile = document.createElement('div')
      const style = tile.style
      style.position = 'absolute'
      style.left = `${left}px`
      style.top = `${top}px`
      style.width = `${tileWidth + SEAM_OVERLAP_PX}px`
      style.height = `${tileHeight + SEAM_OVERLAP_PX}px`
      // Reuses the browser's decoded copy of `currentSrc`; no second request.
      style.backgroundImage = `url("${source}")`
      style.backgroundSize = `${content.width}px ${content.height}px`
      style.backgroundPosition = `${content.left - left}px ${content.top - top}px`
      style.backgroundRepeat = 'no-repeat'
      style.willChange = 'opacity'
      tiles.push(tile)
    }
  }
  if (tiles.length === 0) return false

  overlay.append(...tiles)

  const { gsap } = runtime
  gsap.to(gsap.utils.shuffle(tiles), {
    opacity: 0,
    duration: TILE_DURATION,
    ease: 'power3.out',
    stagger: { amount: TILE_SPREAD },
    onComplete: () => {
      overlay.replaceChildren()
      onDone()
    },
  })
  return true
}
