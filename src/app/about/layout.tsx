import { Navigation } from '@/components/Navigation/Navigation'

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation activeId="about" />
      {children}
    </>
  )
}
