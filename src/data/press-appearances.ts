/**
 * Placeholder press coverage. Replace items with the real list when available.
 *
 * `type` drives the icon shown next to each row.
 *   - 'youtube'    → video / interview
 *   - 'soundcloud' → audio / podcast / radio
 *   - 'article'    → online article or print
 *   - 'tv'         → broadcast segment
 */
export type PressAppearanceType = 'youtube' | 'soundcloud' | 'article' | 'tv'

export interface PressAppearance {
  type: PressAppearanceType
  outlet: string
  title: string
  date: string
  url: string
  excerpt?: string
}

export const PRESS_APPEARANCES: PressAppearance[] = [
  {
    type: 'youtube',
    outlet: 'TVR Cultural',
    title: 'Conversation with the curator on #celălaltcorp',
    date: '2025-05-04',
    url: 'https://www.youtube.com/',
    excerpt: 'A long-form interview with Reka Csapo Dup on the body as a contested landscape.',
  },
  {
    type: 'article',
    outlet: 'Scena9',
    title: 'Sculpture refuses to behave: inside ZSB 2025',
    date: '2025-04-29',
    url: 'https://www.scena9.ro/',
    excerpt: 'A walk-through of the main exhibition at Combinatul Fondului Plastic.',
  },
  {
    type: 'soundcloud',
    outlet: 'Radio România Cultural',
    title: 'Sculpture in public space — a panel',
    date: '2024-09-12',
    url: 'https://soundcloud.com/',
    excerpt: 'Recorded at UNAgaleria during the #syzygy edition.',
  },
  {
    type: 'tv',
    outlet: 'Digi24',
    title: 'Bucharest Sculpture Days — opening night coverage',
    date: '2024-04-20',
    url: 'https://www.digi24.ro/',
  },
  {
    type: 'article',
    outlet: 'Revista ARTA',
    title: 'Notes on re#situări afective',
    date: '2023-05-18',
    url: 'https://revistaarta.ro/',
    excerpt: 'A critical reading of the 2023 edition and the curatorial gesture.',
  },
  {
    type: 'youtube',
    outlet: 'Modernism.ro',
    title: 'Studio visits with the ZSB sculptors',
    date: '2022-04-30',
    url: 'https://www.youtube.com/',
  },
]
