import { sva } from 'styled-system/css'

export const program = sva({
  slots: [
    'section',
    'layout',
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
    'dayByDay',
    'day',
    'marker',
    'markerDay',
    'events',
    'event',
    'eventBody',
    'eventTime',
    'nameButton',
    'eventDesc',
    'poster',
    'recap',
    'recapMark',
    'themeMark',
    'follow',
    'followNote',
    'archive',
  ],
  base: {
    section: {
      // Shared by the marker column and the timeline spine's `left`, so the
      // two can't drift apart.
      '--marker-col': 'token(spacing.4xl)',
    },
    layout: {
      minWidth: '0',
      borderTop: 'hairline',
      paddingTop: 'lg',
    },
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
        '& img': { filter: '[token(assets.monoHover)]', transform: 'scale(1.03)' },
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
      textStyle: 'body',
      fontWeight: 'bold',
      lineHeight: '1.4',
      letterSpacing: 'tight',
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
    recap: {
      alignItems: 'flex-start',
      gap: 'lg',
      maxWidth: 'measure',
    },
    recapMark: { color: 'heading' },
    themeMark: { color: 'highlight' },
    follow: {
      alignItems: 'flex-start',
      gap: 'md',
    },
    followNote: {
      color: 'muted',
    },
    archive: {
      border: 'hairline',
      transition: 'interactive',
      '& [data-part=trigger]': {
        padding: 'lg',
        alignItems: 'center',
      },
      '& [data-collapsible-label]': {
        textStyle: 'cardTitle',
        color: 'heading',
      },
      '& [data-part=trigger]:hover [data-collapsible-label]': {
        textDecoration: 'none',
      },
      '& [data-part=indicator]': {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'touch',
        height: 'touch',
        border: 'hairline',
        color: 'heading',
        transition: 'interactive',
      },
      '&:has([data-part=trigger]:hover), &:has([data-part=trigger]:focus-visible)': {
        borderColor: 'action',
      },
      '& [data-part=trigger]:hover [data-part=indicator], & [data-part=trigger]:focus-visible [data-part=indicator]':
        {
          borderColor: 'action',
          color: 'action',
        },
      '& [data-part=content]': {
        paddingInline: 'lg',
        paddingBottom: 'lg',
      },
    },
  },
})
