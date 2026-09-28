import { BellerFooter } from '@beller/_components/BellerFooter'
import { BellerNav } from '@beller/_components/BellerNav'
import { DraftAware } from '@/components/DraftAware/DraftAware'

export default function GaleriaBellerLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <>
      <BellerNav />
      {children}
      {modal}
      <DraftAware cached={(options) => <BellerFooter options={options} />} fallback={null} />
    </>
  )
}
