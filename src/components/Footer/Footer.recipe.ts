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
  slots: [
    'footer',
    'inner',
    'badge',
    'navCol',
    'colTitle',
    'link',
    'stamp',
    'baseline',
    'copyright',
    'legalLink',
  ],
  base: {
    footer: {
      background: 'surface',
      color: 'heading',
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
      textStyle: 'footerMeta',
      letterSpacing: 'wide',
      md: { marginBottom: 'xs', width: 'fit', textAlign: 'left' },
    },
    // Footer-link typography layered onto the Button link variant.
    link: {
      width: 'fit',
      fontFamily: 'body',
      fontSize: 'sm',
      fontWeight: 'medium',
      textTransform: 'uppercase',
      letterSpacing: 'label',
      color: 'body',
    },

    stamp: {
      flexShrink: 0,
      textStyle: 'footerMeta',
      letterSpacing: 'wide',
      border: 'hairline',
      paddingBlock: 'sm',
      paddingInline: 'md',
      marginTop: 'lg',
      md: { marginLeft: 'auto', marginTop: '0' },
    },

    baseline: {
      paddingTop: 'lg',
      textStyle: 'footerMeta',
      letterSpacing: 'label',
      textAlign: 'center',
      md: { textAlign: 'left' },
    },
    copyright: { color: 'muted' },
    legalLink: { textStyle: 'footerMeta', letterSpacing: 'label' },
  },
})
