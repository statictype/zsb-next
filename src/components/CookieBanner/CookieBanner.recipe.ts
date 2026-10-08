import { sva } from 'styled-system/css'

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
      // An open dialog sets `body { pointer-events: none }`; the banner is portalled to <body> and inherits it.
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
      pressable: 'inline',
      textDecoration: 'underline',
      textUnderlineOffset: '3px',
      textDecorationColor: 'action',
      _hover: { color: 'action' },
    },
    actions: { display: 'flex', gap: 'sm', flexShrink: 0 },
  },
})
