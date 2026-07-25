import { sva } from 'styled-system/css'

/**
 * Calendar — co-located slot recipe.
 *
 * The date-by-date programme as a dark schedule board: header + counts, an
 * "Ongoing" exhibition card grid, the day-by-day agenda timeline, finished-edition
 * recap + shared archive Collapsible. Raw grays are the documented dark-board
 * exceptions. State lives on data attributes: `data-past` (runs/days),
 * `data-today` (the live day), `data-poster` (event rows). The agenda's marker
 * column is the `--marker-col` custom prop, set responsively on the section.
 */
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
      // ground + rhythm come from `section({ ground: 'dark' })` in the component.
      // Agenda date-marker column width — tracks the responsive `4xl` spacing
      // ramp so the column and the timeline spine (`agenda::before` `left`) stay
      // in lockstep and scale monotonically with the section rhythm.
      '--marker-col': 'token(spacing.4xl)',
      // Shared horizontal axis for the agenda's first line (md+): the vertical
      // centre of the day numeral, measured from the top of the day row —
      // weekday line box (label: xs * 1.3) + column gap + half the numeral line
      // box (heading: lg * 1.1). The timeline node and the first event row are
      // both placed against it.
      '--agenda-axis':
        'calc(token(fontSizes.xs) * 1.3 + token(spacing.sm) + token(fontSizes.lg) * 0.55)',
      // Half the Badge box: padding + hairline + half its line box.
      '--agenda-badge-half':
        'calc(token(spacing.badgeY) + token(borderWidths.hairlineThin) + token(fontSizes.xs) * 0.65)',
      // Diameter of the timeline's day node; its own offsets are derived from
      // it, so the node stays centred on the spine at any size.
      '--agenda-node': '8px',
    },
    // The board's leading rule — one edge under the header whichever branch
    // renders (empty notice, Ongoing band, or the agenda on its own).
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

    // ---- Ongoing band — exhibition card grid ----
    bandLabel: {
      color: 'highlight',
    },
    run: {
      display: 'flex',
      flexDirection: 'column',
      background: 'surface',
      border: 'hairline',
      position: 'relative',
      // Gradient hover ring, sitting on the border box at the border's own
      // width while the resting edge fades out under it (the Button doctrine) —
      // the edge travels instead of thickening.
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
      // Past de-emphasis (live edition only). 0.6 is the floor that keeps
      // `body` copy at 4.9:1 on black — a touch device never gets the hover
      // back, so the dimmed state has to be readable on its own.
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

    // ---- Empty state ----
    empty: {
      alignItems: 'flex-start',
      paddingBlock: 'xl',
    },
    emptyText: {
      color: 'gray.300',
    },

    // ---- Agenda timeline ----
    agenda: {
      listStyle: 'none',
      position: 'relative',
      // Timeline spine + marker column from tablet up.
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
      // See `run` — same floor, same reason.
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
        // Centred on the spine, not on the column edge the spine starts at.
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
    // The weekday reads with the month at label weight; chartreuse marks the
    // one day that is today (magenta is the action ink — a date does nothing).
    markerWeekday: {
      '[data-today=true] &': { color: 'highlight' },
    },
    events: {
      listStyle: 'none',
      display: 'flex',
      flexDirection: 'column',
      md: {
        paddingLeft: 'lg',
        // Drops the first row's badge line onto the numeral's axis; replaces
        // the row's own `md` top padding rather than adding to it.
        '& > li:first-child': {
          paddingTop: '[calc(var(--agenda-axis) - var(--agenda-badge-half))]',
        },
      },
    },

    // ---- Event row ----
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
        // Only rows with a poster get the reserved column — body owns column
        // 1, poster column 2 (still absolutely positioned within it for the
        // hover reveal, so it doesn't grow the row's height).
        '&[data-poster=true]': {
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) token(sizes.calendarPoster)',
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
    // The name link; its ::after stretches the hit target over the whole row.
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
      // Two-line teaser; Panda's lineClamp expands the full -webkit-box clamp.
      lineClamp: '2',
    },
    // Touch/narrow: inline portrait thumbnail. Wide hover-capable: float (below).
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
        width: 'calendarPoster',
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

    // ---- Finished-edition recap ----
    recap: {
      alignItems: 'flex-start',
    },
    recapMark: { color: 'heading' },
  },
})
