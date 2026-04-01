export interface Stat {
  label: string
  value: string
}

export const ZSB_STATS: readonly Stat[] = [
  { label: 'Editions', value: '5' },
  { label: 'Artists', value: '150+' },
  { label: 'Venues', value: '8' },
  { label: 'Visitors', value: '25K+' },
  { label: 'Works', value: '230' },
  { label: 'Materials', value: '23' },
] as const
