import { sva } from 'styled-system/css'

/**
 * VenueLine — co-located slot recipe.
 *
 * The venue name + its rolled-up parent ("↳ CFP"), shared by the agenda rows,
 * the Ongoing run cards, and the event modal. `size` scales the line for the
 * modal's roomier body; the name/parent treatment is fixed. Raw grays are the
 * documented dark-board exceptions.
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
  variants: {
    // `sm` — the compact board list; `md` — the roomier modal body.
    size: {
      sm: {},
      md: {},
    },
  },
  defaultVariants: { size: 'sm' },
})
