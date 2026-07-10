import { sva } from 'styled-system/css'

/**
 * Footer — co-located slot recipe.
 *
 * Dark editorial footer: partner badge, Connect/Follow link register, catalogue
 * stamp, baseline meta row. Mobile-first — `base` is the mobile (centered,
 * stacked) layout and `md` is the spread desktop row.
 *
 * The links adopt the `Button` link variant; the `link` slot only carries the
 * footer's typographic treatment layered on top.
 */
export const footer = sva({
  slots: ['footer', 'inner', 'badge', 'navCol', 'colTitle', 'link', 'stamp', 'baseline'],
  base: {
    footer: {
      background: 'surface',
      paddingBlock: 'xl',
      md: {
        paddingBlock: '2xl',
      },
    },
    inner: {
      layerStyle: 'sectionInner',
    },
    badge: {
      flexShrink: 0,
    },

    navCol: {
      md: {
        flexDirection: 'column',
        flexWrap: 'nowrap',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        gap: 'sm',
      },
    },
    colTitle: {
      width: 'full',
      textAlign: 'center',
      md: { width: 'fit', textAlign: 'left' },
    },
    // Footer-link typography layered onto the Button link variant.
    link: {
      width: 'fit',
    },

    stamp: {
      flexShrink: 0,
      border: 'hairline',
      paddingBlock: 'sm',
      paddingInline: 'md',
      md: { marginLeft: 'auto' },
    },

    baseline: {
      textAlign: 'center',
      md: { textAlign: 'left' },
    },
  },
})
