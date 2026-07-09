import { sva } from 'styled-system/css'

/**
 * CalendarMeta — co-located slot recipe.
 *
 * The board header's meta line: the edition year, a dot separator, then a
 * trailing label (the date window, or "Coming soon"). Shared by the live
 * Calendar and the ComingSoon stand-in. Raw grays are the documented
 * dark-board exceptions.
 */
export const calendarMeta = sva({
  slots: ['meta', 'year', 'dot', 'accent'],
  base: {
    meta: {
      marginTop: 'md',
      fontFamily: 'body',
      fontSize: 'xs',
      textTransform: 'uppercase',
      letterSpacing: 'label',
      fontWeight: 'semibold',
      color: 'body',
      md: { fontSize: 'sm' },
    },
    year: { color: 'highlight' },
    dot: { width: '[4px]', height: '[4px]', background: 'gray.700', borderRadius: 'circle' },
    accent: { color: 'highlight' },
  },
})
