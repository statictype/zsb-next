import { sva } from 'styled-system/css'

/**
 * ComingSoon — co-located slot recipe.
 *
 * Stands in for the calendar on a live edition whose events aren't announced
 * yet; shares the schedule board's dark surface. Header mirrors the live
 * calendar's (minus the window/count meta). Raw grays are the documented
 * dark-board exceptions.
 */
export const comingSoon = sva({
  slots: [
    'inner',
    'header',
    'meta',
    'metaYear',
    'metaDot',
    'metaSoon',
    'notice',
    'headline',
    'body',
    'follow',
    'followLabel',
    'links',
  ],
  base: {
    inner: { layerStyle: 'sectionInner' },

    header: { marginBottom: 'xl' },
    meta: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '12px',
      marginTop: 'md',
      fontFamily: 'body',
      fontSize: 'xs',
      textTransform: 'uppercase',
      letterSpacing: 'label',
      fontWeight: 'semibold',
      md: { fontSize: 'sm' },
    },
    metaYear: { color: 'highlight' },
    metaSoon: { color: 'highlight' },
    metaDot: { width: '4px', height: '4px', background: 'gray.700', borderRadius: 'circle' },

    notice: {
      paddingTop: 'xl',
      borderTop: 'hairline',
    },
    headline: {
      fontFamily: 'display',
      fontSize: '2xl',
      lineHeight: 'tight',
      color: 'white',
      maxWidth: '18ch',
    },
    body: {
      marginTop: 'md',
      fontFamily: 'body',
      fontSize: 'base',
      lineHeight: 'body',
      color: 'body',
      maxWidth: '52ch',
    },

    follow: { display: 'flex', flexDirection: 'column', gap: 'md', marginTop: 'xl' },
    followLabel: {
      fontFamily: 'body',
      fontSize: '2xs',
      textTransform: 'uppercase',
      letterSpacing: 'label',
      fontWeight: 'semibold',
      color: 'muted',
    },
    links: { listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '20px' },
  },
})
