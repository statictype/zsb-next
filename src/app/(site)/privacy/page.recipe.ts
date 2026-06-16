import { sva } from 'styled-system/css'

/**
 * Privacy page — co-located slot recipe.
 *
 * The legible long-form privacy/cookies article on the dark ground. `body` owns
 * its full padding (top 0 — the pageHero above already provides the gap) so the
 * offset is deterministic. The `article` styles its Portable-Text descendants
 * (h2/a/strong/ul/li) via element selectors. The shared hero header uses inline
 * `css(layerStyle/textStyle)` at the call site.
 */
export const privacyPage = sva({
  slots: ['article', 'settingsRow', 'updated'],
  base: {
    article: {
      maxWidth: '70ch',
      display: 'flex',
      flexDirection: 'column',
      gap: 'md',
      fontFamily: 'body',
      fontSize: 'base',
      lineHeight: 'body',
      color: 'body',
      '& h2': {
        fontFamily: 'display',
        fontSize: 'xl',
        lineHeight: 'display',
        color: 'heading',
        letterSpacing: '-0.5px',
        marginTop: 'lg',
      },
      '& h2:first-child': { marginTop: '0' },
      '& a': {
        color: 'heading',
        textDecoration: 'underline',
        textUnderlineOffset: '3px',
        textDecorationColor: 'action',
        _hover: { color: 'action' },
      },
      '& strong': { color: 'heading', fontWeight: 'semibold' },
      '& ul': {
        listStyle: 'none',
        padding: '0',
        display: 'flex',
        flexDirection: 'column',
        gap: 'sm',
      },
      '& li': { paddingLeft: 'md', borderLeft: '2px solid token(colors.borderDark)' },
    },
    settingsRow: {
      marginTop: 'xs',
      padding: 'md',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'borderDark',
      borderRadius: '2px',
      display: 'inline-flex',
    },
    updated: {
      marginTop: 'xl',
      fontSize: 'xs',
      color: 'muted',
      textTransform: 'uppercase',
      letterSpacing: 'label',
    },
  },
})
