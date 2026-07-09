import { sva } from 'styled-system/css'

/**
 * FollowLinks — co-located slot recipe.
 *
 * A "Follow …" label above a row of social link buttons, shared by the
 * finished-edition recap (inline) and the ComingSoon notice (stacked). The
 * `layout` picks the wrapper axis.
 */
export const followLinks = sva({
  slots: ['label'],
  base: {
    label: {},
  },
})
