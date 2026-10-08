import { css } from 'styled-system/css'

// Place before the <Image> inside a `position: relative; overflow: hidden` frame.
export const skeleton = css({
  layerStyle: 'skeleton',
  position: 'absolute',
  inset: '0',
  pointerEvents: 'none',
  zIndex: '0',
})
