import { sva } from 'styled-system/css'

/**
 * ProgramMeta — co-located slot recipe.
 *
 * The board header's meta line: the edition year, a dot separator, then a
 * trailing label (the date window, or "Coming soon"). Shared by the live
 * Program and the ComingSoon stand-in. Raw grays are the documented
 * dark-board exceptions.
 */
export const programMeta = sva({
  slots: ['year', 'dot', 'accent'],
  base: {
    year: { color: 'highlight' },
    dot: { width: '[4px]', height: '[4px]', background: 'gray.700', borderRadius: 'circle' },
    accent: { color: 'highlight' },
  },
})
