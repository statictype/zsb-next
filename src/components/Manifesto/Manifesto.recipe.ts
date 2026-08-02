import { sva } from 'styled-system/css'

export const manifesto = sva({
  slots: ['section', 'container', 'title', 'titleHighlight', 'content'],
  base: {
    section: {
      // ground (light) + rhythm (lg) come from `section()` in the component;
      // `container` is the rail, so it owns the gutter.
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
      color: 'black',
    },
    // The highlighted substring inside the headline (the optional accent).
    titleHighlight: { display: 'inline', color: 'action' },
    content: { paddingTop: { base: '0', lg: 'md' } },
  },
})
