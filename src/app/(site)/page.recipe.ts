import { sva } from 'styled-system/css'

/**
 * Home page — co-located slot recipe.
 *
 * Dark hero with the stage Carousel pinned right and the title crashing over its
 * left edge, an Upcoming-lead variant (next edition's theme + a demoted "from
 * the last edition" card), then the past-editions register. The hero title uses
 * the shared display type + entrance directly (it's not the standard PageHero
 * block — Carousel layout, min-content title). The `.editionBadge` pill →
 * `<Badge>`. Row hovers drive from the `<a>` via `a:hover &` (disabled rows are
 * `<div>`, so they never trigger the colour/arrow shift).
 */
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

    // Shell = the shared `pageHero` layerStyle (black ground + nav-clearing
    // top padding + section bottom padding); the flex column, gutter, and
    // full-viewport min-height are the hero's own additions.
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
      // Entrance owned here, not split across the JSX: the shared `enter`
      // style plus the title's own delay override sit together, so the
      // animation-delay winner is legible in one place.
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

    // The editions section shell is `section({ ground: 'dark' })` (composed with
    // the `panel` slot in the component); `editionsHead` + `editionList` are the
    // rails, so they own the gutter.
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
