export interface Stat {
  label: string
  value: string
}

export const ZSB_STATS: readonly Stat[] = [
  { label: 'Editions', value: '5' },
  { label: 'Artists', value: '137' },
  { label: 'Works', value: '230' },
  { label: 'Visitors', value: '8,000+' },
] as const
