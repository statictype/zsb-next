import { sva } from 'styled-system/css'

export const editionLoading = sva({
  slots: [
    'page',
    'bone',
    'hero',
    'heroInner',
    'heroHead',
    'heroMast',
    'heroPlate',
    'heroLedger',
    'heroRow',
    'heroRowLabel',
    'heroRowValue',
    'section',
    'sectionTitle',
    'manifestoLine',
    'artistCard',
    'venueItem',
    'carousel',
  ],
  base: {
    page: { minHeight: '[100vh]', background: 'black' },

    bone: { layerStyle: 'skeleton' },

    hero: {
      layerStyle: 'pageHero',
      paddingInline: 'gutter',
      position: 'relative',
      minHeight: { base: '[calc(100svh - 80px)]', lg: '[calc(100svh - 120px)]' },
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
    heroInner: {
      position: 'relative',
      zIndex: '1',
      flex: '1',
      width: 'full',
      maxWidth: 'maxWidth',
      marginInline: 'auto',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '2xl',
    },
    heroHead: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 'md',
    },
    heroMast: { width: '[clamp(200px, 55vw, 420px)]', height: '[clamp(42px, 11vw, 80px)]' },
    heroPlate: {
      position: 'absolute',
      inset: '0',
      zIndex: '0',
    },
    heroLedger: {
      width: 'full',
      maxWidth: 'narrowColumn',
    },
    heroRow: {
      display: 'grid',
      gridTemplateColumns: '[64px minmax(0, 1fr)]',
      columnGap: 'md',
      alignItems: 'center',
      paddingBlock: 'sm',
      borderBottom: 'hairline',
      _last: { borderBottom: 'none' },
    },
    heroRowLabel: { height: '[10px]' },
    heroRowValue: {
      height: '[13px]',
      width: '[60%]',
      'div:nth-child(2) > &': { width: '[45%]' },
      'div:nth-child(3) > &': { width: '[18%]' },
      'div:nth-child(4) > &': { width: '[18%]' },
      'div:nth-child(5) > &': { width: '[40%]' },
    },

    section: {
      maxWidth: 'maxWidth',
      marginInline: 'auto',
      paddingBlock: 'sectionY',
      paddingInline: 'gutter',
    },
    sectionTitle: { width: '[180px]', height: '[28px]' },

    manifestoLine: {
      height: '[16px]',
      '&:nth-child(1)': { width: '[90%]' },
      '&:nth-child(2)': { width: 'full' },
      '&:nth-child(3)': { width: '[75%]' },
      '&:nth-child(4)': { width: '[85%]' },
      '&:nth-child(5)': { width: '[60%]' },
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
