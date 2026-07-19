'use client'

import config from '@root/sanity.config'
import { NextStudio } from 'next-sanity/studio'

export function Studio() {
  return <NextStudio config={config} />
}
