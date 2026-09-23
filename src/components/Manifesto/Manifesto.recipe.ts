import { sva } from 'styled-system/css'

export const manifesto = sva({
  slots: ['split', 'title', 'body'],
  base: {
    split: {
      layerStyle: 'sectionInner',
      display: 'grid',
      gap: '2xl',
      lg: {
        containerType: 'inline-size',
        gridTemplateColumns: 'auto minmax(0, 1fr)',
        gap: 'md',
        alignItems: 'start',
      },
      '2xl': { gap: 'xl' },
    },
    title: {
      lg: {
        width: '[10em]',
        fontSize: '[clamp(48px, 5cqi, token(fontSizes.3xl))]',
      },
    },
    body: { maxWidth: 'measure', lg: { paddingTop: 'md' } },
  },
})
