import { sva } from 'styled-system/css'

/**
 * IsdayBadge — co-located slot recipe.
 *
 * The "Official Participant" pill is now the shared <Badge tone="dark">; this
 * recipe owns the bespoke card surface (pink-tinted gradient, hairline + card
 * shadow) and the title block. The gradient's stray hardcoded pink is normalized
 * to the brand `pink` anchor; the surface border/shadow reuse the role tokens.
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
      background:
        'linear-gradient(135deg, color-mix(in oklch, {colors.pink} 5%, transparent) 0%, color-mix(in oklch, white 90%, transparent) 40%, {colors.surfaceLight} 100%)',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'borderLight',
      boxShadow: 'card',
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
