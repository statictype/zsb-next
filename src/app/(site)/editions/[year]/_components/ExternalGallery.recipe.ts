import { sva } from 'styled-system/css'

export const externalGallery = sva({
  slots: [
    'section',
    'header',
    'count',
    'card',
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
      color: 'muted',
    },

    card: {
      maxWidth: 'maxWidth',
      marginInline: 'auto',
    },
    cardLeft: {
      paddingBlock: 'xl',
      paddingInline: 'lg',
      md: { padding: '2xl' },
      lg: { paddingBlock: '3xl', paddingInline: '2xl', gap: 'lg' },
    },
    titleHighlight: { color: 'highlight' },
    description: {
      color: 'body',
      maxWidth: 'measure',
    },

    cta: {
      paddingTop: 'lg',
    },
    ctaLabel: {
      color: 'white',
    },
    ctaUrl: {
      marginLeft: 'auto',
      fontFamily: 'body',
      fontSize: 'xs',
      textTransform: 'lowercase',
      letterSpacing: 'subtle',
      color: 'muted',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: 'full',
      '@media (max-width: 540px)': { display: 'none' },
    },

    cardRight: {
      lg: {
        position: 'relative',
        minHeight: '[420px]',
        padding: '2xl',
        borderLeft: 'hairline',
        background: '[rgb(255 255 255 / 0.015)]',
      },
    },
    plate: {
      position: 'absolute',
      inset: '0',
      '& [data-part="monogram"]': {
        textStyle: 'externalGallery.plateType.monogram',
      },
      '& [data-part="zsb"]': {
        textStyle: 'externalGallery.plateType.zsb',
        color: 'white',
      },
      '& [data-part="year"]': {
        textStyle: 'externalGallery.plateType.year',
        color: 'action',
      },
      '& [data-part="meta"]': {
        position: 'absolute',
        bottom: 'md',
        left: 'md',
        right: 'md',
        display: 'flex',
        justifyContent: 'space-between',
        color: 'muted',
      },
    },
  },
})
