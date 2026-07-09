import { sva } from 'styled-system/css'

/**
 * ComingSoon — co-located slot recipe.
 *
 * Stands in for the calendar on a live edition whose events aren't announced
 * yet; shares the schedule board's dark surface. The header title + meta row
 * and the follow CTAs are the shared `CalendarMeta` / `FollowLinks`; this
 * recipe keeps only the notice copy layout.
 */
export const comingSoon = sva({
  slots: ['inner', 'header', 'notice', 'headline', 'body'],
  base: {
    inner: { layerStyle: 'sectionInner' },

    header: { marginBottom: 'xl' },

    notice: {
      paddingTop: 'xl',
      borderTop: 'hairline',
    },
    headline: {
      fontFamily: 'display',
      fontSize: '2xl',
      lineHeight: 'tight',
      color: 'white',
      maxWidth: '[18ch]',
    },
    body: {
      marginTop: 'md',
      fontFamily: 'body',
      fontSize: 'base',
      lineHeight: 'body',
      color: 'body',
      maxWidth: 'measure',
    },
  },
})
