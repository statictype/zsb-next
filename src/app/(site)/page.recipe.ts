import { sva } from 'styled-system/css'

export const homePage = sva({
  slots: [
    'panel',
    'hero',
    'heroInner',
    'heroVisual',
    'heroPanel',
    'heroTitle',
    'heroBadge',
    'editionsHead',
    'editionsSubtext',
    'editionList',
    'upcomingInner',
    'upcomingLead',
    'upcomingEyebrow',
    'lastEdition',
    'lastEditionMedia',
  ],
  base: {
    panel: { width: 'full', scrollMarginTop: '[token(sizes.nav)]' },
    hero: {
      layerStyle: 'pageHero',
      position: 'relative',
      width: 'full',
      paddingInline: 'gutter',
      overflow: 'hidden',
      minHeight: 'svh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
    },
    heroInner: {
      position: 'relative',
      maxWidth: 'maxWidth',
      marginInline: 'auto',
      width: 'full',
    },
    heroVisual: {
      order: '2',
      position: 'relative',
      width: 'full',
      lg: { gridColumn: '1 / -1', gridRow: '2' },
    },
    heroPanel: {
      order: '1',
      position: 'relative',
      minWidth: '0',
      lg: { gridColumn: '1', gridRow: '1' },
    },
    // min-content forces "Bucharest / Sculpture / Days" to wrap on whitespace.
    heroTitle: {
      animationStyle: 'enter',
      animationDelay: 'fast',
      width: '[min-content]',
    },

    heroBadge: {
      order: '3',
      alignSelf: 'center',
      zIndex: '10',
      lg: {
        gridColumn: '2',
        gridRow: '1',
        justifySelf: 'end',
        alignSelf: 'start',
      },
    },
    editionsHead: {
      layerStyle: 'sectionInner',
      width: 'full',
    },
    editionsSubtext: {
      maxWidth: 'measure',
    },
    editionList: {
      layerStyle: 'sectionInner',
      borderBottom: 'hairline',
      width: 'full',
    },
    upcomingInner: {
      position: 'relative',
      maxWidth: 'maxWidth',
      marginInline: 'auto',
      width: 'full',
    },
    upcomingLead: {
      alignItems: 'flex-start',
      minWidth: '0',
      lg: { flex: '[1 1 0]' },
    },
    upcomingEyebrow: {
      color: 'highlight',
    },
    lastEdition: {
      alignItems: 'flex-start',
      width: 'full',
      maxWidth: 'narrowColumn',
      lg: { flex: '[0 0 42%]', maxWidth: '[460px]' },
    },
    lastEditionMedia: { position: 'relative', width: 'full' },
  },
})
