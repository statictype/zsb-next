import { sva } from 'styled-system/css'

export const editionLoading = sva({
  slots: [
    'page',
    'bone',
    'hero',
    'heroEyebrow',
    'heroYear',
    'heroTheme',
    'section',
    'sectionTitle',
    'manifestoLine',
    'artistGrid',
    'artistCard',
    'venueItem',
    'carousel',
  ],
  base: {
    page: { minHeight: '[100vh]', background: 'black' },

    bone: { layerStyle: 'skeleton' },

    hero: {
      height: 'svh',
      minHeight: '[600px]',
      paddingInline: 'gutter',
    },
    heroEyebrow: { width: '[200px]', height: '[28px]' },
    heroYear: { width: '[320px]', height: '[100px]', md: { width: '[440px]', height: '[140px]' } },
    heroTheme: { width: '[240px]', height: '[48px]', md: { width: '[340px]', height: '[60px]' } },

    section: {
      maxWidth: 'maxWidth',
      marginInline: 'auto',
      paddingBlock: 'sectionY',
      paddingInline: 'gutter',
    },
    sectionTitle: { width: '[180px]', height: '[28px]', marginBottom: 'xl' },

    manifestoLine: {
      height: '[16px]',
      '&:nth-child(1)': { width: '[90%]' },
      '&:nth-child(2)': { width: 'full' },
      '&:nth-child(3)': { width: '[75%]' },
      '&:nth-child(4)': { width: '[85%]' },
      '&:nth-child(5)': { width: '[60%]' },
    },

    artistGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 'md',
      md: { gridTemplateColumns: 'repeat(3, 1fr)' },
      lg: { gridTemplateColumns: 'repeat(4, 1fr)' },
    },
    artistCard: { aspectRatio: '3 / 4' },

    venueItem: { height: '[80px]', borderBottom: 'hairline' },

    carousel: {
      height: {
        base: '[50vh]',
        md: '[60vh]',
        lg: '[70vh]',
        xl: '[72vh]',
        '2xl': '[75vh]',
        '4xl': '[80vh]',
      },
    },
  },
})
