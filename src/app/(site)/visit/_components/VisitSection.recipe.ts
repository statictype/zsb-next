import { sva } from 'styled-system/css'

export const visitImageFrame = sva({
  slots: ['block', 'frame', 'image'],
  base: {
    block: {
      maxWidth: 'narrowColumn',
      marginInline: 'auto',
      lg: { maxWidth: '[none]', marginInline: '0' },
    },
    frame: {
      position: 'relative',
      aspectRatio: '1 / 1',
      overflow: 'hidden',
      md: { aspectRatio: '4 / 5' },
    },
    image: { objectFit: 'cover', background: 'gray.900' },
  },
})

export const visitFacts = sva({
  slots: ['group', 'pair', 'value'],
  base: {
    group: {
      '& + &': { borderTop: 'hairline', paddingTop: 'xl' },
    },
    pair: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'lg',
      md: { flexDirection: 'row', gap: 'xl' },
    },
    value: {
      // Joined multi-line values (opening hours) render their own '\n' breaks.
      whiteSpace: 'pre-line',
    },
  },
})

export const transportList = sva({
  slots: ['list', 'row', 'from', 'lines', 'walk'],
  base: {
    list: {
      listStyle: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: 'md',
      sm: { gap: 'sm' },
    },
    row: {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gridTemplateAreas: '"from walk" "lines lines"',
      columnGap: 'md',
      rowGap: 'xs',
      sm: {
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) auto',
        gridTemplateAreas: '"from lines walk"',
        alignItems: 'baseline',
      },
    },
    from: { gridArea: 'from', color: 'heading' },
    lines: { gridArea: 'lines' },
    walk: {
      gridArea: 'walk',
      textAlign: 'end',
      fontVariantNumeric: 'tabular-nums',
      whiteSpace: 'nowrap',
    },
  },
})
