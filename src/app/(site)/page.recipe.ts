import { sva } from 'styled-system/css'

/**
 * Home page — co-located slot recipe.
 *
 * Dark hero with the stage Carousel pinned right and the title crashing over its
 * left edge, an Upcoming-lead variant (next edition's theme + a demoted "from
 * the last edition" card), then the past-editions register. The hero title uses
 * the `pageTitle` textStyle + entrance directly (it's not the standard PageHero
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
    'heroText',
    'heroLead',
    'heroBadge',
    'editionsHead',
    'editionsSubtext',
    'editionList',
    'upcomingInner',
    'upcomingLead',
    'upcomingEyebrow',
    'upcomingDates',
    'upcomingBadge',
    'lastEdition',
    'lastEditionLabel',
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
      display: 'flex',
      flexDirection: 'column',
      gap: 'lg',
      lg: {
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'start',
        columnGap: '2xl',
        rowGap: '3xl',
      },
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
      display: 'flex',
      flexDirection: 'column',
      gap: 'lg',
      color: 'heading',
      minWidth: '0',
      lg: { gridColumn: '1', gridRow: '1' },
    },
    // min-content forces "Bucharest / Sculpture / Days" to wrap on whitespace.
    heroTitle: {
      textStyle: 'pageTitle',
      // Entrance owned here, not split across the JSX: the shared `enter`
      // style plus the title's own delay override sit together, so the
      // animation-delay winner is legible in one place.
      animationStyle: 'enter',
      animationDelay: 'fast',
      width: '[min-content]',
    },
    heroText: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 'lg',
    },
    heroLead: { textStyle: 'leadLarge', color: 'body' },
    heroBadge: {
      order: '3',
      alignSelf: 'center',
      marginTop: 'md',
      zIndex: '10',
      lg: {
        gridColumn: '2',
        gridRow: '1',
        justifySelf: 'end',
        alignSelf: 'start',
        marginTop: '0',
      },
    },

    // The editions section shell is `section({ ground: 'dark' })` (composed with
    // the `panel` slot in the component); `editionsHead` + `editionList` are the
    // rails, so they own the gutter.
    editionsHead: {
      layerStyle: 'sectionInner',
      display: 'flex',
      flexDirection: 'column',
      gap: 'md',
      marginBottom: '2xl',
      width: 'full',
    },
    editionsSubtext: {
      fontFamily: 'body',
      fontSize: 'sm',
      lineHeight: 'body',
      color: 'body',
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
      display: 'flex',
      flexDirection: 'column',
      gap: '2xl',
      lg: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '3xl',
      },
    },
    upcomingLead: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 'lg',
      color: 'heading',
      minWidth: '0',
      lg: { flex: '[1 1 0]' },
    },
    // Deltas over the `Eyebrow` recipe base (body/uppercase/wide/muted/xs):
    // the upcoming lead runs it highlight, a step larger, and heavier.
    upcomingEyebrow: {
      color: 'highlight',
      fontSize: 'sm',
      fontWeight: 'semibold',
    },
    upcomingDates: {
      fontFamily: 'body',
      fontSize: 'md',
      letterSpacing: 'subtle',
      color: 'body',
    },
    upcomingBadge: { marginTop: 'sm' },
    lastEdition: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 'md',
      width: 'full',
      maxWidth: 'narrowColumn',
      paddingTop: 'lg',
      borderTop: 'hairline',
      lg: { flex: '[0 0 42%]', maxWidth: '[460px]', paddingTop: '0', borderTop: 'none' },
    },
    lastEditionLabel: { textStyle: 'metaLabel' },
    lastEditionMedia: { position: 'relative', width: 'full' },
  },
})
