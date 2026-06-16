import { sva } from 'styled-system/css'

/**
 * Manifesto — co-located slot recipe.
 *
 * First consumer of the `sectionLight` layerStyle. Uses the looser `sectionYLg`
 * rhythm token. The title is a single column that becomes a 2-column grid at lg+;
 * the body sits behind an accent gradient rule.
 */
export const manifesto = sva({
  slots: ['section', 'container', 'titleHighlight', 'content', 'text'],
  base: {
    section: {
      // ground (light) + rhythm (lg) come from `section()` in the component;
      // `container` is the rail, so it owns the gutter.
      position: 'relative',
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2xl',
      maxWidth: 'maxWidth',
      marginInline: 'auto',
      paddingInline: 'gutter',
      lg: {
        display: 'grid',
        gridTemplateColumns: '0.8fr 1.2fr',
        gap: 'gridGap',
        alignItems: 'start',
      },
      xl: { gridTemplateColumns: '1fr 1fr' },
    },
    // The highlighted substring inside the headline — kept as its own slot.
    titleHighlight: { display: 'inline', color: 'action' },
    content: { paddingTop: { base: '0', lg: '20px' } },
    text: {
      position: 'relative',
      paddingLeft: { base: 'md', md: '40px' },
      _before: {
        content: '""',
        position: 'absolute',
        left: '0',
        top: '0',
        bottom: '0',
        width: '2px',
        background: 'linear-gradient(to bottom, {colors.action}, transparent)',
      },
      '& p': {
        fontFamily: 'body',
        fontSize: { base: 'base', '3xl': 'md' },
        fontWeight: { '3xl': 'light' },
        lineHeight: 'body',
        color: 'bodyLight',
        textWrap: 'pretty',
      },
    },
  },
})
