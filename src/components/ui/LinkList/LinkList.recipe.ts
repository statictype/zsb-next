import { sva } from 'styled-system/css'

export const linkList = sva({
  slots: ['list', 'item', 'link', 'year', 'body', 'title', 'excerpt', 'tags', 'arrow'],
  base: {
    // List margins/padding are already zeroed by the base reset.
    list: { listStyle: 'none', borderBottom: 'hairline' },
    item: { borderTop: 'hairline' },
    link: {
      display: 'grid',
      gridTemplateColumns: {
        base: '40px minmax(0, 1fr) auto',
        md: '60px minmax(0, 1fr) auto auto',
      },
      alignItems: 'center',
      gap: { base: 'sm', md: 'md' },
      paddingBlock: 'lg',
      transitionProperty: '[padding-left]',
      transitionDuration: 'medium',
      transitionTimingFunction: 'expo',
      _hover: { paddingLeft: 'md' },
      '&[aria-disabled=true]': { cursor: 'default', opacity: '0.45', _hover: { paddingLeft: '0' } },
    },
    year: {
      fontVariantNumeric: 'tabular-nums',
    },
    body: { minWidth: '0', display: 'flex', flexDirection: 'column', gap: 'xs' },
    title: {
      display: 'block',
      transitionProperty: 'colors',
      transitionDuration: 'normal',
      transitionTimingFunction: 'quint',
      'a:hover &': { color: 'action' },
    },
    excerpt: {
      display: 'block',
      maxWidth: 'measure',
    },
    tags: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
      gap: 'sm',
      gridColumn: { base: '2 / 4', md: 'auto' },
    },
    arrow: {
      display: 'flex',
      flexShrink: '0',
      // Recolor and travel on separate clocks — one shorthand, two durations.
      transition:
        '[color {durations.normal} {easings.quint}, transform {durations.medium} {easings.expo}]',
      'a:hover &': { color: 'action', transform: 'translate(4px, -4px)' },
    },
  },
})
