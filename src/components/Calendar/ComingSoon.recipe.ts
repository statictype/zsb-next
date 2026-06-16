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
    'section',
    'inner',
    'header',
    'title',
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
    'link',
  ],
  base: {
    section: { layerStyle: 'section', background: 'black', color: 'white' },
    inner: { layerStyle: 'sectionInner' },

    header: { marginBottom: 'xl' },
    title: { textStyle: 'sectionTitle', marginBottom: 0 },
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
      borderTopWidth: '1px',
      borderTopStyle: 'solid',
      borderTopColor: 'borderDark',
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
    link: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      fontFamily: 'body',
      fontSize: '2xs',
      textTransform: 'uppercase',
      letterSpacing: 'label',
      fontWeight: 'semibold',
      color: 'white',
      paddingBottom: '3px',
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: 'gray.700',
      transition:
        'color {durations.fast} {easings.quint}, border-color {durations.fast} {easings.quint}',
      _hover: {
        color: 'action',
        borderColor: 'action',
        '& svg': { transform: 'translate(2px, -2px)' },
      },
      _focusVisible: { outline: '2px solid token(colors.highlight)', outlineOffset: '2px' },
      '& svg': { transition: 'transform {durations.fast} {easings.quint}' },
      '@media (prefers-reduced-motion: reduce)': {
        transition: 'none',
        '& svg': { transition: 'none' },
      },
    },
  },
})
