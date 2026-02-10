import type { EditionCardData } from '@/components/EditionCard/EditionCard'

export const editionCards: EditionCardData[] = [
  {
    year: 2025,
    theme: '#celălaltcorp',
    description:
      'The other body — exploring corporeality, presence, and the boundaries between self and sculpture.',
    href: '/editions/2025',
    variant: 'sculpture',
    cardImage: {
      basePath: '/img/2025/optimized/instagram_cap3',
      alt: 'ZSB 2025 #celălaltcorp',
      ext: 'png',
    },
  },
  {
    year: 2024,
    theme: '#syzygy',
    description:
      'Celestial alignments and the gravitational pull between bodies, materials, and meaning.',
    href: '/editions/2024',
    cardImage: {
      basePath: '/img/2024/optimized/background',
      alt: 'ZSB 2024 #syzygy',
    },
  },
  {
    year: 2023,
    theme: 're#situari afective',
    description:
      'Reimagining affective territories through sculptural interventions in urban and emotional landscapes.',
    href: '/editions/2023',
    cardImage: {
      basePath: '/img/2023/optimized/background',
      alt: 'ZSB 2023 re#situăriafective',
    },
  },
  {
    year: 2022,
    theme: '#perspectiva31',
    description:
      'A fresh perspective on sculpture 31 years after the Romanian revolution — transformation and memory.',
    href: '/editions/2022',
    variant: 'tiled',
    tiledBg: '/img/2022/optimized/tile-2.webp',
  },
  {
    year: 2021,
    theme: 'Inaugural Edition',
    description:
      'The first Bucharest Sculpture Days, held entirely online during the pandemic. A digital beginning for a physical art form.',
    href: '#',
    variant: 'online',
  },
]
