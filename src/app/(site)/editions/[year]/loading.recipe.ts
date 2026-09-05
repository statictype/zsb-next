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

    hero: { layerStyle: 'pageHero', paddingInline: 'gutter' },
    heroInner: {
      maxWidth: 'maxWidth',
      marginInline: 'auto',
      display: 'grid',
      gridTemplateColumns: '[minmax(0, 1fr)]',
      gridTemplateAreas: '"head" "plate" "ledger"',
      rowGap: 'xl',
      columnGap: 'gridGap',
      lg: {
        gridTemplateColumns: '[minmax(0, 1fr) minmax(0, 1fr)]',
        gridTemplateRows: '[auto 1fr]',
        gridTemplateAreas: '"head plate" "ledger plate"',
      },
    },
    heroHead: {
      gridArea: 'head',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 'md',
    },
    heroMast: { width: '[clamp(200px, 55vw, 420px)]', height: '[clamp(42px, 11vw, 80px)]' },
    heroPlate: {
      gridArea: 'plate',
      aspectRatio: { base: '1 / 1', md: '16 / 9', lg: '3 / 2' },
      lg: { alignSelf: 'center' },
    },
    heroLedger: {
      gridArea: 'ledger',
      width: 'full',
      borderTop: 'hairline',
      lg: { alignSelf: 'end' },
    },
    heroRow: {
      display: 'grid',
      gridTemplateColumns: '[64px minmax(0, 1fr)]',
      columnGap: 'md',
      alignItems: 'center',
      paddingBlock: 'sm',
      borderBottom: 'hairline',
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
