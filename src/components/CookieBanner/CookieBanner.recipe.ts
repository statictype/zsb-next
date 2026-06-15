import { sva } from 'styled-system/css'

/**
 * CookieBanner — co-located slot recipe.
 *
 * Fixed consent dialog pinned to the bottom rail. The Reject/Accept actions are
 * now the shared `<Button>` primitive (ghost / solid), so only the shell layout
 * lives here. The bespoke entrance reuses the shared `fadeSlideUp` keyframe
 * rather than porting the near-identical legacy `slideUp`.
 */
export const cookieBanner = sva({
  slots: ['banner', 'inner', 'copy', 'title', 'text', 'link', 'actions'],
  base: {
    banner: {
      position: 'fixed',
      left: 'content',
      right: 'content',
      bottom: 'md',
      zIndex: 100,
      background: 'canvas',
      color: 'heading',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'divider',
      borderRadius: '2px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.45)',
      fontFamily: 'body',
      animationName: 'fadeSlideUp',
      animationDuration: '280ms',
      animationTimingFunction: 'expo',
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
