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
      maxWidth: 'narrowColumn',
      lg: {
        rowGap: 'lg',
        columnGap: '4xl',
        maxWidth: 'maxWidth',
      },
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
      lg: { alignSelf: 'start' },
      '& p': {
        textStyle: 'prose',
        textWrap: '[pretty]',
      },
      '& p:last-child': { marginBottom: '0' },
    },
  },
})
