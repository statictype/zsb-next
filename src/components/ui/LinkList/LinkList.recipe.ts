import { sva } from 'styled-system/css'

export const linkList = sva({
  slots: ['list', 'item', 'link', 'year', 'body', 'title', 'subtitle', 'excerpt', 'tags', 'arrow'],
  base: {
    // List margins/padding are already zeroed by the base reset.
    list: { listStyle: 'none', borderBottom: 'hairline' },
    item: { borderTop: 'hairline' },
    link: {
      display: 'grid',
      alignItems: 'center',
      gap: { base: 'sm', md: 'md' },
      paddingBlock: 'lg',
      // The hover indent rides transform (not padding) so it composites
      // instead of relayouting the row.
      transition: 'develop',
      _hover: { transform: 'translateX(token(spacing.md))' },
    },
    year: {
      fontVariantNumeric: 'tabular-nums',
    },
    body: { minWidth: '0', display: 'flex', flexDirection: 'column', gap: 'xs' },
    title: {
      display: 'block',
      transition: 'interactive',
      'a:hover &': { color: 'action' },
    },
    subtitle: {
      display: 'block',
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
    },
    arrow: {
      display: 'flex',
      flexShrink: '0',
      transition: 'interactive',
      'a:hover &': { color: 'action', transform: 'translate(4px, -4px)' },
    },
  },
  variants: {
    emphasis: {
      title: {
        link: {
          gridTemplateColumns: {
            base: '40px minmax(0, 1fr) auto',
            md: '60px minmax(0, 1fr) auto auto',
          },
        },
        tags: { gridColumn: { base: '2 / 4', md: 'auto' } },
      },
      year: {
        link: { gridTemplateColumns: 'minmax(0, 1fr) auto' },
        body: { gap: { base: 'xs', md: 'sm' } },
      },
    },
  },
  defaultVariants: { emphasis: 'title' },
})
