import { sva } from 'styled-system/css'

export const externalGallery = sva({
  slots: [
    'section',
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

    header: {
      maxWidth: 'maxWidth',
      marginInline: 'auto',
      marginBottom: 'xl',
    },
    count: {
      fontFamily: 'body',
      fontSize: 'sm',
      color: 'muted',
      textTransform: 'uppercase',
      letterSpacing: 'label',
    },

    card: {
      maxWidth: 'maxWidth',
      marginInline: 'auto',
      _focusVisible: { outline: 'focus', outlineOffset: 'xs' },
    },
    cardInner: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      lg: { gridTemplateColumns: '1.4fr 1fr' },
    },

    cardLeft: {
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
      maxWidth: 'measure',
    },

    cta: {
      marginTop: 'md',
      paddingTop: 'lg',
      borderTop: 'hairline',
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
      letterSpacing: 'subtle',
      color: 'muted',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: 'full',
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
        minHeight: '[420px]',
        padding: '2xl',
        borderLeft: 'hairline',
        // Barely-there lift for the plate panel.
        background: '[rgb(255 255 255 / 0.015)]',
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
        gap: 'xs',
        fontFamily: 'display',
        lineHeight: 'display',
        textTransform: 'uppercase',
      },
      '& [data-part="zsb"]': {
        fontSize: '[clamp(56px, 7vw, 104px)]',
        letterSpacing: '[-2px]',
        color: 'white',
      },
      '& [data-part="year"]': {
        fontSize: '[clamp(36px, 4.5vw, 64px)]',
        letterSpacing: '[-1px]',
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
