import { blobUrl } from '@/lib/blob'
import type { Edition } from '@/types/edition'

export const edition2023: Edition = {
  year: 2023,
  theme: 're#situăriafective',
  themeHighlight: 'afective',
  title: 'ZSB 2023 - re#situăriafective | Bucharest Sculpture Days',
  dateTape: '18–29 April 2023 /// Combinatul Fondului Plastic',
  heroImage: {
    src: blobUrl('2023/resituariafective-02-transp.png'),
    alt: 'ZSB 2023 re#situăriafective',
  },
  thumbImage: {
    src: blobUrl('2023/resituariafective-02.png'),
    alt: 'ZSB 2023 re#situăriafective',
  },
  manifesto: {
    title: 'Forms that hold, not dominate',
    highlight: 'not dominate',
    body: 'In April 2023, ZSB explored sculpture as an act of holding: holding space, holding memory, holding onto difference in a fractured world. The edition included pop-up cinema and debates on heritage restoration, with form treated as a gesture of care. Matter carrying the weight of the personal.',
  },

  themeSection: {
    body: 'The prefix re# is deliberate. Situating is not a neutral act. It is shaped by lived experience: historical, cultural, familial, and personal. The re# signals a return, a repositioning, a doing-again with different knowledge.Within this frame, sculpture becomes a relational practice, capable of mediating between individual grounding and collective space. re#situariafective foregrounded coexistence, care, and vulnerability as structuring principles of form and meaning. Forms that hold, not dominate.',
  },

  artists: [
    'Alina Aldea',
    'Catalin Badarau',
    'Baraka Paul Marat',
    'Alin Carpen',
    'Traian Chereches',
    'Stefan Radu Cretu',
    'Reka Csapo Dup',
    'Darie Dup',
    'Costel Iacob',
    'Costin Ionita',
    'Bianca Mann',
    'Catalin Oancea',
    'Ileana Oancea',
    'Vlad Olariu',
    'Radu Panait',
    'Ana Petrovici Popescu',
    'Sever Petrovici Popescu',
    'Adrian Pirvu',
    'Andrei Pitut',
    'Maria Pop Timaru',
    'Cristian Raduta',
    'Bogdan Rata',
    'Mihai Rusen',
    'Elena Scutaru',
    'Marcel Scutaru',
    'Alexandru Siminic',
    'Ovidiu Toader',
    'Adriana Untilov',
    'Dan Vezentan',
    'Marian Zidaru',
    'Victoria Zidaru',
  ],

  venues: [
    {
      group: 'Combinatul Fondului Plastic',
      subgroup: 'Main Exhibition',
      name: 'SENAT Gallery',
      program: 're#situăriafective',
    },
    {
      group: 'Combinatul Fondului Plastic',
      subgroup: 'Main Exhibition',
      name: 'The Institute Gallery',
      program: 're#situăriafective',
    },
    {
      group: 'Combinatul Fondului Plastic',
      subgroup: 'Main Exhibition',
      name: 'IOMO Gallery',
      program: 're#situăriafective',
    },
    {
      group: 'Combinatul Fondului Plastic',
      subgroup: 'Main Exhibition',
      name: 'Inner Courtyard',
      program: 'Outdoor Installations',
    },
    {
      group: 'Combinatul Fondului Plastic',
      subgroup: 'Partner Exhibition',
      name: 'UNA Gallery',
      program: 'Sculpture Dept. Exhibition',
    },
  ],

  program: {
    dates: 'April 18—29',
    blocks: [
      {
        type: 'Main Exhibition',
        title: 're#situăriafective',
        dates: 'April 18—29, 2023',
        description:
          'Contemporary sculpture exhibition exploring situating as a condition shaped by lived experience: historical, cultural, familial, and personal.',
        column: 1,
      },
      {
        type: 'Film Program',
        title: 'Pop-up Cinema',
        dates: 'April 18, 22, 29',
        description: 'Film screenings with and about sculptors and sculptural practices.',
        column: 2,
      },
      {
        type: 'Talks & Workshops',
        format: 'Roundtable',
        title: 'Restoration',
        dates: 'April 25, 2023',
        description:
          'Access to Specialized Restoration Professions: mentorship, accreditation, theoretical and practical education.',
        column: 1,
      },
    ],
    films: [
      { date: 'Apr 18', title: 'Various Screenings' },
      { date: 'Apr 22', title: 'Sculptural Stories' },
      { date: 'Apr 29', title: 'Film night' },
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
            src: blobUrl('2023/od6-0215.jpg'),
            alt: 'ZSB 2023 Exhibition',
          },
          caption: 'Exhibition',
        },
        {
          image: {
            src: blobUrl('2023/od6-0201.jpg'),
            alt: 'ZSB 2023 Exhibition',
          },
          caption: 'Exhibition',
        },
        {
          image: {
            src: blobUrl('2023/od6-0202.jpg'),
            alt: 'ZSB 2023 Exhibition',
          },
          caption: 'Exhibition',
        },
      ],
    },
    {
      layout: 'featured-stack',
      images: [
        {
          image: {
            src: blobUrl('2023/_dsf4145.jpg'),
            alt: 'ZSB 2023 Exhibition',
          },
          caption: 'Exhibition',
        },
        {
          image: {
            src: blobUrl('2023/od6-0216.jpg'),
            alt: 'ZSB 2023 Exhibition',
          },
          caption: 'Exhibition',
        },
        {
          image: {
            src: blobUrl('2023/od6-0248.jpg'),
            alt: 'ZSB 2023 Exhibition',
          },
          caption: 'Exhibition',
        },
      ],
    },
    {
      layout: 'featured-stack',
      images: [
        {
          image: {
            src: blobUrl('2023/od6-0231.jpg'),
            alt: 'ZSB 2023 Exhibition',
          },
          caption: 'Exhibition',
        },
        {
          image: {
            src: blobUrl('2023/od6-0287.jpg'),
            alt: 'ZSB 2023 Exhibition',
          },
          caption: 'Exhibition',
        },
        {
          image: {
            src: blobUrl('2023/_dsf4065.jpg'),
            alt: 'ZSB 2023 Exhibition',
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
            src: blobUrl('2023/od6-0366.jpg'),
            alt: 'ZSB 2023 Exhibition',
          },
          caption: 'Exhibition',
        },
        {
          image: {
            src: blobUrl('2023/od6-0349.jpg'),
            alt: 'ZSB 2023 Exhibition',
          },
          caption: 'Exhibition',
        },
        {
          image: {
            src: blobUrl('2023/od6-0350.jpg'),
            alt: 'ZSB 2023 Exhibition',
          },
          caption: 'Exhibition',
        },
      ],
    },
    {
      layout: 'featured-stack',
      images: [
        {
          image: {
            src: blobUrl('2023/od6-0361.jpg'),
            alt: 'ZSB 2023 Exhibition',
          },
          caption: 'Exhibition',
        },
        {
          image: {
            src: blobUrl('2023/_dsf4076.jpg'),
            alt: 'ZSB 2023 Exhibition',
          },
          caption: 'Exhibition',
        },
        {
          image: {
            src: blobUrl('2023/od6-0353.jpg'),
            alt: 'ZSB 2023 Exhibition',
          },
          caption: 'Exhibition',
        },
      ],
    },
    {
      layout: 'featured-portrait',
      images: [
        {
          image: {
            src: blobUrl('2023/_dsf4095.jpg'),
            alt: 'ZSB 2023 Exhibition',
          },
          caption: 'Exhibition',
        },
        {
          image: {
            src: blobUrl('2023/od6-0359.jpg'),
            alt: 'ZSB 2023 Exhibition',
          },
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
      value: 'Doina Mandru\nAdriana Oprea\nHorațiu Lipot',
    },
    {
      type: 'partner',
      label: 'Partners',
      value:
        'Combinatul Fondului Plastic\nRomanian Cultural Institute\nNational Heritage Institute\nNational University of Arts Bucharest\nMonument For',
    },
    {
      type: 'partner',
      label: 'Cultural Partners',
      value:
        'Institutul Liszt\nInstitutul Francez din România\nGaleria SENAT\nGaleria IOMO\nUNAgaleria\nTriade Foundation\nFerma de Artă\nDAR Development\nMaria Foundation\nH.D.U. Cultural Association\nIsaac Witkin Estate',
    },
    {
      type: 'secondary',
      label: 'Communication & PR',
      value: 'Aurora Cârstea',
    },
    {
      type: 'secondary',
      label: 'Photo Credit',
      value: 'Sorin Nainer\nRoald Aron',
    },
  ],
}
