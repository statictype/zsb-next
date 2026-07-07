import { css } from 'styled-system/css'

/**
 * The house image-loading skeleton — a pulsing placeholder that sits behind a
 * loading `<Image>` (inset: 0) until the image paints over it. Place it as a
 * sibling *before* the image inside a `position: relative; overflow: hidden`
 * frame; the image's own className should set an opaque background so any
 * transparent areas don't reveal the sweep underneath. The surface + shimmer
 * mechanism is the `skeleton` layer style (shared with the edition-loading
 * bones); this helper only positions it as an overlay.
 */
export const skeleton = css({
  layerStyle: 'skeleton',
  position: 'absolute',
  inset: '0',
  pointerEvents: 'none',
  zIndex: '0',
})
