import { Navigation } from '@/components/Navigation/Navigation'

export default function ArtistsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation activeId="artists" />
      {children}
    </>
  )
}
