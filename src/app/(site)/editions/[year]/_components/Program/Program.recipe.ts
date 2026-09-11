import { sva } from 'styled-system/css'

const past = {
  '&[data-past=true]': {
    opacity: 0.6,
    transition: 'interactive',
  },
  '&[data-past=true]:hover': { opacity: 1 },
} as const

export const program = sva({
  slots: [
    'layout',
    'count',
    'bandLabel',
    'run',
    'runMedia',
    'runContent',
    'runFoot',
    'eventName',
    'empty',
    'emptyText',
    'dayByDay',
    'day',
    'marker',
    'markerDay',
    'events',
    'event',
    'eventBody',
    'eventTime',
    'link',
    'eventDesc',
    'poster',
  ],
  base: {
    layout: {
      minWidth: '0',
      borderTop: 'hairline',
      paddingTop: 'lg',
    },
    count: {
      color: 'heading',
      fontVariantNumeric: 'tabular-nums',
    },

    bandLabel: {
      color: 'highlight',
    },
    run: {
      display: 'flex',
      flexDirection: 'column',
      border: 'hairline',
      position: 'relative',
      _before: {
        content: '""',
        layerStyle: 'gradientBorder',
        inset: '[calc(token(borderWidths.hairline) * -1)]',
        padding: '[token(borderWidths.hairline)]',
      },
      _hover: {
        borderColor: 'transparent',
        '&::before': { opacity: 1, animationStyle: 'gradientBorder' },
        '& img': { filter: '[token(assets.monoHover)]', transform: 'scale(1.03)' },
        '& a': { color: 'action' },
      },
      ...past,
    },
    runMedia: {
      position: 'relative',
      aspectRatio: '3 / 2',
      overflow: 'hidden',
      background: 'gray.800',
      '& img': {
        objectFit: 'cover',
        filter: '[token(assets.mono)]',
        transition: 'develop',
      },
    },
    runContent: {
      padding: 'md',
      flex: '1',
      minWidth: '0',
    },
    runFoot: {
      marginTop: 'auto',
    },

    empty: {
      alignItems: 'flex-start',
      paddingBlock: 'xl',
    },
    emptyText: {
      color: 'gray.300',
    },

    dayByDay: {
      listStyle: 'none',
    },
    day: {
      paddingBlock: 'lg',
      borderTop: 'hairline',
      _first: { borderTop: 'none', paddingTop: '0' },
      ...past,
      md: {
        display: 'grid',
        gridTemplateColumns: '[token(spacing.4xl) 1fr]',
        gap: '0',
        alignItems: 'start',
      },
      xl: { paddingBlock: 'md' },
    },
    marker: {
      md: {
        paddingRight: 'lg',
        textAlign: 'right',
        position: 'sticky',
        top: 'lg',
      },
    },
    markerDay: {
      textStyle: 'heading',
      color: 'heading',
      fontVariantNumeric: 'tabular-nums',
      '[data-today=true] &': { color: 'highlight' },
    },
    events: {
      listStyle: 'none',
      display: 'flex',
      flexDirection: 'column',
      md: { paddingLeft: 'lg' },
    },

    event: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'md',
      paddingBlock: 'md',
      borderTop: 'hairline',
      position: 'relative',
      _first: { borderTop: 'none' },
      _hover: {
        '& a': { color: 'action' },
        '& img': { filter: '[token(assets.monoHover)]', transform: 'scale(1.03)' },
      },
      '@media (hover: hover) and (pointer: fine) and (min-width: 1280px)': {
        '&[data-poster=true]': {
          display: 'grid',
          gridTemplateColumns: '[minmax(0, 1fr) 220px]',
          columnGap: 'lg',
        },
      },
    },
    eventBody: {
      minWidth: '0',
    },
    eventTime: {
      color: 'heading',
      fontVariantNumeric: 'tabular-nums',
    },
    eventName: {
      fontWeight: 'bold',
      lineHeight: '1.4',
      letterSpacing: 'tight',
    },
    link: {
      transition: 'interactive',
      _after: { content: '""', position: 'absolute', inset: '0', zIndex: '1' },
      _focusVisible: { color: 'action' },
    },
    eventDesc: {
      maxWidth: 'measure',
      lineClamp: '2',
    },
    poster: {
      position: 'relative',
      aspectRatio: '3 / 4',
      width: 'full',
      maxWidth: '[260px]',
      overflow: 'hidden',
      background: 'gray.800',
      '& img': {
        objectFit: 'cover',
        filter: '[token(assets.mono)]',
        transition: 'develop',
      },
      '@media (hover: hover) and (pointer: fine) and (min-width: 1280px)': {
        position: 'absolute',
        gridColumn: '2',
        top: 'md',
        right: '0',
        width: '[220px]',
        maxWidth: '[none]',
        opacity: 0,
        transform: 'translateX(20px)',
        transition: 'develop',
        pointerEvents: 'none',
        zIndex: '3',
        '[data-poster=true]:hover &': { opacity: 1, transform: 'translateX(0)' },
      },
    },
  },
})
