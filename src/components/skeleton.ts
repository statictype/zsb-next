import { css } from 'styled-system/css'

/**
 * The house image-loading skeleton — a pulsing placeholder that sits behind a
 * loading `<Image>` (inset: 0) until the image paints over it. Place it as a
 * sibling *before* the image inside a `position: relative; overflow: hidden`
 * frame; the image's own className should set an opaque background so any
 * transparent areas don't reveal the sweep underneath. The base tone is the
 * gray ramp's `gray.800`; the `shimmer` sweep rides over it on `::after` (same
 * mechanism as the edition-loading bones).
 */
export const skeleton = css({
  position: 'absolute',
  inset: '0',
  background: 'gray.800',
  overflow: 'hidden',
  pointerEvents: 'none',
  zIndex: '0',
  _after: {
    content: '""',
    position: 'absolute',
    inset: '0',
    background:
      'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.06) 50%, transparent 100%)',
    animation: 'shimmer {durations.sweep} ease-in-out infinite',
  },
  '@media (prefers-reduced-motion: reduce)': { _after: { animation: 'none' } },
})
