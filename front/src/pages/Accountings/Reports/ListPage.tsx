import { Button } from '@coco-ui/core'
import { ReportApi } from '@/api/ReportApi'
import { useCallback, useState } from 'react'
import List from './components/List'
import CreateReportModal from './modals/CreateReportModal'
import { useDataLoader } from '@scaleway/use-dataloader'

const ListPage = () => {
  const [openModal, setOpenModal] = useState(false)
  const { data, reload } = useDataLoader(['reports', 'all'], () => ReportApi.findAll())
  const handleCreate = useCallback(() => {
    setOpenModal(true)
  }, [])

  return (
    <div>
      <div className="flex flex-col items-center md:flex-row pb-2 mb-4 border-b">
        <h2 className="text-2xl flex-grow">Rapports</h2>
        <Button onClick={handleCreate}>Créer un rapport</Button>
        <CreateReportModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          onSubmitSuccess={() => {
            reload()
          }}
        />
      </div>
      {data ? (
        <div>
          <List reports={data} />
        </div>
      ) : null}
    </div>
  )
}

export default ListPage
