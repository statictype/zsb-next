import { sva } from 'styled-system/css'

/**
 * FollowLinks — co-located slot recipe.
 *
 * A "Follow …" label above a row of social link buttons, shared by the
 * finished-edition recap (inline) and the ComingSoon notice (stacked). The
 * label reuses the `metaLabel` textStyle; `layout` picks the wrapper axis.
 */
export const followLinks = sva({
  slots: ['follow', 'label', 'links'],
  base: {
    follow: { display: 'flex', flexWrap: 'wrap', gap: 'md' },
    label: { textStyle: 'metaLabel' },
    links: { listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: 'md' },
  },
  variants: {
    layout: {
      // Recap: label and links on one line.
      inline: { follow: { alignItems: 'center' } },
      // ComingSoon: label stacked above the links.
      stack: { follow: { flexDirection: 'column' } },
    },
  },
  defaultVariants: { layout: 'inline' },
})
