import { sva } from 'styled-system/css'

/**
 * ExternalGallery — co-located slot recipe.
 *
 * Archive-link section for editions whose archive lives off-site (the 2021
 * online edition), built on the unified hairline Card (the `card()` recipe owns
 * the chrome + accent-warming hover; this adds the card's max-width/centering
 * and the inner grid). Text left, a quiet edition plate right on `lg`. The CTA
 * icon uses `<Button variant="icon">`; the `.tag` pill uses `<Badge>`.
 */
export const externalGallery = sva({
  slots: [
    'section',
    'inner',
    'header',
    'count',
    'card',
    'cardInner',
    'cardLeft',
    'titleHighlight',
    'description',
    'cta',
    'ctaLabel',
    'ctaUrl',
    'cardRight',
    'plate',
  ],
  base: {
    section: {
      // ground + rhythm come from `section({ ground: 'dark' })` in the component.
      position: 'relative',
    },
    inner: { layerStyle: 'sectionInner' },

    header: {
      maxWidth: 'maxWidth',
      marginInline: 'auto',
      marginBottom: 'xl',
      display: 'flex',
      flexDirection: 'column',
      gap: 'md',
      md: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    },
    count: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontFamily: 'body',
      fontSize: 'sm',
      color: 'muted',
      textTransform: 'uppercase',
      letterSpacing: 'label',
      _before: { content: '""', width: '40px', height: '1px', background: 'borderDark' },
    },

    card: {
      maxWidth: 'maxWidth',
      marginInline: 'auto',
      _focusVisible: { outline: '2px solid token(colors.action)', outlineOffset: '2px' },
    },
    cardInner: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      lg: { gridTemplateColumns: '1.4fr 1fr' },
    },

    cardLeft: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'md',
      paddingBlock: 'xl',
      paddingInline: 'lg',
      md: { padding: '2xl' },
      lg: { paddingBlock: '3xl', paddingInline: '2xl', gap: 'lg' },
    },
    titleHighlight: { color: 'highlight' },
    description: {
      fontFamily: 'body',
      fontSize: 'base',
      lineHeight: 'body',
      color: 'body',
      maxWidth: '50ch',
      margin: '0',
    },

    cta: {
      display: 'flex',
      alignItems: 'center',
      gap: 'md',
      marginTop: 'md',
      paddingTop: 'lg',
      borderTopWidth: '1px',
      borderTopStyle: 'solid',
      borderTopColor: 'borderDark',
    },
    ctaLabel: {
      fontFamily: 'body',
      fontSize: 'xs',
      textTransform: 'uppercase',
      letterSpacing: 'wide',
      color: 'white',
      fontWeight: 'semibold',
    },
    ctaUrl: {
      marginLeft: 'auto',
      fontFamily: 'body',
      fontSize: '2xs',
      textTransform: 'lowercase',
      letterSpacing: '0.5px',
      color: 'muted',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '100%',
      '@media (max-width: 540px)': { display: 'none' },
    },

    // Quiet edition plate — solid type on a hairline panel, desktop only.
    cardRight: {
      display: 'none',
      lg: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '420px',
        padding: '2xl',
        borderLeftWidth: '1px',
        borderLeftStyle: 'solid',
        borderLeftColor: 'borderDark',
        background: 'rgb(255 255 255 / 0.015)',
      },
    },
    plate: {
      position: 'absolute',
      inset: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '& [data-part="monogram"]': {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        fontFamily: 'display',
        lineHeight: '1',
        textTransform: 'uppercase',
      },
      '& [data-part="zsb"]': {
        fontSize: 'clamp(56px, 7vw, 104px)',
        letterSpacing: '-2px',
        color: 'white',
      },
      '& [data-part="year"]': {
        fontSize: 'clamp(36px, 4.5vw, 64px)',
        letterSpacing: '-1px',
        color: 'action',
      },
      '& [data-part="meta"]': {
        position: 'absolute',
        bottom: 'md',
        left: 'md',
        right: 'md',
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: 'body',
        fontSize: '2xs',
        textTransform: 'uppercase',
        letterSpacing: 'wide',
        color: 'muted',
      },
    },
  },
})
