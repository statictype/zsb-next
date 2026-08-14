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
    'partnerCtaBody',
  ],
  base: {
    eventBody: {
      maxWidth: 'measure',
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
    },

    partnerCta: {
      borderTop: 'hairline',
    },
    partnerCtaInner: {
      layerStyle: 'sectionInner',
      textAlign: 'center',
    },
    partnerCtaBody: {
      maxWidth: 'measure',
    },
  },
})
