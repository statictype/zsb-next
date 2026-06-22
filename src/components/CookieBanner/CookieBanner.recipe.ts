import { sva } from 'styled-system/css'

/**
 * CookieBanner — co-located slot recipe.
 *
 * Fixed, non-modal consent region pinned to the bottom rail. Visitors can keep
 * navigating while it is present. The Reject/Accept actions use the shared
 * `<Button>` primitive, so only the shell layout lives here. The entrance
 * composes the shared snappy entrance animation style on the banner element.
 */
export const cookieBanner = sva({
  slots: ['banner', 'inner', 'copy', 'title', 'text', 'link', 'actions'],
  base: {
    banner: {
      position: 'fixed',
      left: 'gutter',
      right: 'gutter',
      bottom: 'md',
      zIndex: 'banner',
      background: 'surface',
      color: 'heading',
      border: 'hairline',
      boxShadow: 'modal',
      fontFamily: 'body',
    },
    inner: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'md',
      paddingBlock: 'md',
      paddingInline: 'lg',
      maxWidth: 'maxWidth',
      marginInline: 'auto',
      md: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'xl',
      },
    },
    copy: { display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 },
    title: {
      fontFamily: 'display',
      fontSize: 'sm',
      color: 'heading',
      letterSpacing: '-0.2px',
    },
    text: {
      fontSize: 'xs',
      lineHeight: 'body',
      color: 'body',
      margin: 0,
    },
    link: {
      color: 'heading',
      textDecoration: 'underline',
      textUnderlineOffset: '3px',
      textDecorationColor: 'action',
      _hover: { color: 'action' },
    },
    actions: { display: 'flex', gap: 'sm', flexShrink: 0 },
  },
})
