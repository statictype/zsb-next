import { css } from 'styled-system/css'

/**
 * The house image-loading skeleton — a pulsing placeholder that sits behind a
 * loading `<Image>` (inset: 0) until the image paints over it. Place it as a
 * sibling *before* the image inside a `position: relative; overflow: hidden`
 * frame; the image's own className should set an opaque background so any
 * transparent areas don't reveal the pulse underneath. The base tone is the
 * gray ramp's `gray.800`.
 */
export const skeleton = css({
  position: 'absolute',
  inset: '0',
  background: 'gray.800',
  animation: 'skeletonPulse 1.6s ease-in-out infinite',
  pointerEvents: 'none',
  zIndex: '0',
  '@media (prefers-reduced-motion: reduce)': { animation: 'none', opacity: '0.6' },
})
