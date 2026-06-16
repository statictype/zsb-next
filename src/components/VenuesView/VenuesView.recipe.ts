import { sva } from 'styled-system/css'

/**
 * VenuesView — co-located slot recipe.
 *
 * The programme browsed by place (ZSB-27), under the Visit page's main-venue
 * block. No ground of its own — it inherits the page's dark canvas and only
 * draws a top hairline; each venue is a shared `<Disclosure>` (the summary
 * chrome + chevron live there) whose name warms to the accent on hover. The
 * chip border collapses to the shared `highlightFaint` (chartreuse 32%).
 */
export const venuesView = sva({
  slots: [
    'section',
    'inner',
    'header',
    'title',
    'lede',
    'group',
    'groupTitle',
    'venues',
    'venue',
    'venueName',
    'count',
    'place',
    'mapLink',
    'events',
    'event',
    'eventName',
    'eventWhen',
    'chips',
    'chip',
    'child',
    'childHead',
    'childName',
    'childType',
  ],
  base: {
    section: {
      // rhythm from `section()` in the component; ground inherits the parent.
      borderTopWidth: '1px',
      borderTopStyle: 'solid',
      borderTopColor: 'borderDark',
    },
    inner: { layerStyle: 'sectionInner' },

    header: { marginBottom: 'xl' },
    title: { textStyle: 'sectionTitle', marginBottom: '0' },
    lede: {
      marginTop: 'md',
      fontFamily: 'body',
      fontSize: { base: 'sm', md: 'base' },
      textTransform: 'uppercase',
      letterSpacing: 'label',
      fontWeight: 'semibold',
      color: 'body',
    },

    group: { marginTop: '2xl' },
    groupTitle: {
      fontFamily: 'body',
      fontSize: '2xs',
      textTransform: 'uppercase',
      letterSpacing: 'wide',
      fontWeight: 'semibold',
      color: 'highlight',
      paddingBottom: 'sm',
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: 'borderDark',
    },
    venues: { listStyle: 'none' },

    venue: {
      borderTopWidth: '1px',
      borderTopStyle: 'solid',
      borderTopColor: 'borderDark',
      '&:first-of-type': { borderTopWidth: '0' },
    },
    // The venue name is the `<Disclosure summary>`; it warms to the accent on
    // hover via the disclosure's own `<summary>`.
    venueName: {
      fontFamily: 'display',
      fontSize: { base: 'lg', md: 'xl' },
      lineHeight: 'tight',
      color: 'white',
      transition: 'color {durations.fast} {easings.quint}',
      'summary:hover &': { color: 'action' },
      '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
    },
    count: {
      fontFamily: 'body',
      fontSize: '2xs',
      textTransform: 'uppercase',
      letterSpacing: 'label',
      fontWeight: 'semibold',
      color: 'muted',
    },
    place: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '12px',
      fontFamily: 'body',
      fontSize: 'sm',
      color: 'muted',
    },
    mapLink: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      textTransform: 'uppercase',
      letterSpacing: 'label',
      fontSize: '2xs',
      fontWeight: 'semibold',
      color: 'white',
      paddingBottom: '2px',
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: 'gray.700',
      transition:
        'color {durations.fast} {easings.quint}, border-color {durations.fast} {easings.quint}',
      _hover: { color: 'action', borderColor: 'action' },
      '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
    },

    events: { listStyle: 'none', display: 'flex', flexDirection: 'column' },
    event: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      paddingBlock: 'sm',
      borderTopWidth: '1px',
      borderTopStyle: 'solid',
      borderTopColor: 'borderDark',
      '&:first-child': { borderTopWidth: '0' },
    },
    eventName: {
      fontFamily: 'display',
      fontSize: 'base',
      lineHeight: 'tight',
      color: 'white',
      width: 'fit-content',
      transition: 'color {durations.fast} {easings.quint}',
      _hover: { color: 'action' },
      _focusVisible: { outline: '2px solid token(colors.highlight)', outlineOffset: '2px' },
      '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
    },
    eventWhen: {
      fontFamily: 'body',
      fontSize: '2xs',
      textTransform: 'uppercase',
      letterSpacing: 'label',
      color: 'muted',
      fontVariantNumeric: 'tabular-nums',
    },
    chips: { listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '6px' },
    chip: {
      fontFamily: 'body',
      fontSize: '2xs',
      textTransform: 'uppercase',
      letterSpacing: 'label',
      fontWeight: 'semibold',
      color: 'highlight',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'highlightFaint',
      paddingBlock: '2px',
      paddingInline: '8px',
      lineHeight: '1.4',
    },

    child: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'sm',
      paddingLeft: 'md',
      borderLeftWidth: '1px',
      borderLeftStyle: 'solid',
      borderLeftColor: 'borderDark',
    },
    childHead: { display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '10px' },
    childName: {
      fontFamily: 'body',
      fontSize: 'sm',
      textTransform: 'uppercase',
      letterSpacing: 'subtle',
      fontWeight: 'semibold',
      color: 'gray.300',
    },
    childType: {
      fontFamily: 'body',
      fontSize: '2xs',
      textTransform: 'uppercase',
      letterSpacing: 'label',
      color: 'muted',
    },
  },
})
