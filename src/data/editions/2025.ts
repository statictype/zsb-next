import { blobUrl } from '@/lib/blob'
import type { Edition } from '@/types/edition'

export const edition2025: Edition = {
  year: 2025,
  theme: '#celălaltcorp',
  themeHighlight: 'corp',
  title: 'ZSB 2025 - #celălaltcorp | Bucharest Sculpture Days',
  heroImage: {
    src: blobUrl('2025/instagram_cap3.png'),
    alt: 'The Other Body — Classical bust split to reveal skull beneath',
  },
  dateTape: '16.04-11.05 · Combinatul Fondului Plastic',
  manifesto: {
    title: 'What you see is not all there is',
    highlight: 'not all there is',
    paragraphs: [
      'Everyone has a body. Not everyone has been allowed to show theirs as it is. For its fifth edition, ZSB brought sculpture into direct confrontation with the body as contested territory. Forty-four artists explored form beneath the skin, prioritising the mutant, the scarred, and the vulnerable over the idealised. Sculpture as exposure, not perfection. The body, loud and unpolished.',
    ],
  },

  themeSection: {
    lead: 'The Other Body—beyond ideals, beyond symmetry, beyond approval.',
    body: [
      'What you see is not all there is. Beneath the skin, beyond symmetry and ideals, there are bodies that don’t seek approval: mutant, queer, scarred, vulnerable.',
      'Sculpture no longer idealizes them. It listens. It exposes. It frees.',
      "Under the theme #celălaltcorp | #theotherbody, contemporary sculpture and transmedia practices reframed the human figure beyond ideals and norms, revealing bodies that resist, transform, and redefine presence. From classical ideals to contemporary interventions, the body remains sculpture's most contested territory.",
    ],
    coda: [
      '#theotherbody is about identity, memory, struggle, and becoming. It questions how contemporary sculpture engages with corporeal presence—not as an object of beauty, but as a site of resistance, vulnerability, and transformation.',
    ],
    artistsStatement:
      'The main exhibition #celălaltcorp brought together 44 contemporary artists, whose practices span a wide range of sculptural approaches, materials, and collaborative configurations. Particular attention was given to works that engage with the body as a site of transformation.',
  },

  artists: [
    'Alina Aldea',
    'Ion Anghel',
    'Vlad Basarab',
    'Anca Boeriu',
    'Alin Carpen',
    'Titi Ceara',
    'Traian Chereches',
    'Stefan Radu Cretu',
    'Calin Dan',
    'Misha Diaconu',
    'Darie Dup',
    'Raluca Ilaria Demetrescu',
    'Elena Bobi Dumitrescu',
    'Albert Kaan',
    'Iosif Kiraly',
    'Cristina Lilienfeld',
    'Petru Lucaci',
    'Laurentiu Mogosanu',
    'Dragos Neagoe',
    'Vlad Olariu',
    'Alexandru Papuc',
    'Radu Panait',
    'Radu Pandele',
    'Alexandru Patatics',
    'Cosmin Paulescu',
    'Romelo Pervolovici',
    'Adi Piorescu',
    'Adrian Pirvu',
    'Maria Pop Timaru',
    'Marilena Preda Sanc',
    'Alexandru Ranga',
    'Bogdan Rata',
    'Cristian Raduta',
    'Elena Scutaru',
    'Marcel Scutaru',
    'Sever Petrovici Popescu',
    'Stefan Siminic',
    'Maria Sicoe',
    'Elena Surdu Stanescu',
    'Irina Tanase',
    'Ovidiu Toader',
    'Catalin Udrea',
    'Marian Zidaru',
    'Victoria Zidaru',
  ],

  venues: [
    {
      group: 'Combinatul Fondului Plastic',
      subgroup: 'Main Exhibition',
      name: 'SENAT Gallery',
      program: '#celălaltcorp',
    },
    {
      group: 'Combinatul Fondului Plastic',
      subgroup: 'Main Exhibition',
      name: 'The Institute Gallery',
      program: '#celălaltcorp',
    },
    {
      group: 'Combinatul Fondului Plastic',
      subgroup: 'Main Exhibition',
      name: 'Courtyard',
      program: 'Outdoor Installations',
    },
    {
      group: 'UNAgaleria',
      name: 'UNAgaleria',
      subgroup: 'Exhibition',
      program: '#theotherbody @ UNA',
    },
    {
      group: 'Partner Venues',
      name: 'Gallery Studio 76',
      subgroup: 'Exhibition',
      program: 'About Portraits #3',
    },
    {
      group: 'Partner Venues',
      name: 'H.D.U. Cultural Center',
      subgroup: 'Exhibition',
      program: 'Documentary Screenings',
    },
  ],

  program: {
    dates: 'April 26—May 11',
    blocks: [
      {
        type: 'Exhibition',
        title: '#theotherbody',
        dates: 'April 26—May 11, 2025',
        description:
          'Main exhibition exploring the body as a contested space: between identity and representation, memory and transformation.',
        location: 'Combinatul Fondului Plastic',
        column: 1,
      },
      {
        type: 'Opening Event',
        title: 'International Sculpture Day',
        dates: 'April 26, 2025',
        description:
          'Opening of the #celălaltcorp exhibition and celebration of International Sculpture Day.',
        column: 1,
      },
      {
        type: 'Student Exhibition',
        title: '#theotherbody @ UNA',
        dates: 'April 26—May 11, 2025',
        location: 'UNAgaleria',
        description:
          'Collective exhibition by UNARTE students exploring the theme of the other body.',
        column: 1,
      },
      {
        type: 'Talks & Workshops',
        format: 'Open Studios',
        title: 'Studio Visit',
        dates: 'April 26—May 11, 2025',
        description: 'Marian & Victoria Zidaru',
        column: 2,
      },
      {
        type: 'Talks & Workshops',
        format: 'Open Studios',
        title: 'Studio Visit',
        dates: 'April 26—May 11, 2025',
        description: 'Ana Zoe Pop',
        column: 2,
      },
      {
        type: 'Talks & Workshops',
        format: 'Open Studios',
        title: 'Studio Visit',
        dates: 'April 26—May 11, 2025',
        description: 'Cristian Pentelescu',
        column: 2,
      },
    ],
    films: [
      {
        date: 'Apr 26',
        title: 'DryLandscape (karesansui)',
        note: 'Video-performance by Patatics & Lilienfeld',
      },
      {
        date: 'May 3',
        title: 'NAPO Documentary',
        note: 'Dan Păduraru & Cristi Calist 1995',
      },
      {
        date: 'May 7',
        title: '56/Z Documentary',
      },
      {
        date: 'May 10',
        title: 'About Portraits #3',
        note: 'Gallery Studio 76',
      },
    ],
    sftfBanner: {
      tag: 'Educational Program',
      title: 'Sculptors for the Future',
      description:
        "Each edition ends with an awards ceremony for emerging talent from Bucharest's art schools.",
    },
  },

  carousel: [
    {
      layout: 'featured-stack',
      images: [
        {
          image: {
            src: blobUrl('2025/bws00864.jpg'),
            alt: 'ZSB 2025 Exhibition',
          },
          caption: 'Exhibition',
        },
        {
          image: {
            src: blobUrl('2025/_dsc5744.jpg'),
            alt: 'ZSB 2025 Exhibition',
          },
          caption: 'Exhibition',
        },
        {
          image: {
            src: blobUrl('2025/_dsc5707.jpg'),
            alt: 'ZSB 2025 Gallery View',
          },
          caption: 'Gallery View',
        },
      ],
    },
    {
      layout: 'featured-stack',
      images: [
        {
          image: {
            src: blobUrl('2025/_dsc5566.jpg'),
            alt: 'ZSB 2025 Gallery Space',
          },
          caption: 'Gallery Space',
        },
        {
          image: {
            src: blobUrl('2025/bws02071.jpg'),
            alt: 'ZSB 2025 Exhibition',
          },
          caption: 'Exhibition',
        },
        {
          image: {
            src: blobUrl('2025/bws02057.jpg'),
            alt: 'ZSB 2025 Gallery Space',
          },
          caption: 'Gallery Space',
        },
      ],
    },
    {
      layout: 'featured-stack',
      images: [
        {
          image: {
            src: blobUrl('2025/_dsc5501.jpg'),
            alt: 'ZSB 2025 Gallery Space',
          },
          caption: 'Gallery Space',
        },
        {
          image: {
            src: blobUrl('2025/bws02043.jpg'),
            alt: 'ZSB 2025 Sculpture Detail',
          },
          caption: 'Sculpture Detail',
        },
        {
          image: {
            src: blobUrl('2025/bws02018.jpg'),
            alt: 'ZSB 2025 Exhibition',
          },
          caption: 'Exhibition',
        },
      ],
    },
    {
      layout: 'trio',
      images: [
        {
          image: {
            src: blobUrl('2025/bws01924.jpg'),
            alt: 'ZSB 2025 Exhibition',
          },
          caption: 'Exhibition',
        },
        {
          image: {
            src: blobUrl('2025/_dsc5739.jpg'),
            alt: 'ZSB 2025 Sculpture',
          },
          caption: 'Sculpture',
        },
        {
          image: { src: blobUrl('2025/bws01992.jpg'), alt: 'ZSB 2025 Artwork' },
          caption: 'Artwork',
        },
      ],
    },
    {
      layout: 'trio',
      images: [
        {
          image: {
            src: blobUrl('2025/bws01913.jpg'),
            alt: 'ZSB 2025 Artwork Detail',
          },
          caption: 'Artwork Detail',
        },
        {
          image: {
            src: blobUrl('2025/bws01922.jpg'),
            alt: 'ZSB 2025 Artwork Detail',
          },
          caption: 'Artwork Detail',
        },
        {
          image: {
            src: blobUrl('2025/bws01953.jpg'),
            alt: 'ZSB 2025 Artwork Detail',
          },
          caption: 'Artwork Detail',
        },
      ],
    },
    {
      layout: 'featured-portrait',
      images: [
        {
          image: {
            src: blobUrl('2025/bws00744.jpg'),
            alt: 'ZSB 2025 Exhibition',
          },
          caption: 'Exhibition',
        },
        {
          image: {
            src: blobUrl('2025/bws00842.jpg'),
            alt: 'ZSB 2025 Sculpture',
          },
          caption: 'Sculpture',
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
      label: 'Supported by',
      value: 'Ministry of Culture',
      detail: 'Romania',
      logo: '/img/partners/logo-ministerul-culturii.png',
      logoAlt: 'Ministerul Culturii',
    },
    {
      type: 'primary',
      label: 'Curator',
      value: 'Reka Csapo Dup',
    },
    {
      type: 'secondary',
      label: 'Art Critics',
      value: 'Adriana Oprea\nHoratiu Lipot',
    },
    {
      type: 'partner',
      label: 'Partners',
      value:
        'UAPR\nCombinatul Fondului Plastic\nCombinat.ro\nUNARTE\nGaleria SENAT\nGaleria The Institute\nCompas Coffee\nCrama Anul Zero',
    },
    {
      type: 'partner',
      label: 'Cultural Partners',
      value:
        'Liszt Institute\nUNAgaleria\nFerma de Arta\nH.D.U.\nDAR Development\nIsaac Witkin Estate\nTonitza High School\nPaciurea High School\nGallery Studio 76',
    },
    {
      type: 'secondary',
      label: 'Communication & PR',
      value: 'Aurora Carstea',
    },
    {
      type: 'secondary',
      label: 'Photo Credit',
      value: 'Sorin Nainer\nDarie Dup\nStefan Bogdan\nFlorin Aldea',
    },
  ],
}
