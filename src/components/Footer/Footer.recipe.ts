import { sva } from 'styled-system/css'

export const footer = sva({
  slots: ['footer', 'inner', 'badge', 'navCol', 'colTitle', 'link', 'stamp', 'baseline'],
  base: {
    footer: {
      background: 'surface',
      paddingBlock: 'xl',
      md: {
        paddingBlock: '2xl',
      },
    },
    inner: {
      layerStyle: 'sectionInner',
    },
    badge: {
      flexShrink: 0,
    },

    navCol: {
      md: {
        flexDirection: 'column',
        flexWrap: 'nowrap',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        gap: 'sm',
      },
    },
    colTitle: {
      width: '100%',
      textAlign: 'center',
      md: { width: 'fit-content', textAlign: 'left' },
    },
    link: {
      pressable: 'inline',
      width: 'fit-content',
    },

    stamp: {
      flexShrink: 0,
      border: 'hairline',
      paddingBlock: 'sm',
      paddingInline: 'md',
      md: { marginLeft: 'auto' },
    },

    baseline: {
      textAlign: 'center',
      md: { textAlign: 'left' },
    },
  },
})
