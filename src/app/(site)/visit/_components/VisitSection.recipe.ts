import { sva } from 'styled-system/css'

export const visitImageFrame = sva({
  slots: ['frame', 'image'],
  base: {
    frame: {
      position: 'relative',
      aspectRatio: '1 / 1',
      overflow: 'hidden',
      maxWidth: 'narrowColumn',
      marginInline: 'auto',
      md: { aspectRatio: '4 / 5' },
      lg: {
        maxWidth: '[none]',
        marginInline: '0',
        aspectRatio: 'auto',
        alignSelf: 'stretch',
      },
    },
    image: { layerStyle: 'coverMono', background: 'gray.900' },
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
      fontVariantNumeric: 'tabular-nums',
    },
  },
})

export const transportList = sva({
  slots: ['list', 'row', 'stop', 'lines', 'walk'],
  base: {
    list: {
      listStyle: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: 'md',
    },
    row: {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gridTemplateAreas: '"stop walk" "lines lines"',
      columnGap: 'md',
      rowGap: 'xs',
      alignItems: 'baseline',
    },
    stop: { gridArea: 'stop' },
    lines: { gridArea: 'lines', fontVariantNumeric: 'tabular-nums' },
    walk: {
      gridArea: 'walk',
      textAlign: 'end',
      fontVariantNumeric: 'tabular-nums',
      whiteSpace: 'nowrap',
    },
  },
})
