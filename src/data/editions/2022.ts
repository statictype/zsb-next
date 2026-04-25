import { blobUrl } from '@/lib/blob'
import type { Edition } from '@/types/edition'

export const edition2022: Edition = {
  year: 2022,
  theme: '#perspectiva31',
  themeHighlight: '31',
  title: 'ZSB 2022 - #perspectiva31 | Bucharest Sculpture Days',
  dateTape: '16–18 April 2022 · Combinatul Fondului Plastic',
  heroImage: {
    src: blobUrl('2022/sal2.jpg'),
    alt: 'ZSB 2022 #perspectiva31 — Exhibition hall at Combinatul Fondului Plastic',
  },
  manifesto: {
    title: 'More art, more perspectives',
    highlight: 'more perspectives',
    paragraphs: [
      'The 2022 edition marked our arrival in physical space. For the first time, ZSB brought contemporary practice into direct contact with the city, establishing a tangible dialogue between object and viewer. Under the theme #perspectiva31, we built a shared space for conflicting ideas and cross-generational conversations. From professional roundtables on monument protection to our annual youth competition, where students reimagined the Arc de Triomphe, the festival prioritized a wide spectrum of viewpoints over a single narrative.',
    ],
  },

  themeSection: {
    lead: 'There is no single voice, only coexistence and friction. Meaning is produced through presence, not consensus.',
    body: [
      'Perspective is not observed, but assumed. Enter #perspectiva31. Practice your perspective. #perspectiva31 proposed sculpture not as a unified style, but as a shared space of positions. Thirty-one works coexisted without hierarchy, forming a constellation of voices shaped by different generations, trajectories, and moments of practice.',
      'Materials, forms, and concepts diverged, yet they converged in a common commitment to the public realm—where meaning is unstable, memory contested, and presence never neutral. #perspectiva31 framed sculpture as a living practice: critical and poetic, grounded in materiality yet open to reinterpretation.',
    ],
    coda: ['Here, sculpture was understood as a form of responsibility.'],
    artistsStatement:
      'The main exhibition #perspectiva31 brought together 31 contemporary artists, whose practices span a wide range of sculptural approaches, materials, and collaborative configurations.',
  },

  artists: [
    'Alina Aldea',
    'Catalin Badarau',
    'Alina Buga',
    'Alin Carpen',
    'Titi Ceara',
    'Dumitru Cojocaru',
    'Darie Dup',
    'Claudiu Filimon',
    'Nicolae Fleissig',
    'Catalin Geana',
    'Adrian Ilfoveanu',
    'Costel Iacob',
    'Costin Ionita',
    'Ovidiu Maitec',
    'Bianca Mann',
    'Marianov Bata',
    'Laurentiu Mogosanu',
    'Dragos Neagoe',
    'Alexandru Papuc',
    'Adrian Pirvu',
    'Ana Zoe Pop',
    'Cristian Raduta',
    'Mihai Rusen',
    'Virgil Scripcariu',
    'Elena Scutaru',
    'Marcel Scutaru',
    'Patricia Teodorescu',
    'Maria Pop Timaru',
    'Napoleon Tiron',
    'Marian Zidaru',
    'Victoria Zidaru',
  ],

  venues: [
    {
      group: 'Combinatul Fondului Plastic',
      subgroup: 'Main Exhibition',
      name: 'The Institute Gallery',
      program: '#perspectiva31',
    },
    {
      group: 'Combinatul Fondului Plastic',
      subgroup: 'Main Exhibition',
      name: 'Inner Courtyard',
      program: '#perspectiva31',
    },
    {
      group: 'UNA Gallery',
      subgroup: 'Round Table',
      name: 'Main Hall',
      program: 'Monuments in Bucharest',
    },
  ],

  program: {
    dates: 'April 16—18',
    blocks: [
      {
        type: 'Main Exhibition',
        title: '#perspectiva31',
        dates: 'April 16—18, 2022',
        description:
          'A curatorial exploration of plurality, monumentality, and sculpture’s role in the city. The Institute Gallery and inner courtyard.',
        column: 1,
      },
      {
        type: 'Talks & Workshops',
        title: 'Monuments in Bucharest: From Becoming to Protection',
        dates: 'April 18, 2022',
        description:
          'Round table on the life of monuments in public space, from symbolic formation to preservation. UNA Gallery.',
        column: 1,
      },
      {
        type: 'Special Event',
        title: 'International Sculpture Day',
        dates: 'April 16, 2022',
        description:
          'Launch of the #SYZYGY exhibition catalogue and public gathering celebrating sculpture worldwide.',
        column: 2,
      },
      {
        type: 'Talks & Workshops',
        title: 'Artist Studios & Galleries',
        dates: 'April 16—18, 2022',
        description:
          'A number of artist studios and galleries located within Combinatul Fondului Plastic open to the public.',
        column: 2,
      },
    ],
    sftfBanner: {
      tag: 'Educational Program',
      title: 'Sculptors for the Future',
      description: 'Modeling competition. Theme: The Arc de Triomphe — My Perspective.',
      href: '#',
    },
  },

  carousel: [
    {
      layout: 'featured-stack',
      images: [
        {
          image: { src: blobUrl('2022/curte.jpg'), alt: 'ZSB 2022 Courtyard' },
          caption: 'Courtyard',
        },
        {
          image: { src: blobUrl('2022/vernisaj.jpg'), alt: 'ZSB 2022 Opening' },
          caption: 'Opening',
        },
        {
          image: { src: blobUrl('2022/zidm3.jpg'), alt: 'ZSB 2022 Exhibition' },
          caption: 'Exhibition',
        },
      ],
    },
    {
      layout: 'full',
      images: [
        {
          image: { src: blobUrl('2022/dup2.jpg'), alt: 'ZSB 2022 Exhibition' },
          caption: 'Exhibition',
        },
      ],
    },
    {
      layout: 'featured-stack',
      images: [
        {
          image: { src: blobUrl('2022/sal2.jpg'), alt: 'ZSB 2022 Exhibition' },
          caption: 'Exhibition',
        },
        {
          image: { src: blobUrl('2022/mann3.jpg'), alt: 'ZSB 2022 Exhibition' },
          caption: 'Exhibition',
        },
        {
          image: { src: blobUrl('2022/zidm4.jpg'), alt: 'ZSB 2022 Exhibition' },
          caption: 'Exhibition',
        },
      ],
    },
  ],

  credits: [
    {
      type: 'primary',
      label: 'Organizer',
      value: 'Sculpture Branch',
      detail: 'Union of Visual Artists of Romania',
      logo: '/img/partners/UAPR.png',
      logoAlt: 'UAPR',
    },
    {
      type: 'primary',
      label: 'In Partnership With',
      value: 'Municipality of Bucharest',
      detail: 'General Directorate for Landscape Architecture and Public Monuments — MONUMENT for',
    },
    {
      type: 'primary',
      label: 'Curator',
      value: 'Reka Csapo Dup',
    },
    {
      type: 'secondary',
      label: 'Art Critics',
      value: 'Ioana Vlasiu\nDoina Mandru',
    },
    {
      type: 'partner',
      label: 'Supported by',
      value:
        'Union of Visual Artists of Romania\nRomanian Cultural Institute\nCombinatul Fondului Plastic\ncombnat.ro\nUNA Gallery',
    },
    {
      type: 'secondary',
      label: 'Communication & PR',
      value: 'Aurora Carstea',
    },
  ],
}
