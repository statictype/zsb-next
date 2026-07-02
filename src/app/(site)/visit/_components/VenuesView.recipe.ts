import { sva } from 'styled-system/css'

/**
 * VenuesView — co-located slot recipe.
 *
 * The programme browsed by place (ZSB-27), under the Visit page's main-venue
 * block. No ground of its own — it inherits the page's dark canvas and only
 * draws a top hairline; the shared Accordion owns disclosure chrome and state.
 */
export const venuesView = sva({
  slots: [
    'section',
    'inner',
    'header',
    'lede',
    'group',
    'groupTitle',
    'venues',
    'place',
    'events',
    'event',
    'eventName',
    'eventWhen',
    'chips',
    'child',
    'childHead',
    'childName',
    'childType',
  ],
  base: {
    section: {
      // rhythm from `section()` in the component; ground inherits the parent.
      borderTop: 'hairline',
    },
    inner: { layerStyle: 'sectionInner' },

    header: { marginBottom: 'xl' },
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
      borderBottom: 'hairline',
    },
    venues: { width: '100%' },
    place: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '12px',
      fontFamily: 'body',
      fontSize: 'sm',
      color: 'muted',
    },

    events: { listStyle: 'none', display: 'flex', flexDirection: 'column' },
    event: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      paddingBlock: 'sm',
      borderTop: 'hairline',
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
      _motionReduce: { transition: 'none' },
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

    child: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'sm',
      paddingLeft: 'md',
      borderLeft: 'hairline',
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
