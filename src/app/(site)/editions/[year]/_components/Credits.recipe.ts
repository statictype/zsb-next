import { sva } from 'styled-system/css'

/**
 * Credits — co-located slot recipe.
 *
 * Four-tier credit roster (primary grid + partners + secondary) on a white
 * section. Reuses the `section`/`sectionInner` foundation; the tiered grids and
 * the partner-name middot separators are the bespoke part. The shared label
 * treatment is factored to `labelBase` and spread into each tier's label slot
 * (partners recolors to `action`).
 */
const labelBase = {
  fontSize: 'xs',
  textTransform: 'uppercase',
  letterSpacing: 'wide',
  color: 'muted',
} as const

export const credits = sva({
  slots: [
    'container',
    'primary',
    'block',
    'label',
    'name',
    'detail',
    'logo',
    'badge',
    'partners',
    'partnersBlock',
    'partnersLabel',
    'partnersList',
    'secondary',
    'inline',
    'inlineLabel',
    'inlineNames',
  ],
  base: {
    container: { layerStyle: 'sectionInner' },

    label: labelBase,

    // Primary tier — 1 → 2 → 4 column grid.
    primary: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'lg',
      md: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        columnGap: 'lg',
        rowGap: 'xl',
      },
      xl: { gridTemplateColumns: 'repeat(4, 1fr)' },
    },
    block: { display: 'flex', flexDirection: 'column', gap: 'sm' },
    name: {
      fontFamily: 'display',
      fontSize: 'md',
      color: 'heading',
      textTransform: 'uppercase',
      lineHeight: 'tight',
    },
    detail: {
      fontFamily: 'body',
      fontWeight: 'regular',
      fontSize: 'sm',
      color: 'muted',
      lineHeight: 'body',
      // Authored multi-line strings render their own '\n' breaks.
      whiteSpace: 'pre-line',
    },
    logo: {
      height: '44px',
      width: 'auto',
      objectFit: 'contain',
      filter: 'grayscale(100%)',
      opacity: 0.8,
      transition: 'all {durations.medium} {easings.quint}',
      md: { height: '60px' },
      _hover: { filter: 'grayscale(0%)', opacity: 1 },
    },
    // ISDay badge fills the 4th column of the primary row from 1280 up.
    badge: { xl: { gridColumn: 4 } },

    // Partners + secondary share one 4-column track so their grid lines align,
    // each separated from the band above by a hairline.
    partners: {
      marginTop: 'lg',
      paddingTop: 'lg',
      borderTop: 'hairline',
      display: 'flex',
      flexDirection: 'column',
      gap: 'lg',
      md: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        columnGap: 'lg',
        rowGap: 'lg',
      },
    },
    secondary: {
      marginTop: 'lg',
      paddingTop: 'lg',
      borderTop: 'hairline',
      display: 'flex',
      flexDirection: 'column',
      gap: 'lg',
      md: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        columnGap: 'lg',
        rowGap: 'lg',
      },
    },

    partnersBlock: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'sm',
      md: { gridColumn: 'span 2' },
    },
    partnersLabel: { ...labelBase, color: 'action' },
    partnersList: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      rowGap: 'xs',
      fontFamily: 'body',
      fontWeight: 'regular',
      fontSize: 'sm',
      color: 'body',
      lineHeight: 'tight',
      '& span': {
        display: 'inline-flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
      },
      // Middot separators between partner names.
      '& span:not(:last-child)::after': {
        content: '""',
        flex: 'none',
        width: '3px',
        height: '3px',
        marginInline: 'sm',
        borderRadius: '50%',
        background: 'action',
      },
    },

    inline: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'sm',
      md: { gridColumn: 'span 2' },
      lg: { gridColumn: 'span 1' },
    },
    inlineLabel: labelBase,
    inlineNames: {
      fontFamily: 'body',
      fontSize: 'sm',
      color: 'muted',
      lineHeight: 'body',
      // Authored multi-line strings render their own '\n' breaks.
      whiteSpace: 'pre-line',
    },
  },
})
