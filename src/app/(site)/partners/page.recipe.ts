import { sva } from 'styled-system/css'

export const partnersPage = sva({
  slots: [
    'eventBody',
    'eventImage',
    'eventImageImg',
    'whySculptureTop',
    'whySculptureImage',
    'whySculptureImg',
    'partnerCta',
    'partnerCtaInner',
    'partnerCtaBadge',
    'partnerCtaHeading',
    'partnerCtaAccent',
    'partnerCtaBody',
  ],
  base: {
    eventBody: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'md',
      maxWidth: 'measure',
      marginBottom: '2xl',
      '& p': {
        textStyle: 'prose',
      },
    },
    eventImage: {
      position: 'relative',
      overflow: 'hidden',
      aspectRatio: '16 / 9',
      border: 'hairline',
    },
    eventImageImg: {
      layerStyle: 'coverMono',
      background: 'gray.900',
    },

    whySculptureTop: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '2xl',
      marginBottom: '3xl',
      lg: { gridTemplateColumns: '1fr 1fr', gap: '3xl', alignItems: 'end' },
    },
    whySculptureImage: {
      position: 'relative',
      overflow: 'hidden',
      aspectRatio: '16 / 10',
      border: 'hairline',
    },
    whySculptureImg: {
      layerStyle: 'coverMono',
      background: 'gray.200',
      filter: '[grayscale(100%)]',
    },

    // Dark ground + rhythm from `section({ ground: 'dark' })` in the component;
    // `partnerCtaInner` is the rail.
    partnerCta: {
      borderTop: 'hairline',
    },
    partnerCtaInner: {
      layerStyle: 'sectionInner',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    },
    partnerCtaBadge: { marginBottom: '2xl' },
    partnerCtaHeading: {
      fontFamily: 'display',
      fontSize: '5xl',
      color: 'white',
      lineHeight: 'display',
      marginBottom: 'lg',
    },
    partnerCtaAccent: { color: 'action' },
    partnerCtaBody: {
      fontSize: 'base',
      lineHeight: 'body',
      fontWeight: 'light',
      color: 'body',
      maxWidth: 'measure',
      marginBottom: '2xl',
    },
  },
})
