import { sva } from 'styled-system/css'

export const manifesto = sva({
  slots: ['split', 'body'],
  base: {
    split: {
      layerStyle: 'sectionInner',
      display: 'grid',
      gap: '2xl',
      lg: {
        gridTemplateColumns: '0.8fr 1.2fr',
        gap: 'gridGap',
        alignItems: 'start',
      },
      xl: { gridTemplateColumns: '1fr 1fr' },
    },
    body: { maxWidth: 'measure', lg: { paddingTop: 'md' } },
  },
})
