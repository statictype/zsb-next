import { breakpoints } from '@/design-system/tokens'

export const ENGINE_ATTR = 'data-engine'
export const ENGINE_IDLE_ATTR = 'data-engine-idle'
export const MOVING_ATTR = 'data-moving'
export const CURRENT_ATTR = 'data-current'
export const SLIDE_CONTENT_ATTR = 'data-carousel-slide-content'
export const SNAP_PAGE_ATTR = 'data-carousel-snap'

export const STAGE_MAX_WIDTH = 900
export const STAGE_SIZES = `(min-width: ${breakpoints.lg}) min(45vw, ${STAGE_MAX_WIDTH}px), (min-width: ${breakpoints.md}) 70vw, 100vw`
