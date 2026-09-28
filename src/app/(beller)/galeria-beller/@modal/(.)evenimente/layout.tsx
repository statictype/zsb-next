import { EventModalShell } from '@program/EventModalShell'

export default function EventModalLayout({ children }: { children: React.ReactNode }) {
  return <EventModalShell>{children}</EventModalShell>
}
