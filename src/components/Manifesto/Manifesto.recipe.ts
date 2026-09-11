import { sva } from 'styled-system/css'

export const manifesto = sva({
  slots: ['section', 'container', 'title', 'content'],
  base: {
    section: {
      // ground + rhythm come from `section()` in the component; `container` is
      // the rail, so it owns the gutter.
      position: 'relative',
    },
    container: {
      gap: '2xl',
      maxWidth: 'maxWidth',
      marginInline: 'auto',
      paddingInline: 'gutter',
      lg: {
        gap: 'gridGap',
        alignItems: 'start',
      },
    },
    title: {
      textWrap: '[pretty]',
    },
    content: { paddingTop: { base: '0', lg: 'md' } },
  },
})
