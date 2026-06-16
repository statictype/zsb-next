import { sva } from 'styled-system/css'

/**
 * ExternalGallery — co-located slot recipe.
 *
 * Archive-link section for editions whose archive lives off-site (the 2021
 * online edition), built on the unified hairline Card (the `card()` recipe owns
 * the chrome + accent-warming hover; this adds the card's max-width/centering
 * and the inner grid). Text left, a quiet edition plate right on `lg`. The CTA
 * icon warms + nudges on card hover/focus via an ancestor selector. The `.tag`
 * pill is adopted as `<Badge>` in the component.
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
    'ctaIcon',
    'ctaUrl',
    'cardRight',
    'plateMonogram',
    'plateZsb',
    'plateYear',
    'plateMeta',
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
    // Hairline icon square; on card hover/focus it warms to the accent + nudges.
    ctaIcon: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '36px',
      height: '36px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'borderDark',
      color: 'action',
      transition:
        'border-color {durations.medium} {easings.expo}, transform {durations.medium} {easings.expo}',
      'a:hover &, a:focus-visible &': {
        borderColor: 'action',
        transform: 'translate(3px, -3px)',
      },
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
    plateMonogram: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      fontFamily: 'display',
      lineHeight: '1',
      textTransform: 'uppercase',
    },
    plateZsb: { fontSize: 'clamp(56px, 7vw, 104px)', letterSpacing: '-2px', color: 'white' },
    plateYear: { fontSize: 'clamp(36px, 4.5vw, 64px)', letterSpacing: '-1px', color: 'action' },
    plateMeta: {
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
})
