import { BellerFooter } from '@beller/_components/BellerFooter'
import { BellerNav } from '@beller/_components/BellerNav'
import { DraftAware } from '@/components/DraftAware/DraftAware'

export default function ArtistLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BellerNav />
      {children}
      <DraftAware cached={(options) => <BellerFooter options={options} />} fallback={null} />
    </>
  )
}
