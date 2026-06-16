import { sva } from 'styled-system/css'

/**
 * Disclosure — the shared native `<details>/<summary>` chrome.
 *
 * Standardizes the disclosure *chrome only* — the summary row, the trailing
 * meta/chevron group, the chevron rotation on `[open]`, focus/hover affordance,
 * and reduced-motion handling. The summary label and the panel content are the
 * caller's (passed in), as is any border treatment on the `<details>` root.
 */
export const disclosure = sva({
  slots: ['root', 'summary', 'trailing', 'chevron', 'panel'],
  base: {
    summary: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'md',
      paddingBlock: 'md',
      cursor: 'pointer',
      listStyle: 'none',
      // Hide the native marker (Safari + the rest).
      '&::-webkit-details-marker': { display: 'none' },
      _focusVisible: { outline: '2px solid token(colors.highlight)', outlineOffset: '3px' },
    },
    // Trailing group: optional meta (e.g. a count) then the chevron.
    trailing: { display: 'flex', alignItems: 'center', gap: '10px', flexShrink: '0' },
    chevron: {
      color: 'muted',
      flexShrink: '0',
      transition: 'transform {durations.fast} {easings.quint}',
      'details[open] &': { transform: 'rotate(180deg)' },
      '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
    },
    // Sensible vertical stack for panel content; callers supply the content.
    panel: { display: 'flex', flexDirection: 'column', gap: 'lg', paddingBottom: 'lg' },
  },
})
