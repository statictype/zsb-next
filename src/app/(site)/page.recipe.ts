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
 * `<div>`, so they never trigger the colour/arrow shift). Unused `editionsLink`
 * + the empty `.main` are dropped. `--partner-badge-scale` is set per breakpoint.
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

    hero: {
      position: 'relative',
      width: 'full',
      background: 'black',
      paddingTop: '[calc(token(sizes.nav) + 80px)]',
      paddingInline: 'gutter',
      paddingBottom: '2xl',
      overflow: 'hidden',
      minHeight: 'svh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      md: { paddingTop: '[calc(token(sizes.nav) + 120px)]', paddingBottom: '3xl' },
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
      // Reveal contract is the shared `enter` animation style; delay only here.
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
      '--partner-badge-scale': '2.2',
      md: { '--partner-badge-scale': '1.8' },
      lg: {
        gridColumn: '2',
        gridRow: '1',
        justifySelf: 'end',
        alignSelf: 'start',
        marginTop: '0',
        '--partner-badge-scale': '1.65',
      },
      xl: { '--partner-badge-scale': '1.75' },
      '3xl': { '--partner-badge-scale': '1.85' },
    },

    // The editions section shell is `section({ ground: 'dark' })` (composed with
    // the `panel` slot in the component); `editionsHead` + `editionList` are the
    // rails, so they own the gutter.
    editionsHead: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'md',
      maxWidth: 'maxWidth',
      marginInline: 'auto',
      marginBottom: '2xl',
      paddingInline: 'gutter',
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
      maxWidth: 'maxWidth',
      marginInline: 'auto',
      paddingInline: 'gutter',
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
    upcomingEyebrow: {
      fontFamily: 'body',
      fontSize: 'sm',
      textTransform: 'uppercase',
      letterSpacing: 'wide',
      fontWeight: 'semibold',
      color: 'highlight',
    },
    upcomingDates: {
      fontFamily: 'body',
      fontSize: 'md',
      letterSpacing: 'subtle',
      color: 'body',
    },
    upcomingBadge: { marginTop: 'sm', '--partner-badge-scale': '1.5' },
    lastEdition: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 'md',
      width: 'full',
      maxWidth: '[520px]',
      paddingTop: 'lg',
      borderTop: 'hairline',
      lg: { flex: '[0 0 42%]', maxWidth: '[460px]', paddingTop: '0', borderTop: 'none' },
    },
    lastEditionLabel: {
      fontFamily: 'body',
      fontSize: '2xs',
      textTransform: 'uppercase',
      letterSpacing: 'label',
      fontWeight: 'semibold',
      color: 'muted',
    },
    lastEditionMedia: { position: 'relative', width: 'full' },
  },
})
