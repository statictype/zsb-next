import { sva } from 'styled-system/css'

/**
 * StripControls — co-located slot recipe.
 *
 * The header row shared by every scroll-snap strip: an eyebrow + prev/next
 * arrows. The arrows themselves adopt the `<IconButton>` primitive (tone
 * `default` = white→action, disabled via the recipe's opacity), so only the
 * row layout lives here. Per-strip placement (top margin) still merges in via
 * the `className` prop.
 */
export const stripControls = sva({
  slots: ['controls', 'arrows'],
  base: {
    controls: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'md',
      maxWidth: 'maxWidth',
      marginInline: 'auto',
      marginBottom: 'lg',
    },
    arrows: { display: 'flex', gap: 'sm' },
  },
})
