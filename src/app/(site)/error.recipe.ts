import { sva } from 'styled-system/css'

export const errorPage = sva({
  slots: ['page', 'noise', 'glow', 'content', 'icon', 'actions'],
  base: {
    page: {
      position: 'relative',
      minHeight: 'svh',
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
    content: { position: 'relative', zIndex: '10', textAlign: 'center', maxWidth: 'narrowColumn' },
    icon: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '[56px]',
      height: '[56px]',
      border: 'hairline',
      color: 'action',
    },
    actions: { display: 'flex', gap: 'md', justifyContent: 'center', flexWrap: 'wrap' },
  },
})
