export interface AudienceProfile {
  title: string
  desc: string
}

export interface Benefit {
  type: string
  title: string
  text: string
}

export interface Allocation {
  title: string
  text: string
}

export interface WhySculpturePoint {
  title: string
  text: string
}

export const audienceProfiles: AudienceProfile[] = [
  {
    title: 'Art Professionals & Collectors',
    desc: 'Curators, gallery directors, museum professionals, and private collectors who follow ZSB as a key indicator of sculptural trends in the region.',
  },
  {
    title: 'Cultural Institutions',
    desc: 'Embassies, cultural centres, foundations, and municipal organizations that collaborate with ZSB on programming, venues, and outreach.',
  },
  {
    title: 'Media & Press',
    desc: 'National and international arts media, cultural journalists, photographers, and documentary filmmakers who cover the event annually.',
  },
  {
    title: 'General Public',
    desc: 'Design-minded urbanites, students, families, and tourists who encounter sculpture in public space — often for the first time — through ZSB events.',
  },
]

export const benefits: Benefit[] = [
  {
    type: 'Brand',
    title: 'Visibility & Brand Alignment',
    text: "Your brand appears alongside some of Eastern Europe's most compelling contemporary art. ZSB's visual identity, editorial quality, and cultural seriousness reflect directly on every partner.",
  },
  {
    type: 'Legacy',
    title: 'Cultural Impact',
    text: "Supporting ZSB means supporting the preservation and evolution of sculptural practice — one of humanity's oldest art forms. Your contribution has tangible, lasting cultural value.",
  },
  {
    type: 'Network',
    title: 'Exclusive Access & Networking',
    text: 'Partners receive invitations to private viewings, studio visits, opening events, and direct access to a network of artists, curators, and cultural leaders across Romania and beyond.',
  },
  {
    type: 'Identity',
    title: 'Association with Innovation',
    text: 'ZSB pushes boundaries — thematically, spatially, materially. Partners align themselves with an organization that values experimentation and refuses to treat art as decoration.',
  },
]

export const allocations: Allocation[] = [
  {
    title: 'Artist Fees & Production',
    text: 'Fair pay for artists whose transport costs alone can exceed their fees. Bolder proposals start with sustainable funding.',
  },
  {
    title: 'Graphic Design',
    text: 'Catalogues, posters, wayfinding, digital assets — all designed pro bono for five years.',
  },
  {
    title: 'PR & Communications',
    text: 'Press, photography, social content — the work that makes ZSB visible beyond Bucharest.',
  },
  {
    title: 'Web & Archive',
    text: 'A permanent, searchable record of contemporary Romanian sculpture. Built without budget since 2021.',
  },
  {
    title: 'Venue & Logistics',
    text: 'Exhibition spaces, insurance, lighting, installation — the invisible infrastructure behind every edition.',
  },
  {
    title: 'Curatorial Program',
    text: 'Research, artist selection, thematic development — the intellectual framework that gives each edition its identity.',
  },
]

export const whySculpturePoints: WhySculpturePoint[] = [
  {
    title: 'Permanence of Material',
    text: "Bronze, stone, steel, ceramic — sculpture is made from the materials of civilization itself. It doesn't fade, doesn't buffer, doesn't need a screen. It outlasts the artist, the gallery, the century.",
  },
  {
    title: 'Resistance to Reproduction',
    text: 'A sculpture cannot be fully experienced through a photograph or a screen. Its mass, its shadow, the way it occupies and transforms space — these resist digital replication in ways that flat images cannot.',
  },
  {
    title: 'Physical Presence',
    text: 'In an era of AI-generated imagery and virtual experiences, sculpture demands your body to be present. You walk around it, look up at it, touch it. This physicality is increasingly rare and increasingly valuable.',
  },
  {
    title: 'The Social Dimension',
    text: 'Public sculpture creates gathering points, conversation, civic identity. It turns a space into a place. ZSB amplifies this — bringing art out of galleries and into the city where it belongs.',
  },
]
