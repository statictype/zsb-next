import type { Metadata } from 'next'
import { VisitSection } from '@/components/VisitSection/VisitSection'

export const metadata: Metadata = {
  title: 'Visit',
  description:
    'Plan your visit to Bucharest Sculpture Days at Combinatul Fondului Plastic — address, hours, transport, and amenities.',
  alternates: { canonical: '/visit' },
}

export default function VisitPage() {
  return (
    <main>
      <VisitSection />
    </main>
  )
}
