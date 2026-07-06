import { sva } from 'styled-system/css'

export const linkList = sva({
  slots: ['list', 'item', 'link', 'year', 'body', 'title', 'excerpt', 'tags', 'arrow'],
  base: {
    list: { listStyle: 'none', padding: '0', margin: '0', borderBottom: 'hairline' },
    item: { borderTop: 'hairline' },
    link: {
      display: 'grid',
      gridTemplateColumns: {
        base: '40px minmax(0, 1fr) auto',
        md: '60px minmax(0, 1fr) auto auto',
      },
      alignItems: 'center',
      gap: { base: 'sm', md: 'md' },
      paddingBlock: '28px',
      color: 'inherit',
      textDecoration: 'none',
      transition: 'padding-left {durations.medium} {easings.expo}',
      _hover: { paddingLeft: '12px' },
      '&[aria-disabled=true]': { cursor: 'default', opacity: '0.45', _hover: { paddingLeft: '0' } },
    },
    year: {
      fontFamily: 'body',
      fontSize: 'xs',
      fontWeight: 'semibold',
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: 'muted',
      fontVariantNumeric: 'tabular-nums',
    },
    body: { minWidth: '0' },
    title: {
      display: 'block',
      fontFamily: 'display',
      fontSize: { base: 'lg', md: '2xl' },
      lineHeight: 'heading',
      color: 'heading',
      transition: 'color {durations.normal} {easings.quint}',
      'a:hover &': { color: 'action' },
    },
    excerpt: {
      display: 'block',
      marginTop: '4px',
      maxWidth: '60ch',
      fontFamily: 'body',
      fontSize: 'xs',
      lineHeight: 'body',
      color: 'muted',
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
      color: 'muted',
      transition:
        'color {durations.normal} {easings.quint}, transform {durations.medium} {easings.expo}',
      'a:hover &': { color: 'action', transform: 'translate(4px, -4px)' },
    },
  },
})
