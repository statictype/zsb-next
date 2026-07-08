import { sva } from 'styled-system/css'

/**
 * Error boundary — co-located slot recipe.
 *
 * Full-screen centered error state on the brand-black ground, with a faint
 * SVG-noise wash + a blurred pink glow. The shared Button primitive owns both
 * actions; this recipe only owns the boundary layout and decorative chrome.
 */
export const errorPage = sva({
  slots: ['page', 'noise', 'glow', 'content', 'icon', 'title', 'message', 'actions'],
  base: {
    page: {
      position: 'relative',
      minHeight: 'svh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'black',
      overflow: 'hidden',
      paddingBlock: 'xl',
      paddingInline: 'gutter',
    },
    noise: {
      position: 'absolute',
      inset: '0',
      backgroundImage:
        "[url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")]",
      opacity: '0.04',
      pointerEvents: 'none',
      mixBlendMode: 'overlay',
    },
    glow: {
      position: 'absolute',
      width: '[500px]',
      height: '[500px]',
      borderRadius: 'circle',
      background: 'action',
      filter: '[blur(180px)]',
      opacity: '0.08',
      top: '[30%]',
      left: '[50%]',
      transform: 'translateX(-50%)',
      pointerEvents: 'none',
    },
    content: { position: 'relative', zIndex: '10', textAlign: 'center', maxWidth: '[520px]' },
    icon: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '[56px]',
      height: '[56px]',
      border: 'hairline',
      marginBottom: 'xl',
      color: 'action',
    },
    title: {
      fontFamily: 'display',
      fontSize: '2xl',
      textTransform: 'uppercase',
      letterSpacing: 'label',
      color: 'white',
      marginBottom: 'md',
      lineHeight: 'heading',
    },
    message: {
      fontFamily: 'body',
      fontSize: 'sm',
      color: 'body',
      textTransform: 'uppercase',
      letterSpacing: 'label',
      lineHeight: 'loose',
      marginBottom: '2xl',
    },
    actions: { display: 'flex', gap: 'md', justifyContent: 'center', flexWrap: 'wrap' },
  },
})
