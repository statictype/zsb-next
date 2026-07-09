import { sva } from 'styled-system/css'

export const partnersPage = sva({
  slots: [
    'eventBody',
    'eventImage',
    'eventImageImg',
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

    partnerCta: {
      borderTop: 'hairline',
    },
    partnerCtaInner: {
      layerStyle: 'sectionInner',
      textAlign: 'center',
    },
    partnerCtaBadge: { marginBottom: '2xl' },
    partnerCtaHeading: {
      fontFamily: 'display',
      fontSize: 'xl',
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
