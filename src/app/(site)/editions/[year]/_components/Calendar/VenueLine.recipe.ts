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
  slots: ['venue', 'name', 'parent'],
  base: {
    venue: {
      fontFamily: 'body',
    },
    name: {
      color: 'gray.300',
      textTransform: 'uppercase',
      letterSpacing: 'subtle',
      fontWeight: 'medium',
    },
    parent: {
      color: 'muted',
      textTransform: 'uppercase',
      letterSpacing: 'label',
      fontSize: '2xs',
      _before: { content: '"↳ "' },
    },
  },
  variants: {
    // `sm` — the compact board list; `md` — the roomier modal body.
    size: {
      sm: { venue: { fontSize: 'xs' } },
      md: { venue: { fontSize: 'sm' } },
    },
  },
  defaultVariants: { size: 'sm' },
})
