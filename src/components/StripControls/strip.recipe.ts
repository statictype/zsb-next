import { sva } from 'styled-system/css'

/**
 * strip — shared scroll-snap-strip layout.
 *
 * The viewport bleeds to the section edge by cancelling the parent's
 * content-padding, so any strip dropped in a padded section reaches the true
 * edge. Shared by Carousel + MediaKitStrip; each strip's items stay with their
 * own component.
 */
export const strip = sva({
  slots: ['viewport', 'track'],
  base: {
    viewport: {
      position: 'relative',
      width: 'calc(100% + 2 * token(spacing.content))',
      marginLeft: 'calc(-1 * token(spacing.content))',
      marginRight: 'calc(-1 * token(spacing.content))',
    },
    track: {
      display: 'flex',
      gap: 'md',
      overflowX: 'auto',
      overflowY: 'hidden',
      scrollSnapType: 'x mandatory',
      scrollBehavior: 'smooth',
      paddingInline: 'lg',
      scrollbarWidth: 'none',
      cursor: 'grab',
      touchAction: 'pan-x',
      userSelect: 'none',
      '&::-webkit-scrollbar': { display: 'none' },
      _focusVisible: { outline: '2px solid token(colors.action)', outlineOffset: '4px' },
    },
  },
})
