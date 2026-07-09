import { sva } from 'styled-system/css'

/**
 * Manifesto — co-located slot recipe.
 *
 * First consumer of the `sectionLight` layerStyle. Uses the looser `sectionYLg`
 * rhythm token. The title is a single column that becomes a 2-column grid at lg+;
 * the body sits behind the shared ground-aware brush-stroke rule.
 */
export const manifesto = sva({
  slots: ['section', 'container', 'title', 'titleHighlight', 'content', 'text'],
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
    // The manifesto headline owns its own display treatment — deliberately not
    // the `sectionTitle` / `SectionHeading` role (which is smaller + uppercase).
    title: {
      fontFamily: 'display',
      fontSize: { base: '2xl', xl: '3xl', '3xl': '4xl' },
      lineHeight: { base: 'tight', md: 'display', '4xl': 'tight' },
      color: 'black',
      textWrap: '[pretty]',
    },
    // The highlighted substring inside the headline (the optional accent).
    titleHighlight: { display: 'inline', color: 'action' },
    content: { paddingTop: { base: '0', lg: 'md' } },
    text: {
      position: 'relative',
      paddingLeft: { base: 'md', md: 'lg' },
      _before: {
        layerStyle: 'brushStrokeRule',
        left: '0',
        top: '0',
        bottom: '0',
        width: 'brushStroke',
        background:
          '[linear-gradient(180deg, token(colors.brushStroke) 0%, token(colors.brushStroke) 72%, transparent 100%)]',
        clipPath: 'token(assets.brushStrokeY)',
      },
      '& p': {
        textStyle: 'leadLarge',
        color: 'body',
      },
    },
  },
})
