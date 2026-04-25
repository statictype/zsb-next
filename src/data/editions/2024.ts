import { blobUrl } from '@/lib/blob'
import type { Edition } from '@/types/edition'

export const edition2024: Edition = {
  year: 2024,
  theme: '#SYZYGY',
  themeHighlight: 'SYZYGY',
  title: 'ZSB 2024 - #SYZYGY | Bucharest Sculpture Days',
  heroImage: {
    src: blobUrl('2024/background.png'),
    alt: 'ZSB 2024 #SYZYGY',
  },
  manifesto: {
    title: 'Where forms align, art unveils',
    highlight: 'art unveils',
    paragraphs: [
      'For its fourth edition, ZSB functioned as a gravitational field. Operating under the theme #SYZYGY, it transformed Combinatul Fondului Plastic into a space where sculpture, film, and debate collided. We moved beyond the static pedestal to explore art as a system of tension—an active friction between materials, generations, and disciplines. It was two weeks of celestial alignment, grounded in the messy reality of contemporary practice.',
    ],
  },
  dateTape: '16.04-11.05 · Combinatul Fondului Plastic',
  themeSection: {
    lead: '',
    body: [
      'Borrowed from astronomy, syzygy describes the alignment of celestial bodies. Transposed into sculpture, it becomes a model for understanding how form emerges through resistance and proximity.',
      'Syzygy is treated first as a material condition. Opposing substances meet. Friction appears. From this friction, clarity is produced. Form becomes legible precisely because materials do not easily agree.',
      'It is also a method of working. The artist steps back from full control. Authorship loosens. Materials and processes are allowed to intervene. The work is shaped through negotiation rather than domination.',
      'At the same time, syzygy functions as a relational state. It exists between artist and object. Between creator and creation. Between individual practice and the wider system in which it operates.',
    ],
    coda: [],
    artistsStatement: '',
  },

  artists: [
    'Alina Aldea',
    'Ioan Bolborea',
    'Traian Chereches',
    'Sergiu Chihaia',
    'Florin Codre',
    'Mihai Cosuletu',
    'Stefan Radu Cretu',
    'Calin Dan',
    'Valentin Duicu',
    'Reka Csapo Dup',
    'Darie Dup',
    'Laszlo Forray',
    'Raluca Ghideanu',
    'Cristian Emil Ghita',
    'Teodor Graur',
    'Albert Kaan',
    'Aurora Kiraly',
    'Alexandru Marinete',
    'Constantin Mirzea',
    'Alexandru Papuc',
    'Cosmin Paulescu',
    'Ana Petrovici Popescu',
    'Sever Petrovici Popescu',
    'Maria Pop Timaru',
    'Alexandru Ranga',
    'Bogdan Rata',
    'Elena Scutaru',
    'Marcel Scutaru',
    'Stefan Siminic',
    'George Tanase',
    'Irina Tanase',
    'Mihai Zgondiu',
    'Marian Zidaru',
    'Victoria Zidaru',
  ],

  venues: [
    {
      group: 'Combinatul Fondului Plastic',
      subgroup: 'Main Exhibition',
      name: 'SENAT Gallery',
      program: '#SYZYGY',
    },
    {
      group: 'Combinatul Fondului Plastic',
      subgroup: 'Main Exhibition',
      name: 'The Institute',
      program: '#SYZYGY',
    },
    {
      group: 'Combinatul Fondului Plastic',
      subgroup: 'Main Exhibition',
      name: 'Courtyard',
      program: 'Outdoor Installations',
    },
    {
      group: 'Combinatul Fondului Plastic',
      subgroup: 'Solo Exhibition',
      name: 'Galeria IOMO',
      program: 'Alexandru Ranga',
    },
    {
      group: 'Combinatul Fondului Plastic',
      subgroup: 'Open Doors 7',
      name: 'Sector 1',
      program: 'Open Studios',
    },
    {
      group: 'Combinatul Fondului Plastic',
      subgroup: 'Open Doors 7',
      name: 'UNA Gallery',
      program: 'Open Studios',
    },
    {
      group: 'Galeria Simeza',
      name: 'Galeria Simeza',
      subgroup: 'Exhibition',
      program: 'Scrinium Curiositatum',
    },
    {
      group: 'Open Doors 7 Partners',
      name: 'Nicodim Gallery',
      program: 'Open Studios',
      subgroup: 'Open Doors',
    },
    {
      group: 'Open Doors 7 Partners',
      name: 'ArtSafe',
      program: 'Open Studios',
      subgroup: 'Open Doors',
    },
  ],

  program: {
    dates: 'April 11—28',
    blocks: [
      {
        type: 'Exhibition',
        title: '#SYZYGY',
        dates: 'April 11—28, 2024',
        description:
          'Contemporary sculpture exhibition at Combinatul Fondului Plastic — an extended field of relations where form emerges through resistance and proximity.',
        location: 'Combinatul Fondului Plastic',
        column: 1,
      },
      {
        type: 'Special Event',
        title: 'International Sculpture Day',
        dates: 'April 27, 2024',
        description:
          'Launch of the #SYZYGY exhibition catalogue and public gathering celebrating sculpture worldwide.',
        column: 2,
      },
      {
        type: 'Talks & Workshops',
        title: 'Roundtable: 3D Digitization of Monuments',
        dates: 'April 11—28, 2024',
        description: 'Heritage protection & EU recommendations',
        column: 1,
      },
      {
        type: 'Talks & Workshops',
        title: 'Workshop: Pinholeday#ZSB',
        dates: 'April 11—28, 2024',
        description: 'Pinhole photography with on-site darkroom',
        column: 1,
      },
    ],
    films: [
      { date: 'Apr 13', title: "Sculptor's Hand" },
      { date: 'Apr 18', title: 'Material Dialogues' },
      { date: 'Apr 20', title: 'Form & Void' },
      { date: 'Apr 25', title: 'Biographies of Artist Couples' },
    ],
    sftfBanner: {
      tag: 'Educational Program',
      title: 'Sculptors for the Future',
      description: "Annual competition showcasing emerging talent from Bucharest's art schools.",
      href: '#',
    },
  },

  carousel: [
    {
      layout: 'featured-stack',
      images: [
        {
          image: { src: blobUrl('2024/photocredit_roald_aron.jpg'), alt: 'ZSB 2024 Exhibition' },
          caption: 'Exhibition',
        },
        {
          image: { src: blobUrl('2024/_dsc0800.jpg'), alt: 'ZSB 2024 Exhibition' },
          caption: 'Exhibition',
        },
        {
          image: { src: blobUrl('2024/red.jpg'), alt: 'ZSB 2024 Exhibition' },
          caption: 'Exhibition',
        },
      ],
    },
    {
      layout: 'featured-portrait',
      images: [
        {
          image: { src: blobUrl('2024/dscf3937.jpg'), alt: 'ZSB 2024 Gallery Space' },
          caption: 'Gallery Space',
        },
        {
          image: { src: blobUrl('2024/dscf3916.jpg'), alt: 'ZSB 2024 Sculpture Detail' },
          caption: 'Sculpture Detail',
        },
      ],
    },
    {
      layout: 'trio',
      images: [
        {
          image: { src: blobUrl('2024/dscf4473.jpg'), alt: 'ZSB 2024 Sculpture' },
          caption: 'Sculpture',
        },
        {
          image: { src: blobUrl('2024/victoria_(2).jpg'), alt: 'ZSB 2024 Artwork' },
          caption: 'Artwork',
        },
        {
          image: { src: blobUrl('2024/dscf4583.jpg'), alt: 'ZSB 2024 Exhibition' },
          caption: 'Exhibition',
        },
      ],
    },
    {
      layout: 'featured-portrait',
      images: [
        {
          image: { src: blobUrl('2024/dscf4244.jpg'), alt: 'ZSB 2024 Artwork Detail' },
          caption: 'Artwork Detail',
        },
        {
          image: { src: blobUrl('2024/dscf3907.jpg'), alt: 'ZSB 2024 Artwork Detail' },
          caption: 'Artwork Detail',
        },
      ],
    },
    {
      layout: 'featured-stack',
      images: [
        {
          image: { src: blobUrl('2024/dscf3934_roald_aron.jpg'), alt: 'ZSB 2024 Sculpture' },
          caption: 'Sculpture',
        },
        {
          image: { src: blobUrl('2024/_dsc0692.jpg'), alt: 'ZSB 2024 Gallery View' },
          caption: 'Gallery View',
        },
        {
          image: { src: blobUrl('2024/_dsc0785.jpg'), alt: 'ZSB 2024 Artwork' },
          caption: 'Artwork',
        },
      ],
    },
    {
      layout: 'featured-stack',
      images: [
        {
          image: { src: blobUrl('2024/night2.jpg'), alt: 'ZSB 2024 Main Hall' },
          caption: 'Main Hall',
        },
        {
          image: { src: blobUrl('2024/dscf4206.jpg'), alt: 'ZSB 2024 Exhibition Detail' },
          caption: 'Exhibition Detail',
        },
        {
          image: { src: blobUrl('2024/night1.jpg'), alt: 'ZSB 2024 Exhibition Detail' },
          caption: 'Exhibition Detail',
        },
      ],
    },
    {
      layout: 'featured-portrait',
      images: [
        {
          image: { src: blobUrl('2024/immersive.jpg'), alt: 'ZSB 2024 Exhibition' },
          caption: 'Exhibition',
        },
        {
          image: { src: blobUrl('2024/zgondy.jpg'), alt: 'ZSB 2024 Exhibition' },
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
      value: 'Doina Mandru\nAdriana Oprea\nHoratiu Lipot',
    },
    {
      type: 'partner',
      label: 'Partners',
      value:
        'Combinatul Fondului Plastic\nRomanian Cultural Institute\nNational Institute of Heritage\nGaleria IOMO\nCombinat.ro\nThe Institute\nCramele Recaș',
    },
    {
      type: 'partner',
      label: 'Cultural Partners',
      value:
        'SENAT Gallery\nH.D.U. Cultural Association\nIsaac Witkin Estate\nVisual Arts Forum Association\nShort Film Breaks\nBiographies of Artist Couples\nArché\nBUNA Foundation (BG)\nTriade Foundation\nFerma de Artă\nDAR Development\nMaria Foundation\nDoi Joi\nSL-Jazzing',
    },
    {
      type: 'secondary',
      label: 'Communication & PR',
      value: 'Aurora Cârstea',
    },
    {
      type: 'secondary',
      label: 'Photo Credit',
      value: 'Sorin Nainer\nDarie Dup\nRoald Aron',
    },
  ],
}
