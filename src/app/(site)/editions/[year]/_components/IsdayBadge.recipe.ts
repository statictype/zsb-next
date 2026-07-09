import { sva } from 'styled-system/css'

export const isdayBadge = sva({
  slots: ['card', 'inner', 'title', 'subtitle', 'pill', 'pillDot'],
  base: {
    card: { width: 'full' },
    inner: {
      position: 'relative',
      textAlign: 'center',
      height: 'full',
      paddingBlock: 'lg',
      paddingInline: 'md',
    },
    title: {
      fontFamily: 'body',
      fontWeight: 'light',
      fontSize: 'xl',
      color: 'action',
      letterSpacing: 'tight',
      lineHeight: 'heading',
    },
    subtitle: {
      fontFamily: 'body',
      fontSize: '2xs',
      textTransform: 'uppercase',
      letterSpacing: 'label',
      color: 'body',
      marginTop: 'xs',
    },
    pill: { marginTop: 'md', gap: 'sm' },
    pillDot: { width: '[6px]', height: '[6px]', background: 'highlight', borderRadius: 'circle' },
  },
})
