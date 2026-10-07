import { sva } from 'styled-system/css'

export const partnersPage = sva({
  slots: [
    'topPlate',
    'topPlateImg',
    'plateImg',
    'eventSpread',
    'eventHeading',
    'eventBody',
    'plates',
    'plate',
    'plateTab',
    'plateBody',
    'platePhoto',
    'plateText',
    'partnerCta',
    'partnerCtaInner',
    'partnerCtaBody',
  ],
  base: {
    topPlate: {
      position: 'relative',
      overflow: 'hidden',
      aspectRatio: { base: '1 / 1', md: '2 / 1' },
      marginBottom: '2xl',
      border: 'hairline',
      background: 'gray.900',
    },
    topPlateImg: {
      objectPosition: { base: 'right center', md: 'center' },
    },
    plateImg: {
      layerStyle: 'coverMono',
    },
    eventSpread: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr)',
      rowGap: 'lg',
      lg: {
        gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
        columnGap: 'xl',
      },
    },
    eventHeading: {
      lg: { gridColumn: '1 / span 5' },
    },
    eventBody: {
      maxWidth: 'measure',
      lg: { gridColumn: '7 / -1' },
    },

    plates: {
      '--tab-h': 'clamp(56px, 37.71px + 1.7857vw, 72px)',
      listStyle: 'none',
      margin: '0',
      padding: '0',
      lg: { display: 'flex', flexDirection: 'column' },
    },
    plate: {
      background: 'surface',
      borderTop: 'hairline',
      '&:last-child': { borderBottom: 'hairline' },
      lg: {
        position: 'sticky',
        top: 'calc(token(sizes.nav) + var(--plate-index) * var(--tab-h))',
        marginBottom: 'calc(var(--plate-rest) * var(--tab-h))',
        '& + &': { marginTop: 'calc((var(--plate-rest) + 1) * var(--tab-h) * -1)' },
      },
    },
    plateTab: {
      paddingBlock: 'md',
      lg: {
        display: 'flex',
        alignItems: 'center',
        height: 'var(--tab-h)',
        paddingBlock: '0',
        whiteSpace: 'nowrap',
      },
    },
    plateBody: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr)',
      rowGap: 'md',
      paddingBottom: 'xl',
      lg: {
        gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
        columnGap: 'xl',
        paddingBottom: 'lg',
      },
    },
    platePhoto: {
      position: 'relative',
      overflow: 'hidden',
      aspectRatio: '3 / 2',
      border: 'hairline',
      background: 'gray.200',
      lg: { gridColumn: '1 / span 6' },
    },
    plateText: {
      maxWidth: 'measure',
      lg: { gridColumn: '8 / -1' },
    },

    partnerCta: {
      borderTop: 'hairline',
    },
    partnerCtaInner: {
      layerStyle: 'sectionInner',
      textAlign: 'center',
    },
    partnerCtaBody: {
      maxWidth: 'narrowColumn',
    },
  },
})
