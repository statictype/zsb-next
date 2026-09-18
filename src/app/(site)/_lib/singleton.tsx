import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ComponentType, ReactNode } from 'react'
import type { DynamicFetchOptions } from '@/sanity/lib/live'

export interface SingletonPage<P extends object> {
  load: (options: DynamicFetchOptions) => Promise<P | null>
  Shell: ComponentType<P>
  generateMetadata: () => Promise<Metadata>
  fallback?: ReactNode
  editionsNav?: boolean
}

export interface SingletonEntry {
  render: (options: DynamicFetchOptions) => Promise<ReactNode>
  generateMetadata: () => Promise<Metadata>
  fallback: ReactNode
  editionsNav: boolean
}

export function defineSingleton<P extends object>({
  load,
  Shell,
  generateMetadata,
  fallback = null,
  editionsNav = false,
}: SingletonPage<P>): SingletonEntry {
  return {
    generateMetadata,
    fallback,
    editionsNav,
    render: async (options) => {
      const props = await load(options)
      if (!props) notFound()
      return <Shell {...props} />
    },
  }
}
