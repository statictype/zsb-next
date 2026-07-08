import { sva } from 'styled-system/css'

/**
 * Footer — co-located slot recipe.
 *
 * Dark editorial footer: partner badge, Connect/Follow link register, catalogue
 * stamp, baseline meta row. Mobile-first — `base` is the mobile (centered,
 * stacked) layout and `md` is the spread desktop row.
 *
 * The links adopt the `button` text variant; the `link` slot only carries the
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
      '--partner-badge-scale': '1.4',
      md: { '--partner-badge-scale': '1.2' },
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
      flexBasis: 'full',
      textAlign: 'center',
      fontFamily: 'body',
      fontSize: '2xs',
      fontWeight: 'semibold',
      textTransform: 'uppercase',
      letterSpacing: 'wide',
      color: 'muted',
      md: { marginBottom: 'xs', flexBasis: '[auto]', textAlign: 'left' },
    },
    // Footer-link typography layered onto button.text.
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
      fontFamily: 'body',
      fontSize: '2xs',
      fontWeight: 'semibold',
      textTransform: 'uppercase',
      letterSpacing: 'wide',
      color: 'muted',
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
      fontFamily: 'body',
      fontSize: '2xs',
      textTransform: 'uppercase',
      letterSpacing: 'label',
      color: 'muted',
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
    // The text-variant button defaults to `size: md`, whose fontSize/tracking
    // would override the inherited baseline meta scale — re-assert it so the
    // legal links read at the same size as the copyright beside them.
    legalLink: { fontSize: '2xs', letterSpacing: 'label' },
  },
})
