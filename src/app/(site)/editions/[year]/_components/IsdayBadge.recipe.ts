import { sva } from 'styled-system/css'

/**
 * IsdayBadge — co-located slot recipe.
 *
 * The "Official Participant" pill is now the shared <Badge tone="outline">; this
 * recipe owns the seal layout and title block. The shared <Card ground="onLight">
 * owns the surface chrome and ground.
 */
export const isdayBadge = sva({
  slots: ['card', 'inner', 'title', 'subtitle', 'pill', 'pillDot'],
  base: {
    card: { width: 'full' },
    inner: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
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
    // Tweaks layered onto <Badge tone="outline"> via className.
    pill: { marginTop: 'md', gap: 'sm' },
    pillDot: { width: '[6px]', height: '[6px]', background: 'highlight', borderRadius: 'circle' },
  },
})
