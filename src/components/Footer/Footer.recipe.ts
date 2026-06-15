import { sva } from 'styled-system/css'

/**
 * Footer — co-located slot recipe.
 *
 * Dark editorial footer: partner badge, Connect/Follow link register, catalogue
 * stamp, baseline meta row. Mobile-first — `base` is the mobile (centered,
 * stacked) layout and `md` is the spread desktop row.
 *
 * The links themselves adopt the `<TextLink>` primitive (nav links → `draw`,
 * the Privacy Policy link → `quiet`); the `link` slot only carries the footer's
 * typographic treatment layered on top of the draw variant.
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
  ],
  base: {
    footer: {
      background: 'blackPure',
      color: 'white',
      paddingBlock: 'xl',
      paddingInline: 'content',
      md: {
        paddingBlock: '2xl',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'divider',
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
      margin: 0,
      marginBottom: 0,
      flexBasis: '100%',
      textAlign: 'center',
      fontFamily: 'body',
      fontSize: '2xs',
      fontWeight: 'semibold',
      textTransform: 'uppercase',
      letterSpacing: 'wide',
      color: 'muted',
      md: { marginBottom: 'xs', flexBasis: 'auto', textAlign: 'left' },
    },
    // Footer-link typography layered onto the TextLink `draw` variant.
    link: {
      width: 'fit-content',
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
      color: 'gray.500',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'divider',
      padding: '9px 13px',
      marginTop: 'lg',
      md: { marginLeft: 'auto', marginTop: '0' },
    },

    baseline: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'md',
      paddingTop: 'lg',
      borderTopWidth: '1px',
      borderTopStyle: 'solid',
      borderTopColor: 'divider',
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
  },
})
