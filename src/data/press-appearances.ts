/**
 * Press coverage of Bucharest Sculpture Days.
 *
 * `type` drives the icon shown next to each row.
 *   - 'youtube'    → video / interview on YouTube
 *   - 'vimeo'      → video on Vimeo
 *   - 'soundcloud' → audio / podcast / radio
 *   - 'article'    → online article or print
 *   - 'tv'         → broadcast segment
 */
export type PressAppearanceType = 'youtube' | 'vimeo' | 'soundcloud' | 'article' | 'tv'

export interface PressAppearance {
  type: PressAppearanceType
  title: string
  year: number
  url: string
  excerpt?: string
  tag: string
}

export const PRESS_APPEARANCES: PressAppearance[] = [
  {
    type: 'soundcloud',
    title: 'Reka Csapo Dup, Radio Romania International',
    year: 2025,
    tag: 'interview',
    url: 'https://soundcloud.com/radioromaniainternational/interviu-reka-csapo-dup-curatoare-despre-zilele-sculpturii-bucuresti-2025',
  },
  {
    type: 'youtube',
    title: 'Intrare Libera, TVR Cultural',
    year: 2024,
    tag: 'TV',
    url: 'https://youtu.be/CI8Dq3I9CTI?si=PinacaxLyfpKi59J',
  },
  {
    type: 'youtube',
    title: 'Jurnal Cultural, TVR Cultural',
    year: 2023,
    tag: 'TV',
    url: 'https://www.youtube.com/watch?v=d2DExa1AhpY&list=PLga_ov2ae3I0lXakqsZFOkonAoDz9jxSU&index=33',
  },
  {
    type: 'vimeo',
    title: 'Video summary, SensoArte',
    year: 2023,
    tag: 'interview',
    url: 'https://vimeo.com/820863868',
  },
]
