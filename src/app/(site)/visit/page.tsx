import { Navigation } from '@/components/Navigation/Navigation'
import { VisitSection } from '@/components/VisitSection/VisitSection'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Visit',
  description:
    'Plan your visit to Bucharest Sculpture Days at Combinatul Fondului Plastic — address, hours, transport, and amenities.',
  path: '/visit',
})

export default function VisitPage() {
  return (
    <>
      <Navigation activeId={null} />
      <main>
        <VisitSection />
      </main>
    </>
  )
}
