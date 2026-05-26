import { Navigation } from '@/components/Navigation/Navigation'

export default function EditionsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation activeId="editions" />
      {children}
    </>
  )
}
