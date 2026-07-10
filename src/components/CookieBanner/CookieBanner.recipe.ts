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
  slots: ['banner', 'inner', 'copy', 'link', 'actions'],
  base: {
    banner: {
      position: 'fixed',
      left: 'gutter',
      right: 'gutter',
      bottom: 'md',
      zIndex: 'banner',
      background: 'surface',
      border: 'hairline',
      boxShadow: 'modal',
      // A dialog's modal machine sets `body { pointer-events: none }` while
      // open (everything not part of that dialog's own layer). The banner is
      // a global fixture portalled straight to <body>, so it inherits that
      // and becomes unclickable behind any dialog unless reasserted here.
      pointerEvents: 'auto',
    },
    inner: {
      paddingBlock: 'md',
      paddingInline: 'lg',
      maxWidth: 'maxWidth',
      marginInline: 'auto',
    },
    copy: { minWidth: '0' },
    link: {
      textDecoration: 'underline',
      textUnderlineOffset: '3px',
      textDecorationColor: 'action',
      _hover: { color: 'action' },
    },
    actions: { display: 'flex', gap: 'sm', flexShrink: 0 },
  },
})
