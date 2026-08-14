import { sva } from 'styled-system/css'

export const homePage = sva({
  slots: [
    'panel',
    'hero',
    'heroRail',
    'heroVisual',
    'heroPanel',
    'heroTitle',
    'heroBadge',
    'editionsLayout',
    'editionsHead',
    'editionsSubtext',
    'editionList',
    'editionPrefix',
    'upcomingLead',
    'upcomingEyebrow',
    'upcomingBadge',
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
    heroRail: {
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
      animationDelay: 'stagger',
      width: '[min-content]',
    },

    heroBadge: {
      order: '3',
      justifySelf: 'center',
      zIndex: '10',
      lg: {
        gridColumn: '2',
        gridRow: '1',
        justifySelf: 'end',
        alignSelf: 'start',
      },
    },
    editionsLayout: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'lg',
      lg: {
        display: 'grid',
        gridTemplateColumns: '[minmax(200px, 30%) minmax(0, 1fr)]',
        alignItems: 'start',
        columnGap: 'xl',
        rowGap: '0',
        width: 'full',
        maxWidth: 'maxWidth',
        marginInline: 'auto',
        paddingInline: 'gutter',
      },
    },
    editionsHead: {
      layerStyle: 'sectionInner',
      width: 'full',
      lg: {
        maxWidth: '[none]',
        marginInline: '0',
        paddingInline: '0',
        position: 'sticky',
        top: '[calc(token(sizes.nav) + token(spacing.lg))]',
      },
    },
    editionsSubtext: {
      maxWidth: 'measure',
    },
    editionList: {
      layerStyle: 'sectionInner',
      borderBottom: 'hairline',
      width: 'full',
      lg: {
        maxWidth: '[none]',
        marginInline: '0',
        paddingInline: '0',
        '& > li:first-child': { borderTop: 'none' },
      },
    },
    editionPrefix: {
      color: 'muted',
      transition: 'interactive',
      'a:hover &': { color: 'current' },
    },
    upcomingLead: {
      alignItems: 'flex-start',
      minWidth: '0',
      lg: { flex: '[1 1 0]' },
    },
    upcomingEyebrow: {
      color: 'highlight',
    },
    upcomingBadge: {
      alignSelf: 'center',
      lg: { alignSelf: 'flex-start' },
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
