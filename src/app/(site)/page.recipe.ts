import { sva } from 'styled-system/css'

export const homePage = sva({
  slots: [
    'panel',
    'hero',
    'heroRail',
    'heroVisual',
    'heroPanel',
    'heroTitle',
    'editionsLayout',
    'editionsHead',
    'editionsSubtext',
    'editionList',
    'editionPrefix',
    'editionThemeRow',
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
      // Tighter than the shared pageHero rhythm, and short of a full viewport,
      // so the partner strip's ground shows above the fold.
      lg: {
        paddingTop: '[calc(token(sizes.nav) + token(spacing.xl) + token(spacing.md))]',
        paddingBottom: '[calc(token(spacing.2xl) + token(spacing.md))]',
        minHeight: '[calc(100svh - 90px)]',
      },
    },
    heroRail: {
      position: 'relative',
      maxWidth: 'maxWidth',
      marginInline: 'auto',
      width: 'full',
      lg: { marginTop: '[100px]' },
      '2xl': { marginTop: '[150px]' },
    },
    heroVisual: {
      order: '2',
      position: 'relative',
      width: 'full',
      minWidth: '0',
      lg: {
        // Runs the full width of the row, under the hero copy; the stage's own
        // mask fades its leading slides out behind the text.
        gridColumn: '1 / -1',
        gridRow: '1',
        zIndex: '0',
        // `width: full` would pin the box to its grid track, leaving the
        // negative margin to shift it instead of widening it.
        width: 'auto',
        marginRight:
          '[calc((min(100vw - 2 * token(spacing.gutter), token(sizes.maxWidth)) - 100vw) / 2)]',
      },
    },
    heroPanel: {
      order: '1',
      position: 'relative',
      minWidth: '0',
      lg: { gridColumn: '1', gridRow: '1', zIndex: '1', transform: '[translateY(-100px)]' },
      '2xl': { transform: '[translateY(-150px)]' },
    },
    // min-content forces "Bucharest / Sculpture / Days" to wrap on whitespace.
    heroTitle: {
      animationStyle: 'enter',
      animationDelay: 'stagger',
      width: '[min-content]',
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
      'a:hover &, a:focus-visible &': { color: 'action' },
    },
    editionThemeRow: {
      flexWrap: 'wrap',
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
