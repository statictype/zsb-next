import { sva } from 'styled-system/css'

/**
 * IsdayBadge — co-located slot recipe.
 *
 * The "Official Participant" pill is now the shared <Badge tone="dark">; this
 * recipe owns the seal layout and title block. The shared <Card ground="onLight">
 * owns the surface chrome and ground.
 */
export const isdayBadge = sva({
  slots: ['card', 'inner', 'title', 'subtitle', 'pill', 'pillDot'],
  base: {
    card: { width: '100%' },
    inner: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      height: '100%',
      paddingBlock: 'lg',
      paddingInline: 'md',
    },
    title: {
      fontFamily: 'body',
      fontWeight: 'light',
      fontSize: 'xl',
      color: 'action',
      letterSpacing: '-0.5px',
      lineHeight: 'heading',
    },
    subtitle: {
      fontFamily: 'body',
      fontSize: '2xs',
      textTransform: 'uppercase',
      letterSpacing: 'label',
      color: 'bodyLight',
      marginTop: 'xs',
    },
    // Tweaks layered onto <Badge tone="dark"> via className.
    pill: { marginTop: 'md', gap: '6px' },
    pillDot: { width: '6px', height: '6px', background: 'highlight', borderRadius: 'circle' },
  },
})
