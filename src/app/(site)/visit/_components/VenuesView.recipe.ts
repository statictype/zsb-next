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
    'child',
    'childName',
    'childType',
  ],
  base: {
    section: {
      // rhythm from `section()` in the component; ground inherits the parent.
      borderTop: 'hairline',
    },

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
    venues: { width: 'full' },
    place: {
      fontFamily: 'body',
      fontSize: 'sm',
      color: 'muted',
    },

    events: { listStyle: 'none', display: 'flex', flexDirection: 'column' },
    event: {
      paddingBlock: 'sm',
      borderTop: 'hairline',
      '&:first-child': { borderTop: 'none' },
    },
    eventName: {
      fontFamily: 'display',
      fontSize: 'base',
      lineHeight: 'tight',
      color: 'white',
      width: 'fit',
      transitionProperty: 'colors',
      transitionDuration: 'fast',
      transitionTimingFunction: 'quint',
      _hover: { color: 'action' },
      _focusVisible: { outline: 'focus', outlineOffset: 'xs' },
      _motionReduce: { transitionDuration: 'instant' },
    },
    eventWhen: {
      textStyle: 'metaLabel',
      fontVariantNumeric: 'tabular-nums',
    },
    child: {
      paddingLeft: 'md',
      borderLeft: 'hairline',
    },
    childName: {
      fontFamily: 'body',
      fontSize: 'sm',
      textTransform: 'uppercase',
      letterSpacing: 'subtle',
      fontWeight: 'semibold',
      color: 'gray.300',
    },
    childType: {
      textStyle: 'metaLabel',
    },
  },
})
