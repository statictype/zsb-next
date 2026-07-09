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
      color: 'body',
      md: {},
    },
    year: { color: 'highlight' },
    dot: { width: '[4px]', height: '[4px]', background: 'gray.700', borderRadius: 'circle' },
    accent: { color: 'highlight' },
  },
})
