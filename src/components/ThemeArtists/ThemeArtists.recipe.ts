import { sva } from 'styled-system/css'

/**
 * ThemeArtists — co-located slot recipe.
 *
 * The edition's theme statement beside its numbered artist roster on the dark
 * ground. A single narrow column on mobile; from `lg` the inner becomes a
 * two-column grid (theme copy left, table right) that evens to 1fr/1fr at `xl`.
 * `section` folds the shared `section` + `sectionDark` layerStyles in (the old
 * `shared.section shared.sectionDark` pair) and adds the relative/overflow stage.
 */
export const themeArtists = sva({
  slots: ['section', 'inner', 'themeHeader', 'headline', 'body', 'artistsTable'],
  base: {
    section: {
      layerStyle: 'section',
      background: 'blackPure',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
    },
    inner: {
      position: 'relative',
      zIndex: '1',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '525px',
      lg: {
        display: 'grid',
        gridTemplateColumns: '0.8fr 1.2fr',
        gap: '{spacing.lg} {spacing.5xl}',
        maxWidth: 'maxWidth',
      },
      xl: { gridTemplateColumns: '1fr 1fr' },
      '4xl': { paddingLeft: '2xl' },
    },

    themeHeader: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      marginInline: 'auto',
      marginBottom: '3xl',
    },
    headline: {
      fontFamily: 'display',
      fontSize: { base: 'xl', md: '2xl', xl: '3xl', '3xl': '4xl' },
      lineHeight: 'heading',
      color: 'white',
    },

    body: {
      marginBottom: '2xl',
      lg: { gridColumn: '1', alignSelf: 'start' },
      '& p': {
        fontFamily: 'body',
        fontWeight: 'regular',
        color: 'body',
        lineHeight: 'body',
        textAlign: 'left',
        textWrap: 'pretty',
        fontSize: 'base',
      },
      '& p:last-child': { marginBottom: '0' },
    },

    artistsTable: { gridColumn: '2' },
  },
})
