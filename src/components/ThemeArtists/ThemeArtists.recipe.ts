import { sva } from 'styled-system/css'

/**
 * ThemeArtists — co-located slot recipe.
 *
 * The edition's theme statement beside its numbered artist roster on the dark
 * ground. A single narrow column on mobile; from `lg` the inner becomes a
 * two-column grid (theme copy left, table right) that evens to 1fr/1fr at `xl`.
 * The dark ground + rhythm come from the shared `section({ ground: 'dark' })`
 * recipe (composed in the component); this slot keeps only the relative/overflow
 * stage. `inner` is the content rail, so it owns the horizontal gutter.
 */
export const themeArtists = sva({
  slots: ['section', 'inner', 'themeHeader', 'body', 'artistsTable'],
  base: {
    section: {
      position: 'relative',
      overflow: 'hidden',
    },
    inner: {
      position: 'relative',
      zIndex: '1',
      paddingInline: 'gutter',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '525px',
      lg: {
        display: 'grid',
        gridTemplateColumns: '0.8fr 1.2fr',
        gap: '{spacing.lg} {spacing.4xl}',
        maxWidth: 'maxWidth',
      },
      xl: { gridTemplateColumns: '1fr 1fr' },
      '4xl': { paddingLeft: '2xl' },
    },

    themeHeader: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      paddingInline: 'gutter',
      marginBottom: '3xl',
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
