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
    'primary',
    'cols',
    'badge',
    'navCol',
    'colTitle',
    'link',
    'stamp',
    'baseline',
    'copyright',
    'legal',
    'legalLink',
  ],
  base: {
    footer: {
      background: 'surface',
      color: 'heading',
      paddingBlock: 'xl',
      md: {
        paddingBlock: '2xl',
        borderTop: 'hairline',
      },
    },
    inner: {
      layerStyle: 'sectionInner',
      display: 'flex',
      flexDirection: 'column',
      gap: 'xl',
    },

    primary: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'lg',
      md: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        rowGap: 'xl',
        columnGap: '2xl',
      },
    },
    cols: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'lg',
      alignSelf: 'stretch',
      md: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: '2xl',
        alignSelf: 'auto',
      },
    },
    badge: {
      flexShrink: 0,
    },

    navCol: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'baseline',
      justifyContent: 'center',
      rowGap: 'sm',
      columnGap: 'md',
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
      display: 'flex',
      flexDirection: 'column',
      gap: 'md',
      paddingTop: 'lg',
      borderTop: 'hairline',
      textStyle: 'footerMeta',
      letterSpacing: 'label',
      alignItems: 'center',
      textAlign: 'center',
      md: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        textAlign: 'left',
      },
    },
    copyright: { color: 'muted' },
    legal: { display: 'flex', gap: 'lg' },
    legalLink: { textStyle: 'footerMeta', letterSpacing: 'label' },
  },
})
