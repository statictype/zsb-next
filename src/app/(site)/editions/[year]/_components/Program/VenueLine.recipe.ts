import { sva } from 'styled-system/css'

/**
 * VenueLine — co-located slot recipe.
 *
 * The venue name + its rolled-up parent ("↳ CFP"), shared by the day-by-day rows,
 * the Ongoing run cards, and the event modal — one scale everywhere. Raw grays
 * are the documented dark-board exceptions.
 */
export const venueLine = sva({
  slots: ['name', 'parent'],
  base: {
    name: {
      color: 'gray.300',
    },
    parent: {
      _before: { content: '"↳ "' },
    },
  },
})
