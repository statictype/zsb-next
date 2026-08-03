import { sva } from 'styled-system/css'

export const calendar = sva({
  slots: [
    'section',
    'layout',
    'headerMain',
    'count',
    'pastToggle',
    'bandLabel',
    'run',
    'runMedia',
    'runContent',
    'runFoot',
    'eventName',
    'empty',
    'emptyText',
    'agenda',
    'day',
    'marker',
    'markerNode',
    'markerDay',
    'markerWeekday',
    'events',
    'event',
    'eventBody',
    'eventTime',
    'nameButton',
    'eventDesc',
    'poster',
    'posterTag',
    'recap',
    'recapMark',
  ],
  base: {
    section: {
      // Shared by the marker column and the timeline spine's `left`, so the
      // two can't drift apart.
      '--marker-col': 'token(spacing.4xl)',
      // Centre of the day numeral, from the top of the day row: weekday line
      // box + column gap + half the numeral line box.
      '--agenda-axis':
        'calc(token(fontSizes.xs) * 1.3 + token(spacing.sm) + token(fontSizes.lg) * 0.55)',
      // Half the Badge box.
      '--agenda-badge-half':
        'calc(6px + token(borderWidths.hairlineThin) + token(fontSizes.xs) * 0.65)',
      '--agenda-node': '8px',
    },
    layout: {
      minWidth: '0',
      borderTop: 'hairline',
      paddingTop: 'lg',
    },
    headerMain: { minWidth: '0' },

    count: {
      color: 'heading',
      fontVariantNumeric: 'tabular-nums',
    },
    pastToggle: {
      fontVariantNumeric: 'tabular-nums',
    },

    bandLabel: {
      color: 'highlight',
    },
    run: {
      display: 'flex',
      flexDirection: 'column',
      background: 'surface',
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
        '& img': { filter: '[token(assets.developHover)]', transform: 'scale(1.03)' },
        '& a': { color: 'action' },
      },
      // 0.6 is the floor that keeps `body` copy at 4.9:1 on black: a touch
      // device never gets the hover back.
      '&[data-past=true]': {
        opacity: 0.6,
        transition: 'interactive',
      },
      '&[data-past=true]:hover': { opacity: 1 },
    },
    runMedia: {
      position: 'relative',
      aspectRatio: '3 / 2',
      overflow: 'hidden',
      background: 'gray.800',
      '& img': {
        objectFit: 'cover',
        filter: '[token(assets.developRest)]',
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

    agenda: {
      listStyle: 'none',
      position: 'relative',
      md: {
        _before: {
          content: '""',
          position: 'absolute',
          top: 'sm',
          bottom: 'sm',
          left: 'var(--marker-col)',
          width: '[token(borderWidths.hairline)]',
          background: 'divider',
        },
      },
    },
    day: {
      paddingBlock: 'lg',
      borderTop: 'hairline',
      _first: { borderTop: 'none', paddingTop: '0' },
      '&[data-past=true]': {
        opacity: 0.6,
        transition: 'interactive',
      },
      '&[data-past=true]:hover': { opacity: 1 },
      md: {
        display: 'grid',
        gridTemplateColumns: 'var(--marker-col) 1fr',
        gap: '0',
        alignItems: 'start',
        position: 'relative',
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
    markerNode: {
      display: 'none',
      md: {
        display: 'block',
        position: 'absolute',
        right: '[calc((var(--agenda-node) + token(borderWidths.hairline)) / -2)]',
        top: '[calc(var(--agenda-axis) - var(--agenda-node) / 2)]',
        width: '[var(--agenda-node)]',
        height: '[var(--agenda-node)]',
        background: 'heading',
        borderRadius: 'circle',
        '[data-today=true] &': { background: 'highlight' },
      },
    },
    markerDay: {
      textStyle: 'heading',
      color: 'heading',
      fontVariantNumeric: 'tabular-nums',
    },
    markerWeekday: {
      '[data-today=true] &': { color: 'highlight' },
    },
    events: {
      listStyle: 'none',
      display: 'flex',
      flexDirection: 'column',
      md: {
        paddingLeft: 'lg',
        // Drops the first row's badge line onto the numeral's axis.
        '& > li:first-child': {
          paddingTop: '[calc(var(--agenda-axis) - var(--agenda-badge-half))]',
        },
      },
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
        '& img': { filter: '[token(assets.developHover)]', transform: 'scale(1.03)' },
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
      letterSpacing: '[-0.018em]',
    },
    // The ::after stretches the hit target over the whole row.
    nameButton: {
      font: '[inherit]',
      textAlign: 'left',
      textDecoration: 'none',
      background: 'transparent',
      border: 'none',
      padding: '0',
      cursor: 'pointer',
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
        filter: '[token(assets.developRest)]',
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
    posterTag: {
      display: 'none',
      alignItems: 'center',
      gap: 'sm',
      transition: 'interactive',
      _before: { content: '""', width: '[7px]', height: '[9px]', background: 'current' },
      '@media (hover: hover) and (pointer: fine) and (min-width: 1280px)': {
        display: 'inline-flex',
        '[data-poster=true]:hover &': { color: 'action' },
      },
    },

    recap: {
      alignItems: 'flex-start',
    },
    recapMark: { color: 'heading' },
  },
})
