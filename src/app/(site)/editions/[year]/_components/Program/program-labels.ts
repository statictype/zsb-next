import type { Lang } from '@/types/edition'

export interface ProgramCounts {
  total: number
  upcoming: number
  upcomingMatching: number
}

export interface ProgramLabels {
  heading: string
  count: (counts: ProgramCounts) => string
  events: (n: number) => string
  pastToggle: (showing: boolean, n: number) => string
  archiveClosed: string
  archiveOpen: string
  noMatches: string
  showAll: string
  ongoingRegion: string
  ongoing: string
  dayByDay: string
  filterGroup: string
  venue: string
  type: string
  reset: string
  newTab: string
  viewPoster: (name: string) => string
  facebook: string
  tickets: string
  freeEntry: string
  share: string
  copyLink: string
  linkCopied: string
  copyFailed: string
  copyFailedStatus: string
  prevEvent: string
  nextEvent: string
  stepCount: (position: number, total: number) => string
  stepperNav: string
  close: string
}

const en: ProgramLabels = {
  heading: 'Program',
  count: ({ total, upcoming, upcomingMatching }) =>
    upcoming === 0
      ? `${total} ${total === 1 ? 'event' : 'events'}`
      : upcomingMatching === upcoming
        ? `${upcoming} upcoming ${upcoming === 1 ? 'event' : 'events'}`
        : `${upcomingMatching} of ${upcoming} upcoming events`,
  events: (n) => `${n} ${n === 1 ? 'event' : 'events'}`,
  pastToggle: (showing, n) =>
    `${showing ? 'Hide' : 'Show'} ${n} past ${n === 1 ? 'event' : 'events'}`,
  archiveClosed: 'Browse the full program',
  archiveOpen: 'Hide the full program',
  noMatches: 'No events match these filters.',
  showAll: 'Show all events',
  ongoingRegion: 'Ongoing throughout the edition',
  ongoing: 'Ongoing',
  dayByDay: 'Day by day',
  filterGroup: 'Filter the program',
  venue: 'Venue',
  type: 'Type',
  reset: 'Reset',
  newTab: ' (opens in a new tab)',
  viewPoster: (name) => `View the poster for ${name} full size`,
  facebook: 'Event',
  tickets: 'Tickets',
  freeEntry: 'Free entry',
  share: 'Share',
  copyLink: 'Copy link',
  linkCopied: 'Link copied',
  copyFailed: "Couldn't copy",
  copyFailedStatus: "Couldn't copy the link — copy it from the address bar.",
  prevEvent: 'Previous event',
  nextEvent: 'Next event',
  stepCount: (position, total) => `${position} of ${total}`,
  stepperNav: 'Previous and next events',
  close: 'Close',
}

const roEvents = (n: number) => (n === 1 ? 'un eveniment' : `${n} ${roPlural(n, 'evenimente')}`)

function roPlural(n: number, word: string): string {
  const rest = n % 100
  return n >= 20 && (rest === 0 || rest >= 20) ? `de ${word}` : word
}

const ro: ProgramLabels = {
  heading: 'Program',
  count: ({ total, upcoming, upcomingMatching }) =>
    upcoming === 0
      ? roEvents(total)
      : upcomingMatching === upcoming
        ? upcoming === 1
          ? 'un eveniment viitor'
          : `${upcoming} ${roPlural(upcoming, 'evenimente')} viitoare`
        : `${upcomingMatching} din ${upcoming} evenimente viitoare`,
  events: roEvents,
  pastToggle: (showing, n) =>
    `${showing ? 'Ascunde' : 'Arată'} ${n === 1 ? 'evenimentul trecut' : `${n} ${roPlural(n, 'evenimente')} trecute`}`,
  archiveClosed: 'Vezi tot programul',
  archiveOpen: 'Ascunde programul',
  noMatches: 'Niciun eveniment nu corespunde filtrelor.',
  showAll: 'Arată toate evenimentele',
  ongoingRegion: 'Pe toată durata evenimentului',
  ongoing: 'Pe toată durata',
  dayByDay: 'Zi cu zi',
  filterGroup: 'Filtrează programul',
  venue: 'Locație',
  type: 'Categorie',
  reset: 'Resetează',
  newTab: ' (se deschide într-o filă nouă)',
  viewPoster: (name) => `Vezi afișul pentru ${name} la dimensiune completă`,
  facebook: 'Eveniment',
  tickets: 'Bilete',
  freeEntry: 'Intrare liberă',
  share: 'Distribuie',
  copyLink: 'Copiază linkul',
  linkCopied: 'Link copiat',
  copyFailed: 'Nu s-a putut copia',
  copyFailedStatus: 'Linkul nu a putut fi copiat — copiază-l din bara de adrese.',
  prevEvent: 'Evenimentul anterior',
  nextEvent: 'Evenimentul următor',
  stepCount: (position, total) => `${position} din ${total}`,
  stepperNav: 'Evenimentul anterior și următor',
  close: 'Închide',
}

export const PROGRAM_LABELS: Record<Lang, ProgramLabels> = { en, ro }
